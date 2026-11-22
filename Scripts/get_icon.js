export function get_icon_by_weather_code(weather_code) {
  switch (weather_code) {
    case 0:
      return "weather-app-main/assets/images/icon-sunny.webp";

    case 1:
    case 2:
      return "weather-app-main/assets/images/icon-partly-cloudy.webp";

    case 3:
      return "weather-app-main/assets/images/icon-overcast.webp";

    case 45:
    case 48:
      return "weather-app-main/assets/images/icon-fog.webp";

    case 51:
    case 53:
    case 55:
      return "weather-app-main/assets/images/icon-drizzle.webp";

    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return "weather-app-main/assets/images/icon-rain.webp";

    case 71:
    case 73:
    case 75:
    case 77:
      return "weather-app-main/assets/images/icon-snow.webp";

    case 95:
    case 96:
    case 99:
      return "weather-app-main/assets/images/icon-storm.webp";

    default:
      return "weather-app-main/assets/images/icon-sunny.webp";
  }
}
