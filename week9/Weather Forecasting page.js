const weatherData = {
  Mumbai: {
    temperature: "31 C",
    condition: "Sunny",
    humidity: "68%",
    wind: "14 km/h",
    icon: "SUN"
  },
  Delhi: {
    temperature: "28 C",
    condition: "Partly Cloudy",
    humidity: "52%",
    wind: "11 km/h",
    icon: "PCL"
  },
  Pune: {
    temperature: "26 C",
    condition: "Light Rain",
    humidity: "72%",
    wind: "9 km/h",
    icon: "RAN"
  },
  Bangalore: {
    temperature: "24 C",
    condition: "Cloudy",
    humidity: "65%",
    wind: "10 km/h",
    icon: "CLD"
  },
  Kolkata: {
    temperature: "29 C",
    condition: "Rainy",
    humidity: "80%",
    wind: "15 km/h",
    icon: "RAN"
  }
};

const filterRules = {
  all: () => true,
  hot: (cityWeather) => parseInt(cityWeather.temperature, 10) >= 28,
  rainy: (cityWeather) => cityWeather.condition.toLowerCase().includes("rain"),
  cloudy: (cityWeather) => cityWeather.condition.toLowerCase().includes("cloud")
};

function formatDateTime() {
  const now = new Date();
  return now.toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function updateCardWeather(card) {
  const cityName = card.dataset.city;
  const cityWeather = weatherData[cityName];

  if (!cityWeather) {
    return;
  }

  card.querySelector('[data-field="temperature"]').textContent = cityWeather.temperature;
  card.querySelector('[data-field="condition"]').textContent = cityWeather.condition;
  card.querySelector('[data-field="humidity"]').textContent = cityWeather.humidity;
  card.querySelector('[data-field="wind"]').textContent = cityWeather.wind;
  card.querySelector('[data-field="time"]').textContent = formatDateTime();
  card.querySelector(".weather-icon").textContent = cityWeather.icon;
}

function activateCard(targetCard) {
  const allCards = document.querySelectorAll(".city-card");

  allCards.forEach((card) => {
    card.classList.remove("active");
  });

  targetCard.classList.add("active");
  updateCardWeather(targetCard);
}

const cards = document.querySelectorAll(".city-card");
const filterButtons = document.querySelectorAll(".filter-btn");

cards.forEach((card) => {
  updateCardWeather(card);

  card.addEventListener("click", () => {
    activateCard(card);
  });

  card.addEventListener("mouseenter", () => {
    updateCardWeather(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateCard(card);
    }
  });
});

function applyFilter(filterKey) {
  const rule = filterRules[filterKey] || filterRules.all;
  let firstVisibleCard = null;

  cards.forEach((card) => {
    const cityWeather = weatherData[card.dataset.city];
    const shouldShow = rule(cityWeather);

    card.classList.toggle("hidden", !shouldShow);

    if (shouldShow && !firstVisibleCard) {
      firstVisibleCard = card;
    }
  });

  const activeCard = document.querySelector(".city-card.active");

  if (!activeCard || activeCard.classList.contains("hidden")) {
    cards.forEach((card) => card.classList.remove("active"));

    if (firstVisibleCard) {
      activateCard(firstVisibleCard);
    }
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    applyFilter(button.dataset.filter);
  });
});

setInterval(() => {
  const activeCard = document.querySelector(".city-card.active") || cards[0];

  if (activeCard) {
    updateCardWeather(activeCard);
  }
}, 60000);
