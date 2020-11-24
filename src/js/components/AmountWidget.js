import {settings, select} from '../settings.js';

export class AmountWidget {
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
    console.log(element);
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
}

export default AmountWidget;