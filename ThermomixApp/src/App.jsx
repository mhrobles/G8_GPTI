import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [response, setResponse] = useState('')
  const API_KEY = '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'
  
  async function get_res() {
    const res = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        // Aqui va lo que se le manda a chatGPT, con el rol de usuario y el contenido del mensaje
        messages:[
          {"role": "user", "content": "'Lamborgini' es un plato de comida? si o no?"}
        ],
        // max_tokens se refiere al largo de la respuesta proveniente de ChatGPT
        max_tokens: 1,
        // temperature se refiere a que tan consisa y exacta se quiere tener la respuesta
        temperature: 0.2
      })
    })
    const data = await res.json()
    setResponse(data)
    console.log(data)
  }

  get_res()

  // Si cambia el valor de response, se ejecuta un console.log
  useEffect(() => {
    console.log(response)
  }, [response])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
