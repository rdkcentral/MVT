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

const Players = {
  dashjs: {
    versions: ["2.9.3", "3.1.1", "3.2.1", "4.0.0", "4.2.0", "4.3.0", "latest"],
    default: "latest",
    url_pref: "https://cdn.dashjs.org",
    url_suff: "dash.all.min.js",
  },
  shaka: {
    versions: ["2.5.20", "3.0.1", "3.2.1", "3.3.7", "4.0.1", "4.1.1"],
    default: "3.2.1",
    url_pref: "https://ajax.googleapis.com/ajax/libs/shaka-player",
    url_suff: "shaka-player.compiled.js",
  },
};
