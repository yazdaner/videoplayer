let showAds = true;

const video = document.getElementById("videoPlayer");
const playButton = document.getElementById("palyButton");
const progressBar = document.querySelector(".progress-bar");
const videoCurrentTime = document.querySelector(".video-current-time");
const videoDuration = document.querySelector(".video-duration");
const volume = document.querySelector("#volume");
const volumeIcon = document.querySelector("#volumeIcon");
const sliderProgress = document.querySelector(".slider-progress");
const fullScreen = document.querySelector("#fullScreen");
const smallPlayer = document.querySelector("#smallPlayer");
const videoBox = document.querySelector(".video-box");

loadAds = function () {
  video.setAttribute("src", "http://localhost:8000/ads");
  video.play();
};

loadAds();

playButton.addEventListener("click", function () {
  playOrPause();
});

video.addEventListener("click", function () {
  playOrPause();
});

playOrPause = function () {
  if (video.paused) {
    video.play();
    playButton.className = "fa-solid fa-pause";
  } else {
    video.pause();
    playButton.className = "fa-solid fa-play";
  }
};

if (navigator.getAutoplayPolicy !== undefined) {
  // alert(navigator.getAutoplayPolicy("mediaelement"));
  if (navigator.getAutoplayPolicy("mediaelement") === "allowed") {
    video.volume = 0;
    video.play();
  } else {
    playButton.className = "fa-solid fa-play";
  }
}

video.addEventListener("timeupdate", function () {
  const currentTime = video.currentTime;
  const duration = video.duration;
  let w = (currentTime / duration) * 100;
  progressBar.style.width = w + "%";
  videoCurrentTime.textContent = getTime(currentTime);
});

getTime = function (seconds) {
  let time = "";
  seconds = parseInt(seconds);
  let h = Math.floor(seconds / (60 * 60));
  if (h >= 1) {
    seconds = seconds - h * 60 * 60;
  }
  let m = Math.floor(seconds / 60);
  seconds = seconds - m * 60;
  if (m.toString().length === 1) {
    time += "0" + m + ":";
  } else {
    time += m + ":";
  }
  if (seconds.toString().length === 1) {
    time += "0" + seconds;
  } else {
    time += seconds;
  }
  return time;
};

video.onloadeddata = function () {
  videoDuration.textContent = getTime(video.duration);
};

volume.addEventListener("input", function () {
  changeVolum(this.value);
});

changeVolum = function (volume) {
  video.volume = volume;
  sliderProgress.style.width = 90 * volume + "px";
  if (volume > 0.4) {
    volumeIcon.className = "fa-solid fa-volume-high";
  } else if (volume > 0) {
    volumeIcon.className = "fa-solid fa-volume-low";
  } else {
    volumeIcon.className = "fa-solid fa-volume-xmark";
  }
};


fullScreen.addEventListener('click',async function(){
    if(document.fullscreenElement){
      await document.exitFullscreen();
      fullScreen.classList.add('fa-expand');
      fullScreen.classList.remove('fa-compress');
    }else{
      await videoBox.requestFullscreen();
      fullScreen.classList.add('fa-compress');
      fullScreen.classList.remove('fa-expand');
    }
});


smallPlayer.addEventListener('click',function(){
  videoBox.classList.add('video-small-box');
});