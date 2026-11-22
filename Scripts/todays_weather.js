import { get_icon_by_weather_code } from "./get_icon.js";
import { temp_format } from "./temp_foremater.js";

export function render_todays_weather(current, city, units, lang) {
  // console.log("..............", unites);
  const date = new Date(current.time).toLocaleDateString(`${lang}`, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  console.log(lang);
  const html = `
  <div class="location_date">
              <p class >${city.name}, ${city.country}</p>
              <p>${date}</p>
            </div>
            <div class="weather">
              <img
                src=${get_icon_by_weather_code(current.weather_code)}
                alt=""
              />
              <p class="js_temperature">${temp_format(current.temperature_2m)}${units.apparent_temperature}</p>
            </div>
  `;
  document.querySelector(".todays_weather").innerHTML = html;
}
