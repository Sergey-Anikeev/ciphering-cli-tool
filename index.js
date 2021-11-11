const fs = require('fs');

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

const handleError = () => {
    console.log('My Error');
    readStream.destroy();
    writeStream.end('finished')
}
readStream
    .on('error', handleError)
    .pipe(writeStream)
    .on('error', handleError)