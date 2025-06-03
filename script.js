const songFiles = [
  "song1.mp3", "song2.mp3", "song3.mp3", "song4.mp3", "song5.mp3", "song6.mp3",
  "song7.mp3", "song8.mp3", "song9.mp3", "song10.mp3", "song11.mp3", "song12.mp3",
  "song13.mp3", "song14.mp3", "song15.mp3", "song16.mp3", "song17.mp3", "song18.mp3"
];

const songTitles = [
  "Victory Anthem", "Jatt Mehkma", "Millionaire", "Amkhon se batana", "Khwaab", "Ye Ishq Hai",
  "Girl I need You", "Relation", "Lehenga", "Bulleya", "Prem Ki Naiya Hai", "Punjabi Wedding",
  "Mitwa", "Yaad Piya Ki", "Teri Aankhon Mein", "jhol", "Aashiq Tera", "O Rangrez"
];

const songImages = [
  "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image6.jpg",
  "image7.jpg", "image8.jpg", "image9.jpg", "image10.jpg", "image11.jpg", "image12.jpg",
  "image13.jpg", "image14.jpg", "image15.jpg", "image16.jpg", "image17.jpg", "image18.jpg"
];

// Combine song data
if (
  songFiles.length !== songTitles.length ||
  songFiles.length !== songImages.length
) {
  throw new Error("songFiles, songTitles, and songImages arrays must have the same length.");
}
const songs = songFiles.map((file, index) => ({
  name: songTitles[index],
  file: `songs/${file}`,
  image: `images/${songImages[index]}`
}));

let currentSong = 0;
let isPlaying = false;
let isLooping = false;

document.addEventListener("DOMContentLoaded", function () {
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

  // Load song
  function loadSong(index) {
    const song = songs[index];
    audio.src = song.file;
    songTitle.textContent = song.name;
    songImage.src = song.image;
    songImage.classList.remove("hidden");
    updateActiveSong(index);
  }
  loadSong(currentSong);

  // Play / Pause
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

  // Next / Prev
  nextBtn.addEventListener("click", () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    if (isPlaying) audio.play();
  });

  prevBtn.addEventListener("click", () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    if (isPlaying) audio.play();
  });

  // Loop toggle
  loopBtn.addEventListener("click", () => {
    isLooping = !isLooping;
    loopBtn.textContent = `Loop: ${isLooping ? "On" : "Off"}`;
    audio.loop = isLooping;
  });

  // Progress bar
  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${percent}%`;
  });

  progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  });

  audio.addEventListener("ended", () => {
    if (!isLooping) nextBtn.click();
  });

  // Song List Renderer
  function updateSongList() {
    songList.innerHTML = "";
    songs.forEach((song, index) => {
      const li = document.createElement("li");
      li.className =
        "cursor-pointer hover:text-white transition flex justify-between items-center " +
        (index === currentSong ? "text-green-400 font-semibold" : "");

      const span = document.createElement("span");
      span.textContent = song.name;
      span.addEventListener("click", () => {
        currentSong = index;
        loadSong(currentSong);
        audio.play();
        isPlaying = true;
        playBtn.textContent = "⏸️";
      });

      const btn = document.createElement("button");
      btn.textContent = "❤️";
      btn.className = "ml-4 text-red-400 hover:text-red-300 text-sm";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToLibrary(song);
      });

      li.appendChild(span);
      li.appendChild(btn);
      songList.appendChild(li);
    });
  }

  function updateActiveSong(index) {
    const items = songList.querySelectorAll("li");
    items.forEach((li, i) => {
      li.className =
        "cursor-pointer hover:text-white transition flex justify-between items-center " +
        (i === index ? "text-green-400 font-semibold" : "");
    });
  }

  updateSongList();
});

// Play / Pause
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

// Next / Prev
nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  if (isPlaying) audio.play();
});

prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  if (isPlaying) audio.play();
});

// Loop toggle
loopBtn.addEventListener("click", () => {
  isLooping = !isLooping;
  loopBtn.textContent = `Loop: ${isLooping ? "On" : "Off"}`;
  audio.loop = isLooping;
});

// Progress bar
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${percent}%`;
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener("ended", () => {
  if (!isLooping) nextBtn.click();
});

// Add to Library
function addToLibrary(song) {
  let library = JSON.parse(localStorage.getItem("librarySongs")) || [];
  const exists = library.find((s) => s.name === song.name);
  if (exists) {
    Swal.fire({
      icon: 'info',
      title: 'Already in Library',
      text: `${song.name} is already there.`,
      toast: true,
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end',
    });
  } else {
    library.push(song);
    localStorage.setItem("librarySongs", JSON.stringify(library));
    Swal.fire({
      icon: 'success',
      title: 'Added to Library!',
      text: `${song.name} has been added.`,
      toast: true,
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end',
    });
  }
}

// Song List Renderer
function updateSongList() {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.className =
      "cursor-pointer hover:text-white transition flex justify-between items-center " +
      (index === currentSong ? "text-green-400 font-semibold" : "");

    const span = document.createElement("span");
    span.textContent = song.name;
    span.addEventListener("click", () => {
      currentSong = index;
      loadSong(currentSong);
      audio.play();
      isPlaying = true;
      playBtn.textContent = "⏸️";
    });

    const btn = document.createElement("button");
    btn.textContent = "❤️";
    btn.className = "ml-4 text-red-400 hover:text-red-300 text-sm";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToLibrary(song);
    });

    li.appendChild(span);
    li.appendChild(btn);
    songList.appendChild(li);
  });
}

function updateActiveSong(index) {
  const items = songList.querySelectorAll("li");
  items.forEach((li, i) => {
    li.className =
      "cursor-pointer hover:text-white transition flex justify-between items-center " +
      (i === index ? "text-green-400 font-semibold" : "");
  });
}

updateSongList();
