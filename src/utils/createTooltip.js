import createPopper from './createPopper';

const defaultOptions = {
  placement: 'top',
  tooltipRoot: document.body,
};

export default class CreateTooltip {
  constructor(element, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('First parameter must be a DOM');
      return;
    }

    Object.assign(this, {
      element,
      options: Object.assign(defaultOptions, options),
      timeoutDelay: 20000,
      content: element.dataset.tooltipContent || '',
      instance: null,
    });

    this.init();
  }

  init() {
    if (!this.element.hasAttribute('data-tooltip-id')) {
      const tooltipId = Math.random()
        .toString(36)
        .substr(2, 8);
      this.element.setAttribute('data-tooltip-id', tooltipId);
    }

    const tooltipContent = this.createTooltipContent();

    this.instance = createPopper({
      content: tooltipContent,
      container: this.element,
      options: this.options,
    });

    this.addListener(tooltipContent);
  }

  get tooltipTemplate() {
    return `
			<div 
				class="tooltip-ui__content" 
				tabindex="-1" 
				role="tooltip"
			>
				${this.content}
			</div>
		`;
  }

  createTooltipContent() {
    const { tooltipId } = this.element.dataset;
    const tooltipElement = document.createElement('div');
    tooltipElement.id = `tooltip-ui__${tooltipId}`;
    tooltipElement.classList.add('tooltip-ui');
    tooltipElement.innerHTML = this.tooltipTemplate;

    setTimeout(() => {
      tooltipElement.classList.add('show');
    }, this.timeoutDelay);

    return tooltipElement;
  }

  removeTooltip(tooltipContent) {
    if (this.options.tooltipRoot.contains(tooltipContent)) {
      tooltipContent.classList.remove('show');

      setTimeout(() => {
        tooltipContent.remove();
      }, this.timeoutDelay);
    }
  }

  addListener(tooltipContent) {
    this.element.addEventListener('mouseenter', () => {
      if (this.options.tooltipRoot.contains(tooltipContent)) {
        console.log(this);
        return;
        // get tooltip element
        // and update tooltip content
      }
      this.options.tooltipRoot.appendChild(tooltipContent);
    });
    this.element.addEventListener('mouseleave', () => this.removeTooltip(tooltipContent));
    this.element.addEventListener('click', () => this.removeTooltip(tooltipContent));
  }
}

// const timeoutDelay = 200;
// const tooltipTemplate = (content) => `
// 	<div
// 		class="tooltip-ui__content"
// 		tabindex="-1"
// 		role="tooltip"
// 	>
// 		${content}
// 	</div>
// `;

// function createTooltipContent(container, options) {
// 	let content = options.content;

// 	if (typeof content === 'undefined') {
// 		content = container.dataset.content;
// 	}

// 	const { tooltipId } = container.dataset;
// 	const tooltipElement = document.createElement('div');
// 	tooltipElement.id = `tooltip-ui__${tooltipId}`;
// 	tooltipElement.classList.add('tooltip-ui');
// 	tooltipElement.innerHTML = tooltipTemplate(content);

// 	setTimeout(() => {
// 		tooltipElement.classList.add('show');
// 	}, timeoutDelay);

// 	return tooltipElement;
// }

// function addListener({ tooltipContainer, content, options }) {
// 	const isTooltipExist = () => {
// 		const { tooltipId } = tooltipContainer.dataset;
// 		const isTooltipExist = options.tooltipRoot.getElementById(`tooltip-ui__${tooltipId}`);

// 		return !!isTooltipExist;
// 	};
// 	const removeTooltip = () => {
// 		if (options.tooltipRoot.contains(content)) {
// 			content.classList.remove('show');

// 			setTimeout(() => {
// 				content.remove();
// 			}, timeoutDelay);
// 		}
// 	};

// 	tooltipContainer.addEventListener('mouseenter', () => {
// 		if (options.tooltipRoot.contains(content)) {
// 			console.log(content);
// 			return;
// 			// get tooltip element
// 			// and update tooltip content
// 		};
// 		options.tooltipRoot.appendChild(content);
// 	});

// 	// tooltipContainer.addEventListener('mouseleave', removeTooltip);

// 	// tooltipContainer.addEventListener('click', removeTooltip);
// }

// export default function (element, options = {}) {
// 	let tooltipContainer = element;
// 	const tooltipOptions = Object.assign(defaultOptions, options);

// 	if (typeof element === 'string') {
// 		tooltipContainer = document.querySelector(element);
// 	}

// 	if (!(tooltipContainer instanceof HTMLElement)) {
// 		throw new Error('First parameter must be DOM or CSS selector string');
// 		return;
// 	}

// 	if (!tooltipContainer.hasAttribute('data-tooltip-id')) {
// 		const tooltipId = Math.random().toString(36).substr(2, 8);
// 		element.setAttribute('data-tooltip-id', tooltipId);
// 	}

// 	const content = createTooltipContent(tooltipContainer, tooltipOptions);

// 	const instance = createPopper({
// 		content,
// 		container: tooltipContainer,
// 		options: tooltipOptions,
// 	});

// 	addListener({
// 		tooltipContainer,
// 		content,
// 		options: tooltipOptions,
// 	});

// 	return instance;
// }
