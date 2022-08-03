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

function setSourceUrl() {
  let urlInput = document.getElementById("url_input").value;
  window.location.replace(`?player=${playerType}&player_ver=${playerVer}&url=${urlInput}`);
}

function updatePlayer(playerType, playerVer) {
  if (playerType in Players) {
    let scriptUrl = "";
    playerVer = playerType == "dashjs" ? `v${playerVer}` : playerVer;
    if (playerVer.includes("latest")) {
      playerVer = "latest"
    }
    scriptUrl = `${Players[playerType]["url_pref"]}/${playerVer}/${Players[playerType]["url_suff"]}`;
    addScript(scriptUrl);
  }
}

function addScript(src) {
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = src;
  head.appendChild(script);
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
    await player.load(mediaUrl);
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
  const video = document.querySelector("video");
  const player = dashjs.MediaPlayer().create();
  window.player = player;
  player.initialize();
  player.attachView(video);
  player.attachSource(mediaUrl);
}

function initPlayer() {
  if (playerType == "shaka") {
    initShaka();
  } else if (playerType == "dashjs") {
    initDash();
  } else {
    console.error(`Player '${playerType}' is not available. Choose one from the list: ${playerList}`);
  }
}
