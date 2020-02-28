const functions = require('firebase-functions')
const admin = require('firebase-admin')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

admin.initializeApp()
// admin.initializeApp({ credential: admin.credential.cert(require('./key.json')) })

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://jari-min-test.firebaseio.com'
// })

const db = admin.firestore()

// 전부 db의 변화를 파악하는 애들

// 아래는 db에 저장하는 것 (authentication과 별도)
// onRequest: 이 주소로 들어갈 때 그 위치에 있는 index.js 파일 발동, onCreate: 상관 없이 회원가입 될 때 발동
// exports.test = functions.https.onRequest(require('./test'))
exports.admin = functions.https.onRequest(require('./admin'))

// exports.createUser = functions.auth.user().onCreate(async (user) => { // 사용자 레벨 별 권한설정 (백엔드 only)
//   const { uid, email, displayName, emailVerified, photoURL, disabled } = user // emailverified, photoURL 은 삭제하기
//   const claims = { level: 2 } // defualt : level 2
//   if (functions.config().admin.email === user.email) claims.level = 0 // admin : level 0
//   await admin.auth().setCustomUserClaims(uid, claims)

//   const d = {
//     uid, email, displayName, emailVerified, photoURL, disabled, level: claims.level
//   }
//   const r = await db.collection('users').doc(uid).set(d)
//   return r
// })

exports.createClientAccount = functions.database.ref('/users/{uid}')
  .onCreate((change, context) => {
    return admin.auth().createUser({
      uid: context.params.uid,
      email: change.after.val().email,
      password: change.after.val().password,
      displayName: change.after.val().displayName,
      level: change.after.val().level
    })
  })

exports.changeClientAccount = functions.database.ref('/users/{uid}')
  .onUpdate((change, context) => {
    return admin.auth().updateUser(context.params.uid, {
      email: change.after.val().email,
      password: change.after.val().password,
      displayName: change.after.val().displayName,
      level: change.after.val().level
    })
  })

exports.deleteClientAccount = functions.database.ref('/users/{uid}')
  .onDelete((change, context) => {
    return admin.auth().deleteUser(context.params.uid)
  })

// 페이징 위해 전체 ID 수를 센다
// 시간이 너무 오래 걸리는데 개선할 방법 없을까?
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
