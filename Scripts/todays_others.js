export function render_todays_others(
  feels_like = "18",
  humidity = "46",
  wind = "14",
  precipitation = "0",
  units,
) {
  const html = `
            <div class="feels_like">
              <p class="d">Feels like</p>
              <p class="c">${feels_like}°</p>
            </div>
            <div class="humidity">
              <p class="d">Humidity</p>
              <p class="c">${humidity}%</p>
            </div>
            <div class="wind">
              <p class="d">wind</p>
              <p class="c">${wind}${units.wind_speed_10m}</p>
            </div>
            <div class="precipitation">
              <p class="d">Precipitation</p>
              <p class="c">${precipitation}${units.precipitation}</p>
            </div>
  `;
  document.querySelector(".todays_others").innerHTML = html;
}
