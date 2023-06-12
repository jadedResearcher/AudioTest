//sounds that are consistent given the same input
//a sort of language
class TextToSimulatedVoice {
    audioCtx = new AudioContext();

    freq_multiplier;
    speed_multiplier;
    constructor(freq_multiplier, speed_multiplier) {
        this.freq_multiplier = freq_multiplier;
        this.speed_multiplier = speed_multiplier;
    }

    speak = async (words, rand) => {
        if (!rand) {
            rand = new SeededRandom(13);
        }
        if (!words.trim()) {
            return;
        }
        const duration = rand.getRandomNumberBetween(50, 100) * this.speed_multiplier;
        const frequency = words.charCodeAt(0) * this.freq_multiplier;
        let real = [];
        let imag = [];
        for (let i = 0; i < words.length; i++) {
            real.push(words.charCodeAt(i))
            imag.push(words.charCodeAt(i))
            real.push(216)
            imag.push(216)
        }

        await this.note(duration, frequency, real, imag);
        this.speak(words.substring(1), rand);
    }

    note = async (duration, frequency, real, imag) => {
        const osc = this.audioCtx.createOscillator();

        const wave = this.audioCtx.createPeriodicWave(real, imag);

        osc.setPeriodicWave(wave);
        osc.frequency.value = frequency;
        osc.connect(this.audioCtx.destination);
        osc.start();
        await sleep(duration)
        osc.stop();
    }




}