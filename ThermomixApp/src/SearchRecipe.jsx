import { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, Input } from 'antd';
import './App.css'
import {useNavigate} from 'react-router-dom';

const items = [
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" >
        TM6
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a target="_blank" rel="noopener noreferrer">
        TM5
      </a>
    ),
    key: '1',
  },
  { label: (
      <a target="_blank" rel="noopener noreferrer">
        TM21
      </a>
    ),
    key: '2',
  },
  { label: (
      <a target="_blank" rel="noopener noreferrer">
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
    key: '4',
    disabled: true,
  },
];

function SearchRecipe() {
  const [verification, setVerification] = useState('')
  const [response , setResponse] = useState('')
  // crear una variable contador
  const [count, setCount] = useState(0)
  // const [model, setModel] = useState('') // Al elegir un modelo de Thermomix, se usa setModel para cambiar el valor de model
  const [food, setFood] = useState('') // Al ingresar un plato de comida, se usa setFood para cambiar el valor de food
  const [formattedResponse, setFormattedResponse] = useState({ ingredients: [], steps: [] });
  const history = useNavigate();

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
    });
    const data = await res.json();

    // Reviso si es un plato de comida o no
    if (data.choices[0].message.content === 'Sí'){
      // Si es un plato de comida, se ingresa la respuesta a verificación para activar el useEffect
      setVerification(data.choices[0].message.content);
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

  useEffect(() => {
    if (response && count < 1) {
      console.log(response);
      const formattedData = formatResponseText(response);
      setFormattedResponse(formattedData);
      console.log(formattedData.ingredients);
      console.log("Aqui vienen los pasos");
      console.log(formattedData.steps);
      setCount(count + 1);
    }
  }, [response]);

  function formatResponseText(text) {
    const parts = text.split('\n'); // Divide el texto en líneas
    const ingredients = [];
    const steps = [];

    let isIngredientsSection = false;
    let isStepsSection = false;

    parts.forEach((part) => {
      if (part.startsWith('Ingredientes') || part.startsWith('Para hacer')) {
        isIngredientsSection = true;
        isStepsSection = false;
      } else if (part.startsWith('Pasos')) {
        isIngredientsSection = false;
        isStepsSection = true;
      } else if (isIngredientsSection) {
        ingredients.push(part);
      } else if (isStepsSection) {
        steps.push(part);
      }
    });

    return { ingredients, steps };
  }

  const GoBack = () => {
    history('/');
  };

  return (
    <>
      <div className="container">
        <div className="row-25">
          <h2>Seleccionaste buscar un plato especifico</h2>
          <h3>¿Qué deseas buscar?</h3>
        </div>
        <div className="row-75">
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

          {response ? (
            <div>
              <h3>Ingredientes en Thermomix:</h3>
              <ul>
                {formattedResponse.ingredients.map((ingredient, index) => (
                  <p key={index}>{ingredient}</p>
                ))}
              </ul>

              <h3>Pasos para la preparación en Thermomix:</h3>
              <ol>
                {formattedResponse.steps.map((step, index) => (
                  <p key={index}>{step}</p>
                ))}
              </ol>
            </div>
          ) : null}
          
        </div>
        <Button type="primary" onClick={GoBack} >Volver a la pagina principal</Button>
      </div>
    </>
  )
}

export default SearchRecipe;
