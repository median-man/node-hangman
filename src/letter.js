function Letter(value) {
  // set to true if value is a letter
  this.isHidden = /[a-z]/i.test(value);
  this.string = value;
}

module.exports = Letter;
