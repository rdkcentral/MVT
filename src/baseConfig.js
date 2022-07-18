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


const AllContainers = ["cmaf", "fmp4", "mkv", "mpeg2ts", "mp3", "mp4", "webm"]
const AllVariants = ["dash", "hls", "hss", "progressive"]

var DefaultEngines = {
  html5: {
    drm: [],
    subtitles: ["track-tag-webvtt"],
  },
  shaka: {
    drm: ["com.microsoft.playready"],
    subtitles: ["track-tag-webvtt", "webvtt", "ttml"],
    exclude: ["progressive", "hss", "mp3"],
  },
  dashjs: {
    drm: ["com.microsoft.playready"],
    subtitles: ["webvtt", "ttml"],
    exclude: ["progressive", "mpeg2ts", "hls"],
  },
  hlsjs: {
    drm: [],
    subtitles: ["webvtt", "ttml"],
    exclude: ["progressive", "mpeg2ts", "dash", "hss"],
  },
};

var DefaultContainers = {
  hls: {
    fmp4: {
      video: ["avc1", "hevc"],
      audio: ["aac", "ac3", "eac3", "mp3"],
      subtitles: ["webvtt", "ttml"],
    },
    cmaf: {
      video: ["avc1", "hevc"],
      audio: ["aac", "ac3", "eac3", "mp3"],
      subtitles: ["webvtt", "ttml", "ebu-tt"],
    },
    mpeg2ts: {
      video: ["avc1"],
      audio: ["aac"],
      subtitles: ["webvtt"],
      note: "Not recommended",
    },
    mp3: {
      audio: ["mp3"],
      engine: {
        html5: {},
        hlsjs: {},
      },
      note: "Not recommended",
    },
    engine: {
      html5: {},
      shaka: {},
      hlsjs: {},
    },
  },
  hss: {
    fragmentedmp4: {
      video: ["avc1", "hevc", "vc1"],
      audio: ["wma", "aac", "mp3"],
      subtitles: ["webvtt", "ttml", "ebu-tt"],
    },
    engine: {
      html5: {},
      dashjs: {},
    },
  },
  dash: {
    fragmentedmp4: {
      video: ["avc1", "hevc", "mp2", "vc1", "mpeg4part2", "av01"],
      audio: ["aac", "ac3", "eac3", "mp3"],
      subtitles: ["webvtt", "ttml", "ebu-tt"],
    },
    cmaf: {
      video: ["avc1", "hevc", "mp2", "vc1", "mpeg4part2"],
      audio: ["aac", "ac3", "eac3", "mp3"],
      subtitles: ["webvtt", "ttml", "ebu-tt"],
    },
    webm: {
      video: ["vp9"],
      audio: ["opus"],
    },
    engine: {
      html5: {},
      shaka: {},
      dashjs: {},
    },
  },
  progressive: {
    mp4: {
      video: ["avc1", "hevc", "mp2", "mpeg4part2"],
      audio: ["aac", "ac3", "eac3", "mp3", "wma"],
      subtitles: ["webvtt", "ttml", "ebu-tt"],
      engine: {
        html5: {},
      },
    },
    mp3: {
      audio: ["mp3"],
      engine: {
        html5: {},
      },
    },
    mkv: {
      video: ["avc1", "hevc", "mp2", "vp9", "mpeg4part2"],
      audio: ["aac", "ac3", "eac3", "mp3", "wma", "opus"],
      subtitles: ["webvtt", "ttml", "ebu-tt"],
      engine: {
        html5: {},
      },
    },
  },
};
