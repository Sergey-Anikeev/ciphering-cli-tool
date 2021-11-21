const fs = require('fs');
const { Readable } = require('stream');

class CustomReadable extends Readable {
    constructor(filePath, options) {
        super(options);
        this.filePath = filePath;
        this.fileDescriptor = null;
    }
    
    _construct(callback) {
      fs.open(this.filePath, (err, fd) => {
        if (err) {
          callback(err);
        } else {
          this.fileDescriptor = fd;
          callback();
        }
      });
    }
  
    _read(size) {
      const buf = Buffer.alloc(size);
      fs.read(this.fileDescriptor, buf, 0, size, null, (err, bytesRead) => {
        if (err) {
          this.destroy(err);
        } else {
          this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
        }
      });
    }
  
    _destroy(err, callback) {
      if (this.fileDescriptor) {
        fs.close(this.fileDescriptor, (er) => callback(er || err));
      } else {
        callback(err);
      }
    }
  }
  
  module.exports = CustomReadable;