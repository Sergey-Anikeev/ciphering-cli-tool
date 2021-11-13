const { Transform } = require('stream');

class CaesarTransform extends Transform {
  constructor() {
      super();
  }

  _transform (data, encoding, callback) {
    this.push(data.toString() + '1');
    callback();
  };
}

module.exports = CaesarTransform;