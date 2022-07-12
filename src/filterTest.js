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

const FilterTestEnum = {
  ENABLED: 0,
  HIDDEN: 1,
  OPTIONAL: 2,
};

var FilterTestList = {
  "DASH-MULTIPERIOD Playback": FilterTestEnum.OPTIONAL, // TODO(ONEM-26036)
  "DASH-MULTIPERIOD Pause": FilterTestEnum.OPTIONAL, // TODO(ONEM-26036)
  "DASH-MULTIPERIOD Position": FilterTestEnum.OPTIONAL, // TODO(ONEM-26036)
  "DASH-FMP4-AVC1-AAC-TTML Subtitles": FilterTestEnum.OPTIONAL, // TODO(ONEM-26034)
  "DASH-FMP4-MULTIAUDIO AudioTracks": FilterTestEnum.OPTIONAL, // TODO(ONEM-26279)
  "PROG-MKV-EAC3 Position": FilterTestEnum.OPTIONAL,
  'audio/mp2t; codecs="mp4a.40.29"(aac)': FilterTestEnum.HIDDEN,
  'audio/mp2t; codecs="mp4a.69"(mp3)': FilterTestEnum.HIDDEN,
  'audio/mp2t; codecs="mp4a.a5"(ac3)': FilterTestEnum.HIDDEN,
  'audio/mp2t; codecs="mp4a.a6"(eac3)': FilterTestEnum.HIDDEN,
  'audio/x-matroska; codecs="mp4a.40.29"(aac)': FilterTestEnum.HIDDEN,
  'audio/x-matroska; codecs="mp4a.69"(mp3)': FilterTestEnum.HIDDEN,
  'audio/x-matroska; codecs="mp4a.a5"(ac3)': FilterTestEnum.HIDDEN,
  'audio/x-matroska; codecs="mp4a.a6"(eac3)': FilterTestEnum.HIDDEN,
  'audio/x-matroska; codecs="opus"(opus)': FilterTestEnum.HIDDEN,
  'video/mp2t; codecs="avc1.64002a"(avc1)': FilterTestEnum.OPTIONAL,
  'video/webm; codecs="vp09.02.51.08"(vp9)': FilterTestEnum.OPTIONAL,
  'video/x-matroska; codecs="avc1.64002a"(avc1)': FilterTestEnum.OPTIONAL,
  'video/x-matroska; codecs="hvc1.2.4.L153.00"(hevc)': FilterTestEnum.OPTIONAL,
  'video/x-matroska; codecs="vp09.02.51.08"(vp9)': FilterTestEnum.HIDDEN,
};

function isTestHidden(name) {
  if (window.localStorage["profile"] === undefined || window.localStorage["profile"] == "All") {
    return false;
  }
  if (name in FilterTestList && FilterTestList[name] == FilterTestEnum.HIDDEN) {
    return true;
  }
  return false;
}

function isTestOptional(name) {
  if (window.localStorage["profile"] === undefined || window.localStorage["profile"] == "All") {
    return false;
  }
  if (name in FilterTestList && FilterTestList[name] == FilterTestEnum.OPTIONAL) {
    return true;
  }
  return false;
}
