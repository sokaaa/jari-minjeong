import Vue from 'vue'

Vue.config.errorHandler = e => {
  Vue.prototype.$toasted.global.error(e.message)
}
