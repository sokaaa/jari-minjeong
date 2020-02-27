import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/firebase'
import './plugins/axios'
import './plugins/vue-toasted'
import './plugins/vue-progressbar'
import './plugins/vue-modal'
// import test from './plugins/test'
import './error'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
