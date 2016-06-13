(function (document) {
  
  validator.addValidation('#username', 'blur', function (input) {
    return !validator.isEmpty(input.value) && !validator.isBetween(input.value.length, 6, 20);
  }, 'Username must be between 6 and 20 characters long');

  validator.addValidation('input[id$=-name]', 'blur', function (input) {
    return !validator.isEmpty(input.value) && validator.isLength(input.value, 2);
  }, 'Names must be at least 3 characters long');

  validator.addValidation('#email', 'blur', function (input) {
    return !validator.isEmpty(input.value) && !validator.isEmailAddress(input.value);
  }, 'Not a valid email');

  validator.addValidation('#birth', 'blur', function (input) {
    return !validator.isEmpty(input.value) && !validator.isDate(input.value);
  }, 'Not a valid date');

  validator.addValidation('#pass', 'blur', function (input) {
    return !validator.isEmpty(input.value) && validator.isLength(input.value, 5);
  }, 'Password must be at least 6 characters long');

  validator.addValidation('#pass-repeat', 'keyup', function (input) {
    return input.value !== document.querySelector('#pass').value;
  }, 'Password does not match');

  [].forEach.call(document.querySelectorAll('#signup-form'), function (form) {
    form.addEventListener('submit', function (event) {
      var inputs = document.querySelectorAll('.coves-form__input--required');
      var someInputEmpty = [].some.call(inputs, function (input) {
        return validator.isEmpty(input.value);
      });
      if (!form.checkValidity() || someInputEmpty) {
        event.preventDefault();
        if (someInputEmpty) {
          document.querySelector('#coves-form__error-box').style.display = 'inline-block';
        }
        else {
          document.querySelector('#coves-form__error-box').style.display = 'none';
        }
      }
    });
  });
})(document);