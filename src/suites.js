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

/*
 * This file declares test suites, which can be selected from main UI or via |test_type| URL parameter.
 * Suite's tests subset depends on selected profile (see profiles.js::filterUnsupportedOnProfile).
 */

"use strict";

function makeMvtMediaTests(testTemplate, engine, streams, Unstable = null, timeout = TestBase.timeout) {
  let tests = [];
  streams.forEach((stream) => {
    tests.push(new MvtMediaTest(testTemplate, stream, engine, Unstable, timeout));
  });
  return tests;
}

function filterSkipTests(skipTests, tests) {
  if (Object.keys(skipTests).length > 0) {
    for (var test in tests) {
      if (tests[test]["testCaseName"] in skipTests) {
        console.log(`'${tests[test]["testCaseName"]}' is hidden due to: '${skipTests[tests[test]["testCaseName"]]}'`);
        delete tests[test];
      }
    }
  }
  return tests;
}

(function () {
  const testSuite = "Codec Support";

  let tests = [];

  for (let codec of SelectedProfile.codecs) {
    for (let container of CONTAINER_MAPPING[codec]) {
      let unstable = undefined;
      if (container === V_MP2T || container === V_MKV || container === V_MOV) {
        unstable = new Unstable(`IsTypeSupported returns incorrect value for container ${container}`);
      }
      tests.push(
        new MvtTest(
          makeVideoCanPlayTest(codec, container, MIME_TYPE_MAPPING[codec]),
          `CanPlay_${container.replace("/", "_")}_${codec}`
        )
      );
      tests.push(
        new MvtTest(
          makeIsTypeSupportedTest(codec, container, MIME_TYPE_MAPPING[codec]),
          `IsTypeSupported_${container.replace("/", "_")}_${codec}`,
          unstable
        )
      );
    }
  }
  // Group tests by category (CanPlay/IsTypeSupported)
  tests.sort((a, b) => a.testTemplate.name.localeCompare(b.testTemplate.name));
  registerTestSuite(testSuite, makeTests(tests));
})();
window.testSuiteVersions[testVersion]["config"]["defaultTestSuite"] = "codec-support-test";

(function () {
  const testSuite = "DASH shaka";
  let engine = new ShakaEngine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};
  StreamSets.DASH.shaka = StreamSets.DASH.CommonAndDRM.filter((stream) => {
    return (
      stream != MS.DASH.FMP4_MP3 && // ONEM-29179
      stream != MS.DASH.DYNAMIC // ONEM-28228
    );
  });

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.CommonAndDRM);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.CommonAndDRM));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.shaka));
  tests.push(new MvtMediaTest(testSetPosition, MS.DASH.FMP4_MP3, engine, new Unstable("ONEM-29179")));
  tests.push(new MvtMediaTest(testSetPosition, MS.DASH.DYNAMIC, engine, new Unstable("ONEM-28228")));
  tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine, new Unstable("ONEM-26279"), 40000));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));
  tests = tests.concat(makeMvtMediaTests(testPerformance, engine, StreamSets.DASH.Performance));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "DASH dashjs";
  let engine = new DashjsEngine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};
  StreamSets.DASH.dashjs = StreamSets.DASH.CommonAndDRM.filter((stream) => {
    return (
      stream != MS.DASH.MULTIPERIOD // ONEM-31620
    );
  });

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.CommonAndDRM);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.CommonAndDRM));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.dashjs));
  tests.push(new MvtMediaTest(testSetPosition, MS.DASH.MULTIPERIOD, engine, new Unstable("ONEM-31620")));
  tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine, null, 40000));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));
  tests = tests.concat(makeMvtMediaTests(testPerformance, engine, StreamSets.DASH.Performance));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "DASH html5";
  let engine = new Html5Engine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.Common);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.Common));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.Common));
  // tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.html5, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine, null, 40000));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HLS shaka";
  let engine = new ShakaEngine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.HLS.CommonAndDRM);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.HLS.CommonAndDRM));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.HLS.CommonAndDRM));
  tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.HLS.Video));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, engine, null, 40000));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.HLS.Subtitles));
  tests = tests.concat(makeMvtMediaTests(testPerformance, engine, StreamSets.HLS.Performance));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HLS hlsjs";
  let engine = new HlsjsEngine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.HLS.CommonAndDRM);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.HLS.CommonAndDRM));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.HLS.CommonAndDRM));
  // TODO: ONEM-26268 Fix Rate tests
  tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.HLS.Video));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, engine, null, 40000));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.HLS.Subtitles));
  tests = tests.concat(makeMvtMediaTests(testPerformance, engine, StreamSets.HLS.Performance));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HSS html5";
  let engine = new Html5Engine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};

  let tests = [
    new MvtMediaTest(testPlayback, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPause, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPlayRate, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testSubtitles, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPerformance, MS.HSS.FMP4_AVC_AAC_VTT_PLAYBACK_START_TIME, engine),
  ];

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HSS dashjs";
  let engine = new DashjsEngine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};

  let tests = [
    new MvtMediaTest(testPlayback, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPause, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPlayRate, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPerformance, MS.HSS.FMP4_AVC_AAC_VTT_PLAYBACK_START_TIME, engine),
  ];

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "Progressive html5";
  let engine = new Html5Engine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.Progressive.Common);
  tests.push(new MvtMediaTest(testPlayback, MS.PROG.MKV_EAC3, engine));
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.Progressive.Common));
  tests.push(new MvtMediaTest(testPause, MS.PROG.MKV_EAC3, engine));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.Progressive.Common));
  tests.push(new MvtMediaTest(testSetPosition, MS.PROG.MKV_EAC3, engine, new Unstable("ONEM-26126")));
  tests = tests.concat(
    makeMvtMediaTests(testPlayRate, engine, StreamSets.Progressive.Video)
  );
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.Progressive.Subtitles));
  tests = tests.concat(makeMvtMediaTests(testPerformance, engine, StreamSets.Progressive.Performance));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

var LONG_DUR_VIDEO_TIMEOUT_MS = 2*60*60*1000;

(function () {
  const testSuite = "Long Duration Progressive";
  let engine = new Html5Engine();
  let skipTests = {};

  let tests = makeMvtMediaTests(testLongDurationVideoPlayback, engine, StreamSets.Progressive.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS);
  tests = tests.concat(makeMvtMediaTests(testLongDurationVideoPause, engine, StreamSets.Progressive.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS));
  tests = tests.concat(makeMvtMediaTests(testLongDurationVideoSetPosition, engine, StreamSets.Progressive.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS));
  tests = tests.concat(makeMvtMediaTests(testLongDurationVideoPlayRate, engine, StreamSets.Progressive.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "Long Duration DASH dashjs";
  let engine = new DashjsEngine();
  let skipTests = {};

  let tests = makeMvtMediaTests(testLongDurationVideoPlayback, engine, StreamSets.DASH.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS);
  tests = tests.concat(makeMvtMediaTests(testLongDurationVideoPause, engine, StreamSets.DASH.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS));
  tests = tests.concat(makeMvtMediaTests(testLongDurationVideoSetPosition, engine, StreamSets.DASH.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS));
  tests = tests.concat(makeMvtMediaTests(testLongDurationVideoPlayRate, engine, StreamSets.DASH.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "Long Duration HLS shaka";
  let engine = new ShakaEngine();
  let skipTests = {};

  let tests = makeMvtMediaTests(testLongDurationVideoPlayback, engine, StreamSets.HLS.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS);
  tests = tests.concat(makeMvtMediaTests(testLongDurationVideoPause, engine, StreamSets.HLS.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS));
  tests = tests.concat(makeMvtMediaTests(testLongDurationVideoSetPosition, engine, StreamSets.HLS.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS));
  tests = tests.concat(makeMvtMediaTests(testLongDurationVideoPlayRate, engine, StreamSets.HLS.LongDuration, null, LONG_DUR_VIDEO_TIMEOUT_MS));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();
