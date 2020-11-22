import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';

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

    // app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct
      }
    });

    thisProduct.element.dispatchEvent(event);
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

export default Product;