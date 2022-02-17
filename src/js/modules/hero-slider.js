import Swiper from "swiper/bundle";

class HeroSlider {
  constructor(el) {
    this.el = el;
    this.swiper = this._initSwuiper();
  }

  _initSwuiper() {
    return new Swiper(this.el, {
      loop: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      centeredSlides: true,
      slidesPerView: 1,
      speed: 3000,
    });
  }

  start(options = {}) {
    this.swiper.params.autoplay = Object.assign(
      {
        delay: 4000,
        disableOnInteraction: false,
      },
      options
    );
    this.swiper.autoplay.start();
  }
  stop() {
    this.swiper.autoplay.stop();
  }
}

export { HeroSlider };
