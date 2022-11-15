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

FROM httpd:latest
COPY httpd.conf /usr/local/apache2/conf/httpd.conf

ARG MVT_PATH=/home/MVT
ENV MVT_PATH=$MVT_PATH

RUN mkdir -p $MVT_PATH
COPY . $MVT_PATH
WORKDIR $MVT_PATH

RUN apt-get update
RUN apt-get install -y ffmpeg wget python3
