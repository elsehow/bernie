const test = require('tape')
const redistribute = require('..')
const sum = require('lodash.sum')

// HACK method to see if all values are equal
Array.prototype.allSame = function() {
  for(var i = 1; i < this.length; i++)
    if(this[i] !== this[0])
      return false
  return true
}

function apply (steps, unequal) {
  // apply the steps to redistribute unequal
  steps.map(step => {
    unequal[step.to] += step.amount
    unequal[step.from] -= step.amount
  })
  return unequal
}

test('simple case', t => {

  let unequal = {
    one: 0.9,
    two: 0.3,
    three: 0.7,
  }

  const steps = redistribute(unequal)

  unequal = apply(steps, unequal)
  // now all its values should be equal
  const vs = Object.values(unequal)
  t.ok(vs.allSame())
  t.end()
})

test('non-equal distributions', t => {

  let unequal = {
    one: 0.9,
    two: 0.3,
    three: 0.7,
  }

  const dist = {
    one: 0.99,
    two: 0.01,
    three: 0.01,
  }

  const steps = redistribute(unequal, {
    distribution: dist
  })

  unequal = apply(steps, unequal)
  // now unequal's distribution should match `dist`
  const keys  = Object.keys(unequal)
  const vs    = Object.values(unequal)
  const total = sum(vs)
  keys.map(k => {
    let expectedProportion = unequal[k] / total
    t.ok(
      dist[k] > expectedProportion - 0.01 ||
        dist[k] < expectedProportion + 0.01
    )
  })
  t.end()
})

test('doesnt trade if within error', t => {

  let unequal = {
    one: 0.5001,
    two: 0.5003,
  }

  const steps = redistribute(unequal, {
    error: 0.001
  })

  // apply the steps to redistribute unequal
  unequal = apply(steps, unequal)
  t.deepEqual(unequal, {
    one: 0.5001,
    two: 0.5003,
  })
  t.end()
})

// [{
//   from: 'me',
//   to: 'you',
//   amount:
// }]
