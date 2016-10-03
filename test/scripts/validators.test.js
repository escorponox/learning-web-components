var test = require('tape');
var validator = require('../../src/scripts/validators');

test('email', (t) => {
  t.equal(validator.isEmailAddress(), false, 'no input should return false, waiting for response on QA');
  t.equal(validator.isEmailAddress(''), false, 'empty string is not an email address');
  t.equal(validator.isEmailAddress('lala@la.com'), true, 'lala@la.com is a valid email address');
  t.equal(validator.isEmailAddress('@la.com'), false, '@la.com is not a valid email address');
  t.equal(validator.isEmailAddress('lala@'), false, 'lala@ is not a valid email address');
  t.equal(validator.isEmailAddress('@'), false, '@ is not a valid email address');
  t.equal(validator.isEmailAddress('lala@lala@lala.com'), false, 'lala@lala@lala.com is not a valid email addres');
  t.end();
});

test('phone', (t) => {
  t.equal(validator.isPhoneNumber(''), false, 'empty string is not a phone number');
  t.equal(validator.isPhoneNumber(' 98 989 aas 999a    '), false, ' 98 989 aas 999a     is not a phone number');
  t.equal(validator.isPhoneNumber('523456789'), false, '523456789 is not a phone number');
  t.equal(validator.isPhoneNumber('623456789'), true, '623456789 is a phone number');
  t.equal(validator.isPhoneNumber('1000000000'), false, '1000000000 is not a phone number');
  t.equal(validator.isPhoneNumber('623456789.90'), false, '623456789.90 is a phone number');
  t.end();
});

test('withoutSymbols', (t) => {
  t.equal(validator.withoutSymbols('a'), 'a', '\'a\' returns \'a\'');
  t.equal(validator.withoutSymbols('a '), 'a ', '\'a \' returns \'a \'');
  t.equal(validator.withoutSymbols('a -'), 'a ', '\'a -\' returns \'a \'');
  t.equal(validator.withoutSymbols('a z - A'), 'a z  A', '\'a z - A\' returns \'a z  A\'');
  t.equal(validator.withoutSymbols('a z 109 - A'), 'a z 109  A', '\'a z 109 - A\' returns \'a z 109  A\'');
  t.equal(validator.withoutSymbols('a z 109 - A!@#$%^&*()_+'), 'a z 109  A', '\'a z 109 - A!@#$%^&*()_+\' returns \'a z 109  A\'');
  t.end();
});

test('date', (t) => {
  t.equal(validator.isDate('lalal'), false, 'lalala is not a date');
  t.equal(validator.isDate('12/11/16'), true, '12/11/16 is a date');
  t.equal(validator.isDate('12/11/16 18:00'), true, '12/11/16 18:00 is a date');
  t.equal(validator.isDate('02/31/16 18:00'), true, '02/31/16 18:00 is a extraneous date');
  t.equal(validator.isDate('04/31/16 18:00'), true, '04/31/16 18:00 is a extraneous date');
  t.equal(validator.isDate('13/02/16 18:00'), false, '13/02/16 18:00 is not a date');
  t.equal(validator.isDate('04/32/16 18:00'), false, '04/32/16 18:00 is not a date');
  t.end();
});

test('time', t => {
  t.equal(validator.isTime('lalala'), false, 'lalala is not time');
  t.equal(validator.isTime('00:00'), true, '00:00 is time');
  t.equal(validator.isTime('00:59'), true, '00:59 is time');
  t.equal(validator.isTime('23:59'), true, '23:59 is time');
  t.equal(validator.isTime('24:59'), false, '24:59 is not time');
  t.equal(validator.isTime('23:60'), false, '23:60 is not time');
  t.end();
});


test('beforeDate', (t) => {
  t.throws(validator.isBeforeDate.bind(null, 'lalala', '12/11/79 18:01'), /Error in dates:/, 'no input date should throw error');
  t.throws(validator.isBeforeDate.bind(null, '12/11/79 18:01', 'lalala'), /Error in dates:/, 'no reference date should throw error');
  t.equal(validator.isBeforeDate('12/11/79 18:00', '12/11/79 18:01'), true, '12/11/79 18:00 is before 12/11/79 18:01');
  t.equal(validator.isBeforeDate('12/11/79 18:00', '12/11/79 17:59'), false, '12/11/79 18:00 is not before 12/11/79 17:59');
  t.equal(validator.isBeforeDate('10-10-2016', '4-5-2012'), false, '10-10-2016 is not before 4-5-2012');
  t.equal(validator.isBeforeDate('10-10-2016', '10-12-2016'), true, '10-10-2016 is before 10-12-2016');
  t.end();
});

test('afterDate', (t) => {
  t.throws(validator.isAfterDate.bind(null, 'lalala', '12/11/79 18:01'), /Error in dates:/, 'no input date should throw error');
  t.throws(validator.isAfterDate.bind(null, '12/11/79 18:01', 'lalala'), /Error in dates:/, 'no reference date should throw error');
  t.equal(validator.isAfterDate('12/11/79 18:00', '12/11/79 18:01'), false, '12/11/79 18:00 is not after 12/11/79 18:01');
  t.equal(validator.isAfterDate('12/11/79 18:00', '12/11/79 17:59'), true, '12/11/79 18:00 is after 12/11/79 17:59');
  t.equal(validator.isAfterDate('10-10-2016', '4-5-2012'), true, '10-10-2016 is after 4-5-2012');
  t.equal(validator.isAfterDate('10-10-2016', '10-12-2016'), false, '10-10-2016 is not after 10-12-2016');
  t.end();
});

test('beforeToday', (t) => {
  t.throws(validator.isBeforeToday.bind(null, 'lalala'), /Error in date:/, 'no input date should throw error');
  t.equal(validator.isBeforeToday(new Date()), false, 'Now is not before today');
  t.equal(validator.isBeforeToday(new Date(Date.now() - 86400000)), true, '24h before is before today');
  t.end();
});

test('afterToday', (t) => {
  t.throws(validator.isAfterToday.bind(null, 'lololo'), /Error in date:/, 'no input date should throw error');
  t.equal(validator.isAfterToday(new Date()), false, 'Now is not after today');
  t.equal(validator.isAfterToday(new Date(Date.now() + 86400000)), true, '24h after is after today');
  t.end();
});

test('empty', t => {
  t.equal(validator.isEmpty(null), false, 'null returns false');
  t.equal(validator.isEmpty(''), true, '\'\' returns true');
  t.equal(validator.isEmpty(' '), true, '\' \' returns true');
  t.equal(validator.isEmpty('  '), true, '\'  \' returns true');
  t.equal(validator.isEmpty('Visiting new places is fun.'), false, '\'Visiting new places is fun.\' returns false');
  t.end();
});

test('contains', t => {
  t.equal(validator.contains("Visiting new places is fun.", ["coconut"]), false, 'It does not contain coconut');
  t.equal(validator.contains("--Visiting new places is fun.", ["aces"]), false, 'It does not contain aces');
  t.equal(validator.contains("Visiting new places is fun.", ["places"]), true, 'It contains places');
  t.equal(validator.contains('"Definitely," he said in a matter-of-fact tone.', ["matter", "definitely"]), true, 'word and case-insensitive');
  t.end();
});

test('lacks', t => {
  t.equal(validator.lacks("Visiting new places is fun.", ["coconut"]), true, 'It lacks coconut');
  t.equal(validator.lacks("--Visiting new places is fun.", ["aces"]), true, 'It lacks aces');
  t.equal(validator.lacks("Visiting new places is fun.", ["places"]), false, 'It does not lack places');
  t.equal(validator.lacks('"Definitely," he said in a matter-of-fact tone.', ["matter", "definitely"]), false, 'word and case-insensitive');
  t.end();
});

test('isComposedOf', t => {
  t.equal(validator.isComposedOf('lalala lololo lululu lilili', ['lalala', 'lololo', 'lululu']), false);
  t.equal(validator.isComposedOf("10184", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]), true, '"10184" is composed of numbers');
  t.equal(validator.isComposedOf("I am ready.", ["I", "I'm", "am", "not", "ready"]), true, 'I am ready');
  t.equal(validator.isComposedOf("Iamnotready.", ["I", "I'm", "am", "not", "ready"]), true, 'Iamnotready.');
  t.equal(validator.isComposedOf("Amazon.", ["Ama", "Amazon"]), true, 'Amazon.');
  t.end();
});

test('isOneOf', t => {
  t.equal(validator.isOneOf('lilili', ['lalala', 'lololo', 'lululu']), false);
  t.equal(validator.isOneOf('lalala', ['lalala', 'lololo', 'lululu']), true);
  t.equal(validator.isOneOf("10", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]), false);
  t.equal(validator.isOneOf("1", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]), true);
  t.equal(validator.isOneOf("ready", ["I", "I'm", "am", "not", "ready"]), true);
  t.equal(validator.isOneOf("hello", ["I", "I'm", "am", "not", "ready"]), false);
  t.equal(validator.isOneOf("Amazon", ["Ama", "Amazon"]), true, 'Amazon');
  t.end();
});

test('isLength', t => {
  t.equal(validator.isLength("123456789", 6), false, '"123456789" is greater than 6');
  t.equal(validator.isLength("123456789", 20), true, '"123456789" is less than 20');
  t.equal(validator.isLength("AHHHH", 25), true, '"AHHHH" is less than 25');
  t.equal(validator.isLength("This could be a tweet!", 140), true, '"This could be a tweet!" is less than 140');
  t.end();
});

test('isOfLength', t => {
  t.equal(validator.isOfLength("123456789", 6), true, '"123456789" is greater than 6');
  t.equal(validator.isOfLength("123456789", 20), false, '"123456789" is less than 20');
  t.equal(validator.isOfLength("AHHHH", 25), false, '"AHHHH" is less than 25');
  t.equal(validator.isOfLength("This could be a tweet!", 140), false, '"This could be a tweet!" is less than 140');
  t.end();
});

test('countWords', t => {
  t.equal(validator.countWords("Hello."), 1, '"Hello." has 1 word');
  t.equal(validator.countWords("Hard-to-type-really-fast!"), 5, '"Hard-to-type-really-fast!" has 5 words');
  t.equal(validator.countWords(""), 0, '"" has 0 words');
  t.equal(validator.countWords("supercalifragilisticexpialidocious"), 1, '"supercalifragilisticexpialidocious" has 1 word');
  t.end();
});

test('isBetween', t => {
  t.equal(validator.isBetween(1, 1, 2), true, '1 is between 1 and 2');
  t.equal(validator.isBetween(2, 1, 2), true, '2 is between 1 and 2');
  t.equal(validator.isBetween(0.999, 1, 2), false, '0.999 is not between 1 and 2');
  t.end();
});

test('isAlphaNumeric', t => {
  t.equal(validator.isAlphanumeric("Hello."), false, '"Hello." is not alphanumeric');
  t.equal(validator.isAlphanumeric("slam poetry"), false, '"slam poetry" is not alphanumeric');
  t.equal(validator.isAlphanumeric(""), true, '"" is alphanumeric');
  t.equal(validator.isAlphanumeric("ArTᴉ$ʰARd"), false, '"ArTᴉ$ʰARd" is not alphanumeric');
  t.equal(validator.isAlphanumeric("supercalifragilisticexpialidocious"), true, '"Hello." is alphanumeric');
  t.end();
});

test('isCreditCard', t => {
  t.equal(validator.isCreditCard("1234-5678-9101-1121"), true, "1234-5678-9101-1121 is creditCard");
  t.equal(validator.isCreditCard("1234567891011121"), true, "1234567891011121 is creditCard");
  t.equal(validator.isCreditCard("4427A693CF324D14"), true, "4427A693CF324D14 is creditCard");
  t.equal(validator.isCreditCard("4427A693CF324D14A"), false, "4427A693CF324D14A is not creditCard");
  t.equal(validator.isCreditCard("4427-A693-CF32-4D14"), true, "4427-A693-CF32-4D14 is creditCard");
  t.equal(validator.isCreditCard("4427-A693--CF32-4D14"), false, "4427-A693--CF32-4D14 is not creditCard");
  t.equal(validator.isCreditCard("----------------"), false, "---------------- is not creditCard");
  t.equal(validator.isCreditCard("testcard"), false, "testcard  is not creditCard");
  t.end();
});

test('isHex', t => {
  t.equal(validator.isHex("#abcdef"), true  ,'"#abcdef"  is Hex');
  t.equal(validator.isHex("#bcdefg"), false ,'"#bcdefg" is not Hex');
  t.equal(validator.isHex("#bbb"), true     ,'"#bbb" is Hex');
  t.equal(validator.isHex("#1cf"), true     ,'"#1cf" is Hex');
  t.equal(validator.isHex("#1234a6"), true  ,'"#1234a6" is Hex');
  t.equal(validator.isHex("#1234a68"), false,'"#1234a68" is not Hex');
  t.end();
});

test('isRGB', t => {
  t.equal(validator.isRGB("rgb(0,0,0)"), true, '"rgb(0,0,0)" is RGB');
  t.equal(validator.isRGB("rgb(0, 0, 0)"), true, '"rgb(0, 0, 0)") is RGB');
  t.equal(validator.isRGB("rgb(255, 255, 112)"), true, '"rgb(255, 255, 112)" is RGB');
  t.equal(validator.isRGB("rgba(0,0,0, 0)"), false, '"rgba(0,0,0, 0)" is not RGB');
  t.equal(validator.isRGB("rgb(0,0,0, 0)"), false, '"rgb(0,0,0, 0)" is not RGB');
  t.equal(validator.isRGB("rgb(0,300,0)"), false, '"rgb(0,300,0)" is not RGB');
  t.equal(validator.isRGB("rgb(0,-14,0)"), false, '"rgb(0,-14,0)" is not RGB');
  t.end();
});

test('isHSL', t=> {
  t.equal(validator.isHSL("hsl(0,0,0)"), true, '"hsl(0,0,0)" is HSL');
  t.equal(validator.isHSL("hsl(360,0,0)"), true, '"hsl(360,0,0)" is HSL');
  t.equal(validator.isHSL("hsl(360,1,0)"), true, '"hsl(360,0,1)" is HSL');
  t.equal(validator.isHSL("hsl(360,0,1)"), true, '"hsl(360,1,0)" is HSL');
  t.equal(validator.isHSL("hsl(0, 0, 0)"), true, '"hsl(0, 0, 0)") is HSL');
  t.equal(validator.isHSL("hsl(255, 255, 112)"), false, '"hsl(255, 255, 112)" is not HSL');
  t.equal(validator.isHSL("hsla(0,0,0, 0)"), false, '"hsla(0,0,0, 0)" is not HSL');
  t.equal(validator.isHSL("hsl(0,0,0, 0)"), false, '"hsl(0,0,0, 0)" is not HSL');
  t.equal(validator.isHSL("hsl(0,300,0)"), false, '"hsl(0,300,0)" is not HSL');
  t.equal(validator.isHSL("hsl(0,-14,0)"), false, '"hsl(0,-14,0)" is not HSL');
  t.end();
});

test('isColor', t => {
  t.equal(validator.isColor("hsl(0,0,0)"), true, '"hsl(0,0,0)" is a color');
  t.equal(validator.isColor("rgb(0,0,0)"), true,'"rgb(0,0,0)" is a color');
  t.equal(validator.isColor("#1234a6"), true,'"#1234a6" is a color');
  t.equal(validator.isColor("lalala"), false,'"lalala" is not a color');
  t.end();
});

test('isTrimmed', t => {
  t.equal(validator.isTrimmed("   harmony and irony"), false, '"   harmony and irony" is not trimmed');
  t.equal(validator.isTrimmed("harmony and irony      "), false, '"harmony and irony      " is not trimmed');
  t.equal(validator.isTrimmed("h  armony  and  iron  y"), false, '"harmony  and  irony" is not trimmed');
  t.equal(validator.isTrimmed("harmony and irony"), true, '"harmony and irony" is trimmed');
  t.end();
});

test('CSV', t => {
  t.equal(validator.isCSV('lal'), false, 'lal is not CSV');
  t.equal(validator.isCSV('0'), false, '0 is not CSV');
  t.equal(validator.isCSV('-11'), false, '-11 is not CSV');
  t.equal(validator.isCSV('1000'), false, '1000 is not CSV');
  t.equal(validator.isCSV(' 99'), false, ' 99 is not CSV');
  t.equal(validator.isCSV('000'), true, '000 is CSV');
  t.equal(validator.isCSV('999'), true, '999 is CSV');
  t.end();
});