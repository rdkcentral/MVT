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
      if (container === V_MP2T || container === V_MKV) {
        unstable = new Unstable(`IsTypeSupported returns incorrect value for container ${container}`);
      }
      tests.push(
        new MvtTest(makeVideoCanPlayTest(codec, container, MIME_TYPE_MAPPING[codec]), `CanPlay ${container} ${codec}`)
      );
      tests.push(
        new MvtTest(
          makeIsTypeSupportedTest(codec, container, MIME_TYPE_MAPPING[codec]),
          `IsTypeSupported ${container} ${codec}`,
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
  StreamSets.DASH.shaka = StreamSets.DASH.CommonAndDRMext.filter((stream) => {
    return stream != MS.DASH.FMP4_MP3; // ONEM-29179
  });

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.CommonAndDRMext);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.CommonAndDRMext));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.shaka));
  tests.push(new MvtMediaTest(testSetPosition, MS.DASH.FMP4_MP3, engine, new Unstable("ONEM-29179")));
  // tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine, new Unstable("ONEM-26279")));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "DASH dashjs";
  let engine = new DashjsEngine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.CommonAndDRMext);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.CommonAndDRMext));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.CommonAndDRMext));
  // tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "DASH html5";
  let engine = new Html5Engine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};
  StreamSets.DASH.html5 = StreamSets.DASH.Common.filter((stream) => {
    return (
      stream != MS.DASH.WEBM_VP9_OPUS &&
      stream != MS.DASH.DYNAMIC &&
      stream != MS.DASH.FMP4_HEVC_EAC3 &&
      stream != MS.DASH.CMAF_HEVC_AAC
    ); // ONEM-27782
  });

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.html5);
  tests.push(new MvtMediaTest(testPlayback, MS.DASH.WEBM_VP9_OPUS, engine, new Unstable("ONEM-27782")));
  tests.push(new MvtMediaTest(testPlayback, MS.DASH.DYNAMIC, engine, new Unstable("ONEM-27782")));
  tests.push(new MvtMediaTest(testPlayback, MS.DASH.FMP4_HEVC_EAC3, engine));
  tests.push(new MvtMediaTest(testPlayback, MS.DASH.CMAF_HEVC_AAC, engine, new Unstable("ONEM-29170")));

  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.html5));
  tests.push(new MvtMediaTest(testPause, MS.DASH.WEBM_VP9_OPUS, engine, new Unstable("ONEM-27782")));
  tests.push(new MvtMediaTest(testPause, MS.DASH.DYNAMIC, engine, new Unstable("ONEM-27782")));
  tests.push(new MvtMediaTest(testPause, MS.DASH.FMP4_HEVC_EAC3, engine, new Unstable("ONEM-27782")));
  tests.push(new MvtMediaTest(testPause, MS.DASH.CMAF_HEVC_AAC, engine, new Unstable("ONEM-29170")));

  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.html5));
  tests.push(new MvtMediaTest(testSetPosition, MS.DASH.WEBM_VP9_OPUS, engine, new Unstable("ONEM-27782")));
  tests.push(new MvtMediaTest(testSetPosition, MS.DASH.DYNAMIC, engine, new Unstable("ONEM-27782")));
  tests.push(new MvtMediaTest(testSetPosition, MS.DASH.FMP4_HEVC_EAC3, engine));
  tests.push(new MvtMediaTest(testSetPosition, MS.DASH.CMAF_HEVC_AAC, engine, new Unstable("ONEM-29170")));

  // tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.html5, new Unstable("ONEM-26268")));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles, new Unstable("ONEM-27782")));

  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HLS shaka";
  let engine = new ShakaEngine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.HLS.Common);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.HLS.Common));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.HLS.Common));
  // tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.HLS.Video, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, engine));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.HLS.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HLS hlsjs";
  let engine = new HlsjsEngine();
  // in 'skipTests' specify test name as key and reason as value, e.g.: "DASH_FMP4_MP3 Seek": "ONEM-12345"
  let skipTests = {};

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.HLS.Common);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.HLS.Common));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.HLS.Common));
  // TODO: ONEM-26268 Fix Rate tests
  // tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.HLS.Video, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, engine));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.HLS.Subtitles));

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
    // new MvtMediaTest(testPlayRate, MS.HSS.FMP4_AVC_AAC_VTT, engine, new Unstable("ONEM-26268")),
    new MvtMediaTest(testSubtitles, MS.HSS.FMP4_AVC_AAC_VTT, engine),
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
    new MvtMediaTest(testPlayback, MS.HSS.PLAYREADY_2_0, engine),
    new MvtMediaTest(testPause, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPause, MS.HSS.PLAYREADY_2_0, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.PLAYREADY_2_0, engine),
    // new MvtMediaTest(testPlayRate, MS.HSS.FMP4_AVC_AAC_VTT, engine, new Unstable("ONEM-26268")),
    // new MvtMediaTest(testPlayRate, MS.HSS.PLAYREADY_2_0, engine, new Unstable("ONEM-26268")),
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
  // tests = tests.concat(
  //   makeMvtMediaTests(testPlayRate, engine, StreamSets.Progressive.Video, new Unstable("ONEM-26268"))
  // );
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.Progressive.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);
  tests = filterSkipTests(skipTests, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();
