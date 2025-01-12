import pxToRem from "./utils/pxToRem.js";

const rootSelector = '[data-expandable-content]';

class ExpandableContent {
  selectors = {
    root: rootSelector,
    btn: '[data-expandable-content-btn]'
  }

  stateClasses = {
    isExpanded: 'is-expanded'
  }

  animationParams = {
    duration: 500,
    easing: 'ease'
  }

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.btnElement = this.rootElement.querySelector(this.selectors.btn);
    this.bindEvents()
  }

  expand() {
    const {offsetHeight, scrollHeight} = this.rootElement;

    this.rootElement.classList.add(this.stateClasses.isExpanded);
    this.rootElement.animate([
      {
        maxHeight: `${pxToRem(offsetHeight)}rem`
      },
      {
        maxHeight: `${pxToRem(scrollHeight)}rem`
      }
    ], this.animationParams)
  }

  onBtnClick = () => {
    this.expand()
  }

  bindEvents() {
    this.btnElement.addEventListener('click', this.onBtnClick)
  }

}

class ExpandableContentCollection {
  constructor() {
    this.init();
  };

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new ExpandableContent(element);
    });
  }
}

export default ExpandableContentCollection;