const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Simple health check
app.get("/", (req, res) => {
  res.json({ ok: true, service: "RampPay backend" });
});

// Fake Adyen session endpoint
app.post("/api/adyen/possdk/session", (req, res) => {
  const { amount, currency } = req.body || {};

  if (typeof amount !== "number" || !currency) {
    return res.status(400).json({ error: "amount (number) and currency are required" });
  }

  const fakeSession = {
    sessionId: "test-session-" + Date.now(),
    sessionData: "test-session-data-xyz",
    merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT || "TestMerchant",
    amount: { value: amount, currency },
    countryCode: "US",
    posDeviceId: "RAMPAY-DEMO-DEVICE"
  };

  res.json(fakeSession);
});

// Fake refund endpoint
app.post("/api/adyen/refunds", (req, res) => {
  const { originalTransactionId, amount, currency } = req.body || {};
  console.log("Refund requested", { originalTransactionId, amount, currency });

  // In future: actually call Adyen here.
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`RampPay backend listening on port ${PORT}`);
});
