<template>
<v-app>
  <v-navigation-drawer app
  v-model="drawer"
  >
  <Contacts :contacts="contacts" :chatList="chatList"/>
  </v-navigation-drawer>

  <v-app-bar
    app
    clipped-left
  >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Pentagram</v-toolbar-title>
  </v-app-bar>
  <v-content>
    <v-container fluid>
      <Chats :dialogs="chatInfo" :chatList="chatList" />
      <router-view></router-view>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
import Contacts from '../components/Contacts.vue'
import Chats from '../components/Chats.vue'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Home',

  data: () => ({
    drawer: false
  }),

  components: {
    Contacts,
    Chats
  },

  computed: {
    ...mapState(['userQs', 'userId', 'contacts', 'chatList', 'chatInfo'])
  },

  methods: {
    ...mapActions(['Fetch_Qs', 'Fetch_Id', 'Fetch_Contacts']),

    newUser (userQs, userId) {
      const tmp = {
        qs: userQs,
        vk_user_id: userId
      }

      this.$socket.emit('newUser', tmp)
    },

    getChats (userQs, userId) {
      const tmp = {
        qs: userQs,
        vk_user_id: userId
      }

      this.$socket.emit('getChats', tmp)
    }
  },

  async mounted () {
    await this.Fetch_Contacts()
    await this.Fetch_Qs()
    await this.Fetch_Id()
    await this.newUser(this.userQs, this.userId)
    await this.getChats(this.userQs, this.userId)
  }
}
</script>
