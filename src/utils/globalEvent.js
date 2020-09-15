export default class GlobalEvent {
  static init({ onEventFired }) {
    this.callback = onEventFired;
    this.bindMouseEvent = this.clickHandler.bind(this);
    this.bindKeyupEvent = this.keyupHandler.bind(this);

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

  static keyupHandler({ code, ctrlKey }) {
    if (ctrlKey && code === 'Space') {
      const target = document.querySelector('.hover-element');

      this.eventHandler(target);
    }
  }

  static clickHandler({ target }) {
    this.eventHandler(target);
  }

  static eventHandler(target) {
    const isPaused = document.body.classList.contains('pause');
    const isMatchExtensionElement = target.matches('.inspect-css,.active-element,html');
    if (isMatchExtensionElement || isPaused) return;

    const activeElement = document.querySelector('.active-element');
    activeElement && activeElement.classList.remove('active-element');

    target.classList.add('active-element');
    target.classList.remove('hover-element');

    this.callback();
  }
}
