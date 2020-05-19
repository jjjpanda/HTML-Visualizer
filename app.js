var size = 1024;

const toLog = function(value, min, max){
    var exp = (value-min) / (max-min);
return min * Math.pow(max/min, Math.sqrt(exp));
}

var soundNotAllowed = function(error) {
console.log(error);
}

var soundAllowed = function(stream) {
var audioContext = new AudioContext();
var src = audioContext.createMediaStreamSource(stream);
var analyser = audioContext.createAnalyser();

var canvas = document.getElementById("visualizer");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

window.addEventListener("resize", resize);

src.connect(analyser);
analyser.fftSize = size;

var bufferLength = analyser.frequencyBinCount;

var dataArray = new Uint8Array(bufferLength);

var width = canvas.width;
var height = canvas.height;

var barWidth = Math.floor(width / bufferLength);
var barHeight;
var x = 0;

function resize(event){
    canvas = document.getElementById("visualizer");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    barWidth = (width / bufferLength);
}

function render() {
    requestAnimationFrame(render);

    x = 0;

    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0,0, width, height);
    ctx.fillStyle = "#0000";
    ctx.fillRect(0, 0, width, height);          

    for (var i = 0; i < bufferLength; i++) {
    var logIndex, low, high, lv, hv, w, v
    logIndex = toLog(i, 1, bufferLength)
    low = Math.floor(logIndex)
    high = Math.ceil(logIndex)
    lv = dataArray[low]
    hv = dataArray[high]
    w = (logIndex - low) / (high - low)
    v = lv + (hv-lv)*w

    barHeight = v/666*height;
    //barHeight = dataArray[i]/724*height;
    
    //ctx.font = "30px Arial";
    //ctx.fillText(bufferLength+" "+width+" "+height,10,50);

    ctx.fillStyle = "#fff";
    ctx.fillRect(x, height/2 - barHeight, barWidth, barHeight);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, height/2, barWidth, barHeight);
    x += barWidth + 1;
    }
}
render();
}
navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);