/* eslint-disable indent */
/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    }
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class AmountWidget {
    constructor(element){
      const thisWidget = this;
      
      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      // console.log(thisWidget.input.value);
      thisWidget.initActions();
      // console.log('AmoutnWidget:', thisWidget);
      // console.log('constructor arguments:', element);
    }
    annouce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      // console.log(event);
      thisWidget.element.dispatchEvent(event);
      // console.log(event);
    }
    setValue(value){
      const thisWidget = this;
     
      const newValue = parseInt(value);
      // console.log(thisWidget);

      if (value !== thisWidget.value && value >= settings.amountWidget.defaultMin && value <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
        thisWidget.annouce();
      }
      thisWidget.input.value = thisWidget.value;
    }
    initActions(){
      const thisWidget = this;
     
      thisWidget.input.addEventListener('change', thisWidget.setValue(thisWidget.value));
      thisWidget.linkDecrease.addEventListener('click', thisWidget.linkDecreaseHandler.bind(thisWidget));
      // console.log(thisWidget.linkDecreaseHandler);
      thisWidget.linkIncrease.addEventListener('click', thisWidget.linkIncreaseHandler.bind(thisWidget));
    }
    linkDecreaseHandler(event){
      const thisWidget = this;
      event.preventDefault();
      const value = thisWidget.value - 1; 
      // console.log(value);
      thisWidget.setValue(value);
    }
    linkIncreaseHandler(event){
      event.preventDefault();
      const thisWidget = this; 
      const value = thisWidget.value + 1; 
      // console.log(value);
      thisWidget.setValue(value);
    }
   
    getElements(element){
      const thisWidget = this;
      
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      // console.log(thisWidget.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
  }

  class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
      // console.log('new Product: ', thisProduct);
    }
    addToCart(){
      const thisProduct = this;
      
      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;
      app.cart.add(thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;

      const generatedHTML = templates.menuProduct(thisProduct.data);

      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      const menuContainer = document.querySelector(select.containerOf.menu);

      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      // console.log(thisProduct.imageWrapper);
    }

    
    
    initAccordion(){
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const trigger = thisProduct.accordionTrigger;
      // console.log(trigger);
      /* START: click event listener to trigger */
      trigger.addEventListener('click', function(event){
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */
        const element = thisProduct.element;
        element.classList.toggle('active');
        /* find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
        // console.log(activeProducts);
        /* START LOOP: for each active product */
        for (let product of activeProducts) {
          // console.log(product);
          // console.log(product == element);
          /* START: if the active product isn't the element of thisProduct */
          if (product != element) {
            /* remove class active for the active product */
          product.classList.remove('active');          
          }
          /* END: if the active product isn't the element of thisProduct */
        }
        /* END LOOP: for each active product */
      });
      /* END: click event listener to trigger */
    }


    initOrderForm() {
      const thisProduct = this;
      // console.log('initOrderForm' + thisProduct);
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    processOrder(){
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      thisProduct.params = {};
      // console.log(thisProduct);
      thisProduct.params = {};
      let price = thisProduct.data.price;
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        for(let optionId in param.options) {
          const option = param.options[optionId];
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          
          if(optionSelected && !option.default) {
            price = price + option.price;
          } else if(!optionSelected && option.default) {
            price = price - option.price;
          }
          if(optionSelected) {
            if(!thisProduct.params[paramId]) {
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;            
          }
          /* create const with found elements */
          const foundElements = thisProduct.imageWrapper.querySelectorAll('img');
          // console.log(optionSelected);

          /* if statment - option is checked or not */
          if (optionSelected) {
            if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;

            for (let element of foundElements) {
              // console.log(element);
              // console.log(element.classList.value.split('-')[1] == optionId);
              if (element.classList.value.split('-')[1] == optionId) {
                element.classList.add(classNames.menuProduct.imageVisible);
              }}
            } 
            else {
              for (let element of foundElements) {
               
                if (element.classList.value.split('-')[1] == optionId) {
                  element.classList.remove('active');
                }}
          }
        }
      }
     /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
    // console.log(thisProduct.params);
    }

    // processOrder() {
    //   const thisProduct = this;
    //   const formData = utils.serializeFormToObject(thisProduct.form);
    //   let price = thisProduct.data.price;

    //   /* Params Loop start */
    //   for (let paramId in thisProduct.data.params) {
    //     const param = thisProduct.data.params[paramId];
    //   /* option Loop start */
    //     for (let option of param.options) {
    //   /* if statment */
    //       if (option.default) {
            
    //       }
    //   //     if (option.default == true) {
    //   // /* if checked is true, increase price */
        
    //   // /* if checked is false, decrease price */
    //   //     } else {
            
    //   //     }
    //   /* option Loop end */
    //     }
    //   /* Params Loop end */
    //   }
    //   thisProduct.priceElem = price;
    // }
    initAmountWidget(){
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', thisProduct.processOrder.bind(thisProduct));
    }
  }

  class Cart{
    constructor(element){
      const thisCart = this;
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();      

      // console.log('new Cart', thisCart);
    }

    add(menuProduct){
      const thisCart = this;      

      const generatedHTML = templates.cartProduct(menuProduct);

      // console.log(generatedHTML);

      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      // console.log(generatedDOM);

      thisCart.dom.productList[menuProduct.id] = generatedDOM;

      const cartContainer = document.querySelector(select.cart.productList);
      // console.log(cartContainer);

      cartContainer.appendChild(thisCart.dom.productList[menuProduct.id]);


      // console.log('adding product', menuProduct);

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      thisCart.dom.productList[menuProduct.id].addEventListener('updated', function(){
        thisCart.update();
      });
      thisCart.dom.productList[menuProduct.id].addEventListener('remove', function(event){
        thisCart.remove(event.detail.cartProduct);
      });
      thisCart.update();
    }

    update(){
      const thisCart = this;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
      for (let product of thisCart.products){
        thisCart.subtotalPrice += product.price;
        thisCart.totalNumber += product.amount;
      }
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      console.log(thisCart.totalNumber, thisCart.subtotalPrice, thisCart.totalPrice);
    
      for(let key of thisCart.renderTotalsKeys){
        for(let elem of thisCart.dom[key]){
          elem.innerHTML = thisCart[key];
        }
      }
    }

    getElements(element){
      const thisCart = this;
      
      thisCart.dom = {}; 
      thisCart.dom.productList = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
      console.log(thisCart.dom.phone,  thisCart.dom.address);
      for(let key of thisCart.renderTotalsKeys){
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      }
    }

    remove(cartProduct){
      const thisCart = this;
      const index = thisCart.products.indexOf[cartProduct];
      thisCart.products.splice(index, 1);
      cartProduct.dom.wrapper.remove();
      thisCart.update();
    }

    cartToggleHandler(){
      const thisCart = this;
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    }

    initActions() {
      const thisCart = this; 
      console.log(thisCart.dom.productList);
      
      thisCart.dom.toggleTrigger.addEventListener('click', thisCart.cartToggleHandler.bind(thisCart));  
    
      thisCart.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        
        thisCart.sendOrder();
      });
    }

    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.order;

      const payload = {
        products: [],
        phone:  thisCart.dom.phone.value,
        address:  thisCart.dom.address.value,
        totalPrice: thisCart.totalPrice,
        totalNumber: thisCart.totalNumber,
        subtotalPrice: thisCart.subtotalPrice,
        deliveryFee: thisCart.deliveryFee
      };

      for(let product of thisCart.products){
        const data = thisCart.getData(product);
        payload.products.push(data);
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
        });
    }

    getData(product){
      return {
        id: product.id,
        amount: product.amount,
        price: product.price,
        priceSingle: product.priceSingle,
        params: product.params
      };
    }
  }

  class CartProduct{
    constructor(menuProduct, element){
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
      
      thisCartProduct.getElements(element);

      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
      // console.log(thisCartProduct);
    }

    remove(){
      const thisCartProduct = this;

      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        }
      });
      console.log(thisCartProduct.dom);
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }

    initActions(){
      const thisCartProduct = this;

      // thisCartProduct.dom.edit.addEventListener();
      thisCartProduct.dom.remove.addEventListener('click', thisCartProduct.remove.bind(thisCartProduct));
    }

    getElements(element){
      const thisCartProduct = this;

      thisCartProduct.dom = {};

      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
      thisCartProduct.initAmountWidget();
    }
    initAmountWidget(){
      const thisCartProduct = this;
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      // console.log(thisCartProduct.amount);
      thisCartProduct.dom.amountWidget.addEventListener('updated', (event) => {
        // console.log(event);
        event.preventDefault();
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.priceSingle * thisCartProduct.amount;
      });
    }
  }

  const app = {
    initMenu: function() {
      const thisApp = this;
      // console.log('thisApp.data', thisApp.data);

      for(let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },
    initData: function() {
      const thisApp = this;

      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.product;
      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);

          thisApp.data.products = parsedResponse;
          console.log(thisApp.data);
          thisApp.initMenu();
        });

      console.log('thisApp.data', JSON.stringify(thisApp.data));
    },
    initCart() {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },
    init: function(){
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);
      thisApp.initData();
      thisApp.initCart();
    }
  };

  app.init();
}
