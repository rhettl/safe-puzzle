/**
 * Created by rhett on 5/20/16.
 */
'use strict';

var extend     = require('extend');
var defOptions = {
  length:   4,
  maxTries: 0,
};

var Safe = function (opts) {
  // Public variables
  this.options = extend({}, defOptions, opts);
  this.tries   = 0;
  this.last    = '';

  for (let i = 0, l = this.options.length; i < l; i++) {
    this.last += 0;
  }

  // Private variables
  var combo    = '';
  var unlocked = false;

  // inside so it can access private vars
  this.set   = function (newCombo) {
    if (typeof newCombo !== 'string' || newCombo.length !== this.options.length) {
      throw new Error(`New combo must be length ${this.options.length}. Given: ${newCombo}`);
    }
    this.tries = 0;
    combo      = newCombo;
    unlocked   = false;
  };
  this.test  = function (test) {
    if (unlocked) {
      throw new UnlockedError();
    } else {

      this.tries++;
      if (this.options.maxTries && this.tries > this.options.maxTries) {
        throw new MaxTriesError();
      }

      if (test) {
        this.last = test;
      }
      unlocked = this.last === combo;

    }

    return this.isUnlocked();
  };
  this.try   = this.test;
  this.check = this.test;

  this.isUnlocked = function () {
    return unlocked;
  };

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
  return this.try((this.last + num).slice(-1 * this.options.length));
};


var UnlockedError = function (message) {
  Error.call(this);
  this.name    = 'EUNLOKD';
  this.message = message || 'Safe already unlocked, stop trying or reset.';
};
var MaxTriesError = function (message) {
  Error.call(this);
  this.name    = 'EMAXTRIES';
  this.message = message || 'Exceeded maximum number of unsuccessful tries.';
};



module.exports               = Safe;
module.exports.UnlockedError = UnlockedError;
module.exports.MaxTriesError = MaxTriesError;


var s = new Safe();
