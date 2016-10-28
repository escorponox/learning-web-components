(function (root, init) {
  // Runtime environment check inspired by Jonathan Chan (cusxio)
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = init();
  } else {
    root.validator = init();
  }
})(this, function () {
  var validator = {};

  validator.isEmailAddress = function (input) {
    input = input || '';
    var atIndex = input.indexOf('@');
    return atIndex > 0 && atIndex < input.length - 1 && atIndex === input.lastIndexOf('@');
  };

  validator.isPhoneNumber = function (input) {
    var cleanedInput = input.split('').filter(function (c) {
      return c != ' ';
    }).join('');
    var number = Number(cleanedInput);
    return cleanedInput.length === 9 ? number > 599999999 && number < 1000000000 : false;
  };

  validator.isAlphanumericChar = function (c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
  };

  validator.withoutSymbols = function (input) {
    return input.split('').filter(function (c) {
      return c === ' ' || validator.isAlphanumericChar(c);
    }).join('');
  };

  validator.isDate = function (input) {
    return !isNaN(Date.parse(input));
  };

  validator.isBeforeDate = function (input, reference) {
    var inputDate = Date.parse(input);
    var referenceDate = Date.parse(reference);
    if (isNaN(inputDate) || isNaN(referenceDate)) throw new Error('Error in dates: ' + input + ' - ' + reference);
    return inputDate < referenceDate;
  };

  validator.isAfterDate = function (input, reference) {
    return !validator.isBeforeDate(input, reference);
  };

  validator.isBeforeToday = function (input) {
    var inputDate = Date.parse(input);
    if (isNaN(inputDate)) throw new Error('Error in date: ' + input);
    var today = new Date(new Date().toDateString());
    return inputDate < today;
  };

  validator.isAfterToday = function (input) {
    var inputDate = Date.parse(input);
    if (isNaN(inputDate)) throw new Error('Error in date: ' + input);
    var today = new Date(new Date().toDateString());
    return inputDate > (new Date(today.getTime() + 86399999));
  };

  validator.isEmpty = function (input) {
    if (input === null) return false;
    return input.split('').every(function (c) {
      return c === ' ';
    });
  };

  validator.toLCWordArray = function (str) {
    return str.toLowerCase().split('').reduce(function (prev, curr) {
      if (validator.isAlphanumericChar(curr)) prev[prev.length - 1] += curr;
      else prev.push('');
      return prev;
    }, ['']).filter(function (word) {
      return word.length > 0;
    });
  };

  validator.contains = function (input, words) {
    var inputLCWordArray = validator.toLCWordArray(input);
    return words.some(function (word) {
      return inputLCWordArray.indexOf(word.toLowerCase()) > -1;
    });
  };

  validator.lacks = function (input, words) {
    return !validator.contains(input, words);
  };

  validator.isComposedOf = function (input, strings) {
    return strings.sort(function (a, b) {
      return b.length - a.length;
    }).reduce(function (prev, curr) {
      while (prev.search(curr) > -1) {
        prev = prev.replace(curr, '')
      }
      return prev;
    }, input).split('').every(function (c) {
      return !validator.isAlphanumericChar(c);
    })
  };

  validator.isOneOf = function (input, strings) {
    return strings.indexOf(input) > -1;
  };

  validator.isLength = function (input, n) {
    return input.length <= n;
  };

  validator.isOfLength = function (input, n) {
    return input.length >= n;
  };

  validator.countWords = function (input) {
    return validator.toLCWordArray(input).length;
  };

  validator.lessWordsThan = function (input, n) {
    return validator.countWords(input) <= n;
  };

  validator.moreWordsThan = function (input, n) {
    return validator.countWords(input) >= n;
  };

  validator.isBetween = function (input, floor, ceil) {
    return input >= floor && input <= ceil;
  };

  validator.isTime = function (input) {
    var split = input.split(':');
    return input.length !== 5 || input.indexOf(':') !== 2 ? false :
    split.length === 2 && validator.isBetween(split[0], 0, 23) && validator.isBetween(split[1], 0, 59);
  };

  validator.isAlphanumeric = function (input) {
    return input.split('').every(validator.isAlphanumericChar);
  };

  validator.isCreditCard = function (input) {
    var splitInput = input.split('-');
    return splitInput.length === 1 ? validator.isAlphanumeric(input) && input.length === 16 :
      splitInput.every(function (curr, index, arr) {
        return arr.length === 4 && curr.length === 4 && validator.isAlphanumeric(curr);
      });
  };

  validator.isCSV = function (input) {
    return validator.isBetween(Number(input), 0, 999) && input.trim().length === 3;
  };

  validator.isHexChar = function (c) {
    return (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F') || (c >= '0' && c <= '9');
  };

  validator.isHex = function (input) {
    var splitInput = input.split('');
    return splitInput.shift() !== '#' ? false :
      splitInput.every(function (curr, index, arr) {
        return arr.length === 3 || arr.length === 6 && validator.isHexChar(curr);
      });
  };

  validator.isRGB = function (input) {
    return input.slice(0, 4) !== 'rgb(' || input.slice(input.length - 1) !== ')' ? false :
      input.slice(4, input.length - 2).split(',').every(function (curr, index, arr) {
        return arr.length === 3 && validator.isBetween(Number(curr), 0, 255);
      })
  };

  validator.isHSL = function (input) {
    if (input.slice(0, 4) !== 'hsl(' || input.slice(input.length - 1) !== ')') return false;
    var values = input.slice(4, input.length - 2).split(',');
    return values.length === 3 && validator.isBetween(values.shift(), 0, 360) ?
    validator.isBetween(values.shift(), 0, 1) && validator.isBetween(values.shift(), 0, 1) :
      false;
  };

  validator.isColor = function (input) {
    return validator.isHex(input) || validator.isRGB(input) || validator.isHSL(input);
  };

  validator.isTrimmed = function (input) {
    return input[0] === ' ' || input[input.length - 1] === ' ' ? false :
      input.split('').every(function (curr, index, arr) {
        return curr !== ' ' || arr[index - 1] !== ' ';
      });
  };

  validator.addValidation = function (selector, events, showError, msg) {
    [].forEach.call(document.querySelectorAll(selector), function (input) {
      events.forEach(function (event) {
        input.addEventListener(event, function () {
          if (showError(input)) {
            input.nextElementSibling.innerHTML = msg;
            input.setCustomValidity(msg);
          }
          else {
            input.setCustomValidity('');
          }
        });
      });
    });
  };

  validator.addOK = function (selector, events, show) {
    [].forEach.call(document.querySelectorAll(selector), function (input) {
      events.forEach(function (event) {
        input.addEventListener(event, function () {
          input.previousElementSibling.style.display = show(input) ? 'inline-block' : 'none';
        });
      });
    });
  };

  return validator;
});
