let dragging = false;

let real = [];
let imag = [];

window.onload = () => {

  let button = document.querySelector('#speak-button');
  let wordsInput =document.querySelector('#input-words');

  let freqSlider = document.querySelector('#freq-input');
  let freqLabel =document.querySelector('#current-frequency');
  freqLabel.innerText = 'Current Frequency Multiplier: '+ freqSlider.value;

  const textVoiceSim = new TextToSimulatedVoice(1.0,1.0);

  button.onclick = ()=>{
    textVoiceSim.speak(wordsInput.value.split(" "));
  }

  freqSlider.oninput = ()=>{
    freqLabel.innerText = 'Current Frequency Multiplier: '+ freqSlider.value;
    textVoiceSim.freq_multiplier = freqSlider.value
  }


  let clicked = false;
  window.onclick = ()=>{
    !clicked && base_loop();
   clicked = true;
  }
  
  /*window.onmousedown = (e) => {
    dragging = true;
  };

  window.onmouseup = (e) => {
    dragging = false;
    play();
  };

  window.onmousemove = (e) => {
    if (dragging) {
      beepTest(e.clientX, e.clientY);
    }
  };*/

}

//seeded random internal so it should sound the same way every time
const speak = async (words,rand)=>{
  console.log("JR NOTE: trying to speak",words)
  if(!rand){
     rand = new SeededRandom(13);

  }
  console.log("JR NOTE: rand is",rand)
  if(!words.trim()){
    return;
  }
  const duration = rand.getRandomNumberBetween(50,100);
  const frequency = words.charCodeAt(0);
  let real = [];
  let imag = [];
  for(let i = 0; i<words.length; i++){
    real.push(words.charCodeAt(i))
    imag.push(words.charCodeAt(i))
    real.push(216)
    imag.push(216)
  }
  console.log("JR NOTE: trying to speak",{duration,frequency,real,imag})

  await note(duration, frequency, real, imag);
  speak(words.substring(1),rand);
}

//higher frequency, short duration
const melody_loop = async ()=>{
  const duration = getRandomNumberBetween(10,3000);
  const frequency = getRandomNumberBetween(50,200);
  let real = [];
  let imag = [];
  let length = getRandomNumberBetween(2,100);
  for(let i = 0; i<length; i++){
    real.push(getRandomNumberBetween(0,10))
    imag.push(getRandomNumberBetween(0,10))
  }
  await note(duration, frequency, real, imag);
  melody_loop();
}

//low frequency, long duration
const base_loop = async ()=>{
  const duration = getRandomNumberBetween(10000,60000);
  const frequency = getRandomNumberBetween(0,10);
  let real = [];
  let imag = [];
  let length = getRandomNumberBetween(2,100);
  for(let i = 0; i<length; i++){
    real.push(getRandomNumberBetween(0,10))
    imag.push(getRandomNumberBetween(0,10))
  }
  await note(duration, frequency, real, imag);
  base_loop();
}


const note = async(duration, frequency, real, imag)=>{
  const audioCtx = new AudioContext();
  const osc = audioCtx.createOscillator();

  const wave = audioCtx.createPeriodicWave(real, imag);

  osc.setPeriodicWave(wave);
  osc.frequency.value = frequency;
  osc.connect(audioCtx.destination);
  osc.start();
  await sleep(duration)
  osc.stop();
}

const play = async () => {
  const audioCtx = new AudioContext();
  const osc = audioCtx.createOscillator();

  const wave = audioCtx.createPeriodicWave(real, imag);

  osc.setPeriodicWave(wave);
  osc.frequency.value = 90;
  osc.connect(audioCtx.destination);
  osc.start();
  await sleep(1000)
  osc.stop(1);
}

const beepTest = (x, y) => {
  console.log("JR NOTE: collectin gnotes")
  real.push(x);
  real.push(y);
  imag.push(y);
  imag.push(x);
}

