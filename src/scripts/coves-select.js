(function (document) {
  var selects = document.querySelectorAll('.coves-form__select');
  [].forEach.call(selects, function (select) {
    select.style.color = '#00c7ff';
    select.addEventListener('change', function () {
      if (select.value === '')
        select.style.color = '#00c7ff';
      else
        select.style.color = '#000000';
    })
  });
})(document);
