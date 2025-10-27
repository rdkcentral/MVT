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

dash_path=$test_materials_path/dash

function make_fmp4_dash {
  local input=$1
  local vcodec=$2
  local acodec=$3
  local stream_dir=$4
  local ffmpeg_args=$5
  local streamloop="${6:-0}"

  local manifest_path=$stream_dir/manifest.mpd
  if [ ! -f $manifest_path ]; then
    mkdir -p $stream_dir
    ffmpeg -stream_loop $streamloop -i $input \
      -map 0:v:0 -map 0:v:0 -map 0:v:0 -map 0:a:0 \
      -b:v:0 350k -c:v:0 $vcodec -filter:v:0 'scale=320:-1' -g 96 -keyint_min 24 \
      -b:v:1 1000k -c:v:1 $vcodec -filter:v:1 "scale=640:-1"  -g 96 -keyint_min 24 \
      -b:v:2 3000k -c:v:2 $vcodec -filter:v:2 "scale=1280:-1" -g 96 -keyint_min 24 \
      -b:a:0 192k -c:a:0 $acodec -metadata:s:a:0 language=en \
      -streaming 1 -use_timeline 1 -seg_duration 2 \
      -adaptation_sets "id=0,streams=v  id=1,streams=a" \
      $ffmpeg_args -dash_segment_type mp4 -f dash $manifest_path
  fi
}

function make_webm_dash {
  local input=$1
  local stream_dir=$2

  local manifest_path=$stream_dir/manifest.mpd
  if [ ! -f $manifest_path ]; then
    mkdir -p $stream_dir

    # Based on Google's guide:
    # https://sites.google.com/a/webmproject.org/wiki/adaptive-streaming/instructions-to-playback-adaptive-webm-using-dash
    VP9_DASH_PARAMS="-tile-columns 4 -frame-parallel 1"

    ffmpeg -i $input \
      -c:v libvpx-vp9 -s 320x180 -b:v 0 -crf 40 -keyint_min 150 -g 150 ${VP9_DASH_PARAMS} \
      -an -f webm -dash 1 $stream_dir/video_320x180.webm

    ffmpeg -i $input \
      -c:v libvpx-vp9 -s 640x360 -b:v 0 -crf 25 -keyint_min 150 -g 150 ${VP9_DASH_PARAMS} \
      -an -f webm -dash 1 $stream_dir/video_640x360.webm

    ffmpeg -i $input \
      -c:v libvpx-vp9 -s 1280x720 -b:v 0 -crf 10 -keyint_min 150 -g 150 ${VP9_DASH_PARAMS} \
      -an -f webm -dash 1 $stream_dir/video_1280x720.webm

    ffmpeg -i $input -c:a libopus -b:a 128k -vn -f webm -dash 1 $stream_dir/audio_128k.webm

    ffmpeg \
      -f webm_dash_manifest -i $stream_dir/video_320x180.webm \
      -f webm_dash_manifest -i $stream_dir/video_640x360.webm \
      -f webm_dash_manifest -i $stream_dir/video_1280x720.webm \
      -f webm_dash_manifest -i $stream_dir/audio_128k.webm \
      -c copy -map 0 -map 1 -map 2 -map 3 \
      -f webm_dash_manifest \
      -adaptation_sets "id=0,streams=0,1,2 id=1,streams=3" \
      $manifest_path
  fi
}

make_fmp4_dash $progressive_path/vid1_h264_aac.mp4 libx264 aac $dash_path/fmp4_h264_aac
make_fmp4_dash $progressive_path/vid1_h264_aac.mp4 libx264 ac3 $dash_path/fmp4_h264_ac3
make_fmp4_dash $progressive_path/vid1_h264_aac.mp4 libx265 eac3 $dash_path/fmp4_hevc_eac3

# fMP4 with single MP3 track (audio only)
if [ ! -f $dash_path/fmp4_mp3/manifest.mpd ]; then
  mkdir -p $dash_path/fmp4_mp3
  ffmpeg -i $progressive_path/vid2_h264_aac.mp4 \
    -vn -c:a mp3 -streaming 1 -use_timeline 1 -seg_duration 5 \
    -dash_segment_type mp4 -f dash $dash_path/fmp4_mp3/manifest.mpd
fi

# MPEG-2 video codec with codec name changed from mp4v.61 to mpeg in the manifest.
if [ ! -f $dash_path/fmp4_mpeg2_mp3/manifest.mpd ]; then
  make_fmp4_dash $progressive_path/vid1_h264_aac.mp4 mpeg2video mp3 $dash_path/fmp4_mpeg2_mp3 "-s:v:0 640x360 -b:v:0 2500k"
  sed -i 's/codecs="mp4v.61"/codecs="mpeg"/g' $dash_path/fmp4_mpeg2_mp3/manifest.mpd
fi

# Multiple periods (20s long period multiplied 6 times)
if [ ! -f $dash_path/multiperiod/manifest.mpd ]; then
  make_fmp4_dash $progressive_path/vid1_h264_aac.mp4 libx264 aac $dash_path/multiperiod "-t 20"
  mv $dash_path/multiperiod/manifest.mpd $dash_path/multiperiod/single_period.mpd
  python3 $media_path/mpd_processor.py multiperiod $dash_path/multiperiod/single_period.mpd 20 6 $dash_path/multiperiod/manifest.mpd
fi

if [ ! -f $dash_path/fmp4_multiaudio/manifest.mpd ]; then
  mkdir -p $dash_path/fmp4_multiaudio
  ffmpeg -i $progressive_path/vid1_h264_aac.mp4 -i $progressive_path/vid2_h264_aac.mp4 \
    -map 0:v:0 -map 0:a:0 -map 1:a:0 \
    -b:v:0 1000k -c:v:1 h264 -filter:v:1 "scale=640:-1"  -g 96 -keyint_min 24 \
    -b:a:0 192k -c:a:0 aac -metadata:s:a:0 language=en \
    -b:a:1 192k -c:a:1 aac -metadata:s:a:1 language=pl \
    -streaming 1 -use_timeline 1 -seg_duration 2 \
    -adaptation_sets "id=0,streams=0  id=1,streams=1 id=2,streams=2" \
    -dash_segment_type mp4 -f dash $dash_path/fmp4_multiaudio/manifest.mpd
fi

# WEBM with VTT subtitles
if [ ! -f $dash_path/webm_vp9_opus/manifest_vtt.mpd ]; then
  make_webm_dash $progressive_path/vid2_h264_aac.mp4 $dash_path/webm_vp9_opus
  python3 $media_path/mpd_processor.py add_subtitles $dash_path/webm_vp9_opus/manifest.mpd vtt $dash_path/webm_vp9_opus/manifest_vtt.mpd
fi

# fMP4 with TTML subtitles
if [ ! -f $dash_path/fmp4_h264_aac_ttml/manifest_ttml.mpd ]; then
  make_fmp4_dash $progressive_path/vid2_h264_aac.mp4 libx264 aac $dash_path/fmp4_h264_aac_ttml
  python3 $media_path/mpd_processor.py add_subtitles $dash_path/fmp4_h264_aac_ttml/manifest.mpd ttml \
    $dash_path/fmp4_h264_aac_ttml/manifest_ttml.mpd
fi

#Generate long duration dash stream by appending video in a loop such that play duration >= 1.5hrs
#input video duration = 2mins, so the number of loops required is 45 to get 92 min video
make_fmp4_dash $progressive_path/vid1_h264_aac.mp4 libx264 aac $dash_path/longdur "" 45

