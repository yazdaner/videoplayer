let showAds = true;
let screenshotHeight = 0;
let siwpeThumb = false;

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
const screenshotsBox = document.querySelector(".screenshots-box");
const videoProgress = document.querySelector(".video-progress");
const thumb = document.querySelector(".thumb");

const hls = new Hls();

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

fullScreen.addEventListener("click", async function () {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    fullScreen.classList.add("fa-expand");
    fullScreen.classList.remove("fa-compress");
  } else {
    await videoBox.requestFullscreen();
    fullScreen.classList.add("fa-compress");
    fullScreen.classList.remove("fa-expand");
  }
});

smallPlayer.addEventListener("click", function () {
  videoBox.classList.add("video-small-box");
});

video.onended = function () {
  loadMainVideo();
};

loadMainVideo = function () {
  if (Hls.isSupported()) {
    hls.loadSource("http://localhost/videoplayer/encryption/index.m3u8");
    // hls.loadSource("http://localhost/videoplayer/videos/480/480_out.m3u8");
    hls.attachMedia(video);
    video.play();
  }
  getScreenshotsVideo();
};

getScreenshotsVideo = function () {
  axios
    .get("http://localhost/videoplayer/screen.png", { responseType: "blob" })
    .then((response) => {
      const reader = new window.FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = function () {
        const imageDataUrl = reader.result;
        getImageSize(imageDataUrl, function (imageWidth, imageHeight) {
          const duration = video.duration;
          console.log(duration);
          let n = Math.ceil(duration / 20);
          let row = Math.ceil(n / 5);
          let h = imageHeight / row;
          screenshotsBox.style.height = h + "px";
          screenshotHeight = h;
        });
        screenshotsBox.style.backgroundImage = 'url("' + imageDataUrl + '")';
      };
    })
    .catch((e) => {});
};

getImageSize = function (imageUrl, callback) {
  const image = new Image();
  image.onload = function () {
    callback(this.naturalWidth, this.naturalHeight);
  };
  image.src = imageUrl;
};

videoProgress.addEventListener("mouseenter", function (e) {
  showScreen(e);
  thumb.style.display = 'block';  
});

videoProgress.addEventListener("mousemove", function (e) {
  showScreen(e);
});


videoProgress.addEventListener("mouseleave", function (e) {
  if(siwpeThumb == false)
  {
    thumb.style.display = 'none';
    screenshotsBox.style.display = "none";
  }
});

showScreen = function (e) {
  if (screenshotHeight !== 0) {
    screenshotsBox.style.display = "block";
    let progressWidth = videoProgress.getBoundingClientRect().width;
    let vw = progressWidth / video.duration;
    let shift = e.clientX - videoProgress.getBoundingClientRect().left;
    screenshotsBox.style.left = shift - 80 + "px";
    const hoverTime = Math.floor(shift / vw);
    let n = Math.floor(hoverTime / 20) + 1;
    let row = Math.floor(n / 5);
    if (n % 5 == 0 && row > 0) {
      row--;
    }
    let column = n - row * 5 - 1;
    if (column === -1) {
      column = 4;
    }
    console.log(column+'-'+row);
    screenshotsBox.style.backgroundPositionX = column * 200 + "px";
    screenshotsBox.style.backgroundPositionY = -( row * screenshotHeight )+ "px";
  }
};

videoProgress.addEventListener("click", function (e) {
  skipAhead(e);
});

skipAhead = function(e){
  let progressWidth = videoProgress.getBoundingClientRect().width;
  let vw = progressWidth / video.duration;
  let shift = e.clientX - videoProgress.getBoundingClientRect().left;
  video.currentTime = shift/vw;
}

thumb.addEventListener('mousedown',function(){
  siwpeThumb = true;
});

window.addEventListener('mouseup',function(){
  siwpeThumb = false;
});

videoBox.addEventListener('mousemove',function(e){
  if(siwpeThumb)
  {
    skipAhead(e);
  }
});