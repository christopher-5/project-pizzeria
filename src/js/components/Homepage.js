import {templates} from '../settings.js';
import {utils} from '../utils.js';

export default class Homepage {
  constructor(container){
    const thisPage = this;

    thisPage.render(container);
  }

  render(container){
    const thisPage = this;

    const generatedHTML = templates.homePage();
    thisPage.dom = {};

    thisPage.dom.wrapper = utils.createDOMFromHTML(generatedHTML);
    console.log(thisPage.dom.wrapper);
    container.appendChild(thisPage.dom.wrapper);
  }
}