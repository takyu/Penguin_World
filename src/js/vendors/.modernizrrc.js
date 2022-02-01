/**
 * I had to change the conditional branch of the script for touchevent
 * as follows to make it work properly.
 *
 * - Before modernizr.js (line 539)
 *
 * if (('ontouchstart' in window)
 *  || window.TouchEvent || window.DocumentTouch
 *  && document instanceof DocumentTouch) {
 *
 * - After modernizr.js (line 539)
 *
 * if (('ontouchstart' in window)
 *  || window.DocumentTouch && document instanceof DocumentTouch) {
 */

module.exports = {
  minify: false,
  options: ["setClasses"],
  "feature-detects": ["test/touchevents"],
};
