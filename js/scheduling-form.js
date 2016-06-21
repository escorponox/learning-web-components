(function (document) {

  validator.addValidation('#date', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && !validator.isDate(input.value);
  }, 'Not a valid date');

  validator.addOK('#date', ['blur'], function(input) {
    return validator.isDate(input.value);
  });

  validator.addValidation('#time', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && !validator.isTime(input.value);
  }, 'Not a valid time');

  validator.addOK('#time', ['blur'], function(input) {
    return validator.isTime(input.value);
  });

  validator.addValidation('#timezone', ['blur', 'change'], function (input) {
    return validator.isEmpty(input.value);
  }, 'A timezone must be selected');

  validator.addValidation('#message', ['blur'], function (input) {
    return validator.isEmpty(input.value);
  }, 'A message is required');

  validator.addOK('#message', ['blur'], function(input) {
    return !validator.isEmpty(input.value);
  });

  validator.addValidation('#contact', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && !validator.isPhoneNumber(input.value);
  }, 'Not a valid phone number');

  validator.addOK('#contact', ['blur'], function(input) {
    return validator.isPhoneNumber(input.value);
  });

  validator.addValidation('#email', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && !validator.isEmailAddress(input.value);
  }, 'Not a valid email');

  validator.addOK('#email', ['blur'], function(input) {
    return validator.isPhoneNumber(input.value);
  });

  [].forEach.call(document.querySelectorAll('#scheduling-form'), function (form) {
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