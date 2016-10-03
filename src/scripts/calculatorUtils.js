(function (root, init) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = init();
  } else {
    root.calculator = init();
  }
})(this, function () {

  const calculator = {};

  function isOperator(char) {
    return /^[\+\-\*/]$/.test(char);
  }

  function isOperatorAllowed(arr) {
    return arr.length && !isOperator(arr[arr.length - 1]);
  }

  function isNewOperand(arr) {
    return !arr.length || isOperator(arr[arr.length - 1])
  }

  function isNonZero(char) {
    return /^[1-9]$/.test(char);
  }

  function isAnAllowedOperator(char, arr) {
    return isOperator(char) && isOperatorAllowed(arr);
  }

  function isANewOperandChar(char, arr) {
    return !isOperator(char) && isNewOperand(arr) && char !== '0';
  }

  function isLastDecimal(arr) {
    return arr[arr.length - 1].indexOf('.') > -1;
  }

  function isAnAllowedPoint(char, arr) {
    return char === '.' && (isNewOperand(arr) || !isLastDecimal(arr));
  }

  function isAnAllowedZero(char, arr) {
    return char === '0' && !isNewOperand(arr);
  }

  calculator.appendChar = function (arr, char) {
    if ((isAnAllowedOperator(char, arr))
      || isANewOperandChar(char, arr)) {
      const appendingStr = char === '.' ? '0.' : char;
      return arr.concat(appendingStr);
    }
    if (isNonZero(char)
      || isAnAllowedPoint(char, arr)
      || isAnAllowedZero(char, arr)) {
      return arr.slice(0, arr.length - 1).concat(arr[arr.length - 1] + char);
    }
    return arr;
  };

  calculator.delete = function (arr) {
    if (!arr.length) return [];
    const last = arr[arr.length - 1];
    return last.length === 1 ? arr.slice(0, arr.length - 1)
      : arr.slice(0, arr.length - 1).concat(last.slice(0, last.length - 1));
  };

  calculator.clear = function () {
    return [];
  };

  calculator.equal = function (arr) {
    if (isNewOperand(arr) || arr[arr.length - 1] === '.') return arr;
    const screenString = calculator.displayScreen(arr);
    return [eval(screenString).toString()];
  };

  calculator.displayScreen = function (arr) {
    return arr.reduce(function (prev, curr) {
        if (isOperator(curr)) prev += curr;
        else prev += curr.slice(curr.length - 1) === '.' ? curr : Number(curr).toString();
        return prev;
      }, '') || '0';
  };

  return calculator;
});