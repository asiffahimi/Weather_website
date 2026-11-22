async function get_city_info(city_name, lang) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city_name}&count=10&language=${lang}&format=json`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }
  return data.results[0];
}

async function get_city_info_search(city_name, lang) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city_name}&count=10&language=${lang}&format=json`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }
  return data.results;
}

export { get_city_info, get_city_info_search };
// get_city_info("Kabul");
