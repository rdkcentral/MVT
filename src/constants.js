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

const A_MP4 = "audio/mp4";
const V_MP4 = "video/mp4";
const A_MP2T = "audio/mp2t";
const V_MP2T = "video/mp2t";
const A_WEBM = "audio/webm";
const V_WEBM = "video/webm";
const A_MKV = "audio/x-matroska";
const V_MKV = "video/x-matroska";

const CONTAINER_MAPPING = {
  avc: [V_MP4, V_MP2T, V_MKV],
  hevc: [V_MP4, V_MKV],
  mpeg2: [V_MP2T],
  mpeg4part2: [V_MP4, V_MKV],
  vp9: [V_WEBM],
  aac: [A_MP4],
  ac3: [A_MP4],
  eac3: [A_MP4],
  mp3: [A_MP4],
  opus: [A_WEBM],
};

const MIME_TYPE_MAPPING = {
  avc: "avc1.4d002a",
  hevc: "hvc1.2.4.L153.00",
  mpeg2: "mp2v",
  mpeg4part2: "mp4v.20.240",
  vp9: "vp9",
  aac: "mp4a.40.29",
  ac3: "mp4a.a5",
  eac3: "mp4a.a6",
  mp3: "mp4a.69",
  opus: "opus",
};

const SUBTITLES_TYPES = ["track-tag-webvtt", "webvtt", "ttml"];

const NICE_NAMES = {
  "com.microsoft.playready": "PlayReady",
  "track-tag-webvtt": "out-of-band WebVTT",
  webvtt: "WebVTT",
};
