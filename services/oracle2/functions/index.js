const path = require('path')

const functions = require('firebase-functions')
const firebase = require('firebase-admin')
const Dexters = require('dexters')

const serviceAccount = require('./service-key.json')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.oracle = functions.pubsub.schedule('every 15 minutes').onRun(async () => {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    // databaseURL: 'https://youcollector.firebaseio.com',
    // databaseAuthVariableOverride: {
    //   uid: 'oracle',
    // },
  })

  const db = firebase.firestore()

  const maticRef = db.doc('currencies/matic')

  const dexter = new Dexters(137) // Polygon mainnet
  const sushiswap = dexter.getDex('sushiswap') // SushiSwap dex

  await sushiswap.startListeningToWrappedNativePriceUpdates(/* --- TODO --- */)

  return null
})
