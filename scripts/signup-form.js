!function(a){function t(t){"interactive"===a.readyState||"complete"===a.readyState?t():a.addEventListener("DOMContentLoaded",t)}t(function(){validator.addValidation("#username",["blur"],function(a){return!validator.isEmpty(a.value)&&!validator.isBetween(a.value.length,6,20)},"Length not between 6 and 20"),validator.addOK("#username",["blur"],function(a){return validator.isBetween(a.value.length,6,20)}),validator.addValidation("input[id$=-name]",["blur"],function(a){return!validator.isEmpty(a.value)&&validator.isLength(a.value,2)},"Minimum length 3"),validator.addOK("input[id$=-name]",["blur"],function(a){return validator.isOfLength(a.value,3)}),validator.addValidation("#email",["blur"],function(a){return!validator.isEmpty(a.value)&&!validator.isEmailAddress(a.value)},"Not a valid email"),validator.addOK("#email",["blur"],function(a){return validator.isEmailAddress(a.value)}),validator.addValidation("#birth",["blur"],function(a){return!validator.isEmpty(a.value)&&!validator.isDate(a.value)},"Not a valid date"),validator.addOK("#birth",["blur"],function(a){return validator.isDate(a.value)}),[].forEach.call(a.querySelectorAll("#pass"),function(t){const e=a.querySelector("#pass-repeat");["keyup","blur"].forEach(function(a){t.addEventListener(a,function(){validator.isLength(t.value,5)?(t.nextElementSibling.innerHTML="Minimum length 6",t.setCustomValidity("Minimum length 6")):(t.setCustomValidity(""),t.value!==e.value?(e.nextElementSibling.innerHTML="Passwords must match",e.setCustomValidity("Passwords must match")):e.setCustomValidity(""))})})}),validator.addOK("#pass",["keyup","blur"],function(a){return validator.isOfLength(a.value,6)}),validator.addOK("#pass-repeat",["keyup","blur"],function(t){return t.value===a.querySelector("#pass").value}),validator.addValidation("#pass-repeat",["keyup","blur"],function(t){return t.value!==a.querySelector("#pass").value},"Passwords must match"),[].forEach.call(a.querySelectorAll("#signup-form"),function(t){t.addEventListener("submit",function(e){e.preventDefault();var i=a.querySelectorAll(".coves-form__input--required"),l=[].some.call(i,function(a){return validator.isEmpty(a.value)});t.checkValidity()&&!l||(e.preventDefault(),l?a.querySelector("#signup__error-box").style.display="inline-block":a.querySelector("#signup__error-box").style.display="none")})})})}(document);