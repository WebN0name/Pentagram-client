<template>
    <div class="contacts">
        <h2 class="contacts-title">Контакты</h2>
        <v-text-field
        label="Поиск"
        :outlined="true"
        :dense="true"
        :clearable="true"
        class="search-contacts"
        v-model="searchContacts"
        ></v-text-field>
        <div class="contact-list">
            <v-list :avatar="true">
                <v-list-item
                v-for="contact in filterContacts"
                :key="contact.id"
                @click="toChat(contact.id)"
                >
                    <v-list-item-avatar>
                        <v-img :src="contact.photo_200"></v-img>
                    </v-list-item-avatar>
                     <v-list-item-title v-html="contact.first_name + ' ' + contact.last_name"></v-list-item-title>
                </v-list-item>
      </v-list>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    contacts: Array,
    chatList: Array
  },

  data: () => ({
    searchContacts: '',
    showPopup: false
  }),

  computed: {
    filterContacts () {
      return this.contacts.filter(contact => {
        if (contact.first_name.indexOf(this.searchContacts) !== -1) {
          return true
        }
        if (contact.last_name.indexOf(this.searchContacts) !== -1) {
          return true
        }
        if ((contact.first_name.toLowerCase()).indexOf(this.searchContacts) !== -1) {
          return true
        }
        if ((contact.last_name.toLowerCase()).indexOf(this.searchContacts) !== -1) {
          return true
        }
      })
    }
  },

  methods: {
    toChat (friendId) {
      this.$store.dispatch('Fetch_Friend_Info', friendId)
      this.$store.state.friendId = friendId
      let checkChat = false
      for (let i = 0; i < Object.keys(this.chatList).length; i++) {
        if (this.chatList[i].companion === friendId) {
          checkChat = true
        }
      }

      if (checkChat === true) {
        for (let i = 0; i < Object.keys(this.chatList).length; i++) {
          if (this.chatList[i].companion === friendId) {
            this.$store.state.chatId = this.chatList[i].chatId
          }
        }
      }
      this.$router.push('/Chat')
    }
  }
}
</script>>

<style scoped>
    .contacts-title{
        text-align: center;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .search-contacts{
        width: 90%;
        margin: 0 auto !important;
    }
</style>
