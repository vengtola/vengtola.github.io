
// 1. http://tola.me

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var mainPlayer;
var playerState;
var controllers = document.getElementById('controllers');
var controllersPlayer = document.getElementById('controllersPlayer');
var unMuteButton = document.getElementById('unMuteButton');
var playerSlider = document.getElementById('playerSlider');
var firstClicked = false;
var playDuration = 0;

function onYouTubeIframeAPIReady() {
    mainPlayer = new YT.Player('mainPlayer', {
        height: '100%',
        width: '100%',
        // videoId: 'PLkSrH7QmXCNWtY2YNc8QO_WOaHiZU6TxM',
        //playerVars: {
        //  'playsinline': 1
        //},
        playerVars: {
        listType:'playlist',
        list: 'PLkSrH7QmXCNWtY2YNc8QO_WOaHiZU6TxM',
        autoplay: 0,
        controls: 0,
        mute: 1, // 1 = hack to auto play start, Web Policy: auto start must be muted.
        playsinline: 1,
        loop: 1,
        //origin: 'https://tolaveng.github.io/',
        showinfo: 0,
        wmode: 'opaque',
        },
        events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    mainPlayer.setLoop(true);
    mainPlayer.setVolume(45);
	
	//event.target.playVideo();
	// shuffer and play next
	mainPlayer.setShuffle(true);
	//mainPlayer.nextVideo();
	mainPlayer.playVideo();
	
    unMuteButton.style.visibility = 'visible';
    // update slider
    setInterval(updateProgress, 200);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
function onPlayerStateChange(event) {
    playerState = event.data;

    // slider
    if (mainPlayer.getDuration() && mainPlayer.getDuration() > 0 && event.data == YT.PlayerState.PLAYING) {
        playDuration = mainPlayer.getDuration();
        playerSlider.max = playDuration;
    }

    if (event.data === -1) { // unstarted
        playerSlider.value = 0;
    }

    if (event.data == YT.PlayerState.ENDED) {
        
    }

    if (event.data == YT.PlayerState.PLAYING) {
        controllers.style.visibility = 'hidden';
        controllersPlayer.style.display = 'flex';
    }

    if (event.data == YT.PlayerState.PAUSED) {
        controllers.style.visibility = 'visible';
        controllersPlayer.style.display = 'none';
    }
}

function stopVideo() {
    mainPlayer.stopVideo();
}

function playVideo(evt) {
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    if (playerState !== YT.PlayerState.PLAYING) {
        mainPlayer.playVideo();
    }
}

function nextVideo(evt) {
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    mainPlayer.nextVideo();
}

function previousVideo(evt) {
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    mainPlayer.previousVideo();
}

function seekVideoTo(evt) {
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    var value = playerSlider.value;
    if (value > playDuration) value = playDuration;
    mainPlayer.seekTo(value);
}

function updateProgress() {
    if (playerState !== YT.PlayerState.PLAYING) return;
    var value = mainPlayer.getCurrentTime();
    if (value > 0) {
        playerSlider.value = value;
    }
}

function overlayClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if (!mainPlayer) return;
    
    // for first auto play with mute
    if (!firstClicked && mainPlayer.isMuted()) {
        mainPlayer.unMute();
        unMuteButton.style.visibility = 'hidden';
        controllersPlayer.style.display = 'flex';
    } else {
        if (playerState === YT.PlayerState.PLAYING ) {
            mainPlayer.pauseVideo();
        } else {
            mainPlayer.playVideo();
        }
    }
    
    firstClicked = true;
}

function playPause() {
    if (mainPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
        mainPlayer.pauseVideo();
    } else {
        mainPlayer.playVideo();
    }
}

function toggleMute(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if (mainPlayer.isMuted()) {
    mainPlayer.unMute();
    unMuteButton.style.visibility = 'hidden';
    } else {
    mainPlayer.mute();
    unMuteButton.style.visibility = 'visible';
    }
    
    firstClicked = true;
}