window.onload = ()=>{
  const audioFucker = new AudioFucker();
  const url = "http://farragnarok.com/PodCasts/oinapmaz.mp3";
  const container = document.querySelector("#audio-test");
  const regularPlay = createElementWithClassAndParent("button",container);
  regularPlay.innerText = "Play Audio Normal";
  regularPlay.onclick = ()=>{
    console.log("JR NOTE: click")
    audioFucker.playURL(url);
  }

  const reverse = createElementWithClassAndParent("button",container);
  reverse.innerText = "Play Audio Reverse";
  reverse.onclick = ()=>{
    console.log("JR NOTE: click")
    audioFucker.playURLReverse(url);
  }

  const scromble = createElementWithClassAndParent("button",container);
  scromble.innerText = "Play Audio Scrombled";
  scromble.onclick = ()=>{
    console.log("JR NOTE: click")
    audioFucker.playURLScromble(url);
  }



}