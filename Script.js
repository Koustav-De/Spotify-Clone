let currentAudio = new Audio()
let currentSongIndex = 0
let songs = []
let currFolder

// Fetching songs
async function getSongs(folder) {
    let response = await fetch(`Songs/${folder}.json`)
    let data = await response.json()

    // Sorting all songs
    data.sort((a, b) => a.name.localeCompare(b.name))
    return data
}

// Rendering songs
async function main(folder) {
    songs = await getSongs(folder)
    renderSongs()
}

function renderSongs() {
    let songUL = document.querySelector(".songlist ul")
    songUL.innerHTML = ""

    for (let i = 0; i < songs.length; i++) {
        let song = songs[i]

        songUL.innerHTML += `
        <li data-index="${i}">
            <img src="music.svg">
            <div class="info">
                <div>${song.name}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="play.svg">
            </div> 
        </li>`
    }

    addClickEvents()
}

// Click listeners
function addClickEvents() {
    document.querySelectorAll(".songlist li").forEach(li => {
        li.addEventListener("click", () => {
            let index = parseInt(li.getAttribute("data-index"))
            playSong(index)
        })
    })
}

// Load playlists when a card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
        songs = await getSongs(item.currentTarget.dataset.folder)
        renderSongs()
    })
})

// Highlight current song
function highlightSong(index) {
    document.querySelectorAll(".songlist li").forEach(li => {
        li.style.background = ""
    })

    let active = document.querySelector(`.songlist li[data-index="${index}"]`)
    if (active) {
        active.style.background = "#2a2a2a"
    }
}

// Play function
function playSong(index) {
    index = parseInt(index)
    let song = songs[index]

    currentAudio.src = song.url
    currentAudio.play()

    currentSongIndex = index
    highlightSong(index)

    document.querySelector(".songinfo").innerText = song.name
}

// Play/Pause functions
let mainPlayBtn = document.querySelector(".songbtn #playBtn")

currentAudio.addEventListener("play", () => {
    document.querySelector(".songbtn #playBtn").src = "pause.svg"
})

currentAudio.addEventListener("pause", () => {
    document.querySelector(".songbtn #playBtn").src = "play.svg"
})

mainPlayBtn.addEventListener("click", () => {
    if (!currentAudio.src) return

    if (currentAudio.paused) {
        currentAudio.play()
    } else {
        currentAudio.pause()
    }
})

// Prev/Next function
let nextBtn = document.querySelector(".songbtn #next")

nextBtn.addEventListener("click", () => {
    if (songs.length === 0) return

    let nextIndex = currentSongIndex + 1

    if (nextIndex >= songs.length) {
        nextIndex = 0
    }

    playSong(nextIndex)
})

let prevBtn = document.querySelector(".songbtn #previous")

prevBtn.addEventListener("click", () => {
    if (songs.length === 0) return

    let prevIndex = currentSongIndex - 1

    if (prevIndex < 0) {
        prevIndex = songs.length - 1
    }

    playSong(prevIndex)
})

// Time updation of a song
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00"

    let mins = Math.floor(seconds / 60)
    let secs = Math.floor(seconds % 60)

    if (secs < 10) secs = "0" + secs

    return `${mins}:${secs}`
}

currentAudio.addEventListener("loadedmetadata", () => {
    let duration = formatTime(currentAudio.duration)
    document.querySelector(".songtime").innerText = `0:00 / ${duration}`
})

currentAudio.addEventListener("timeupdate", () => {
    let current = formatTime(currentAudio.currentTime)
    let duration = formatTime(currentAudio.duration)

    document.querySelector(".songtime").innerText = `${current} / ${duration}`

    // Circle animation in seekbar
    if (!isNaN(currentAudio.duration)) {
        let percent = -1 + (currentAudio.currentTime / currentAudio.duration) * 100
        document.querySelector(".circle").style.left = percent + "%"
    }
})

// Seekabr click event
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%"
    currentAudio.currentTime = (currentAudio.duration * percent) / 100
})

// Autoplay next song
currentAudio.addEventListener("ended", () => {
    let nextIndex = currentSongIndex + 1

    if (nextIndex >= songs.length) {
        nextIndex = 0
    }

    playSong(nextIndex)
})

// Menu/Hamburger event
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left-box").style.left = "0"
})

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left-box").style.left = "-100%"
})

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left-box").classList.toggle("active")
    document.body.classList.toggle("sidebar-open")
})

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left-box").classList.toggle("active")
    document.body.classList.toggle("sidebar-open")
})

// Volume change event
let volumeSlider = document.querySelector(".volume input")

volumeSlider.addEventListener("input", (e) => {
    currentAudio.volume = e.target.value / 100
    document.querySelector(".volume #vol").src = "volume.svg"

    if (currentAudio.volume == 0)
        document.querySelector(".volume #vol").src = "mute.svg"
})

currentAudio.volume = 0.5 // default volume

document.querySelector("#vol").addEventListener("click", () => {
    if (currentAudio.volume > 0) {
        currentAudio.volume = 0
        volumeSlider.value = 0
        document.querySelector(".volume #vol").src = "mute.svg"
    } else {
        currentAudio.volume = 0.5
        volumeSlider.value = 50
        document.querySelector(".volume #vol").src = "volume.svg"
    }
})