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

cmaf_path=$test_materials_path/cmaf

function make_cmaf {
    local input=$1
    local vcodec=$2
    local acodec=$3
    local stream_dir=$4
    local manifest_path=$stream_dir/manifest.mpd

    if [ ! -f $manifest_path ]; then
        mkdir -p $stream_dir
        ffmpeg -i $input \
            -map 0:v:0 -map 0:v:0 -map 0:v:0 -map 0:a:0 \
            -b:v:0 350k -c:v:0 $vcodec -filter:v:0 'scale=320:-1' \
            -b:v:1 1000k -c:v:1 $vcodec -filter:v:1 "scale=640:-1" \
            -b:v:2 3000k -c:v:2 $vcodec -filter:v:2 "scale=1280:-1" \
            -b:a:0 192k -c:a:0 $acodec -metadata:s:a:0 language=en \
            -bf 1 -keyint_min 120 -g 120 -sc_threshold 0 -b_strategy 0 \
            -use_timeline 1 -seg_duration 4 -adaptation_sets "id=0,streams=v id=1,streams=a" \
            -hls_playlist 1 -hls_playlist_type vod \
            -dash_segment_type mp4 -f dash $manifest_path
    fi
}

make_cmaf $progressive_path/vid2_h264_aac.mp4 libx264 ac3 $cmaf_path/h264_ac3
make_cmaf $progressive_path/vid2_h264_aac.mp4 hevc eac3 $cmaf_path/hevc_eac3

# h264+mp3 with VTT subtitles for DASH
if [ ! -f $cmaf_path/h264_mp3/manifest_vtt.mpd ]; then
    make_cmaf $progressive_path/vid2_h264_aac.mp4 libx264 mp3 $cmaf_path/h264_mp3
    python3 $media_path/mpd_processor.py add_subtitles $cmaf_path/h264_mp3/manifest.mpd vtt $cmaf_path/h264_mp3/manifest_vtt.mpd
fi
