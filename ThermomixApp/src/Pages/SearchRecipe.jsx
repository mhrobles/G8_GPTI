import { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, Input } from 'antd';
import '../App.css'
import {useNavigate} from 'react-router-dom';

function SearchRecipe() {
  const [verification, setVerification] = useState('')
  const [response , setResponse] = useState('')
  // crear una variable contador
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  // const [model, setModel] = useState('') // Al elegir un modelo de Thermomix, se usa setModel para cambiar el valor de model
  const [food, setFood] = useState('') // Al ingresar un plato de comida, se usa setFood para cambiar el valor de food
  const [formattedResponse, setFormattedResponse] = useState({ ingredients: [], steps: [] });
  const [thermomix, setThermomix] = useState('');
  const [thermomixOptions] = useState(['TM6', 'TM5', 'TM21', 'TM31']);
  const [isVerifing, setIsVerifing] = useState(false);
  const history = useNavigate();

  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
  
  async function get_res() {
    setIsVerifing(true)
    // Esto es lo que se le manda a ChatGPT
    const request = `'${food}' es un plato de comida o no?`
    
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
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
    } catch (error) {
      console.log('Error al enviar la solicitud', error);
    } finally {
      setIsVerifing(false)
    }
  }

  async function get_food() {
    setLoading(true)

    // Esto es lo que se le manda a ChatGPT
    const request = `Ingredientes y pasos para hacer '${food}' en Thermomix ${thermomix}.`

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

  const HandleThermomixChoice = (value) => {
    setThermomix(value);
  }

  return (
    <>
      <div className="container">
        <div className="row-25">
          <h2>Seleccionaste buscar un plato especifico</h2>
          <h3>¿Qué deseas buscar?</h3>
        </div>
        <div className="row-75">
          <div>
            <p>Selecciona el modelo de Thermomix que tienes:</p>
            <Space>
              {thermomixOptions.map((option, index) => (
                <Button 
                  key={index}
                  type={thermomix === option ? 'primary' : 'default'}
                  onClick={() => HandleThermomixChoice(option)}
                >
                  {option}
                </Button>
              ))}
            </Space>
            <p></p>
          </div>
          <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="Ingresa la receta que deseas buscar" value={food} onChange={(e) => setFood(e.target.value)} />
            <Button type="primary" onClick={get_res} >Enviar</Button>
          </Space.Compact>
          
          {isVerifing && <p>Verificando si es un plato de comida...</p>}
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

export default SearchRecipe;
