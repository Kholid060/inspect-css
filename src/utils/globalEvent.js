export default class GlobalEvent {
  static init({ onEventFired }) {
    this.callback = onEventFired;
    this.bindMouseEvent = this._clickHandler.bind(this);
    this.bindKeyupEvent = this._keyupHandler.bind(this);

    this.addListener();
  }

  static addListener() {
    window.addEventListener('click', this.bindMouseEvent);
    document.addEventListener('keyup', this.bindKeyupEvent);
  }

  static removeListener() {
    window.removeEventListener('click', this.bindMouseEvent);
    document.removeEventListener('keyup', this.bindKeyupEvent);
  }

  static _keyupHandler({ code, ctrlKey }) {
    if (ctrlKey && code === 'Space') {
      const target = document.querySelector('.hover-element');

      this._eventHandler(target);
    }
  }

  static _clickHandler({ target }) {
    this._eventHandler(target);
  }

  static _eventHandler(target) {
    if (target.matches('.inspector,.active-element,html,body')) return;

    const activeElement = document.querySelector('.active-element');
    activeElement && activeElement.classList.remove('active-element');

    target.classList.add('active-element');
    this.callback();
  }
}
