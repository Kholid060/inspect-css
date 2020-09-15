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

    this.show = this.showTooltip.bind(this);
    this.hide = this.hideTooltip.bind(this);

    this.init();
  }

  setOptions(options = {}) {
    Object.assign(this.options, options);

    if (this.popperInstance) {
      this.popperInstance.setOptions(this.options);
    }

    if (this.getCurrentTooltip) {
      const currentTooltipContent = this.getCurrentTooltip.querySelector('.tooltip-ui__content');

      currentTooltipContent.innerText = this.options.content;
    }
  }

  destroy() {
    this.reference.removeEventListener('mouseenter', this.show);
    this.reference.removeEventListener('mouseleave', this.hide);
    // this.reference.removeEventListener('click', this.hide);
  }

  get getCurrentTooltip() {
    return this.options.tooltipRoot.querySelector(`[tooltip-id="${this.id}"]`);
  }

  hideTooltip() {
    if (this.getCurrentTooltip) {
      this.getCurrentTooltip.classList.remove('show');

      setTimeout(() => {
        try {
          this.getCurrentTooltip.remove();
        } catch (err) {
          // Do nothing
        }
      }, this.timeoutDelay);
    }
  }

  showTooltip() {
    if (this.getCurrentTooltip) return;

    const content = this.createTooltipContent();

    this.options.tooltipRoot.appendChild(content);

    setTimeout(() => {
      content.classList.add('show');
    }, this.timeoutDelay);
  }

  createTooltipContent() {
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

  init() {
    this.destroy();

    this.reference.addEventListener('mouseenter', this.show);
    this.reference.addEventListener('mouseleave', this.hide);
    // this.reference.addEventListener('click', this.hide);
  }
}
