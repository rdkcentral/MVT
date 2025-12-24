#! /bin/sh
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

mkdir -p ${TEST_MATERIALS_SRC:-/data/test-materials}
BRANCH="$1"

if [ "$BRANCH" = "dev" ]; then
docker run -v ${TEST_MATERIALS_SRC:-/data/test-materials}:/home/MVT/test-materials --network onemw-mvt_default --name mvt-app-dev -d --restart unless-stopped mvt-app-img-dev

elif [ "$BRANCH" = "prod" ]; then
docker run -v ${TEST_MATERIALS_SRC:-/data/test-materials}:/home/MVT/test-materials --network onemw-mvt_default --name mvt-app -d --restart unless-stopped mvt-app-img

else
docker run -v ${TEST_MATERIALS_SRC:-/data/test-materials}:/home/MVT/test-materials --rm -d --name mvt-app -p ${PORT:-80}:80 mvt-app-img

fi