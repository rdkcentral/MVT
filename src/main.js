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

const MVT_VERSION = "v2.13.0";

document.getElementById("mvt_version").innerHTML = MVT_VERSION;

let debug = getQueryVariable("debug");
let shakaPlayerScript;
let dashjsPlayerScript;

if (debug == "true") {
  shakaPlayerScript = "shaka-player.compiled.debug.js";
  dashjsPlayerScript = "dash.all.debug.js";
} else {
  shakaPlayerScript = "shaka-player.compiled.js";
  dashjsPlayerScript = "dash.all.min.js";
}

var EngineVersions = {
  shaka: {
    versions: {
      // mux.js is required by Shaka Player to support MPEG-2 TS
      "3.0.1": [
        "https://cdnjs.cloudflare.com/ajax/libs/mux.js/6.3.0/mux.min.js",
        `https://ajax.googleapis.com/ajax/libs/shaka-player/3.0.1/${shakaPlayerScript}`,
      ],
      "3.2.1": [
        "https://cdnjs.cloudflare.com/ajax/libs/mux.js/6.3.0/mux.min.js",
        `https://ajax.googleapis.com/ajax/libs/shaka-player/3.2.1/${shakaPlayerScript}`,
      ],
      "4.3.6": [
        "https://cdnjs.cloudflare.com/ajax/libs/mux.js/6.3.0/mux.min.js",
        `https://ajax.googleapis.com/ajax/libs/shaka-player/4.3.6/${shakaPlayerScript}`,
      ],
    },
    name: "Shaka Player",
    defaultVersion: "3.2.1",
  },
  dashjs: {
    versions: {
      "3.1.1": [`https://cdn.dashjs.org/v3.1.1/${dashjsPlayerScript}`, "https://cdn.dashjs.org/v3.1.1/dash.mss.min.js"],
      "4.4.0": [`https://cdn.dashjs.org/v4.4.0/${dashjsPlayerScript}`, "https://cdn.dashjs.org/v4.4.0/dash.mss.min.js"],
      "4.7.0": [`https://cdn.dashjs.org/v4.7.0/${dashjsPlayerScript}`, "https://cdn.dashjs.org/v4.7.0/dash.mss.min.js"],
      latest: [`https://cdn.dashjs.org/latest/${dashjsPlayerScript}`, "https://cdn.dashjs.org/latest/dash.mss.min.js"],
    },
    name: "Dash.JS",
    defaultVersion: "4.7.0",
  },
  hlsjs: {
    versions: {
      "1.0.0": ["https://cdn.jsdelivr.net/npm/hls.js@1.0.0"],
      "1.2.1": ["https://cdn.jsdelivr.net/npm/hls.js@1.2.1"],
      "1.3.0": ["https://cdn.jsdelivr.net/npm/hls.js@1.3.0"],
      "1.4.5": ["https://cdn.jsdelivr.net/npm/hls.js@1.4.5"],
    },
    name: "HLS.js",
    defaultVersion: "1.4.5",
  },
};

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

var engineSources = [];
for (var engineId in EngineVersions) {
  if (window.location.search.includes(engineId)) {
    var engine = EngineVersions[engineId];
    var queryVariable = getQueryVariable("engine_" + engineId);
    if (queryVariable) {
      // if engine version is provided but it does not exist in 'EngineVersions', replace it to the default value:
      if (engine.versions[queryVariable] === undefined) {
        console.warn(
          `${engineId} player version '${queryVariable}' is not available, it has been set to default: '${engine.defaultVersion}'`
        );
        window.history.pushState("", "", window.location.search.replace(`&engine_${engineId}=${queryVariable}`, ""));
        // remove version parameter from the url if the provided version is the default one:
      } else if (queryVariable === engine.defaultVersion) {
        window.history.pushState("", "", window.location.search.replace(`&engine_${engineId}=${queryVariable}`, ""));
      } else {
        engine.defaultVersion = queryVariable;
      }
    }
    console.log("Engine : " + engine.name + " : " + engine.defaultVersion);
    engineSources = engine.versions[engine.defaultVersion];
  }
}

// Do NOT Change the order of the scripts!
var libSources = [
  "js_mse_eme/harness/util.js",
  "js_mse_eme/harness/constants.js",
  "js_mse_eme/harness/key.js",
  "js_mse_eme/harness/logger.js",
  "js_mse_eme/harness/xhr.js",
  "js_mse_eme/harness/timeout.js",
  "js_mse_eme/harness/testView.js",
  "js_mse_eme/harness/compactTestList.js",
  "js_mse_eme/harness/compactTestView.js",
  "js_mse_eme/harness/test.js",
  "js_mse_eme/lib/codecs/vp9Codec.js",
  "js_mse_eme/lib/codecs/av1Codec.js",
  "js_mse_eme/lib/mse/msutil.js",
  "js_mse_eme/lib/mse/mediaSourcePortability.js",
  "js_mse_eme/harness/focusManager.js",
  "test-materials/js/countdown-de.js",
  "test-materials/js/countdown-en.js",
  "test-materials/js/countdown-fr.js",
  "test-materials/js/countdown-es.js",
  "src/constants.js",
  "src/common.js",
  "src/mediaStreams.js",
  "src/mvtTest.js",
  "src/profiles.js",
  "src/engines.js",
  "src/mediaTests.js",
  "src/suites.js",
  "js_mse_eme/harness/main.js",
];

var scriptSources = engineSources.concat(libSources);

function loadScriptsSequentially(scripts, index) {
  if (index < scripts.length) {
    var script = document.createElement("script");
    script.src = scripts[index];
    script.defer = script.async = true;
    script.onload = function () {
      loadScriptsSequentially(scripts, index + 1);
    };
    document.head.appendChild(script);
  } else {
    startMseTest(testVersion);
  }
}

loadScriptsSequentially(scriptSources, 0);
