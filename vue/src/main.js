// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//require('./theme/libs.scss')
//import 'bootstrap'
import App from './App'
import router from './router'
import { AwaitTest } from './es6_study/await'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
let awaitTestIns  = AwaitTest.getIns();
awaitTestIns.run();