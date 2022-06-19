'use strict';

const app = Vue.createApp({
  data() {
    return {
      currProduct: {
        name: '',
        description: '',
        link: '',
        price: '',
      },
      productsList: [{
        name: 'Наименование товара',
        description: 'Довольно-таки интересное описание товара в несколько строк. Довольно-таки интересное описание товара в несколько строк',
        link: 'img/product.png',
        price: '10 000',
      }],
    }
  },

  methods: {
    // -------Компонент валидации--------

    // Проверка на пустое поле

    requiredFieldCheck(field) {
      if (!field.value) {
        field.classList.add('required-field');
        return false;
      }
      field.classList.remove('required-field');
      return true;
    },

    // Проверка всех полей при изменении одного из них

    validateFields() {

      // Стилизация пустых полей 

      const inputs = document.querySelectorAll('input[required]');
      const labels = document.querySelectorAll('.form__label_required');
      const results = [];

      for (let i = 0; i < inputs.length; i++) {
        results.push(this.requiredFieldCheck(inputs[i]));
        if (results[i]) {
          labels[i].classList.remove('required-field');
          inputs[i].style.outline = 'none';
        } else {
          labels[i].classList.add('required-field');
          inputs[i].style.outline = '1px solid #ff8484';
        }
      }

      // Активация и деактивация кнопки

      const button = document.querySelector('.form__submit-btn');
      const pass = results.reduce((a, b) => a * b);

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

    inputChangeHandler(event) {
      this.currProduct[event.target.id] = event.target.value;
    },

    // Добавление продукта в корзину

    addToProductsList(product) {
      // Маска разделения тысячных долей пробелом
      product.price = product.price.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
      this.productsList.push({
        ...product
      });
      this.updateStorage();
    },

    // Удаление продукта из корзины

    removeFromProductsList(event) {
      const productCard = event.target.closest('.products-list-item');
      this.productsList.splice(productCard.id, 1);
      this.updateStorage();
    },

    // ---------Компонент с сортировками-------------

    // По возрастанию

    sortFromMinToMax() {

      this.productsList.forEach(product => {
        product.price = product.price.split(' ').join('');
        // product.price = product.price.replace(/\s/g, '');
      });

      this.productsList.sort((a, b) => a.price - b.price);

      this.productsList.forEach(product => {
        product.price = product.price.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
      });
    },

    // По убыванию

    sortFromMaxToMin() {
      this.productsList.forEach(product => {
        product.price = product.price.split(' ').join('');
      });

      this.productsList.sort((a, b) => b.price - a.price);

      this.productsList.forEach(product => {
        product.price = product.price.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
      });
    },

    // По названию (по алфавиту)

    sortByName() {
      this.productsList.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
    },

    // В случайном порядке (почти по умолчанию =))

    sortRandom() {
      this.productsList.sort((a, b) => 0.5 - Math.random());
    },

    // Выбор способа сортировки

    applySort() {
      const currentSort = document.querySelector('#sort').value;

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

    getStorage() {
      return JSON.parse(localStorage.getItem('list'));
    },

    // Записать данные в хранилище

    setStorage(value) {
      localStorage.setItem('list', JSON.stringify(value));
    },

    // Обновить данные в хранилище

    updateStorage() {
      // Пустой массив нужен для методов добавления и удаления в список
      if (this.getStorage() === null) {
        this.setStorage([]);
        return;
      }
      this.setStorage(this.productsList);
    }
  },

  mounted() {
    // На случай засорения localStorage 
    // Раскомментировать, выполнить, закомментировать
    // this.setStorage([]); 
    this.productsList = this.getStorage();
  },

  watch: {
    productsList() {
      this.updateStorage();
    }
  }
});

app.mount('#app');