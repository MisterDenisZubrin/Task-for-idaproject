'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = Vue.createApp({
  data: function data() {
    return {
      currProduct: {
        name: '',
        description: '',
        link: '',
        price: ''
      },
      productsList: [{
        name: 'Наименование товара',
        description: 'Довольно-таки интересное описание товара в несколько строк. Довольно-таки интересное описание товара в несколько строк',
        link: 'img/product.png',
        price: '10 000'
      }]
    };
  },
  methods: {
    // -------Компонент валидации--------
    // Проверка на пустое поле
    requiredFieldCheck: function requiredFieldCheck(field) {
      if (!field.value) {
        field.classList.add('required-field');
        return false;
      }

      field.classList.remove('required-field');
      return true;
    },
    // Проверка всех полей при изменении одного из них
    validateFields: function validateFields() {
      // Стилизация пустых полей 
      var inputs = document.querySelectorAll('input[required]');
      var labels = document.querySelectorAll('.form__label_required');
      var results = [];

      for (var i = 0; i < inputs.length; i++) {
        results.push(this.requiredFieldCheck(inputs[i]));

        if (results[i]) {
          labels[i].classList.remove('required-field');
          inputs[i].style.outline = 'none';
        } else {
          labels[i].classList.add('required-field');
          inputs[i].style.outline = '1px solid #ff8484';
        }
      } // Активация и деактивация кнопки


      var button = document.querySelector('.form__submit-btn');
      var pass = results.reduce(function (a, b) {
        return a * b;
      });

      if (pass) {
        button.classList.add('form__submit-btn_active');
        button.disabled = false;
        return true;
      }

      button.classList.remove('form__submit-btn_active');
      button.disabled = true;
    },
    // -------Компонент работы с продуктом---------
    // Получение данных о продукте
    inputChangeHandler: function inputChangeHandler(event) {
      this.currProduct[event.target.id] = event.target.value;
    },
    // Добавление продукта в корзину
    addToProductsList: function addToProductsList(product) {
      // Маска разделения тысячных долей пробелом
      product.price = product.price.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
      this.productsList.push(_objectSpread({}, product));
      this.updateStorage();
    },
    // Удаление продукта из корзины
    removeFromProductsList: function removeFromProductsList(event) {
      var productCard = event.target.closest('.products-list-item');
      this.productsList.splice(productCard.id, 1);
      this.updateStorage();
    },
    // ---------Компонент с сортировками-------------
    // По возрастанию
    sortFromMinToMax: function sortFromMinToMax() {
      this.productsList.forEach(function (product) {
        product.price = product.price.split(' ').join(''); // product.price = product.price.replace(/\s/g, '');
      });
      this.productsList.sort(function (a, b) {
        return a.price - b.price;
      });
      this.productsList.forEach(function (product) {
        product.price = product.price.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
      });
    },
    // По убыванию
    sortFromMaxToMin: function sortFromMaxToMin() {
      this.productsList.forEach(function (product) {
        product.price = product.price.split(' ').join('');
      });
      this.productsList.sort(function (a, b) {
        return b.price - a.price;
      });
      this.productsList.forEach(function (product) {
        product.price = product.price.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
      });
    },
    // По названию (по алфавиту)
    sortByName: function sortByName() {
      this.productsList.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    // В случайном порядке (почти по умолчанию =))
    sortRandom: function sortRandom() {
      this.productsList.sort(function (a, b) {
        return 0.5 - Math.random();
      });
    },
    // Выбор способа сортировки
    applySort: function applySort() {
      var currentSort = document.querySelector('#sort').value;

      switch (currentSort) {
        case 'По возрастанию':
          this.sortFromMinToMax();
          break;

        case 'По убыванию':
          this.sortFromMaxToMin();
          break;

        case 'По наименованию':
          this.sortByName();
          break;

        default:
          this.sortRandom();
          break;
      }
    },
    // ----------Компонент хранения данных----------
    // Получить данные с хранилища
    getStorage: function getStorage() {
      return JSON.parse(localStorage.getItem('list'));
    },
    // Записать данные в хранилище
    setStorage: function setStorage(value) {
      localStorage.setItem('list', JSON.stringify(value));
    },
    // Обновить данные в хранилище
    updateStorage: function updateStorage() {
      // Пустой массив нужен для методов добавления и удаления в список
      if (this.getStorage() === null) {
        this.setStorage([]);
        return;
      }

      this.setStorage(this.productsList);
    }
  },
  mounted: function mounted() {
    // На случай засорения localStorage 
    // Раскомментировать, выполнить, закомментировать
    // this.setStorage([]); 
    this.productsList = this.getStorage();
  },
  watch: {
    productsList: function productsList() {
      this.updateStorage();
    }
  }
});
app.mount('#app');