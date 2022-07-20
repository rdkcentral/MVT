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
 * Very basic implementation capable of marking some tests as optional/hidden.
 * Uses test name comparison, so it does not consider player type  or engine version.
 */

"use strict";

const BlockStateEnum = {
  ENABLED: 0,
  HIDDEN: 1,
  OPTIONAL: 2,
};

var TestsBlockList = {
  "PROG-MKV-EAC3 Position": BlockStateEnum.OPTIONAL,
  'audio/mp2t; codecs="mp4a.40.29"(aac)': BlockStateEnum.HIDDEN,
  'audio/mp2t; codecs="mp4a.69"(mp3)': BlockStateEnum.HIDDEN,
  'audio/mp2t; codecs="mp4a.a5"(ac3)': BlockStateEnum.HIDDEN,
  'audio/mp2t; codecs="mp4a.a6"(eac3)': BlockStateEnum.HIDDEN,
  'audio/x-matroska; codecs="mp4a.40.29"(aac)': BlockStateEnum.HIDDEN,
  'audio/x-matroska; codecs="mp4a.69"(mp3)': BlockStateEnum.HIDDEN,
  'audio/x-matroska; codecs="mp4a.a5"(ac3)': BlockStateEnum.HIDDEN,
  'audio/x-matroska; codecs="mp4a.a6"(eac3)': BlockStateEnum.HIDDEN,
  'audio/x-matroska; codecs="opus"(opus)': BlockStateEnum.HIDDEN,
  'video/mp2t; codecs="avc1.64002a"(avc1)': BlockStateEnum.OPTIONAL,
  'video/webm; codecs="vp09.02.51.08"(vp9)': BlockStateEnum.OPTIONAL,
  'video/x-matroska; codecs="avc1.64002a"(avc1)': BlockStateEnum.OPTIONAL,
  'video/x-matroska; codecs="hvc1.2.4.L153.00"(hevc)': BlockStateEnum.OPTIONAL,
  'video/x-matroska; codecs="vp09.02.51.08"(vp9)': BlockStateEnum.HIDDEN,
};

function isTestHidden(name) {
  if (window.localStorage["profile"] === undefined || window.localStorage["profile"] == "all") {
    return false;
  }
  if (name in TestsBlockList && TestsBlockList[name] == BlockStateEnum.HIDDEN) {
    return true;
  }
  return false;
}

function isTestOptional(name) {
  if (window.localStorage["profile"] === undefined || window.localStorage["profile"] == "all") {
    return false;
  }
  if (name in TestsBlockList && TestsBlockList[name] == BlockStateEnum.OPTIONAL) {
    return true;
  }
  return false;
}
