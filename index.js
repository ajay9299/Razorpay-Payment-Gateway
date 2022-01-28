const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT || 4040;

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
dotenv.config();

// Add your keys in .env file
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.get("/", async (req, res) => {
  res.render("razorpay.ejs");
});

app.post("/order", async (req, res) => {
  const options = {
    amount: 50000, // amount in the smallest currency unit
    currency: "INR",
  };
  const order = await razorpay.orders.create(options);
  if (!order) {
    res.status(400).json({
      msg: "Something went wrong",
    });
  }

  res.status(200).json(order);
});

app.post("/is-order-complete", async (req, res) => {
  const payment = await razorpay.payments.fetch(req.body.razorpay_payment_id);
  if (!payment.status === "captured") {
    res.status(400).json({
      payment: "rejected",
    });
  }
  res.status(200).render("razorpay.ejs");
});

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
