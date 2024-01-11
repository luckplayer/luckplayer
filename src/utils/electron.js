/* eslint-disable no-eval */
import { Message } from 'element-ui'

export function fun_init() {
  try {
    var result = window.ipcRenderer.sendSync('getClientInfo')
    window.localStorage.setItem('erp-d', result['erp-d'])
  } catch (e) {
    window.localStorage.setItem('erp-d', 'Browser')
  }
}

export function fun_getFile(args) {
  var result = window.ipcRenderer.sendSync('syncReadFile', args)
  if (result === null) {
    return ''
  } else if (result.code === undefined) {
    var dataString = ''
    for (var i = 0; i < result.length; i++) {
      dataString += String.fromCharCode(result[i])
    }

    return dataString
  } else if (result.code === 'ENOENT') {
    return ''
  } else {
    Message.error('erp_client_config => code:' + result.code + '; errno:' + result.errno)
  }
}

export function fun_getImage(args) {
  var result = window.ipcRenderer.sendSync('syncReadFile', args)
  if (result.code === undefined) {
    var file = new File([result], 'local.jpg', { type: 'image/jpg' })
    return file
  } else if (result.code === 'ENOENT') {
    return ''
  } else {
    Message.error('erp_client_config => code:' + result.code + '; errno:' + result.errno)
  }
}

export function fun_setFile(args, isTip = false) {
  window.ipcRenderer.send('writeFile', args)
  window.ipcRenderer.once('writeFile', (event, data) => { // 监听主线程回调
    if (data === 1 && isTip) {
      Message.success('保存成功')
    } else if (data !== 1) {
      Message.error('erp_client_config => code:' + data.code + '; errno:' + data.errno)
    }
  })
}

export function fun_unlinkFile(args, isTip = false) {
  window.ipcRenderer.send('unlinkFile', args)
  window.ipcRenderer.once('unlinkFile', (event, data) => { // 监听主线程回调
    if (data === 1 && isTip) {
      Message.success('保存成功')
    } else if (data !== 1) {
      Message.error('erp_client_config => code:' + data.code + '; errno:' + data.errno)
    }
  })
}

export function fun_scanDir(args) {
  var result = window.ipcRenderer.sendSync('scanDir', args)
  if (result !== undefined) {
    return result.split('|')
  } else {
    return []
  }
}

export function fun_unlinkDir(args) {
  try {
    window.ipcRenderer.send('unlinkDir', args)
    window.ipcRenderer.once('unlinkDir', (event, data) => {
    })
  } catch (e) {
    console.log(e)
  }
}
