<template>
    <div class="new-chat-popup">
        <div class="popup-window">
            <div class="popup-window-content">
                <p>Создать чат с пользователем:</p>
                <strong><p>{{ friendName }} {{ friendLastname }}</p></strong>
                <div class="btn-group">
                    <v-btn depressed @click="cancellation()" color="error">Отмена</v-btn>
                    <v-btn depressed @click="createChat(userQs, userId, friendId)" color="primary">Начать</v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    friendName: String,
    friendLastname: String,
    userQs: String,
    userId: Number,
    friendId: Number
  },

  methods: {
    createChat (userQs, userId, friendId) {
      const data = {
        qs: userQs,
        vk_user_id1: userId,
        vk_user_id2: friendId
      }
      this.$socket.emit('createChat', data)
      this.$store.state.chatState = false
    },

    cancellation () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
    .new-chat-popup{
        width: 100vw;
        height: 100vh;
        position: relative;
        z-index: 999;
        background-color: rgba(0, 0, 0, 0,8);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .popup-window{
        max-width: 347px;
        width: 100%;
        height: 209px;
        background-color: #272727;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .popup-window-content p{
        text-align: center;
    }

    .btn-group{
        max-width: 250px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 45px;
    }
</style>
