import BaseComponent from "./BaseComponent.js";
import MatchMedia from "./MatchMedia.js";

const rootSelector = '[data-select]';

class Select extends BaseComponent {
  selectors = {
    root: rootSelector,
    btn: '[data-select-btn]',
    dropdown: '[data-select-dropdown]',
    originalControl: '[data-select-original-control]',
    option: '[data-select-option]'
  }

  stateClasses = {
    isExpanded: 'is-expanded',
    isCurrent: 'is-current',
    isSelected: 'is-selected',
    isOnTheLeftSide: 'is-on-the-left-side',
    isOnTheRightSide: 'is-on-the-right-side'
  }

  stateAttributes = {
    ariaExpanded: 'aria-expanded',
    ariaSelected: 'aria-selected',
    ariaActiveDescendant: 'aria-activedescendant'
  }

  initialState = {
    isExpanded: false,
    currentOptionIndex: null,
    selectedOptionElement: null
  }

  constructor(rootElement) {
    super();
    this.rootElement = rootElement;
    this.originalControlElement = this.rootElement.querySelector(this.selectors.originalControl);
    this.btnElement = this.rootElement.querySelector(this.selectors.btn);
    this.dropdownElement = this.rootElement.querySelector(this.selectors.dropdown);
    this.optionElements = this.dropdownElement.querySelectorAll(this.selectors.option);
    this.state = this.getProxyState({
      ...this.initialState,
      currentOptionIndex: this.originalControlElement.selectedIndex,
      selectedOptionElement: this.optionElements[this.originalControlElement.selectedIndex],
    });
    this.fixDropdownPosition();
    this.updateTabIndexes();
    this.bindEvents();
  }

  get isNeedToExpand() {
    const isButtonFocused = document.activeElement === this.btnElement;

    return (!this.state.isExpanded && isButtonFocused);
  }

  selectCurrentOption() {
    this.state.selectedOptionElement = this.optionElements[this.state.currentOptionIndex];
  }

  updateTabIndexes(isMobileDevice = MatchMedia.mobile.matches) {
    this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1;
    this.btnElement.tabIndex = isMobileDevice ? -1 : 0;
  }

  updateUI() {
    const {isExpanded, currentOptionIndex, selectedOptionElement} = this.state;

    const newSelectedOptionValue = selectedOptionElement.textContent.trim();

    const updateOriginalControl = () => {
      this.originalControlElement.value = newSelectedOptionValue;
    }

    const updateBtn = () => {
      this.btnElement.textContent = newSelectedOptionValue;
      this.btnElement.classList.toggle(this.stateClasses.isExpanded, isExpanded);
      this.btnElement.setAttribute(this.stateAttributes.ariaExpanded, isExpanded);
      this.btnElement.setAttribute(
        this.stateAttributes.ariaActiveDescendant,
        this.optionElements[currentOptionIndex].id
      );
    }

    const updateDropdown = () => {
      this.dropdownElement.classList.toggle(this.stateClasses.isExpanded, isExpanded);
    }

    const updateOption = () => {
      this.optionElements.forEach((optionElement, index) => {
        const isCurrent = currentOptionIndex === index;
        const isSelected = selectedOptionElement === optionElement;

        optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent);
        optionElement.classList.toggle(this.stateClasses.isSelected, isSelected);
        optionElement.setAttribute(this.stateAttributes.ariaSelected, isSelected);
      })
    }

    updateOriginalControl();
    updateBtn();
    updateDropdown();
    updateOption();
  }

  toggleExpandedState() {
    this.state.isExpanded = !this.state.isExpanded;
  }

  expand() {
    this.state.isExpanded = true;
  }

  collapse() {
    this.state.isExpanded = false;
  }

  onBtnClick = () => {
    this.toggleExpandedState();
  }

  onClick = (event) => {
    const {target} = event;
    const isOutsideDropdownClick = target.closest(this.selectors.dropdown) !== this.dropdownElement;
    const isBtnClick = target === this.btnElement;

    if (!isBtnClick && isOutsideDropdownClick) {
      this.collapse();
      return;
    }

    const isOptionClick = target.matches(this.selectors.option);

    if (isOptionClick) {
      this.state.selectedOptionElement = target;
      this.state.currentOptionIndex = [...this.optionElements].findIndex(
        (optionElement) => optionElement === target
      )
      this.collapse();
    }
  }

  onArrowUpKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    if (this.state.currentOptionIndex > 0) {
      this.state.currentOptionIndex--;
    }
  }

  onArrowDownKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    if (this.state.currentOptionIndex < this.optionElements.length - 1) {
      this.state.currentOptionIndex++;
    }
  }

  onSpaceKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    this.selectCurrentOption();
    this.collapse();
  }

  onEnterKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    this.selectCurrentOption();
    this.collapse();
  }

  onKeyDown = (event) => {
    const {code} = event;

    const action = {
      ArrowUp: this.onArrowUpKeyDown,
      ArrowDown: this.onArrowDownKeyDown,
      Space: this.onSpaceKeyDown,
      Enter: this.onEnterKeyDown
    }[code];

    if (action) {
      event.preventDefault();
      action();
    }
  }

  fixDropdownPosition() {
    const viewportWidth = document.documentElement.clientWidth;
    const halfViewportX = viewportWidth / 2;
    const {width, x} = this.btnElement.getBoundingClientRect();
    const btnCenterX = x + width / 2;
    const isBtnOnTheLeftViewportSide = btnCenterX < halfViewportX;

    this.dropdownElement.classList.toggle(this.stateClasses.isOnTheLeftSide, isBtnOnTheLeftViewportSide);
    this.dropdownElement.classList.toggle(this.stateClasses.isOnTheRightSide, !isBtnOnTheLeftViewportSide);
  }

  onMobileMatchMediaChange = (event) => {
    this.updateTabIndexes(event.matches);
  }

  onOriginalControlChange = () => {
    this.state.selectedOptionElement = this.optionElements[this.originalControlElement.selectedIndex];
  }

  bindEvents() {
    MatchMedia.mobile.addEventListener('change', this.onMobileMatchMediaChange);
    this.btnElement.addEventListener('click', this.onBtnClick);
    document.addEventListener('click', this.onClick);
    this.rootElement.addEventListener('keydown', this.onKeyDown);
    this.originalControlElement.addEventListener('change', this.onOriginalControlChange)
  }
}

class SelectCollection {
  constructor() {
    this.init();
  };

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Select(element);
    });
  }
}

export default SelectCollection;