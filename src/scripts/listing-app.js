(function (document) {

  window.listingContainer = document.querySelector('#listing-container');
  window.cartContainer = document.querySelector('#cart-container');
  window.showCartButton = document.querySelector('#show-cart-button');
  window.cartCount = document.querySelector('#item-counter');
  window.cartList = document.querySelector('#cart-list');
  window.promoButton = document.querySelector('#promo-button');
  window.promoCode = document.querySelector('#promo-code');
  window.promoMsg = document.querySelector('#promo-msg');
  window.promoStatus = document.querySelector('#promo-status');
  window.cartTotal = document.querySelector('#cart-total');
  window.expandContainer = document.querySelector('#cart-expand-container');


  showCartButton.addEventListener('click', manageCartButton);
  listingContainer.addEventListener('click', addToCart);
  cartList.addEventListener('click', removeFromCartButton);
  cartList.addEventListener('click', minusButton);
  cartList.addEventListener('click', plusButton);
  promoButton.addEventListener('click', promoButtonClick);

  function promoButtonClick(event) {
    const promoCode = event.currentTarget.previousElementSibling.value;
    var validPromo = false;
    if (promoCode === 'MVP') {
      mostExpensiveItemDiscount(); // 15% discount on most expensive item (only in one item)
      validPromo = true;
    }
    if (promoCode === 'A03') {
      a03ArticleDiscount(); // 20% discount on a03 items
      validPromo = true;
    }
    if (promoCode === 'WOMBOCOMBO') {
      totalDiscount(); // 10% total discount
      validPromo = true;
    }
    if (!validPromo) {
      notValidPromo();
    }
    else if (cart.total.virtualPromo > cart.total.promo) {
      applyPromo(promoCode);
    }
    else {
      dontApplyPromo();
    }
  }

  function mostExpensiveItemDiscount() {
    const mostExpensive = cart.lines.reduce(function (prev, curr) {
      return prev.unitPrice < curr.unitPrice ? curr : prev;
    }, {unitPrice: 0});
    mostExpensive.virtualPromo = mostExpensive.unitPrice * 0.15;
    refreshCartTotalVirtualPromo();
  }

  function a03ArticleDiscount() {
    const a03Line = cart.lines.filter(function (line) {
      return line.articleId === 'a03';
    }).forEach(function (line) {
      line.virtualPromo = line.unitPrice * line.quantity * 0.2;
    });
    refreshCartTotalVirtualPromo();
  }

  function totalDiscount() {
    cart.total.virtualPromo = cart.total.amount * 0.1;
  }

  function refreshCartTotalVirtualPromo() {
    cart.total.virtualPromo = cart.lines.reduce(function (prev, curr) {
      prev += curr.virtualPromo;
      return prev;
    }, 0);
  }

  function notValidPromo() {
    promoCode.value = '';
    promoMsg.innerHTML = 'Not a valid code';
    Velocity(promoMsg, 'fadeIn', {
      duration: 1000,
      complete: function () {
        Velocity(promoMsg, 'fadeOut', {duration: 1000, delay: 5000});
      }
    })
  }

  function applyPromo(promoCode) {
    cart.total.promo = cart.total.virtualPromo;
    cart.total.promoCode = promoCode;
    cart.lines.forEach(function (line) {
      line.promo = line.virtualPromo;
      line.virtualPromo = 0;
    });
    refreshCartLines();
    refreshCartTotalAmount();
    refreshCartHeading();
    promoStatus.innerHTML = promoCode + ': $' + cart.total.promo.toFixed(2) + ' total discount';
    promoStatus.style.display = 'block';
  }

  function dontApplyPromo() {
    promoMsg.innerHTML = 'Actual Promo is better';
    Velocity(promoMsg, 'fadeIn', {
      duration: 1000,
      complete: function () {
        Velocity(promoMsg, 'fadeOut', {duration: 1000, delay: 5000});
      }
    })
  }

  function clearPromo() {
    if (cart.total.promoCode) {
      cart.total.promo = 0;
      cart.total.virtualPromo = 0;
      cart.total.promoCode = '';
      cart.lines.forEach(function (line) {
        line.promo = 0;
        line.virtualPromo = 0;
      });
      promoCode.value = '';
      promoStatus.innerHTML = '';
      promoStatus.style.display = 'none';
      promoMsg.innerHTML = 'ALL PROMOS CLEARED';
      Velocity(promoMsg, 'fadeIn', {
        duration: 1000,
        complete: function () {
          Velocity(promoMsg, 'fadeOut', {duration: 1000, delay: 5000});
        }
      })
    }
  }

  function plusButton(event) {
    const isButton = event.target.classList.contains('button-plus');
    const isInnerSpan = event.target.classList.contains('fa-plus');
    if (isButton || isInnerSpan) {
      const cartLine = isButton ? event.target.parentNode : event.target.parentNode.parentNode;
      const id = cartLine.id.slice(5);
      cart.lines.filter(function (line) {
        return line.articleId === id;
      }).forEach(function (line) {
        line.quantity++;
      });
      refreshCart();
    }
  }

  function minusButton(event) {
    const isButton = event.target.classList.contains('button-minus');
    const isInnerSpan = event.target.classList.contains('fa-minus');
    if (isButton || isInnerSpan) {
      const cartLine = isButton ? event.target.parentNode : event.target.parentNode.parentNode;
      const id = cartLine.id.slice(5);
      cart.lines.filter(function (line) {
        return line.articleId === id;
      }).forEach(function (line) {
        line.quantity--;
      });
      cart.lines = cart.lines.filter(function (line) {
        return line.quantity > 0;
      });
      cleanRemovedCartLines();
      refreshCart();
      listingContainer.style.marginBottom = cartContainer.offsetHeight - 5 + 'px';
    }
  }

  function removeFromCartButton(event) {
    const isButton = event.target.classList.contains('button-remove');
    const isInnerSpan = event.target.classList.contains('fa-times');
    if (isButton || isInnerSpan) {
      const cartLine = isButton ? event.target.parentNode : event.target.parentNode.parentNode;
      const id = cartLine.id.slice(5);
      cart.lines = cart.lines.filter(function (line) {
        return line.articleId !== id;
      });
      cartLine.remove();
      refreshCart();
      listingContainer.style.marginBottom = cartContainer.offsetHeight - 5 + 'px';
    }
  }

  function addToCart(event) {
    if (event.target.classList.contains('add-button')) {

      const article = listing.articles.filter(function (article) {
        return article.id === event.target.id;
      })[0];
      const line = cart.lines.filter(function (line) {
        return line.articleId === article.id;
      }).map(function (line) {
        line.quantity++;
        line.amount += article.price;
        return line;
      });
      if (!line.length) {
        addNewLineToCart(article);
      }
      else {
        refreshCartLines();
      }
      refreshCart();
      showCart();
    }
  }

  function addNewLineToCart(article) {
    cart.lines.push({
      articleId: article.id,
      quantity: 1,
      unitPrice: article.price,
      amount: article.price,
      promo: 0,
      virtualPromo: 0
    });
    const newLine = document.createElement('div');
    newLine.classList.add('cart-list__item');
    newLine.id = 'line-' + article.id;
    newLine.innerHTML = '<div class="cart-list__item__element button button--sm button-quantity button-remove"><span class="fa fa-times" aria-hidden="true"></span></div>'
      + '<span class="cart-list__item__element cart-list__item__name">' + article.name + '</span><span class="cart-list__item__element line-price">$' + article.price + '</span>'
      + '<div class="cart-list__item__element button button--sm button-quantity button-minus"><span class="fa fa-minus" aria-hidden="true"></span></div>'
      + '<input class="cart-list__item__element coves-form__input input-quantity" value="1">'
      + '<div class="cart-list__item__element button button--sm button-quantity button-plus"><span class="fa fa-plus" aria-hidden="true"></span></div>';
    cartList.appendChild(newLine);
  }

  function cleanRemovedCartLines() {
    const cartItems = document.querySelectorAll('.cart-list__item');
    [].forEach.call(cartItems, function (cartItem) {
      const isInCart = cart.lines.some(function (line) {
        return line.articleId === cartItem.id.slice(5);
      });
      if (!isInCart)
        cartItem.remove();
    });
  }

  function refreshCart() {
    clearPromo();
    refreshCartLines();
    refreshCartTotalAmount();
    refreshCartHeading();
  }

  function refreshCartLines() {
    const cartItems = document.querySelectorAll('.cart-list__item');
    cart.lines.forEach(function (line, index) {
      line.amount = line.quantity * line.unitPrice - line.promo;
      line.virtualPromo = 0;
      cartItems[index].children[4].value = line.quantity;
      cartItems[index].children[2].innerHTML = '$' + line.amount.toFixed(2);
    });
  }

  function refreshCartTotalAmount() {
    cart.total.amount = cart.lines.reduce(function (prev, curr) {
        prev += curr.quantity * curr.unitPrice;
        return prev;
      }, 0) - cart.total.promo;
  }

  function refreshCartHeading() {
    cartTotal.innerHTML = '$' + cart.total.amount.toFixed(2);
    const itemCount = cart.lines.reduce(function (prev, curr) {
      prev += curr.quantity;
      return prev;
    }, 0);
    cartCount.innerHTML = itemCount;

    if (!itemCount) {
      hideCart();
    }
  }

  function manageCartButton(event) {
    const button = event.currentTarget;
    if (button.classList.contains('cart-button--maximized')) {
      minimizeCart(button);
    }
    else {
      maximizeCart(button);
    }
  }

  function showCart() {
    if (!cartContainer.classList.contains('cart--show')) {
      Velocity(cartContainer, "slideDown", {
        duration: 400,
        begin: function () {
          cartContainer.classList.add('cart--show');
        },
        complete: function () {
          listingContainer.style.marginBottom = cartContainer.offsetHeight - 5 + 'px';
        }
      });
    }
  }

  function hideCart() {
    Velocity(expandContainer, "slideUp", {
      duration: 400,
      begin: function () {
        listingContainer.style.marginBottom = '0';
        Velocity(cartContainer, "slideUp", {
          duration: 400,
          complete: function () {
            showCartButton.classList.remove('cart-button--maximized');
            cartContainer.classList.remove('cart--show');
          }
        });
      },
      complete: function () {
        cartContainer.classList.remove('cart--expanded');
        expandContainer.classList.remove('cart__expand--expanded');

      }
    });
  }

  function minimizeCart(button) {
    Velocity(expandContainer, "slideUp", {
      duration: 400,
      begin: function () {
        listingContainer.style.marginBottom = '72px';
      },
      complete: function () {
        button.classList.remove('cart-button--maximized');
        cartContainer.classList.remove('cart--expanded');
        expandContainer.classList.remove('cart__expand--expanded');
      }
    });
  }

  function maximizeCart(button) {
    Velocity(expandContainer, "slideDown", {
      duration: 400,
      begin: function () {
        cartContainer.classList.add('cart--expanded');
        expandContainer.classList.add('cart__expand--expanded');
      },
      complete: function () {
        button.classList.add('cart-button--maximized');
        listingContainer.style.marginBottom = cartContainer.offsetHeight - 5 + 'px';
      }
    });
  }

})(document);
