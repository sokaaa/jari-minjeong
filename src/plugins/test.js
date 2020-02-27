const longFunc = (i) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(i)
    }, Math.random() * 1000)
  })
}

/*
const foo = async () => {
  longFunc(33)
    .then(r => {
      console.log(r)
    })
    .catch(e => {
      console.error(e.message)
    })
}
*/

const foo = async () => {
  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line no-unused-vars
    const r = await longFunc(i)
    // console.log(r)
  }
  return 'done'
}

export default {
  foo
}
