import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';

// Always when creating a state for arra or object: fear that it informs the type
// of the variable that will be stored

// interface => representation that a format will have

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  // Stores information in the component
  const [ items, setItems ] = useState<Item[]>([]);
  const [ ufs, setUfs ] = useState<string[]>([]);
  const [ cities, setCities ] = useState<string[]>([]);
  const [ initialsPosition, SetSelecedPosition] = useState<[number, number]>([0, 0]);
  
  const [ selectUf, setSelectedUf ] = useState('0');
  const [ selectedPosition, setInicialPosition ] = useState<[number, number]>([0, 0]);
  const history = useHistory();
  const [ formData, SetFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
   
// get api data for the component
  
  
 const [ selectedCity, setSelectedCity ] = useState('0');
 const [ selectedItems, setSelectedItems ] = useState<number[]>([]) 
 useEffect(() => {
   navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    setInicialPosition([latitude, longitude])
   });
 }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, []);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const UfInitials = response.data.map((uf) => uf.sigla);
        console.log(UfInitials)
        setUfs(UfInitials)
      });
  }, []);

  useEffect(() => {
    if (selectUf === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames)
      });

    // load cities whenever UF changes

    console.log('mudou', selectUf)
  }, [selectUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    SetSelecedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    SetFormData({...formData, [name]: value});
  }

  function handleSelectItems(id: number) {
    const alreadySelected = selectedItems.findIndex( item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectUf;
    const city = selectedCity;
    const [ latitude, longitude ] = selectedPosition;
    const items = selectedItems;
    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    };
    await api.post('points', data);
    alert('Ponto de coleta criado!');
    history.push('/')
    console.log(data);
  }
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>
        <Link to="/">
          <FiArrowLeft />
          Voltar para a home
        </Link>  
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input 
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}

            />
            
          </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input 
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input 
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
            />
            
            </div>
          </div>
          
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-9.124056, -37.736722]} zoom={11} onClick={handleMapClick}>
            <TileLayer 
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[-9.124056, -37.736722]}/>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select 
                name="uf" 
                id="uf"
                value={selectUf}
                onChange={handleSelectUf}>
                
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="uf">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}  
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          
        </fieldset>

        <fieldset>
          <legend>
            <h2>ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>


          <ul className="items-grid">
            { // before a map nno react => must use a mandatory property in
            // first element element called key (which needs a value
            // unique to identify)
            items.map(item => (
            <li 
              key={item.id}
              onClick={() => handleSelectItems(item.id)}
              className={selectedItems.includes(item.id) ? 'selected' : ''}
            >
              <img src={item.image_url} alt={item.title}/>
            <span>{item.title}</span>  
            </li>
            ))}

          </ul>

        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  )
}

export default CreatePoint;