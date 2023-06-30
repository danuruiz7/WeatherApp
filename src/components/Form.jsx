import "./Form.css";
import { useState } from "react";
import Loader from "./Loader";

const Form = () => {
  const [loadind, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [city, setCity] = useState("");
  const [grados, setGrados] = useState(true);
  const [data, setData] = useState({
    country: "",
    name: "",
    temp_C: "",
    temp_F: "",
    icon: "",
    currently: "",
    humidity: "",
    localtime: "",
    localtime_epoch: "",
    uv: "",
  });

  const hanldeChange = (e) => {
    console.log(e.target.value);
    if (e.target.value === "c") {
      setGrados(true);
    } else {
      setGrados(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (city === "") {
      setError(true);
      console.log(city);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=f951e0dc82444956b2c123630232206&q=${city}&aqi=no`
      );
      const data = await response.json();
      // console.log(data);
      setData({
        country: data.location.country,
        name: data.location.name,
        temp_C: data.current.temp_c,
        temp_F: data.current.temp_f,
        icon: data.current.condition.icon,
        currently: data.current.condition.text,
        humidity: data.current.humidity,
        localtime_epoch: data.location.localtime_epoch,
        localtime: data.location.localtime,
        uv: data.current.uv,
      });
    } catch (error) {
      console.log(error);
    }
    setCity("");
    setLoading(false);
    setError(false);
  };

  const hora = new Date(data.localtime_epoch * 1000);
  // console.log(hora);

  const horaActual = data.localtime;
  const lastSixCharacters = horaActual.substring(horaActual.length - 6);

  return (
    <div className="container">
      <h1>Weather App</h1>
      <form onSubmit={onSubmit} action="" className="form">
        <input
          placeholder="Ciudad"
          type="text"
          name="name"
          id="name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {error && (
          <p
            style={{
              backgroundColor: "red",
              padding: "2px 6px",
              borderRadius: "5px",
              fontSize: "12px",
              margin: "5px",
            }}
          >
            Por favor ingresa una ciudad
          </p>
        )}
        <input type="submit" value="Buscar" />
      </form>
      {loadind && <Loader />}
      {data.name && (
        <div className="data">
          <div className="container-icon-titulo">
            <img src={data.icon} alt="icon" />
            <h3>
              {data.name}, {data.country}
            </h3>
          </div>
          <div className="info">
            <h4>Currently:</h4>
            <span>{data.currently}</span>
          </div>
          <div className="info">
            <h4>Temperature:</h4>
            <span>{grados ? data.temp_C : data.temp_F}</span>
            <select name="grado" onChange={hanldeChange}>
              <option value="c">°C</option>
              <option value="f">°F</option>
            </select>
          </div>
          <div className="info">
            <h4>Humidity:</h4>
            <span>{data.humidity}%</span>
          </div>
          <div className="info">
            <h4>UV:</h4>
            <span>{data.uv}</span>
          </div>
          <div className="info">
            <h4>Hours:</h4>
            <span>{lastSixCharacters}</span>
          </div>
          <div className="info">
            <h4>Date:</h4>
            <span>{hora.toDateString()}</span>
          </div>
        </div>
      )}

      <div className="footer">
        Powered by:{" "}
        <a className="link" href="https://weatherapi.com/" title="Weather API">
          WeatherAPI.com
        </a>
      </div>
    </div>
  );
};

export default Form;
