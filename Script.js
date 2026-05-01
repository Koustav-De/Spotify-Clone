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
    currFolder = folder
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
        item.stopPropagation()

        currFolder = item.currentTarget.dataset.folder

        songs = await getSongs(currFolder)
        renderSongs()

        if (window.innerWidth <= 1024) {
            openSidebar()
        }
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

    currentAudio.src = encodeURI(song.url)
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
        document.querySelector(".seekbar").style.background =
            `linear-gradient(to right, white ${percent}%, grey ${percent}%)`
    }
})

// Seekabr click event
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%"
    document.querySelector(".seekbar").style.background =
        `linear-gradient(to right, white ${percent}%, grey ${percent}%)`
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
function openSidebar() {
    document.querySelector(".left-box").style.left = "0"
    document.querySelector(".left-box").classList.add("active")
    document.body.classList.add("sidebar-open")
}

function closeSidebar() {
    document.querySelector(".left-box").style.left = "-100%"
    document.querySelector(".left-box").classList.remove("active")
    document.body.classList.remove("sidebar-open")
}

document.querySelector(".hamburger").addEventListener("click", (e) => {
    e.stopPropagation()
    openSidebar()
})

document.querySelector(".close").addEventListener("click", () => {
    closeSidebar()
})

document.addEventListener("click", (e) => {
    if (window.innerWidth > 1024) return

    let sidebar = document.querySelector(".left-box")

    if (!sidebar.classList.contains("active")) return

    if (!e.target.closest(".left-box") &&
        !e.target.closest(".hamburger") &&
        !e.target.closest(".card")) {

        closeSidebar()
    }
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

// Signup/Login
const modal = document.querySelector(".auth-modal");
const closeBtn = document.querySelector(".close-auth");
const authTitle = document.getElementById("auth-title");
const authSubmit = document.getElementById("auth-submit");
const toggleText = document.getElementById("auth-toggle");

let isLogin = true;

// Open modal
document.addEventListener("click", (e) => {
    if (e.target.closest(".login")) {
        modal.classList.remove("hidden");
        isLogin = true;
        updateAuthUI();
    }

    if (e.target.closest(".sign")) {
        modal.classList.remove("hidden");
        isLogin = false;
        updateAuthUI();
    }
});

// Close modal
closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Toggle login/signup
toggleText.addEventListener("click", () => {
    isLogin = !isLogin;
    updateAuthUI();
});

function updateAuthUI() {
    let fname = document.getElementById("auth-fname");
    let lname = document.getElementById("auth-lname");

    if (isLogin) {
        authTitle.innerText = "Login";
        authSubmit.innerText = "Login";
        toggleText.innerHTML = `Don't have an account? <span>Sign up</span>`;

        fname.style.display = "none";
        lname.style.display = "none";

    } else {
        authTitle.innerText = "Sign Up";
        authSubmit.innerText = "Sign Up";
        toggleText.innerHTML = `Already have an account? <span>Login</span>`;

        fname.style.display = "block";
        lname.style.display = "block";
    }
}

authSubmit.addEventListener("click", async () => {
    let fname = document.getElementById("auth-fname").value;
    let lname = document.getElementById("auth-lname").value;
    let email = document.getElementById("auth-email").value;
    let password = document.getElementById("auth-password").value;

    try {
        if (isLogin) {
            // LOGIN (no name needed)
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful 🔐");

        } else {
            // SIGNUP
            let userCred = await createUserWithEmailAndPassword(auth, email, password);

            // Save full name
            await updateProfile(auth.currentUser, {
                displayName: fname + " " + lname
            })

            alert("Signup successful 🎉");
        }

        modal.classList.add("hidden");

        location.reload()

    } catch (err) {
        alert(err.message);
    }
});

// Show/Hide icon
const passwordInput = document.getElementById("auth-password");
const show = document.getElementById("show");

document.querySelector(".toggle-pass").addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        document.querySelector("#show").src = "hide.svg"
    } else {
        passwordInput.type = "password";
        document.querySelector("#show").src = "show.svg"
    }
})

// Search for a song
async function getAllSongs() {
    let res = await fetch("Songs/general.json")
    return await res.json()
}

searchInput.addEventListener("input", async () => {
    let query = searchInput.value.toLowerCase()

    if (!query) {
        if (currFolder) {
            songs = await getSongs(currFolder)
        } else {
            songs = []
        }
        renderSongs()
        return
    }

    let sourceSongs

    if (currFolder) {
        // Search inside selected folder
        sourceSongs = await getSongs(currFolder)
    } else {
        // Search globally
        sourceSongs = await getAllSongs()
    }

    let filtered = sourceSongs.filter(song =>
        song.name.toLowerCase().includes(query)
    )

    songs = filtered
    renderSongs()
})

