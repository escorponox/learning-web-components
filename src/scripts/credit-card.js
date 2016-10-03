(function (document) {

  validator.addValidation('#full-name', ['blur'], function(input) {
    return validator.isEmpty(input.value);
  }, 'Name cannot be empty');

  validator.addValidation('#card-number', ['blur'], function(input) {
    return !validator.isCreditCard(input.value);
  }, 'Not a valid credit card number');

  validator.addValidation('#csv', ['blur'], function (input) {
    return !validator.isCSV(input.value) ;
  }, 'Not a valid CSV');

  const dateInputs = document.querySelectorAll('#month, #year');
  [].forEach.call(dateInputs, function (input, index, arr) {
    ['blur', 'change'].forEach(function (event) {
      input.addEventListener(event, function () {
        const allNoNEmpty = [].every.call(arr, function (input) {
          return !validator.isEmpty(input.value);
        });
        if (allNoNEmpty) {
          document.querySelector('#date__error').style.visibility = 'hidden';
          [].forEach.call(arr, function(input) {
            input.setCustomValidity('');
          });
        }
      })
    })
  });

  [].forEach.call(document.querySelectorAll('#credit-card-form'), function (form) {
    form.addEventListener('submit', function (event) {
      const inputs = document.querySelectorAll('.coves-form__input--required');
      [].forEach.call(inputs, function (input) {
        if (validator.isEmpty(input.value)) {
          input.nextElementSibling.innerHTML = 'Required field';
          input.setCustomValidity('Required field');
        }
      });
      const dateInputs = document.querySelectorAll('#month, #year');
      [].forEach.call(dateInputs, function (input) {
        if (validator.isEmpty(input.value)) {
          document.querySelector('#date__error').innerHTML = 'Required fields';
          document.querySelector('#date__error').style.visibility = 'visible';
          input.setCustomValidity('Required fields');
        }
      });
      if (!form.checkValidity()) {
        event.preventDefault();
      }
    });
  });

})(document);