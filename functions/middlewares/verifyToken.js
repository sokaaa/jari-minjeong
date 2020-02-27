const admin = require('firebase-admin')

module.exports = (req, res, next) => {
  // console.log(JSON.stringify(req.headers))
  // console.log('here')
  admin.auth().verifyIdToken(req.headers.authorization) // axios에서 갖다놓은 토큰을 관리자 권한 허용해주기
    .then(function (decodedToken) {
      req.claims = decodedToken
      next()
    // ...
    }).catch(function (e) {
      console.error(e.message)
      res.status(401).send() // axios에서 갖다놓은 토큰이 없을 경우(로그인하지 않고 요청할 경우) 거절하기
    })
  // next()
}
