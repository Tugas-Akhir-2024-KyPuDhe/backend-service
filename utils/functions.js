class myFunctions {
  getRandomDigit = (digit) => {
    return Math.floor(Math.random() * 10000)
      .toString()
      .padStart(digit, "0");
  };
  fileName(fileName) {
    let sanitized = fileName.replace(/\s+/g, "_");
    sanitized = sanitized.replace(/[^\w\._-]/g, "");
    if (sanitized.startsWith(".")) {
      sanitized = sanitized.substring(1);
    }
    return sanitized;
  }
}

module.exports = new myFunctions();
