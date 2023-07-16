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

  playURLScrombleInChunks = (url) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        //this sure won't have weird consequences!
       audioBuffer.getChannelData(0).sort();
       const tmp = new SeededRandom(13).chunkShuffle(audioBuffer.getChannelData(0));
       this.play(audioBuffer)
      });
  }

  playURLScromble = (url) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        //this sure won't have weird consequences!
        const tmp = new SeededRandom(13).shuffle(audioBuffer.getChannelData(0));
        this.play(audioBuffer)
      });
  }



  play(audioBuffer) {
    const source = this.audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioCtx.destination);
    source.start();
  }

}