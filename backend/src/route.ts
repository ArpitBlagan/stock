import axios from "axios";
import { Response, Router, Request } from "express";
export const router = Router();
import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY);
import { prisma } from "./index";
router.route("/markets").get(async (req: Request, res: Response) => {
  try {
    const d = await axios.get("https://api.backpack.exchange/api/v1/markets");
    res.status(200).json(d.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.route("/depth").get(async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) {
    return res.status(400).json({ message: "symbol is required:(" });
  }
  //@ts-ignore
  let sm = symbol.toUpperCase();
  console.log(sm);
  try {
    const d = await axios.get(
      `https://api.backpack.exchange/api/v1/depth?symbol=${sm}`
    );
    res.status(200).json(d.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.route("/trades").get(async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) {
    return res.status(400).json({ message: "symbol is required:(" });
  }
  //@ts-ignore
  let sm = symbol.toUpperCase();
  console.log(sm);
  try {
    const d = await axios.get(
      `https://api.backpack.exchange/api/v1/trades?symbol=${sm}&limit=50`
    );
    res.status(200).json(d.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.route("/klines").get(async (req, res) => {
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
  } else if (interval == "Hour") {
    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${sm}&tsym=USD&limit=600&api_key=${process.env.API_KEY}`;
  } else {
    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${sm}&tsym=USD&limit=600&api_key=${process.env.API_KEY}`;
  }
  try {
    const d = await axios.get(url);
    console.log(d.data);
    res.status(200).json(d.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.route("/logout").get(async (req, res) => {
  console.log("logging out:(");
  res.clearCookie("providerId", {
    sameSite: "none",
    secure: true,
    httpOnly: true,
  });
  res.status(200).json({ message: "logout successfully:)" });
});

router
  .route("/watchlist")
  .get(async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "user id required" });
    }
    try {
      const data = await prisma.watchList.findMany({
        where: {
          //@ts-ignore
          userId,
        },
      });
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  })
  .post(async (req, res) => {
    const { image, name, symbol, userId } = req.body;
    try {
      const element = await prisma.watchList.create({
        data: {
          image,
          name,
          symbol,
          userId: userId,
        },
      });
      res.status(200).json({ message: "saved in watchlist:)" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "" });
    }
    try {
      await prisma.watchList.delete({
        where: {
          //@ts-ignore
          id: id,
        },
      });
      res.status(202).json({ message: "deleted successfull:)" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  });

router.route("/islogin").get(async (req, res) => {
  const providerId = req.cookies.providerId;
  console.log(providerId);
  if (!providerId) {
    return res.status(400).json({ message: "need to login" });
  }
  const user = await prisma.user.findFirst({ where: { providerId } });
  console.log(user);
  if (user) {
    return res
      .status(200)
      .json({ id: user.id, name: user.name, image: user.image });
  }
  res.status(400).json({ message: "need to login" });
});

router.route("/email").get(async (req, res) => {
  await resend.emails.send({
    from: "onbording@resend.dev",
    to: ["blaganarpit@gmail.com"],
    subject: "Welcome to 100xJobs!",
    react: {},
    replyTo: "blaganarpit@gmail.com",
  });
  console.log("email sent");
});

router
  .route("/triggers")
  .delete(async (req, res) => {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "userId requried" });
    }
    try {
      await prisma.notification.delete({
        where: {
          //@ts-ignore
          id,
        },
      });
      res.status(200).json({ message: "deleted successfully:" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  })
  .get(async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId requried" });
    }
    try {
      const dd = await prisma.notification.findMany({
        where: {
          //@ts-ignore
          userId,
        },
      });
      console.log(dd);
      res.status(200).json(dd);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  })
  .post(async (req, res) => {
    const { name, triggerName, image, symbol, userId, minPrice, maxPrice } =
      req.body;
    try {
      await prisma.notification.create({
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
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  });
