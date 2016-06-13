(function (document) {

  const radios = document.querySelector('#questionnaire-form').elements['find'];
  [].forEach.call(radios, function (radio) {
    radio.addEventListener('change', function () {
      const textInput = document.querySelector('#other-text');
      if (radios.value === 'other') {
        textInput.disabled = false;
      }
      else {
        textInput.value = '';
        textInput.disabled = true;
        textInput.setCustomValidity('');
      }
    })
  });

  [].forEach.call(document.querySelectorAll('#questionnaire-form'), function (form) {
    form.addEventListener('submit', function (event) {
      const radios = form.elements['find'];
      const errorBox = document.querySelector('#coves-form__error-box');
      const textInput = document.querySelector('#other-text');
      const selectOptions = [].reduce.call(radios, function (prev, curr) {
        prev.push(curr.value);
        return prev;
      }, []);
      if (!validator.isOneOf(radios.value, selectOptions)) {
        errorBox.innerHTML = 'Please select one option';
        errorBox.style.display = 'inline-block';
        event.preventDefault();
      }
      else {
        errorBox.style.display = 'none';
      }
      if (radios.value === 'other' && validator.isEmpty(textInput.value)) {
        const msg = 'Required when Other';
        textInput.nextElementSibling.innerHTML = msg;
        textInput.setCustomValidity(msg);
        event.preventDefault();
      }
      else {
        textInput.setCustomValidity('');
      }
    })
  });

})(document);