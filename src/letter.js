function Letter(value, placeholder) {
  if (typeof value !== 'string' || value.length !== 1 || !/[a-z]/i.test(value)) {
    throw new Error('value must be a letter');
  }
  if (typeof placeholder !== 'string' || placeholder.length === 0) {
    throw new Error('placeholder must be a non-empty string');
  }
  this.value = value;
  this.placeholder = placeholder;
  this.isHidden = true;
}
Letter.prototype.toString = function letterToString() {
  return this.isHidden ? this.placeholder : this.value;
};

module.exports = Letter;
