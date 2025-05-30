import React, { useEffect, useState } from 'react';

const limit = 50;
const maxPokemonGen8 = 898;

const getSpriteUrl = (name) =>
  `https://img.pokemondb.net/sprites/home/normal/${name}.png`;

function App() {
  const [offset, setOffset] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [favoritos, setFavoritos] = useState(() => JSON.parse(localStorage.getItem('favoritos')) || []);
  const [capturados, setCapturados] = useState(() => JSON.parse(localStorage.getItem('capturados')) || []);
  const [busqueda, setBusqueda] = useState('');
  const [pokemonBuscado, setPokemonBuscado] = useState(null);
  const [seccion, setSeccion] = useState('listado');
  const [tipos, setTipos] = useState([]);
  
  // Estado para pokémon filtrados por tipo
  const [pokemonPorTipo, setPokemonPorTipo] = useState([]);
  // Estado para guardar el tipo seleccionado actualmente
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  useEffect(() => {
    if (seccion === 'listado') cargarMasPokemon();
  }, []);

  useEffect(() => {
    if (seccion === 'tipos') {
      fetch('https://pokeapi.co/api/v2/type')
        .then(res => res.json())
        .then(data => {
          setTipos(data.results);
          setPokemonPorTipo([]); // limpiar cualquier pokémon filtrado previo
          setTipoSeleccionado(null);
        })
        .catch(() => alert('Error al cargar los tipos'));
    }
  }, [seccion]);

  const cargarMasPokemon = () => {
    if (offset >= maxPokemonGen8) {
      alert('No hay más Pokémon para cargar.');
      return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemonList((prev) => [...prev, ...data.results]);
        setOffset((prev) => prev + limit);
      });
  };

  const manejarBusqueda = () => {
    if (!busqueda.trim()) {
      alert('Escribe un nombre de Pokémon');
      return;
    }
    fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) throw new Error('No encontrado');
        return res.json();
      })
      .then((data) => {
        setPokemonBuscado(data);
        setSeccion('busqueda');
      })
      .catch(() => alert('Pokémon no encontrado'));
  };

  const agregarFavorito = (name) => {
    if (!favoritos.includes(name)) {
      const nuevos = [...favoritos, name];
      setFavoritos(nuevos);
      localStorage.setItem('favoritos', JSON.stringify(nuevos));
    }
  };

  const quitarFavorito = (name) => {
    const nuevos = favoritos.filter((n) => n !== name);
    setFavoritos(nuevos);
    localStorage.setItem('favoritos', JSON.stringify(nuevos));
  };

  const agregarCapturado = (name) => {
    if (capturados.length >= 6) {
      alert('Solo puedes capturar hasta 6 Pokémon.');
      return;
    }
    if (!capturados.includes(name)) {
      const nuevos = [...capturados, name];
      setCapturados(nuevos);
      localStorage.setItem('capturados', JSON.stringify(nuevos));
    }
  };

  const quitarCapturado = (name) => {
    const nuevos = capturados.filter((n) => n !== name);
    setCapturados(nuevos);
    localStorage.setItem('capturados', JSON.stringify(nuevos));
  };

  const renderCard = (name, mostrarEliminar = false) => (
    <div key={name} className="pokemon-card">
      <h3>{name.toUpperCase()}</h3>
      <img
        src={getSpriteUrl(name)}
        alt={name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://img.pokemondb.net/sprites/home/normal/pokeball.png';
        }}
      />
      <button
        className="btn-fav"
        onClick={() => agregarFavorito(name)}
        disabled={favoritos.includes(name)}
      >
        ❤️ Favorito
      </button>
      <button
        className="btn-capturar"
        onClick={() => agregarCapturado(name)}
        disabled={capturados.includes(name)}
      >
        🧺 Capturar
      </button>
      {mostrarEliminar && (
        <>
          {favoritos.includes(name) && (
            <button
              className="btn-eliminar"
              onClick={() => quitarFavorito(name)}
            >
              Eliminar Favorito
            </button>
          )}
          {capturados.includes(name) && (
            <button
              className="btn-eliminar"
              onClick={() => quitarCapturado(name)}
            >
              Eliminar Capturado
            </button>
          )}
        </>
      )}
    </div>
  );

  // Nueva función para cargar pokémon de un tipo
  const cargarPokemonPorTipo = (tipo) => {
    setTipoSeleccionado(tipo);
    fetch(`https://pokeapi.co/api/v2/type/${tipo}`)
      .then(res => res.json())
      .then(data => {
        // data.pokemon es un array con objetos {pokemon: {name, url}, slot: number}
        const pokes = data.pokemon.map(p => p.pokemon);
        setPokemonPorTipo(pokes);
      })
      .catch(() => alert('Error al cargar Pokémon por tipo'));
  };

  return (
    <>
      <style>{`
        /* (Aquí va el mismo CSS que tienes, sin cambios) */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f7f9fc;
          margin: 0;
          padding: 20px;
          color: #333;
        }

        h1 {
          text-align: center;
          color: #ef5350;
          margin-bottom: 20px;
        }

        input[type="text"] {
          width: 250px;
          padding: 8px 12px;
          font-size: 16px;
          border: 2px solid #ef5350;
          border-radius: 5px;
          margin-right: 8px;
        }

        button {
          cursor: pointer;
          background-color: #ef5350;
          border: none;
          color: white;
          padding: 8px 16px;
          font-weight: 600;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        button:hover:not(:disabled) {
          background-color: #c62828;
        }

        button:disabled {
          background-color: #ef9a9a;
          cursor: default;
        }

        #navBotones {
          margin: 20px 0;
          text-align: center;
        }

        #navBotones button {
          margin: 0 5px;
          padding: 10px 20px;
        }

        #navBotones button.active {
          background-color: #b71c1c;
          font-weight: bold;
          box-shadow: 0 0 10px #b71c1c;
        }

        #contenedorListados {
          max-width: 900px;
          margin: 0 auto;
        }

        #listadoPokemons,
        #favoritosDiv,
        #capturadosDiv,
        #tiposDiv {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }

        .pokemon-card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 12px;
          width: 140px;
          text-align: center;
          user-select: none;
          transition: transform 0.2s ease;
        }

        .pokemon-card:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .pokemon-card h3 {
          margin: 8px 0;
          font-size: 16px;
          color: #ef5350;
        }

        .pokemon-card img {
          width: 96px;
          height: 96px;
          object-fit: contain;
          margin-bottom: 8px;
        }

        .btn-fav, .btn-capturar, .btn-eliminar {
          margin-top: 6px;
          width: 100%;
          font-weight: 600;
          border-radius: 8px;
          padding: 6px 0;
        }

        .btn-fav {
          background-color: #ff4081;
          color: white;
        }

        .btn-fav:disabled {
          background-color: #f8bbd0;
          cursor: default;
        }

        .btn-capturar {
          background-color: #4caf50;
          color: white;
        }

        .btn-capturar:disabled {
          background-color: #a5d6a7;
          cursor: default;
        }

        .btn-eliminar {
          background-color: #9e9e9e;
          color: white;
          margin-top: 4px;
        }

        #tiposDiv button {
          background-color: #ef5350;
          border-radius: 12px;
          padding: 8px 14px;
          margin: 4px;
          color: white;
          font-weight: 700;
          text-transform: capitalize;
          border: none;
          transition: background-color 0.3s ease;
        }

        #tiposDiv button:hover {
          background-color: #b71c1c;
        }

        #volverTipos {
          margin: 10px 0 20px 0;
          background-color: #3949ab;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          border: none;
        }

        #volverTipos:hover {
          background-color: #1a237e;
        }
      `}</style>

      <h1>Pokémon React</h1>

      <div id="navBotones">
        <button
          className={seccion === 'listado' ? 'active' : ''}
          onClick={() => {
            setSeccion('listado');
            setPokemonBuscado(null);
            setPokemonPorTipo([]);
            setTipoSeleccionado(null);
          }}
        >
          Listado
        </button>
        <button
          className={seccion === 'favoritos' ? 'active' : ''}
          onClick={() => setSeccion('favoritos')}
        >
          Favoritos
        </button>
        <button
          className={seccion === 'capturados' ? 'active' : ''}
          onClick={() => setSeccion('capturados')}
        >
          Capturados
        </button>
        <button
          className={seccion === 'tipos' ? 'active' : ''}
          onClick={() => {
            setSeccion('tipos');
            setPokemonBuscado(null);
            setPokemonPorTipo([]);
            setTipoSeleccionado(null);
          }}
        >
          Tipos
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') manejarBusqueda(); }}
        />
        <button onClick={manejarBusqueda}>Buscar</button>
      </div>

      <div id="contenedorListados">
        {seccion === 'listado' && (
          <>
            <div id="listadoPokemons">
              {pokemonList.map((p) => renderCard(p.name))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={cargarMasPokemon}>Cargar más</button>
            </div>
          </>
        )}

        {seccion === 'favoritos' && (
          <div id="favoritosDiv">
            {favoritos.length === 0
              ? 'No tienes favoritos agregados.'
              : favoritos.map((name) => renderCard(name, true))}
          </div>
        )}

        {seccion === 'capturados' && (
          <div id="capturadosDiv">
            {capturados.length === 0
              ? 'No has capturado ningún Pokémon.'
              : capturados.map((name) => renderCard(name, true))}
          </div>
        )}

        {seccion === 'tipos' && (
          <div id="tiposDiv">
            {/* Si no hay tipo seleccionado, mostrar botones de tipos */}
            {!tipoSeleccionado ? (
              tipos.length === 0
                ? <p>Cargando tipos...</p>
                : tipos.map((tipo) => (
                  <button
                    key={tipo.name}
                    onClick={() => cargarPokemonPorTipo(tipo.name)}
                  >
                    {tipo.name}
                  </button>
                ))
            ) : (
              <>
                <button id="volverTipos" onClick={() => {
                  setTipoSeleccionado(null);
                  setPokemonPorTipo([]);
                }}>
                  ← Volver a tipos
                </button>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                  {pokemonPorTipo.length === 0
                    ? <p>Cargando Pokémon del tipo {tipoSeleccionado}...</p>
                    : pokemonPorTipo.map(poke => renderCard(poke.name))}
                </div>
              </>
            )}
          </div>
        )}

        {seccion === 'busqueda' && pokemonBuscado && (
          <div style={{ textAlign: 'center' }}>
            <h2>{pokemonBuscado.name.toUpperCase()}</h2>
            <img
              src={
                pokemonBuscado.sprites.front_default ||
                'https://img.pokemondb.net/sprites/home/normal/pokeball.png'
              }
              alt={pokemonBuscado.name}
            />
            <p>Altura: {pokemonBuscado.height}</p>
            <p>Peso: {pokemonBuscado.weight}</p>
            <p>
              Tipos:{' '}
              {pokemonBuscado.types
                .map((t) => t.type.name)
                .join(', ')}
            </p>
            <button onClick={() => setSeccion('listado')}>Volver al listado</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
