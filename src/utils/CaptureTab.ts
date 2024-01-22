import RuntimeMessage from './RuntimeMessage';

function findScrollableElement(
  element = document.documentElement,
  maxDepth = 5,
): HTMLElement | null {
  if (maxDepth === 0) return null;

  const excludeTags = ['SCRIPT', 'STYLE', 'SVG', 'HEAD'];
  const isScrollable = element.scrollHeight > window.innerHeight;

  if (isScrollable) return element;

  for (const childNode of element.childNodes) {
    if (!(childNode instanceof HTMLElement)) continue;

    const isExcluded =
      childNode.tagName.includes('-') ||
      excludeTags.includes(childNode.tagName);

    if (!isExcluded) {
      const scrollableElement = findScrollableElement(childNode, maxDepth - 1);
      if (scrollableElement) return scrollableElement;
    }
  }

  return null;
}

class CaptureTab {
  static async capture() {
    const imageUri = await RuntimeMessage.sendMessage(
      'background:screenshot-tab',
    );
    const image = new Image();

    image.src = imageUri;

    return image;
  }

  static captureWholePage() {
    return new Promise<HTMLImageElement | null>((resolve) => {
      const { body } = document;
      const element = findScrollableElement() || document.documentElement;
      if (!element) return resolve(null);

      const originalSize = element.scrollHeight;
      const originalPosition = window.scrollY;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return resolve(null);

      if (body) body.style.overflowY = 'visible';

      this.insertStyle();
      this.fixedElements();

      canvas.height = element.scrollHeight * 0.7;
      canvas.width = window.innerWidth * 0.7;

      body.classList.add('is-screenshotting');

      this.getImages({
        limit: 10,
        originalSize,
        scrollElement: element,
        callback: (images) => {
          this.clearUp();

          element.scrollTo(0, originalPosition);

          let position = 0;
          images.forEach((image) => {
            context.drawImage(
              image,
              0,
              position,
              window.innerWidth * 0.7,
              window.innerHeight * 0.7,
            );

            position += window.innerHeight * 0.7;
          });

          const image = new Image(canvas.width, canvas.height);
          image.src = canvas.toDataURL('image/png');

          resolve(image);
        },
      });
    });
  }

  private static getImages(
    {
      limit,
      callback,
      originalSize,
      scrollElement,
    }: {
      limit: number;
      originalSize: number;
      scrollElement: HTMLElement;
      callback: (images: HTMLImageElement[]) => void;
    },
    images: HTMLImageElement[] = [],
    scrollPosition = 0,
  ) {
    const timeout = setTimeout(() => {
      callback(images);
    }, 5000);

    if (scrollPosition >= originalSize || images.length > limit) {
      clearTimeout(timeout);
      callback(images);

      return;
    }

    if (scrollPosition > 0) {
      document.body.classList.add('hide-fixed');
    }

    scrollElement.scrollTo({
      top: scrollPosition,
      behavior: 'instant',
    });

    setTimeout(() => {
      this.capture()
        .then((image) => {
          images.push(image);
          clearTimeout(timeout);

          this.getImages(
            { originalSize, callback, scrollElement, limit },
            images,
            scrollPosition + window.innerHeight,
          );
        })
        .catch((error) => {
          console.error(error);
          callback(images);
        });
    }, 500);
  }

  private static insertStyle() {
    const style = document.createElement('style');
    style.innerText = `
      html::-webkit-scrollbar, body::-webkit-scrollbar{ width: 0 !important; height: 0 !important }
      body.is-screenshotting [is-sticky] {
        position: relative !important;
      }
      .hide-fixed [is-fixed] {
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;
    style.id = 'inspect-css-scroll';

    document.body.appendChild(style);

    return style;
  }

  private static fixedElements() {
    const elements = document.body.getElementsByTagName('*');
    for (let index = 0; index < elements.length; index += 1) {
      const el = elements[index];
      const { position } = getComputedStyle(el);

      if (position === 'sticky') el.setAttribute('is-sticky', '');
      if (position === 'fixed') el.setAttribute('is-fixed', '');
    }
  }

  private static clearUp() {
    const style = document.getElementById('inspect-css-scroll');
    if (style) style.remove();

    document.body.classList.remove('hide-fixed');
    document.body.classList.remove('is-screenshotting');
    document.body.style.overflowY = '';
  }
}

export default CaptureTab;
