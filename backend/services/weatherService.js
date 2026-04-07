const axios = require('axios');

const weatherService = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        // Mock data fallback if API key isn't provided or fails
        const mockWeather = {
            temperature: 28,
            humidity: 60,
            rain_probability: 20,
            wind_speed: 15,
            condition: "Cloudy"
        };

        let weather = mockWeather;

        if (process.env.WEATHER_API_KEY && process.env.WEATHER_API_KEY !== 'dummykey') {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
                weather = {
                    temperature: response.data.main.temp,
                    humidity: response.data.main.humidity,
                    rain_probability: response.data.clouds ? response.data.clouds.all : 0,
                    wind_speed: response.data.wind.speed,
                    condition: response.data.weather[0].main
                };
            } catch (err) {
                console.warn("Weather API Failed. Using mocked data.");
            }
        }

        res.status(200).json(weather);
    } catch (error) {
        res.status(500).json({ message: 'Server error parsing weather', error });
    }
};

module.exports = weatherService;
