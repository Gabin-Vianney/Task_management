let now_playing = document.querySelector('.now_playing')
let track_art = document.querySelector('.track_art')
let_track_name = document.querySelector('.track_name')
let track_artist = document.querySelector('.track_artist')

let playpause_btn = document.querySelector('.playpause_track')
let next_btn = document.querySelector('.next_track')
let prev_btn = document.querySelector('.prev_track')

let seek_slider = document.querySelector('.seek_slider')
let volume_slider = document.querySelector('.volume_slider')
let curr_time = document.querySelector('.current_time')
let total_duration = document.querySelector('.total_duration')
let wave = document.getElementById('wave')
let randomIcon = document.querySelector('.fa-random')
let curr_track = document.createElement('audio')
let randomActive = document.createElement('div')
let track_index = 0
let isPlaying = false
let isRandom = false
let updateTimer

const music_list = [
  {
    img: './earth.jpg',
    name: 'Jefe',
    artist: 'Ninho',
    music: './audio/ninho_jefe.mp3',
  },

  {
    img: './capture.png',
    name: 'Aicha',
    artist: 'Ninho',
    music: './audio/ninho_aicha.mp3',
  },

  {
    img: './vianney.jpg',
    name: 'Vérité',
    artist: 'Ninho',
    music: './audio/ninho_verite.mp3',
  },

  {
    img: './gabin2.jpg',
    name: "Seigneur m'a sauvé",
    artist: 'HONORE Z BLEKPON',
    music: './audio/HONORE  Z  BLEKPON (1).mp3',
  },

  {
    img: './vianney.jpg',
    name: "Seigneur m'a sauvé",
    artist: 'Song',
    music: './audio/song_jesus.mp3',
  },
]

loadTrack(track_index)

function loadTrack(track_index) {
  clearInterval(updateTimer)
  reset()
  curr_track.src = music_list[track_index].music
  curr_track.load()

  track_art.style.backgroundImage = 'url(' + music_list[track_index].img + ')'
  track_name.style.textContent = music_list[track_index].name
  track_artist.style.textContent = music_list[track_index].artist
  now_playing.style.textContent =
    'Playing music' + (track_index - 1) + 'of' + music_list.length
  updateTimer = setInterval(setupdate, 1000)
  curr_track.addEventListener('ended', nextTrack)
  random_bg_color()
}

function random_bg_color() {
  let hex = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
  ]
  let a

  function populate(a) {
    for (let i = 0; i < 4; i++) {
      let x = Math.round(Math.random() * 14)
      let y = hex[x]
      a += y
    }
    return a
  }

  let Color1 = populate('a')
  let Color2 = populate('a')
  var angle = 'to right'

  let gradient = 'linear-gradient(' + angle + ',' + Color1 + ',' + Color2 + ')'

  document.body.style.background = gradient
}

function reset() {
  curr_time.textContent = '00:00'
  total_duration.textContent = '00:00'
  seek_slider.value = 0
}
function randomTrack() {
  isRandom ? pauseRandom() : playRandom()
}

function playRandom() {
  isRandom = true
  randomIcon.classList.add('randomActive')
}

function pauseRandom() {
  isRandom = false
  randomIcon.classList.remove('randomActive')
}

function repeatTrack() {
  let current_index = track_index
  loadTrack(current_index)
  playTrack()
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack()
}

function playTrack() {
  curr_track.play()
  isPlaying = true
  track_art.classList.add('rotate')
  wave.classList.add('loader')
  playpause_btn.innerHTML = '<i class=" fa fa-pause-circle fa-5px"> </>'
}

function pauseTrack() {
  curr_track.pause()
  isPlaying = false
  track_art.classList.remove('rotate')
  wave.classList.remove('loader')
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>'
}

function nextTrack() {
  if (track_index < music_list.length - 1 && isRandom === false) {
    track_index += 1
  } else if (track_index < music_list.length - 1 && isRandom === true) {
    let random_index = Number.parseInt(Math.random() + music_list.length)
    track_index = random_index
  } else {
    track_index = 0
  }
  loadTrack(track_index)
  playTrack()
}

function prevTrack() {
  if (track_index > 0) {
    track_index -= 1
  } else {
    track_index = music_list.length - 1
  }
  loadTrack(track_index)
  playTrack()
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100)
  curr_track.currentTime = seekto
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100
}

function setUpdate() {
  let seekPosition = 0
  if (isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration)
    seek_slider.value = seekPosition

    let currentMinutes = Math.floor(curr_track.currentTime / 60)
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60,
    )
    let durationMinutes = Math.floor(curr_track.duration / 60)
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60)

    if (currentSeconds < 10) {
      currentSeconds = '0' + currentSeconds
    }
    if (durationSeconds < 10) {
      durationSeconds = '0' + durationSeconds
    }

    if (currentMinutes < 10) {
      currentMinutes = '0' + currentMinutes
    }

    if (durationMinutes < 10) {
      durationMinutes = '0' + durationMinutes
    }
    curr_time.textContent = currentMinutes + ':' + currentSeconds
    total_duration.textContent = durationMinutes + ':' + durationMinutes
  }
}
