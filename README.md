# Safe Puzzle

Puzzle to crack a safe.



## Install 

```
$ npm init
$ npm install --save safe-puzzle
```

## Use

```javascript
var SafePuzzle = require('safe-puzzle');

var safe = new SafePuzzle({
  length: 4, // number of digits in combination; Default: 4
  maxTries: 0, // if maxTries > 0 safe will throw an 
               //    error if too many unsuccessfull attempts
               //    Default: 0
});

safe.set('1234'); // Set combination to '1234'

safe.try('2345'); // false
safe.test('3456'); // synonym of safe.try
safe.check('4567'); // synonym of safe.try

safe.isUnlocked(); // false

safe.try('1234'); // true

safe.isUnlocked(); // true

try {
  safe.try('1111'); // while safe.isUnlocked() === true
} catch (err) {
  if (err instanceof SafePuzzle.UnlockedError) {
    // Already unlocked, Stop trying or reset
    //  safe.randomize() or safe.set( newValue )
  }
}

var safeMax = new SafePuzzle({maxTries: 1});
try {
  safe.try('1111'); // acts as normal
  safe.try('1111'); // throws error
} catch (err) {
  if (err instanceof SafePuzzle.MaxTriesError) {
    // Tried too many times
  }
}

safe.tries; // 5
safeMax.trie; // 1

safe.randomize(); // produces new code at random

safe.last; // '1111'
safe.push('2'); // tries '1112' and returns safe.isUnlocked();
safe.push('3'); // tries '1123' and returns safe.isUnlocked();
safe.push('9999'); // tries '9999' and returns safe.isUnlocked();
safe.push('55555'); // tries '5555' (as length option === 4) and returns safe.isUnlocked();

safe.last = '1234';
safe.try(); // compares using safe.last instead of input.
safe.push('12'); // tries '3412' and returns safe.isUnlocked();

```


## Options

```javascript
var safe = new Safe({
  // Options
});
```

- length :: Default: 4 :: length of combination on randomization. If safe.set( newValue ) is used and newValue.length !== options.length an error will be thrown.
- maxTries :: Default: 0 :: If greater than 0, an error will be thrown upon exceeding maximum tries.

## Properties

- `safe.last` -- Defaults to '0000'. Records last attempted value;
- `safe.tries` -- Defaults to 0. Auto-increments upon try;
- `safe.options` -- List of options, post object creation.
 
## Methods

- `safe.isUnlocked()` -- Returns Boolean indicating state of safe lock
- `safe.set( newValue )` -- `newValue`: String of new combination. No return.
- `safe.randomize()` -- Generates and sets a new random combination. No return.
- `safe.try( [value] )` -- Test `value` against combination. If `value` is null, it will test `safe.last` against current combination.
- `safe.test( [value] );` -- alias of `safe.try`
- `safe.check( [value] );` -- alias of `safe.try`
- `safe.push( value );` -- concatenate `value` onto `safe.last` and `safe.try( value )` with the tail `safe,options.length` (default 4) characters against combination.



# Puzzles

## Simple Puzzle

Simply break the code. Nothing special about it, only four(4) digits. Just break the code 
using whatever means you prefer.

```javascript
var SafePuzzle = require('safe-puzzle');

var safe = new SafePuzzle({
  length: 4
});

var unlocked = false;
while (!unlocked) {
  var tryCombo = // Generate the next combination 
  unlocked = safe.try( tryCombo );
}
```


## Running Code Puzzle

The safe has a four(4) digit password. The password is entered in a 
running fashion instead of an enter-reset fashion. ex:

```javascript
var SafePuzzle = require('safe-puzzle');

var safe = new SafePuzzle({
  length: 4
});

var unlocked = false;

unlocked = safe.push('1234'); // tries '1234'
unlocked = safe.push('5');    // tries '2345'
unlocked = safe.push('6');    // tries '3456'
unlocked = safe.push('7');    // tries '4567'
unlocked = safe.push('8');    // tries '5678'
/* etc */
```


## One Long String Puzzle

Produce a single string which contains every possible combination, 
includes no duplicate entries, and shorter is better.

```javascript
var SafePuzzle = require('safe-puzzle');

var safe = new SafePuzzle({
  length: 4
});

var unlocked = false;

var comboString = '1234567890...'; // figure out how to make this string.

safe.last = comboString.slice(0,3);
for (var i = 3, l = comboString.length; i < l; i ++){
  if ( safe.push( comboString[i] ) ) {
    console.log('SUCCESS!!!', comboString.slice(i-3, i+1));
    break;
  }
}
```
