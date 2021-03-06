const app = require('./app');
const connectDB = require('./database');
const { ConnectMessage, ConnectNotification } = require('./src/socket');
const { client } = require('./src/services/redis');
const port = process.env.PORT || 5000;

connectDB();

(async () => {
	await client.connect();
})();

const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

ConnectMessage(server);
ConnectNotification(server);

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	console.log(err.name, err.message, err);
	process.exit(1);
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});
