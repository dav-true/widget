async function loadData(place) { //
    const key = 'f3912b2b27af9083cecce5a45cb7e27b' //
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${key}`; //
    const res = await fetch(url); // 
    return res.json(); // 4. Загрузили данные по городу и вернули их в формате JSON
}

function convertTemperature(value, unitName) {
    switch (unitName) {
        case 'c':
            return Math.round(value - 273.15);
        case 'f':
            return Math.round((value - 273.15) * 1.8 + 32);
        default:
            return value;
    }
}

async function onLoad() {
    const widget = document.querySelector('[data-widget]');
    const searchForm = document.querySelector('[data-search-form]');
    const inputElem = searchForm.querySelector('[name=value]')

    async function loadAndRender(value) { // 2. Передаем значение города в функцию
        const data = await loadData(value); // 3. Загружаем данные города с помощью функции loadData
        widget.classList.remove('hidden'); // 5. После загрузки JS снимает класс hidden с data-widget
        inputElem.value = value; //
        renderWiget(widget, data);
    }

    function onSubmit(event) {
        event.preventDefault();
        loadAndRender(inputElem.value);
    }

    searchForm.addEventListener('submit', onSubmit);
    loadAndRender('London')  // 1. Дефолтный город
}

function renderWiget(widget, data) {
    const titleElem = widget.querySelector('[data-title]');
    const timeElem = widget.querySelector('[data-time]');
    const weatherStatusElem = widget.querySelector('[data-weather-status]');
    const temperatureValueElem = widget.querySelector('[data-temperature-value]');
    const pressureElem = widget.querySelector('[data-pressure]');
    const humidityElem = widget.querySelector('[data-humidity]');
    const unitElems = Array.from(widget.querySelectorAll('[data-temperature-unit]'));

    function onUnitClick(event) {
        const unitName = event.target.dataset.temperatureUnit;
        setTemperature(unitName);
    }

    function setTemperature(unitName) {
        unitElems.forEach(unitElem => {
            unitElem.dataset.active = false;
            unitElem.classList.remove('active')
        });
        const unitElem = widget.querySelector(`[data-temperature-unit="${unitName}"]`)
        unitElem.classList.add('active');
        unitElem.dataset.active = true;
        const temperature = convertTemperature(data.main.temp, unitName);
        temperatureValueElem.innerHTML = temperature;
    }

    unitElems.forEach(unit => {
        unit.addEventListener('click', onUnitClick);
    });

    const date = new Date();

    titleElem.innerHTML = data.name;
    timeElem.innerHTML = date.toLocaleDateString();
    weatherStatusElem.innerHTML = data.weather[0].main;
    pressureElem.innerHTML = data.main.pressure;
    humidityElem.innerHTML = data.main.humidity;

    const activeUnitElem = unitElems.find(unit => unit.dataset.active === 'true');
    const activeUnitName = activeUnitElem ?
        activeUnitElem.dataset.temperatureUnit :
        'c';
    setTemperature(activeUnitName);
}

window.addEventListener('DOMContentLoaded', onLoad);