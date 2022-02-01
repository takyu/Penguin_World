import gsap from "gsap";
import { nodeOps as ns } from "./nodeOps";

class TextAnimation {
  constructor(el) {
    this.DOM = {};
    this.DOM.el = el instanceof HTMLElement ? el : ns.qs(el);
    this.chars = this.DOM.el.innerHTML.trim().split("");
    this.DOM.el.innerHTML = this._splitText();
  }
  _splitText() {
    return this.chars.reduce((acc, curr) => {
      curr = curr.replace(/\s+/, "&nbsp;");
      return `${acc}<span class='char'>${curr}</span>`;
    }, "");
  }
  animate() {
    this.DOM.el.classList.toggle("inview");
  }
}

class TweenTextAnimation extends TextAnimation {
  constructor(el) {
    super(el);
    this.DOM.chars = ns.qsAl(".char", this.DOM.el);
  }

  animate() {
    this.DOM.el.classList.add("inview");
    this.DOM.chars.forEach((c, i) => {
      gsap.to(c, 0.5, {
        ease: "sine.inOut",
        delay: i * 0.05,
        startAt: {
          y: "-50%",
          opacity: 0,
        },
        y: "0%",
        opacity: 1,
      });
    });
  }
}

export { TextAnimation, TweenTextAnimation };
