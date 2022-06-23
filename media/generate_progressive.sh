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


function convert_container {
	local file=$1
	local target_file=$2
	if [ ! -f ${target_file} ]; then
		ffmpeg -y -i $file -acodec copy -vcodec copy $target_file
	fi
}

function convert_audio_codec {
	local file=$1
	local target_file=$2
	local audio_codec=$3
	if [ ! -f ${target_file} ]; then
		ffmpeg -y -i $file -acodec $audio_codec -vcodec copy -movflags faststart $target_file
	fi
}

function convert_video_codec {
	local file=$1
	local target_file=$2
	local video_codec=$3
	if [ ! -f ${target_file} ]; then
		ffmpeg -y -i $file -acodec copy -vcodec $video_codec -movflags faststart $target_file
	fi
}

convert_container $progressive_path/bbb_h264_aac.mp4 $progressive_path/bbb_h264_aac.mkv

# create alternative audio codec versions
codecs="ac3 eac3 mp3"
for codec in $codecs; do
	convert_audio_codec $progressive_path/bbb_h264_aac.mp4 "$progressive_path/bbb_h264_${codec}.mp4" $codec
	convert_audio_codec $progressive_path/bbb_h264_aac.mkv "$progressive_path/bbb_h264_${codec}.mkv" $codec
done

# create alternative video codec versions
codecs="mpeg2video vp9 mpeg4 hevc"
for codec in $codecs; do
	convert_video_codec $progressive_path/bbb_h264_aac.mp4 "$progressive_path/bbb_${codec}_aac.mp4" $codec
	convert_video_codec $progressive_path/bbb_h264_aac.mkv "$progressive_path/bbb_${codec}_aac.mkv" $codec
done

# For subtitles test
convert_container $progressive_path/tos_h264_aac.mp4 $progressive_path/tos_h264_aac.mkv

# audio only
if [ ! -f "$progressive_path/tos_eac3.mp4" ]; then
	ffmpeg -y -i $progressive_path/tos_h264_aac.mp4 -acodec "eac3" -movflags faststart -vn "$progressive_path/tos_eac3.mp4"
fi
convert_container $progressive_path/tos_eac3.mp4 "$progressive_path/tos_eac3.mkv"

# video only
if [ ! -f "$progressive_path/tos_h264.mp4" ]; then
	ffmpeg -y -i $progressive_path/tos_h264_aac.mp4 -an -vcodec copy "$progressive_path/tos_h264.mp4"
fi
convert_container $progressive_path/tos_h264.mp4 $progressive_path/tos_h264.mkv

# MP3 container
if [ ! -f "$progressive_path/tos_mp3.mp3" ]; then
	ffmpeg -y -i $progressive_path/tos_h264_aac.mp4 -acodec mp3 -vn "$progressive_path/tos_mp3.mp3"
fi