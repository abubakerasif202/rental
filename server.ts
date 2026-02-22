import express from "express";
import { createServer as createViteServer } from "vite";
import { startRentalReminderJob } from "./jobs/rentalReminders";

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

  app.post("/api/jobs/trigger", async (req, res) => {
    console.log("Manual trigger of rental reminders job...");
    try {
      // For demonstration, we just call the logic directly
      const { runRentalRemindersNow } = await import('./jobs/rentalReminders');
      await runRentalRemindersNow();
      res.json({ success: true, message: "Job executed successfully" });
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  app.post("/api/bookings/confirm", (req, res) => {
    const { email, clientName, vehicle, dates, total, saveCard } = req.body;
    
    console.log("==================================================");
    console.log("CONFIRMATION EMAIL SENT");
    console.log(`To: ${email}`);
    console.log(`Subject: Your RentFlow Booking Confirmation`);
    console.log("");
    console.log(`Hi ${clientName},`);
    console.log("");
    console.log(`Your booking for the ${vehicle} is confirmed!`);
    console.log(`Dates: ${dates}`);
    console.log(`Total Amount: $${total}`);
    if (saveCard) {
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
