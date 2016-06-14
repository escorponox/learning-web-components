(function (document) {

  validator.addValidation('#username, #pass', ['blur'], function (input) {
    return validator.isEmpty(input.value);
  }, 'Cannot be empty');

  [].forEach.call(document.querySelectorAll('#login-form'), function (form) {
    form.addEventListener('submit', function (event) {
      var inputs = document.querySelectorAll('#username, #pass');
      var someInputEmpty = [].some.call(inputs, function (input) {
        return validator.isEmpty(input.value);
      });
      if (!form.checkValidity() || someInputEmpty) {
        event.preventDefault();
        [].filter.call(inputs, function (input) {
          return validator.isEmpty(input.value);
        }).forEach(function (input) {
          input.nextElementSibling.innerHTML = 'Cannot be empty';
          input.setCustomValidity('Cannot be empty');
        });
      }
    });
  });
})(document);