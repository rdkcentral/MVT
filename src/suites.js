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

function makeMvtMediaTests(testTemplate, engine, streams, mandatory = true, timeout = TestBase.timeout) {
  let tests = [];
  streams.forEach((stream) => {
    tests.push(new MvtMediaTest(testTemplate, stream, engine, mandatory, timeout));
  });
  return tests;
}

class UnstableTest {
  constructor(testTemplate, stream, reason) {
    this.testTemplate = testTemplate;
    this.stream = stream;
    this.reason = reason;
  }
}

function markUnstable(mvtTests, unstableList) {
  for (let unstable of unstableList) {
    let test = mvtTests.find(
      (test) =>
        (!unstable.testTemplate || test.testTemplate === unstable.testTemplate) && test.stream === unstable.stream
    );
    let testName = `${test.stream.name} ${test.testTemplate.testName}`;
    if (!test) {
      console.warn(`Failed to find unstable test '${testName}'`);
      continue;
    }
    test.mandatory = false;
    console.info(`Test '${testName}' is optional due to: ${unstable.reason}`);
  }
}

// DASH Shaka
(function () {
  let engine = new ShakaEngine();

  let mvtTests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.CommonAndDRM);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.CommonAndDRM));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.CommonAndDRM));
  // TODO: ONEM-26268 Fix Rate tests
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video, false));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);
  markUnstable(mvtTests, [new UnstableTest(null, MS.DASH.MULTIPERIOD, "ONEM-26036"),
  new UnstableTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, "ONEM-26279")]);

  registerTestSuite("DASH Shaka", makeTests(mvtTests));
})();

// DASH dashjs
(function () {
  let engine = new DashjsEngine();

  let mvtTests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.CommonAndDRM);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.CommonAndDRM));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.CommonAndDRM));
  // TODO: ONEM-26268 Fix Rate tests
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video, false));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);
  markUnstable(mvtTests, [new UnstableTest(null, MS.DASH.MULTIPERIOD, "ONEM-26036")]);

  registerTestSuite("DASH dashjs", makeTests(mvtTests));
})();

// DASH html5
(function () {
  let engine = new Html5Engine();

  let mvtTests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.Common);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.Common));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.Common));
  // TODO: ONEM-26268 Fix Rate tests
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video, false));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);
  markUnstable(mvtTests, [new UnstableTest(null, MS.DASH.MULTIPERIOD, "ONEM-26036")]);

  registerTestSuite("DASH html5", makeTests(mvtTests));
})();

// HLS Shaka
(function () {
  let engine = new ShakaEngine();

  let mvtTests = makeMvtMediaTests(testPlayback, engine, StreamSets.HLS.Common);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPause, engine, StreamSets.HLS.Common));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.HLS.Common));
  // TODO: ONEM-26268 Fix Rate tests
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.HLS.Video, false));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, engine));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.HLS.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("HLS Shaka", makeTests(mvtTests));
})();

// HLS hlsjs
(function () {
  let engine = new HlsjsEngine();

  let mvtTests = makeMvtMediaTests(testPlayback, engine, StreamSets.HLS.Common);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPause, engine, StreamSets.HLS.Common));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.HLS.Common));
  // TODO: ONEM-26268 Fix Rate tests
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.HLS.Video, false));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, engine));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.HLS.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("HLS hlsjs", makeTests(mvtTests));
})();

// HSS html5
(function () {
  let engine = new Html5Engine();

  let mvtTests = [
    new MvtMediaTest(testPlayback, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPause, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    // TODO: ONEM-26268 Fix Rate tests
    new MvtMediaTest(testPlayRate, MS.HSS.FMP4_AVC_AAC_VTT, engine, false),
    new MvtMediaTest(testSubtitles, MS.HSS.FMP4_AVC_AAC_VTT, engine),
  ];

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("HSS html5", makeTests(mvtTests));
})();

// HSS dashjs
(function () {
  let engine = new DashjsEngine();

  let mvtTests = [
    new MvtMediaTest(testPlayback, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPlayback, MS.HSS.PLAYREADY_2_0, engine),
    new MvtMediaTest(testPause, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPause, MS.HSS.PLAYREADY_2_0, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.PLAYREADY_2_0, engine),
    // TODO: ONEM-26268 Fix Rate tests
    new MvtMediaTest(testPlayRate, MS.HSS.FMP4_AVC_AAC_VTT, engine, false),
    new MvtMediaTest(testPlayRate, MS.HSS.PLAYREADY_2_0, engine, false),
  ];

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("HSS dashjs", makeTests(mvtTests));
})();

// Progressive html5
(function () {
  let engine = new Html5Engine();

  let mvtTests = makeMvtMediaTests(testPlayback, engine, StreamSets.Progressive.Common);
  // TODO: ONEM-????? Fix progressive pause tests
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPause, engine, StreamSets.Progressive.Common, false));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.Progressive.Common));
  // TODO: ONEM-26268 Fix Rate tests
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.Progressive.Video, false));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.Progressive.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("Progressive html5", makeTests(mvtTests));
})();
