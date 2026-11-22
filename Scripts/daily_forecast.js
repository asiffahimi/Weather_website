import { get_icon_by_weather_code } from "./get_icon.js";
import { temp_format } from "./temp_foremater.js";

export function render_daily_forecast(daily_forecast, lang) {
  const time_formated = daily_forecast.time.map((date) => {
    return new Date(date + "T12:00:00").toLocaleDateString(`${lang}`, {
      weekday: "short",
    });
  });

  let html = "";
  for (let i = 0; i < daily_forecast.time.length; i++) {
    html += `
    <div class="day${i}">
              <div class="top">
                <p>${time_formated[i]}</p>
                <img
                  src=${get_icon_by_weather_code(daily_forecast.weather_code[i])}
                  alt="icon"
                />
              </div>
              <div class="buttom">
                <p>${temp_format(daily_forecast.temperature_2m_max[i])}°</p>
                <p>${temp_format(daily_forecast.temperature_2m_min[i])}°</p>
              </div>
            </div>
    `;
  }

  document.querySelector(".js_daily_forecast").innerHTML = html;
}
