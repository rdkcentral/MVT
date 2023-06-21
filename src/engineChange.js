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

var EngineVersions = {
  shaka: {
    versions: {
      "3.0.1": ["https://ajax.googleapis.com/ajax/libs/shaka-player/3.0.1/shaka-player.compiled.js"],
      "3.2.1": ["https://ajax.googleapis.com/ajax/libs/shaka-player/3.2.1/shaka-player.compiled.js"],
      "4.3.6": ["https://ajax.googleapis.com/ajax/libs/shaka-player/4.3.6/shaka-player.compiled.js"],
    },
    name: "Shaka Player",
    defaultVersion: "3.2.1",
  },
  dashjs: {
    versions: {
      "3.1.1": ["https://cdn.dashjs.org/v3.1.1/dash.all.min.js", "https://cdn.dashjs.org/v3.1.1/dash.mss.min.js"],
      "4.4.0": ["https://cdn.dashjs.org/v4.4.0/dash.all.min.js", "https://cdn.dashjs.org/v4.4.0/dash.mss.min.js"],
      "4.7.0": ["https://cdn.dashjs.org/v4.7.0/dash.all.min.js", "https://cdn.dashjs.org/v4.7.0/dash.mss.min.js"],
      latest: ["https://cdn.dashjs.org/latest/dash.all.min.js", "https://cdn.dashjs.org/latest/dash.mss.min.js"],
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

function loadStoredEngine() {
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

      var scriptSources = engine.versions[engine.defaultVersion];
      (function loadNextScript() {
        if (scriptSources.length) {
          var script = document.createElement("script");
          script.src = scriptSources[0];
          script.defer = true;
          script.onload = function () {
            scriptSources.shift();
            loadNextScript();
          };
          document.head.appendChild(script);
        }
      })();
    }
  }
}

loadStoredEngine();
