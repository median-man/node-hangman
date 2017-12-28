function Letter(value, placeholder) {
  // regex to test for a valide value (placeholders may be any string not matched by value test)
  const reValueTest = /[a-z ]/i;
  if (typeof value !== 'string' || value.length !== 1 || !reValueTest.test(value)) {
    throw new Error('value must be a letter');
  }
  if (typeof placeholder !== 'string' || placeholder.length === 0 || reValueTest.test(placeholder)) {
    throw new Error('placeholder must be a non-empty string');
  }
  this.value = value;
  this.placeholder = placeholder;
  this.isHidden = value !== ' ';
}
Letter.prototype.toString = function letterToString() {
  return this.isHidden ? this.placeholder : this.value;
};

module.exports = Letter;
