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
  length: 4, // number of digits in combination
  maxTries: 0, // if maxTries > 0 safe will throw an 
               //    error if too many unsuccessfull attempts
});
```
