class myFunctions {
   getRandomDigit = (digit) => {
    return Math.floor(Math.random() * 10000)
      .toString()
      .padStart(digit, "0");
  };
}

module.exports = new myFunctions();