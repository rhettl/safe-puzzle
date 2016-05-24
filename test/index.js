/**
 * Created by rhett on 5/24/16.
 */
'use strict';

var assert     = require('chai').assert;
var SafePuzzle = require('../index');

var mockRandom = function () {
  return 0.5;
};

describe('Safe', function () {
  var safe;
  beforeEach(function () {
    safe = new SafePuzzle();
  });

  describe('#set', function () {
    it('should assign the given value to the combination.', function () {
      let value = '1234';
      safe.set(value);
      assert(safe.try(value), 'Set didn\'t set or Try failed to check properly.');
    });
  });

  describe('#randomize', function () {
    it('should assign a new value to the combination.', function () {
      /*
        To be fair, I have no idea how to test this and this feels inadequate.
        Help??
       */

      // Store Math.random
      let temp = Math.random;
      Math.random = mockRandom;

      // stub safe.set to check that new random is being used
      safe.set = function (newVal) {
        assert.equal('5555', newVal);
      };

      // start test, which should use the mock random
      safe.randomize();

      // re-assign original Math.random
      Math.random = temp;
    });
  });

  describe('#last', function () {
    it('should contain the most recent attempt', function () {
      safe.set('0000');

      safe.try('1234');
      assert.equal('1234', safe.last);

      safe.try('9876');
      assert.equal('9876', safe.last);

      safe.try('5555');
      assert.equal('5555', safe.last);
    });
  });

  describe('#tries', function () {
    it('should start at 0', function () {
      assert.equal(0, safe.tries);
    });
    it('should increment upon try', function () {
      safe.set('0000');
      assert.equal(0, safe.tries);

      safe.try('1234');
      assert.equal(1, safe.tries);
      safe.try('1234');
      assert.equal(2, safe.tries);
      safe.try('1234');
      safe.try('1234');
      assert.equal(4, safe.tries);
    });
  });

  describe('#options.maxTries', function () {
    it('should produce an MaxTriesError on exceeding tries', function () {
      var secureSafe = new SafePuzzle({maxTries: 1});
      secureSafe.set('1234');
      assert.doesNotThrow(function () {
        secureSafe.try('5555');
      });
      assert.throws(function () {
        secureSafe.try('5555');
      }, SafePuzzle.MaxTriesError);
    });
    it('should allow more tries after using #set or #randomize', function () {
      var secureSafe = new SafePuzzle({maxTries: 1});
      secureSafe.set('1234');
      assert.doesNotThrow(function () {
        secureSafe.try('5555');
      });
      assert.throws(function () {
        secureSafe.try('5555');
      }, SafePuzzle.MaxTriesError);

      secureSafe.set('4444');
      assert.doesNotThrow(function () {
        secureSafe.try('5555');
      });
    });
    it('should allow more tries after changing #options.maxTries', function () {
      var secureSafe = new SafePuzzle({maxTries: 1});
      secureSafe.set('1234');
      assert.doesNotThrow(function () {
        secureSafe.try('5555');
      });
      assert.throws(function () {
        secureSafe.try('5555');
      }, SafePuzzle.MaxTriesError);

      secureSafe.options.maxTries = 5;
      assert.doesNotThrow(function () {
        secureSafe.try('5555');
      });
    });
  });

  describe('#push', function () {
    it('should add value to end of previous attempts', function () {
      safe.set('1234');
      safe.try('5555');
      assert.equal('5555', safe.last);
      safe.push('9');
      assert.equal('5559', safe.last);
    });
    it('should accept longer input than 1 char', function () {
      safe.set('1234');
      safe.try('5555');
      assert.equal('5555', safe.last);
      safe.push('98');
      assert.equal('5598', safe.last);
    });
    it('should accept longer input than safe.options.length', function () {
      safe.set('1234');
      safe.try('5555');
      assert.equal('5555', safe.last);
      safe.push('999999');
      assert.equal('9999', safe.last);
    });
    it('should modify safe.last in attempt', function () {
      safe.set('1234');
      safe.try('5555');
      assert.equal('5555', safe.last);
      safe.push('9');
      assert.equal('5559', safe.last);
    });
  });

  describe('#test', function () {
    it('should return false on a bad attempt', function () {
      safe.set('5555');
      assert.equal(false, safe.test('1111'));
    });
    it('should return true on a good attempt', function () {
      safe.set('5555');
      assert.equal(true, safe.test('5555'));
    });
    it('should try using last attempted if no input', function () {
      safe.set('5555');
      safe.last = '5555';
      assert.equal(true, safe.test());
    });
  });

  describe('#try', function () {
    it('should be an alias of test', function () {
      assert.strictEqual(safe.try, safe.test)
    });
  });

  describe('#check', function () {
    it('should be an alias of test', function () {
      assert.strictEqual(safe.check, safe.test)
    });
  });

  describe('#isUnlocked', function () {
    it('should register the locked state of the safe', function () {
      safe.set('1234');
      assert(!safe.isUnlocked());
      safe.try('1234');
      assert(safe.isUnlocked());
    });
  });

  describe('#UnlockedError', function () {
    it('should throw an error if attempting to open after unlocked', function () {
      safe.set('5555');
      assert.equal(true, safe.try('5555'));
      assert.throws(function () {
        safe.try('6666');
      }, SafePuzzle.UnlockedError)
    });
  });
});
