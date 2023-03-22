//note that at the html page when adding the script src, write the relative path from the public folder
//node already knows to search in the public folder

//importing socket.io
let socket = io('/');

//importing peerJs and passing options
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

//Creating an html grid to append the video to it
let videoGrid = document.getElementById('video-grid')
//creating a video instance and muting it beacause we don't want to hear ourselves
const myVideo = document.createElement('video');
myVideo.muted = true;
let myVideoStream;

//Getting our video and audio stream from browser
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then( (stream) => {
    myVideoStream = stream;
    addVideoToStream(myVideo, stream);
});

//We will distinguish a new user by its peer id not socketId
//when a new user types '/' to connect to localhost, the server creates a room-id for him and redirects the host to it 
//at the host, a new peer connection is opened 
//so when a peer connection is opened, we say that a new host has joined the created room or te room typed in the url and send the peer-id
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

peer.on('call', (call) => {
    //when someone calls - answer the call by sending your stream
    call.answer(myVideoStream); 
    const UserVideo = document.createElement('video');
    //take the stream and append it to the video
    call.on('stream', (userVideoStream) => {
        addVideoToStream(UserVideo, userVideoStream);
    });
});

//when new user is connected try to call him and rvc his stream
socket.on('user-connected', (userId) => {
    connectToUser(userId, myVideoStream);
})

const connectToUser = (userId, myVideoStream) => {
    //when someone connects to us we try to call him with his id and give him our stream
    const call = peer.call(userId, myVideoStream);
    //we created a video element to our new host
    const UserVideo = document.createElement('video');
    //we the new host sends us his stream we will append it to the video element we created and send it to appendVideoToStream function
    call.on('stream', (userVideoStream) => {
        addVideoToStream(UserVideo, userVideoStream);
    });
}

//binding the video element to the stream
const addVideoToStream = (video, stream) => {
    video.srcObject = stream;
    //adding eventlistener to play the video when all of its meta data is loaded
    video.addEventListener('loadmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

