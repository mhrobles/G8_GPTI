import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, Menu } from 'antd';
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

const platos = [
    { label: 'Asado', key: '0' },
    { label: 'Cazuela', key: '2' },
    { label: "Fideos con salsa", key: '3'}
]
  
function SearchCountry() {
  const [country, setCountry] = useState('');
  const [plato, setPlato] = useState('');
  const [tipicos, setTipicos] = useState('');
  const [instructions, setInstructions] = useState('');
  const history = useNavigate();

  const GoBack = () => {
    history('/');
  };

  const HandleCountry = (value) => {
    setCountry(value);
    console.log(value)
  };

  // useEffect que se activa cuando cambia el valor de country
  useEffect(() => {
    if (country !== '') {
      console.log(country);
      searchPlatos();
    }
  }, [country]);

  async function searchPlatos() {

    // Esto es lo que se le manda a ChatGPT
    const request = `Dame 3 platos tipicos del país '${country}' en formato JSON`

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
    setTipicos(data.choices[0].message.content)
    console.log(f`Lo que se guarda en tipicos es: ${data.choices[0].message.content}`)
  }

  const HandlePlato = (value) => {
    setPlato(value);
  };

  // useEffect que se activa cuando cambia el valor de plato
  useEffect(() => {
    if (plato !== '') {
      console.log(plato);
      get_food();
    }
  }, [plato]);

  async function get_food() {

    // Esto es lo que se le manda a ChatGPT
    const request = `Dame los ingredientes para hacer '${plato}' en una Thermomix de modelo 'TM6' y tambien los pasos para su preparación, sé lo mas conciso posible`

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
    setInstructions(data.choices[0].message.content)
    console.log(f`Lo que se guarda en instructions es: ${data.choices[0].message.content}`)
  }

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
                    {platos.map((item) => (
                      <Menu.Item key={item.key} onClick={() => HandlePlato(item.label)}>
                        {item.label}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                  <Space>
                    {plato ? plato : 'Elige un plato'}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
              <p></p>
            </div>
          )}
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
        <Button type="primary" onClick={GoBack}>
          Volver a la página principal
        </Button>
      </div>
    </>
  );
}

export default SearchCountry;
