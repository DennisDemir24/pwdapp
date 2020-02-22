class Memory extends window.HTMLElement {
  constructor () {
    super()
    this.tiles = []
    this.turn1 = null
    this.turn2 = null
    this.lastTile = undefined
    this.pairs = 0
    this.tries = 0
    this.rows = 4
    this.cols = 4
    this.noOfTurns = 0
    this.memoryContainer = undefined
    this.playBtn = undefined
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
    <style>
        #memoryContainer img {
          width: 100px
        }
      
      #memoryContainer .removed {
          visibility: hidden;
      }
    </style>
    
    <div id="wrapper"></div>
    <div id ="memoryContainer">
      <template id="memoryTemplate">
        <a href="#"><img src ="./image/0.png" alt="Memory tile"/></a>
      </template>
    </div>
    `
  }

  connectedCallback () {
    this.playMemory(4, 4)
    this.tileClicker()
    // For loading the icons being used as the tile faces
    this.wrapper = this.shadowRoot.querySelector('#wrapper')
    const styleSheet = document.createElement('link')
    styleSheet.rel = 'stylesheet'
    styleSheet.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css'
    this.wrapper.append(styleSheet)
  }

  /**
   * Method to play the memory game
   *
   * @memberof Memory
   */
  playMemory (rows, cols) {
    this.tiles = this.getPictureArray(this.rows, this.cols)

    const container = this.shadowRoot.querySelector('#memoryContainer')

    // Looping through everything, creating one tile per loop and assigning its class
    for (let i = 0; i < (rows * cols); i++) {
      const a = document.createElement('a')
      a.setAttribute('href', '#')

      const tile = document.createElement('img')
      tile.setAttribute('src', '/image/0.png')
      tile.setAttribute('alt', 'tile')
      tile.setAttribute('class', this.tiles[i])

      a.appendChild(tile)
      container.appendChild(a)

      // If two or four tiles in a row, create a
      if ((i + 1) % cols === 0) {
        container.appendChild(document.createElement('br'))
      }
    }
  }

  tileClicker () {
    const container = this.shadowRoot.querySelector('#memoryContainer')
    container.addEventListener('click', (e) => {
      const img = e.target.nodeName === 'IMG' ? e.target : e.target.firstElementChild
      if (img.nodeName !== 'IMG') return
      this.index = img.getAttribute('class')
      this.turnBrick(this.tiles[this.index], this.index, img)
    })
  }

  turnBrick (tile, index, img) {
    if (this.turn2) {
      return
    }
    img.src = '/image/' + tile + '.png'

    if (!this.turn1) {
      // first  brick is clicked
      this.turn1 = img
      this.lastTile = tile
    } else {
      // second brick is clicked
      if (img === this.turn1) { return }
      this.noOfTurns += 1
      this.turn2 = img
      if (tile === this.lastTile) {
        // runs when pair is found
        this.pairs += 1
        if (this.pairs === (this.cols * this.rows) / 2) {
          const h3 = document.createElement('h3')
          h3.textContent = 'You finished the game with ' + this.noOfTurns + ' number of tries'
          h3.style.color = 'green'
          const container = this.shadowRoot.querySelector('#memoryContainer')
          container.appendChild(h3)
        }
        setTimeout(() => {
          this.turn1.parentNode.classList.add('removed')
          this.turn2.parentNode.classList.add('removed')
          this.turn1 = null
          this.turn2 = null
        }, 500)
      } else {
        setTimeout(() => {
          this.turn1.src = 'image/0.png'
          this.turn2.src = 'image/0.png'
          this.turn1 = null
          this.turn2 = null
        }, 300)
      }
    }
  }

  /**
   * Method to shuffle the pictures
   *
   * @param {rows} rows
   * @param {cols} cols
   * @returns
   * @memberof Memory
   */
  getPictureArray (rows, cols) {
    let i
    const arr = []

    for (i = 1; i <= (rows * cols) / 2; i += 1) {
      arr.push(i)
      arr.push(i)
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
    return arr
  }
}
window.customElements.define('memory-game', Memory)
