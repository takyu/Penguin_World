import Swiper from "swiper/bundle";

class HeroSlider {
  constructor(el) {
    this.el = el;
    this.swiper = this._initSwuiper();
  }

  _initSwuiper() {
    return new Swiper(this.el, {
      loop: true,
      effect: "coverflow",
      centeredSlides: true,
      slidesPerView: 1,
      speed: 1000,
      breakpoints: {
        1024: {
          slidesPerView: 2,
        },
      },
      grabCursor: true,
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
