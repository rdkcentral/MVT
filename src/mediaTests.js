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
 * Implements media tests.
 * All |test*| functions represent a media test - a sequence of actions and expectations, which can be executed on
 * a given media stream. Same test code is used multiple times on various streams. Binding between test code
 * and media stream is implemented in |src/suites.js|.
 */

"use strict";

function waitForEvent(video, runner, event, predicate = null, maxWaitTimeMs = 10000, times = 1) {
  return new Promise((resolve, reject) => {
    let receivedEvents = 0;

    var timeoutId = runner.timeouts.setTimeout(() => {
      video.removeEventListener(event, eventHandler);
      runner.assert(false, "Timeout (" + maxWaitTimeMs + ") waiting for " + event);
      reject();
    }, maxWaitTimeMs);

    function eventHandler() {
      if (harnessConfig.debug) {
        runner.log("current time: " + video.currentTime);
      }
      if (!predicate || predicate(video)) {
        receivedEvents += 1;
        if (receivedEvents >= times) {
          runner.log("Received " + receivedEvents + (predicate ? " (filtered)" : "") + ": " + event);
          video.removeEventListener(event, eventHandler);
          runner.timeouts.clearTimeout(timeoutId);
          resolve();
        }
      }
    }
    runner.log("Waiting for event: " + event + ", timeout: " + maxWaitTimeMs);
    video.addEventListener(event, eventHandler);
  });
}

function waitForPosition(video, runner, position, maxWaitTimeMs = 10000) {
  runner.log("Waiting for time: " + position);
  return waitForEvent(
    video,
    runner,
    "timeupdate",
    (video) => !video.seeking && video.currentTime >= position,
    maxWaitTimeMs
  );
}

function seek(video, runner, position, postSeekPlayTime = 2, maxSeekTimeMs = 20000) {
  video.currentTime = position;
  return waitForPosition(video, runner, position + postSeekPlayTime, maxSeekTimeMs);
}

function checkVideoFramesIncreasing(video, runner, hasVideoTrack) {
  return new Promise((resolve, _) => {
    if (!harnessConfig.checkframes || !hasVideoTrack) {
      resolve();
    } else {
      const beforeFrames = video.getVideoPlaybackQuality().totalVideoFrames;
      runner.timeouts.setTimeout(() => {
        runner.checkGr(video.getVideoPlaybackQuality().totalVideoFrames, beforeFrames, "frames should be increasing");
        resolve();
      }, 500);
    }
  });
}

function makeVideoCanPlayTest(codec, container, mimeType) {
  return new TestTemplate(`VideoCanPlayType`, function (runner, video) {
    const fullMime = `${container}; codecs="${mimeType}"`;
    runner.log(`Executing canPlayType test for ${codec} (${fullMime})`);
    const canPlayType = video.canPlayType(fullMime);
    runner.assert(canPlayType === "probably", `canPlayType should be 'probably' for ${fullMime}`);
    runner.succeed();
  });
}

function makeIsTypeSupportedTest(codec, container, mimeType) {
  return new TestTemplate(`IsTypeSupported`, function (runner, video) {
    const fullMime = `${container}; codecs="${mimeType}"`;
    runner.log(`Executing IsTypeSupported test for ${codec} (${fullMime})`);
    const isTypeSupported = MediaSource.isTypeSupported(fullMime);
    runner.assert(isTypeSupported, `MediaSource.isTypeSupported should be true for ${fullMime}`);
    runner.succeed();
  });
}

var testPlayback = new TestTemplate("Playback", function (video, runner) {
  const initialPosition = video.currentTime + 1;
  const hasVideoTrack = this.content.video;
  const playbackTime = 10;

  const makePlaybackTestStep = function (position) {
    return () =>
      new Promise((resolve, _) => {
        return waitForPosition(video, runner, position)
          .then(() => checkVideoFramesIncreasing(video, runner, hasVideoTrack))
          .then(resolve);
      });
  };

  var promise = Promise.resolve();
  for (let i = 0; i < playbackTime; ++i) {
    promise = promise.then(makePlaybackTestStep(initialPosition + i));
  }
  promise.then(() => runner.succeed());
});

var testPlayRate = new TestTemplate("PlayRate", function (video, runner) {
  const rates = [0.5, 2, 0.75, 1.5];
  const initialPosition = video.currentTime + 1;
  const hasVideoTrack = this.content.video;

  // Each playbackRate will be verified on the span of |playbackTimePerRate|ms, with media position assertions frequency
  // of |checkInterval|/|playbackTimePerRate|.
  const playbackTimePerRate = 3000;
  const checkInterval = 500;
  const numberOfChecks = Math.floor(playbackTimePerRate / checkInterval);

  // After each playbackRate change, wait for |warmUpTimeUpdates| * |timeupdate| events before proceeding with further steps.
  // These events should be emitted within timeout of |setRateToPlayTimeout|.
  // The aim of this mechanism is to let the player buffer some data before playback speed verification.
  const warmUpTimeUpdates = 10;
  const setRateToPlayTimeout = 10000;

  const makePlayRateTest = function (playbackRate) {
    return () =>
      new Promise((resolve, _) => {
        let inaccuracyThreshold = playbackRate * 0.75;
        let checks = 0;
        let playTimeLast = 0;
        let realTimeLast = 0;

        runner.log("Setting playbackRate to ", playbackRate, ", acceptable position inaccuracy: ", inaccuracyThreshold);
        video.playbackRate = playbackRate;

        function verifyPlaybackProgress() {
          if (checks >= numberOfChecks) {
            resolve();
          } else {
            if (realTimeLast) {
              checks++;
              let playTimeCurrent = video.currentTime;
              let timePassed = (Date.now() - realTimeLast) / 1000;
              let expectedPosition = playTimeLast + timePassed * playbackRate;
              runner.checkApproxEq(playTimeCurrent, expectedPosition, "video.currentTime", inaccuracyThreshold);
            }
            playTimeLast = video.currentTime;
            realTimeLast = Date.now();
            runner.timeouts.setTimeout(verifyPlaybackProgress, checkInterval);
          }
        }

        if (playbackRate)
          waitForEvent(video, runner, "timeupdate", null, setRateToPlayTimeout, warmUpTimeUpdates)
            .then(() => checkVideoFramesIncreasing(video, runner, hasVideoTrack))
            .then(verifyPlaybackProgress);
        else runner.timeouts.setTimeout(verifyPlaybackProgress, checkInterval);
      });
  };

  var promise = waitForPosition(video, runner, initialPosition).then(() => {
    runner.checkGE(video.currentTime, initialPosition, "video should start playback");
  });
  rates.forEach((rate) => {
    promise = promise.then(makePlayRateTest(rate));
  });
  promise.then(() => runner.succeed());
});

var testPause = new TestTemplate("Pause", function (video, runner) {
  const hasVideoTrack = this.content.video;
  var pauseTimes = [1.5, 5];
  if (this.content.dynamic) {
    pauseTimes = [video.currentTime + 3, video.currentTime + 9];
  }

  const makePauseTest = function (pauseTime) {
    return () =>
      waitForPosition(video, runner, pauseTime)
        .then(() => {
          const promise = waitForEvent(video, runner, "pause");
          runner.log("Pausing video");
          video.pause();
          return promise;
        })
        .then(() => {
          runner.checkGE(video.currentTime, pauseTime, "currentTime should be greater or equal to pause point");
          runner.checkGr(pauseTime + 2, video.currentTime, "currentTime should be less than pause point + 2s");
          const promise = waitForEvent(video, runner, "playing");
          video.play();
          return promise;
        })
        .then(() => checkVideoFramesIncreasing(video, runner, hasVideoTrack));
  };

  var promise = Promise.resolve();
  pauseTimes.forEach((pauseTime) => (promise = promise.then(makePauseTest(pauseTime))));
  promise.then(() => runner.succeed());
});

var testSetPosition = new TestTemplate("Seek", function (video, runner) {
  const initialPosition = 2;
  const hasVideoTrack = this.content.video;
  var positions = [0, 20, 45];
  if (this.content.dynamic) {
    let curTime = video.currentTime;
    positions = [curTime - 40, curTime - 20, curTime];
  }

  const makeSeekTest = function (position) {
    return () => {
      return new Promise((resolve, _) => {
        runner.log("Changing position to " + position);
        seek(video, runner, position).then(() => {
          let curTime = video.currentTime;
          runner.checkGE(curTime, position, "currentTime should be greater or equal to seek point");
          runner.checkGr(position + 10, curTime, "currentTime should be less than seek point + 10s");
          checkVideoFramesIncreasing(video, runner, hasVideoTrack).then(resolve);
        });
      });
    };
  };

  var promise = waitForPosition(video, runner, initialPosition).then(() => {
    runner.checkGE(video.currentTime, initialPosition, "video should start playback");
    return checkVideoFramesIncreasing(video, runner, hasVideoTrack);
  });
  positions.forEach((position) => {
    promise = promise.then(makeSeekTest(position));
  });
  promise.then(() => runner.succeed());
});

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

var testChangeAudioTracks = new TestTemplate("AudioTracks", function (video, runner) {
  const initialPosition = 5;
  const trackPlaybackTime = 7;
  const positionInaccuracyThreshold = 3;

  var languages = this.content.audio.languages.slice().reverse();
  // Set the first language twice at start and end
  languages.unshift(languages[languages.length - 1]);

  const makeChangeAudioTrackTest = (lang) => {
    return () => {
      return new Promise((resolve, _) => {
        runner.log("Changing language to " + lang);
        let trackChangePosition = video.currentTime;
        let expectedPosition = trackChangePosition + trackPlaybackTime;
        let availableLanguages = this.changeLanguage(video, runner, lang);
        runner.assert(
          arraysEqual(availableLanguages.sort(), this.content.audio.languages.slice().sort()),
          "languages to match declared"
        );
        runner.timeouts.setTimeout(() => {
          let playTimeCurrent = video.currentTime;
          runner.checkApproxEq(playTimeCurrent, expectedPosition, "video.currentTime", positionInaccuracyThreshold);
          resolve();
        }, trackPlaybackTime * 1000);
      });
    };
  };

  var promise = waitForPosition(video, runner, initialPosition);
  languages.forEach((lang) => {
    promise = promise.then(makeChangeAudioTrackTest(lang));
  });
  promise.then(() => runner.succeed());
});

var testSubtitles = new TestTemplate("Subtitles", function (video, runner) {
  const initialPosition = this.content.subtitles.startOffset || 1;

  if (this.content.subtitles.tracks) {
    this.content.subtitles.tracks.forEach((trackData) => {
      console.log("Creating track node for: " + trackData.src);
      let track = document.createElement("track");
      track.kind = "captions";
      track.label = trackData.lang;
      track.srclang = trackData.lang;
      track.src = trackData.src;
      video.appendChild(track);
    });
  }

  this.content.subtitles.languages.sort();
  let languages = this.content.subtitles.languages.slice();
  if (this.content.subtitles.testLanguages) {
    languages = this.content.subtitles.testLanguages.slice();
  }
  languages.reverse();
  // Set the first language twice at start and end
  languages.unshift(languages[languages.length - 1]);

  const makeChangeSubtitlesTest = (language) => {
    return () => {
      return new Promise((resolve, _) => {
        runner.log("Changing subtitles to " + language);
        let foundCaption = false;
        let availableLangs = this.changeSubtitles(video, this.content, runner, language, (subtitle) => {
          if (!foundCaption && this.content.subtitles.expectedText[language].indexOf(subtitle) != -1) {
            foundCaption = true;
            runner.log("Found expected " + language + " caption: " + subtitle);
            waitForPosition(video, runner, video.currentTime + 1).then(resolve);
          }
        });

        availableLangs = availableLangs.map((lang) => lang.toLowerCase());
        availableLangs.sort();
        runner.assert(
          arraysEqual(availableLangs, this.content.subtitles.languages),
          "languages " + availableLangs + " do not match declared " + this.content.subtitles.languages
        );
      });
    };
  };

  var promise = waitForPosition(video, runner, 1).then(() => {
    if (video.currentTime < initialPosition) {
      seek(video, runner, initialPosition);
    }
  });
  languages.forEach((language) => {
    promise = promise.then(makeChangeSubtitlesTest(language));
  });
  promise.then(() => runner.succeed());
});

var testPerformance = new TestTemplate("Performance", function (video, runner) {
  const TIME_TO_VIDEO_THRESHOLD = 4000;

  video.addEventListener('playing', () => {
    const timeToVideo = Date.now() - window.globalRunner.startTime;
    runner.log('Time taken to start video ' + timeToVideo + ' ms');
      if (timeToVideo <= TIME_TO_VIDEO_THRESHOLD) {
           runner.succeed();
      } else {
           runner.fail();
      }
  }, { once: true });
});

var LONG_DUR_VIDEO_PLAYTIME_SEC = 5400; //1.5hrs

var testLongDurationVideoPlayback = new TestTemplate("Long-Duration-Video-Playback", function (video, runner) {
  const initialPosition = video.currentTime + 1;
  const hasVideoTrack = this.content.video;
  const playbackTime = LONG_DUR_VIDEO_PLAYTIME_SEC;

  const makePlaybackTestStep = function (position) {
    return () =>
      new Promise((resolve, _) => {
        return waitForPosition(video, runner, position, 200*1000)
          .then(() => checkVideoFramesIncreasing(video, runner, hasVideoTrack))
          .then(resolve);
      });
  };

  var promise = Promise.resolve();
  for (let i = 0; i < playbackTime; ++i) {
    promise = promise.then(makePlaybackTestStep(initialPosition + i));
  }
  promise.then(() => runner.succeed());
});

var testLongDurationVideoPause = new TestTemplate("Long-Duration-Video-Pause", function (video, runner) {
  const hasVideoTrack = this.content.video;
  var pauseTimes = [];
  for(let val = 15; val < LONG_DUR_VIDEO_PLAYTIME_SEC; val=val+25) {
    if (this.content.dynamic) {
      pauseTimes.push(video.currentTime + val);
    }
    else {
      pauseTimes.push(val);
    }
  }

  const makePauseTest = function (pauseTime) {
    return () =>
      waitForPosition(video, runner, pauseTime, 200*1000)
        .then(() => {
          const promise = waitForEvent(video, runner, "pause");
          runner.log("Pausing video");
          video.pause();
          return promise;
        })
        .then(() => {
          runner.checkGE(video.currentTime, pauseTime, "currentTime should be greater or equal to pause point");
          runner.checkGr(pauseTime + 2, video.currentTime, "currentTime should be less than pause point + 2s");
          const promise = waitForEvent(video, runner, "playing");
          video.play();
          return promise;
        })
        .then(() => checkVideoFramesIncreasing(video, runner, hasVideoTrack));
  };

  var promise = Promise.resolve();
  pauseTimes.forEach((pauseTime) => (promise = promise.then(makePauseTest(pauseTime))));
  promise.then(() => runner.succeed());
});

var testLongDurationVideoSetPosition = new TestTemplate("Long-Duration-Video-Seek", function (video, runner) {
  const initialPosition = 50;
  const hasVideoTrack = this.content.video;
  var positions = [];

  for(let val = 5; val < LONG_DUR_VIDEO_PLAYTIME_SEC; val=val+25) {
    if (this.content.dynamic) {
      positions.push(video.currentTime + val);
    }
    else {
      positions.push(val);
    }
  }

  const makeSeekTest = function (position) {
    return () => {
      return new Promise((resolve, _) => {
        runner.log("Changing position to " + position);
        seek(video, runner, position).then(() => {
          let curTime = video.currentTime;
          runner.checkGE(curTime, position, "currentTime should be greater or equal to seek point");
          runner.checkGr(position + 10, curTime, "currentTime should be less than seek point + 10s");
          checkVideoFramesIncreasing(video, runner, hasVideoTrack).then(resolve);
        });
      });
    };
  };

  var promise = waitForPosition(video, runner, initialPosition, 200*1000).then(() => {
    runner.checkGE(video.currentTime, initialPosition, "video should start playback");
    return checkVideoFramesIncreasing(video, runner, hasVideoTrack);
  });
  positions.forEach((position) => {
    promise = promise.then(makeSeekTest(position));
  });
  promise.then(() => runner.succeed());
});

var testLongDurationVideoPlayRate = new TestTemplate("Long-Duration-Video-PlayRate", function (video, runner) {
  const rates = [0.5, 1, 1.5, 1.75, 2];
  const ratesLoopCount = 10; //How many times the above rates need to be iterated
  const initialPosition = video.currentTime + 1;
  const hasVideoTrack = this.content.video;

  // Each playbackRate will be verified on the span of |playbackTimePerRate|ms, with media position assertions frequency
  // of |checkInterval|/|playbackTimePerRate|.
  const playbackTimePerRate = 60000;
  const checkInterval = 5000;
  const numberOfChecks = Math.floor(playbackTimePerRate / checkInterval);

  // After each playbackRate change, wait for |warmUpTimeUpdates| * |timeupdate| events before proceeding with further steps.
  // These events should be emitted within timeout of |setRateToPlayTimeout|.
  // The aim of this mechanism is to let the player buffer some data before playback speed verification.
  const warmUpTimeUpdates = 10;
  const setRateToPlayTimeout = 20000;

  const makePlayRateTest = function (playbackRate) {
    return () =>
      new Promise((resolve, _) => {
        let inaccuracyThreshold = playbackRate * 0.75;
        let checks = 0;
        let playTimeLast = 0;
        let realTimeLast = 0;

        runner.log("Setting playbackRate to ", playbackRate, ", acceptable position inaccuracy: ", inaccuracyThreshold);
        video.playbackRate = playbackRate;

        function verifyPlaybackProgress() {
          if (checks >= numberOfChecks) {
            resolve();
          } else {
            if (realTimeLast) {
              checks++;
              let playTimeCurrent = video.currentTime;
              let timePassed = (Date.now() - realTimeLast) / 1000;
              let expectedPosition = playTimeLast + timePassed * playbackRate;
              runner.checkApproxEq(playTimeCurrent, expectedPosition, "video.currentTime", inaccuracyThreshold);
            }
            playTimeLast = video.currentTime;
            realTimeLast = Date.now();
            runner.timeouts.setTimeout(verifyPlaybackProgress, checkInterval);
          }
        }

        if (playbackRate)
          waitForEvent(video, runner, "timeupdate", null, setRateToPlayTimeout, warmUpTimeUpdates)
            .then(() => checkVideoFramesIncreasing(video, runner, hasVideoTrack))
            .then(verifyPlaybackProgress);
        else runner.timeouts.setTimeout(verifyPlaybackProgress, checkInterval);
      });
  };

  var promise = waitForPosition(video, runner, initialPosition, 200*100).then(() => {
    runner.checkGE(video.currentTime, initialPosition, "video should start playback");
  });

  for(let count = 0; count <= ratesLoopCount; count++) {
    rates.forEach((rate) => {
      promise = promise.then(makePlayRateTest(rate));
    });
  }
  promise.then(() => runner.succeed());
});
