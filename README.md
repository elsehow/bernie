# bernie

redistribute values - equally, by default

(optionally, set a custom distribution, or set a level of acceptable error)

## example

```javascript
let redistribute = require('bernie')

// given some distribution of values
let unequal = {
  one: 0.9,
  two: 0.3,
  three: 0.7,
}
// produce steps that would 
// redistribute those values 
// equally among entities
redistribute(unequal)
// [ { from: 'one', to: 'two', amount: 0.2666666666666667 },
//   { from: 'three', to: 'two', amount: 0.0666666666666666 } ]
```

optionally, we can produce steps to achieve some arbitrary distribution of values.

```javascript
// some values
var unequal = {
  one: 0.9,
  two: 0.3,
  three: 0.7,
}
// some optimal distribution 
// of those values
var dist = {
  one: 0.99,
  two: 0.01,
  three: 0.01,
}

var steps = redistribute(unequal, { distribution: dist })

steps
// [ { from: 'two', to: 'one', amount: 0.28099999999999997 },
//   { from: 'three', to: 'one', amount: 0.6809999999999999 } ]
```

in both of these examples, we can apply these steps to `unequal` to produce the resulting values.

```javascript
steps.map(step => {
  unequal[step.to] += step.amount
  unequal[step.from] -= step.amount
})

unequal
// { one: 1.862,
//   two: 0.019000000000000017,
//   three: 0.019000000000000017 }
```

## install

```
npm i bernie
```

## api

### redistribute(unequalDistribution, opts)

returns `steps` needed to redistribute `unequalDistribution`.

`opts.distribution` is an object where the keys are the same as keys in unequalDistribution, and the values are proportions, representing the ideal distribution of values after `steps` are applied. 
by default, all values will be distributed equally.

`opts.error` is an amount of acceptable error, in the unit of values represented in `unequalDistribution`.

## license

BSD
