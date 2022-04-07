import ReactDOM from 'react-dom'
import HumanMusic from './human-music/human-music'
import './styles/index.css'

ReactDOM.render(
  <HumanMusic />,
  document.getElementById('root')
)

declare global {
  interface Array<T> {
    rotate(): Array<T>
    shuffle(): Array<T>
  }
}

export default global

Array.prototype.rotate = function <T>(this: T[]) {
  return this.slice(1, this.length).concat(this.slice(0, 1))
}

Array.prototype.shuffle = function <T>(this: T[]) {
  let currentIndex = this.length, randomIndex
  let array = [...this]
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}