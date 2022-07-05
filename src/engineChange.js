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
      "2.5.20": ["https://ajax.googleapis.com/ajax/libs/shaka-player/2.5.20/shaka-player.compiled.js"],
      "3.0.1": ["https://ajax.googleapis.com/ajax/libs/shaka-player/3.0.1/shaka-player.compiled.js"],
      "3.2.1": ["https://ajax.googleapis.com/ajax/libs/shaka-player/3.2.1/shaka-player.compiled.js"],
    },
    name: "Shaka Player",
    defaultVersion: "3.2.1",
  },
  dashjs: {
    versions: {
      "2.9.3": ["https://cdn.dashjs.org/v2.9.3/dash.all.min.js", "https://cdn.dashjs.org/v2.9.3/dash.mss.min.js"],
      "3.1.1": ["https://cdn.dashjs.org/v3.1.1/dash.all.min.js", "https://cdn.dashjs.org/v3.1.1/dash.mss.min.js"],
      latest: ["https://cdn.dashjs.org/latest/dash.all.min.js", "https://cdn.dashjs.org/latest/dash.mss.min.js"],
    },
    name: "Dash.JS",
    defaultVersion: "latest",
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
        script.async = script.defer = true;
        script.onload = function () {
          scriptSources.shift();
          loadNextScript();
        };
        document.head.appendChild(script);
      }
    })();
  }
}

loadStoredEngine();
