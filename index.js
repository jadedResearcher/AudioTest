// 1. ytplayer code: https://developers.google.com/youtube/player_parameters#IFrame_Player_API
var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var player;
  function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
      height: '360',
      width: '640',
      videoId: 'nd5jpVLJGWg',
      playerVars: { 'autoplay': 1, 'controls': 0 }
    });
    player.loadPlaylist({playlist:"PLjd-UedDYHsGSFsNHkJ00s0_EOeJ7U8hf",
      index:11,
      startSeconds:0})
  }

  let body;

  const checkForHaHa = ()=>{
    console.log("JR NOTE: check for haha",player.playerInfo.currentTime)
    const opacity =120-player.playerInfo.currentTime; 
    body.style.opacity = opacity+"%";
  }


// 2. get player.playerInfo.currentTime
window.onload = ()=>{
  body = document.querySelector("body");
  //JR NOTE: might need to just start an interval loop and always check for time
  player.addEventListener('onStateChange', checkForHaHa);
  setInterval(checkForHaHa, 1000);

}