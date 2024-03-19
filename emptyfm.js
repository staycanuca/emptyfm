let player;

// document.addEventListener('DOMContentLoaded', function () {
// player = videojs('emptyfm');
// player.play();
// });

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

  let fmList = document.getElementById("fmlist");

  fmList.InnerHTML = "";
  for (var k in stations) {
    let atag = document.createElement("a");
    atag.className = "fmitem";
    atag.href = stations[k].url;
    atag.innerText = stations[k].name;
    atag.onclick = () => alert(atag.href);

    fmList.appendChild(atag);
  }
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
      let selectElem = document.getElementById("countryCode");

      for (var k in json) {
        if (json.hasOwnProperty(k)) {
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
      let selectElem = document.getElementById("languages");

      for (var k in json) {
        if (json.hasOwnProperty(k)) {
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

