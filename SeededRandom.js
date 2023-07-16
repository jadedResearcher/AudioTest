//https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use


class SeededRandom {
  internal_seed;
  initial_seed;

  constructor(seed) {
    this.initial_seed = seed;
    this.internal_seed = seed;
  }

  //default is zero and one, type is inferred to be a number from this
  nextDouble = (min = 0, max = 1) => {
    this.internal_seed = (this.internal_seed * 1664525 + 1013904223) % 4294967296;
    const rnd = this.internal_seed / 4294967296;
    return min + rnd * (max - min);
  }

  getRandomNumberBetween = (min, max) => {
    return Math.floor(this.nextDouble() * (max - min + 1)) + min;
  }

  pickFrom = (array) => {
    return array[this.getRandomNumberBetween(0, array.length - 1)];
  }
  //if you have say, a string "hello world my name is"
  //and you have a chunk size of 3, you'd get something like
  //"worhel na islo " etc
  shuffleInChunks = (array, chunkSize) => {
    console.log("JR NOTE: shuffleInChunks",chunkSize)

    const chunks = chunkUpArray(array, chunkSize);
    this.shuffle(chunks);
    console.log("JR NOTE: shuffleInChunks going to return")
    return chunks.flat();
  }

  shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(this.nextDouble() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}

