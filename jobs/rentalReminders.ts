import cron from 'node-cron';

// Simulate a database of rentals
const MOCK_DB_RENTALS = [
  { id: '101', clientName: 'Alice Smith', clientEmail: 'alice@example.com', endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), status: 'Active' }, // Due tomorrow
  { id: '102', clientName: 'Bob Jones', clientEmail: 'bob@example.com', endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Active' }, // Due in 3 days
];

export const startRentalReminderJob = () => {
  console.log('Starting rental reminder background job...');

  // Run every minute for demonstration purposes (in production, run daily e.g., '0 9 * * *')
  cron.schedule('* * * * *', async () => {
    await runRentalRemindersNow();
  });
};

export const runRentalRemindersNow = async () => {
  console.log(`[Job: rentalReminders] Running at ${new Date().toISOString()}`);
  
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Find rentals due tomorrow
    const upcomingReturns = MOCK_DB_RENTALS.filter(rental => {
      if (rental.status !== 'Active') return false;
      const endDate = new Date(rental.endDate);
      // Check if endDate is within the next 24 hours
      return endDate > now && endDate <= tomorrow;
    });

    if (upcomingReturns.length === 0) {
      console.log('[Job: rentalReminders] No upcoming returns found for tomorrow.');
      return;
    }

    console.log(`[Job: rentalReminders] Found ${upcomingReturns.length} upcoming returns.`);

    // Send emails
    for (const rental of upcomingReturns) {
      await sendReminderEmail(rental);
    }

    console.log('[Job: rentalReminders] Completed successfully.');
  } catch (error) {
    console.error('[Job: rentalReminders] Error running job:', error);
  }
};

const sendReminderEmail = async (rental: any) => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`
    ==================================================
    EMAIL SENT
    To: ${rental.clientEmail}
    Subject: Reminder: Your rental return is due tomorrow
    
    Hi ${rental.clientName},
    
    This is a friendly reminder that your vehicle rental (ID: ${rental.id}) is due for return tomorrow.
    Please ensure the vehicle is returned on time and with the agreed fuel level.
    
    Thank you for choosing RentFlow!
    ==================================================
  `);
};
