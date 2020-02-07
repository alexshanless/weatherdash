$(document).ready(function () {


    var APIKey = "42370f4168f01b2411c7828aba774200";
    var cityArray = JSON.parse(localStorage.getItem('searchedCity'));

    if (cityArray) {
        displayCurrentWeather(cityArray[0])
        fiveDayForecast(cityArray[0])
        displaySearchedCity()
    } else {
        cityArray = []
    }

    // Function to get the stored city to display on the left:
    // newCity is a local variable to that function

    function displaySearchedCity() {

        $(".city-card-body").empty();


        // for loop over the cityarry and then dynamically append each item in the array to the city-card-body. 

        for (var i = 0; i < cityArray.length; i++) {
            var cityName = $("<p>");

            // Adding a class of new-city-p to <p>
            cityName.addClass("new-city-p");

            cityName.attr(cityArray[i]);

            // Providing the <p> text
            cityName.text(cityArray[i]);
            // Adding the button to the buttons-view div
            $(".city-card-body").append(cityName);

            // ending bracket for displaySearchedCity function
        }
    }

    // var cityArray = localStorage.getItem('searchedCity').split(",");
    function displayCurrentWeather(city) {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey + "&units=imperial";
        $(".city").text(city);

        $.ajax({
            url: queryURL,
            method: "GET"
        })

            .then(function (response) {

                $(".weather-info").empty();
                $(".condition-image").empty();

                var weatherInfo = $(".weather-info");
                var tempResponse = response.main.temp;
                var temperature = $("<div>").text("Temperature: " + tempResponse + "℉");

                weatherInfo.append(temperature)


                var humidityResponse = response.main.humidity;

                var humidity = $("<div>").text("Humidity: " + humidityResponse + "%");

                // Append the humidity to main WeatherInfo div

                weatherInfo.append(humidity);

                // Create var for wind response:

                var windResponse = response.wind.speed;

                console.log("response is: ", response)

                // Create div to display wind

                var wind = $("<div>").text("Wind Speed: " + windResponse + " MPH");

                // Append wind to weatherInfo

                weatherInfo.append(wind);

                // Display weather icon

                var iconcodeCurrent = response.weather[0].icon

                var iconurlCurrent = "http://openweathermap.org/img/w/" + iconcodeCurrent + ".png";

                $(".condition-image").append('<img src="' + iconurlCurrent + '" />');
                var lon = response.coord.lon;
                 var lat = response.coord.lat;
                 uvIndex(lon, lat);

            });
            //uvIndex();
    }

    function uvIndex(lon, lat) {
        var indexURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lat}&lon=${lon}`;
            console.log(indexURL);
        $.ajax({
            url: indexURL,
            method: "GET"
        }).done(function(uvInfo) {
            console.log(uvInfo)
            var uvValue = uvInfo.value;
            console.log(uvValue);
            $(".weather-info").append("<p id='uv'>" + "UV Index: " + "</p>");
            var uvBtn = $("<button>").text(uvValue);
            $("#uv").append(uvBtn);
            //button styles
            if (uvValue < 3) {
                uvBtn.css("background-color", "Green");
            } else if (uvValue < 6) {
                uvBtn.css("background-color", "Yellow");
            } else if (uvValue < 8) {
                uvBtn.css("background-color", "Orange");
            } else if (uvValue < 11) {
                uvBtn.css("background-color", "Red");
            } else {
                uvBtn.css("background-color", "Purple");
            }
        })
    }

    // Function to display 5-day forecast temperatures calling OpenWeather:
    function fiveDayForecast(inputCityName) {
        var queryTemp = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCityName + "&APPID=" + APIKey + "&units=imperial";
        var queryConditionImage =

            // Run AJAX call to the OpenWeatherMap API
            $.ajax({
                url: queryTemp,
                method: "GET"
            })

                // Store retrieved data inside of an object called "responseTemp"

                .then(function (responseTemp) {

                    $(".forecastCards").empty();

                    for (var i = 0; i < responseTemp.list.length; i+=8) {

                        console.log(responseTemp.list[i].main.temp);



                        // Variables for forecast data:
                        var forecastDate = responseTemp.list[i].dt_txt.slice(0, 10);
                        // forecastTemp.moment().format(');
                        NewforecastDate = moment(forecastDate, 'YYYY/MM/DD/').add(1,'day');
                        console.log(NewforecastDate._i);

                        var forecastTemp = responseTemp.list[i].main.temp;
                        var forecastHumidity = responseTemp.list[i].main.humidity;
                        var iconcode = responseTemp.list[i].weather[0].icon;
                      
                        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

                        var cardContent =
                            "<div class='col-sm-2 cardDay'><p class='dateForecast'>" +
                            forecastDate +
                            "</p><p>" +
                            '<img src="' + iconurl + '" />' +
                            "</p><p>" +
                            "Temp: " +
                            forecastTemp +
                            '℉' +
                            "</p><p>" +
                            'Humidity: ' +
                            forecastHumidity +
                            '%' +
                            "</p></div>";


                        // format date 

                        // moment(".dateForecast").format('MM/DD/YYYY');




                        // cardContent.attr("class", "background-color: blue");

                        $(".forecastCards").append(cardContent);





                    }
                })
    }


    // CLICK EVENT FOR SEARCH BUTTON:
    $("#search-button").on("click", function (event) {

        event.preventDefault();

        // Grab the input data 

        var inputCityName = $("#city-input").val().trim();
        cityArray.unshift(inputCityName);
        localStorage.setItem('searchedCity', JSON.stringify(cityArray))
        // localStorage.setItem('searchedCity', cityArray)

        $(".city").text((inputCityName))


        //  Today's date goes next to city

        var todayDate = $('.today-date');

        // I AM TRYING TO MAKE A SPACE BETWEEN CITY AND DATE:
        $(todayDate).text("(" + (moment().format('MM/DD/YYYY')) + ")")


        // 5-Day Forecast heading text

        var fiveDayText = $('#five-day-text')
        console.log(fiveDayText)
        $(fiveDayText).text("3-Hour Forecast: ")

        // Call functions

        displayCurrentWeather(inputCityName);
        displaySearchedCity(inputCityName);
        fiveDayForecast(inputCityName)
        console.log(cityArray)

    });


    // CLICK EVENT FOR previously searched city to display that city's weather again
    $(".city-card-body").on("click", ".new-city-p", function (event) {

        event.preventDefault();

        displayCurrentWeather(event.currentTarget.innerText);
        fiveDayForecast(event.currentTarget.innerText);
        

    })


    // Closing curly bracket for document ready function
})