var selectCity = document.getElementById("cities-select");
var result = document.querySelector(".result");
var divCityInput = document.querySelector(".div-input");
var inputCity = document.getElementById("add-city-value");
const button = document.getElementById("btn");
var buttonToInput = document.getElementById("btn-add");

inputCity.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    button.click();
  }
});
buttonToInput.disabled = false;
function validateData() {
  if (!selectCity.value) {
    alert("invalid");
    return false;
  }
  return true;
}

function displayCityInput() {
  divCityInput.style.display = "flex";
  result.style.display = "none";
  buttonToInput.disabled = true;
}

function validateCity() {
  if (!inputCity.value) {
    alert("complete el campo");
    return false;
  }
  return true;
}

function addCity() {
  if (validateCity()) {
    var newCity = inputCity.value;
    selectCity.options.add(new Option(newCity, newCity));
    alert("La ciudad se agregó con éxito");
    inputCity.value = "";
    divCityInput.style.display = "none";
    buttonToInput.disabled = false;
    $("#cities-select option:last").attr("selected", "selected");
    } else {
    alert("La ciudad ya está en lista");
    inputCity.value = "";
  }
}

async function checkWeather() {
  if (validateData()) {
    var city = selectCity.value;
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=3936d0749fdc3124c6566ed26cf11978&units=metric&lang=es"
    );
    const data = await response.json();
    console.log(data);
    displayResult(data);
  }
}

function displayResult(data) {
  const { name } = data;
  const { description, icon } = data.weather[0];
  const { temp, humidity, feels_like, pressure, temp_max, temp_min } =
    data.main;
  const { speed } = data.wind;
  console.log(name, icon, description, temp, humidity);
  result.style.display = "flex";
  document.querySelector(".icon").src =
    "http://openweathermap.org/img/wn/" + icon + "@4x.png";
  document.querySelector(".tiempo").innerText = "TIEMPO EN";
  document.querySelector(".city").innerText = name;
  document.getElementById("date").innerHTML = getDate();
  document.querySelector(".description").innerText = description;
  document.querySelector(".temp").innerText = temp.toFixed(1) + "°C";
  document.querySelector(".humidity").innerText = "Humedad: " + humidity + "%";
  document.querySelector(".sen-term").innerText =
    "Sensación térmica: " + feels_like.toFixed(1) + "C°";
  document.querySelector(".pressure").innerText =
    "Presión: " + pressure + " mb";
  document.querySelector(".wind").innerText = "Viento: " + speed + " mph";
  document.querySelector(".temp-min").innerText = temp_min.toFixed(1) + "°/ ";
  document.querySelector(".temp-max").innerText = temp_max.toFixed(1) + "°";
}

function getDate() {
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
  return "Hasta las " + time + ", ART";
}
