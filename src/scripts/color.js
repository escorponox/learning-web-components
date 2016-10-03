(function (document) {

  document.buildColor = function(ranges) {
    return [].reduce.call(ranges, function (prev, curr, index, array) {
      const sufix = index === array.length - 1 ? ')' : ',';
      prev += curr.value + sufix;
      return prev;
    }, 'rgba(');
  };

  const ranges = document.querySelectorAll('input[type=range]');
  const output = document.querySelector('#color');
  output.innerHTML = document.buildColor(ranges);

  [].forEach.call(ranges, function (input, index, arr) {
    input.nextElementSibling.innerHTML = input.value;
    input.addEventListener('input', function (event) {
      event.target.nextElementSibling.innerHTML = event.target.value;
      output.innerHTML = document.buildColor(arr);
    });
  });

})(document);