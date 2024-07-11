const twentyFive = document.getElementById('25');
const fifty = document.getElementById('50');
const seventyFive = document.getElementById('75');
const oneHundred = document.getElementById('100');
const timer = document.getElementById('timer');
const start = document.getElementById('start');
const title = document.getElementById('title')

let startStatus = false;
let startTime, elapsedTime = 0, totalMilliseconds;
let firstTime = true
let restStatus = false;
let msForSound;
let sessionTimeout;

const sessionAudio = new Audio('sound/session.mp3');
sessionAudio.playbackRate = 1.5;

const startAudio = new Audio('sound/start-sound.mp3');
const pauseAudio = new Audio('sound/start-sound.mp3');
startAudio.playbackRate = 5.0;
pauseAudio.playbackRate = 5.0;

const button1Audio = new Audio('sound/button-sound.mp3');
const button2Audio = new Audio('sound/button-sound.mp3');
const button3Audio = new Audio('sound/button-sound.mp3');
const button4Audio = new Audio('sound/button-sound.mp3');
button1Audio.playbackRate = 5.0;
button2Audio.playbackRate = 5.0;
button3Audio.playbackRate = 5.0;
button4Audio.playbackRate = 5.0;

const buttonAudioList = [button1Audio, button2Audio, button3Audio, button4Audio];

const buttonList = [twentyFive, fifty, seventyFive, oneHundred];
const timeList = ["25:00", "50:00", "75:00", "100:00"];
const minList = [25, 50, 75, 100];

let min = 0;
let rest = 0;
let sec = 60;

buttonList.forEach((button, index) => {
    button.addEventListener("click", function() {
        clearInterval(sessionTimeout);
        buttonAudioList[index].play();
        timer.innerHTML = timeList[index];
        min = minList[index];
        sec = 0;
        start.classList.add('hover:bg-gray-600');
        start.classList.remove('hover:bg-gray-800');
        start.classList.add('bg-slate-100');
        start.classList.remove('bg-gray-600');
        start.classList.add('text-gray-600');
        start.classList.remove('text-slate-100');
        startStatus = false;
        startTime = null;
        elapsedTime = 0;
        totalMilliseconds = min * 60000;
        firstTime = true
        restStatus = true;
        start.innerHTML = "START";
    });
});

function updateTimer() {
    if (startStatus) {
        const now = Date.now();
        const deltaTime = now - startTime;
        elapsedTime += deltaTime;
        startTime = now;

        const remainingTime = totalMilliseconds - elapsedTime;
        msForSound = remainingTime
        const remainingMinutes = Math.floor(remainingTime / 60000);
        const remainingSeconds = Math.floor((remainingTime % 60000) / 1000) ;

        timer.innerHTML = (remainingMinutes < 10 ? "0" : "") + remainingMinutes + ":" + (remainingSeconds < 10 ? "0" : "") + (remainingSeconds === 60? "00" : remainingSeconds);

        if (remainingTime <= 0) {
            if(restStatus){
                start.classList.add('hover:bg-gray-600');
                start.classList.remove('hover:bg-gray-800');
                start.classList.add('bg-slate-100');
                start.classList.remove('bg-gray-600');
                start.classList.add('text-gray-600');
                start.classList.remove('text-slate-100');
                startStatus = false;
                startTime = null;
                elapsedTime = 0;
                rest = min / 5;
                totalMilliseconds = rest * 60000;
                firstTime = true;
                restStatus = false;
                timer.innerHTML = (rest < 10? "0" : "") + rest + ":" + "00";
                start.innerHTML = "START";
            } else {
                timer.innerHTML = "00:00";
                start.classList.add('hover:bg-gray-600');
                start.classList.remove('hover:bg-gray-800');
                start.classList.add('bg-slate-100');
                start.classList.remove('bg-gray-600');
                start.classList.add('text-gray-600');
                start.classList.remove('text-slate-100');
                startStatus = false;
                start.innerHTML = "START";
            }
        } else {
            requestAnimationFrame(updateTimer);
        }
    }
}

function changeColor(){
    start.classList.toggle('bg-slate-100');
    start.classList.toggle('bg-gray-600');
    start.classList.toggle('text-gray-600');
    start.classList.toggle('text-slate-100');
    start.classList.toggle('hover:bg-gray-600');
    start.classList.toggle('hover:bg-gray-800');
}

start.addEventListener('click', function() {
    if (timer.innerHTML != "00:00") {
        if (start.innerHTML === "START") {
            startAudio.play();
            changeColor()
            startStatus = true;
            startTime = Date.now();
            if(firstTime){
                setTimeout(() => {
                    startTime = Date.now();
                    requestAnimationFrame(updateTimer);
                    firstTime = false
                }, 1000);
                sessionTimeout = setTimeout(() => {
                    sessionAudio.play()
                }, min * 60000);
            }
            if(!firstTime){
                requestAnimationFrame(updateTimer);
                sessionTimeout = setTimeout(() => {
                    sessionAudio.play()
                }, msForSound)
            }
            start.innerHTML = "PAUSE";
        } else if (start.innerHTML === "PAUSE") {
            clearInterval(sessionTimeout);
            pauseAudio.play();
            changeColor()
            startStatus = false;
            start.innerHTML = "START";
        }
    }
});