import { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, Input, Menu } from 'antd';
import '../App.css'
import { useNavigate } from 'react-router-dom';

const countries = [
    { label: 'Argentina', key: '0' },
    { label: 'Brasil', key: '1' },
    { label: 'Canada', key: '2' },
    { label: 'Chile', key: '3' },
    { label: 'Dinamarca', key: '4' },
    { label: 'Egipto', key: '5' },
    { label: 'Francia', key: '6' },
    { label: 'Alemania', key: '7' },
    // Puedes añadir más países si lo deseas
  ];

const platosfav = {
  "Argentina": [
    "Asado",
    "Empanadas",
    "Mate"
  ],
  "Brasil": [
    "Feijoada",
    "Pão de queijo",
    "Brigadeiro"
  ],
  "Canada": [
    "Poutine",
    "BeaverTails",
    "Maple syrup"
  ],
  "Chile": [
    "Empanadas de pino",
    "Pastel de choclo",
    "Asado"
  ],
  "Dinamarca": [
    "Smørrebrød",
    "Frikadeller",
    "Rødgrød med fløde"
  ],
  "Egipto": [
    "Koshari",
    "Ful medames",
    "Mahshi"
  ],
  "Francia": [
    "Croissant",
    "Ratatouille",
    "Foie gras"
  ],
  "Alemania": [
    "Bratwurst",
    "Sauerkraut",
    "Schnitzel"
  ]
}

const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;

function SearchNewCountry() {
  const [verification, setVerification] = useState('')
  const [response , setResponse] = useState('')
  // crear una variable contador
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  // const [model, setModel] = useState('') // Al elegir un modelo de Thermomix, se usa setModel para cambiar el valor de model
  const [food, setFood] = useState('') // Al ingresar un plato de comida, se usa setFood para cambiar el valor de food
  const [formattedResponse, setFormattedResponse] = useState({ ingredients: [], steps: [] });
  const [country, setCountry] = useState('');
  const history = useNavigate();
  
  async function get_food() {
    setLoading(true)
    console.log("pidiendo a la api");

    // Esto es lo que se le manda a ChatGPT
    const request = `Ingredientes y pasos para hacer '${food}' en Thermomix TM6.`

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
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
    } catch (error) {
      console.log('Error al enviar la solicitud', error);
    } finally {
      setLoading(false)
    }
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

  const HandleCountry = (value) => {
    setCountry(value);
    console.log(value)
  };

  const HandlePlato = (value) => {
    setFood(value);
  };

  return (
    <>
      <div className="container">
        <div className="row-25">
          <h2>Seleccionaste buscar un plato específico</h2>
          <h3>¿Qué deseas buscar?</h3>
        </div>
        <div className="row-75">
          <div>
          <Dropdown
              overlay={
                <Menu>
                  {countries.map((item) => (
                    <Menu.Item key={item.key} onClick={() => HandleCountry(item.label)}>
                      {item.label}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <Space>
                  {country ? country : 'Elige un país'}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
            <p></p>
          </div>

          
          {country && (
            <div>
              <Dropdown
                overlay={
                  <Menu>
                    {platosfav[country].map((item) => (
                      <Menu.Item key={item} onClick={() => HandlePlato(item)}>
                        {item}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                  <Space>
                    {food ? food : 'Elige un plato'}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
              <p></p>
              <Button type="primary" onClick={get_food} >Enviar</Button>
            </div>
          )}

          {loading && <p>Cargando respuesta...</p>}

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

export default SearchNewCountry;
