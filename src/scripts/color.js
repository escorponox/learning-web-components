(function (document) {

  function documentReady(cb) {
    document.readyState === "interactive" || document.readyState === "complete" ? cb() : document.addEventListener("DOMContentLoaded", cb);
  }

  documentReady(function () {
    document.buildColor = function (ranges) {
      return [].reduce.call(ranges, function (prev, curr, index, array) {
        const sufix = index === array.length - 1 ? ')' : ',';
        prev += curr.value + sufix;
        return prev;
      }, 'rgba(');
    };

    const ranges = document.querySelectorAll('.input-range-coves');
    const output = document.querySelector('#color');
    var color = document.buildColor(ranges);
    output.style.backgroundColor = color;
    output.innerHTML = color;

    [].forEach.call(ranges, function (input, index, arr) {
      input.nextElementSibling.innerHTML = input.value;
      input.addEventListener('input', function (event) {
        event.target.nextElementSibling.innerHTML = event.target.value;
        color = document.buildColor(arr);
        output.style.backgroundColor = color;
        output.innerHTML = color;
      });
    });
  });

})(document);
