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

/*
 * Implementation of |Codec Support Tests| suite.
 * Test uses |video.canPlayType| and |MediaSource.isTypeSupported| standard JS APIs to verify if browser *declares*
 * support of a given codec. Please note that these functions do not verify actual playback, which may, or may not
 * work regardless of the checks outcome, but in principle, browser's response should match its playback capabilities.
 *
 * The test registration in js_mse_eme's framework is a bit tricky. |CodecsupportTest| is a global function, which will
 * be called by the |js_mse_eme/harness/main.js:loadTests| during page loading. The |loadTests| gets the test function
 * name from test suite identifier (codecsupport-test), so they may not be changed separately.
 */
var CodecsupportTest = function () {
  var tests = {};
  var info = "Default Timeout: " + TestBase.timeout + "ms";

  var fields = ["passes", "failures", "timeouts"];

  function checkMime(runner, video, mime, fullMime) {
    runner.log("checking " + fullMime);
    var baseCanPlayType = video.canPlayType(mime);
    runner.assert(
      baseCanPlayType == "maybe",
      "canPlayType should be maybe for " + mime + " but was " + baseCanPlayType
    );

    var canPlayType = video.canPlayType(fullMime);
    runner.assert(canPlayType == "probably", "canPlayType should be probably for " + fullMime);
    var isTypeSupported = MediaSource.isTypeSupported(fullMime);
    runner.assert(isTypeSupported, "Media source should be true for " + fullMime);
  }

  function createMimeTest(index, codec, baseMime, fullMime) {
    var testId = "0.0.0." + i;
    var test = createMvtTest(tests, testId, baseMime, 1, fullMime + "(" + codec + ")");
    test.prototype.title = "Check canPlayType and isTypeSupported " + fullMime;
    test.prototype.start = function (runner, video) {
      checkMime(runner, video, baseMime, fullMime);

      runner.succeed();
    };
  }

  var i = 0;
  var mimeTestedList = [];
  for (const container_ in SelectedProfile.containers) {
    var container = SelectedProfile.containers[container_];

    for (const variant_ in container) {
      if (variant_ == "engine") {
        continue;
      }
      var variant = container[variant_];

      var mimeMapping = {
        mp4: ["video/mp4", "audio/mp4"],
        fragmentedmp4: ["video/mp4", "audio/mp4"],
        cmaf: ["video/mp4", "audio/mp4"],
        webm: ["video/webm", "audio/webm"],
        mpeg2ts: ["video/mp2t", "audio/mp2t"],
        dash: ["application/dash+xml"],
        hls: ["application/vnd.apple.mpegurl"],
        mkv: ["video/x-matroska", "audio/x-matroska"],
      };

      if (!(variant_ in mimeMapping)) continue;

      var codecs = variant.video.concat(variant.audio);
      codecs.forEach((codecName) => {
        var codec = SelectedProfile.codecs[codecName];
        if (codec.can_check === false) {
          return;
        }
        var video = variant.video.includes(codecName);
        var baseMime = mimeMapping[variant_][video ? 0 : 1];
        var fullMime = baseMime + '; codecs="' + codec.codec + '"';
        if (!mimeTestedList.includes(fullMime)) {
          createMimeTest(i, codecName, baseMime, fullMime);
          i += 1;
          mimeTestedList.push(fullMime);
        }
      });
    }
  }

  return { tests: finalizeTests(tests), info: info, fields: fields, viewType: "default" };
};

window.testSuiteDescriptions["codecsupport-test"] = {
  name: "Codec Support Tests",
  title: "Codec Support Tests",
  heading: "Codec Support Tests",
};

window.testSuiteVersions[testVersion]["config"]["defaultTestSuite"] = "codecsupport-test";
window.testSuiteVersions[testVersion].testSuites.push("codecsupport-test");
