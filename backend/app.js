require('dotenv').config()
const express = require('express')
const cors = require("cors")
const fileUpload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');

// const cluster = require("cluster");
// const totalCPUs = require('os').cpus().length;


const connectDB = require('./config/db')

const authRoute = require("./routes/auth.js")
const userRoute = require("./routes/users.js")
const postRoute = require("./routes/posts.js")
const chatRoute = require("./routes/chats.js")
const messageRoute = require("./routes/messages.js")
const notificationRoute = require("./routes/notifications.js")
const exploreRoute = require("./routes/explore.js")


const errorHandler = require('./middleware/errorMiddleware.js')


connectDB()

// if (cluster.isMaster) {

//     console.log(`Total Number of CPU Counts is ${totalCPUs}`);

//     for (var i = 0; i < totalCPUs; i++) {
//         cluster.fork();
//     }
//     cluster.on("online", worker => {
//         console.log(`Worker Id is ${worker.id} and PID is ${worker.process.pid}`);
//     });
//     cluster.on("exit", worker => {
//         console.log(`Worker Id ${worker.id} and PID is ${worker.process.pid} is offline`);
//         console.log("Let's fork new worker!");
//         cluster.fork();
//     });
// }
// else {


const app = express()

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})
const io = require("socket.io")(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
})

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(fileUpload({
    useTempFiles: true
}));

app.use(mongoSanitize());

app.use(cors({
    origin: process.env.FRONTEND_URL
}))


app.get('/', (req, res) => {
    res.json('hii')
})

app.use("/auth", authRoute)
app.use("/user", userRoute)
app.use("/post", postRoute)
app.use("/chat", chatRoute)
app.use("/message", messageRoute)
app.use("/notification", notificationRoute)
app.use("/explore", exploreRoute)


app.use(errorHandler)

io.on('connection', (socket) => {
    socket.on("user-join", (user) => {
        socket.join(user.id)
        socket.emit("user-connected")
    })

    socket.on("join-room", room => socket.join(room))
    socket.on("typing", room => socket.in(room).emit("typing"))
    socket.on("stop typing", room => socket.in(room).emit("stop typing"))

    socket.on("new message", newMessage => {
        var chat = newMessage.chat;

        if (!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessage.sender._id) return;
            socket.in(user._id).emit("message received", newMessage);
        })
    });

    socket.on("notification received", userId => {
        socket.in(userId).emit("notification received");
    })

})

// }