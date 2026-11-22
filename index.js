import { get_city_info, get_city_info_search } from "./Scripts/geocoding.js";
import {
  get_english_city_name,
  getSelectedLanguage,
} from "./Scripts/language.js";
import "./Scripts/language.js";
import { render_todays_weather } from "./Scripts/todays_weather.js";
import { render_todays_others } from "./Scripts/todays_others.js";
import { render_daily_forecast } from "./Scripts/daily_forecast.js";
import { render_hourly_forecast } from "./Scripts/hourly_forecast.js";
import { render_week_day_selection } from "./Scripts/hourly_forecast.js";
import { render_hourly_other_days } from "./Scripts/hourly_forecast.js";

console.log("ok");
let ct_name = "Kabul";
let currentCity = null;

const selectedUnits = {
  temperature: "celsius",
  wind: "kmh",
  precipitation: "mm",
};
// ----------------------------------
document.addEventListener("app-language-change", async () => {
  const city_name_eng = await get_english_city_name(currentCity.id);
  try {
    const city = await get_city_info(city_name_eng, getSelectedLanguage());
    document.querySelector(".location_date p").textContent =
      `${city.name}, ${city.country}`;
    loadLondonWeather(city_name_eng);
  } catch (error) {
    console.error("Could not update city language:", error);
  }
});
// ----------------------------------
async function loadLondonWeather(city_name) {
  ct_name = city_name;
  handling_loading();
  document.querySelector(".main_container").classList.remove("hide");
  document
    .querySelector(".error_city_not_found")
    .classList.remove("no_city_found_show");
  document.querySelector(".weather_info").classList.remove("hide");
  document.querySelector(".error_message").classList.remove("show");
  try {
    console.log(getSelectedLanguage());
    const city = await get_city_info(city_name, getSelectedLanguage());
    currentCity = city;
    const longitude = city.longitude;
    const latitude = city.latitude;

    const params = new URLSearchParams({
      latitude,
      longitude,
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,precipitation,is_day",

      hourly:
        "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m",

      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max",
      temperature_unit: selectedUnits.temperature,
      wind_speed_unit: selectedUnits.wind,
      precipitation_unit: selectedUnits.precipitation,

      timezone: "auto",
    });

    const respons = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
    );

    // const respons = await fetch(
    //   `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,precipitation,is_day&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`,
    // );
    const weather_info = await respons.json();
    render_daily_forecast(weather_info.daily, getSelectedLanguage());

    render_todays_weather(
      weather_info.current,
      city,
      weather_info.current_units,
      getSelectedLanguage(),
    );

    render_hourly_forecast(
      weather_info.hourly,
      weather_info.current,
      getSelectedLanguage(),
    );

    render_week_day_selection(weather_info.daily, getSelectedLanguage());

    document.querySelector(".week_day").addEventListener("change", (event) => {
      if (event.target.value === "0") {
        render_hourly_forecast(weather_info.hourly, weather_info.current, "fa");
      }
      if (event.target.value !== "0") {
        render_hourly_other_days(
          weather_info.hourly,
          event.target.value,
          getSelectedLanguage(),
        );
      }
    });

    render_todays_others(
      weather_info.current.apparent_temperature,
      weather_info.current.relative_humidity_2m,
      weather_info.current.wind_speed_10m,
      weather_info.current.precipitation,
      weather_info.current_units,
    );
    document.querySelector(".main_container").classList.remove("hide");
    document
      .querySelector(".error_city_not_found")
      .classList.remove("no_city_found_show");
    document.querySelector(".weather_info").classList.remove("hide");
    document.querySelector(".error_message").classList.remove("show");
  } catch (error) {
    removing_loading();
    // Failed to fetch
    //City not found
    // if(error.message)
    if (error.message === "Failed to fetch") {
      document.querySelector(".main_container").classList.add("hide");
      document.querySelector(".error_message").classList.add("show");
    } else if (error.message === "City not found") {
      document.querySelector(".weather_info").classList.add("hide");
      document
        .querySelector(".error_city_not_found")
        .classList.add("no_city_found_show");
    }
  }
  removing_loading();
}
loadLondonWeather("Kabul");

// search --------------------------------------
function render_suggestions() {
  const suggest_container = document.querySelector(".suggestions_container");

  const input = document.querySelector(".js_search_input");
  input.addEventListener("input", async (event) => {
    const ct_name_srch = event.target.value.trim();
    if (ct_name_srch.length > 2) {
      // ------------------------------------
      document.addEventListener("click", (event) => {
        if (!suggest_container.contains(event.target)) {
          suggest_container.classList.remove("show_suggestions");
        }
      });

      // ------------------------------------

      const results = await get_city_info_search(
        ct_name_srch,
        getSelectedLanguage(),
      );
      let html = "";
      for (let i = 0; i < results.length; i++) {
        document
          .querySelector(".suggestions_container")
          .classList.add("show_suggestions");
        const srch_city = `${results[i].name}, ${results[i].country}`;
        html += `<div class="suggestion_item" >${srch_city}</div>`;
      }
      document.querySelector(".suggestions_container").innerHTML = html;
    }
    if (ct_name_srch.length <= 2) {
      document
        .querySelector(".suggestions_container")
        .classList.remove("show_suggestions");
    }
  });

  const suggestion_item = document.querySelector(".suggestions_container");
  suggestion_item.addEventListener("click", (event) => {
    const item_selected = event.target;
    const city_selected = item_selected.innerHTML;
    if (!item_selected) return;
    input.value = city_selected;
    loadLondonWeather(input.value);
    document
      .querySelector(".suggestions_container")
      .classList.remove("show_suggestions");
    input.value = "";
  });
}

function handling_search() {
  try {
    const form = document.getElementById("form_search_city");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const city_name = document.querySelector(".js_search_input").value;
      loadLondonWeather(city_name);
      document
        .querySelector(".suggestions_container")
        .classList.remove("show_suggestions");
    });
  } catch {}
}

render_suggestions();
handling_search();

// --------------------------------------
function handling_retry() {
  document.querySelector(".retry").addEventListener("click", () => {
    loadLondonWeather("Kabul");
  });
}
handling_retry();

function handling_loading() {
  document.querySelector(".loading").classList.add("show_loading");
  document.querySelector(".todays_weather").classList.add("loading");
}

function removing_loading() {
  document.querySelector(".loading").classList.remove("show_loading");
  document.querySelector(".todays_weather").classList.remove("loading");
}

function handling_unites() {
  const unitsButton = document.querySelector(".units-button");
  const unitsDropdown = document.querySelector(".units-dropdown");

  unitsButton.addEventListener("click", () => {
    unitsDropdown.classList.toggle("active");
    document.addEventListener("click", (event) => {
      if (
        !unitsDropdown.contains(event.target) &&
        !unitsButton.contains(event.target)
      ) {
        unitsDropdown.classList.remove("active");
      }
    });
  });
  const unitOptions = document.querySelectorAll(".unit-option");

  unitOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const group = option.dataset.group;
      selectedUnits[group] = option.dataset.value;
      document
        .querySelectorAll(`.unit-option[data-group="${group}"]`)
        .forEach((item) => {
          item.classList.remove("selected");
          item.querySelector("span")?.remove();
        });

      option.classList.add("selected");

      const checkmark = document.createElement("span");
      checkmark.textContent = "✓";

      option.appendChild(checkmark);
      loadLondonWeather(ct_name);
    });
  });

  const switchUnits = document.querySelector(".switch-units");
  let isImperial = false;
  switchUnits.addEventListener("click", () => {
    isImperial = !isImperial;

    const newUnits = isImperial
      ? {
          temperature: "fahrenheit",
          wind: "mph",
          precipitation: "inch",
        }
      : {
          temperature: "celsius",
          wind: "kmh",
          precipitation: "mm",
        };

    Object.assign(selectedUnits, newUnits);

    unitOptions.forEach((option) => {
      const { group, value } = option.dataset;

      if (selectedUnits[group] === value) {
        option.classList.add("selected");

        if (!option.querySelector("span")) {
          const checkmark = document.createElement("span");
          checkmark.textContent = "✓";
          option.appendChild(checkmark);
        }
      } else {
        option.classList.remove("selected");
        option.querySelector("span")?.remove();
      }
    });

    switchUnits.textContent = isImperial
      ? "Switch to Metric"
      : "Switch to Imperial";
    loadLondonWeather(ct_name);
  });
}

handling_unites();
