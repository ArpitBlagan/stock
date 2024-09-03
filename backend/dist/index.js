"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const route_1 = require("./route");
dotenv_1.default.config();
const app = (0, express_1.default)();
const FAIL_URL = "http://localhost:5173/error";
const REDIRECT_URL = "http://localhost:5173";
exports.prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    // Log the profile to see its structure
    //console.log(accessToken, refreshToken);
    //console.log("Profile:", profile);
    const user = yield exports.prisma.user.findFirst({
        where: { providerId: profile.id },
    });
    if (!user) {
        try {
            yield exports.prisma.user.create({
                data: {
                    name: profile.displayName,
                    providerId: profile.id,
                    image: profile._json.picture,
                },
            });
            console.log("user created");
        }
        catch (err) {
            console.log(err);
        }
    }
    done(null, profile); // Ensure profile is passed correctly
})));
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: "/auth/facebook/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("Profile:", profile);
    const user = yield exports.prisma.user.findFirst({
        where: { providerId: profile.id },
    });
    if (!user) {
        try {
            yield exports.prisma.user.create({
                data: {
                    name: profile.displayName,
                    providerId: profile.id,
                },
            });
            console.log("user created");
        }
        catch (err) {
            console.log(err);
        }
    }
    done(null, profile);
})));
passport_1.default.serializeUser((user, done) => {
    // Ensure user is defined and has an id
    if (user && user.id) {
        console.log("Serializing user:", user);
        done(null, user.id); // Store the user's Google ID in the session
    }
    else {
        done(new Error("User not found")); // Handle the case where user is undefined
    }
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Deserializing user ID:", id);
    // Here you would typically fetch the user from your database
    const user = yield exports.prisma.user.findFirst({ where: { providerId: id } });
    console.log(id, user);
    done(null, user); // Replace with actual user fetching logic
}));
// Routes
app.get("/", (req, res) => {
    res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
});
app.get("/auth/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
app.get("/auth/facebook", passport_1.default.authenticate("facebook"));
app.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: FAIL_URL }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Successful authentication, redirect to your desired route
    //Now, do DB stuff here
    console.log("session", req.session);
    const user = yield exports.prisma.user.findFirst({
        where: {
            //@ts-ignore
            providerId: (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.passport) === null || _b === void 0 ? void 0 : _b.user,
        },
    });
    console.log(user);
    res.cookie("providerId", user === null || user === void 0 ? void 0 : user.providerId, {
        sameSite: "none",
        httpOnly: true,
        secure: true,
    });
    res.redirect(REDIRECT_URL);
}));
app.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", { failureRedirect: FAIL_URL }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("session", req.session, req.user);
    const user = yield exports.prisma.user.findFirst({
        where: {
            //@ts-ignore
            providerId: (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.passport) === null || _b === void 0 ? void 0 : _b.user,
        },
    });
    console.log(user);
    res.cookie("providerId", user === null || user === void 0 ? void 0 : user.providerId, {
        sameSite: "none",
        httpOnly: true,
    });
    res.redirect(REDIRECT_URL);
}));
app.get("/stocks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const d = yield axios_1.default.get(`https://price-indexer.workers.madlads.com/?ids=solana,usd-coin,pyth-network,jito-governance-token,tether,bonk,helium,helium-mobile,bitcoin,ethereum,dogwifcoin,jupiter-exchange-solana,parcl,render-token,tensor,wormhole,wen-4,cat-in-a-dogs-world,book-of-meme,raydium,hivemapper,kamino,drift-protocol,nyan,jeo-boden,habibi-sol,io,zeta,mother-iggy,sanctum-2,shuffle-2,pepe,shiba-inu,chainlink,uniswap,ondo-finance,holograph,starknet,matic-network,mon-protocol,blur,worldcoin-wld,polyhedra-network,unagi-token,layerzero,aave,lido-dao,matr1x`);
        //rows: symbol,name,exchange,assetType,ipoDate,delistingDate,status
        console.log(d.data);
        // const rows = d.data.trim().split("\n");
        // // Split each row by comma to get individual fields
        // const dataArray = rows.map((row: any) => row.split(","));
        // console.log(dataArray);
        // res.status(200).json({ arr: dataArray });
        res.status(200).json(d.data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}));
app.use("/api", route_1.router);
app.listen(process.env.PORT || 9000, () => {
    console.log(`listening on port ${process.env.PORT}`);
});
