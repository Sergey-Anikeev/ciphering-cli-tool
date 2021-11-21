const { Writable } = require('stream');
const fs = require('fs');


class CustomWritable extends Writable {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this.fileDescriptor = null;
  }

  _construct(callback) {
    fs.open(this.filePath, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fileDescriptor = fd;
        fs.appendFile(this.filePath, '\n', callback);
      }
    });
  }

  _write(chunk, encoding, callback) {
    fs.appendFile(this.filePath, chunk.toString(), callback);
  }

  _destroy(err, callback) {
    if (this.fileDescriptor) {
      fs.close(this.fileDescriptor, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
module.exports = CustomWritable;