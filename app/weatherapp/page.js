"use client";

import { useState } from "react";
import { fetchWeatherData, fetchForecastData } from "../../lib/weather"; // Funções separadas para previsões
import styles from './weather.module.css';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import {
    Chart as chartjs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

chartjs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function WeatherPage() {
    const [city, setCity] = useState(""); // Campo de cidade vazio ao carregar a página
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null); // Previsão para os próximos dias
    const [error, setError] = useState(null);

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const fetchWeather = async () => {
        const apikey = '9cb6164fb68cb71cfbb0902223d93e7f';
        const data = await fetchWeatherData(city, apikey); // Busca dados do clima atual
        const forecast = await fetchForecastData(city, apikey); // Busca previsão para os próximos dias

        if (!data || !forecast) {
            setError("Erro ao carregar os dados do clima.");
            setWeatherData(null);
            setForecastData(null);
        } else {
            setWeatherData(data);
            setForecastData(forecast);
            setError(null);
        }
    };

    const getWeatherIcon = (description) => {
        if (description.includes("clear")) return "/icons8-sol-80.png";
        if (description.includes("rain")) return "/icons8-chuva-50.png";
        if (description.includes("cloud")) return "/icons8-nublado-80.png";
        if (description.includes("snow")) return "/icons8-neve-80.png";
        if (description.includes("thunderstorm")) return "/icons8-com-relâmpago-echuva-48.png";
        return "/icons/default.svg"; 
    };

    const getBackgroundClass = (description) => {
        if (description.includes("clear")) return styles.clear;
        if (description.includes("rain")) return styles.rain;
        if (description.includes("cloud")) return styles.cloudy;
        if (description.includes("snow")) return styles.snow;
        if (description.includes("thunderstorm")) return styles.thunderstorm;
        return styles.defaultGradient;
    };

    const getMapLink = (city) => {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city)}`;
    };

    const getTemperatureClass = (description) => {
        if (description.includes("clear")) return styles.clearText;
        if (description.includes("rain")) return styles.rainText;
        if (description.includes("cloud")) return styles.cloudyText;
        if (description.includes("snow")) return styles.snowText;
        if (description.includes("thunderstorm")) return styles.thunderstormText;
        return ""; 
    };

    const getDescriptionClass = (description) => {
        return getTemperatureClass(description);
    };

    const getWindSpeedClass = (description) => {
        return getTemperatureClass(description);
    };

    // Gerar dados para o gráfico de previsão
    const getForecastChartData = () => {
        if (!forecastData) return null;

        const labels = forecastData.list.map((item) => new Date(item.dt * 1000).toLocaleDateString());
        const temperatures = forecastData.list.map((item) => item.main.temp);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Temperatura (°C)',
                    data: temperatures,
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.1,
                },
            ],
        };
    };

    return (
        <div>
            <Header />
            <div className={`${styles.weatherContainer} ${!weatherData ? styles.defaultGradient : getBackgroundClass(weatherData.weather[0].description)}`}>
                <h1 className={styles.title}>Previsão do tempo</h1>
                <input 
                    type="text" 
                    value={city} 
                    onChange={handleCityChange} 
                    className={styles.cityInput} 
                    placeholder="Digite o nome da cidade"
                />
                <button onClick={fetchWeather} className={styles.fetchButton}>Buscar</button>

                {error && <p className={styles.error}>{error}</p>}
                {weatherData && (
                    <>
                        <h2 className={styles.cityName}>Previsão do tempo para {weatherData.name}</h2>
                        <img 
                            src={getWeatherIcon(weatherData.weather[0].description)} 
                            alt="Ícone do clima" 
                            className={styles.weatherIcon}
                        />
                        <p className={`${styles.temperature} ${getTemperatureClass(weatherData.weather[0].description)}`}>
                            Temperatura: {weatherData.main.temp}°C
                        </p>
                        <p className={`${styles.description} ${getDescriptionClass(weatherData.weather[0].description)}`}>
                            Condição: {weatherData.weather[0].description}
                        </p>
                        <p className={`${styles.windSpeed} ${getWindSpeedClass(weatherData.weather[0].description)}`}>
                            Velocidade do vento: {weatherData.wind.speed} m/s
                        </p>

                        <a href={getMapLink(city)} target="_blank" rel="noopener noreferrer" className={styles.mapButton}>
                            Ver Mapa da Cidade
                        </a>
                    </>
                )}

                {forecastData && (
                    <>
                        <h2 className={styles.forecastTitle}>Previsão para os próximos dias</h2>
                        <div className={styles.forecastChart}>
                            <Line data={getForecastChartData()} />
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}
