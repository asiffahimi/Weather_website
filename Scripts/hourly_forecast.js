import { get_icon_by_weather_code } from "./get_icon.js";
import { temp_format } from "./temp_foremater.js";
export function render_hourly_forecast(hourly, current, langu) {
  const currentTime = new Date(current.time).getTime();
  const startIndex = hourly.time.findIndex((time) => {
    return new Date(time).getTime() >= currentTime;
  });

  let html = "";

  for (let i = startIndex; i < 24; i++) {
    const hour = new Date(hourly.time[i]).toLocaleTimeString(`${langu}`, {
      hour: "numeric",
      hour12: true,
    });
    html += `
          <div>
              <img
                src=${get_icon_by_weather_code(hourly.weather_code[i])}
                alt="icon"
              />
              <p class="d">${hour}</p>
              <p class="c">${temp_format(hourly.temperature_2m[i])}°</p>
            </div>
    `;
  }

  document.querySelector(".button_h").innerHTML = html;
}

export function render_week_day_selection(daily, lang) {
  const week_d = daily.time.map((date) => {
    return new Date(date + "T12:00:00").toLocaleDateString(`${lang}`, {
      weekday: "long",
    });
  });
  const html = `
          <option selected value="0">${week_d[0]}</option>
          <option value="1">${week_d[1]}</option>
          <option value="2">${week_d[2]}</option>
          <option value="3">${week_d[3]}</option>
          <option value="4">${week_d[4]}</option>
          <option value="5">${week_d[5]}</option>
          <option value="6">${week_d[6]}</option>
  `;

  document.querySelector(".week_day").innerHTML = html;
}

export function render_hourly_other_days(hourly, value, lang) {
  const n_vlaue = 24 * Number(value);
  let html = "";
  for (let i = n_vlaue; i < n_vlaue + 24; i++) {
    const hour = new Date(hourly.time[i]).toLocaleTimeString(`${lang}`, {
      hour: "numeric",
      hour12: true,
    });
    html += `
          <div>
              <img
                src=${get_icon_by_weather_code(hourly.weather_code[i])}
                alt="icon"
              />
              <p class="d">${hour}</p>
              <p class="c">${temp_format(hourly.temperature_2m[i])}°</p>
            </div>
    `;
  }
  document.querySelector(".button_h").innerHTML = html;
}
