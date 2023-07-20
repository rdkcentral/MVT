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
  // function is getting all the inputs from the site and creating url with these parameters
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
    if (player == "native") {
      alert("Native player is not supporting DRM.");
      return false;
    }
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
  let url = `http://mvt.onemw.net/anyplayer/?autoplay=${autoplay}&player=${player}&url=${stream}${drm}${licenseUrl}${licenseHeader}`;
  console.log(url);

  if (open_url == true) {
    // option for "Apply config" button, only changing url
    window.location.href = url;
  } else {
    // option for "Generate URL and copy to clipboard" button,
    // it is showing URL to user with copy to clipboard
    let resultUrl = document.getElementById("resultUrl");
    resultUrl.innerHTML = url;
    resultUrl.rows = Math.round(url.length / 125);
    let output_div = document.getElementById("output_div");
    output_div.className = "d-block";
    resultUrl.focus();
    resultUrl.select();
    document.execCommand("copy");
  }
}

function showDRMopt() {
  // function for showing/hiding additional inputs for DRM license
  let drm_container = document.getElementById("drm_container");
  let license = document.getElementById("License");
  if (DRM.value == "") {
    license.required = false;
    license.value = "";
    document.getElementById("LicenseHeader").value = "";
    drm_container.className = "d-none"; // hide input element
  } else {
    license.required = true;
    drm_container.className = "d-block"; // show input element
  }
}

function playPauseVideo() {
  // function for playing/pausing the video
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
  // function for seeking video, type can be 'relative' or 'absolute'
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

function setPlaybackRate(rate) {
  // function for setting playback speed
  document.getElementById("video").playbackRate = rate;
  console.log(`Set playback rate = x${rate}`);
}

function update_config_from_url() {
  // function for inserting values from url to the inputs on the config page
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

function showConfig() {
  // function for switching tab from 'Examples' to 'Configuration'
  document.getElementById("examples-tab").className = "tab-pane fade";
  document.getElementById("config-tab").className = "tab-pane fade show active";
  document.getElementById("config-btn").classList.add("active");
  document.getElementById("examples-btn").classList.remove("active");
}

function showExamples() {
  // function for switching tab from 'Configuration' to 'Examples'
  document.getElementById("examples-tab").className = "tab-pane fade show active";
  document.getElementById("config-tab").className = "tab-pane fade";
  document.getElementById("config-btn").classList.remove("active");
  document.getElementById("examples-btn").classList.add("active");
}
