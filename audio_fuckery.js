/*
at a bare mininum i want this to be able to speed up or slow down a given audio source
for procedural fuckery


*/
//"http://farragofiction.com/Lavinraca/Corn/audio/web_Music_wind1.mp3"
//http://farragnarok.com/PodCasts/zampanio.mp3

class AudioFucker {
  audioCtx = new AudioContext();
  //fast, slow, i seem to recall negative doesn't work
  //https://stackoverflow.com/questions/9874167/how-can-i-play-audio-in-reverse-with-web-audio-api
  playBackRate = 1.0;

  playURL = (url) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.play(audioBuffer)
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
  playURLWithOptionalStep = (url, optionalStep) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.play(audioBuffer, optionalStep)

      });
  }

  playURLExperiment = (url) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const filter = this.audioCtx.createBiquadFilter();
        // Note: the Web Audio spec is moving from constants to strings.
        // filter.type = 'lowpass';
        filter.type = filter.HIGHPASS;
        filter.frequency.value = 100;
        setInterval(() => {
          console.log("JR NOTE: filter.frequency.value  ", filter.frequency.value)
          filter.frequency.value += 100;

        }, 6000)
        this.play(audioBuffer, filter)
      });
  }


  //https://stackoverflow.com/questions/9874167/how-can-i-play-audio-in-reverse-with-web-audio-api
  playURLReverse = (url) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        Array.prototype.reverse.call(audioBuffer.getChannelData(0));
        // Array.prototype.reverse.call(audioBuffer.getChannelData(1));
        this.play(audioBuffer)
      });
  }

  playURLScrombleInChunks = (url, numberChunks) => {
    console.log("JR NOTE: playURLScrombleInChunks", numberChunks)
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        //this sure won't have weird consequences!
        audioBuffer.getChannelData(0).sort();
        console.log("JR NOTE: audio buffer size before chunk scromble", audioBuffer.length, audioBuffer.getChannelData(0).slice(0, 100))
        let tmp = new SeededRandom(13).shuffleInChunks(audioBuffer.getChannelData(0), Math.floor(audioBuffer.length / numberChunks));
        tmp = new Float32Array(tmp.map(a => [...a]).flat()) //array32 is resistent to flat
        console.log("JR NOTE: audio buffer size after chunk scromble", tmp.length, tmp.slice(0, 100))
        audioBuffer.copyToChannel(tmp, 0);
        this.play(audioBuffer)
      });
  }

  playURLScromble = (url) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        //this sure won't have weird consequences!
        console.log("JR NOTE: audio buffer size before scromble", audioBuffer.length, audioBuffer.getChannelData(0).slice(0, 100))

        const tmp = new SeededRandom(13).shuffle(audioBuffer.getChannelData(0));
        this.play(audioBuffer)
        console.log("JR NOTE: audio buffer size after scromble", audioBuffer.length, audioBuffer.getChannelData(0).slice(0, 100))

      });
  }



  play(audioBuffer, optionalSteps) {
    const source = this.audioCtx.createBufferSource();
    source.loop = true;
    source.buffer = audioBuffer;
    if (optionalSteps) {
      //filter is in between source and destination
      const order = [...optionalSteps, this.audioCtx.destination];
      console.log('JR NOTE: order is', order)

      let lastStep = source;
      for (let step of order) {
        console.log("JR NOTE: connectiong",lastStep, "to",step)
        /*
          source.connect(optionalStep);
          optionalStep.connect(this.audioCtx.destination);
        */
          lastStep.connect(step);
          lastStep = step;
          //step.connect(this.audioCtx.destination);
      }

    } else {
      //direct connection
      source.connect(this.audioCtx.destination);

    }
    console.log("JR NOTE: going to start")
    source.start();
  }

}