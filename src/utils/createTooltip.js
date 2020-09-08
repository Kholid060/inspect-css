import { createPopper } from '@popperjs/core';
import tooltipTemplate from './tooltipTemplate';

let id = 1;

const defaultOptions = {
  placement: 'top',
  tooltipRoot: document.body,
  content: '',
};

export default class CreateTooltip {
  constructor(element, options = {}) {
    Object.assign(this, {
      element,
      options: Object.assign(defaultOptions, options),
      timeoutDelay: 250,
      popperInstance: null,
      id: id++,
    });

    this.bindShow = this.show.bind(this);
    this.bindHide = this.hide.bind(this);

    this._init();
  }

  hide() {
    if (this._getCurrentTooltip) {
      this._getCurrentTooltip.classList.remove('show');

      setTimeout(() => {
        this._getCurrentTooltip.remove();
      }, this.timeoutDelay);
    }
  }

  show() {
    if (this._getCurrentTooltip) return;

    const content = this._createTooltipContent();

    this.options.tooltipRoot.appendChild(content);

    setTimeout(() => {
      content.classList.add('show');
    }, this.timeoutDelay);
  }

  setOptions(options) {
    Object.assign(this.options, options);
  }

  destroy() {
    this.element.removeEventListener('mouseenter', this.bindShow);
    this.element.removeEventListener('focus', this.bindShow);
    this.element.removeEventListener('mouseleave', this.bindHide);
    this.element.removeEventListener('click', this.bindHide);
  }

  get _getCurrentTooltip() {
    return this.options.tooltipRoot.querySelector(`[tooltip-id="${this.id}"]`);
  }

  _createTooltipContent() {
    console.log(this.options);
    const content = tooltipTemplate(this.id, {
      content: this.options.content,
      placement: this.options.placement,
    });
    this.popperInstance = createPopper(this.element, content, {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 5],
          },
        },
      ],
      ...this.options,
    });

    return content;
  }

  _init() {
    this.destroy();

    this.element.addEventListener('mouseenter', this.bindShow);
    this.element.addEventListener('focus', this.bindShow);
    this.element.addEventListener('mouseleave', this.bindHide);
    this.element.addEventListener('click', this.bindHide);
  }
}
