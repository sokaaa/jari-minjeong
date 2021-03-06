const app = require('express')()
const cors = require('cors')
const admin = require('firebase-admin')
// require('express-async-errors')

const db = admin.firestore()

app.use(cors({ origin: true }))

app.use(require('../middlewares/verifyToken'))

// entry point 2개 라서 권한조건 위로 올림
app.use((req, res, next) => {
  if (req.claims.level > 0) return res.status(403).send({ message: 'not authorized' })
  next()
})

app.get('/users', async (req, res) => {
  let { offset, limit, order, sort, search } = req.query
  offset = Number(offset)
  limit = Number(limit)
  const r = {
    items: [],
    totalCount: 0
  }
  let s = null
  if (search) { // 검색어 입력된 상황 (order by 하지 않음)
    s = await db.collection('users').where('email', '==', search).get()
    r.totalCount = s.size
  } else { // 검색어 입력안된 상황 (order by 함)
    const t = await db.collection('infos').doc('users').get()
    r.totalCount = t.data().counter
    s = await db.collection('users').orderBy(order, sort).offset(offset).limit(limit).get()
  }

  s.forEach(v => {
    r.items.push(v.data())
  })
  res.send(r)
})

app.get('/search', async (req, res) => {
  const s = await db.collection('users').where('displayName', '>=', req.query.search).limit(3).get()

  const items = []
  s.forEach(v => {
    items.push(v.data().displayName) // 콤보 박스에 뜨는 데이터 속성
  })
  res.send(items)
})

// 개인검색 조금 수정해서 팀 검색 만들기

app.post('/user/:empNo/createclient', async (req, res) => {
  if (!req.params.empNo) return res.status(400).end()

  const uid = req.params.empNo
  const email = req.body.email
  const password = req.params.empNo
  const displayName = req.body.displayName
  const level = req.body.level
  const teamName = req.body.teamName

  const d = {
    uid, email, displayName, password, level, teamName
  }

  await db.collection('users').doc(uid).set(d)

  res.status(200).end()
})

app.patch('/user/:uid/changeclient/level', async (req, res) => {
  if (!req.params.uid) return res.status(400).end()
  // if (!req.body.level === undefined) return res.status(400).end()
  const uid = req.params.uid
  const level = req.body.level

  const claims = { level: level } // defualt : level 2
  await db.collection('users').doc(uid).update(claims)

  res.status(200).end()
})

app.delete('user/:uid/deleteclient', async (req, res) => {
  if (!req.params.uid) return res.status(400).end()
  const uid = req.params.uid

  await db.collection('users').doc(uid).delete() // 강의 듣고 고치자

  res.status(200).end()
})

// auth 안 건드는데 궅이 axios로 할 이유가 있나..?

app.use(require('../middlewares/error'))

module.exports = app
