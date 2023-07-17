window.onload = () => {
  const audioFucker = new AudioFucker();
  const url = "http://farragnarok.com/PodCasts/oinapmaz.mp3";

  //const url = 'http://farragnarok.com/PodCasts/fuck2.mp3'
  const container = document.querySelector("#audio-test");
  const regularPlay = createElementWithClassAndParent("button", container);
  regularPlay.innerText = "Play Audio Normal";
  regularPlay.onclick = () => {
    console.log("JR NOTE: click")
    audioFucker.playURL(url,1.0);
  }

  const fast = createElementWithClassAndParent("button", container);
  fast.innerText = "Play Audio Fast";
  fast.onclick = () => {
    console.log("JR NOTE: click")
    audioFucker.playURL(url,2.0);
  }

  const slow = createElementWithClassAndParent("button", container);
  slow.innerText = "Play Audio Slow";
  slow.onclick = () => {
    console.log("JR NOTE: click")
    audioFucker.playURL(url,0.5);
  }

  const cslow = createElementWithClassAndParent("button", container);
  cslow.innerText = "Current Audio Slow";
  cslow.onclick = () => {
    console.log("JR NOTE: click")
    audioFucker.setPlayBackRate(0.5)
  }

  const cfast = createElementWithClassAndParent("button", container);
  cfast.innerText = "Current Audio Fast";
  cfast.onclick = () => {
    console.log("JR NOTE: click")
    audioFucker.setPlayBackRate(2)
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
    await audioFucker.playURLWithOptionalStep(url, 1,[filter]);
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

    await audioFucker.playURLWithOptionalStep(url,1, [d]);
    //JR NOTE: the below works, so we can fuck with how muffled it is
    setInterval(() => {
      console.log("JR NOTE: distortion: ", amount)
      d.curve = audioFucker.makeDistortionCurve(amount += 1000)
    }, 1000)
  }

  const distortion2 = createElementWithClassAndParent("button", container);
  distortion2.innerText = "Play Distorted And Muffled Audio";
  distortion2.onclick = async () => {
    console.log("JR NOTE: click")
    let amount = 400;
    let d = audioFucker.distortion(amount);
    const filter = audioFucker.muffleFilter();

    await audioFucker.playURLWithOptionalStep(url,1, [d, filter]);
    //JR NOTE: the below works, so we can fuck with how muffled it is
    setInterval(() => {
      console.log("JR NOTE: distortion: ", amount)
      d.curve = audioFucker.makeDistortionCurve(amount += 1000)
    }, 1000)
  }


  const convolverTest = createElementWithClassAndParent("button", container);
  convolverTest.innerText = "Play Audio With Reverb";
  convolverTest.onclick = async () => {
    console.log("JR NOTE: click")
    const c = await audioFucker.convolverFromURL("http://farragofiction.com/AudioTest/audio/spring.wav");
    await audioFucker.playURLWithOptionalStep(url,1, [c]);
  }

  
  const corn = createElementWithClassAndParent("button", container);
  corn.innerText = "Play Audio Like You're In a CornField";
  corn.onclick = async () => {
    console.log("JR NOTE: click")
    const c = await audioFucker.convolverFromURL("http://farragofiction.com/AudioTest/audio/Plane%20Grass%2001%200m%20Stereo.wav");
    await audioFucker.playURLWithOptionalStep(url,1, [c]);
  }


  const alley = createElementWithClassAndParent("button", container);
  alley.innerText = "Play Audio Like You're In a Creepy Alleyway";
  alley.onclick = async () => {
    console.log("JR NOTE: click")
    const c = await audioFucker.convolverFromURL("http://farragofiction.com/AudioTest/audio/Alley%2001%2045m%20Stereo.wav");
    await audioFucker.playURLWithOptionalStep(url,1, [c]);
  }


  const waste = createElementWithClassAndParent("button", container);
  waste.innerText = "Play Audio Like You're In a Waste Basket For Some Reason";
  waste.onclick = async () => {
    console.log("JR NOTE: click")
    const c = await audioFucker.convolverFromURL("http://farragofiction.com/AudioTest/audio/Waste%20Basket.wav");
    await audioFucker.playURLWithOptionalStep(url,1, [c]);
  }

  const weirdShit = createElementWithClassAndParent("button", container);
  weirdShit.innerText = "Turn Audio Into Eldritch Singing";
  weirdShit.onclick = async () => {
    console.log("JR NOTE: click")
    const c = await audioFucker.convolverFromURL("http://farragofiction.com/AudioTest/audio/Gushed%20Out%20Great%20Globs.wav");
    await audioFucker.playURLWithOptionalStep(url,1, [c]);
  }

  const weirdShit2 = createElementWithClassAndParent("button", container);
  weirdShit2.innerText = "Audio gets more reverb over time";
  weirdShit2.onclick = async () => {
    console.log("JR NOTE: click")
    const c = await audioFucker.convolverFromURL("http://farragofiction.com/AudioTest/audio/Withering%20in%20the%20Duldrums%20of%20Middle%20Age.wav");
    await audioFucker.playURLWithOptionalStep(url,1, [c]);

    let sourceGain = 1.0;
    let effectGAin = 0.1;
    audioFucker.setBalanceBetweenDryAndWet(sourceGain, effectGAin)

    setInterval(() => {
      audioFucker.setBalanceBetweenDryAndWet(sourceGain+=-0.1,effectGAin+=0.1)
    }, 3000)
  }


}