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

    // Function to run when a search is executed
    $("#searchBtn").on("click", function () {
        event.preventDefault();
        getCurrentWeather();
        // Run necessary functions
        storeSearchedCities();
        loadSearchHistory();
        $(".searchField").val("");
        // localStorage.setItem("savedCity", JSON.stringify());
    });

    // Get current weather
    function getCurrentWeather() {
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
            getFiveDayForecast();
        })
    }

    // Get future forecast information
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
            // Set uvindex color based on condition
            if (response.current.uvi < 2) {
                $("#uvindex").attr("class", "bg-success text-white rounded px-1");
            } else if (response.current.uvi >= 2 && response.current.uvi < 6) {
                $("#uvindex").attr("class", "bg-warning text-body rounded px-1");
            } else if (response.current.uvi >= 6 && response.current.uvi < 8) {
                $("#uvindex").attr("class", "bg-orange text-dark rounded px-1");
            } else if (response.current.uvi >= 8 && response.current.uvi < 11) {
                $("#uvindex").attr("class", "bg-danger text-white rounded px-1");
            } else {
                $("#uvindex").attr("class", "bg-purple text-white rounded px-1");
            }
        });
    }

    // Define empty array
    let cityArray;

    // Get stored cities
    function loadSearchHistory() {
        let storedCities = JSON.parse(localStorage.getItem("storedCities"));
        // If nothing there, set up empty array and store
        if (!storedCities) {
            cityArray = [];
            storedCities = cityArray;
            localStorage.setItem("storedCities", JSON.stringify(cityArray));
        // Otherwise delcare
        } else {
            cityArray = storedCities;
        }
        displayHistory();
    }

    // Store city searched into localStorage
    function storeSearchedCities() {
        cityArray.push(city);
        localStorage.setItem("storedCities", JSON.stringify(cityArray));
    };
    
    // Display search history in side bar
    function displayHistory() {
        const allCities = $("div.searchedCities");
        let storedCities = JSON.parse(localStorage.getItem("storedCities"));
        // console.log(storedCities);
        allCities.empty();
        // let idCounter = 0
        $.each(storedCities, function (index, value) {
            const newCityButton = $("<button>").addClass("history btn btn-block bg-white text-secondary text-left border-secondary rounded-0 py-2 mt-0").attr("id", storedCities[index]);
            allCities.prepend(newCityButton.text(storedCities[index]));
            // idCounter++;
            // console.log(storedCities[index]);
        });
    };

    let pastCity;
    // When past cities are clicked, load current weather and forecast
    $(document).on("click", "button.history", function (event) {
        event.preventDefault();
        pastCity = event.target;
        // pastCity = $(this).text
        // console.log($(this));
        console.log(pastCity);
        pastCity = pastCity.getAttribute("id");
        console.log(pastCity);
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + pastCity + "&units=imperial&appid=7de3b9a0cd9f9144a9dcc3a15797e2b5";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // Get lat/lon for onecall to retrieve 5 day forecast info
            lat = response.coord.lat;
            lon = response.coord.lon;
            // Label city on page
            $("#city").text(response.name + "\xa0\xa0");
            getFiveDayForecast();
        })
        
    });




    $("div.searchedCities").on("click", function (event) {
        pastCity = event.target;
        if (pastCity.matches("button")) {
            newcity = $("button").text();
            console.log($("button").text());
            console.log(newcity);
            console.log(pastCity);
        }
    });




        //
    // });

    // Load search history on refresh of page
    loadSearchHistory();





    // *****************************           WHAT'S LEFT...             *********************************
    // 
    // 
    // 
    // 
    // Weather to load "some city" on initial load if nothing stored.
    // Past cities need to reveal weather when clicked.....
    
});