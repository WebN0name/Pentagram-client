import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import bridge from '@vkontakte/vk-bridge'
bridge.send('VKWebAppInit')

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('https://secret-chat-ts.herokuapp.com/'),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
})
)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
