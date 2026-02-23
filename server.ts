import express from "express";
import { createServer as createViteServer } from "vite";
import { startRentalReminderJob } from "./jobs/rentalReminders";
import { MOCK_VEHICLES, MOCK_RENTALS, MOCK_ALERTS } from "./constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAYMENT_METHOD_REGEX = /^pm_[A-Za-z0-9]+$/;

type BookingConfirmPayload = {
  email?: unknown;
  clientName?: unknown;
  vehicle?: unknown;
  dates?: unknown;
  total?: unknown;
  saveCard?: unknown;
  paymentMethodId?: unknown;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Start background jobs
  startRentalReminderJob();

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Data endpoints
  app.get("/api/vehicles", (req, res) => {
    res.json(MOCK_VEHICLES);
  });

  app.get("/api/rentals", (req, res) => {
    res.json(MOCK_RENTALS);
  });

  app.get("/api/alerts", (req, res) => {
    res.json(MOCK_ALERTS);
  });

  app.post("/api/jobs/trigger", async (req, res) => {
    console.log("Manual trigger of rental reminders job...");
    try {
      const { runRentalRemindersNow } = await import('./jobs/rentalReminders');
      await runRentalRemindersNow();
      res.json({ success: true, message: "Job executed successfully" });
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  app.post("/api/bookings/confirm", (req, res) => {
    const { email, clientName, vehicle, dates, total, saveCard, paymentMethodId } =
      (req.body ?? {}) as BookingConfirmPayload;

    if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email)) {
      res.status(400).json({ success: false, message: "A valid email is required." });
      return;
    }
    if (!isNonEmptyString(clientName)) {
      res.status(400).json({ success: false, message: "Client name is required." });
      return;
    }
    if (!isNonEmptyString(vehicle)) {
      res.status(400).json({ success: false, message: "Vehicle is required." });
      return;
    }
    if (!isNonEmptyString(dates)) {
      res.status(400).json({ success: false, message: "Booking dates are required." });
      return;
    }

    const parsedTotal =
      typeof total === "number" ? total : typeof total === "string" ? Number(total) : NaN;
    if (!Number.isFinite(parsedTotal) || parsedTotal <= 0) {
      res.status(400).json({ success: false, message: "Total amount must be greater than 0." });
      return;
    }

    if (!isNonEmptyString(paymentMethodId) || !PAYMENT_METHOD_REGEX.test(paymentMethodId)) {
      res.status(400).json({
        success: false,
        message: "A valid Stripe payment method is required.",
      });
      return;
    }

    const shouldSaveCard = Boolean(saveCard);
    
    console.log("==================================================");
    console.log("CONFIRMATION EMAIL SENT");
    console.log(`To: ${email}`);
    console.log(`Subject: Your RentFlow Booking Confirmation`);
    console.log("");
    console.log(`Hi ${clientName},`);
    console.log("");
    console.log(`Your booking for the ${vehicle} is confirmed!`);
    console.log(`Dates: ${dates}`);
    console.log(`Total Amount: $${parsedTotal.toFixed(2)}`);
    console.log(`Payment Method ID: ${paymentMethodId}`);
    if (shouldSaveCard) {
      console.log("Note: Customer requested to save card for future payments.");
    }
    console.log("");
    console.log("Thank you for choosing RentFlow!");
    console.log("==================================================");

    res.json({ success: true, message: "Confirmation email sent" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
