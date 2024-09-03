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
exports.resend = exports.router = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
exports.router = (0, express_1.Router)();
const resend_1 = require("resend");
exports.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const index_1 = require("./index");
exports.router.route("/markets").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const d = yield axios_1.default.get("https://api.backpack.exchange/api/v1/markets");
        res.status(200).json(d.data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}));
exports.router.route("/depth").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol } = req.query;
    if (!symbol) {
        return res.status(400).json({ message: "symbol is required:(" });
    }
    //@ts-ignore
    let sm = symbol.toUpperCase();
    console.log(sm);
    try {
        const d = yield axios_1.default.get(`https://api.backpack.exchange/api/v1/depth?symbol=${sm}`);
        res.status(200).json(d.data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}));
exports.router.route("/trades").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol } = req.query;
    if (!symbol) {
        return res.status(400).json({ message: "symbol is required:(" });
    }
    //@ts-ignore
    let sm = symbol.toUpperCase();
    console.log(sm);
    try {
        const d = yield axios_1.default.get(`https://api.backpack.exchange/api/v1/trades?symbol=${sm}&limit=50`);
        res.status(200).json(d.data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}));
exports.router.route("/klines").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol, interval, startTime, endTime } = req.query;
    if (!symbol) {
        return res.status(400).json({ message: "symbol is required:(" });
    }
    //@ts-ignore
    let sm = symbol.toUpperCase();
    console.log(sm, interval);
    let url;
    if (interval == "Minute") {
        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${sm}&tsym=USD&limit=600&api_key=${process.env.API_KEY}`;
    }
    else if (interval == "Hour") {
        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${sm}&tsym=USD&limit=600&api_key=${process.env.API_KEY}`;
    }
    else {
        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${sm}&tsym=USD&limit=600&api_key=${process.env.API_KEY}`;
    }
    try {
        const d = yield axios_1.default.get(url);
        console.log(d.data);
        res.status(200).json(d.data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}));
exports.router.route("/logout").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("logging out:(");
    res.clearCookie("providerId", {
        sameSite: "none",
        secure: true,
        httpOnly: true,
    });
    res.status(200).json({ message: "logout successfully:)" });
}));
exports.router
    .route("/watchlist")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "user id required" });
    }
    try {
        const data = yield index_1.prisma.watchList.findMany({
            where: {
                //@ts-ignore
                userId,
            },
        });
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, name, symbol, userId } = req.body;
    try {
        const element = yield index_1.prisma.watchList.create({
            data: {
                image,
                name,
                symbol,
                userId: userId,
            },
        });
        res.status(200).json({ message: "saved in watchlist:)" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ message: "" });
    }
    try {
        yield index_1.prisma.watchList.delete({
            where: {
                //@ts-ignore
                id: id,
            },
        });
        res.status(202).json({ message: "deleted successfull:)" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}));
exports.router.route("/islogin").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const providerId = req.cookies.providerId;
    console.log(providerId);
    if (!providerId) {
        return res.status(400).json({ message: "need to login" });
    }
    const user = yield index_1.prisma.user.findFirst({ where: { providerId } });
    console.log(user);
    if (user) {
        return res
            .status(200)
            .json({ id: user.id, name: user.name, image: user.image });
    }
    res.status(400).json({ message: "need to login" });
}));
exports.router.route("/email").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.resend.emails.send({
        from: "onbording@resend.dev",
        to: ["blaganarpit@gmail.com"],
        subject: "Welcome to 100xJobs!",
        react: {},
        replyTo: "blaganarpit@gmail.com",
    });
    console.log("email sent");
}));
exports.router
    .route("/triggers")
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ message: "userId requried" });
    }
    try {
        yield index_1.prisma.notification.delete({
            where: {
                //@ts-ignore
                id,
            },
        });
        res.status(200).json({ message: "deleted successfully:" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}))
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "userId requried" });
    }
    try {
        const dd = yield index_1.prisma.notification.findMany({
            where: {
                //@ts-ignore
                userId,
            },
        });
        console.log(dd);
        res.status(200).json(dd);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, triggerName, image, symbol, userId, minPrice, maxPrice } = req.body;
    try {
        yield index_1.prisma.notification.create({
            data: {
                name,
                triggerName,
                image,
                symbol,
                userId,
                minPrice,
                maxPrice,
            },
        });
        res.status(200).json({ message: "created successfully:)" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}));
