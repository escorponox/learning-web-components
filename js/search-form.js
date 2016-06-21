(function (document) {

  validator.addValidation('#search', ['blur'], function (input) {
    return validator.isEmpty(input.value);
  }, 'Required field');

  [].forEach.call(document.querySelectorAll('#search-form'), function (form) {
    form.addEventListener('submit', function (event) {
      const inputs = document.querySelectorAll('.coves-form__input--required');
      [].forEach.call(inputs, function (input) {
        if (validator.isEmpty(input.value)) {
          input.nextElementSibling.innerHTML = 'Required field';
          input.setCustomValidity('Required field');
        }
      });
      if (!form.checkValidity()) {
        event.preventDefault();
      }
    });
  });

})(document);