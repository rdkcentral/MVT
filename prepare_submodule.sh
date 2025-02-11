#! /bin/bash
#
# If not stated otherwise in this file or this component's LICENSE file the
# following copyright and licenses apply:
#
# Copyright 2022 Liberty Global B.V.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -e

git submodule update --init --remote
cd js_mse_eme
git apply ../patches/0001_js_mse_eme_mvt.patch
git apply ../patches/0002_js_mse_eme_mvt_AudioTagChangeFor_FMP4_FMP3_stream.patch
git apply ../patches/0003_js_mse_eme_mvt_Add_HtmlTests.patch
git apply ../patches/0004_js_mse_eme_mvt_Add_CSSTests.patch
git apply ../patches/0005_js_mse_eme_mvt_Add_JSTests.patch
git apply ../patches/0006_js_mse_eme_mvt_Add_WPTTests.patch
git apply ../patches/0007_js_mse_eme_mvt_Add_Browse_Media_Assets.patch
git apply ../patches/0008_js_mse_eme_mvt_dynamic_loading_platform_tests.patch

