(function (document) {

  function documentReady(cb) {
    document.readyState === "interactive" || document.readyState === "complete" ? cb() : document.addEventListener("DOMContentLoaded", cb);
  }

  documentReady(function () {

    const inputs = document.querySelectorAll('.coves-form__input');
    const errorBox = document.getElementById('signup__error-box');
    const signUpForm = document.getElementById('signup-form');
    const greeting = document.getElementById('greeting');

    const cookies = extractCookies();

    if (cookies.firstname) {
      greeting.innerHTML = 'Welcome '.concat(cookies.firstname)
    }
    else {
      greeting.classList.add('t-display-none');
      signUpForm.classList.remove('t-display-none');
    }

    function extractCookies() {
      return document.cookie.split('; ').reduce(function (acc, curr) {
        const equalIndex = curr.indexOf('=');
        acc[curr.slice(0, equalIndex)] = curr.slice(equalIndex + 1);
        return acc;
      }, {})
    }

    function serialize() {
      return [].reduce.call(inputs, function (acc, input) {
        acc[input.name] = input.value;
        return acc;
      }, {})
    }

    function sendForm() {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        if (xhr.status === 200) {
          signUpForm.classList.add('t-display-none');
          greeting.innerHTML = 'Welcome ' + JSON.parse(xhr.response).firstname;
          greeting.classList.remove('t-display-none');

          const now = new Date();
          now.setTime(now.getTime() + (604800)); // One week
          document.cookie = 'firstname='.concat(JSON.parse(xhr.response).firstname).concat(';expires=').concat(now.toUTCString());
        } else {
          errorBox.innerHTML = 'Something is wrong with the server';
          errorBox.style.display = 'inline-block';
        }
      };

      xhr.onerror = function () {
        errorBox.innerHTML = 'Something is wrong with the server';
        errorBox.style.display = 'inline-block';
      };

      xhr.open('GET', 'http://localhost:8000/create_account');
      xhr.send(serialize());
    }

    validator.addValidation('#username', ['blur'], function (input) {
      return !validator.isEmpty(input.value) && !validator.isBetween(input.value.length, 6, 20);
    }, 'Length not between 6 and 20');

    validator.addOK('#username', ['blur'], function (input) {
      return validator.isBetween(input.value.length, 6, 20);
    });

    validator.addValidation('input[id$=-name]', ['blur'], function (input) {
      return !validator.isEmpty(input.value) && validator.isLength(input.value, 2);
    }, 'Minimum length 3');

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
      ['keyup', 'blur'].forEach(function (event) {
        input.addEventListener(event, function () {
          if (validator.isLength(input.value, 5)) {
            input.nextElementSibling.innerHTML = 'Minimum length 6';
            input.setCustomValidity('Minimum length 6');
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

    validator.addValidation('#pass-repeat', ['keyup', 'blur'], function (input) {
      return input.value !== document.querySelector('#pass').value;
    }, 'Passwords must match');

    signUpForm.addEventListener('submit', function (event) {
      event.preventDefault(); //this is just a demo, we only make an AJAX call to local dev env
      const inputs = document.querySelectorAll('.coves-form__input--required');
      const someInputEmpty = [].some.call(inputs, function (input) {
        return validator.isEmpty(input.value);
      });
      if (!signUpForm.checkValidity() || someInputEmpty) {
        if (someInputEmpty) {
          errorBox.innerHTML = 'All inputs are required';
          errorBox.style.display = 'inline-block';
        }
        else {
          errorBox.style.display = 'none';
        }
      }
      else {
        sendForm();
      }
    });

  });
})(document);
