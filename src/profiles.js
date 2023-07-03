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
 * This file defines a collection of profiles, which are used for choosing a particular subset of sets supported on
 * given environment. Each consists of a list codecs with some additional properties. This mechanism should likely
 * be extended with new attributes e.g. DRM support.
 *
 * Profile can be selected using URL parameter: |profile=all|.
 * If left unspecified, |default| profile will be selected.
 */

function filterUnsupportedOnProfile(profile, tests) {
  return tests.filter((test) => {
    if (!test instanceof MvtMediaTest) return true;
    let stream = test.stream;
    let variantSupported = test.engine.name !== "html5" || profile.native_support.includes(stream.variant);
    let videoSupported = !stream.video || profile.codecs.includes(stream.video.codec);
    let audioSupported = !stream.audio || profile.codecs.includes(stream.audio.codec);
    let drmSupported = !stream.drm || Object.keys(stream.drm.servers).some((drm) => profile.drm.includes(drm));
    let cbcsSupported = stream.cbcs ? profile.note.includes("CBCS") : true;
    let widevineSupported = stream.widevine ? profile.note.includes("Widevine") : true;
    return variantSupported && videoSupported && audioSupported && drmSupported && cbcsSupported && widevineSupported;
  });
}

const Profiles = {
  all: {
    note: "Everything enabled, CBCS and Widevine included",
    drm: ["com.microsoft.playready", "com.widevine.alpha"],
    codecs: ["avc", "hevc", "mpeg2", "mpeg4part2", "vp9", "aac", "ac3", "eac3", "mp3", "opus"],
    native_support: ["dash", "hls", "hss", "progressive"],
  },
  default: {
    note: "Default",
    drm: ["com.microsoft.playready"],
    codecs: ["avc", "hevc", "mpeg2", "vp9", "aac", "ac3", "eac3", "mp3", "opus"],
    native_support: ["dash", "hss", "progressive"],
  },
  desktop: {
    note: "For desktop browsers",
    drm: [],
    codecs: ["avc", "mpeg4part2", "vp9", "aac", "mp3", "opus"],
    native_support: ["progressive"],
  },
  extended_drm: {
    note: "Default with CBCS and Widevine support",
    drm: ["com.microsoft.playready", "com.widevine.alpha"],
    codecs: ["avc", "hevc", "mpeg2", "vp9", "aac", "ac3", "eac3", "mp3", "opus"],
    native_support: ["dash", "hss", "progressive"],
  },
};

let getProfile = parseParam("profile", null) || window.localStorage["profile"] || "default";
const SelectedProfile = Profiles[getProfile] == undefined ? Profiles["default"] : Profiles[getProfile];
window.ConfigString = Profiles[getProfile] == undefined ? "default" : getProfile;
window.localStorage["profile"] = window.ConfigString;

const EngineProperties = {
  shaka: {
    variants: ["dash", "hls"],
    subtitles: ["ttml", "vtt"],
  },
  dashjs: {
    variants: ["dash", "hss"],
    subtitles: ["ttml", "vtt"],
  },
  hlsjs: {
    variants: ["hls"],
    subtitles: ["vtt"],
  },
  html5: {
    variants: SelectedProfile.native_support,
    subtitles: ["ttml", "vtt"],
  },
};
