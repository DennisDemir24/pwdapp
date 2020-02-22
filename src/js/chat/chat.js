class Chat extends window.HTMLElement {
  constructor () {
    super()
    this.socket = undefined
    this.wrapper = undefined
    this.chatDiv = undefined
    this.messageBox = undefined
    this.container = undefined
    this.username = undefined
    this.usernameInput = undefined
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
    <style>
    #chat {
        width: 400px;
    }
       .messages {
           color: black;
           height: 350px;
        overflow-y: scroll;
       }
       .messageArea {
           margin-top: 2rem;
           height: 100px;
           width: 100%;
       }
       .username {
           font-weight: bold;
       }
    </style>
    <div class="chatContainer"></div>
    <div id="wrapper"></div>
      <div class="container">
       <div id="chat">
        <div class="chat">
            <div class="messages">
                <div class="message">
                    <p class="text"></p>
                    <p class="username"></p>
                </div>
            </div>
            <textarea class="messageArea"></textarea>
            <input class="usernameInput" type="text" placeholder="Enter a Username" />
        </div>
       </div>
      </div>
    `
  }

  connectedCallback () {
    this.wrapper = this.shadowRoot.querySelector('#wrapper')
    const styleSheet = document.createElement('link')
    styleSheet.rel = 'stylesheet'
    styleSheet.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'
    this.wrapper.append(styleSheet)
    this.container = this.shadowRoot.querySelector('.container')
    this.chatDiv = this.shadowRoot.querySelector('#chat')
    this.usernameInput = this.shadowRoot.querySelector('.usernameInput')
    this.messageBox = this.shadowRoot.querySelector('.messageArea')
    this.container.appendChild(this.chatDiv)
    this.keyEnterChat()
    this.updateUsername()
  }

  disconnectedCallback () {
    this.socket.close()
  }

  /**
   * Method that runs when the chat is connected
   *
   * @returns
   * @memberof Chat
   */
  connect () {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.readyState === 1) {
        resolve(this.socket)
      }

      try {
        this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
      } catch (err) {
        reject(err)
      }

      this.socket.addEventListener('open', () => {
        resolve(this.socket)
      })

      this.socket.addEventListener('message', (e) => {
        const message = JSON.parse(e.data)
        if (message.type === 'message') {
          this.printMessage(message)
        }
      })
    })
  }

  /**
   * Method to update username
   *
   * @memberof Chat
   */
  updateUsername () {
    this.usernameInput.addEventListener('keypress', (e) => {
      if (e.keyCode === 13) {
        if (e.target.value === '') {
          e.preventDefault()
          e.target.placeholder = 'You need to enter a name'
          return
        }
        window.localStorage.setItem('username', e.target.value)
        e.target.value = ''
        e.preventDefault()
      }
    })
  }

  /**
   * Method for listening on key press down in message box
   *
   * @memberof Chat
   */
  keyEnterChat () {
    this.messageBox.addEventListener('keypress', (e) => {
      // Listen for Enter key
      if (e.keyCode === 13 && e.target !== this.nickname) {
        if (e.target.value === '') {
          e.preventDefault()
          e.target.placeholder = 'Cant send an empty message'
          return
        }
        // send a message
        this.sendMessage(e.target.value)
        // Empty textarea
        e.target.value = ''
        e.preventDefault()
      }
    })
  }

  /**
   * Method to send the message
   *
   * @param {String} text
   * @memberof Chat
   */
  sendMessage (text) {
    const data = {
      type: 'message',
      data: text,
      username: window.localStorage.getItem('username'),
      channel: 'Only for Gods',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this.connect().then((socket) => {
      socket.send(JSON.stringify(data))
    }).catch(err => {
      console.log(err)
    })
  }

  /**
   * Method that prints the message
   *
   * @param {*} message
   * @memberof Chat
   */
  printMessage (message) {
    const messageDiv = this.shadowRoot.querySelector('.message')
    const clone = messageDiv.cloneNode(true)
    if (this.username !== window.localStorage.getItem('username')) {
      clone.querySelector('.text').textContent = message.data
      clone.querySelector('.username').textContent = message.username
    }

    this.chatDiv.querySelector('.messages').appendChild(clone)
  }
}

window.customElements.define('custom-chat', Chat)
