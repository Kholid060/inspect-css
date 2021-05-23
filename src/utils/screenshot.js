class Screenshot {
  static async captureVisible() {
    const imageUri = await browser.runtime.sendMessage({ type: 'screenshot' });
    const image = new Image();

    image.src = imageUri;

    return image;
  }

  static captureAll() {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const { body } = document;
      const element = document.documentElement;
      const originalSize = element.scrollHeight;
      const originalPosition = window.scrollY;

      if (body) body.style.overflowY = 'visible';

      this.insertStyle();
      this.fixedElements();

      canvas.height = element.scrollHeight * 0.7;
      canvas.width = window.innerWidth * 0.7;

      body.classList.add('is-screenshotting');

      this.getImages(originalSize, (images) => {
        this.clearUp();
        element.scrollTo(0, originalPosition);

        let position = 0;

        images.forEach((image) => {
          context.drawImage(image, 0, position, window.innerWidth * 0.7, window.innerHeight * 0.7);

          position += window.innerHeight * 0.7;
        });

        const image = new Image(canvas.width, canvas.height);
        image.src = canvas.toDataURL('image/png');

        resolve(image);
      });
    });
  }

  static getImages(originalSize, callback, images = [], scrollPosition = 0) {
    const timeout = setTimeout(() => {
      callback(images);
    }, 5000);

    if (scrollPosition >= originalSize) {
      clearTimeout(timeout);
      callback(images);

      return;
    }

    if (scrollPosition > 0) {
      document.body.classList.add('hide-fixed');
    }

    document.documentElement.scrollTo(0, scrollPosition);

    setTimeout(() => {
      this.captureVisible().then((image) => {
        images.push(image);
        clearTimeout(timeout);

        this.getImages(originalSize, callback, images, scrollPosition + window.innerHeight);
      });
    }, 500);
  }

  static insertStyle() {
    const style = document.createElement('style');
    style.innerText = 'html::-webkit-scrollbar, body::-webkit-scrollbar{ width: 0 !important; height: 0 !important }';
    style.id = 'inspect-css-scroll';

    document.body.appendChild(style);
  }

  static fixedElements() {
    Array.from(document.body.getElementsByTagName('*')).forEach((el) => {
      const { position } = getComputedStyle(el);

      if (position === 'sticky') el.setAttribute('is-sticky', '');
      if (position === 'fixed') el.setAttribute('is-fixed', '');
    });
  }

  static clearUp() {
    const style = document.getElementById('inspect-css-scroll');

    if (style) style.remove();

    document.body.classList.remove('hide-fixed');
    document.body.classList.remove('is-screenshotting');
    document.body.style.overflowY = '';
  }
}

export default Screenshot;
