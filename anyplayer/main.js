/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2022 Liberty Global B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

const Players = {
  dashjs: {
    versions: ["2.9.3", "3.2.1", "4.0.0", "4.7.0", "latest"],
    default: "4.7.0",
    url_pref: "https://cdn.dashjs.org/",
    url_suff: "/dash.all.min.js",
  },
  shaka: {
    versions: ["2.5.0", "3.2.1", "3.2.2", "3.3.7", "4.1.1"],
    default: "3.2.1",
    url_pref: "https://ajax.googleapis.com/ajax/libs/shaka-player/",
    url_suff: "/shaka-player.compiled.js",
  },
  hlsjs: {
    versions: ["1.0.0", "1.1.0", "1.2.1", "1.3.0", "1.4.5"],
    default: "1.4.5",
    url_pref: "https://cdn.jsdelivr.net/npm/hls.js@",
    url_suff: "",
  },
  native: {
    versions: ["native"],
    default: "native",
  },
};

let mediaUrl, playerType, playerVer, autoplay, drm, drmSystem, drm_license, drm_header;

const waitFor = (sec) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, sec * 1000);
  });
};

function getQueryVariable(variable) {
  // function for getting from URL value of the provided variable
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair.slice(1).join("="));
    }
  }
  return false;
}

function setQueryVariable(url, variable, value) {
  // function for updating variable and value in the provided url
  if (url == "") {
    return `?${variable}=${value}`;
  } else {
    if (url.charAt(0) == "?") {
      url = url.substring(1);
    }
    let vars;
    if (url.includes("&")) {
      vars = url.split("&");
    } else {
      vars = [url];
    }
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) == variable) {
        url = url.replace(`${pair[0]}=${pair[1]}`, `${pair[0]}=${value}`);
        return `?${url}`;
      }
    }
  }
  return `?${url}&${variable}=${value}`;
}

(function getAllUrlVariables() {
  // function is getting all the variables from the url
  mediaUrl = getQueryVariable("url");
  if (!mediaUrl) {
    console.warn("Parameter 'url' not provided, setting default: '/test-materials/dash/fmp4_h264_aac/manifest.mpd'");
    mediaUrl = "/test-materials/dash/fmp4_h264_aac/manifest.mpd";
  }

  playerType = getQueryVariable("player");
  if (!playerType) {
    console.warn("Parameter 'player' not provided, setting default: 'dashjs'");
    playerType = "dashjs";
  } else {
    playerType = playerType.toLowerCase();
  }

  playerVer = getQueryVariable("player_ver");
  if (!playerVer) {
    console.warn(`Parameter 'player_ver' not provided, setting default: '${Players[playerType]["default"]}'`);
    playerVer = Players[playerType]["default"];
  }

  autoplay = getQueryVariable("autoplay");
  if (autoplay.length > 0 && autoplay.toLowerCase() == "false") {
    autoplay = false;
  } else {
    autoplay = true;
  }

  drm = getQueryVariable("drm");
  drmSystem = "";
  if (!drm) {
    drm = "";
  } else {
    drm = drm.charAt(0).toUpperCase() + drm.slice(1).toLowerCase(); // Capitalize drm to match options in HTML
    if (drm == "Widevine") {
      drmSystem = "com.widevine.alpha";
    }
    if (drm == "Playready") {
      drmSystem = "com.microsoft.playready";
    }
  }
  drm_license = getQueryVariable("drm_license");
  if (!drm_license) {
    drm_license = "";
  }
  drm_header = getQueryVariable("drm_header");
  if (!drm_header) {
    drm_header = "";
  }
})();

function add_players() {
  // add div element with different players versions as a clickable buttons
  let playerList = [];
  let players_list_div = document.getElementById("players_list");
  let url = window.location.search.substring(1);
  let leftDiv = document.createElement("div");
  let rightDiv = document.createElement("div");
  leftDiv.className = rightDiv.className = "col-sm-6 text-center";

  for (let _player in Players) {
    playerList.push(_player);
    let div = document.createElement("div");
    if (_player != "native") {
      if (_player == playerType) {
        div.innerHTML = `<span class="fw-bold">${_player} </span> `;
      } else {
        div.innerHTML = `${_player} `;
      }
    }
    for (let ver in Players[_player]["versions"]) {
      let sameVer = Players[_player]["versions"][ver] == playerVer;
      let verLink = document.createElement("button");
      if ((!sameVer && _player == playerType) || playerType != _player) {
        verLink.className = "btn btn-outline-primary btn-sm m-1 focusable";
        if (_player == "native") {
          verLink.classList.add("px-10");
        }
        verLink.setAttribute("tabindex", "0");
        url = setQueryVariable(url, "player", _player);
        url = setQueryVariable(url, "player_ver", Players[_player]["versions"][ver]);
        verLink.setAttribute("data-href", url);
        verLink.onclick = window.navigate;
      } else {
        verLink.className = "btn btn-success border border-success-subtle rounded-3 btn-sm m-1 fw-bold";
        if (_player == "native") {
          verLink.classList.add("px-10");
        }
      }
      if (_player != "native") {
        verLink.innerHTML = Players[_player]["versions"][ver];
      } else {
        verLink.innerHTML = "Native player";
      }
      div.appendChild(verLink);
    }
    if (_player == "dashjs" || _player == "hlsjs") {
      leftDiv.appendChild(div);
    } else {
      rightDiv.appendChild(div);
    }
    players_list_div.appendChild(leftDiv);
    players_list_div.appendChild(rightDiv);
  }
  let divPlayer = document.getElementById("players_versions");
  divPlayer.appendChild(players_list_div);
}

function getPlayerUrls() {
  // function for getting url for scripts that needs to be loaded for specific player
  let playerUrls = []
  if (playerType != "native") {
    let _playerVer = playerType == "dashjs" ? `v${playerVer}` : playerVer;
    if (playerVer == "latest") {
      _playerVer = "latest";
    }
    if (playerType == "shaka") {
      // mux.js is required by shaka player to support MPEG-2 TS (needs to be loaded before the player script)
      playerUrls.push("https://cdnjs.cloudflare.com/ajax/libs/mux.js/6.3.0/mux.min.js")
    }
    playerUrls.push(`${Players[playerType]["url_pref"]}${_playerVer}${Players[playerType]["url_suff"]}`)
    if (playerType == "dashjs") {
      // dash.mss.js is required by dashjs player to smooth streaming (needs to be loaded after the player script)
      let mssUrl = `${Players[playerType]["url_pref"]}${_playerVer}/dash.mss.min.js`
      playerUrls.push(mssUrl);
    }
  }
  return playerUrls;
}

let scriptSources = [
  "../js_mse_eme/harness/key.js",
  "../js_mse_eme/harness/focusManager.js",
  "players.js",
  "actions.js",
];

let playerUrls = getPlayerUrls();
scriptSources = playerUrls.concat(scriptSources);

function loadScriptsSequentially(scripts, index) {
  if (index < scripts.length) {
    var script = document.createElement("script");
    script.src = scripts[index];
    script.defer = script.async = true;
    document.head.appendChild(script);
    script.onload = function () {
      loadScriptsSequentially(scripts, index + 1);
    };
  }
}
loadScriptsSequentially(scriptSources, 0);

window.addEventListener("load", function () {
  update_config_from_url();
  add_players();
  initPlayer();
  if (autoplay) {
    waitFor(1).then(playPauseVideo);
  }
  waitFor(0.25).then(showConfig);
});
