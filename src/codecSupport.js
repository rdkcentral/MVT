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

var canDecode = function (format) {
  // avc1.42C01E avc1.4d002a
  var codecSplit = format.codec.split(".");
  var codec = codecSplit[0];
  switch (codec) {
    case "avc1":
      if (codec in SelectedProfile.codecs) {
        var codec_ = SelectedProfile.codecs[codec];
        var supported = codec_.codec.split(".");
        var supportedLevel = parseInt(supported[1], 16);
        var codecLevel = parseInt(codecSplit[1], 16);
        return codecLevel <= supportedLevel ? codec_ : false;
      }
      break;
    case "hvc1":
      codec = "hevc";
      if (codec in SelectedProfile.codecs) {
        var codec_ = SelectedProfile.codecs[codec];
        var supported = codec_.codec.split(".");

        // this is oversimplified
        var supportedLevel = parseInt(supported[3].substring(1));
        var codecLevel = parseInt(codecSplit[3].substring(1));
        return codecLevel <= supportedLevel ? codec_ : false;
      }
      break;
    case "vp09":
      codec = "vp9";
      if (codec in SelectedProfile.codecs) {
        var codec_ = SelectedProfile.codecs[codec];
        var supported = codec_.codec.split(".");

        var supportedProfile = parseInt(supported[1]);
        var profile = parseInt(codecSplit[1]);
        if (profile > supportedProfile) {
          return false;
        }
        var supportedLevel = parseInt(supported[2]);
        var level = parseInt(codecSplit[2]);

        return level <= supportedLevel ? codec_ : false;
      }
      break;
    case "av01":
      if (codec in SelectedProfile.codecs) {
        var codec_ = SelectedProfile.codecs[codec];
        var supported = codec_.codec.split(".");

        var supportedProfile = parseInt(supported[2]);
        var profile = parseInt(codecSplit[2]);
        if (profile > supportedProfile) {
          return false;
        }
        // Check Main vs High
        return supported[2][2] == codecSplit[2][2] || profile[2][2] == "M" ? codec_ : false;
      }
      break;
    case "mp4v":
      codec = "mpeg4part2";
      if (codec in SelectedProfile.codecs) {
        // @note: needs Level verification
        var codec_ = SelectedProfile.codecs[codec];
        return codec_;
      }
      break;
    case "mp4a":
      // All audio codecs get bundled under one label.
      // Iterate over them
      var keys = Object.keys(SelectedProfile.codecs);
      for (const codecName in SelectedProfile.codecs) {
        var codec_ = SelectedProfile.codecs[codecName];
        if (codec_.codec.split(".")[0] == "mp4a") {
          if (codec_.codec == format.codec) {
            return codec_;
          }

          // AAC is backwards compatible, check this compatibility, note there's a lot more variants.
          var aliases = {
            aac: ["mp4a.40.29", "mp4a.40.5", "mp4a.40.2"],
            mp4: ["mp4a.40.34", "mp4a.69", "mp4a.6B"],
          };
          for (var alias in aliases) {
            var c = aliases[alias];
            if (c.includes(format.codec) && c.includes(codec_.codec)) {
              return codec_;
            }
          }
        }
      }
      break;
    default:
      if (codec in SelectedProfile.codecs) {
        var codec_ = SelectedProfile.codecs[codec];
        return codec_;
      }
  }
  return false;
};

var containerAndPlatformSupportsFormat = function (container, format) {
  if (!format) {
    // No track, return supported
    return "none";
  }
  var codec = canDecode(format);
  if (!codec) {
    return false;
  }

  if (container.video && container.video.includes(codec.name)) {
    return codec;
  }
  if (container.audio.includes(codec.name)) {
    return codec;
  }
  return false;
};

var FormatSupported = function (engineConfig, config, media) {
  var codecs = [];
  if (!engineConfig) {
    return false;
  }

  if (media.drm) {
    codecs = Object.keys(media.drm.servers).filter((drm) => engineConfig.drm.includes(drm));
    if (codecs.length == 0) {
      return false;
    }
  }
  if (media.subtitles) {
    var subtitles = media.subtitles.format;
    if (engineConfig.subtitles && engineConfig.subtitles.includes(subtitles)) {
      codecs.push(subtitles);
    }
  }

  var video = containerAndPlatformSupportsFormat(config, media.video);
  if (!video) {
    return false;
  }

  var audio = containerAndPlatformSupportsFormat(config, media.audio);
  if (!audio) {
    return false;
  }
  codecs.push(video.name);
  codecs.push(audio.name);
  return codecs;
};

var GetEngines = function (container, variant) {
  var config = SelectedProfile.containers[container][variant];
  var containerConfig = SelectedProfile.containers[container];
  var engines = SelectedProfile.engine;

  if ("engine" in containerConfig) {
    var currentEngines = engines;
    engines = {};
    Object.keys(containerConfig.engine).forEach((engine) => {
      engines[engine] = Object.assign({}, containerConfig.engine[engine], currentEngines[engine]);
    });
  }

  if ("engine" in config) {
    var currentEngines = engines;
    engines = {};
    Object.keys(config.engine).forEach((engine) => {
      engines[engine] = Object.assign({}, config.engine[engine], currentEngines[engine]);
    });
  }

  return engines;
};

var getEngineForMedia = function (media, engineName, callback) {
  // Get the config
  if (
    !(media.container in SelectedProfile.containers && media.variant in SelectedProfile.containers[media.container])
  ) {
    console.log("Media " + media.container + " and variant " + media.variant + " unsupported");
    return;
  }
  var config = SelectedProfile.containers[media.container][media.variant];
  var engines = GetEngines(media.container, media.variant);

  if (engineName in engines) {
    var engineConfig = engines[engineName];
    var engine = new availableEngines[engineName](engineConfig);

    if (FormatSupported(engineConfig, config, media)) {
      callback(engine);
    }
  }
};

var getEnginesForMedia = function (media, callback) {
  Object.keys(availableEngines).forEach((engineName) => {
    var engine = getEngineForMedia(media, engineName, callback);
  });
};

var selectedConfig = parseParam("profile", null) || window.localStorage["profile"] || DefaultProfile;
if (!(selectedConfig in Profiles)) {
  console.error(
    "Unsupported profile: " +
      selectedConfig +
      ". Available options: " +
      Object.keys(Profiles) +
      ". Selecting 'default' configuration."
  );
  selectedConfig = DefaultProfile;
}

window.localStorage["profile"] = selectedConfig;
window.ConfigString = selectedConfig;
var SelectedProfile = Profiles[selectedConfig];

try {
  if ("device" in window.localStorage) {
    SelectedProfile = JSON.parse(window.localStorage["device"]);
  }
} catch (e) {
  console.error(e);
}

// Copy defaults
if (!("engine" in SelectedProfile)) {
  SelectedProfile.engine = DefaultEngines;
}
if (!("containers" in SelectedProfile)) {
  SelectedProfile.containers = DefaultContainers;
  if (window.localStorage["profile"] != undefined && window.localStorage["profile"] != "All") {
    delete SelectedProfile.containers.hls.engine.html5;
  }
}

// Remove codecs from formats that aren't supported on the platform

for (var container in SelectedProfile.containers) {
  for (var variantName in SelectedProfile.containers[container]) {
    var variant = SelectedProfile.containers[container][variantName];
    ["video", "audio"].forEach((field) => {
      if (field in variant) {
        var codecs = variant[field];
        variant[field] = variant[field].filter((codec) => codec in SelectedProfile.codecs);
      }
    });
  }
}
// Fill in name field for codecs, so we can return data structures
// for (var codec in SelectedProfile.codecs) {
//   SelectedProfile.codecs[codec].name = codec;
// }
