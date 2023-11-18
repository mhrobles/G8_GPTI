import { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Space, Button, Input, Select, Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Home() {
  const history = useNavigate();

  const redirectToRecipe = () => {
    history('/recipe');
  };

  const redirectToCountry = () => {
    history('/country');
  };


  return (
    <>
      <div className="container">
        <div className="row-25">
          <h1>Seleccionaste buscar por pais</h1>
          <h3>¿Qué deseas acceder?</h3>
        </div>
        <div className="row-75-home">
            <div className="column-50">
                <Button type="primary" onClick={redirectToRecipe} >Consultar un plato especifico</Button>
            </div>
            <div className="column-50">
                <Button type="primary" onClick={redirectToCountry} >Consultar platos tipicos de un país</Button>
            </div>
        </div>
      </div>
    </>
  )
}

export default Home;
