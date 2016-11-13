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
        name: 'Aceitunas',
        image: '../../assets/images/aceitunas.jpg',
        description: 'Aceitunas aliñadas.',
        price: 2.50
      },
      {
        id: 'a02',
        name: 'Cocido',
        image: '../../assets/images/cocido.jpg',
        description: 'Cocido madrileño.',
        price: 18.00
      },
      {
        id: 'a03',
        name: 'Fabada',
        image: '../../assets/images/fabada.jpg',
        description: 'Fabada asturiana.',
        price: 17.00
      },
      {
        id: 'a04',
        name: 'Gazpacho',
        image: '../../assets/images/gazpacho.jpg',
        description: 'Gazpacho andaluz.',
        price: 8.00
      },
      {
        id: 'a05',
        name: 'Arroz',
        image: '../../assets/images/horno.jpg',
        description: 'Arroz al horno',
        price: 15
      },
      {
        id: 'a06',
        name: 'Jamón',
        image: '../../assets/images/jamon.jpg',
        description: 'Jamón ibérico',
        price: 20
      },
      {
        id: 'a07',
        name: 'Lentejas',
        image: '../../assets/images/lentejas.jpg',
        description: 'Lentejas a la riojana',
        price: 12
      },
      {
        id: 'a08',
        name: 'Paella',
        image: '../../assets/images/paella.jpg',
        description: 'Paella valenciana',
        price: 25
      },
      {
        id: 'a09',
        name: 'Pil Pil',
        image: '../../assets/images/pilpil.jpg',
        description: 'Bacalao al pil pil',
        price: 24
      },
      {
        id: 'a10',
        name: 'Pulpo',
        image: '../../assets/images/pulpo.jpg',
        description: 'Pulpo a feira',
        price: 20
      },
      {
        id: 'a11',
        name: 'Tortilla',
        image: '../../assets/images/tortilla.jpg',
        description: 'Tortilla de patata',
        price: 15
      },
      {
        id: 'a12',
        name: 'Zamburiñas',
        image: '../../assets/images/zambu.jpg',
        description: 'Zamburiñas a la plancha',
        price: 17
      }
    ]
  };

  const htmlTemplate = document.getElementById('listing-template').innerHTML;
  const handlebarsTemplate = Handlebars.compile(htmlTemplate);
  document.getElementById('listing-container').innerHTML = handlebarsTemplate(window.listing);
})(window);
