const fs = require('fs');
const CustomReadable = require('./streams/readable');
const CaesarTransform = require('./streams/transform');

const writeStream = fs.createWriteStream('output.txt', { flags: 'a+'});

function getValue(flag) {
    const flagIndex = process.argv.indexOf(flag);
    return flagIndex !== -1 ? process.argv[flagIndex + 1] : null;
}
const message = getValue('-c');
console.log(message);

if (message) {
    const arr = message.split('-');
}

  const file = '/input.txt';

  const readableStream = new CustomReadable(__dirname + file, { highWaterMark: 1 })
  const caesarTransform = new CaesarTransform(1);
  readableStream.pipe(caesarTransform).pipe(writeStream)

// -c " C1-C1-R0-A " -i " ./input.txt " -o " ./output.txt "