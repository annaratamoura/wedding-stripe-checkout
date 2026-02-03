const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // CORS (para chamadas via Framer, se necessário)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const amount = Number(req.query.amount);

    if (!Number.isFinite(amount) || amount < 1) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product: "prod_TuYH55zmMnwzij",
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: "https://adventureinbrazil.framer.website/contribuicao?status=success",
      cancel_url: "https://adventureinbrazil.framer.website/contribuicao?status=cancel",
    });

    // REDIRECT direto para o Stripe Checkout
    return res.redirect(302, session.url);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Stripe error" });
  }
};
