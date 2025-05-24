const cron = require('node-cron');
const { fork } = require('child_process');

// Setup task to cancel expired pending bookings
const setupBookingExpirationTask = () => {
  // Run every 5 minutes (reduced frequency to avoid overloading)
  cron.schedule('*/5 * * * *', () => {
    console.log('Running booking expiration task:', new Date().toISOString());
    const worker = fork('./workers/bookingExpirationWorker.js');

    worker.on('message', (message) => {
      if (message.success) {
        console.log(`Auto-canceled ${message.count} expired bookings`);
      } else {
        console.error('Booking expiration task failed:', message.error);
      }
    });

    worker.on('error', (error) => {
      console.error('Error in booking expiration worker:', error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Booking expiration worker exited with code ${code}`);
      }
    });
  });
};

// Setup task to mark bookings as completed after trip ends
const setupBookingCompletionTask = () => {
  // Run every hour
  cron.schedule('*/1 * * * *', () => {
    console.log('Running booking completion task:', new Date().toISOString());
    const worker = fork('./workers/bookingCompletionWorker.js');

    worker.on('message', (message) => {
      if (message.success) {
        console.log(`Updated ${message.count} bookings to completed status`);
      } else {
        console.error('Booking completion task failed:', message.error);
      }
    });

    worker.on('error', (error) => {
      console.error('Error in booking completion worker:', error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Booking completion worker exited with code ${code}`);
      }
    });
  });
};

module.exports = {
  setupBookingExpirationTask,
  setupBookingCompletionTask
};
