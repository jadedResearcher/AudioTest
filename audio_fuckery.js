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

  playURLMuffled = (url) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const filter = this.audioCtx.createBiquadFilter();
        // Note: the Web Audio spec is moving from constants to strings.
        // filter.type = 'lowpass';
        filter.type = filter.LOWPASS;
        filter.frequency.value = 100;
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



  play(audioBuffer, optionalFilter) {
    const source = this.audioCtx.createBufferSource();
    source.loop = true;
    source.buffer = audioBuffer;
    if (optionalFilter) {
      //filter is in between source and destination
      source.connect(optionalFilter);
      optionalFilter.connect(this.audioCtx.destination);
    }else{
      //direct connection
      source.connect(this.audioCtx.destination);

    }
    source.start();
  }

}