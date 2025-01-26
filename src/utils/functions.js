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
  mapStatusToLetter(status) {
    switch (status) {
      case 1:
        return "H"; // Hadir
      case 2:
        return "I"; // Izin
      case 3:
        return "S"; // Sakit
      case 4:
        return "A"; // Sakit
      default:
        return "N/A"; // Tidak ada data
    }
  }
}

module.exports = new myFunctions();
