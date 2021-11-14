const fs = require('fs');
const path = require('path');
const CustomReadable = require('./streams/readable');
const CustomTransform = require('./streams/transform');
const CustomWritable = require('./streams/writable');

function getValue(flag, flagFull) {
    let flagIndex = process.argv.indexOf(flag);
    if (flagIndex == -1) {
      flagIndex = process.argv.indexOf(flagFull);
    }
    return flagIndex !== -1 ? process.argv[flagIndex + 1] : null;
}
const config = getValue('-c', '--config');
const inputFile = getValue('-i', '--input');
const outputFile = getValue('-o', '--output');

if (config) {
    let readableStream
    if (inputFile) {
      readableStream = new CustomReadable(path.resolve(__dirname, inputFile.trim()), { highWaterMark: 1 });
    } else {
      process.stdout.write('\x1b[35m Please enter your message, to exit press CTRL+C: \x1b[0m')
      readableStream = process.stdin;
    }
    let writeStream, outputPath;
    if (outputFile) { 
      outputPath = path.resolve(__dirname, outputFile.trim());
      writeStream = new CustomWritable(outputPath);
    } else {
      writeStream = process.stdout;
    }
    config.trim().split('-').reduce((previous, current) => {
      return previous.pipe(new CustomTransform(current, outputPath));
    }, readableStream).pipe(writeStream)
}
