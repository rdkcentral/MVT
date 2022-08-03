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

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return false;
}

var playerType = getQueryVariable("player");
if (!playerType) {
  console.warn("var 'player' not provided, setting default: 'dashjs'");
  playerType = "dashjs";
}
var playerVer = getQueryVariable("player_ver");
if (!playerVer) {
  console.warn(`var 'player_ver' not provided, setting default: '${Players[playerType]["default"]}'`);
  playerVer = Players[playerType]["default"];
}
var mediaUrl = getQueryVariable("url");
if (!mediaUrl) {
  console.warn("var 'url' not provided, setting default: '/test-materials/dash/fmp4_h264_aac/manifest.mpd'");
  mediaUrl = "/test-materials/dash/fmp4_h264_aac/manifest.mpd";
}

let divPlayer = document.getElementById("players_list");
let curr = document.createElement("div");
curr.innerHTML = `Current player: &nbsp;<span class='orange'>"${playerType}" &nbsp; { ver: ${playerVer} }</span>`;
curr.innerHTML += `<br>Stream URL: &nbsp; <input id='url_input' style='width: 600px;' value='${mediaUrl}'>`;
curr.innerHTML += `</input>&nbsp; <button id="set_url" onclick="setSourceUrl()">SET</button>`;
curr.style = "margin: 20px 5px;";
divPlayer.appendChild(curr);

var playerList = [];
for (var _player in Players) {
  playerList.push(_player);
  var div = document.createElement("div");
  div.innerHTML = `${_player}: `;
  for (var ver in Players[_player]["versions"]) {
    var sameVer = Players[_player]["versions"][ver] == playerVer;
    var verLink = document.createElement("span");
    verLink.classList.add("leftmargin15");
    if ((!sameVer && _player == playerType) || playerType != _player) {
      verLink.classList.add("focusable");
      verLink.setAttribute("tabindex", "0");
      verLink.setAttribute(
        "data-href",
        `?player=${_player}&player_ver=${Players[_player]["versions"][ver]}&url=${mediaUrl}`
      );
      verLink.onclick = window.navigate;
    } else {
      verLink.classList.add("orange");
    }
    verLink.innerHTML = Players[_player]["versions"][ver];
    div.appendChild(verLink);
  }
  divPlayer.appendChild(div);
}

updatePlayer(playerType, playerVer);
window.onload = initPlayer;
