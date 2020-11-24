import {select, templates} from '../settings.js';
import {AmountWidget} from './AmountWidget.js';
import {utils} from '../utils.js';

class Booking{
  constructor(container){
    const thisBooking  = this;

    thisBooking.render(container);
    thisBooking.initWidgets();
  }
  render(container){
    const thisBooking  = this;
    console.log(container);
    const generatedHTML = templates.bookingWidget();
    
    thisBooking.dom = {};
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    console.log(thisBooking.dom.wrapper);
    container.appendChild(thisBooking.dom.wrapper);
  }
  initWidgets(){
    const thisBooking  = this;
    
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    console.log(thisBooking.peopleAmount);
    console.log(thisBooking.hoursAmount);
  }
}

export default Booking;