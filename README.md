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
```

# Simple Puzzle

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


# Running Code Puzzle

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


# One Long String Puzzle

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
