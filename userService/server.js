const app = require('./src/app');
const db = require('./src/db/index');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
  console.log('Received kill signal, shutting down gracefully...');

  server.close(() => {
    console.log('Closed out remaining connections.');
    db.pool.end(() => {
      console.log('Closed DB pool.');
      process.exit(0);
    });
  });

  // Force shutdown if still stuck after 10 seconds:
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}
