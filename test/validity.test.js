const { expect } = require('@jest/globals');
const path = require('path');
const { isFlagsValid, validity } = require('../validity');

const INCORRECT_CONFIGS = [
    'R1-RA',
    'A2-R0',
    'A-RA',
    'R1-R0-RR',
    'R5-A-A-A',
    'AA-R0-R1',
    'R-4-A'
];

const CORRECT_CONFIGS = [
    'C1-C1-R0-A',
    'C1-C0-A-R1-R0-A-R0-R0-C1-A',
    'A-A-A-R1-R0-R0-R0-C1-C1-A',
    'C1-R1-C0-C0-A-R0-R1-R1-A-C1',
];

CORRECT_CONFIGS.forEach((config) => {
    test(`User passes correct sequence of symbols as argument for --config "${config}" that matches regular expression. Test passed`, () => {
        expect(validity(config)).toBe(true);
    });
})
INCORRECT_CONFIGS.forEach((config) => {
    test(`User passes incorrect symbols "${config}" in argument for --config. Error message is shown`, () => {
        const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
        validity(config);
        expect(mockWrite).toHaveBeenCalledWith(`\x1b[31mError: wrong config. "${config}"\x1b[0m`);
        expect(mockExit).toHaveBeenCalledWith(2);
    });
})


test('User passes -o argument with path to directory that does not exist or with no read access. Error message is shown', () => {
    const filePath = path.resolve(__dirname, '../fakeOutput.txt');
    const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    validity('config', 'input.txt', 'fakeOutput.txt');
    expect(mockWrite).toHaveBeenCalledWith(`\x1b[31mError: output file fakeOutput.txt not found at ${filePath}\x1b[0m`);
    expect(mockExit).toHaveBeenCalledWith(2);
});

test('User passes -i argument with path that does not exist or with no read access. Error message is shown', () => {
    const filePath = path.resolve(__dirname, '../fakeInput.txt');
    const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    validity('config', 'fakeInput.txt');
    expect(mockWrite).toHaveBeenCalledWith(`\x1b[31mError: input file fakeInput.txt not found at ${filePath}\x1b[0m`);
    expect(mockExit).toHaveBeenCalledWith(2);
});

test('User does not pass -c or --config argument. Error message is shown', () => {
    const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    validity();
    expect(mockWrite).toHaveBeenCalledWith('\x1b[31mError: you do not pass -c or --config argument\x1b[0m');
    expect(mockExit).toHaveBeenCalledWith(2);
});

test('User passes the same cli argument twice. Error message is shown', () => {
    process.argv.push('--config', 'A-R0', '--config', 'R1');
    const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    isFlagsValid('-c', '--config');
    expect(mockWrite).toHaveBeenCalledWith('\x1b[31mError: you provided --config argument more than once\x1b[0m');
    expect(mockExit).toHaveBeenCalledWith(2);
});

test('User passes the same cli argument twice. Error message is shown', () => {
    process.argv.push('-c', 'A-R0', '-c', 'R1');
    const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    isFlagsValid('-c', '--config');
    expect(mockWrite).toHaveBeenCalledWith('\x1b[31mError: you provided -c argument more than once\x1b[0m');
    expect(mockExit).toHaveBeenCalledWith(2);
});

test('User passes the same cli argument twice ("-c" and "--config"). Error message is shown', () => {
    process.argv.push('-c', 'A-R0', '--config', 'R1');
    const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    isFlagsValid('-c', '--config');
    expect(mockWrite).toHaveBeenCalledWith('\x1b[31mError: you provided -c and --config arguments together\x1b[0m');
    expect(mockExit).toHaveBeenCalledWith(2);
});