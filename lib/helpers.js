const weatherIcons = {
  "01d": "/static/weather/day.svg",
  "02d": "/static/weather/cloudy-day-1.svg",
  "03d": "/static/weather/cloudy-day-2.svg",
  "04d": "/static/weather/cloudy-day-3.svg",
  "09d": "/static/weather/rainy-4.svg",
  "10d": "/static/weather/rainy-1.svg",
  "11d": "/static/weather/thunder.svg",
  "13d": "/static/weather/snowy-3.svg",
  "50d": "/static/weather/cloudy-day-3.svg",
  "01n": "/static/weather/night.svg",
  "02n": "/static/weather/cloudy-night-1.svg",
  "03n": "/static/weather/cloudy-night-2.svg",
  "04n": "/static/weather/cloudy-night-3.svg",
  "09n": "/static/weather/rainy-4.svg",
  "10n": "/static/weather/rainy-5.svg",
  "11n": "/static/weather/thunder.svg",
  "13n": "/static/weather/snowy-5.svg",
  "50n": "/static/weather/cloudy-day-3.svg"
};

// Capitalize
export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowercase(string) {
  return string.toLowerCase();
}

export const slugify = string => {
  if (!string) {
    return "";
  }
  const a = "àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;";
  const b = "aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------";
  const p = new RegExp(a.split("").join("|"), "g");
  const slug = string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters in a with b
    .replace(/&/g, "-and-") // Replace & with ‘and’
    .replace(/[^\w-]+/g, "") // Remove all non-word characters such as spaces or tabs
    .replace(/--+/g, "-") // Replace multiple — with single -
    .replace(/^-+/, "") // Trim — from start of text
    .replace(/-+$/, ""); // Trim — from end of text
  return slug;
};
// Format price
export function getTime(datetime, mode) {
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  var dateTime = new Date(datetime);
  var day = days[dateTime.getDay()];
  var hr = dateTime.getHours();
  var min = dateTime.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  var ampm = "am";
  if (hr > 12) {
    hr -= 12;
    ampm = "pm";
  }
  var date = dateTime.getDate();
  if (date > 3 && date < 21) date = date + "th";
  switch (date % 10) {
    case 1:
      date = date + "st";
      break;
    case 2:
      date = date + "nd";
      break;
    case 3:
      date = date + "rd";
      break;
    default:
      break;
  }
  var month = months[dateTime.getMonth()];
  var year = dateTime.getFullYear();
  if (mode === "full") return `${day}, ${month} ${date}  ${hr}:${min} ${ampm}`;
  if (mode === "time") return hr + ":" + min + ampm;
  if (mode === "date") return day + ", " + month + " " + date;
}

export function formatPrice(number) {
  const fnumber = parseFloat(number);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(fnumber);
}

// Get wind direction
export function windDirection(degree) {
  const sectors = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

  degree += 22.5;

  if (degree < 0) {
    degree = 360 - (Math.abs(degree) % 360);
  } else {
    degree = degree % 360;
  }

  const which = parseInt(degree / 45, 10);
  return sectors[which];
}

// Get weather icon class
export function getWeatherIcon(code, size) {
  const icon = weatherIcons[code];
  return (
    <span
      css={`
        background: none, url(${icon}) no-repeat;
        background-size: contain;
        width: ${size}px;
        height: ${size}px;
        display: inline-block;
      `}
    />
  );
}

// Get weather data
export async function getWeather(city, country, days) {
  let forecast = undefined;
  try {
    const forecast_call = await fetch(
      `//api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${process.env.weatherApi}&cnt=${days}&units=metric`
    )
      .then(res => {
        if (res.ok) {
          return res;
        } else {
          throw Error(`Request rejected with status ${res.status}`);
        }
      })
      .catch(console.error);

    if (forecast_call !== undefined) {
      forecast = await forecast_call.json();
    }

    return forecast;
  } catch (e) {
    return "";
  }
}

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/ (.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/ /g, "");
}

export function objectToCamelCase(origObj) {
  return Object.keys(origObj).reduce(function(newObj, key) {
    let val = origObj[key];
    let newVal = typeof val === "object" ? objectToCamelCase(val) : val;
    newObj[toCamelCase(key)] = newVal;
    return newObj;
  }, {});
}
