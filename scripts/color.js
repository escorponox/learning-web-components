!function(e){function n(n){"interactive"===e.readyState||"complete"===e.readyState?n():e.addEventListener("DOMContentLoaded",n)}n(function(){e.buildColor=function(e){return[].reduce.call(e,function(e,n,t,r){const o=t===r.length-1?")":",";return e+=n.value+o},"rgba(")};const n=e.querySelectorAll(".input-range-coves"),t=e.querySelector("#color");var r=e.buildColor(n);t.style.backgroundColor=r,t.innerHTML=r,[].forEach.call(n,function(n,o,l){n.nextElementSibling.innerHTML=n.value,n.addEventListener("input",function(n){n.target.nextElementSibling.innerHTML=n.target.value,r=e.buildColor(l),t.style.backgroundColor=r,t.innerHTML=r})})})}(document);