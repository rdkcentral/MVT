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

hls_path=$test_materials_path/hls

function make_fmp4_audio_hls {
  local input=$1
  local acodec=$2
  local stream_dir=$3

  if [ ! -f $stream_dir/main.m3u8 ]; then
    mkdir -p $stream_dir
    ffmpeg -i $input \
      -map 0:a:0 \
      -b:a:0 128k -c:a:0 $acodec -metadata:s:a:0 language=en \
      -movflags faststart+frag_keyframe+empty_moov+default_base_moof \
      -f hls -hls_time 4 -hls_playlist_type vod -hls_flags independent_segments \
      -hls_segment_type fmp4 -hls_segment_filename $stream_dir/stream_%v/data%02d.mp4 \
      -master_pl_name main.m3u8 \
      -var_stream_map 'a:0' $stream_dir/stream_%v/.m3u8
  fi

}

function make_hls {
  local input=$1
  local container=$2
  local vcodec=$3
  local acodec=$4
  local stream_dir=$5
  local streamloop="${6:-0}"
  local extension="mp4"
  if [[ $container == "mpegts" ]]; then
    extension="ts"
  fi

  if [ ! -f $stream_dir/main.m3u8 ]; then
    mkdir -p $stream_dir
    local video_args='-g 48 -sc_threshold 0 -keyint_min 48'
    ffmpeg -stream_loop $streamloop -i $input \
      -filter_complex \
      '[0:v]split=3[v1][v2][v3]; [v1]scale=w=1280:h=720[v0out]; [v2]scale=w=640:h=360[v1out]; [v3]scale=w=360:h=180[v2out]' \
      -map "[v0out]" -c:v:0 $vcodec -profile:v:0 main -b:v:0 5M -maxrate:v:0 5M -minrate:v:0 5M -bufsize:v:0 10 $video_args \
      -map "[v1out]" -c:v:1 $vcodec -profile:v:1 main -b:v:1 1M -maxrate:v:1 1M -minrate:v:1 1M -bufsize:v:1 2 $video_args \
      -map "[v2out]" -c:v:2 $vcodec -profile:v:2 main -b:v:1 500K -maxrate:v:1 500K -minrate:v:1 500K -bufsize:v:1 1 $video_args \
      -map a:0 -c:a $acodec -b:a 128k -ac 2 \
      -f hls -hls_time 4 -hls_playlist_type vod -hls_flags independent_segments \
      -hls_segment_type $container -hls_segment_filename $stream_dir/stream_%v/data%02d.$extension -master_pl_name main.m3u8 \
      -var_stream_map "a:0,agroup:audio128 v:0,agroup:audio128 v:1,agroup:audio128 v:2,agroup:audio128" \
      $stream_dir/stream_%v/.m3u8
  fi
}

make_hls $progressive_path/vid1_h264_aac.mp4 mpegts libx264 copy $hls_path/mpegts_h264_aac
make_hls $progressive_path/vid1_h264_aac.mp4 fmp4 libx264 eac3 $hls_path/fmp4_h264_eac3
make_hls $progressive_path/vid2_h264_aac.mp4 fmp4 hevc ac3 $hls_path/fmp4_hevc_ac3
make_fmp4_audio_hls $progressive_path/vid2_h264_aac.mp4 mp3 $hls_path/fmp4_mp3

# Two audio tracks with different languages
if [ ! -f $hls_path/fmp4_multiaudio/main.m3u8 ]; then
  mkdir -p $hls_path/fmp4_multiaudio
  ffmpeg -i $progressive_path/vid1_h264_aac.mp4 -i $progressive_path/vid2_h264_aac.mp4 \
    -map 0:v:0 -map 0:a:0 -map 1:a:0 \
    -b:v:0 1000k -c:v:1 copy -filter:v:1 "scale=640:-1" -g 96 -keyint_min 24 \
    -b:a:0 192k -c:a:0 copy -metadata:s:a:0 language=en \
    -b:a:1 192k -c:a:1 copy -metadata:s:a:1 language=pl \
    -f hls -hls_time 4 -hls_playlist_type vod -hls_flags independent_segments \
    -hls_segment_type fmp4 -hls_segment_filename $hls_path/fmp4_multiaudio/stream_%v/data%02d.mp4 \
    -master_pl_name main.m3u8 \
    -var_stream_map "a:0,agroup:audio128,language:en a:1,agroup:audio128,language:pl v:0,agroup:audio128" \
    $hls_path/fmp4_multiaudio/stream_%v/.m3u8
fi

# WebVTT subtitles
if [ ! -f $hls_path/fmp4_h264_aac_vtt/main.m3u8 ]; then
  mkdir -p $hls_path/fmp4_h264_aac_vtt
  ffmpeg -i $progressive_path/vid2_h264_aac.mp4 \
    -i $test_materials_path/subtitles/countdown-en.vtt \
    -map 0:v:0 -map 0:a:0 -map 1:s:0 \
    -b:v:0 1000k -c:v:1 copy -filter:v:1 "scale=640:-1" \
    -b:a:0 192k -c:a:0 copy -metadata:s:a:0 language=en \
    -c:s:0 webvtt -metadata:s:s:0 language=en \
    -f hls -hls_time 4 -hls_playlist_type vod -hls_flags independent_segments \
    -hls_segment_type fmp4 -hls_segment_filename $hls_path/fmp4_h264_aac_vtt/stream_%v/data%02d.mp4 \
    -master_pl_name main.m3u8 \
    -var_stream_map "v:0,a:0,s:0,sgroup:subtitles,language:en" \
    $hls_path/fmp4_h264_aac_vtt/stream_%v/.m3u8
fi

#Generate long duration dash stream by appending video in a loop such that play duration >= 1.5hrs
#input video duration = 2mins, so the number of loops required is 45 to get 92 min video
make_hls $progressive_path/vid1_h264_aac.mp4 mpegts libx264 aac $hls_path/longdur 45
