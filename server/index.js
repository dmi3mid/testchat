const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient } = require('mongodb');
const cors = require('cors');


const app = express();
const httpServer = http.createServer(app);
app.use(cors());
app.use(express.json());
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5174",
        methods: ["GET", "POST"]
    }
});
const client = new MongoClient("mongodb://localhost:27017/");
const web_messages = client.db("testchat").collection("web_messages");
const keys = client.db("testchat").collection("keys");

async function start() {
    try {
        httpServer.listen(2300, () => {
            console.log("Http server is running");
        });
        await client.connect();
        console.log("Database is connected");
    } catch (error) {
        console.log(error);
    }
}
start();

app.get('/getMessages', async (req, res) => {
    try {
        const messagesData = await web_messages.find({}).limit(30).toArray();
        res.send(JSON.stringify(messagesData));
    } catch (error) {
        console.log(error);
    }
});
app.get('/getKey', async (req, res) => {
    try {
        const keysData = await keys.find({}).toArray();
        res.send(JSON.stringify(keysData));
    } catch (error) {
        console.log(error);
    }
})
app.post('/auth', async (req, res) => {
    try {
        const { token } = req.body;
        console.log(token);
        await keys.insertOne({ token });
    } catch (error) {
        console.log(error);
    }
});

io.on('connection', async (socket) => {
    socket.on('user-message', async (data) => {
        const parsedData = JSON.parse(data);
        await web_messages.insertOne(parsedData);
    });
});