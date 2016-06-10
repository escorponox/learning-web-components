(function (document) {

  var usernames = document.querySelectorAll('#username');
  [].forEach.call(usernames, function (username) {
    username.addEventListener('blur', function () {
      var usernameError = document.querySelector('#username__error');
      if (!validator.isBetween(username.value.length, 6, 20)) {
        const errorMsg = 'Username must be between 6 and 20 characters long';
        usernameError.innerHTML = errorMsg;
        username.setCustomValidity(errorMsg);
      }
      else {
        username.setCustomValidity('');
      }
    });
  });

  [].forEach.call(document.querySelectorAll('.coves-form form'), function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity())
        event.preventDefault();
    });
  });
})(document);