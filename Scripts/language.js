const translations = {
  fa: {
    "how is the sky looking today?": "امروز هوا چطور است؟",
    "search a place": "جستجوی مکان",
    search: "جستجو",
    "no search result found!": "نتیجه‌ای پیدا نشد!",
    "daily forecast": "پیش‌بینی روزانه",
    "hourly forecast": "پیش‌بینی ساعتی",
    units: "واحدها",
    "switch to imperial": "تغییر به واحدهای امپریال",
    "switch to metric": "تغییر به واحدهای متریک",
    temperature: "دما",
    "wind speed": "سرعت باد",
    precipitation: "بارش",
    "celsius (°c)": "سلسیوس (°C)",
    "fahrenheit (°f)": "فارنهایت (°F)",
    "millimeters (mm)": "میلی‌متر (mm)",
    "inches (in)": "اینچ (in)",
    "something went wrong": "مشکلی پیش آمد",
    "we couldn't connnect to the server(api error).please try again in a few moments":
      "اتصال به سرور برقرار نشد. لطفاً کمی بعد دوباره تلاش کنید.",
    "⟳ retry": "⟳ تلاش دوباره",
    "loading...": "در حال بارگذاری...",
    "feels like": "دمای حس‌شده",
    humidity: "رطوبت",
    wind: "باد",
    visibility: "دید",
    "uv index": "شاخص فرابنفش",
    "partly cloudy": "نیمه‌ابری",
    cloudy: "ابری",
    overcast: "کاملاً ابری",
    sunny: "آفتابی",
    clear: "صاف",
    rain: "بارانی",
    snow: "برفی",
    thunderstorm: "طوفانی",
    "asif fahimi": "آصف فهیمی",
  },
};

const languageSelect = document.querySelector(".language-select");
// ---------------
// const language = languageSelect.value; // "en" or "fa"

// const city = await get_city_info("Kabul", language);

// console.log(city.name);
// ---------------
const originalText = new WeakMap();
const originalPlaceholders = new WeakMap();

function normalize(text) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function translatePage(language) {
  const dictionary = translations[language] ?? {};
  document.documentElement.lang = language;
  // document.documentElement.dir = language === "fa" ? "rtl" : "ltr";

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const source = originalText.get(node);
    const translated = dictionary[normalize(source)] ?? source;

    if (node.nodeValue !== translated) {
      node.nodeValue = translated;
    }
  }

  document.querySelectorAll("input[placeholder]").forEach((input) => {
    if (!originalPlaceholders.has(input)) {
      originalPlaceholders.set(input, input.placeholder);
    }

    const source = originalPlaceholders.get(input);
    input.placeholder = dictionary[normalize(source)] ?? source;
  });

  document.title = language === "fa" ? "برنامه آب‌وهوا" : "Weather app";
}

languageSelect?.addEventListener("change", (event) => {
  const language = event.target.value;

  translatePage(language);

  document.dispatchEvent(
    new CustomEvent("app-language-change", {
      detail: { language },
    }),
  );
});

const observer = new MutationObserver(() => {
  translatePage(languageSelect?.value ?? "en");
});

observer.observe(document.body, {
  childList: true,
  characterData: true,
  subtree: true,
});

translatePage(languageSelect?.value ?? "en");

export function getSelectedLanguage() {
  return languageSelect?.value ?? "en";
}

export async function get_english_city_name(location_id) {
  const params = new URLSearchParams({
    id: location_id,
    language: "en",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/get?${params}`,
  );

  if (!response.ok) {
    throw new Error("Could not retrieve city information");
  }

  const data = await response.json();

  if (!data || !data.name || !data.country) {
    throw new Error("City information not found");
  }

  return `${data.name}, ${data.country}`;
}
