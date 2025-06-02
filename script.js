// Song data
const songs = [
  {
    name: "Ranjha",
    file: "songs/ranjha.mp3",
    image: "images/ranjha.jpg",
  },
  {
    name: "Pasoori",
    file: "songs/pasoori.mp3",
    image: "images/pasoori.jpg",
  },
  {
    name: "Kesariya",
    file: "songs/kesariya.mp3",
    image: "images/kesariya.jpg",
  },
  {
    name: "Excuses",
    file: "songs/excuses.mp3",
    image: "images/excuses.jpg",
  },
  {
    name: "Tu Aake Dekhle",
    file: "songs/tu-aake-dekhle.mp3",
    image: "images/tu-aake-dekhle.jpg",
  },
];

let currentSong = 0;
let isPlaying = false;
let isLooping = false;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const loopBtn = document.getElementById("loop");

const songTitle = document.getElementById("song-title");
const songImage = document.getElementById("song-image");
const songList = document.getElementById("song-list");

const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress");

// Load song details
function loadSong(index) {
  const song = songs[index];
  audio.src = song.file;
  songTitle.textContent = song.name;
  songImage.src = song.image;
  updateActiveSong(index);
}
loadSong(currentSong);

// Toggle play/pause
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = "▶️";
  } else {
    audio.play();
    playBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
}
playBtn.addEventListener("click", togglePlay);

// Next song
function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  if (isPlaying) audio.play();
}
nextBtn.addEventListener("click", nextSong);

// Previous song
function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  if (isPlaying) audio.play();
}
prevBtn.addEventListener("click", prevSong);

// Toggle loop
loopBtn.addEventListener("click", () => {
  isLooping = !isLooping;
  loopBtn.textContent = `Loop: ${isLooping ? "On" : "Off"}`;
  audio.loop = isLooping;
});

// Progress bar update
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${percent}%`;
});

// Seek on progress click
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Handle song end
audio.addEventListener("ended", () => {
  if (!isLooping) nextSong();
});

// Populate song list
function updateSongList() {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.name;
    li.className =
      "cursor-pointer hover:text-white transition " +
      (index === currentSong ? "text-green-400 font-semibold" : "");
    li.addEventListener("click", () => {
      currentSong = index;
      loadSong(currentSong);
      audio.play();
      isPlaying = true;
      playBtn.textContent = "⏸️";
    });
    songList.appendChild(li);
  });
}

function updateActiveSong(index) {
  const items = songList.querySelectorAll("li");
  items.forEach((li, i) => {
    li.className =
      "cursor-pointer hover:text-white transition " +
      (i === index ? "text-green-400 font-semibold" : "");
  });
}

updateSongList();
