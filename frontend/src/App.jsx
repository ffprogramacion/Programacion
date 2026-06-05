import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 style={{ color: 'black' }}>Hola Mundo3</h1>
      <a
        href="https://www.youtube.com/watch?v=5EouEAo9wy0&list=RD5EouEAo9wy0&start_radio=1"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>si amas al momo toca este boton</button>
      </a>
    </>
  )
}

export default App
