/*
at a bare mininum i want this to be able to speed up or slow down a given audio source
for procedural fuckery


*/
//"http://farragofiction.com/Lavinraca/Corn/audio/web_Music_wind1.mp3"
//http://farragnarok.com/PodCasts/zampanio.mp3

class AudioFucker {
  audioCtx = new AudioContext();
  //it is almost midnight and im only 30% sure im using these terms correctly
  //controls the volume of the original source
  dryGainNode;
  //controls the volume of the modified source
  wetGainNode;
  sourceNode;
  //fast, slow, i seem to recall negative doesn't work
  //https://stackoverflow.com/questions/9874167/how-can-i-play-audio-in-reverse-with-web-audio-api
  playBackRate = 1.0;

  playURL = (url, playBackRate) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.play(audioBuffer, playBackRate)
      });
  }
  makeDistortionCurve = (amount) => {
    let k = typeof amount === "number" ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for (; i < n_samples; ++i) {
      x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  convolverFromURL = (url) => {
    const convolver = this.audioCtx.createConvolver();
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        //im following https://mdn.github.io/webaudio-examples/voice-change-o-matic/ what is this for???
        const soundSource = this.audioCtx.createBufferSource();
        convolver.buffer = audioBuffer;
      });

    return convolver;

  }

  distortion = (amount) => {
    const distortion = this.audioCtx.createWaveShaper();
    distortion.oversample = "4x"
    distortion.curve = this.makeDistortionCurve(amount);
    return distortion;
  }

  muffleFilter = () => {
    const filter = this.audioCtx.createBiquadFilter();
    // Note: the Web Audio spec is moving from constants to strings.
    // filter.type = 'lowpass';
    filter.type = filter.LOWPASS;
    filter.frequency.value = 100;
    return filter;
  }

  //pass in a filter or a convolution, something to be played between source and destination
  //filers can be changed over time, but convolutions are all or nothing.
  playURLWithOptionalStep = (url, playBackRate, optionalStep) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.play(audioBuffer, playBackRate, optionalStep)

      });
  }


  //https://stackoverflow.com/questions/9874167/how-can-i-play-audio-in-reverse-with-web-audio-api
  playURLReverse = (url, playBackRate) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        Array.prototype.reverse.call(audioBuffer.getChannelData(0));
        // Array.prototype.reverse.call(audioBuffer.getChannelData(1));
        this.play(audioBuffer, playBackRate)
      });
  }


  playURLScromble = (url, playBackRate) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        //this sure won't have weird consequences!
        console.log("JR NOTE: audio buffer size before scromble", audioBuffer.length, audioBuffer.getChannelData(0).slice(0, 100))

        const tmp = new SeededRandom(13).shuffle(audioBuffer.getChannelData(0));
        this.play(audioBuffer, playBackRate)
        console.log("JR NOTE: audio buffer size after scromble", audioBuffer.length, audioBuffer.getChannelData(0).slice(0, 100))

      });
  }


  setBalanceBetweenDryAndWet = (dry, wet) => {
    console.log("JR NOTE: wet the drys",wet,dry)
    if (this.dryGainNode) {
      this.dryGainNode.gain.value = dry;
    }

    if (this.wetGainNode) {
      this.wetGainNode.gain.value = wet;
    }
  }

  setPlayBackRate = (rate) => {
    console.log("JR NOTE: trying to set playback rate for", this.sourceNode)
    if (this.sourceNode) {
      this.sourceNode.playbackRate.value = rate;
    }
  }



  //returns an array of gain nodes you can control
  play(audioBuffer, playbackRate = 1, optionalSteps) {
    const source = this.audioCtx.createBufferSource();
    if (playbackRate) {
      source.playbackRate.value = playbackRate;
    }

    this.sourceNode = source;
    this.gainNodes = [];
    source.loop = true;
    source.buffer = audioBuffer;

    this.wetGainNode = this.audioCtx.createGain();
    source.connect(this.wetGainNode);

    this.dryGainNode = this.audioCtx.createGain();
    source.connect(this.dryGainNode);



    if (optionalSteps) {
      //filter is in between source and destination

      let lastStep = source;
      for (let step of optionalSteps) {
        console.log("JR NOTE: connectiong", lastStep, "to", step)
        /*
          source.connect(optionalStep);
          optionalStep.connect(this.audioCtx.destination);
        */
        lastStep.connect(step);

        lastStep = step;

        //step.connect(this.audioCtx.destination);
      }
      lastStep.connect(this.wetGainNode);

      this.wetGainNode.connect(this.audioCtx.destination);


    }


    this.dryGainNode.connect(this.audioCtx.destination);


    this.gainNodes.push()
    console.log("JR NOTE: going to start")
    source.start();

  }

}