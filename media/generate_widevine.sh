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

mp4_input=$progressive_path/vid2_h264_aac.mp4
shaka_packager_url="https://github.com/shaka-project/shaka-packager/releases/download/v2.6.1/packager-linux-x64"

if [ ! -f $test_materials_path/shaka-packager ]; then
  wget $shaka_packager_url --no-check-certificate -O $test_materials_path/shaka-packager
  chmod +x $test_materials_path/shaka-packager
fi

function make_widevine {
  local video_ext=$1
  local audio_ext=$2
  local container=$3
  local encryption=$4

  if [ "$container" = "DASH" ]; then
    output_path=$test_materials_path/dash/widevine/$encryption
    manifest_cmd="--generate_static_live_mpd --mpd_output $output_path/manifest.mpd"
  elif [ "$container" = "HLS" ]; then
    output_path=$test_materials_path/hls/widevine/$encryption
    manifest_cmd="--hls_playlist_type vod --hls_master_playlist_output $output_path/manifest.m3u8"
  fi

  if [ ! -f $output_path/manifest* ]; then
    $test_materials_path/shaka-packager \
    in=$mp4_input,stream=video,init_segment=$output_path/init-stream0.$video_ext,segment_template=$output_path/chunk-stream0-\$Number\$.$video_ext \
    in=$mp4_input,stream=audio,init_segment=$output_path/init-stream1.$audio_ext,segment_template=$output_path/chunk-stream1-\$Number\$.$audio_ext \
    --protection_scheme $encryption \
    --enable_widevine_encryption \
    --key_server_url https://license.uat.widevine.com/cenc/getcontentkey/widevine_test \
    --content_id 7465737420636f6e74656e74206964 \
    --signer widevine_test \
    --aes_signing_key 1ae8ccd0e7985cc0b6203a55855a1034afc252980e970ca90e5202689f947ab9 \
    --aes_signing_iv d58ce954203b7c9a9a9d467f59839249 \
    --segment_duration 2 \
    $manifest_cmd
  fi
}

make_widevine mp4 m4a HLS cenc
make_widevine mp4 m4a HLS cbcs
make_widevine m4s m4s DASH cenc
make_widevine m4s m4s DASH cbcs
