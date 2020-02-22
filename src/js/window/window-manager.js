let zIndex = 0
class WindowManager extends window.HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `

        <style>
        .windowWrapper {
            position: absolute;
            z-index: 9;
            background-color: #f1f1f1;
            border: 2rem solid #d3d3d3;
          }
          
          .windowContainer {
            padding: 10px;
            cursor: move;
            z-index: 10;
            color: #fff;

          }

          .closeBtn {
            position: absolute;
            top: -27px;
            left: -7px;
            font-size: 15px;
            background-color: crimson;
            border-radius: 11px;
          }
        </style>

        <div class="windowWrapper">
            <div class="windowContainer">
            <div class="windowTopBar">
            <button class="closeBtn">X</button>
            </div>
                <slot></slot>
            </div>
        </div>
    `
    this.x = 0
    this.y = 0
    this.mousedown = false
    this.closeBtn = undefined
    this.windowContainer = undefined
  }

  connectedCallback () {
    this.moveDrag()
    this.closeBtn = this.shadowRoot.querySelector('.closeBtn').addEventListener('click', () => {
      const element = document.querySelector('window-manager')
      element.parentNode.removeChild(this)
    })
    this.windowContainer = this.shadowRoot.querySelector('.windowWrapper')
    this.zIndex()
  }

  zIndex () {
    this.windowContainer.addEventListener('pointerdown', (e) => {
      this.windowContainer.focus()
      this.windowContainer.style.zIndex = zIndex++
    })
  }

  openApp () {
    document.querySelector('#weatherApp').addEventListener('click', (e) => {
      const window = document.createElement('window-manager')
      document.body.appendChild(window)

      const weatherApplication = document.createElement('weather-app')
      window.appendChild(weatherApplication)
    })
    document.querySelector('#memoryGame').addEventListener('click', (e) => {
      const window = document.createElement('window-manager')
      document.body.appendChild(window)

      const weatherApplication = document.createElement('memory-game')
      window.appendChild(weatherApplication)
    })
    document.querySelector('#chatApp').addEventListener('click', (e) => {
      const window = document.createElement('window-manager')
      document.body.appendChild(window)

      const chatApp = document.createElement('custom-chat')
      window.appendChild(chatApp)
    })
  }

  moveDrag () {
    const draggable = this.shadowRoot.querySelector('.windowWrapper')
    const windowContainer = this.shadowRoot.querySelector('.windowContainer')

    windowContainer.addEventListener('mousedown', e => {
      this.mousedown = true
      this.x = draggable.offsetLeft - e.clientX
      this.y = draggable.offsetTop - e.clientY
    }, true)

    windowContainer.addEventListener('mouseup', e => {
      this.mousedown = false
    }, true)

    window.addEventListener('mousemove', e => {
      if (this.mousedown) {
        draggable.style.left = e.clientX + this.x + 'px'

        draggable.style.top = e.clientY + this.y + 'px'
      }
    }, true)
  }
}

window.customElements.define('window-manager', WindowManager)

export { WindowManager }
