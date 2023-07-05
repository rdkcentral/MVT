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

source $MVT_PATH/media/media_urls.config

export root_dir="$(dirname $(dirname "$(readlink -f "$0")"))"
export test_materials_path=$root_dir/test-materials
export media_path=$root_dir/media
export progressive_path=$test_materials_path/progressive

echo Checking ffmpeg availability
if [ ! -x "$(command -v ffmpeg)" ]; then
  echo "Missing ffmpeg!"
  exit 1
fi

function download_progressive_stream {
  local url=$1
  local name_prefix=$2
  local target_filename="${progressive_path}/${2}_h264_aac.mp4"
  local tmp_stream="${progressive_path}/.tmp_stream"
  if [ ! -f $target_filename ]; then
    echo "Downloading $1 into $target_filename"
    wget $url --no-check-certificate -O $tmp_stream
    ffmpeg -ss 00:00:00.000 -i $tmp_stream -t 120 \
      -vcodec h264 -vf scale=1280:720,fps=24 -movflags faststart \
      -acodec aac -ac 2 \
      $target_filename

    rm $tmp_stream
  else
    echo "Stream $target_filename already present, download skipped"
  fi
}

mkdir -p $progressive_path

download_progressive_stream $url_video1 "vid1"
download_progressive_stream $url_video2 "vid2"

# Prepare subtitles
mkdir -p $test_materials_path/subtitles
mkdir -p $test_materials_path/js
python3 $media_path/subs_generator.py 120 en $test_materials_path/subtitles
python3 $media_path/subs_generator.py 120 de $test_materials_path/subtitles
python3 $media_path/subs_generator.py 120 fr $test_materials_path/subtitles
python3 $media_path/subs_generator.py 120 es $test_materials_path/subtitles
mv $test_materials_path/subtitles/*.js $test_materials_path/js

$media_path/generate_progressive.sh
$media_path/generate_dash.sh
$media_path/generate_hls.sh
$media_path/generate_cmaf.sh
$media_path/generate_widevine.sh

echo "All test materials downloaded!"
