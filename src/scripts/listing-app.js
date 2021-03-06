(function (document) {

  const listingContainer = document.querySelector('#listing-container');
  const cartContainer = document.querySelector('#cart-container');
  const cartCount = document.querySelector('#item-counter');
  const cartCountModal = document.querySelector('#item-counter-modal');
  const cartList = document.querySelector('#cart-list');
  const cartTotal = document.querySelector('#cart-total');
  const cartTotalModal = document.querySelector('#cart-total-modal');
  const cartModalToggle = document.querySelector('#cart-modal-toggle');
  const promoButton = document.querySelector('#promo-button');
  const promoCode = document.querySelector('#promo-code');
  const promoMsg = document.querySelector('#promo-msg');
  const promoStatus = document.querySelector('#promo-status');


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
      promoWarning('Better promo already applied');
    }
  }

  function mostExpensiveItemDiscount() {
    var mostExpensive = cart.lines.reduce(function (prev, curr) {
      return prev.unitPrice < curr.unitPrice ? curr : prev;
    }, {unitPrice: 0});
    mostExpensive.virtualPromo = mostExpensive.unitPrice * 0.15;
    refreshCartTotalVirtualPromo();
  }

  function a03ArticleDiscount() {
    cart.lines.filter(function (line) {
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
    promoWarning('Not a valid code');
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
    promoStatus.innerHTML = '$' + cart.total.promo.toFixed(2) + ' discount';
    promoStatus.classList.add('promo--show');
  }

  function promoWarning(message) {
    promoMsg.innerHTML = message;
    promoMsg.classList.add('promo--show');
    setTimeout(function () {
      promoMsg.classList.remove('promo--show');
    }, 5000)
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
      promoStatus.classList.remove('promo--show');
      promoCode.value = '';
      promoStatus.innerHTML = '';
      promoWarning('ALL PROMOS CLEARED');
    }
  }

  function plusButton(event) {
    var isButton = event.target.classList.contains('button-plus');
    var isInnerSpan = event.target.classList.contains('fa-plus');
    if (isButton || isInnerSpan) {
      const cartLine = isButton ? event.target.parentNode.parentNode : event.target.parentNode.parentNode.parentNode;
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
      const cartLine = isButton ? event.target.parentNode.parentNode : event.target.parentNode.parentNode.parentNode;
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
      const cartLine = isButton ? event.target.parentNode.parentNode : event.target.parentNode.parentNode.parentNode;
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
      cartContainer.classList.add('cart--show');
      listingContainer.classList.add('listing-container--cart-show');
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
    newLine.innerHTML = '<div class="cart-list__item__info"><div class="button button--sm button-quantity button-remove"><span class="fa fa-times" aria-hidden="true"></span></div>'
      + '<div class="cart-list__item__name">' + article.name + '</div><span class="line-price">$' + article.price + '</span></div>'
      + '<div class="cart-list__item__quantity"><div class="button button--sm button-quantity button-minus"><span class="fa fa-minus" aria-hidden="true"></span></div>'
      + '<input class="coves-form__input input-quantity" value="1">'
      + '<div class="button button--sm button-quantity button-plus"><span class="fa fa-plus" aria-hidden="true"></span></div></div>';
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
      cartItems[index].children[1].children[1].value = line.quantity;
      cartItems[index].children[0].children[2].innerHTML = '$' + line.amount.toFixed(2);
    });
  }

  function refreshCartTotalAmount() {
    cart.total.amount = cart.lines.reduce(function (prev, curr) {
        prev += curr.quantity * curr.unitPrice;
        return prev;
      }, 0) - cart.total.promo;
  }

  function refreshCartHeading() {
    const cartTotalString = '$' + cart.total.amount.toFixed(2);
    cartTotal.innerHTML = cartTotalString;
    cartTotalModal.innerHTML = cartTotalString;

    const itemCount = cart.lines.reduce(function (prev, curr) {
      prev += curr.quantity;
      return prev;
    }, 0);
    cartCount.innerHTML = itemCount;
    cartCountModal.innerHTML = itemCount;

    if (!itemCount) {
      cartContainer.classList.remove('cart--show');
      cartModalToggle.checked = false;
    }
  }

})(document);
