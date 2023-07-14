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
    versions: ["2.9.3", "3.2.1", "4.0.0", "4.4.0", "latest"],
    default: "4.4.0",
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
  }
};

function updatePlayer(playerType, playerVer) {
  if (playerType in Players && playerType != "native") {
    let scriptUrl = "";
    playerVer = playerType == "dashjs" ? `v${playerVer}` : playerVer;
    if (playerVer.includes("latest")) {
      playerVer = "latest";
    }
    scriptUrl = `${Players[playerType]["url_pref"]}${playerVer}${Players[playerType]["url_suff"]}`;
    let head = document.getElementsByTagName("head")[0];
    let script = document.createElement("script");
    script.src = scriptUrl;
    head.append(script);
  }
}

async function initShaka(video) {
  const player = new shaka.Player(video);
  if (!shaka.polyfill.installed) {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();
    shaka.polyfill.installed = true;
  }
  if (drm == "Widevine" || drm == "Playready") {
    player.configure({
      drm: {
        servers: {
          [drmSystem]: drm_license,
        },
        advanced: {
          "com.widevine.alpha": {
            videoRobustness: "SW_SECURE_CRYPTO",
            audioRobustness: "SW_SECURE_CRYPTO",
          },
        },
      },
    });
  }
  window.player = player;
  player.addEventListener("error", onErrorEvent);
  try {
    await player.load(mediaUrl);
  } catch (e) {
    onError(e);
  }
  if (drm_header != "") {
    player.getNetworkingEngine().registerRequestFilter(function (type, request) {
      if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
        request.headers["X-AxDRM-Message"] = drm_header;
      }
    });
  }
}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(error) {
  console.error("Error code", error.code, "object", error);
}

function initDash(video) {
  const player = dashjs.MediaPlayer().create();
  window.player = player;
  player.initialize(video, mediaUrl, false);
  if (drm == "Widevine" || drm == "Playready") {
    if (drm_header == "") {
      player.setProtectionData({
        [drmSystem]: {
          serverURL: drm_license,
        }
      });
    } else {
      player.setProtectionData({
        [drmSystem]: {
          serverURL: drm_license,
          httpRequestHeaders: {
            "X-AxDRM-Message": drm_header,
          }
        }
      });
    }
  }
}

function initHLS(video) {
  let config = "";
  if (drm == "Widevine") {
    config = {
      widevineLicenseUrl: drm_license,
      emeEnabled: true,
    };
  }
  if (drm == "Playready") {
    alert("Playready is not supported on HLS.js");
    console.log("Playready is not supported on HLS.js");
  }
  const player = new Hls(config);
  window.player = player;
  player.loadSource(mediaUrl);
  player.attachMedia(video);
}

function initNative(video) {
  video.src = mediaUrl;
  window.player = video;
}

function initPlayer() {
  const video = document.getElementById('video');
  if (playerType == "shaka") {
    initShaka(video);
  } else if (playerType == "dashjs") {
    initDash(video);
  } else if (playerType == "hlsjs") {
    initHLS(video);
  } else if (playerType == "native") {
    initNative(video);
  } else {
    console.error(`Player '${playerType}' is not available. Choose one from the list: ${playerList}`);
  }
  setInterval( function () {
    let quality = video.getVideoPlaybackQuality();
    let log = `current time: <span class="text-light">${(video.currentTime).toFixed(1)} s</span><br>`;
    log += `total frames: <span class="text-light">${quality.totalVideoFrames}</span><br>`;
    log += `dropped frames: <span class="text-light">${quality.droppedVideoFrames}</span><br>`;
    log += `corrupted frames: <span class="text-light">${quality.corruptedVideoFrames}</span><br>`;
    log += `playback rate: <span class="text-light">${video.playbackRate}</span>`;
    document.getElementById("log").innerHTML = log;
  }, 667);
}

function add_players() {
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
