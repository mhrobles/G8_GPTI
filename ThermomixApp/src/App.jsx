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
          <Input placeholder="Ingresa la receta que deseas buscar" />
          <Button type="primary">Enviar</Button>
        </Space.Compact>

      </div>
      <div className="row">
      </div>
    </div>
    </>
  )
}

export default App
