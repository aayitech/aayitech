"use client";

import { useCallback, useEffect, useState } from "react";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Droplets, ExternalLink, LocateFixed, MapPin, RefreshCw, Sun, Wind } from "lucide-react";
import styles from "./weather.module.css";

type City = { name: string; country: string; latitude: number; longitude: number };
type WeatherHour = { time: string; temperature: number | null; symbol: string | null; precipitation: number | null };
type WeatherData = {
  updatedAt: string;
  current: { temperature: number | null; humidity: number | null; windSpeed: number | null; symbol: string | null; precipitation: number | null };
  hours: WeatherHour[];
  attribution: string;
};
type Article = { title: string; url: string; publisher: string; publishedAt: string | null; country: string | null };
type Category = "world" | "business" | "technology" | "science";

const cities: City[] = [
  { name: "Karachi", country: "Pakistan", latitude: 24.8607, longitude: 67.0011 },
  { name: "Lahore", country: "Pakistan", latitude: 31.5204, longitude: 74.3587 },
  { name: "Islamabad", country: "Pakistan", latitude: 33.6844, longitude: 73.0479 },
  { name: "Dubai", country: "UAE", latitude: 25.2048, longitude: 55.2708 },
  { name: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276 },
  { name: "New York", country: "United States", latitude: 40.7128, longitude: -74.006 },
  { name: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832 },
  { name: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093 },
];

const categories: { id: Category; label: string }[] = [
  { id: "world", label: "World" },
  { id: "business", label: "Business" },
  { id: "technology", label: "Technology" },
  { id: "science", label: "Science" },
];

function description(symbol: string | null) {
  if (!symbol) return "Forecast";
  const base = symbol.replace(/_(day|night|polartwilight)$/i, "");
  const labels: Record<string, string> = {
    clearsky: "Clear sky", fair: "Fair", partlycloudy: "Partly cloudy", cloudy: "Cloudy", fog: "Fog",
    lightrain: "Light rain", rain: "Rain", heavyrain: "Heavy rain", lightrainshowers: "Light showers",
    rainshowers: "Rain showers", heavyrainshowers: "Heavy showers", lightsleet: "Light sleet", sleet: "Sleet",
    heavysleet: "Heavy sleet", lightsnow: "Light snow", snow: "Snow", heavysnow: "Heavy snow",
    lightsnowshowers: "Light snow showers", snowshowers: "Snow showers", heavysnowshowers: "Heavy snow showers",
    lightrainandthunder: "Light rain and thunder", rainandthunder: "Rain and thunder", heavyrainandthunder: "Heavy rain and thunder",
  };
  return labels[base] || base.replace(/([a-z])([0-9])/gi, "$1 $2").replace(/([a-z])([a-z]*)/i, (part) => part.charAt(0).toUpperCase() + part.slice(1));
}

function WeatherSymbol({ symbol, size = 28 }: { symbol: string | null; size?: number }) {
  const key = symbol?.toLowerCase() || "";
  const className = styles.weatherIcon;
  if (key.includes("thunder")) return <CloudLightning className={className} size={size} />;
  if (key.includes("snow") || key.includes("sleet")) return <CloudSnow className={className} size={size} />;
  if (key.includes("rain") || key.includes("shower")) return <CloudRain className={className} size={size} />;
  if (key.includes("fog")) return <CloudFog className={className} size={size} />;
  if (key.includes("partlycloudy")) return <CloudSun className={className} size={size} />;
  if (key.includes("clear") || key.includes("fair")) return <Sun className={className} size={size} />;
  return <Cloud className={className} size={size} />;
}

function localTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "numeric" });
}

function publishedTime(value: string | null) {
  if (!value) return "Latest";
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  const date = match ? new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`) : new Date(value);
  return Number.isNaN(date.getTime()) ? "Latest" : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function WeatherNews() {
  const [city, setCity] = useState<City>(cities[0]);
  const [locationLabel, setLocationLabel] = useState(`${cities[0].name}, ${cities[0].country}`);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [category, setCategory] = useState<Category>("world");
  const [articles, setArticles] = useState<Article[]>([]);
  const [newsError, setNewsError] = useState("");
  const [newsLoading, setNewsLoading] = useState(true);

  const loadWeather = useCallback(async (latitude: number, longitude: number, label: string) => {
    setWeatherLoading(true);
    setWeatherError("");
    try {
      const response = await fetch(`/api/weather?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Weather data could not be loaded.");
      setWeather(result as WeatherData);
      setLocationLabel(label);
    } catch (error) {
      setWeatherError(error instanceof Error ? error.message : "Weather data could not be loaded.");
    } finally {
      setWeatherLoading(false);
      setLocating(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather(cities[0].latitude, cities[0].longitude, `${cities[0].name}, ${cities[0].country}`);
  }, [loadWeather]);

  useEffect(() => {
    const controller = new AbortController();
    setNewsLoading(true);
    setNewsError("");
    fetch(`/api/news?category=${category}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Headlines could not be loaded.");
        setArticles(Array.isArray(result.articles) ? result.articles : []);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setNewsError(error instanceof Error ? error.message : "Headlines could not be loaded.");
      })
      .finally(() => setNewsLoading(false));
    return () => controller.abort();
  }, [category]);

  function detectLocation() {
    setWeatherError("");
    if (!navigator.geolocation) {
      setWeatherError("Location detection is not available in this browser. Choose a city instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => void loadWeather(position.coords.latitude, position.coords.longitude, "Your current location"),
      () => {
        setLocating(false);
        setWeatherError("Location permission was not available. Choose a city from the list instead.");
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 15 * 60 * 1000 },
    );
  }

  function chooseCity(value: string) {
    const selected = cities.find((item) => item.name === value);
    if (!selected) return;
    setCity(selected);
    void loadWeather(selected.latitude, selected.longitude, `${selected.name}, ${selected.country}`);
  }

  return <div className={styles.weatherNews}>
    <section className={styles.weatherPanel} aria-label="Local weather forecast">
      <div className={styles.panelHeader}>
        <div><span className={styles.kicker}>WEATHER NEAR YOU</span><h2>{locationLabel}</h2><p>Current conditions and the next few hours.</p></div>
        <div className={styles.locationControls}>
          <label className={styles.cityPicker}><MapPin size={14} /><span className={styles.srOnly}>Choose a city</span><select value={city.name} onChange={(event) => chooseCity(event.target.value)}>{cities.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label>
          <button type="button" className={styles.locationButton} onClick={detectLocation} disabled={locating || weatherLoading}><LocateFixed size={14} />{locating ? "Finding you…" : "Use my location"}</button>
        </div>
      </div>

      {weatherLoading && !weather ? <div className={styles.weatherLoading}><RefreshCw size={18} className={styles.spinning} /> Loading forecast…</div> : weather ? <>
        <div className={styles.currentWeather}>
          <div className={styles.currentMain}><WeatherSymbol symbol={weather.current.symbol} size={52} /><div><strong>{weather.current.temperature == null ? "—" : `${Math.round(weather.current.temperature)}°`}</strong><span>{description(weather.current.symbol)}</span></div></div>
          <div className={styles.currentMetrics}>
            <div><Droplets size={15} /><span>Humidity</span><b>{weather.current.humidity == null ? "—" : `${Math.round(weather.current.humidity)}%`}</b></div>
            <div><Wind size={15} /><span>Wind</span><b>{weather.current.windSpeed == null ? "—" : `${Math.round(weather.current.windSpeed)} m/s`}</b></div>
            <div><CloudRain size={15} /><span>Rain next hour</span><b>{weather.current.precipitation == null ? "—" : `${weather.current.precipitation} mm`}</b></div>
          </div>
        </div>
        <div className={styles.hourlyBlock}><div className={styles.hourlyHeading}><b>Coming hours</b><span>Local time</span></div><div className={styles.hourlyGrid}>{weather.hours.slice(0, 6).map((hour, index) => <div className={styles.hourItem} key={`${hour.time}-${index}`}><span>{index === 0 ? "Now" : localTime(hour.time)}</span><WeatherSymbol symbol={hour.symbol} size={20} /><b>{hour.temperature == null ? "—" : `${Math.round(hour.temperature)}°`}</b></div>)}</div></div>
        <div className={styles.weatherSource}>Updated {new Date(weather.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · <a href="https://api.met.no/" target="_blank" rel="noreferrer">MET Norway forecast data</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a></div>
      </> : <div className={styles.weatherEmpty}><p>Choose a city or allow location access to see the local forecast.</p></div>}
      {weatherError && <p role="alert" className={styles.inlineError}>{weatherError}</p>}
    </section>

    <section className={styles.newsPanel} aria-label="Recent news headlines">
      <div className={styles.newsHeader}><div><span className={styles.kicker}>A QUICK DAILY BRIEF</span><h2>Headlines worth a look.</h2><p>Read the headline here; open the publisher for the full story.</p></div></div>
      <div className={styles.categoryTabs} role="tablist" aria-label="News category">{categories.map((item) => <button key={item.id} type="button" role="tab" aria-selected={category === item.id} className={category === item.id ? styles.activeTab : ""} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div>
      {newsLoading ? <div className={styles.newsLoading}><RefreshCw size={16} className={styles.spinning} /> Loading recent headlines…</div> : newsError ? <p role="alert" className={styles.inlineError}>{newsError}</p> : articles.length ? <div className={styles.articleList}>{articles.map((article, index) => <article className={styles.article} key={`${article.url}-${index}`}><div className={styles.articleMeta}><span>{article.publisher}</span><time>{publishedTime(article.publishedAt)}</time></div><a href={article.url} target="_blank" rel="noopener noreferrer"><h3>{article.title}<ExternalLink size={13} /></h3></a></article>)}</div> : <div className={styles.newsEmpty}>No recent headlines in this category. Try another topic.</div>}
      <div className={styles.newsAttribution}>Headlines via <a href="https://www.gdeltproject.org/" target="_blank" rel="noreferrer">The GDELT Project</a>. Stories and reporting belong to their original publishers.</div>
    </section>
  </div>;
}
