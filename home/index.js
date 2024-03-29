let temp = document.getElementById("w-temp");
let feels_like = document.getElementById("w-feels-like");
let wind = document.getElementById("w-wind");
let pressure = document.getElementById("w-pressure");
let name = document.getElementById("w-name");
let humidity = document.getElementById("w-humidity");
let visibility = document.getElementById("w-visibility");
let state = document.getElementById("w-state");

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=./";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            document.getElementById("")
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function writeAll() {
    let n = 1;
    document.getElementById("added-locations").innerHTML = "";
    for (i = 0; i < n; i++) {
        let c = getCookie("loc" + i.toString());
        if (c != "")
            document.getElementById("added-locations").innerHTML += "<div class='element' id='current-location" + (i + 1) + "'><span id='text' onclick=\"getCoordinates(this.innerHTML);\">" + c + "</span>";
        console.log(c);
        if (getCookie("loc" + (i + 1).toString()) != '')
            n++;
    }
}

function storeIt(val) {
    let n = 0, temp = 0, flag = 0;
    for (let i = 0; i < 4; i++) {
        if (getCookie("loc" + i.toString()) == '') {
            flag = 1;
            setCookie("loc" + i.toString(), val, 365);
            break;
        }
    }
    if (flag == 0) {
        setCookie("loc0", getCookie("loc1"), 365);
        setCookie("loc1", getCookie("loc2"), 365);
        setCookie("loc2", getCookie("loc3"), 365);
        setCookie("loc3", val, 365);
    }
}


const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    const crd = pos.coords;
    weatherSearch(crd.latitude, crd.longitude);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

writeAll();

async function weatherSearch(lat, lon) {
    const stringSearch = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=1855b8035c1679a630ed90645fd85c21";
    const weatherData = await fetch(stringSearch);
    const w = await weatherData.json();
    const hourlySearch = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=1855b8035c1679a630ed90645fd85c21");
    const hrly = await hourlySearch.json();
    let sRise = w.sys.sunrise;
    var rdate = new Date(sRise * 1000);
    var rhours = rdate.getHours();
    var rminutes = "0" + rdate.getMinutes();
    var rseconds = "0" + rdate.getSeconds();
    var formattedRiseTime = rhours + ':' + rminutes.substr(-2) + ':' + rseconds.substr(-2);
    let sSet = w.sys.sunset;
    var sdate = new Date(sSet * 1000);
    var shours = sdate.getHours();
    var sminutes = "0" + sdate.getMinutes();
    var sseconds = "0" + sdate.getSeconds();
    var formattedSetTime = shours + ':' + sminutes.substr(-2) + ':' + sseconds.substr(-2);
    let weather = new Array(w.name, Math.floor((w.main.temp) - 273), Math.floor((w.main.feels_like) - 273), (w.visibility) / 1000, w.weather[0].main, w.main.pressure, w.main.humidity, w.wind.speed, w.weather[0].icon, formattedRiseTime, formattedSetTime);
    document.getElementById("w-temp").innerHTML = weather[1] + "&deg;c";
    state.textContent = weather[4];
    document.getElementById("weather-location").innerHTML = weather[0] + "&nbsp;&nbsp;";
    document.getElementById("current-location").innerHTML = weather[0] + "&nbsp;<span id='current-location-logo'></span>";
    document.getElementById("w-feels-like").innerHTML = weather[2] + "&deg;";
    document.getElementById("w-visibility").innerHTML = weather[3] + " km";
    document.getElementById("w-state").innerHTML = weather[4];
    document.getElementById("w-pressure").innerHTML = weather[5] + " mb";
    document.getElementById("w-humidity").innerHTML = weather[6] + "%";
    document.getElementById("w-wind").innerHTML = weather[7] + " km/h";
    document.getElementById("w-logo").style.backgroundImage = "url('./animated/" + weather[8] + ".svg')";
    document.getElementById("w-sunrise").innerHTML = weather[9];
    document.getElementById("w-sunset").innerHTML = weather[10];
    document.getElementById("daily-forecast").innerHTML = "";
    for (let i = 0; i < 7; i++) {
        document.getElementById("daily-forecast").innerHTML += "<div class='card' id='card" + (i + 1) + "'><div class='after-time' id='after-time" + (i + 1) + "'>" + hrly.list[i].dt_txt + "</div><div class='after-logo' id='after-logo" + (i + 1) + "' style='background-image: url(\"./animated/" + hrly.list[i].weather[0].icon + ".svg\")'></div><div class='after-temp' id='after-temp" + (i + 1) + "'>" + Math.floor(hrly.list[i].main.temp - 273) + "&deg;c</div><div class='after-desc' id='after-desc" + (i + 1) + "'>" + hrly.list[i].weather[0].main + "</div></div>";
    }
    let dt = new Date();
    document.getElementById("time-value").innerText = dt.toLocaleTimeString();
    if (weather[4] == "Rain") {
        document.getElementById("current-weather").style.backgroundImage = "url('Rain 2.jpg')";
    }
    else if (w.weather[0].description == "broken clouds") {
        document.getElementById("current-weather").style.backgroundImage = "url('Cloudy 2.jpg')";
    }
    else if (dt.getTime > sSet) {
        document.getElementById("current-weather").style.backgroundImage = "url('Hazy Night.jpg')";
    }
    console.log(w);
    if (dt.getTime < sSet) {
        document.getElementById("current-weather").style.backgroundImage = "url('Hazy Night.jpg')";
    }
}


let dt = new Date();
document.getElementById("time-value").innerText = dt.toLocaleTimeString();


async function getCoordinates(loc, country) {
    if (country == null || country == '')
        var c_url = "https://api.openweathermap.org/geo/1.0/direct?q=" + loc + "&limit=5&appid=1855b8035c1679a630ed90645fd85c21";
    else
        var c_url = "https://api.openweathermap.org/geo/1.0/direct?q=" + loc + "," + country + "&limit=5&appid=1855b8035c1679a630ed90645fd85c21";
    const coordinate = await fetch(c_url);
    const c = await coordinate.json();
    const stringSearch = "https://api.openweathermap.org/data/2.5/weather?lat=" + c[0].lat + "&lon=" + c[0].lon + "&appid=1855b8035c1679a630ed90645fd85c21";
    const weatherData = await fetch(stringSearch);
    const w = await weatherData.json();
    const hourlySearch = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + c[0].lat + "&lon=" + c[0].lon + "&appid=1855b8035c1679a630ed90645fd85c21");
    const hrly = await hourlySearch.json();
    document.getElementById("daily-forecast").innerHTML = "";
    for (let i = 0; i < 7; i++) {
        document.getElementById("daily-forecast").innerHTML += "<div class='card' id='card" + (i + 1) + "'><div class='after-time' id='after-time" + (i + 1) + "'>" + hrly.list[i].dt_txt + "</div><div class='after-logo' id='after-logo" + (i + 1) + "' style='background-image: url(\"./animated/" + hrly.list[i].weather[0].icon + ".svg\")'></div><div class='after-temp' id='after-temp" + (i + 1) + "'>" + Math.floor(hrly.list[i].main.temp - 273) + "&deg;c</div><div class='after-desc' id='after-desc" + (i + 1) + "'>" + hrly.list[i].weather[0].main + "</div></div>";
    }
    let sRise = w.sys.sunrise;
    var rdate = new Date(sRise * 1000);
    var rhours = rdate.getHours();
    var rminutes = "0" + rdate.getMinutes();
    var rseconds = "0" + rdate.getSeconds();
    var formattedRiseTime = rhours + ':' + rminutes.substr(-2) + ':' + rseconds.substr(-2);
    let sSet = w.sys.sunset;
    var sdate = new Date(sSet * 1000);
    var shours = sdate.getHours();
    var sminutes = "0" + sdate.getMinutes();
    var sseconds = "0" + sdate.getSeconds();
    var formattedSetTime = shours + ':' + sminutes.substr(-2) + ':' + sseconds.substr(-2);
    let weather = new Array(w.name, Math.floor((w.main.temp) - 273), Math.floor((w.main.feels_like) - 273), (w.visibility) / 1000, w.weather[0].main, w.main.pressure, w.main.humidity, w.wind.speed, w.weather[0].icon, formattedRiseTime, formattedSetTime);
    document.getElementById("weather-location").innerHTML = weather[0] + "&nbsp;&nbsp;";
    document.getElementById("w-temp").innerHTML = weather[1] + "&deg;c";
    document.getElementById("w-feels-like").innerHTML = weather[2] + "&deg;";
    document.getElementById("w-visibility").innerHTML = weather[3] + " km";
    document.getElementById("w-state").innerHTML = weather[4];
    document.getElementById("w-pressure").innerHTML = weather[5] + " mb";
    document.getElementById("w-humidity").innerHTML = weather[6] + "%";
    document.getElementById("w-wind").innerHTML = weather[7] + " km/h";
    document.getElementById("w-logo").style.backgroundImage = "url('./animated/" + weather[8] + ".svg')";
    document.getElementById("w-sunrise").innerHTML = weather[9];
    document.getElementById("w-sunset").innerHTML = weather[10];
    return await weather;
}