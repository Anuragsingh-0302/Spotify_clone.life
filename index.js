console.log("Lets write JavaScript");

let currentSong = new Audio();
let songs;
let currentFolder;

// get the song currentTime and duration and convert it into minutes and seconds
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid time";
  }

  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  //alternate way to pad the number with 0
  // const formattedMinutes = String(minutes).padStart(2, '0');
  // const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${currentFolder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currentFolder}/`)[1]);
    }
  }

  // play the first song
  // playMusic(songs[0], true);

  // show all the songs in the playlist
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";

  // for (const song of songs) {
  //   songUl.innerHTML += `<li><div class="playNow_11">
  //                               <img class="invert" src="/img/music.svg" alt="">
  //                               <div class="info">
  //                                  <div class="songName">
  //                                  ${song.replaceAll("%20", " ")}
  //                                  </div>
  //                                   <div class="artistName">
  //                                       Anurag Singh
  //                                   </div>
  //                               </div>
  //                           </div>
  //                           <div class="playNow">
  //                               <span>Play Now</span>
  //                               <img id="playNow1" class="invert" src="/img/play.svg" alt="">
  //                           </div></li>`;
  // }

  for (const song of songs) {
    let songDetails = song.replaceAll("%20", " ").split("-");
    let songName = songDetails[0].trim();
    let artistDetails = songDetails[1]
      ? songDetails[1].split(".")[0].trim()
      : "Unknown Artist";

    songUl.innerHTML += `<li>
                            <div class="playNow_11">
                                <img class="invert" src="/img/music.svg" alt="">
                                <div class="info">
                                   <div class="songName">
                                       ${songName}
                                   </div>
                                    <div class="artistName">
                                        ${artistDetails}
                                    </div>
                                </div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img id="playNow1" class="invert" src="/img/play.svg" alt="">
                            </div>
                        </li>`;
  }

  // attach event listener to all the songs

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((li) => {
    li.addEventListener("click", () => {
      playMusic(li.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currentFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/img/pause.svg";
  }
  console.log("Playing " + track);
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/Spotify_songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(as);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element.href.includes("/Spotify_songs")) {
      let folder = element.href.split("/").slice(-2)[0];
      // get the meta data of the folder
      let a = await fetch(
        `http://127.0.0.1:3000/Spotify_songs/${folder}/info.json`
      );
      let data = await a.json();
      cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision"
                                text-rendering="geometricPrecision" image-rendering="optimizeQuality"
                                fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
                                <circle fill="#1fdf64" cx="256" cy="256" r="256" />
                                <path fill="#1fdf64"
                                    d="M256 9.28c136.12 0 246.46 110.35 246.46 246.46 0 3.22-.08 6.42-.21 9.62C497.2 133.7 388.89 28.51 256 28.51S14.8 133.7 9.75 265.36c-.13-3.2-.21-6.4-.21-9.62C9.54 119.63 119.88 9.28 256 9.28z" />
                                <path fill="#000"
                                    d="M351.74 275.46c17.09-11.03 17.04-23.32 0-33.09l-133.52-97.7c-13.92-8.73-28.44-3.6-28.05 14.57l.54 191.94c1.2 19.71 12.44 25.12 29.04 16l131.99-91.72z" />
                            </svg>
                        </div>
                        <img src="/Spotify_songs/${folder}/cover.jpg" alt="">
                        <div class="cardContent">
                            <h3>${data.title}</h3>
                            <p>${data.description}</p>
                        </div>
                    </div>`;
    }
  }

  // load the playlist whwn ever card is clicked on Spotify Playlists

  Array.from(document.getElementsByClassName("card")).forEach((element) => {
    element.addEventListener("click", async (item) => {
      songs = await getSongs(
        `Spotify_songs/${item.currentTarget.dataset.folder}`
      ); // 4:16:00
      playMusic(songs[0]);
    });
  });
}

async function main() {

  // get the list of all songs
  await getSongs("Spotify_songs/Alan_Walker");
  playMusic(songs[0], true);

  // Display all the albums on the Spotify Playlists page

  displayAlbums();

  // attach event listener to the play button,next and previous button

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("play").src = "/img/pause.svg";
    } else {
      currentSong.pause();
      document.getElementById("play").src = "/img/play.svg";
    }
  });

  //listen for time update event and update the time

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML =
      secondsToMinutesSeconds(currentSong.currentTime) +
      "/" +
      secondsToMinutesSeconds(currentSong.duration);
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // add an event listener to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    currentSong.currentTime =
      (e.offsetX / document.querySelector(".seekbar").clientWidth) *
      currentSong.duration;
  });

  //--------------

  // Update time and seekbar progress
  currentSong.addEventListener("timeupdate", () => {
    let percent = (currentSong.currentTime / currentSong.duration) * 100;

    // Circle move karega
    document.querySelector(".circle").style.left = percent + "%";

    // Seekbar ka green part update hoga
    document.querySelector(".seekbar").style.transition =
      "background 0.2s linear";
    document.querySelector(
      ".seekbar"
    ).style.background = `linear-gradient(to right, rgb(108, 255, 92) ${percent}%, rgba(255, 255, 255, 0.438) ${percent}%)`;

    // Song time update
    document.querySelector(".songTime").innerHTML =
      secondsToMinutesSeconds(currentSong.currentTime) +
      "/" +
      secondsToMinutesSeconds(currentSong.duration);
  });

  // Seekbar click event update
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let seekbar = document.querySelector(".seekbar");
    let percent = (e.offsetX / seekbar.clientWidth) * 100;

    // Song position update

    currentSong.currentTime = (percent / 100) * currentSong.duration;

    // Circle aur background update

    document.querySelector(".circle").style.left = percent + "%";
    seekbar.style.background = `linear-gradient(to right, rgb(108, 255, 92) ${percent}%, rgba(255, 255, 255, 0.438) ${percent}%)`;
  });

  // add an event listener to hamburger menu

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  });

  // add an event listener to close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  // add an event listener to previous and next button

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    if (index - 1 < 0) {
      index = songs.length - 1; // Last song pr jump karega
    } else {
      index--; // Pichle song pr jayega
    }
    playMusic(songs[index]);
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    if (index + 1 >= songs.length) {
      index = 0; // Pehle song pr wapas jayega
    } else {
      index++; // Next song pr move karega
    }
    playMusic(songs[index]);
  });

  // add an event listener to play the next song when the current song ends

  currentSong.addEventListener("ended", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    index = (index + 1) % songs.length; // Next song, last song ke baad first song
    playMusic(songs[index]);
  });

  // add an event listener to the volume button

  document.querySelector("#volume").addEventListener("input", () => {
    currentSong.volume = document.querySelector("#volume").value / 100;
  });

  // add an event listener to the mute button

  document.querySelector("#mute").addEventListener("click", () => {
    let volumeSlider = document.querySelector("#volume"); // Slider element
    let volume = Number(volumeSlider.value); // Get current volume

    if (currentSong.muted) {
      currentSong.muted = false;
      currentSong.volume = volumeSlider.dataset.lastVolume / 100; // Restore last volume .dataset data-last-volume me store hoga
      volumeSlider.value = volumeSlider.dataset.lastVolume; // Slider wapas set karo
      document.getElementById("mute").src = "/img/volume.svg";
    } else {
      volumeSlider.dataset.lastVolume = volume; // Store last volume
      currentSong.muted = true;
      currentSong.volume = 0;
      volumeSlider.value = 0; // Slider ko zero dikhao
      document.getElementById("mute").src = "/img/mute.svg";
    }
  });
}
main();
