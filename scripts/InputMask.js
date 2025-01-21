const rootSelector = '[data-input-mask]';

class InputMask {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.init();
  }

  init() {
    const isLibReady = typeof window.IMask !== 'undefined';

    if (isLibReady) {
      window.IMask(this.rootElement, {
        mask: this.rootElement.dataset.inputMask
      })
    } else {
      console.error('Библиотека IMask подключена некорректно')
    }
  }
}

class InputMaskCollections {
  constructor() {
    this.init();
  };

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new InputMask(element);
    });
  }
}

export default InputMaskCollections;