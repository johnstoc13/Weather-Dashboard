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

    
    // Need to create URL based on user inputs
    const apiKey = "7de3b9a0cd9f9144a9dcc3a15797e2b5";
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchField + "&" + apiKey;
    // console.log(queryURL);

    // function getURL() {
    //     let queryCity = document.searchField.text;
    //     $("#searchBtn").
    // }

    $("#searchBtn").on("click", function(){
        city = $(this).parent("input").val();
        localStorage.setItem("savedCity", JSON.stringify(cityArray));
        console.log(city);
    })

    // $.ajax({
    //     url: queryURL,
    //     method: "GET"
    //   })
    







});