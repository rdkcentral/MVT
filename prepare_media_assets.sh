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

export progressive_path=test-materials/progressive

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
    wget $url -O $tmp_stream
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

download_progressive_stream "https://mirrors.dotsrc.org/blender/blender-demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4" "bbb"
download_progressive_stream "http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/ToS-4k-1920.mov" "tos"

# Prepare subtitles
mkdir -p test-materials/subtitles
mkdir -p test-materials/js
python3 subs_generator.py 120 en test-materials/subtitles
python3 subs_generator.py 120 de test-materials/subtitles
python3 subs_generator.py 120 fr test-materials/subtitles
python3 subs_generator.py 120 es test-materials/subtitles
mv test-materials/subtitles/*.js test-materials/js

./generate_progressive.sh
./generate_dash.sh
./generate_hls.sh
./generate_cmaf.sh

echo "All test materials downloaded!"
