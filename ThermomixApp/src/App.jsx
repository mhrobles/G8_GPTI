import { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, Input, Select, Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const items = [
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        TM6
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        TM5
      </a>
    ),
    key: '1',
  },
  { label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        TM21
      </a>
    ),
    key: '2',
  },
  { label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        TM31
      </a>
    ),
    key: '3',
  },
  {
    type: 'divider',
  },
  {
    label: 'Alguna otra opcion',
    key: '3',
    disabled: true,
  },
];

function App() {
  const [verification, setVerification] = useState('')
  const [response , setResponse] = useState('')
  // crear una variable contador
  const [count, setCount] = useState(0)
  // const [model, setModel] = useState('') // Al elegir un modelo de Thermomix, se usa setModel para cambiar el valor de model
  const [food, setFood] = useState('') // Al ingresar un plato de comida, se usa setFood para cambiar el valor de food

  const API_KEY = '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'
  
  async function get_res() {

    // Esto es lo que se le manda a ChatGPT
    const request = `'${food}' es un plato de comida o no?`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        // Aqui va lo que se le manda a chatGPT, con el rol de usuario y el contenido del mensaje
        messages: [{role: "user", content: request}],
        // max_tokens se refiere al largo de la respuesta proveniente de ChatGPT
        max_tokens: 2,
        // temperature se refiere a que tan consisa y exacta se quiere tener la respuesta
        temperature: 0.2
      })
    })
    const data = await res.json()

    // Reviso si es un plato de comida o no
    if (data.choices[0].message.content === 'Sí'){
      // Si es un plato de comida, se ingresa la respuesta a verificación para activar el useEffect
      setVerification(data.choices[0].message.content)
    } else {
      console.log('No es un plato de comida')
    }
  }

  async function get_food() {

    // Esto es lo que se le manda a ChatGPT
    const request = `Dame los ingredientes para hacer '${food}' en una Thermomix de modelo 'TM6' y tambien los pasos para su preparación, limitate a una preparación simple, no uses ingredientes innecesarios`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{role: "user", content: request}],
        // max_tokens: 150, // No limito la respuesta de las instrucciones de preparación porque podría cortarse abruptamente
        temperature: 0.2
      })
    })
    const data = await res.json()
    setResponse(data.choices[0].message.content)
  }

  // Si cambia el valor de Verification, se ejecuta un console.log y se llama a get_food()
  useEffect(() => {
    if (verification) {
      get_food()
    }
  }, [verification])

  // Si cambia el valor de response, se ejecuta un console.log
  useEffect(() => {
    if (response && count < 1) {
      // Esto es la respuesta de la API con los ingredientes y pasos a seguir
      console.log(response)
      // Contador para asegurarse de que no se realice la request mas de una vez
      setCount(count + 1)
    }
  }, [response])

  return (
    <>
    <div className="container">
      <div className="row">
        <h1> Bienvenido a Thermomix!</h1>
        <h3>¿Que deseas buscar?</h3>  
      </div>
      
      <div className="row">
        <div>
        <Dropdown
          menu={{
            items,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Elige la Thermomix
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <p></p>
        </div>
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder="Ingresa la receta que deseas buscar" value={food} onChange={(e) => setFood(e.target.value)} />
          <Button type="primary" onClick={get_res} >Enviar</Button>
        </Space.Compact>

      </div>
      <div className="row">
      </div>
    </div>
    </>
  )
}

export default App
