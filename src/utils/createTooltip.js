import { createPopper } from '@popperjs/core';
import createTooltipTemplate from './createTooltipTemplate';

let id = 1;

export default class CreateTooltip {
  constructor(reference, options = {}) {
    const defaultOptions = {
      placement: 'top',
      tooltipRoot: document.body,
      offset: [0, 5],
    };

    Object.assign(this, {
      reference,
      options: Object.assign(defaultOptions, options),
      timeoutDelay: 250,
      popperInstance: null,
      id: id++,
    });

    this.show = this._show.bind(this);
    this.hide = this._hide.bind(this);

    this._init();
  }

  setOptions(options = {}) {
    Object.assign(this.options, options);

    if (this.popperInstance) {
      this.popperInstance.setOptions(this.options);
    }

    if (this._getCurrentTooltip) {
      const currentTooltipContent = this._getCurrentTooltip.querySelector('.tooltip-ui__content');

      currentTooltipContent.innerText = this.options.content;
    }
  }

  destroy() {
    this.reference.removeEventListener('mouseenter', this.show);
    this.reference.removeEventListener('focus', this.show);
    this.reference.removeEventListener('mouseleave', this.hide);
    // this.reference.removeEventListener('click', this.hide);
  }

  get _getCurrentTooltip() {
    return this.options.tooltipRoot.querySelector(`[tooltip-id="${this.id}"]`);
  }

  _hide() {
    if (this._getCurrentTooltip) {
      this._getCurrentTooltip.classList.remove('show');

      setTimeout(() => {
        try {
          this._getCurrentTooltip.remove();
        } catch (err) {
          // Do nothing
        }
      }, this.timeoutDelay);
    }
  }

  _show() {
    if (this._getCurrentTooltip) return;

    const content = this._createTooltipContent();

    this.options.tooltipRoot.appendChild(content);

    setTimeout(() => {
      content.classList.add('show');
    }, this.timeoutDelay);
  }

  _createTooltipContent() {
    const content = createTooltipTemplate(this.id, {
      content: this.options.content,
      placement: this.options.placement,
    });

    this.popperInstance = createPopper(this.reference, content, {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: this.options.offset,
          },
        },
        {
          name: 'arrow',
          options: {
            padding: 5,
          },
        },
      ],
      ...this.options,
    });

    return content;
  }

  _init() {
    this.destroy();

    this.reference.addEventListener('mouseenter', this.show);
    this.reference.addEventListener('focus', this.show);
    this.reference.addEventListener('mouseleave', this.hide);
    // this.reference.addEventListener('click', this.hide);
  }
}
