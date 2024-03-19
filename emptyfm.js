let player;

document.addEventListener('DOMContentLoaded', function () {
  player = videojs('emptyfm');
  player.play();
});

async function fetchFMStations() {
  let countrySelect = document.getElementById("countryCode");
  let countryCode = countrySelect.value;

  let languagesSelect = document.getElementById("languages");
  let langCode = languagesSelect.value;

  let queryParams;

  if (!countryCode && !langCode) {
    alert("You must choose either country or language, or both if you wish.");
    return;
  }
  else if (!countryCode) {
    queryParams = "language=" + langCode + "&hidebroken=true&order=clickcount&reverse=true"
  }
  else if (!langCode) {
    queryParams = "countrycode=" + countryCode + "&hidebroken=true&order=clickcount&reverse=true"
  }
  else {
    queryParams = "countrycode=" + countryCode + "&language=" + langCode + "&hidebroken=true&order=clickcount&reverse=true"
  }
  
  const response = await fetch("https://de1.api.radio-browser.info/json/stations/search?" + queryParams);
  const stations = await response.json();
  console.log(stations);
  
  changeSource(stations[1].url);
}

function changeSource(url) {
  player = videojs('emptyfm');
  player.src({ type: 'application/x-mpegURL', src: url });
  player.play();
}

function listCountries() {
  fetch('./iso-3166-1-alpha2-countrycode.json')
    .then((response) => response.json())
    .then((json) => {
      for (var k in json) {
        if (json.hasOwnProperty(k)) {
	  let selectElem = document.getElementById("countryCode");
	  
	  let option = document.createElement("option");
	  option.text = json[k];
          option.value = k;
          
          selectElem.appendChild(option);
        }
      }
    })
}

function listLanguages() {
  fetch('./iso-639-lang.json')
    .then((response) => response.json())
    .then((json) => {
      for (var k in json) {
        if (json.hasOwnProperty(k)) {
	  let selectElem = document.getElementById("languages");
	  
	  let option = document.createElement("option");
	  option.text = json[k];
          option.value = k;
          
          selectElem.appendChild(option);
        }
      }
    })
}

listCountries();
listLanguages();

