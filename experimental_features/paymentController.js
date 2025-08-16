// Stripe Payment Integration (Working)
// NOTE: Used official documentation to implement
// Still learning how to write this from scratch

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe works in paise (for INR) or cents (USD)
      currency: "usd", // or "inr"
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    next(err); // global error handler
  }
};
