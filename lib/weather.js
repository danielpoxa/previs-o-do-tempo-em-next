// Função para buscar dados do clima atual
export async function fetchWeatherData(city) {
    const apikey = '9cb6164fb68cb71cfbb0902223d93e7f';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Falha ao buscar dados do clima');
        }  
        const weatherData = await res.json();
        return weatherData;
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        return null;
    }
}

// Função para buscar previsão do tempo para os próximos dias
export async function fetchForecastData(city) {
    const apikey = '9cb6164fb68cb71cfbb0902223d93e7f';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Falha ao buscar dados da previsão do tempo');
        }  
        const forecastData = await res.json();
        return forecastData;
    } catch (error) {
        console.error('Erro ao buscar dados da previsão do tempo:', error);
        return null;
    }
}
