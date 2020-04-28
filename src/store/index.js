import Vue from 'vue'
import Vuex from 'vuex'
import bridge from '@vkontakte/vk-bridge'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userQs: '',
    userId: Number,
    contacts: [],
    chatList: [],
    chatInfo: [],
    friendId: Number,
    friendInfo: [],
    chatId: '',
    attachmentId: '',
    isLoaded: false,
    fileName: '',
    chatState: false,
    messages: [],
    attachmentData: [],
    newMessage: []
  },
  mutations: {
    Set_Id (state, tmp) {
      state.userId = Number(tmp)
    },

    Set_Qs (state, tmp) {
      state.userQs = String(tmp)
    },

    Set_Contacts (state, tmp) {
      state.contacts = tmp
    },

    Set_chatList (state, tmp) {
      state.chatList = tmp
    },

    Set_chatInfo (state, tmp) {
      state.chatInfo = tmp
    },

    Set_Friend_Info (state, tmp) {
      state.friendInfo = tmp
    },

    Set_Chat_Id (state, tmp) {
      state.chatId = tmp
    },

    Set_File (state, tmp) {
      state.fileString = tmp
    },

    Set_Attachment_Id (state, tmp) {
      state.attachmentId = tmp
    },

    Set_File_OnLoad (state, tmp) {
      state.isLoaded = tmp
    },

    Set_Messages (state, tmp) {
      state.messages = tmp
    },

    Set_Attachment_Data (state, tmp) {
      state.attachmentData = tmp
    },

    Set_New_Message (state, tmp) {
      state.newMessage = tmp
    }
  },
  actions: {
    Fetch_Id () {
      var tmp = new URLSearchParams(window.location.search).get('vk_user_id')
      this.commit('Set_Id', tmp)
    },

    Fetch_Qs () {
      var tmp = new URLSearchParams(window.location.search)
      this.commit('Set_Qs', tmp)
    },

    async Fetch_Contacts () {
      try {
        await bridge.send('VKWebAppGetAuthToken', { app_id: 7339757, scope: 'friends' })
          .then(async r => {
            var token = r.access_token
            await bridge
              .send('VKWebAppCallAPIMethod', {
                method: 'friends.get',
                params: {
                  v: '5.103',
                  fields: 'photo_200',
                  access_token: token
                }
              }).then(r => {
                var contacts = r.response.items
                contacts.sort((a, b) => {
                  if (a.first_name > b.first_name) {
                    return 1
                  }
                  if (a.first_name < b.first_name) {
                    return -1
                  }
                  return 0
                })
                contacts = contacts.filter(value => value.first_name !== 'DELETED')
                this.commit('Set_Contacts', contacts)
              })
          })
      } catch (error) {
        console.log(error)
      }
    },

    async SOCKET_getChats ({ commit }, data) {
      if (Object.keys(data.result.chatList).length !== 0) {
        await commit('Set_chatList', data.result.chatList)
        var chatInfo = []
        for (let i = 0; i < Object.keys(data.result.chatList).length; i++) {
          chatInfo.push(data.result.chatList[i].companion)
        }
        chatInfo.reverse()
        chatInfo.toString()
        chatInfo = String(chatInfo)
        try {
          await bridge.send('VKWebAppGetAuthToken', { app_id: 7339757, scope: 'friends' })
            .then(async r => {
              var token = r.access_token
              await bridge
                .send('VKWebAppCallAPIMethod', {
                  method: 'users.get',
                  params: {
                    v: '5.103',
                    user_ids: chatInfo,
                    fields: 'photo_200',
                    access_token: token
                  }
                }).then(async r => {
                  chatInfo = r.response
                  await commit('Set_chatInfo', chatInfo)
                })
            })
        } catch (error) {
          console.log(error)
        }
      }
    },

    async Fetch_Friend_Info ({ commit }, data) {
      try {
        await bridge.send('VKWebAppGetAuthToken', { app_id: 7339757, scope: 'friends' })
          .then(async r => {
            var token = r.access_token
            await bridge
              .send('VKWebAppCallAPIMethod', {
                method: 'users.get',
                params: {
                  v: '5.103',
                  user_ids: data,
                  fields: 'photo_200',
                  access_token: token
                }
              }).then(r => {
                var tmp = r.response[0]
                commit('Set_Friend_Info', tmp)
              })
          })
      } catch (error) {
        console.log(error)
      }
    },

    SOCKET_newUser (data) {
      console.log(data)
    },

    SOCKET_newChat ({ commit }, data) {
      commit('Set_Chat_Id', data.result._id)
    },

    async SOCKET_addAttachment ({ commit }, data) {
      await commit('Set_Attachment_Id', data.result._id)
      const onload = true
      await commit('Set_File_OnLoad', onload)
    },

    SOCKET_getMessages ({ commit }, data) {
      if (Object.keys(data.result.messages).length !== 0) {
        commit('Set_Messages', data.result.messages)
      }
    },

    SOCKET_getAttachment ({ commit }, data) {
      commit('Set_Attachment_Data', data.result)
    },

    SOCKET_newMessage ({ commit }, data) {
      commit('Set_New_Message', data.result)
    
    }
  },
  modules: {
  }
})
