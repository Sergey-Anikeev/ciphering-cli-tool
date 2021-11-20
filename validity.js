const fs = require('fs');
const path = require('path');


const isFlagsValid = (flag, flagFull) => {
	const flagIndex = process.argv.indexOf(flag);
	const fullFlagIndex = process.argv.indexOf(flagFull);
	if (flagIndex > 0 && fullFlagIndex > 0) {
		process.stderr.write(`\x1b[31mError: you provided ${flag} and ${flagFull} arguments together\x1b[0m`);
		process.exit(2);
	}
	if (flagIndex != process.argv.lastIndexOf(flag)) {
		process.stderr.write(`\x1b[31mError: you provided ${flag} argument more than once\x1b[0m`);
		process.exit(2);
	}
	if (fullFlagIndex != process.argv.lastIndexOf(flagFull)) {
		process.stderr.write(`\x1b[31mError: you provided ${flagFull} argument more than once\x1b[0m`);
		process.exit(2);
	}
}

const validity = (config, inputFile, outputFile) => {
	if (!config) {
		process.stderr.write(`\x1b[31mError: you do not pass -c or --config argument\x1b[0m`);
		process.exit(2);
		return;
	}
	if (inputFile) {
		const filePath = path.resolve(__dirname, inputFile.trim());
		if (!fs.existsSync(filePath)) {
		process.stderr.write(`\x1b[31mError: input file ${inputFile.trim()} not found at ${filePath}\x1b[0m`);
		process.exit(2);
		}
	} 
	if (outputFile) {
		const filePath = path.resolve(__dirname, outputFile.trim());
		if (!fs.existsSync(filePath)) {
		process.stderr.write(`\x1b[31mError: output file ${outputFile.trim()} not found at ${filePath}\x1b[0m`);
		process.exit(2);
		}
	}
	isFlagsValid('-c', '--config');
	isFlagsValid('-i', '--input');
    isFlagsValid('-o', '--output');

	const configArray = config.split('-');
	const regExConfig = new RegExp(/[ACR][01]?-/g);
	const matchArray = config.match(regExConfig);
	if (configArray.length != matchArray.length + 1) {
		process.stderr.write(`\x1b[31mError: wrong config.${config}\x1b[0m`);
		process.exit(2);
	}
	const regEx1 = new RegExp(/^[CR][01]$/);
	const regEx2 = new RegExp(/^A$/);
	configArray.forEach((el) => {
		if (el.trim().length > 2) {
			process.stderr.write(`\x1b[31mError: wrong config.${config}\x1b[0m`);
			process.exit(2);
		}
		if (!regEx1.test(el.trim())) {
			if (!regEx2.test(el.trim())) {
				process.stderr.write(`\x1b[31mError: wrong config. This part "${el.trim()}" of "${config.trim()}"\x1b[0m`);
				process.exit(2);
			}
		}
	})
	return true;
}
 module.exports = { validity: validity, isFlagsValid: isFlagsValid };

