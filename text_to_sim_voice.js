//https://stackoverflow.com/questions/49403285/splitting-word-into-syllables-in-javascript
const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

function syllabify(words) {
    return words.match(syllableRegex);
}

//sounds that are consistent given the same input
//a sort of language
class TextToSimulatedVoice {
    audioCtx = new AudioContext();
    truth

    freq_multiplier;
    speed_multiplier;
    constructor(truth, freq_multiplier, speed_multiplier) {
        this.freq_multiplier = freq_multiplier;
        this.speed_multiplier = speed_multiplier;
        this.truth = truth;
    }

    //words is array of words, with pauses in between
    speak = async (words, rand, truthQuotient) => {
        console.log("JR NOTE: speaking are", { words, rand, truthQuotient })
        if (words.length === 0) {
            return;
        }
        const word = words[0];
        if (!rand) {
            rand = new SeededRandom(13);
        }
        let word_parts = syllabify(word); //can return null for things like JR
        word_parts = word_parts ? word_parts : word;

        //forEach allows async within
        for (let syllable of word_parts) {
            const duration = rand.getRandomNumberBetween(50, 100) * this.speed_multiplier;
            const frequency = syllable.charCodeAt(0) * this.freq_multiplier;
            let real = [];
            let imag = [];
            for (let i = 0; i < syllable.length; i++) {
                real.push(syllable.charCodeAt(i))
                imag.push(syllable.charCodeAt(i))
                real.push(216)
                imag.push(216)
            }


            await this.note(duration, frequency, real, imag);
            if (this.truth) {
                this.truth.renderFrame(syllable, truthQuotient);
            }
            await sleep(rand.getRandomNumberBetween(10, 50)) //small pause between syllables

        }
        await sleep(rand.getRandomNumberBetween(20, 150)) //pause bewteen words
        await this.speak(words.slice(1), rand, truthQuotient);

    }

    note = async (duration, frequency, real, imag) => {
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination)


        const wave = this.audioCtx.createPeriodicWave(real, imag);

        osc.setPeriodicWave(wave);
        osc.frequency.value = frequency;
        osc.connect(this.audioCtx.destination);
        osc.start();
        await sleep(duration)
        gainNode.gain.setValueAtTime(gainNode.gain.value, this.audioCtx.currentTime);

        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.03);
        await sleep(3)
        osc.stop(); //stopping abruptly causes a clicking sound
    }

}