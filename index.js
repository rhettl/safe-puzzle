/**
 * Created by rhett on 5/20/16.
 */
'use strict';

var extend = require('extend');
var defOptions = {
  length: 4,
  maxTries: 0,
};

var Safe = function (opts) {
  // Public variables
  this.options = extend({}, defOptions, opts);
  this.tries = 0;
  this.last = '';

  for (let i = 0, l = this.options.length; i < l; i++) {
    this.last += 0;
  }

  // Private variables
  var combo = '';

  // inside so it can access private vars
  this.set = function (newCombo) {
    if (typeof newCombo !== 'string' || newCombo.length !== this.options.length) {
      throw new Error(`New combo must be length ${this.options.length}. Given: ${newCombo}`);
    }
    combo = newCombo;
  };
  this.test = function (test) {
    this.tries ++;
    if (this.options.maxTries && this.tries > this.options.maxTries) {
      throw new Error('Exceeded maximum number of tries allowed');
    }
    if (test) {
      this.last = test;
    }
    return this.last === combo;
  };
  this.try = this.test;
  this.check = this.test;

  // Init
  this.randomize();
};

Safe.prototype.randomize = function () {
  var combo = '';
  for (let i = 0, l = this.options.length; i < l; i++) {
    combo += ( parseInt(Math.random() * 10) - 1);
  }
  this.set(combo);
};

Safe.prototype.push = function (num) {
  return this.try(this.last.slice(1) + num);
};



module.exports = Safe;


var s = new Safe();
