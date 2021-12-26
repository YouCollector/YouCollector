const path = require('path')

const firebase = require('firebase-admin')

const serviceAccount = require('./service-key.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://youcollector.firebaseio.com',
  databaseAuthVariableOverride: {
    uid: 'foo',
  },
})

const db = firebase.firestore()

async function main() {
  const maticRef = db.doc('currencies/matic')

  await maticRef.set({
    price: '0',
    timestamp: Math.random(),
  })

  const maticDocument = await maticRef.get()
  console.log('greengo', maticDocument.data())
}

main()
