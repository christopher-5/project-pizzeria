import {select} from '../settings.js';
import {AmountWidget} from './AmountWidget.js';

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

export default CartProduct;