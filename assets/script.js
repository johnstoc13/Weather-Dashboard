$(document).ready(function () {

    // Set variables
    const forecast = $(".forecast");
    let city;
    let lat;
    let lon;

    // Put current day, month, and date onto page & 5 day forecast dates
    $("#date").append(moment().format("MM-DD-YYYY"));
    $("#date1").append(moment().add(1, 'd').format("MM-DD-YYYY"));
    $("#date2").append(moment().add(2, 'd').format("MM-DD-YYYY"));
    $("#date3").append(moment().add(3, 'd').format("MM-DD-YYYY"));
    $("#date4").append(moment().add(4, 'd').format("MM-DD-YYYY"));
    $("#date5").append(moment().add(5, 'd').format("MM-DD-YYYY"));

    
    $("#searchBtn").on("click", function () {
        event.preventDefault()
        // Get city for the queryURL
        city = $("input").val();
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=7de3b9a0cd9f9144a9dcc3a15797e2b5";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // Get lat/lon for onecall to retrieve 5 day forecast info
            lat = response.coord.lat;
            lon = response.coord.lon;
            // Label city on page
            $("#city").text(response.name + "\xa0\xa0");
            // Get 5 day forecast
            getFiveDayForecast();
        })
        // localStorage.setItem("savedCity", JSON.stringify());
    });
    
    function getFiveDayForecast() {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=7de3b9a0cd9f9144a9dcc3a15797e2b5",
            method: "GET"
        }).then(function (response) {
            // Set current weather stats and icon
            $("#wxIcon").attr("src", "https://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png");
            $("#temp").text(response.current.temp);
            $("#humidity").text(response.current.humidity);
            $("#wind").text(response.current.wind_speed);
            $("#uvindex").text(response.current.uvi);
            // Loop through 5 days to get forecast and display on page
            forecast.each(function (day) {
                day++
                const _this = $(this);
                _this.find("#futureIcon").attr("src", "https://openweathermap.org/img/wn/" + response.daily[day].weather[0].icon + "@2x.png");
                _this.find("#futureTemp").text(response.daily[day].temp.day);
                _this.find("#futureHumidity").text(response.daily[day].humidity);
            })
        })
    }

    // *****************************NEXT STUFF TO DO**********
    // Store this info in local storage
    // Save previously searched cities onto page as well


    // Get stored cities, if none set up localStorage and empty array
    function loadSearchHistory() {
        let storedCities = JSON.parse(localStorage.getItem("storedCities"));

        if (!storedCities) {
            cityArray = [];
            storedCities = cityArray;
            localStorage.setItem("storedCities", JSON.stringify(cityArray));
        } else {
            cityArray = storedCities;
        }
        console.log(cityArray);
        displaySearchHistory();
    }

    let searchCity = $(".search-city");

    function displaySearchHistory() {
        searchCity.each(function (index) {
            $(this).text(cityArray[index]);
        });
    }

    loadSearchHistory();
});