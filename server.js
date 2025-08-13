const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/db/db');
const setupSocketServer = require("./src/socket/socket.server")

const httpServer = http.createServer(app);

setupSocketServer(httpServer)
// Connect to the database
connectDB();

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
})