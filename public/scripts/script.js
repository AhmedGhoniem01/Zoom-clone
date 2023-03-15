//note that at the html page when adding the script src, write the relative path from the public folder
//node already knows to search in the public folder

//Creating an html grid to append the video to it
let videoGrid = document.getElementById('video-grid')
//creating a video instance and muting it beacause we don't want to hear ourselves
const myVideo = document.createElement('video');
myVideo.muted = true;

//Getting our video and audio stream from browser
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then( (stream) => {
    addVideoToStream(myVideo, stream)
});

//binding the video element to the stream
const addVideoToStream = (video, stream) => {
    video.srcObject = stream;
    //adding eventlistener to play the video when all of its meta data is loaded
    video.addEventListener('loadmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}