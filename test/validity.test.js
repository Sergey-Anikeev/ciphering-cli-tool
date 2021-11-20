const { expect } = require('@jest/globals');
const { isFlagsValid, validity } = require('../validity');


test('User does not pass -c or --config argument', () => {
    const mockWrite = jest.spyOn(process.stderr, 'write')
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    validity();
    expect(mockWrite).toHaveBeenCalledWith('\x1b[31mError: you do not pass -c or --config argument\x1b[0m');
    expect(mockExit).toHaveBeenCalledWith(2);
});

test('User passes the same cli argument twice', () => {
    process.argv.push('--config', 'A-R0', '--config', 'R1');
    const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    isFlagsValid('-c', '--config');
    expect(mockWrite).toHaveBeenCalledWith('\x1b[31mError: you provided --config argument more than once\x1b[0m');
    expect(mockExit).toHaveBeenCalledWith(2);
});

test('User passes the same cli argument twice', () => {
    process.argv.push('-c', 'A-R0', '-c', 'R1');
    const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    isFlagsValid('-c', '--config');
    expect(mockWrite).toHaveBeenCalledWith('\x1b[31mError: you provided -c argument more than once\x1b[0m');
    expect(mockExit).toHaveBeenCalledWith(2);
});

test('User passes the same cli argument twice ("-c" and "--config")', () => {
    process.argv.push('-c', 'A-R0', '--config', 'R1');
    const mockWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    isFlagsValid('-c', '--config');
    expect(mockWrite).toHaveBeenCalledWith('\x1b[31mError: you provided -c and --config arguments together\x1b[0m');
    expect(mockExit).toHaveBeenCalledWith(2);
});