$(document).ready(function () {

    // Set variables
    let searchField = document.querySelector("#search");
    const searchBtn = document.querySelector("#searchBtn");

    const currentTemp = document.querySelector("#temp");
    const currentHumidity = document.querySelector("#humidity");
    const currentWind = document.querySelector("#wind");
    const currentUV = document.querySelector("#uvindex");

    // Put current day, month, and date onto page & 5 day forecast dates
    $("#date").append(moment().format("MM-DD-YYYY"));
    $("#date1").append(moment().add(1, 'd').format("MM-DD-YYYY"));
    $("#date2").append(moment().add(2, 'd').format("MM-DD-YYYY"));
    $("#date3").append(moment().add(3, 'd').format("MM-DD-YYYY"));
    $("#date4").append(moment().add(4, 'd').format("MM-DD-YYYY"));
    $("#date5").append(moment().add(5, 'd').format("MM-DD-YYYY"));

    
    
    // Need to query weatherAPI using city searched
    // Store this info in local storage
    // Append data to document accordingly
    // Save previously searched cities onto page as well
    let city;
    let lat;
    let lon;
    
    $("#searchBtn").on("click", function(){
        event.preventDefault()
        city = $("input").val();
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=7de3b9a0cd9f9144a9dcc3a15797e2b5";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(JSON.stringify(response));
            lat = response.coord.lat;
            lon = response.coord.lon;
            console.log(lat);
            console.log(lon);
            getFiveDayForecast();
        })
        // localStorage.setItem("savedCity", JSON.stringify());
    });
    
    function getFiveDayForecast() {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=7de3b9a0cd9f9144a9dcc3a15797e2b5",
            method: "GET"
        }).then(function(response) {
            console.log(JSON.stringify(response));
        })
    }






});