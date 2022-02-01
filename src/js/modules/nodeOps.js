const nodeOps = {
  qs(selector, scope) {
    return (scope || document).querySelector(selector);
  },
  qsAl(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  },
  html(target, value) {
    if (value) {
      target.innerHTML = value;
    } else {
      return target.innerHTML;
    }
  },
  txc(target) {
    return target.textContent;
  },
  stc(target, color) {
    target.style.color = color;
  },
  stbc(target, color) {
    target.style.backgroundColor = color;
  },
  clta(target, clsName) {
    target.classList.add(clsName);
  },
  cltr(target, clsName) {
    target.classList.remove(clsName);
  },
  cltt(target, clsName) {
    target.classList.toggle(clsName);
  },
  on(target, eventType, callback) {
    target.addEventListener(eventType, callback);
  },
  rmon(target, eventType, callback) {
    target.removeEventListener(eventType, callback);
  },
  setAttr(target, key, val) {
    target.setAttribute(key, val);
  },
  rmAttr(target, key) {
    target.removeAttribute(key);
  },
};

export { nodeOps };
