import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

export class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
      
    thisWidget.getElements(element);   
  
    thisWidget.initActions();
  }
  
  isValid(value){
    return !isNaN(value) 
      && value >= settings.amountWidget.defaultMin 
      && value <= settings.amountWidget.defaultMax;
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions(){
    const thisWidget = this;
     
    thisWidget.dom.input.addEventListener('change', thisWidget.setValue(thisWidget.value));
    thisWidget.dom.linkDecrease.addEventListener('click', thisWidget.linkDecreaseHandler.bind(thisWidget));
    thisWidget.dom.linkIncrease.addEventListener('click', thisWidget.linkIncreaseHandler.bind(thisWidget));
  }
  linkDecreaseHandler(event){
    const thisWidget = this;
    event.preventDefault();
    const value = thisWidget.value - 1; 
    thisWidget.setValue(value);
  }
  linkIncreaseHandler(event){
    event.preventDefault();
    const thisWidget = this; 
    const value = thisWidget.value + 1;
    thisWidget.setValue(value);
  }
   
  getElements(){
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
}

export default AmountWidget;