const { Transform } = require('stream');
const fs = require('fs');

const alphLower = 'abcdefghijklmnopqrstuvwxyz';
const alphUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABET_LENGTH = 26;

const encryptFunc = (data, shift, obj) => {
  let letterNum 
  letterNum = alphLower.indexOf(data.toString());
  if (shift === 0) {
    if (letterNum === -1) {
      letterNum = alphUpper.indexOf(data.toString());
      if (letterNum === -1) {
        obj.push(data);
        return;
      }
      obj.push(alphUpper[25 - letterNum]);
      return;
    }
    obj.push(alphLower[25 - letterNum]);
    return;
  }
  if (letterNum === -1) {
    letterNum = alphUpper.indexOf(data.toString());
    if (letterNum === -1) {
      obj.push(data);
      return;
    }
    obj.push(alphUpper[(letterNum + shift + ALPHABET_LENGTH) % ALPHABET_LENGTH]);
    return;
  }
  obj.push(alphLower[(letterNum + shift + ALPHABET_LENGTH) % ALPHABET_LENGTH]);
}



class CustomTransform extends Transform {
  constructor(config, outputFile) {
      super();
      this.config = config;
      this.outputFile = outputFile;
  }

  _transform (data, encoding, callback) {
    let shift;
    switch (this.config[0]) {
      case 'C':
        shift = 1;
        break;
      case 'R':
        shift = 8;
        break;
      case 'A':
        shift = 0;
        break;
    }
    if (this.config[1] == false) {
      shift *= -1;
    }
    if (data.toString().length > 1) {
      if (!this.outputFile) {
        process.stdout.write('\x1b[32m')
      } else {
        fs.appendFile(this.outputFile, '\n', callback);
      }
      const arrData = data.toString().slice(0, data.toString().length - 2);
      arrData.split('').forEach((el) => {
        encryptFunc(el, shift, this);
      });
      if (!this.outputFile) {
        process.stdout.write('\n\x1b[0m');
        callback();
      } 
    } else {
      encryptFunc(data, shift, this);
      callback();
    }
  };
}

module.exports = CustomTransform;
