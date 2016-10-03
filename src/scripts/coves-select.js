(function (document) {
  var selects = document.querySelectorAll('.coves-form__select');
  [].forEach.call(selects, function (select) {
    select.style.color = '#40D5FF';
    select.addEventListener('change', function () {
      if (select.value === '')
        select.style.color = '#40D5FF';
      else
        select.style.color = '#000000';
    })
  });
})(document);