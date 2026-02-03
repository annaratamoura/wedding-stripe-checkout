import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { amount } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product: "prod_TuYH55zmMnwzij",
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: "https://SEUSITE.com/obrigada",
    cancel_url: "https://SEUSITE.com",
  });

  res.json({ url: session.url });
}
