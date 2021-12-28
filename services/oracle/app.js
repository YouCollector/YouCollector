const path = require('path')

const firebase = require('firebase-admin')
const Dexters = require('dexters')

const serviceAccount = require('./service-key.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  // databaseURL: 'https://youcollector.firebaseio.com',
  // databaseAuthVariableOverride: {
  //   uid: 'oracle',
  // },
})

const db = firebase.firestore()

async function main() {
  const maticRef = db.doc('currencies/matic')
  const youcollectorRef = db.doc('currencies/youcollector')

  // await maticRef.set({
  //   price: '0',
  //   timestamp: Math.random(),
  // })

  // const maticDocument = await maticRef.get()
  // console.log('greengo', maticDocument.data())

  const dexter = new Dexters(137) // Polygon mainnet
  const sushiswap = dexter.getDex('sushiswap') // SushiSwap dex

  await sushiswap.startListeningToWrappedNativePriceUpdates()

  const youcollectorToken = sushiswap.getToken('SUSHI')

  await sushiswap.addWrappedNativePriceListener(youcollectorToken.address, async ({ timestamp, price }) => {
    await maticRef.set({
      timestamp,
      priceUSD: sushiswap.wrappedNativePriceInUsd.toString(),
    })
    await youcollectorRef.set({
      timestamp,
      priceUSD: price.times(sushiswap.wrappedNativePriceInUsd).toString(),
    })
  })
}

main()
