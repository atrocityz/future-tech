class Header {
  selectors = {
    root: "[data-header]",
    overlay: "[data-header-overlay]",
    burgerBtn: "[data-header-burger-btn]"
  };

  stateClasses = {
    isActive: "is-active",
    isLock: "is-lock"
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.overlayElement = this.rootElement.querySelector(this.selectors.overlay);
    this.burgerBtnElement = this.rootElement.querySelector(this.selectors.burgerBtn);
    this.bindEvents();
  }

  onBurgerButtonClick = () => {
    this.burgerBtnElement.classList.toggle(this.stateClasses.isActive);
    this.overlayElement.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock);
  };

  bindEvents() {
    this.burgerBtnElement.addEventListener("click", this.onBurgerButtonClick);
  }
}

export default Header;
