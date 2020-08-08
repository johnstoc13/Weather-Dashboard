$(document).ready(function () {

    // Set variables
    const forecast = $(".forecast");
    let city;
    let lat;
    let lon;
    let cityArray;

    // Put current day, month, and date onto page & 5 day forecast dates
    $(".date").append(moment().format("MM-DD-YYYY"));
    $(".date1").append(moment().add(1, 'd').format("MM-DD-YYYY"));
    $(".date2").append(moment().add(2, 'd').format("MM-DD-YYYY"));
    $(".date3").append(moment().add(3, 'd').format("MM-DD-YYYY"));
    $(".date4").append(moment().add(4, 'd').format("MM-DD-YYYY"));
    $(".date5").append(moment().add(5, 'd').format("MM-DD-YYYY"));

    // Ensure "return" keyup starts click event also
    // Cited: https://stackoverflow.com/questions/155188/trigger-a-button-click-with-javascript-on-the-enter-key-in-a-text-box
    $("#searchField").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#searchBtn").click();
        }
    });
    
    // Function to run when a search is executed
    $("#searchBtn").click(function () {
        let searchCity = $(".searchField").val();
        event.preventDefault();
        // If no city entered, prompt user for city
        if (!searchCity) {
            alert("Please select a valid city!");
            return "";
        } else {
            getCurrentWeather();
            // Run necessary functions
            storeSearchedCities();
            loadSearchHistory();
            // Clear search field
            $(".searchField").val("");
        }
    });

    // Get current weather
    function getCurrentWeather(currentCity) {
        // Get city for the queryURL
        city = currentCity || $("input").val();
        let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=7de3b9a0cd9f9144a9dcc3a15797e2b5`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // Get lat/lon for onecall to retrieve 5 day forecast info
            lat = response.coord.lat;
            lon = response.coord.lon;
            // Label city on page
            $(".city").text(response.name + "\xa0\xa0");
            getFiveDayForecast();
        });
    }

    // Get future forecast information
    function getFiveDayForecast() {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=7de3b9a0cd9f9144a9dcc3a15797e2b5`,
            method: "GET"
        }).then(function (response) {
            // Set current weather stats and icon
            $(".wxIcon").attr("src", `https://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`);
            // Cited:  https://www.w3schools.com/jsref/jsref_round.asp
            $(".temp").text(Math.round(response.current.temp));
            $(".humidity").text(response.current.humidity);
            $(".wind").text(Math.round(response.current.wind_speed));
            $(".uvindex").text(response.current.uvi);
            // Loop through 5 days to get forecast and display on page
            forecast.each(function (day) {
                day++;
                const _this = $(this);
                _this.find(".futureIcon").attr("src", `https://openweathermap.org/img/wn/${response.daily[day].weather[0].icon}@2x.png`);
                _this.find(".futureTemp").text(Math.round(response.daily[day].temp.day));
                _this.find(".futureHumidity").text(response.daily[day].humidity);
            });
            // Set uvindex color based on condition
            if (response.current.uvi < 2) {
                $(".uvindex").attr("class", "uvindex bg-success text-white rounded px-1");
            } else if (response.current.uvi >= 2 && response.current.uvi < 6) {
                $(".uvindex").attr("class", "uvindex bg-warning text-body rounded px-1");
            } else if (response.current.uvi >= 6 && response.current.uvi < 8) {
                $(".uvindex").attr("class", "uvindex bg-orange text-dark rounded px-1");
            } else if (response.current.uvi >= 8 && response.current.uvi < 11) {
                $(".uvindex").attr("class", "uvindex bg-danger text-white rounded px-1");
            } else {
                $(".uvindex").attr("class", "uvindex bg-purple text-white rounded px-1");
            }
        });
    }

    // Get stored cities
    function loadSearchHistory() {
        let storedCities = JSON.parse(localStorage.getItem("storedCities"));
        // If nothing there, set up empty array and store
        if (!storedCities) {
            cityArray = [];
            storedCities = cityArray;
            localStorage.setItem("storedCities", JSON.stringify(cityArray));
            // Otherwise get last city searched weather displayed
        } else {
            cityArray = storedCities;
            let lastCitySearched = cityArray[storedCities.length - 1];
            getCurrentWeather(lastCitySearched);
        }
        displayHistory();
    }

    // Store city searched into localStorage
    function storeSearchedCities() {
        cityArray.push(city);
        localStorage.setItem("storedCities", JSON.stringify(cityArray));
    }

    // Display search history in side bar
    function displayHistory() {
        const allCities = $("div.searchedCities");
        let storedCities = JSON.parse(localStorage.getItem("storedCities"));
        allCities.empty();
        $.each(storedCities, function (index) {
            const newCityButton = $("<button>").addClass("history btn btn-block bg-white text-secondary text-left border-secondary rounded-0 py-2 mt-0").attr("id", storedCities[index]);
            allCities.prepend(newCityButton.text(storedCities[index]));
        });
    }

    let pastCity;
    // When past cities are clicked, load current weather and forecast
    $(document).on("click", "button.history", function (event) {
        event.preventDefault();
        pastCity = event.target;
        pastCity = pastCity.getAttribute("id");
        getCurrentWeather(pastCity);
    });

    // Load search history on refresh of page
    loadSearchHistory();
});