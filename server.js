const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);

//require peer server to encapsulate our http server and send our audio and video
//sockets allow sending messages only that's why we use webRtc to share our audio&video stream
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
})

const {v4 :uuidv4} = require('uuid');
const port = 3030;

//Setting view engine
app.set('view engine', 'ejs');

//telling express where to find static files
app.use(express.static('public'));

//using peer middleware
app.use('/peerjs', peerServer);

//listening on port for requests
server.listen(port, () => {
    console.log('Server connected on port: ', port);
});
//http server must listen for requests

//we want ot create our first view and render it
//we have to install ejs first and use it
//and then when rendering a page, node will auto search in the views folder 

app.get('/', (req, res) => {
    // res.render('room');
    let uuid = uuidv4();
    res.redirect(`/${uuid}`);
})

//to give each room a unique id we will use uuid pkg
//we heading to the home page we will crete a uuid for our room then get redirected to a url containing this uuid we just created 

app.get('/:roomId', (req, res) => {
    let uuid = req.params.roomId;
    res.render('room', {roomId: uuid});
})

//When new host connects, it's joined to a room to which it tries to connect which is originally passed in the url
//after it connects to the room, it sends a message to all other connected hosts to let them now that a new host joined
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        console.log(`${socket.id} Joined room ${roomId}`);
        //emit to all other hosts that a new host has joined and send his peer id
        socket.to(roomId).emit('user-connected', userId);
    })
})