import Vue, { createApp }  from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import VueKinesis from 'vue-kinesis'
import App from './App.vue'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/main.css'
import './assets/parallax.css'

Vue.config.productionTip = false

Vue.use(MotionPlugin);
Vue.use(VueKinesis)

new Vue({
  render: h => h(App),
}).$mount('#app')
