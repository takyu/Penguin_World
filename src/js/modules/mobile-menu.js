import { nodeOps as ns } from "./nodeOps.js";
// import modernizr from 'modernizr';

export class MobileMenu {
  constructor() {
    this.DOM = {};
    this.DOM.btn = ns.qs(".mobile-menu__btn");
    this.DOM.cover = ns.qs(".mobile-menu__cover");
    this.DOM.container = ns.qs("#global-container");
    this.eventType = this._getEventType();
    this._addEvent();
  }

  _getEventType() {
    // if (Modernizr.touchevents) {
    //   return "touchstart";
    // } else {
    //   return "click";
    // }
    const isTouchCapable =
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch) ||
      navigator.maxTouchPoints > 0 ||
      window.navigator.msMaxTouchPoints > 0;

    return isTouchCapable ? "touchstart" : "click";
  }

  _toggle() {
    ns.cltt(this.DOM.container, "menu-open");
  }

  _addEvent() {
    ns.on(this.DOM.btn, this.eventType, this._toggle.bind(this));
    ns.on(this.DOM.cover, this.eventType, this._toggle.bind(this));
  }
}
