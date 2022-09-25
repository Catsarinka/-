let radius = 240; 
let autoRotate = true;
let rotateSpeed = -20; 
let imgWidth = 205; 
let imgHeight = 205;
setTimeout(init, 300);

let ospin = document.getElementById("spin-container");

let aImg = ospin.getElementsByTagName("img");
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";


// ФУНКЦИЯ входа изображений

function init(delayTime) {
    for (let i = 0; i < aImg.length; i++) {
        aImg[i].style.transform =
        "rotateY(" +
        i * (360 / aImg.length) +
        "deg) translateZ(" +
        radius +
        "px)";
        aImg[i].style.transition = "transform 1s";
        aImg[i].style.transitionDelay =
        delayTime || (aImg.length - i) / 4 + "s";
    }
}
// ФУНКЦИЯ вращения изображений и текста

function playSpin(yes) {
    ospin.style.animationPlayState = yes ? "running" : "paused";
}
let sX,
sY,
nX,
nY,
desX = 0,
desY = 0,
tX = 0,
tY = 10;
if (autoRotate) {
    let animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
    ospin.style.animation = `${animationName} ${Math.abs(
    rotateSpeed
    )}s infinite linear`;
}

// Масштаб

document.onmousewheel = function(e) {
  e = e || window.event;
  let d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
}; 

