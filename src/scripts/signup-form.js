(function (document) {
  
  validator.addValidation('#username', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && !validator.isBetween(input.value.length, 6, 20);
  }, 'Username must be between 6 and 20 characters long');

  validator.addOK('#username', ['blur'], function (input) {
    return validator.isBetween(input.value.length, 6, 20);
  });

  validator.addValidation('input[id$=-name]', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && validator.isLength(input.value, 2);
  }, 'Names must be at least 3 characters long');

  validator.addOK('input[id$=-name]', ['blur'], function (input) {
    return validator.isOfLength(input.value, 3);
  });

  validator.addValidation('#email', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && !validator.isEmailAddress(input.value);
  }, 'Not a valid email');

  validator.addOK('#email', ['blur'], function (input) {
    return validator.isEmailAddress(input.value);
  });

  validator.addValidation('#birth', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && !validator.isDate(input.value);
  }, 'Not a valid date');

  validator.addOK('#birth', ['blur'], function (input) {
    return validator.isDate(input.value);
  });

  [].forEach.call(document.querySelectorAll('#pass'), function (input) {
    const passRepeat = document.querySelector('#pass-repeat');
    ['keyup', 'blur'].forEach(function(event) {
      input.addEventListener(event, function() {
        if (validator.isLength(input.value, 5)) {
          input.nextElementSibling.innerHTML = 'Password must be at least 6 characters long';
          input.setCustomValidity('Password must be at least 6 characters long');
        }
        else {
          input.setCustomValidity('');
          if (input.value !== passRepeat.value) {
            passRepeat.nextElementSibling.innerHTML = 'Passwords must match';
            passRepeat.setCustomValidity('Passwords must match');
          }
          else {

            passRepeat.setCustomValidity('');
          }
        }
      });
    });
  });

  validator.addOK('#pass', ['keyup', 'blur'], function (input) {
    return validator.isOfLength(input.value, 6);
  });

  validator.addOK('#pass-repeat', ['keyup', 'blur'], function (input) {
    return input.value === document.querySelector('#pass').value;
  });

  validator.addValidation('#pass-repeat', ['keyup', 'blur'], function (input){
    return input.value !== document.querySelector('#pass').value;
  }, 'Passwords must match');

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