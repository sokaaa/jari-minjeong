const functions = require('firebase-functions')
const admin = require('firebase-admin')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// admin.initializeApp()
admin.initializeApp({ credential: admin.credential.cert(require('./key.json')) })

const db = admin.firestore()

// console.log(functions.config().admin.email)
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!')
})

// onRequest: 이 주소로 들어갈 때 그 위치에 있는 index.js 파일 발동, onCreate: 상관 없이 회원가입 될 때 발동
exports.test = functions.https.onRequest(require('./test'))
exports.admin = functions.https.onRequest(require('./admin'))
exports.createUser = functions.auth.user().onCreate(async (user) => { // 사용자 레벨 별 권한설정 (백엔드 only)
  const { uid, email, displayName, emailVerified, photoURL, disabled } = user // emailverified, photoURL 은 삭제하기
  const claims = { level: 2 } // defualt : level 2
  if (functions.config().admin.email === user.email) claims.level = 0 // admin : level 0
  await admin.auth().setCustomUserClaims(uid, claims)

  const d = {
    uid, email, displayName, emailVerified, photoURL, disabled, level: claims.level
  }
  const r = await db.collection('users').doc(uid).set(d)
  return r
})

exports.deleteUser = functions.auth.user().onDelete((user) => {
  return db.collection('users').doc(user.uid).delete()
})

// 페이징 위해 전체 ID 수를 샌다
exports.incrementUserCount = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    return db.collection('infos').doc('users').update(
      'counter', admin.firestore.FieldValue.increment(1)
    )
  })

exports.decrementUserCount = functions.firestore
  .document('users/{userID}')
  .onDelete((snap, context) => {
    return db.collection('infos').doc('users').update(
      'counter', admin.firestore.FieldValue.increment(-1)
    )
  })
db.collection('infos').doc('users').get()
  .then(s => {
    if (!s.exists) db.collection('infos').doc('users').set({ counter: 0 })
  })
