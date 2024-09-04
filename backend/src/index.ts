import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { router } from "./route";
dotenv.config();
const app = express();
const FAIL_URL = "https://stock-alpha-ten.vercel.app/error";
const REDIRECT_URL = "https://stock-alpha-ten.vercel.app";
export const prisma = new PrismaClient();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://stock-alpha-ten.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: "https://stock-bzrd.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Log the profile to see its structure
      //console.log(accessToken, refreshToken);
      //console.log("Profile:", profile);
      const user = await prisma.user.findFirst({
        where: { providerId: profile.id },
      });
      if (!user) {
        try {
          await prisma.user.create({
            data: {
              name: profile.displayName,
              providerId: profile.id,
              image: profile._json.picture,
            },
          });
          console.log("user created");
        } catch (err) {
          console.log(err);
        }
      }

      done(null, profile); // Ensure profile is passed correctly
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.APP_ID as string,
      clientSecret: process.env.APP_SECRET as string,
      callbackURL: "https://stock-bzrd.onrender.com/auth/facebook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("Profile:", profile);

      const user = await prisma.user.findFirst({
        where: { providerId: profile.id },
      });
      if (!user) {
        try {
          await prisma.user.create({
            data: {
              name: profile.displayName,
              providerId: profile.id,
            },
          });
          console.log("user created");
        } catch (err) {
          console.log(err);
        }
      }
      done(null, profile);
    }
  )
);

passport.serializeUser((user: any, done) => {
  // Ensure user is defined and has an id
  if (user && user.id) {
    console.log("Serializing user:", user);
    done(null, user.id); // Store the user's Google ID in the session
  } else {
    done(new Error("User not found")); // Handle the case where user is undefined
  }
});

passport.deserializeUser(async (id: string, done) => {
  console.log("Deserializing user ID:", id);
  // Here you would typically fetch the user from your database
  const user = await prisma.user.findFirst({ where: { providerId: id } });
  console.log(id, user);
  done(null, user); // Replace with actual user fetching logic
});

// Routes
app.get("/", (req, res) => {
  res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: FAIL_URL }),
  async (req, res) => {
    // Successful authentication, redirect to your desired route
    //Now, do DB stuff here
    console.log("session", req.session);
    const user = await prisma.user.findFirst({
      where: {
        //@ts-ignore
        providerId: req.session?.passport?.user as string,
      },
    });
    console.log(user);
    res.cookie("providerId", user?.providerId, {
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });
    res.redirect(REDIRECT_URL);
  }
);
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: FAIL_URL }),
  async (req, res) => {
    console.log("session", req.session, req.user);
    const user = await prisma.user.findFirst({
      where: {
        //@ts-ignore
        providerId: req.session?.passport?.user as string,
      },
    });
    console.log(user);
    res.cookie("providerId", user?.providerId, {
      sameSite: "none",
      httpOnly: true,
    });
    res.redirect(REDIRECT_URL);
  }
);

app.get("/stocks", async (req, res) => {
  try {
    const d = await axios.get(
      `https://price-indexer.workers.madlads.com/?ids=solana,usd-coin,pyth-network,jito-governance-token,tether,bonk,helium,helium-mobile,bitcoin,ethereum,dogwifcoin,jupiter-exchange-solana,parcl,render-token,tensor,wormhole,wen-4,cat-in-a-dogs-world,book-of-meme,raydium,hivemapper,kamino,drift-protocol,nyan,jeo-boden,habibi-sol,io,zeta,mother-iggy,sanctum-2,shuffle-2,pepe,shiba-inu,chainlink,uniswap,ondo-finance,holograph,starknet,matic-network,mon-protocol,blur,worldcoin-wld,polyhedra-network,unagi-token,layerzero,aave,lido-dao,matr1x`
    );
    //rows: symbol,name,exchange,assetType,ipoDate,delistingDate,status
    console.log(d.data);
    // const rows = d.data.trim().split("\n");

    // // Split each row by comma to get individual fields
    // const dataArray = rows.map((row: any) => row.split(","));
    // console.log(dataArray);
    // res.status(200).json({ arr: dataArray });
    res.status(200).json(d.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

app.use("/api", router);

app.listen(process.env.PORT || 9000, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
