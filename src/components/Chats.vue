<template>
    <div class="dialog">
        <v-list :avatar="true">
          <v-list-item
          v-for="dialog in this.dialogs"
          :key="dialog.id"
          @click="toChat(dialog.id)"
          >
             <v-list-item-avatar>
              <v-img :src="dialog.photo_200"></v-img>
            </v-list-item-avatar>
            <v-list-item-title v-html="dialog.first_name + ' ' + dialog.last_name"></v-list-item-title>
          </v-list-item>
      </v-list>
    </div>
</template>

<script>
export default {
  props: {
    dialogs: Array,
    chatList: Array
  },

  methods: {
    toChat (friendId) {
      this.$store.dispatch('Fetch_Friend_Info', friendId)
      this.$store.state.friendId = friendId
      for (let i = 0; i < Object.keys(this.chatList).length; i++) {
        if (this.chatList[i].companion === friendId) {
          this.$store.state.chatId = this.chatList[i].chatId
        }
      }
      this.$router.push('/Chat')
    }
  }
}
</script>
