// API Key de AccuWeather (necesitarás registrarte en AccuWeather para obtener una)
const apiKey = 'ageuVyApvDn33vtvD2BUhygf9PdrzG8a';

// Ciudad para la cual deseas obtener el clima (en este ejemplo, Nueva York)
const city = 'Punta Arenas';

// Endpoint de la API para obtener la ubicación de la ciudad
const locationEndpoint = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

// Realizar la solicitud para obtener la información de la ubicación de la ciudad
fetch(locationEndpoint)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Respuesta de red no válida');
  })
  .then(locationData => {
    // Verificar si se encontró una ubicación
    if (locationData && locationData.length > 0) {
      const locationKey = locationData[0].Key;

      // Endpoint de la API para obtener el pronóstico extendido (10 días)
      const forecastEndpoint = `http://dataservice.accuweather.com/forecasts/v1/daily/10day/${locationKey}?apikey=${apiKey}&metric=true`;

      // Realizar la solicitud para obtener el pronóstico extendido
      fetch(forecastEndpoint)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Respuesta de red no válida');
        })
        .then(forecastData => {
          // Mostrar los datos del pronóstico extendido
          if (forecastData && forecastData.DailyForecasts && forecastData.DailyForecasts.length > 0) {
            const dailyForecasts = forecastData.DailyForecasts;

            // Iterar sobre los pronósticos diarios para los próximos 10 días
            dailyForecasts.forEach((forecast, index) => {
              const date = new Date(forecast.Date);
              const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'long' });
              const temperatureMin = forecast.Temperature.Minimum.Value;
              const temperatureMax = forecast.Temperature.Maximum.Value;
              const unit = forecast.Temperature.Minimum.Unit;

              console.log(`Día ${index + 1} (${dayOfWeek}): Mínima ${temperatureMin} ${unit}, Máxima ${temperatureMax} ${unit}`);
            });
          } else {
            console.log('No se encontraron datos de pronóstico extendido para esta ubicación');
          }
        })
        .catch(error => {
          console.error('Ocurrió un error al obtener el pronóstico extendido:', error);
        });
    } else {
      console.log('No se encontró la ubicación especificada');
    }
  })
  .catch(error => {
    console.error('Ocurrió un error al obtener la ubicación:', error);
  });

