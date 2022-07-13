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

function set_source_url() {
  let url_input = document.getElementById("url_input").value
  window.location.replace(`?player=${player_type}&player_ver=${player_ver}&url=${url_input}`);
}

function update_player(player, version) {
  if (player in Players) {
    let script_url = "";
    version = player == "dashjs" ? `v${version}` : version;
    if (version.includes("latest")) {
      script_url = `${Players[player]["url_pref"]}/latest/${Players[player]["url_suff"]}`;
    } else {
      script_url = `${Players[player]["url_pref"]}/${version}/${Players[player]["url_suff"]}`;
    }
    addScript(script_url, function () {});
  } else {
    console.error(`Player '${player_type}' is not available.`);
  }
}

function addScript(src, callback) {
  var head = document.getElementsByTagName("head")[0];
  var s = document.createElement("script");
  s.src = src;
  s.onload = callback;
  head.appendChild(s);
}

function initShaka() {
  if (!shaka.polyfill.installed) {
    shaka.polyfill.installAll();
    shaka.polyfill.installed = true;
  }
  initShakaPlayer();
}

async function initShakaPlayer() {
  const video = document.getElementById("video");
  const player = new shaka.Player(video);
  window.player = player;
  player.addEventListener("error", onErrorEvent);
  try {
    await player.load(media_url);
  } catch (e) {
    onError(e);
  }
}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(error) {
  console.error("Error code", error.code, "object", error);
}

function initDash() {
  var player = dashjs.MediaPlayer().create();
  var video = document.querySelector("video");
  player.initialize();
  player.attachView(video);
  player.attachSource(media_url);
}

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

async function init_player(player_type) {
  if (player_type && player_ver && media_url) {
    update_player(player_type, player_ver);
    await new Promise((r) => setTimeout(r, 2000));
    if (player_type == "shaka") {
      initShaka();
    } else if (player_type == "dashjs") {
      initDash();
    }
  } else {
    console.error('Missing some of the parameters: "player", "player_ver" or "url".');
  }
}
