/**
 * Load vendor's style files in node_module
 */
// Apply bootstrap normalization at the very beginning
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "swiper/css/bundle";
/**
 * Load style files
 */
// import "@fontsource/kameron";
import "../assets/_sass/loader.scss";
import "../assets/_sass/style.scss";
import { HeroSlider as hsr } from "./modules/hero-slider";
import { MobileMenu as mmn } from "./modules/mobile-menu";
/**
 * Load polyfill's javascript files
 */
//import 'regenerator-runtime'
//import 'core-js'
/**
 * Load javascript files in ES module
 */
import { nodeOps as nos } from "./modules/nodeOps";
import { ScrollObserver as sor } from "./modules/scroll";
import { TweenTextAnimation as ttan } from "./modules/text-animation";

nos.on(document, "DOMContentLoaded", () => {
  const main = new Main();
  // main.destroy();
});

class Main {
  /**
   * Private fields
   */
  #hero;
  #header;
  #sides;
  #observers;

  /**
   * Constructor function
   */
  constructor() {
    this.#header = nos.qs(".header");
    this.#sides = nos.qsAl(".side");
    this.#observers = [];
    this.#init();
  }

  /**
   * Setter
   */
  set observers(instance) {
    this.#observers.push(instance);
  }

  /**
   * Getter
   */
  get observers() {
    return this.#observers;
  }

  /**
   * Private methods
   */
  #init() {
    new mmn();
    this.#hero = new hsr(".swiper");
    Pace.on("done", this.#paceDone.bind(this));
  }

  #paceDone() {
    this.#scrollInit();
  }

  #navAnimation(el, inview) {
    if (inview) {
      nos.cltr(this.#header, "triggered");
    } else {
      nos.clta(this.#header, "triggered");
    }
  }

  #sideAnimation(el, inview) {
    if (inview) {
      this.#sides.forEach((side) => nos.clta(side, "inview"));
    } else {
      this.#sides.forEach((side) => nos.cltr(side, "inview"));
    }
  }

  #inviewAnimation(el, inview) {
    if (inview) {
      nos.clta(el, "inview");
    } else {
      nos.cltr(el, "inview");
    }
  }

  #textAnimation(el, inview) {
    if (inview) {
      const ta = new ttan(el);
      ta.animate();
    }
  }

  #toggleSlideAnimation(el, inview) {
    if (inview) {
      this.#hero.start();
    } else {
      this.#hero.stop();
    }
  }

  #destroyObservers() {
    this.#observers.forEach((ob) => {
      ob.destroy();
    });
  }

  #scrollInit() {
    /**
     * Using getter/setter.
     *
     * this.#observers.push(
     *  new sor(".nav-trigger", this.#navAnimation.bind(this), { once: false })
     * );
     */
    this.observers = new sor(".nav-trigger", this.#navAnimation.bind(this), {
      once: false,
    });
    this.observers = new sor(".cover-slide", this.#inviewAnimation, {
      rootMargin: "-150px 0px",
    });
    this.observers = new sor(".appear", this.#inviewAnimation);
    this.observers = new sor(".tween-animate-title", this.#textAnimation, {
      rootMargin: "-200px 0px",
    });
    this.observers = new sor(".swiper", this.#toggleSlideAnimation.bind(this), {
      once: false,
    });
    console.log(this.#observers);
    this.observers = new sor("#main-content", this.#sideAnimation.bind(this), {
      once: false,
      rootMargin: "-500px 0px",
    });
  }

  /**
   * Public methods
   */
  destroy() {
    this.#destroyObservers();
  }
}
