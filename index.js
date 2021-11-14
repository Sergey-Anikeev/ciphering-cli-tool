const fs = require('fs');
const CustomReadable = require('./streams/readable');
const CustomTransform = require('./streams/transform');

const writeStream = fs.createWriteStream('output.txt', { flags: 'a+'});

function getValue(flag) {
    const flagIndex = process.argv.indexOf(flag);
    return flagIndex !== -1 ? process.argv[flagIndex + 1] : null;
}
const config = getValue('-c');

const inputFile = '/input.txt';

if (config) {
    let readableStream
    if (inputFile) {
      readableStream = new CustomReadable(__dirname + inputFile, { highWaterMark: 1 });
    } else {
      readableStream = process.stdin;
    }
    config.trim().split('-').reduce((previous, current) => {
      return previous.pipe(new CustomTransform(current));
    }, readableStream).pipe(writeStream)

}
  // readableStream.pipe(caesarTransform).pipe(writeStream)

// -c " C1-C1-R0-A " -i " ./input.txt " -o " ./output.txt "