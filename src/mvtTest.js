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

/**
 * This file overrides or redeclares stuff from js_mse_eme/harness/test.js
 * Implements tests generation and results gathering.
 */

"use strict";

function createMvtTest(tests, testId, category, categorySort, name, mandatory = true) {
  if (isTestOptional(name)) {
    mandatory = false;
    console.log("Test " + name + " is not mandatory");
  }
  var t = createTest(name, category, mandatory, testId, category + " Tests");
  t.prototype.index = tests.length;
  if (!(categorySort in tests)) {
    tests[categorySort] = [];
  }
  if (isTestHidden(name)) {
    console.log("Test " + name + " has been hidden");
  } else {
    tests[categorySort].push(t);
  }
  return t;
}

function finalizeTests(tests) {
  var tests_ = [];
  Object.keys(tests)
    .sort()
    .forEach((category) => {
      tests_ = tests_.concat(tests[category]);
    });

  for (let index = 0; index < tests_.length; ++index) {
    tests_[index].prototype.index = index;
  }
  return tests_;
}

function createBaselineTest(tests, engine, media, sortorder, name, func, timeout) {
  var testId = media.testBase + "." + sortorder;
  var testname = media.name + " " + name;
  var categorySort = sortorder + engine.order + name;
  var test = createMvtTest(tests, testId, engine.name + " " + name, categorySort, testname);
  test.prototype.timeout = timeout;
  test.prototype.title = "Test playback of content " + media.name + " using " + engine.name + " " + name;
  test.prototype.onload = function (runner, video) {
    if (!test.prototype.playing) {
      test.prototype.playing = true;
      video.playbackRate = 1;
      video.play();
      func.bind(this)(video, runner);
    }
  };
  test.prototype.content = media;
  engine.setup(test, media);
}

function makeBaselineTests(medialist) {
  var tests = {};
  medialist.forEach((media) => {
    getEnginesForMedia(media, function (engine) {
      makeTestsForMedia(media, tests, engine);
    });
  });
  return finalizeTestSuite(tests);
}

function finalizeTestSuite(tests) {
  return function () {
    var info = "Default Timeout: " + TestBase.timeout + "ms";

    var fields = ["passes", "failures", "timeouts"];

    return { tests: finalizeTests(tests), info: info, fields: fields, viewType: "default" };
  };
}

function makeTestsForMedia(media, tests, engine) {
  createBaselineTest(tests, engine, media, 1, "Playback", testPlayback, TestBase.timeout);
  // TODO: ONEM-26308 Fix Pause tests
  // createBaselineTest(tests, engine, media, 2, "Pause", testPause, TestBase.timeout);
  if (media.duration == undefined || media.duration > 120) {
    // TODO: ONEM-26268 Fix Rate tests
    // if (media.video) {
    // createBaselineTest(tests, engine, media, 3, "Rate", testPlayRate, TestBase.timeout * 3);
    // }
    createBaselineTest(tests, engine, media, 4, "Position", testSetPosition, TestBase.timeout * 2);
  }
  if (media.audio && media.audio.languages) {
    createBaselineTest(tests, engine, media, 5, "AudioTracks", testChangeAudioTracks, TestBase.timeout);
  }
  if (media.subtitles && engine.config.subtitles && engine.config.subtitles.includes(media.subtitles.format)) {
    createBaselineTest(tests, engine, media, 6, "Subtitles", testSubtitles, TestBase.timeout);
  }
}

// var makeTests = function (medialist, category) {
//   var niceNames = {
//     dash: "DASH",
//     hls: "HLS",
//     progressive: "Progressive",
//     hss: "HSS",
//     playready: "PlayReady",
//     custom: "Custom",
//   };

//   if (medialist.length != 0) {
//     var tests = {};
//     medialist.forEach((media) => {
//       getEnginesForMedia(media, function (engine) {
//         if (!(engine.name in tests)) {
//           tests[engine.name] = {};
//         }
//         makeTestsForMedia(media, tests[engine.name], engine);
//       });
//     });

//     for (var engine in tests) {
//       var testlist = tests[engine];
//       if (testlist.length != 0) {
//         var category_engine = category.slice();
//         category_engine.push(engine);

//         var category_key = category_engine.join("-") + "-test";
//         var nice_category = category_engine.map((name) => (niceNames[name] ? niceNames[name] : name));
//         var category_name = nice_category.join(" ");
//         var testsuite = finalizeTestSuite(testlist);

//         var test_desc = {
//           name: category_name + " Tests",
//           title: category_name + " Tests",
//           heading: category_name + " Tests",
//           tests: testsuite,
//         };
//         window.testSuiteDescriptions[category_key] = test_desc;
//         window.testSuiteVersions[testVersion].testSuites.push(category_key);
//       }
//     }
//   }
// };

var TestOutcome = {
  UNKNOWN: 0,
  PASSED: 1,
  FAILED: 2,
  OPTIONAL_FAILED: 3,
};

function getTestStatus(test) {
  if (test.prototype.outcome == TestOutcome.PASSED) return "passed";
  else if (test.prototype.outcome == TestOutcome.FAILED) return "failed";
  else return "skipped";
}

function getMvtTestResults(testStartId, testEndId) {
  testStartId = testStartId || 0;
  testEndId = testEndId || window.globalRunner.testList.length;

  var results = {
    name: harnessConfig.testType,
    setup_log: "",
    suites: [],
    teardown_log: "",
    tests: [],
    type: "suite_result",
    ver: "1.0",
  };

  for (var i = testStartId; i < testEndId; ++i) {
    if (window.globalRunner.testList[i]) {
      var test = window.globalRunner.testList[i];
      results["tests"].push({
        log: test.prototype.logs,
        name: test.prototype.name,
        status: getTestStatus(test),
        suites_chain: "MVT_SUITE." + harnessConfig.testType,
        time_ms: test.prototype.executionTime,
        type: "test_result",
        ver: "1.0",
      });
    }
  }
  return results;
}

window.testSuiteDescriptions = {};
window.testSuiteVersions = {
  [testVersion]: {
    testSuites: [],
    config: {
      enablewebm: true,
      controlMediaFormatSelection: false,
    },
  },
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////
class TestTemplate {
  constructor(name, code) {
    this.testName = name;
    this.code = code;
  }
}

class MvtTest {
  constructor(testTemplate, timeout = TestBase.timeout) {
    this.testTemplate = testTemplate;
    this.timeout = timeout;
  }
}

class MvtMediaTest extends MvtTest {
  constructor(testTemplate, stream, engine, timeout = TestBase.timeout) {
    super(testTemplate, timeout);
    this.stream = stream;
    this.engine = engine;
  }
}

function makeBasicTest(testTemplate, timeout = TestBase.timeout, mandatory = true) {
  let test = createTest(testTemplate.name, testTemplate.name, mandatory);
  test.prototype.timeout = timeout;
  test.prototype.onload = () => {
    testTemplate.code();
  };
  return test;
}

function makeMediaTest(testTemplate, stream, engine, timeout = TestBase.timeout, mandatory = true) {
  let testName = stream.name + " " + testTemplate.testName;
  let test = createTest(testName, testTemplate.testName, mandatory);
  test.prototype.timeout = timeout;
  test.prototype.onload = function (runner, video) {
    if (!test.prototype.playing) {
      test.prototype.playing = true;
      video.playbackRate = 1;
      video.play();
      testTemplate.code.bind(this)(video, runner);
    }
  };
  test.prototype.content = stream;
  engine.setup(test, stream);
  return test;
}

function makeTests(mvtTests) {
  let tests = [];
  mvtTests.forEach((t) => {
    if (t instanceof MvtMediaTest) {
      tests.push(makeMediaTest(t.testTemplate, t.stream, t.engine, t.timeout));
    } else {
      tests.push(makeBasicTest(t.testTemplate, t.timeout));
    }
  });
  return tests;
}

function registerTestSuite(name, tests) {
  let suiteKey = name.replace(" ", "-").toLowerCase() + "-test";
  let info = "Default Timeout: " + TestBase.timeout + "ms";
  let fields = ["passes", "failures", "timeouts"];
  tests.forEach((test, index) => {
    test.prototype.index = index;
  });
  let testSet = { tests: tests, info: info, fields: fields, viewType: "default" };

  var testSuiteDescription = {
    name: name + " Tests",
    title: name + " Tests",
    heading: name + " Tests",
    tests: () => testSet,
  };
  window.testSuiteDescriptions[suiteKey] = testSuiteDescription;
  window.testSuiteVersions[testVersion].testSuites.push(suiteKey);
}
