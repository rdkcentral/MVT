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

function create_url(open_url) {
  let stream = document.getElementById("Stream").value;
  if (stream == "") {
    alert("Stream URL cannot be empty.");
    return false;
  }
  let player = document.getElementById("Player").value;
  let autoplay = document.getElementById("Autoplay").checked;
  let drm = document.getElementById("DRM").value == "" ? "" : `&drm=${document.getElementById("DRM").value}`;
  let licenseUrl = document.getElementById("License").value;
  let licenseHeader = document.getElementById("LicenseHeader").value;
  if (drm != "") {
    if (licenseUrl == "") {
      alert("License URL cannot be empty, when DRM selected.");
      return false;
    } else {
      licenseUrl = "&drm_license=" + licenseUrl;
    }
    if (licenseHeader != "") {
      licenseHeader = "&drm_header=" + licenseHeader;
    }
  }
  let url = `http://10.42.0.1:8080/anyplayer/?autoplay=${autoplay}&player=${player}&url=${stream}${drm}${licenseUrl}${licenseHeader}`;
  console.log(url);

  if (open_url == true) {
    window.location.href = url;
  } else {
    let resultUrl = document.getElementById("resultUrl");
    resultUrl.innerHTML = url;
    resultUrl.rows = Math.round(url.length / 125);
    let output_div = document.getElementById("output_div");
    output_div.className = "d-block";
    resultUrl.focus();
    resultUrl.select();
    document.execCommand('copy');
  }
}

function showDRMopt() {
  let drm_container = document.getElementById("drm_container");
  let license = document.getElementById("License");
  if (DRM.value == "") {
    license.required = false;
    license.value = "";
    document.getElementById("LicenseHeader").value = "";
    drm_container.className = "d-none";
  } else {
    license.required = true;
    drm_container.className = "d-block";
  }
}

function playPauseVideo() {
  let video = document.getElementById("video");
  if (video.paused) {
    video.play();
    console.log("PLAY video");
  } else {
    video.pause();
    console.log("PAUSE video");
  }
}

function seekVideo(type, sec) {
  let video = document.getElementById("video");
  if (type == "relative") {
    video.currentTime = video.currentTime + sec;
    let direction = sec < 0 ? "backward" : "forward";
    console.log(`SEEK video ${direction} ${sec}s`);
  } else {
    video.currentTime = sec;
    console.log(`SEEK video to ${sec}s`);
  }
}

function getQueryVariable(variable) {
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

function setPlaybackRate(rate) {
  document.querySelector("video").playbackRate = rate;
}

function update_config_from_url() {
  let StreamElem = document.getElementById("Stream");
  StreamElem.value = mediaUrl;
  let PlayerElem = document.getElementById("Player");
  PlayerElem.value = playerType;
  let AutoplayElem = document.getElementById("Autoplay");
  AutoplayElem.checked = autoplay;
  let drmElem = document.getElementById("DRM");
  drmElem.value = drm;
  if (drm != "") {
    document.getElementById("drm_container").className = "d-block";
    let LicenseElem = document.getElementById("License");
    LicenseElem.required = true;
    LicenseElem.value = drm_license;
    let LicenseHeaderElem = document.getElementById("LicenseHeader");
    LicenseHeaderElem.value = drm_header;
    LicenseHeaderElem.rows = drm_header.length == 0 ? 1 : Math.round(drm_header.length / 120);
  }
}

let mediaUrl = getQueryVariable("url");
if (!mediaUrl) {
  console.warn("Parameter 'url' not provided, setting default: '/test-materials/dash/fmp4_h264_aac/manifest.mpd'");
  mediaUrl = "/test-materials/dash/fmp4_h264_aac/manifest.mpd";
}

let playerType = getQueryVariable("player");
if (!playerType) {
  console.warn("Parameter 'player' not provided, setting default: 'dashjs'");
  playerType = "dashjs";
} else {
  playerType = playerType.toLowerCase();
}

let playerVer = getQueryVariable("player_ver");
if (!playerVer) {
  console.warn(`Parameter 'player_ver' not provided, setting default: '${Players[playerType]["default"]}'`);
  playerVer = Players[playerType]["default"];
}

let autoplay = getQueryVariable("autoplay");
if (autoplay == "false") {
  autoplay = false;
} else {
  autoplay = true;
}

let drm = getQueryVariable("drm");
let drmSystem = ""
if (!drm) {
  drm = "";
} else {
  drm = drm.charAt(0).toUpperCase() + drm.slice(1).toLowerCase(); // Capitalize drm to match options in HTML
  if (drm == "Widevine") { drmSystem = "com.widevine.alpha" }
  if (drm == "Playready") { drmSystem = "com.microsoft.playready" }
}
let drm_license = getQueryVariable("drm_license");
if (!drm_license) { drm_license = ""; }
let drm_header = getQueryVariable("drm_header");
if (!drm_header) { drm_header = ""; }


function showConfig() {
  document.getElementById("examples-tab").className = "tab-pane fade"
  document.getElementById("config-tab").className = "tab-pane fade show active"
  document.getElementById("config-btn").classList.add("active")
  document.getElementById("examples-btn").classList.remove("active")
}

function showExamples() {
  document.getElementById("examples-tab").className = "tab-pane fade show active"
  document.getElementById("config-tab").className = "tab-pane fade"
  document.getElementById("config-btn").classList.remove("active")
  document.getElementById("examples-btn").classList.add("active")
}

function switchActiveTab() {
  if (navigator.platform == "Linux aarch64") {
    showExamples();
  }
}

function appendFocus() {
  var script = document.createElement("script");
  script.src = "../js_mse_eme/harness/focusManager.js"
  script.defer = script.async = true;
  document.head.appendChild(script);
}
