export default async function handler(req, res) {
  const amount = Number(req.query.amount);

  if (!amount || amount < 1) {
    return res.status(400).send("Invalid amount");
  }

  const response = await fetch(
    "https://wedding-stripe-checkout.vercel.app/api/create-checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }
  );

  const data = await response.json();

  res.redirect(302, data.url);
}
