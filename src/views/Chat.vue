<template>
<v-app>
  <ChatPopup
  :friendName="friendInfo.first_name"
  :friendLastname="friendInfo.last_name"
  :userQs="this.userQs"
  :userId="this.userId"
  :friendId="friendInfo.id"
  v-if="chatState"/>
  <v-app-bar app>
    <v-icon @click="back()" class="back">fas fa-arrow-left</v-icon>
      <v-avatar>
        <v-img :src="friendInfo.photo_200"></v-img>
      </v-avatar>
      <v-toolbar-title v-html="friendInfo.first_name + ' ' + friendInfo.last_name"></v-toolbar-title>
  </v-app-bar>
  <v-content>
    <v-container>
        <Message
            v-for="message in allMessages" :key="message.id"
            :date="message.date"
            :text="message.text"
            :owner="message.owner"
            :type="message.type"
            :docEncode="message.docEncode"
            :docData="message.docData"
          />
      <router-view></router-view>
    </v-container>
  </v-content>

  <v-footer app>
    <div class="inputs">
        <v-text-field
        label="Введите сообщение"
        :outlined="true"
        :dense="true"
        class="text-input"
        v-model="msg"
        @keydown.enter="sendMessage()"
        ></v-text-field>
        <v-icon></v-icon>
        <v-icon class="senders" @click="addAttch()">fas fa-paperclip</v-icon>
        <v-icon class="senders" @click="sendMessage()">fas fa-paper-plane</v-icon>
        <v-file-input label="File input" :clearable="true" id="att" @change="getFile" style="display: none"></v-file-input>
    </div>
    <div class="show-file-state" v-if="fileState">
      <div class="attchment-loading" v-if="isLoaded === false">
        <p>Файл загружается</p>
      </div>
      <div class="attchment-loaded" v-if="isLoaded === true">
        <p>Файл {{ fileName }} загружен</p>
        <v-icon @click="removeFile()" class="icon-delete">fas fa-times</v-icon>
      </div>
    </div>
  </v-footer>
</v-app>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import ChatPopup from '../components/ChatPopup.vue'
import Message from '../components/Message.vue'
export default {
  data: () => ({
    fileState: false,
    msg: '',
    allMessages: [],
    id: 0
  }),

  components: {
    ChatPopup,
    Message
  },

  watch: {
    messages () {
      this.messagesTreatment(this.messages)
    },

    attachmentData () {
      this.attachmentTreatment(this.attachmentData)
    },

    newMessage () {
      this.newMessageTreatment(this.newMessage)
    },

    allMessages () {
      setTimeout(() => {
        document.documentElement.scrollTop = document.documentElement.scrollHeight
      })
    }
  },

  computed: {
    ...mapState(['friendId',
      'friendInfo',
      'chatList',
      'userQs',
      'userId',
      'attachmentId',
      'isLoaded',
      'fileName',
      'chatId',
      'chatState',
      'messages',
      'attachmentData',
      'newMessage'
    ])
  },

  methods: {
    back () {
      this.$store.state.chatId = ''
      this.userLeftFromChat()
      this.$router.push('/')
    },

    newMessageTreatment (newMessage) {
      const data = {
        id: this.id,
        text: newMessage.text,
        sender: newMessage.sender,
        date: new Date(newMessage.date),
        type: newMessage.type,
        document: null,
        owner: true,
        docEncode: null,
        docData: null
      }

      this.id++

      if (newMessage.type === 'text') {
        if (newMessage.sender !== this.userId) {
          data.owner = false
        }
        this.allMessages.push(data)
      } else {
        data.document = newMessage.documents
        if (newMessage.sender !== this.userId) {
          data.owner = false
        }
        this.allMessages.push(data)
        document.documentElement.scrollTop = document.documentElement.scrollHeight
        this.$socket.emit('getAttachment', {
          qs: this.userQs,
          attachmentId: data.document
        })
      }
    },

    async attachmentTreatment (attachment) {
      await this.getAttachmentData(attachment).then(r => {
        const data = {
          attachmentId: attachment._id,
          attachmentType: attachment.type,
          attachmentData: r
        }
        this.setAttachment(data)
      })
    },

    setAttachment (data) {
      for (let i = 0; i < Object.keys(this.allMessages).length; i++) {
        if (this.allMessages[i].document === data.attachmentId) {
          const tmp = this.allMessages[i]
          tmp.docEncode = data.attachmentType
          tmp.docData = data.attachmentData
          this.$set(this.allMessages, i, tmp)
        }
      }
    },

    getAttachmentData (data) {
      return new Promise((resolve, reject) => {
        const tmp = Buffer.from(data.data, 'base64').toString('ascii')
        resolve(tmp)
      })
    },

    messagesTreatment (messages) {
      for (let i = 0; i < Object.keys(messages).length; i++) {
        const data = {
          id: messages[i]._id,
          text: messages[i].text,
          sender: messages[i].sender,
          date: new Date(messages[i].date),
          type: messages[i].type,
          document: null,
          owner: true,
          docEncode: null,
          docData: null
        }
        if (messages[i].type === 'text') {
          if (messages[i].sender !== this.userId) {
            data.owner = false
          }
          this.allMessages.push(data)
        } else {
          data.document = messages[i].documents
          if (messages[i].sender !== this.userId) {
            data.owner = false
          }
          this.allMessages.push(data)
          this.$socket.emit('getAttachment', {
            qs: this.userQs,
            attachmentId: data.document
          })
        }
      }
    },

    removeFile () {
      const clear = document.getElementsByClassName('v-icon')
      clear[5].click()
      this.fileState = false
      this.$store.state.isLoaded = false
      this.$store.state.attachmentId = ''
    },

    addAttch () {
      const attch = document.getElementById('att')
      attch.click()
    },

    getFile (event) {
      const file = event
      if (this.fileState === false) {
        this.fileState = true
        this.uploadFile(file)
      }
    },

    async uploadFile (file) {
      this.$store.state.fileName = file.name
      let fileString = await this.readFileAsync(file)
      fileString = fileString.split(',')
      const data = {
        qs: this.userQs,
        attachmentData: fileString[1],
        type: fileString[0]
      }
      this.$socket.emit('addAttachment', data)
      this.fileState = true
      console.log(this.stateLoad)
    },

    readFileAsync (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
          resolve(reader.result)
        }

        reader.onerror = reject

        reader.readAsDataURL(file)
      })
    },

    async sendMessage () {
      if ((this.msg !== '') || (this.fileState !== false)) {
        if (this.msg !== '') {
          if (this.fileState === false) {
            await this.sendTextMessage()
          }
          if ((this.fileState === true) && (this.isLoaded === true)) {
            await this.sendTextMessage()
          }
        }

        if (this.fileState !== false) {
          if (this.isLoaded !== false) {
            await this.sendAttchMessage()
          }
        }
      }
    },

    sendAttchMessage () {
      return new Promise((resolve, reject) => {
        const data = {
          qs: this.userQs,
          chatId: this.chatId,
          message: {
            type: 'document',
            text: null,
            sender: this.userId,
            date: new Date(),
            visible: true,
            documents: this.attachmentId
          }
        }
        this.$socket.emit('sendMessage', data)
        this.$store.state.isLoaded = false
        this.removeFile()
      })
    },

    sendTextMessage () {
      return new Promise((resolve, reject) => {
        const data = {
          qs: this.userQs,
          chatId: this.chatId,
          message: {
            type: 'text',
            text: this.msg,
            sender: this.userId,
            date: new Date(),
            visible: true
          }
        }
        this.$socket.emit('sendMessage', data)
        this.msg = ''
        resolve(true)
        let tmp = false
        tmp = reject
      })
    },

    isChatCreated () {
      if (this.chatId === '') {
        this.$store.state.chatState = true
      }
    },

    getMessages (userQs, chatId) {
      const data = {
        qs: userQs,
        chatId: chatId
      }
      this.$socket.emit('getMessages', data)
    },

    userConnectedToChat () {
      const data = {
        qs: this.userQs,
        chatId: this.chatId,
        vk_user_id: this.userId
      }
      this.$socket.emit('userConnectedToChat', data)
    },

    userLeftFromChat () {
      const data = {
        qs: this.userQs,
        chatId: this.chatId,
        vk_user_id: this.userId
      }
      this.$socket.emit('userLeftChat', data)
    }
  },

  async mounted () {
    await this.isChatCreated()
    await this.userConnectedToChat()
    await this.getMessages(this.userQs, this.chatId)
  }
}
</script>

<style scoped>
    .inputs{
        display: flex;
        width: 100%;
        padding: 5px;
    }
    .senders{
        margin-left: 10px;
        margin-right: 10px;
    }
    .text-input{
        margin-right: 10px;
        height: 40px;
    }

    .attchment-loaded{
      display: flex;
      padding: 5px;
    }

    .icon-delete{
      margin-left: 15px;
    }

    .attchment-loaded p{
      margin: 0;
      line-height: 40px;
      padding-left: 10px;
    }

    .attchment-loading{
      padding: 5px;
    }

    .attchment-loading p{
      margin: 0;
      line-height: 40px;
      padding-left: 10px;
    }

    .back{
      margin-right: 20px;
    }
</style>
