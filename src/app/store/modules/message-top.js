import noteService from '@/app/admin/message/service/note-service.js'
import tipService from '@/app/admin/message/service/tip-service.js'
import letterService from '@/app/admin/message/service/letter-service.js'

const state = {
  message: undefined
}

const mutations = {
  change(state, data) {
    state.message = data
  }
}

const actions = {
  findMessages({dispatch, commit}) {
    messageHandler.findAll().then(datas => {
      let messageData = {
        NOTIFY: datas[0],
        ANNOUNCEMENT: datas[1],
        TIP: datas[2],
        LETTER: datas[3],
      }
      // console.log('meassage<----app')
      commit('change', messageData)
    })
  }
}

const messageHandler = {
  //查询应用内通知公告Top5的信息集合（收到的）
  findNotifyOrAnnouncement(type) {
    return noteService.findRecieveTop5({
      type,
      status: 'NOREAD',
    }).then(data => {
      // console.log('findRecieveTop5', type, data)
      let messageList = data.map(item => {
        return item.agreeMessage
      })
      return Promise.resolve(messageList)
    })
  },

  //查询所有提醒
  findAllTip() {
    return tipService.findAll().then(data => {
      // console.log('tipService.findAll', data)
      let messageList = this.top_5(data)
      return Promise.resolve(messageList)
    })
  },

  //查询未读的私信
  findAllLetter() {
    return letterService.findAll({
      status: 'NOREAD',
    }).then(data => {
      // console.log('letterService.findAll', data)
      let messageList = this.top_5(data)
      return Promise.resolve(messageList)
    })
  },

  findAll() {
    let promises = [this.findNotifyOrAnnouncement('NOTIFY'), this.findNotifyOrAnnouncement('ANNOUNCEMENT'), this.findAllTip(), this.findAllLetter()]
    return Promise.all(promises)
  },

  //截取前5条显示
  top_5(items) {
    return items.filter((item, index) => {
      return index < 5
    })
  }
}

export default { namespaced: true, state, mutations, actions}