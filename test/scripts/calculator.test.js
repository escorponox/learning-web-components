const test = require('tape');
const calculator = require('../../src/scripts/calculator-utils');

test('operands', t => {
  t.deepEqual(calculator.appendChar([], '1'), ['1'], '1 adds 1 to empty operand');
  t.deepEqual(calculator.appendChar(['1'], '1'), ['11'], '1 adds 1 to actual operand');
  t.deepEqual(calculator.appendChar(['1'], '.'), ['1.'], '. adds . to actual operand');
  t.deepEqual(calculator.appendChar(['1.'], '.'), ['1.'], '. don\'t add second point to decimal operand');
  t.deepEqual(calculator.appendChar(['1.1'], '.'), ['1.1'], '. don\'t add second point to decimal operand');
  t.deepEqual(calculator.appendChar([], '.'), ['0.'], '. add 0. to new operand');
  t.deepEqual(calculator.appendChar(['1', '+'], '.'), ['1', '+', '0.'], '. add 0. to new operand');
  t.deepEqual(calculator.appendChar([], '0'), [], 'don\'t add left zeroes');
  t.deepEqual(calculator.appendChar(['1', '+'], '0'), ['1', '+'], 'don\'t add left zeroes');
  t.deepEqual(calculator.appendChar(['1'], '0'), ['10'], 'add right zeroes');
  t.end()
});

test('operators', t => {
  t.deepEqual(calculator.appendChar([], '+'), [], 'don\'t add operator at the beginning');
  t.deepEqual(calculator.appendChar(['1'], '*'), ['1', '*'], 'add operator after an operand');
  t.deepEqual(calculator.appendChar(['1', '*'], '*'), ['1', '*'], 'don\'t add operator after an operator');
  t.end();
});