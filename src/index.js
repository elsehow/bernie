const sum = require('lodash.sum')

function redistribute (unequal, opts) {

  if (!opts)
    opts = {}

  if (!opts.error)
    opts.error = 0.01

  const entities =
        Object.keys(unequal)
  const values =
        Object.values(unequal)
  const total =
        sum(values)

  // by default, desired distribution is equal
  if (!opts.distribution) {
    opts.distribution = {}
    const apiece = 1 / entities.length
    entities.map(entity => {
      opts.distribution[entity] = apiece
    })
  }

  // we'll turn the distribution into a map
  // of the value each entity should have
  // after redistribution
  const shouldHave = {}
  entities.map(entity => {
    shouldHave[entity] = opts.distribution[entity]*total
  })


  const canGive = {}
  const shouldTake = {}
  entities.map(k => {
    const thisVal = unequal[k]
    // who can give
    if (thisVal > (shouldHave[k] - opts.error))
      canGive[k] =
      thisVal - shouldHave[k]
    // who should take
    else if (thisVal < (shouldHave[k] - opts.error))
      shouldTake[k] =
        shouldHave[k] - thisVal
  })

  // match takers with givers
  const steps = []
  Object.keys(shouldTake).map(taker => {
    // for each possible giver
    Object.keys(canGive).map(giver => {
      let trade = null
      // we will take whatever this giver can give
      // if they have enough to fill the taker's need
      if (canGive[giver] >= shouldTake[taker]) {
        // we will take everything the taker needs
        trade = shouldTake[taker]
        // if this giver can't give enough
      } else if (canGive[giver] < shouldTake[taker]) {
        // we will take what we can
        trade = canGive[giver]
      }
      // we'll codify this with a giving step
      const step = {
        from: giver,
        to: taker,
        amount: trade
      }
      // adding to our list of steps
      steps.push(step)

      //  update the givers and takers maps
      // to represent the trade
      canGive[giver]    -= trade
      shouldTake[taker] -= trade
    })
  })
  return steps
}

module.exports = redistribute
