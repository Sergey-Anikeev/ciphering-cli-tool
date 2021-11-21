const { expect } = require('@jest/globals');
const path = require('path');
const fs = require('fs');

jest.mock('fs');
const CustomReadable = require('../streams/readable');

it('works', () => {
  const openMock = jest.spyOn(fs, 'open').mockImplementation();
  const readMock = jest.spyOn(fs, 'readFileSync').mockImplementation();
  const mockObj = new CustomReadable( '../input.txt', { highWaterMark: 1 });
  mockObj._read(68)
  // expect(openMock).toHaveBeenCalled();
  expect(readMock).toBeCalledWith();
});