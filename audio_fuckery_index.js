window.onload = () => {
  const audioFucker = new AudioFucker();
  const url = "http://farragnarok.com/PodCasts/oinapmaz.mp3";
  //const url = 'http://farragnarok.com/PodCasts/fuck2.mp3'
  const container = document.querySelector("#audio-test");
  const regularPlay = createElementWithClassAndParent("button", container);
  regularPlay.innerText = "Play Audio Normal";
  regularPlay.onclick = () => {
    console.log("JR NOTE: click")
    audioFucker.playURL(url);
  }

  const reverse = createElementWithClassAndParent("button", container);
  reverse.innerText = "Play Audio Reverse";
  reverse.onclick = () => {
    console.log("JR NOTE: click")
    audioFucker.playURLReverse(url);
  }

  const scromble = createElementWithClassAndParent("button", container);
  scromble.innerText = "Play Audio Scrombled";
  scromble.onclick = () => {
    console.log("JR NOTE: click")
    audioFucker.playURLScromble(url);
  }

  const scrombleInChunks = createElementWithClassAndParent("button", container);
  scrombleInChunks.innerText = "Play Audio Chunk Scrombled (does not work) rip";
  scrombleInChunks.onclick = () => {
    console.log("JR NOTE: click")
    audioFucker.playURLScrombleInChunks(url, 10);
  }

  const muffle = createElementWithClassAndParent("button", container);
  muffle.innerText = "Play Audio Muffled";
  muffle.onclick = async () => {
    console.log("JR NOTE: click")
    const filter = audioFucker.muffleFilter();
    await audioFucker.playURLWithOptionalStep(url,[filter]);
    //JR NOTE: the below works, so we can fuck with how muffled it is
    setInterval(() => {
      console.log("JR NOTE: filter.frequency.value  ", filter.frequency.value)
      filter.frequency.value += 100;

    }, 6000)
  }

  const distortion = createElementWithClassAndParent("button", container);
  distortion.innerText = "Play Distorted Audio";
  distortion.onclick = async () => {
    console.log("JR NOTE: click")
    let amount = 400;
    let d = audioFucker.distortion(amount);

    await audioFucker.playURLWithOptionalStep(url,[d]);
    //JR NOTE: the below works, so we can fuck with how muffled it is
    setInterval(() => {
      console.log("JR NOTE: distortion: ", amount)
      d.curve = audioFucker.makeDistortionCurve(amount+=1000)
    }, 1000)
  }

  const distortion2 = createElementWithClassAndParent("button", container);
  distortion2.innerText = "Play Distorted And Muffled Audio";
  distortion2.onclick = async () => {
    console.log("JR NOTE: click")
    let amount = 400;
    let d = audioFucker.distortion(amount);
    const filter = audioFucker.muffleFilter();

    await audioFucker.playURLWithOptionalStep(url,[d,filter]);
    //JR NOTE: the below works, so we can fuck with how muffled it is
    setInterval(() => {
      console.log("JR NOTE: distortion: ", amount)
      d.curve = audioFucker.makeDistortionCurve(amount+=1000)
    }, 1000)
  }



}