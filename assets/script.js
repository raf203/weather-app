// Variables 
var cities = [];

loadCities();

// Get location of the city
function apiLatLon(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=1353e67f03e4a02c4d6d35efc4c2e994&units=imperial";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return null;
        })
        .then(function (data) {
            if (data) {
                getOneCallData(city, data.coord.lat, data.coord.lon);
                addCityButton(city);
            } else {
                alert("Please insert a city.");
            }
        });
};

function apiGetData(city, lat, lon) {
    // This API should have all relevant data for the app.  
    // Just need the latitude and longitude from the other API.
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minute,hourly,alerts" + "&appid=1353e67f03e4a02c4d6d35efc4c2e994&units=imperial";
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return null;
        })
        .then(function (data) {
            if (data) {
                formatOneCallData(city, data);
            } else {
                alert("Internet connection is not active");
            }
        });
};

// Display date
function displayDate(date) {
    return moment(date * 1000).format("M/D/YY")
};

function displayContainerData(city, data) {
    var cityContainerEl = $("#city-container");
    cityContainerEl.html("");

    var cityCardEl = $("<div>");
    cityCardEl.addClass("dark");

// Display city header info (city name, date, weather icon)
    var cityInfoEl = $("<h3>");
    cityInfoEl.attr("id", "city-info");
    cityInfoEl.addClass("card-header");
    cityInfoEl.text(city + " (" + displayDate(data.dt) + ")");

    var citySpanEl = $("<span>");
    var cityIconEl = $("<img>");
    cityIconEl.attr("src", getIconLocation(data.weather[0].icon));

    citySpanEl.append(cityIconEl);
    cityInfoEl.append(citySpanEl);
    cityCardEl.append(cityInfoEl);

    //  Add temperature, wind, humidity and UVI.
    var cityTempEl = $("<div>");
    cityTempEl.attr("id", "city-temp");
    cityTempEl.html("Temp: " + data.temp.max + "&deg;F");
    cityCardEl.append(cityTempEl);

    var cityWindEl = $("<div>");
    cityWindEl.attr("id", "city-wind");
    cityWindEl.html("Wind: " + data.wind_speed + " MPH");
    cityCardEl.append(cityWindEl);

    var humidEl = $("<div>");
    humidEl.attr("id", "city-humid");
    humidEl.html("Humidity: " + data.humidity + "%");
    cityCardEl.append(humidEl);

    var uviEl = $("<div>");
    uviEl.attr("id", "city-uvi");
    uviEl.html("UV Index: ");

    var uviTextClass = "";
    if (data.uvi < 3) {
        uviTextClass = "bg-success";
    } else if (data.uvi >= 3 && data.uvi < 6) {
        uviTextClass = "bg-warning";
    } else {
        uviTextClass = "bg-danger";
    }

    var uviSpanEl = $("<span>");
    uviSpanEl.html(data.uvi);
    uviSpanEl.addClass(uviTextClass);
    uviEl.append(uviSpanEl);

    cityCardEl.append(uviEl);

    cityContainerEl.append(cityCardEl);

    var headerForecastEl = $("<h3>");
    headerForecastEl.html("5-day forecast");

    var headerRowEl = $("<div>");
    headerRowEl.attr("id", "forecast");
    headerRowEl.addClass("row");
    headerForecastEl.append(headerRowEl);

    cityContainerEl.append(headerForecastEl);
};

function formatCityData(city, data) {
    displayContainerData(city, data.daily[0]);

    // Display 5-day forecast
    var forecastEl = $("#forecast");
    forecastEl.html(""); 
    if (!forecastEl.hasClass("row")) {
        forecastEl.addClass("row");
    }

    for (var i = 1; i < 6; i++) {
        var containerEl = $("<div>");
        containerEl.addClass("col-2");

        var cardEl = $("<div>");
        //cardEl.addClass("card");
        cardEl.addClass("dark");

        var dateEl = $("<div>");
        dateEl.html(displayDate(data.daily[i].dt));
        dateEl.addClass("card-header");
        dateEl.addClass("shrink");
        cardEl.append(dateEl);

        var iconEl = $("<img>");
        iconEl.attr("src", getIconLocation(data.daily[i].weather[0].icon, "@2x"));
        iconEl.addClass("shrink-icon");
        cardEl.append(iconEl);

        var tempEl = $("<div>");
        tempEl.html("Temp: " + data.daily[i].temp.max + "&deg;F");
        tempEl.addClass("shrink");
        cardEl.append(tempEl);

        var windEl = $("<div>");
        windEl.html("Wind: " + data.daily[i].wind_speed + " MPH");
        windEl.addClass("shrink");
        cardEl.append(windEl);

        var humidEl = $("<div>");
        humidEl.html("Humidity: " + data.daily[i].humidity + "%");
        humidEl.addClass("shrink");
        cardEl.append(humidEl);

        containerEl.append(cardEl);
        forecastEl.append(containerEl);
    }
};

function getIconLocation(icon, size) {
    if (size === undefined) {
        size = "";
    }

    return "http://openweathermap.org/img/wn/" + icon + size + ".png";
};

// Add button of latest cities
function addCityButton(city) {
    if (cities.indexOf(city) === -1) {
        cities.unshift(city); 
    }

    saveCities();
    displayCityButtons();
};


function displayCityButtons() {
    var cityButtonsEl = $("#city-buttons");
    cityButtonsEl.html(""); 

    for (var i = 0; i < cities.length; i++) {
        var newButton = $("<button>");
        newButton.html(cities[i]);
        newButton.attr("data-city", cities[i]);
        newButton.addClass("btn");
        newButton.addClass("dark");

        cityButtonsEl.append(newButton);
    }
};

$("#user-form").on("submit", function (event) {
    event.preventDefault();

    var cityEl = $("#city");
    var city = cityEl.val().trim();
    cityEl.val(""); // Clear out city information
    if (city) {
        apiLatLon(city);
    } else {
        alert("Enter a city name.");
    }
});

$("#city-buttons").on("click", function (event) {
    var city = $(event.target).attr("data-city");
    if (city) {
        apiLatLon(city);
    }
});

function saveCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

function loadCities() {
    cities = JSON.parse(localStorage.getItem("cities"));
    if (!cities) {
        cities = [];
    }

    displayCityButtons();
}


