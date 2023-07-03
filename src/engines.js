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

class Engine {
  constructor(config) {
    this.config = config;
  }
}

function extractSubtitleCue(content, callback) {
  return function (event) {
    var cues = event.currentTarget.activeCues;

    // dashjs uses html, scrape it.
    if (event.currentTarget.renderingType == "html") {
      var subtitlesDiv = document.getElementById("subtitles");
      var elements = subtitlesDiv.getElementsByTagName("div");
      for (var i = 0; i < elements.length; i++) {
        callback(elements[i].innerText);
      }
    } else {
      for (var i = 0; i < cues.length; i++) {
        callback(cues[i].text);
      }
    }
  };
}

function hookupSubtitleCue(video, content, callback) {
  var tracks = video.textTracks;
  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    if (track.mode == "showing") {
      track.oncuechange = extractSubtitleCue(content, callback);
    } else {
      track.oncuechange = null;
    }
  }
}

class Html5Engine extends Engine {
  get name() {
    return "html5";
  }
  get order() {
    return 0;
  }
  setup(test, media) {
    test.prototype.start = function (runner, video) {
      var that = this;
      video.addEventListener("error", (error) => onError(event));
      function onError(error) {
        runner.fail(error);
      }
      video.addEventListener("loadstart", function () {
        that.onload(runner, video);
      });
      video.src = media.src;
    };
    test.prototype.changeLanguage = function (video, runner, language) {
      var tracks = video.audioTracks;
      var found = false;
      var languages = [];
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        languages.push(track.language);
        if (track.language == language) {
          found = true;
          track.enabled = true;
        } else {
          track.enabled = false;
        }
      }
      runner.assert(found, "Audio language " + language + " not found");
      return languages;
    };

    test.prototype.engine = this.name;
    test.prototype.changeSubtitles = function (video, content, runner, language, callback) {
      var tracks = video.textTracks;
      var found = false;
      var languages = [];

      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        languages.push(track.language);
        if (track.language == language) {
          found = true;
          track.oncuechange = extractSubtitleCue(content, callback);
          track.mode = "showing";
        } else {
          track.oncuechange = undefined;
          track.mode = "disabled";
        }
      }

      runner.assert(found, "Subtitle language " + language + " not found");
      return languages;
    };
  }
}

class ShakaEngine extends Engine {
  get name() {
    return "shaka";
  }
  get order() {
    return 1;
  }
  setup(test, media) {
    test.prototype.start = function (runner, video) {
      var that = this;
      this.shakaPlayer = new shaka.Player(video);
      this.shakaPlayer.configure({
        abr: {
          enabled: true,
        },
        streaming: {
          retryParameters: {
            timeout: 2000, // timeout in ms, after which we abort a request; 0 means never
            maxAttempts: 3, // the maximum number of requests before we fail
            baseDelay: 1500, // the base delay in ms between retries
            backoffFactor: 2, // the multiplicative backoff factor between retries
            fuzzFactor: 0.5, // the fuzz factor to apply to each retry delay
          },
        },
      });
      if (!shaka.polyfill.installed) {
        // Install built-in polyfills to patch browser incompatibilities.
        shaka.polyfill.installAll();
        shaka.polyfill.installed = true;
      }
      if (media.drm) {
        this.shakaPlayer.configure({
          drm: {
            servers: media.drm.shaka.servers,
            advanced: {
              "com.widevine.alpha": {
                videoRobustness: "SW_SECURE_CRYPTO",
                audioRobustness: "SW_SECURE_CRYPTO",
              },
            },
          },
        });
      }

      this.shakaPlayer.addEventListener("error", (error) => onError(error));

      function onError(error) {
        console.trace(error);
        runner.fail(error);
      }
      video.addEventListener("loadeddata", function () {
        that.onload(runner, video);
      });
      this.shakaPlayer.load(media.src).catch(onError);
      if (media.drm.shaka_headers) {
        this.shakaPlayer.getNetworkingEngine().registerRequestFilter(function (type, request) {
          if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
            request.headers[media.drm.shaka_headers[0]] = media.drm.shaka_headers[1];
          }
        });
      }
    };
    test.prototype.engine = this.name;
    test.prototype.superTeardown = test.prototype.teardown;
    test.prototype.teardown = function (testSuiteVer, cb) {
      this.shakaPlayer.destroy();
      this.superTeardown(testSuiteVer, cb);
    };

    test.prototype.changeLanguage = function (video, runner, language) {
      var languages = this.shakaPlayer.getAudioLanguages();
      runner.assert(languages.includes(language), "Audio language found");
      this.shakaPlayer.selectAudioLanguage(language);
      return languages;
    };
    test.prototype.changeSubtitles = function (video, content, runner, language, callback) {
      var languages = this.shakaPlayer.getTextLanguages();
      runner.assert(languages.includes(language), "Subtitle language " + language + " not found");
      this.shakaPlayer.selectTextLanguage(language);
      this.shakaPlayer.setTextTrackVisibility(true);

      hookupSubtitleCue(video, content, callback);

      return languages;
    };
  }
}

class DashjsEngine extends Engine {
  get name() {
    return "dashjs";
  }
  get order() {
    return 2;
  }

  setup(test, media) {
    test.prototype.start = function (runner, video) {
      var that = this;

      this.dashjsPlayer = dashjs.MediaPlayer().create();
      this.dashjsPlayer.updateSettings({
        streaming: {
          abr: {
            autoSwitchBitrate: { audio: true, video: true },
          },
        },
      });

      video.addEventListener("error", (error) => onError(event));
      function onError(error) {
        runner.fail(error);
      }
      video.addEventListener("loadeddata", function () {
        that.onload(runner, video);
      });

      this.dashjsPlayer.initialize(video, media.src, false);

      if (media.drm) {
        this.dashjsPlayer.setProtectionData(media.drm.servers);
      }

      // Add subtitles div
      var subtitleDiv = document.createElement("div");
      subtitleDiv.id = "subtitles";
      var parentDiv = document.createElement("div");

      parentDiv.appendChild(subtitleDiv);

      parentDiv.style.position = "absolute";
      video.style.position = "absolute";
      video.parentElement.appendChild(parentDiv);
      this.dashjsPlayer.attachTTMLRenderingDiv(subtitleDiv);
      this.dashjsPlayer.setInitialMediaSettingsFor("text", { lang: "en", role: "subtitles" });
    };
    test.prototype.engine = this.name;
    test.prototype.superTeardown = test.prototype.teardown;
    test.prototype.teardown = function (testSuiteVer, cb) {
      try {
        // dashjsPlayer is unable to reset its state when
        // [Error] InvalidStateError: The object is in an invalid state.
        // The main reason is Video Element Error: MEDIA_ERR_SRC_NOT_SUPPORTED
        this.dashjsPlayer.reset();
      } catch (error) {
        this.log(error);
      }
      this.superTeardown(testSuiteVer, cb);
    };

    test.prototype.changeLanguage = function (video, runner, language) {
      var tracks = this.dashjsPlayer.getTracksFor("audio");
      var found = false;
      var languages = [];
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        languages.push(track.lang);
        if (track.lang == language) {
          this.dashjsPlayer.setCurrentTrack(track);
          found = true;
        }
      }
      runner.assert(found, "Audio language " + language + " not found");
      return languages;
    };

    test.prototype.changeSubtitles = function (video, content, runner, language, callback) {
      var tracks = this.dashjsPlayer.getTracksFor("fragmentedText");
      if (tracks.length === 0) {
        this.log("No 'fragmentedText' tracks found, fall back to 'text' tracks");
        tracks = this.dashjsPlayer.getTracksFor("text");
      }
      const trackId = tracks.findIndex((track) => track.lang == language);
      runner.assert(trackId != -1, "Subtitle language " + language + " not found");
      this.log("Selecting text track " + trackId);
      this.dashjsPlayer.setTextTrack(trackId);
      hookupSubtitleCue(video, content, callback);
      return tracks.map((track) => track.lang);
    };
  }
}

class HlsjsEngine extends Engine {
  get name() {
    return "hlsjs";
  }
  get order() {
    return 3;
  }
  setup(test, media) {
    test.prototype.start = function (runner, video) {
      var that = this;

      if (media.widevine) {
        this.hls = new Hls({
          enableWorker: true,  // enable ABR
          lowLatencyMode: true,
          backBufferLength: 90,
          widevineLicenseUrl: media.drm.servers["com.widevine.alpha"].serverURL,
          emeEnabled: true,
        });
      } else {
        this.hls = new Hls({
          enableWorker: true,  // enable ABR
        });
      }

      this.hls.loadSource(media.src);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, function () {
        that.onload(runner, video);
      });

      video.addEventListener("error", (error) => onError(event));
      function onError(error) {
        runner.fail(error);
      }
    };
    test.prototype.engine = this.name;
    test.prototype.superTeardown = test.prototype.teardown;
    test.prototype.teardown = function (testSuiteVer, cb) {
      this.hls.destroy();
      this.superTeardown(testSuiteVer, cb);
    };

    test.prototype.changeLanguage = function (video, runner, language) {
      var tracks = this.hls.audioTracks;
      var found = false;
      var languages = [];
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        languages.push(track.lang);
        if (track.lang == language) {
          this.hls.audioTrack = i;
          found = true;
        }
      }
      runner.assert(found, "Audio language " + language + " not found");
      return languages;
    };

    test.prototype.changeSubtitles = function (video, content, runner, language, callback) {
      var tracks = this.hls.subtitleTracks;
      var found = false;
      var languages = [];
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        languages.push(track.lang);
        if (track.lang == language) {
          this.hls.subtitleTrack = i;
          found = true;
        }
      }
      runner.assert(found, "Subtitle language " + language + " not found");
      hookupSubtitleCue(video, content, callback);

      return languages;
    };
  }
}

var availableEngines = {
  html5: Html5Engine,
  shaka: ShakaEngine,
  dashjs: DashjsEngine,
  hlsjs: HlsjsEngine,
};
