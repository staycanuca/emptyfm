let player;
let recents;

async function fetchFMStations() {
    let countrySelect = document.getElementById("countryCode");
    let countryCode = countrySelect.value;

    let languagesSelect = document.getElementById("languages");
    let langCode = languagesSelect.value;

    let queryParams;

    if (!countryCode && !langCode) {
        alert("You must choose either country or language, or both if you wish.");
        return;
    } else if (!countryCode) {
        queryParams = "language=" + langCode + "&hidebroken=true&order=clickcount&reverse=true"
    } else if (!langCode) {
        queryParams = "countrycode=" + countryCode + "&hidebroken=true&order=clickcount&reverse=true"
    } else {
        queryParams = "countrycode=" + countryCode + "&language=" + langCode + "&hidebroken=true&order=clickcount&reverse=true"
    }

    const response = await fetch("https://de1.api.radio-browser.info/json/stations/search?" + queryParams);
    const stations = await response.json();

    let fmList = document.getElementById("fmlist");

    fmList.innerHTML = "";
    for (var k in stations) {
        let atag = document.createElement("a");
        atag.className = "fmitem";
        atag.href = stations[k].url;
        atag.innerText = stations[k].name;
        atag.onclick = (e) => {
            e.preventDefault();
            let found = recents.find(({
                name
            }) => name === atag.innerText);
            if (!found) {
                addToRecents(recents, atag.innerText, atag.href);
            }

            changeSource(atag.href);
        }

        fmList.appendChild(atag);
    }
}

function populateRecents() {
    let saved = localStorage.getItem('emptyfm') ?? '{ "recents": [] }';
    let savedObj = JSON.parse(saved);
    recents = savedObj["recents"];

    for (recent of recents) {
        constructRecentEl(recent.name, recent.url);
    }
}

function constructRecentEl(name, url) {
    let recentsEl = document.getElementById("recentList");
    let litag = document.createElement("li");
    let atag = document.createElement("a");
    atag.href = url;
    atag.innerText = name;
    atag.onclick = (e) => {
        e.preventDefault();
        changeSource(atag.href);
    };

    litag.appendChild(atag);
    recentsEl.appendChild(litag);
}

function addToRecents(savedObj, name, url) {
    let recentObj = {
        name: name,
        url: url
    };

    recents.push(recentObj);

    let recentsStr = JSON.stringify({ recents: recents });
    localStorage.setItem('emptyfm', recentsStr);

    constructRecentEl(name, url);
}

function changeSource(url) {
    document.getElementById("emptyfm").style.display = "block";
    player = videojs("emptyfm");
    let [mediaURL, mediaType] = fetchMediaType(url);
    player.src({
        type: mediaType,
        src: mediaURL
    });
    player.play().catch(error => {
        player.stop()
        [mediaURL, mediaType] = fetchMediaType(mediaURL, "application/x-mpegURL")
        player.src({
            type: mediaType,
            src: mediaURL
        })
        player.play()
    });
}

function fetchMediaType(url, defaultType = "audio/mpeg") {
    const radioBox = new URL(url)
    let lastPath = radioBox.pathname.split("/").pop();
    let mType = lastPath.split('.').pop();

    switch (mType) {
        case "m3u8":
            return [url, "application/x-mpegURL"];
        default:
            if (defaultType != "audio/mpeg") {
                return [url, "application/x-mpegURL"];
            } else {
                return [url, defaultType];
            }
    }
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

populateRecents();
listCountries();
listLanguages();