
const fs = require('fs')
const { getRandomBetween } = require('../weave.js/src/utility/biginteger')
const permute = require('@lancejpollard/configured-quadratic-residue-prng.js')

const CONFIG_PATH = `${__dirname}/mark.json`
const inputAction = process.argv[2]
const inputType = process.argv[3]
const inputText = process.argv[4]

// each user/face gets 256 orgs to play with
const config = load(CONFIG_PATH)

if (inputAction === 'generate') {
  generate({
    type: inputType,
    text: inputText,
  })

  save()
}

module.exports = {
  generate,
  save,
  load
}

function generate({
  type,
  text
}) {
  if (type === 'host') {
    generateHost(text)
  } else if (type === 'deck') {
    generateDeck(text)
  } else {
    generateBase()
  }
}

function generateBase() {
  if (config.host) {
    return
  }

  config.host ??= {}
  config.host.salt = createSalt()
  config.host.mark = { head: 256n, list: [ { base: 0n, size: 256n } ] }
  config.host.list = {}
}

function generateHost(name) {
  if (config.host.list[name]) {
    return
  }

  const host = config.host.list[name] = {}
  host.mark = createMark(config.host.salt, config.host.mark)
  host.deck = {}
  host.deck.salt = String(createSalt())
  host.deck.mark = { head: 256n, list: [ { base: 0n, size: 256n } ] }
  host.deck.list = {}
}

function generateDeck(road) {
  const [hostName, deckName] = road.split('/')

  if (!config.host.list[hostName]) {
    generateHost(hostName)
  }

  const host = config.host.list[hostName]

  if (host.deck.list[deckName]) {
    return
  }

  const deck = host.deck.list[deckName] = {}
  deck.mark = createMark(host.deck.salt, host.deck.mark)
}

function createSalt() {
  return getRandomBetween(BigInt(2 ** 56), BigInt(2 ** 64) - 1n)
}

function createMark(salt, base) {
  const bond = base.list[0]
  const mark = permute(bond.base, salt, 32)
  bond.base++
  bond.size--
  if (bond.size === 0n) {
    bond.base = base.head
    bond.size = 256n
    base.head += bond.size
  }
  return mark
}

function load(path) {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
  deserialize(config)
  return config
}

function save() {
  serialize(config)
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
}

function serialize(obj) {
  Object.keys(obj).forEach(key => {
    const val = obj[key]
    if (typeof val === 'bigint') {
      obj[key] = String(val)
    } else if (val != null && typeof val === 'object') {
      serialize(val)
    }
  })
}

function deserialize(obj) {
  Object.keys(obj).forEach(key => {
    const val = obj[key]
    if (typeof val === 'string' && val.match(/^[0-9]+$/)) {
      obj[key] = BigInt(val)
    } else if (val != null && typeof val === 'object') {
      deserialize(val)
    }
  })
}
