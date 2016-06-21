(function (document) {

  validator.addValidation('#first-name,#last-name, #billing-first-name, #billing-last-name', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && validator.isLength(input.value, 2);
  }, 'Names must be at least 3 characters long');

  validator.addOK('#first-name,#last-name, #billing-first-name, #billing-last-name', ['blur'], function (input) {
    return validator.isOfLength(input.value, 3);
  });

  validator.addValidation('#address, #billing-address', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && validator.isLength(input.value, 9);
  }, 'Address must be at least 10 characters long');

  validator.addOK('#address', ['blur'], function (input) {
    return validator.isOfLength(input.value, 10);
  });

  validator.addValidation('#city', ['blur'], function (input) {
    return !validator.isEmpty(input.value) && validator.isLength(input.value, 2);
  }, 'City must be at least 3 characters long');

  validator.addOK('#city', ['blur'], function (input) {
    return validator.isOfLength(input.value, 3);
  });

  validator.addValidation('#country', ['blur', 'change'], function (input) {
    return validator.isEmpty(input.value);
  }, 'A country must be selected');

  [].forEach.call(document.querySelectorAll('#same'), function (input) {
    input.addEventListener('change', function (event) {
      const same = event.currentTarget.checked;
      [].forEach.call(document.querySelectorAll('.coves-form__input[id^=billing]'), function (billingInput) {
        billingInput.disabled = same;
        if (same) {
          billingInput.classList.remove('coves-form__input--required');
          billingInput.value = '';
          billingInput.setCustomValidity('');
          if (billingInput.previousElementSibling)
            billingInput.previousElementSibling.style.display = 'none';
          if (billingInput.tagName === 'SELECT')
            billingInput.style.color = '#40D5FF';
        }
        else
          billingInput.classList.add('coves-form__input--required');
      });
    })
  });

  [].forEach.call(document.querySelectorAll('#shipping-form'), function (form) {
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