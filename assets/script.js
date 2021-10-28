function apiLatLon(city) {
    // Use this call to get the latitude and longitude of the city.  This is required by the one call api.
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