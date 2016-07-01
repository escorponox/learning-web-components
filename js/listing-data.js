(function (window) {
  window.cart = {
    total: {
      amount: 0,
      promo: 0,
      virtualPromo: 0
    },
    lines: []
  };
  window.listing = {
    title: 'Product Listing',
    addButtonText: 'Add to Cart',
    articles: [
      {
        id: 'a01',
        name: 'Article 1',
        image: 'http://placehold.it/160x160',
        description: 'Short description or maybe longer description',
        price: 999.99
      },
      {
        id: 'a02',
        name: 'Article 2',
        image: 'http://placehold.it/160x160',
        description: 'Short description',
        price: 99.99
      },
      {
        id: 'a03',
        name: 'Article 3',
        image: 'http://placehold.it/160x160',
        description: 'Short description or maybe longer description',
        price: 9.99
      },
      {
        id: 'a04',
        name: 'Article 4',
        image: 'http://placehold.it/160x160',
        description: 'Short description',
        price: 888.88
      },
      {
        id: 'a05',
        name: 'Article 5',
        image: 'http://placehold.it/160x160',
        description: 'Short description or maybe longer description',
        price: 88.88
      },
      {
        id: 'a06',
        name: 'Article 6',
        image: 'http://placehold.it/160x160',
        description: 'Short description',
        price: 8.88
      },
      {
        id: 'a07',
        name: 'Article 7',
        image: 'http://placehold.it/160x160',
        description: 'Short description or maybe longer description',
        price: 0.88
      },
      {
        id: 'a08',
        name: 'Article 8',
        image: 'http://placehold.it/160x160',
        description: 'Short description',
        price: 77.77
      },
      {
        id: 'a09',
        name: 'Article 9',
        image: 'http://placehold.it/160x160',
        description: 'Short description or maybe longer description',
        price: 76.76
      },
      {
        id: 'a10',
        name: 'Article 10',
        image: 'http://placehold.it/160x160',
        description: 'Short description',
        price: 45.45
      },
      {
        id: 'a11',
        name: 'Article 11',
        image: 'http://placehold.it/160x160',
        description: 'Short description or maybe longer description',
        price: 16.16
      },
      {
        id: 'a12',
        name: 'Article 12',
        image: 'http://placehold.it/160x160',
        description: 'Short description',
        price: 78.25
      }
    ]
  };

  const htmlTemplate = document.getElementById('listing-template').innerHTML;
  const handlebarsTemplate = Handlebars.compile(htmlTemplate);
  document.getElementById('listing-container').innerHTML = handlebarsTemplate(window.listing);
})(window);