import Vue from 'vue'
import axios from 'axios'
import store from '../store/index'

const firebaseAPI = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://us-central1-jari-min-test.cloudfunctions.net/' : 'http://localhost:5000/jari-min-test/us-central1/',
  timeout: 5000,
  headers: { 'X-Custom-Header': 'foobar' }
})

firebaseAPI.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.authorization = store.state.token // 현재 사용자 토큰을 인증받게끔 갖다놓기
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

Vue.prototype.$axios = firebaseAPI
