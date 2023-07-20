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

async function initShaka(video) {
  // Initialize Shaka player engine
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
  // Initialize Dash.js player engine
  const player = dashjs.MediaPlayer().create();
  window.player = player;
  player.initialize(video, mediaUrl, false);
  if (drm == "Widevine" || drm == "Playready") {
    if (drm_header == "") {
      player.setProtectionData({
        [drmSystem]: {
          serverURL: drm_license,
        },
      });
    } else {
      player.setProtectionData({
        [drmSystem]: {
          serverURL: drm_license,
          httpRequestHeaders: {
            "X-AxDRM-Message": drm_header,
          },
        },
      });
    }
  }
}

function initHLS(video) {
  // Initialize HLS.js player engine
  let config = "";
  if (drm == "Widevine") {
    config = {
      widevineLicenseUrl: drm_license,
      emeEnabled: true,
    };
  }
  if (drm == "Playready") {
    alert("Playready is not supported on HLS.js player.");
    console.error("Playready is not supported on HLS.js player.");
  }
  const player = new Hls(config);
  window.player = player;
  player.loadSource(mediaUrl);
  player.attachMedia(video);
}

function initNative(video) {
  // Attach stream URL to the video tag
  if (drm != "") {
    alert("Native player is not supporting DRM.");
    console.error("Native player is not supporting DRM.");
  } else {
    video.src = mediaUrl;
    window.player = video;
  }
}

function initPlayer() {
  const video = document.getElementById("video");
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
  // parameters displayed in the small window next to the video (refresh every 500ms):
  setInterval(function () {
    let quality = video.getVideoPlaybackQuality();
    let log = `current time: <span class="text-light">${video.currentTime.toFixed(1)} s</span><br>`;
    log += `total frames: <span class="text-light">${quality.totalVideoFrames}</span><br>`;
    log += `dropped frames: <span class="text-light">${quality.droppedVideoFrames}</span><br>`;
    log += `corrupted frames: <span class="text-light">${quality.corruptedVideoFrames}</span><br>`;
    log += `playback rate: <span class="text-light">${video.playbackRate}</span>`;
    document.getElementById("log").innerHTML = log;
  }, 500);
}
