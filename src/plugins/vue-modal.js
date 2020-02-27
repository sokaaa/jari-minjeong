import Vue from 'vue'
import VueModal from 'vue-js-modal'

Vue.use(VueModal, {
  dialog: true,
  dynamic: true,
  dynamicDefaults: {
    foo: 'foo'
  }
})
