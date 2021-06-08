$(document).ready(function () {
  let setting = {
    url: "https://restcountries.eu/rest/v2/all",
    method: "GET",
  };

  $.ajax(setting).done(function (res) {
    res.forEach((data) =>
      $("#select-country").append(`
                    <option value="${data.name}">
                        ${data.name}
                    </option>
                `)
    );

    // $("#doit").click(function (e) {
    //   console.log("clicked");
    //   e.preventDefault();
    //   $("#search").load(result1);
    // });
    $("#doit").click(searchresult)
    $("#select-country").change(result1);
  });
  var result1 = function (e) {
    console.log(this);
    $.ajax({
      url: `https://restcountries.eu/rest/v2/name/${$(this).val()}?fullText=true`,
      method: "GET",
    }).done(loader);
  };

  var searchresult = function (e) {
    e.preventDefault();
    console.log(this);
    $.ajax({
      url: `https://restcountries.eu/rest/v2/name/${$("#search").val()}?fullText=true`,
      method: "GET",
    }).done(loader);
  };
  
  var loader = function (response) {
    $("#info").html(`
            <div>
                <h2 class="text-white">Name: ${response[0].name}</h2>
                <p class="text-white">Native Name: ${response[0].nativeName}</p>
                <p class="text-white">Capital: ${response[0].capital}</p>
                <p class="text-white">Region: ${response[0].region}</p>
                <p class="text-white">Population: ${response[0].population}</p>
                <p class="text-white">Language: ${response[0].languages[0].name}</p>
                <p class="text-white">Timezone: ${response[0].timezones}</p>
            </div>
            
            `);

    $("#call-code").html(`
                <div>
                    <p style="font-size:80px">${response[0].callingCodes}</p>
                </div>
            `);

    $("#flag").html(`
                <div>
                    <img src="${response[0].flag}" class="img-fluid"/>
                </div>
            `);

    $("#weather-report").html(`
                <span>${response[0].capital} Weather Report</span>
            `);

    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/weather?q=${response[0].capital}&appid=44b1fe8a6c0207544cdd674445971577`,
      method: "GET",
    }).done(function (response) {
      $("#weather").html(`
                <img src="http://openweathermap.org/img/wn/${
                  response.weather[0].icon
                }@2x.png">
                  <p>wind speed:${response.wind.speed}</p>
                  <p>temperature: ${Math.round(
                    response.main.temp - 273.15
                  )}°C</p>
                  <p>humadity: ${response.main.humidity}%</p>
                  <p>visibility: ${response.visibility}</p>
                `);
    });
    mapboxgl.accessToken =
      "pk.eyJ1IjoidmFyZy1hbWlyIiwiYSI6ImNrbzRpOGF2dDEybncyeGxwM3JpMGF1bXYifQ.uRhkF7YwPXaLtvZaQBuRWQ";
    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [response[0].latlng[1], response[0].latlng[0]],
      zoom: 4,
    });

    // Create a default Marker and add it to the map.
    var marker1 = new mapboxgl.Marker()
      .setLngLat([response[0].latlng[1], response[0].latlng[0]])
      .addTo(map);
  }
});

// $(document).ready(function() {
//   $("#doit").click(function(e) {
//       e.preventDefault();
//       console.log("Submit button clicked");
//       var pattern = $("#search").val();
//       var url = build_wiki_search_url(pattern);
//       $.ajax( {
//           type: "GET",
//           url: url,
//           dataType: 'jsonp',
//           success: function(data) {
//               console.log(data.query.searchinfo.totalhits);
//           },
//           error: function(errorMessage) {
//                console.log("damnn");
//             }
//       });
//   });
// })
