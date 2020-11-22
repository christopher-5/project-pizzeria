import {settings, templates, select, classNames} from '../settings.js';
import {utils} from '../utils.js';
import CartProduct from './CartProduct.js';


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

export default Cart;