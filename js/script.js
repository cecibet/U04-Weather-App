var selectCity = document.getElementById("cities-select");
var result = document.querySelector(".result");
var divCityInput = document.querySelector(".div-input");
var inputCity = document.getElementById("add-city-value");
const button = document.getElementById("btn");
var buttonToInput = document.getElementById("btn-add");
var showError = document.getElementById("show-error");
var errorDiv = document.getElementById("div-error");

var selectArr;

window.onload = function () {
  selectArr = JSON.parse(localStorage.getItem("selectArr"));
  if (selectArr != null) {
    for (i = 0; i < selectArr.length; ++i) {
      selectCity.options.add(new Option(selectArr[i], selectArr[i]));
    }
  } else {
    selectArr = [];
  }
};

inputCity.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    button.click();
  }
});
buttonToInput.disabled = false;
function validateData() {
  if (!selectCity.value) {
    alert("No ha seleccionado una ciudad válida");
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
    alert("Ingrese el nombre de la ciudad");
    return false;
  }
  return true;
}

function cityExists() {
  if (validateCity()) {
    for (i = 0; i < selectCity.length; ++i) {
      if (selectCity.options[i].value == inputCity.value) {
        alert("La ciudad ya se encuentra en la lista");
        return false;
      }
    }
    return true;
  }
}

function addCity() {
  removeError();
  if (cityExists()) {
    addCityOption();
    saveData();
    clearInput();
    $("#cities-select option:last").attr("selected", "selected");
  } else {
    inputCity.value = "";
  }
}

function addCityOption() {
  var newCity = inputCity.value;
  selectCity.options.add(new Option(newCity, newCity));
  alert("La ciudad se agregó con éxito");
}

function deleteCity() {
  selectCity.remove(selectCity.selectedIndex);
  saveData();
  alert("La ciudad fue eliminada.");
  result.style.display = "none";
}

function saveData() {
  selectArr = [];
  for (var i = 0; i < selectCity.options.length; i++) {
    if (selectCity[i].value != "") {
      selectArr.push(selectCity[i].text);
    }
  }
  localStorage.setItem("selectArr", JSON.stringify(selectArr));
}
function clearInput() {
  inputCity.value = "";
  divCityInput.style.display = "none";
  buttonToInput.disabled = false;
  showError.innerText = "";
  errorDiv.style.display = "none";
}

async function checkWeather() {
  removeError();
  clearInput();
  if (validateData()) {
    try {
      var city = selectCity.value;
      const response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&appid=3936d0749fdc3124c6566ed26cf11978&units=metric&lang=es"
      );
      const data = await response.json();
      console.log(data);
      displayResult(data);
    } catch (error) {
      console.log(error);
      displayError();
    }
  }
}

function displayResult(data) {
  const { name } = data;
  const { country } = data.sys;
  const { description, icon } = data.weather[0];
  const { temp, humidity, feels_like, pressure, temp_max, temp_min } =
    data.main;
  const { speed } = data.wind;
  console.log(name, icon, description, temp, humidity);
  result.style.display = "flex";
  document.querySelector(".icon").src =
    "http://openweathermap.org/img/wn/" + icon + "@4x.png";
  document.querySelector(".tiempo").innerText = "TIEMPO EN";
  document.querySelector(".city").innerText = name + ", " + country;
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

function displayError() {
  errorDiv.style.display = "block";
  showError.innerText =
    "La ciudad ingresada no se encuentra en la base de datos.";
}

function removeError() {
  showError.innerText = "";
  errorDiv.style.display = "none";
}

setTimeout(function () {
  showError.innerText = "";
  errorDiv.style.display = "none";
}, 7000);
