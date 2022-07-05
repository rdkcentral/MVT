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

function CountContent(engine, containerName, variantName, variant) {
  var codecs = {};
  for (const key in MvtMedia) {
    var type = MvtMedia[key];
    type.forEach((media) => {
      if (media.container != containerName || media.variant != variantName) {
        return;
      }

      var formats = FormatSupported(engine, variant, media);
      if (formats) {
        formats.forEach((format) => {
          if (format in codecs) {
            codecs[format] += 1;
          } else {
            codecs[format] = 1;
          }
        });
      }
    });
  }
  return codecs;
}

var unsupportedColor = "#fffae5";
var noContentColor = "#ffebe5";
var someContentColor = "#e3fcef";

function CodecSupport(count, engine, variant, codec) {
  var td = document.createElement("td");
  if (
    !engine ||
    (!(variant.video && variant.video.includes(codec)) &&
      !variant.audio.includes(codec) &&
      !(engine.drm && engine.drm.includes(codec)) &&
      !(engine.subtitles && engine.subtitles.includes(codec)))
  ) {
    td.style["background-color"] = unsupportedColor;
    return td;
  }

  if (!count) {
    td.style["background-color"] = noContentColor;
    count = 0;
  } else {
    td.style["background-color"] = someContentColor;
  }
  td.innerText = count;
  return td;
}

function createAndAdd(parent, tag, content) {
  var child = document.createElement(tag);
  if (content) {
    var text = document.createTextNode(content);
    child.appendChild(text);
  }
  parent.appendChild(child);
  return child;
}

var GenerateCoverage = function () {
  var coverage = document.getElementById("coverage");
  coverage.innerHTML =
    "<p>Coverage Report for " +
    SelectedProfile.profile +
    '</p>\
  <p>This lists how many pieces of test content exist, not if the content pass or fail.</p>\
  <table><tr>\
  <td style="background-color:' +
    unsupportedColor +
    '">Unsupported</td>\
  <td style="background-color:' +
    noContentColor +
    '">Supported, No Content</td>\
  <td style="background-color:' +
    someContentColor +
    '">Supported and number of content in Test Suite</td>\
  </tr></table>\
  Platform:';
  var select = createAndAdd(coverage, "select");
  Object.keys(Profiles).forEach((key) => {
    var option = createAndAdd(select, "option");
    option.value = key;
    option.innerText = key;
    option.selected = key == selectedConfig;
  });
  select.addEventListener("change", (event) => {
    console.log(event.target.value);
    window.localStorage["profile"] = event.target.value;
    location.reload();
  });

  var coverage = createAndAdd(coverage, "div");
  coverage.classList.add("coverage");
  for (const container_ in SelectedProfile.containers) {
    var container = SelectedProfile.containers[container_];
    var top = createAndAdd(coverage, "div");
    top.appendChild(util.createElement("h1", container_, "focusable", container_));
    var table = util.createElement("table", container_ + "_table", "coverage_table");
    top.appendChild(table);
    var audioCodecs = [];
    var videoCodecs = [];
    var drm = [];
    var subtitles = [];
    var note = false;
    for (const variant_ in container) {
      if (variant_ == "engine") {
        continue;
      }
      var variant = container[variant_];
      if (variant.video) {
        videoCodecs = videoCodecs.concat(variant.video);
      }
      audioCodecs = audioCodecs.concat(variant.audio);
      var engines = GetEngines(container_, variant_);
      for (var engine_ in engines) {
        if (engines[engine_].drm) {
          drm = drm.concat(engines[engine_].drm);
        }
      }
      for (var engine_ in engines) {
        if (engines[engine_].subtitles) {
          subtitles = subtitles.concat(engines[engine_].subtitles);
        }
      }
      if (variant.note) {
        note = true;
      }
    }
    var firstCodecs = [audioCodecs[0], videoCodecs[0], drm[0], subtitles[0]];
    // Remove duplicates
    audioCodecs = new Set(audioCodecs);
    videoCodecs = new Set(videoCodecs);
    drm = new Set(drm);
    subtitles = new Set(subtitles);
    var codecs = new Set([...videoCodecs, ...audioCodecs, ...drm, ...subtitles]);

    var firstHeader = createAndAdd(table, "tr");
    var secondHeader = createAndAdd(table, "tr");

    createAndAdd(firstHeader, "th", "Container");
    createAndAdd(secondHeader, "th", "");
    createAndAdd(firstHeader, "th", "Player");
    createAndAdd(secondHeader, "th", "");

    function addCodec(name, codecs) {
      if (codecs.size != 0) {
        var col = createAndAdd(firstHeader, "th", name);
        col.colSpan = codecs.size;
        col.style.borderLeftWidth = "2px";
      }
    }
    addCodec("Video", videoCodecs);
    addCodec("Audio", audioCodecs);
    addCodec("DRM", drm);
    addCodec("Subtitles", subtitles);

    var niceNames = {
      avc1: "H264",
      "com.microsoft.playready": "PlayReady",
      "com.widevine.alpha": "Widevine",
      webvtt: "In-band WebVTT",
      "track-tag-webvtt": "Out-of-band WebVTT",
      ttml: "TTML",
    };

    codecs.forEach((codec) => {
      var transform = "uppercase";
      var name = codec;
      if (codec in niceNames) {
        name = niceNames[codec];
        transform = "none";
      }
      var element = createAndAdd(secondHeader, "th", name);
      if (firstCodecs.includes(codec)) {
        element.style.borderLeftWidth = "2px";
      }
      element.style["text-transform"] = transform;
    });

    if (note) {
      createAndAdd(firstHeader, "th", "Note");
      createAndAdd(secondHeader, "th", "");
    }

    for (const variantName in container) {
      if (variantName == "engine") {
        continue;
      }
      var variant = container[variantName];

      var engines = GetEngines(container_, variantName);

      for (const engine in DefaultEngines) {
        var defEngine = DefaultEngines[engine];
        if (defEngine.exclude && (defEngine.exclude.includes(container_) || defEngine.exclude.includes(variantName))) {
          continue;
        }
        var count = CountContent(engines[engine], container_, variantName, variant);

        var row = createAndAdd(table, "tr");

        createAndAdd(row, "td", variantName);
        createAndAdd(row, "td", engine);

        codecs.forEach((codec) => {
          var element = CodecSupport(count[codec], engines[engine], variant, codec);
          if (firstCodecs.includes(codec)) {
            element.style.borderLeftWidth = "2px";
          }
          row.appendChild(element);
        });
        if (note) {
          createAndAdd(row, "td", variant.note ? variant.note : "");
        }
      }
    }
  }
};

try {
  exports.getTest = GenerateCoverage;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}
