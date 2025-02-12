<!---
- If not stated otherwise in this file or this component's LICENSE file the
- following copyright and licenses apply:
-
- Copyright 2022 Liberty Global B.V.
-
- Licensed under the Apache License, Version 2.0 (the "License");
- you may not use this file except in compliance with the License.
- You may obtain a copy of the License at
-
- http://www.apache.org/licenses/LICENSE-2.0
-
- Unless required by applicable law or agreed to in writing, software
- distributed under the License is distributed on an "AS IS" BASIS,
- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
- See the License for the specific language governing permissions and
- limitations under the License.
--->

# Media Validation Tool (MVT)

Tool for verification of browser's media playback capabilities.

Supports four streaming formats and four different players:

- Progressive (native)
- DASH (native, Shaka Player, dash.js)
- HLS (Shaka Player, hls.js)
- HSS (native, dash.js)

Test streams use different audio/video/subtitles codecs and media containers. For details, see [coverage](#coverage) section.

## Source

    git clone git@github.com:rdkcentral/MVT.git
    ./prepare_submodule.sh

### Relation to js_mse_eme

MVT is built on top of YouTube's test tool [js_mse_eme](https://github.com/youtube/js_mse_eme), which is used as a git submodule and provides test execution framework and UI.

MVT introduces new tests, integration of MSE players and various media assets.

## Deployment

    # Build httpd based image and copy source files into it
    ./docker_build.sh

    # Set host directory to store media assets (~1,5 GB)
    # Default value: /data/test-materials
    export TEST_MATERIALS_SRC=/data/test-materials

    # Run container with http server on host port 8080
    PORT=8080 ./docker_run.sh

    # Populate |TEST_MATERIALS_SRC| with media assets.
    # Existing assets won't be overridden.
    # If you want to use your own videos, you need to change URL's in media/media_urls.config,
    # movies needs to be longer than 2 minutes and can be in any video format.
    # Executes in running container (mvt-app) and takes ~30 minutes on decent PC.
    ./docker_prepare_assets.sh

Up and running MVT instance: http://localhost:8080

### Stop MVT

    docker stop mvt-app

### Update application source

First cleanup old image:

    docker stop mvt-app
    docker rmi mvt-app-img

then repeat [deployment](#deployment) steps.

### Refresh media assets

Media assets are stored on host file system and are not overridden by default.
In order to regenerate all media assets simply remove the test-materials directory:

    rm -rf $TEST_MATERIALS_SRC
    ./docker_prepare_assets.sh

### External media dependencies

A list of of all external media assets used by a deployed instance of MVT:

| Stream             | Source                                                                           | URL                                                                                                                                           | Notes                                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Big Buck Bunny     | https://peach.blender.org/                                                       | https://mirrors.dotsrc.org/blender/blender-demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4.zip                                               | Licensed under Creative Commons 3.0: https://peach.blender.org/about/ <br /> Used as a base stream for assets hosted under `test-materials` |
| Tears of Steel     | https://mango.blender.org/                                                       | http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/ToS-4k-1920.mov                                                                      | Licensed under Creative Commons 3.0: https://peach.blender.org/about/ <br /> Used as a base stream for assets hosted under `test-materials` |
| DASH-CMAF-HEVC-AAC | [DASH IF](https://testassets.dashif.org/)                                        | https://dash.akamaized.net/dash264/TestCasesIOP41/CMAF/UnifiedStreaming/ToS_HEVC_MultiRate_MultiRes_AAC_Eng_WebVTT.mpd                        | Not distributed by MVT, used for playback during test execution                                                                             |
| DASH-DYNAMIC       | [DASH IF](https://testassets.dashif.org/)                                        | https://livesim.dashif.org/livesim/mup_300/tsbd_500/testpic_2s/Manifest.mpd                                                                   | Not distributed by MVT, used for playback during test execution                                                                             |
| HLS-CMAF-AVC1-AAC  | [DASH IF](https://testassets.dashif.org/)                                        | https://media.axprod.net/TestVectors/v9-MultiFormat/Clear/Manifest_1080p.m3u8                                                                 | Not distributed by MVT, used for playback during test execution                                                                             |
| HLS-CMAF-HEVC-AAC  | [DASH IF](https://testassets.dashif.org/)                                        | https://dash.akamaized.net/dash264/TestCasesIOP41/CMAF/UnifiedStreaming/ToS_HEVC_MultiRate_MultiRes_IFrame_AAC_WebVTT.m3u8                    | Not distributed by MVT, used for playback during test execution                                                                             |
| DASH-PLAYREADY-2.0 | [Microsoft PlayReady](https://testweb.playready.microsoft.com/Content/Content2X) | https://test.playready.microsoft.com/media/profficialsite/tearsofsteel_4k.ism/manifest.mpd | Not distributed by MVT, used for playback during test execution                                                                             |
| DASH-PLAYREADY-4.0 | [DASH IF](https://testassets.dashif.org/)                                        | https://media.axprod.net/TestVectors/Cmaf/protected_1080p_h264_cbcs/manifest.mpd                                                              | Not distributed by MVT, used for playback during test execution                                                                             |
| HSS-AVC1-AAC       | [DASH IF](https://testassets.dashif.org/) | https://playready.directtaps.net/smoothstreaming/SSWSS720H264/SuperSpeedway_720.ism/Manifest(format=mpd-time-csf)     | Not distributed by MVT, used for playback during test execution                                                                             |
| HSS-AVC1-AAC       | [Microsoft PlayReady](https://testweb.playready.microsoft.com/Content/Content2X) | http://profficialsite.origin.mediaservices.windows.net/c51358ea-9a5e-4322-8951-897d640fdfd7/tearsofsteel_4k.ism/manifest                      | Not distributed by MVT, used for playback during test execution                                                                             |
|DASH-PLAYREADY-CMAF | [Microsoft PlayReady] (https://github.com/Axinom/public-test-vectors)                                      | https://media.axprod.net/TestVectors/MultiKey/Cmaf_h264_1080p_cbcs/manifest.mpd                                                              | Not distributed by MVT, used for playback during test execution                                                                             |
## User Interface

![User Interface screenshot](docs/main_view.png "Main view")

Tests are grouped into test suites, which differ in streaming type (DASH, HLS, HSS, progressive) and player (Shaka Player, dash.js, hls.js, native).

The test list is generated dynamically based on available streams (`src/mediaStreams.js`),
test templates (`src/mediaTests.js`) and selected profile configuration (e.g. `src/profiles.js`).
Each test is actually an instantiation of a test template, e.g. `DASH-FMP4-AVC1-AAC Playback`
and `DASH-DYNAMIC Playback` share the same test code (`src/mediaTests.js::testPlayback`),
but use different media stream.

There are six media test templates:

- `Playback` - verifies basic playback and media position progress on the span of 10 seconds,
- `Pause` - verifies if browser is capable of pausing a stream,
- `PlayRate` - verifies playback with various playback rates,
- `Seek` - executes seek operation,
- `AudioTracks` - changes audio track,
- `Subtitles` - activates text tracks and verifies its content.

During test execution, test runner logs are printed into JavaScript console and into a div below tests list.
The video under test can be observed on the right-hand side of main view.
All interactive elements are navigable via arrow keys and can be selected through [URL parameters](#url-parameters).

### URL parameters

Test execution can be controlled through URL parameters, e.g. to run `DASH Shaka` tests 1,2,3 on Shaka Player version 2.5.20 use:

    http://MVT_INSTANCE_ADDRESS/?test_type=dash-shaka-test&testnumbers=1-3&engine_shaka=2.5.20

Most of the URL parameters can be combined. Here's a full list of supported queries:

- `test_type=SUITE_NAME` - test suite selection. Expected values:
  - codec-support-test
  - dash-html5-test
  - dash-shaka-test
  - dash-dashjs-test
  - hls-shaka-test
  - hls-hlsjs-test
  - hss-html5-test
  - hss-dashjs-test
  - progressive-html5-test
- `command=run` - test run autostart. Please note it may not work on desktop browser, because they tend to block autoplay before user interaction.
- `testnumbers=ID[,ID]|ID-ID2` - tests subset selection. Expected values:
  - Single test id e.g. `testnumbers=1`
  - Multiple test ids e.g. `testnumbers=1,5,13`
  - Test ids range e.g. `testnumbers=1-10`
- `testnames=ID[,ID]` - test names subset selection. Expected values:
  - Single test id e.g. `testnames=DASH_FMP4_AVC_AAC__Playback`
  - Multiple test ids e.g. `testnames=DASH_FMP4_AVC_AC3__Seek,DASH_FMP4_AVC_AAC__Playback,DASH_DYNAMIC`
- `exclude=ID[,ID]|ID-ID2` - exclude subsets of tests.
- `checkframes=false|true` - [default: false] enable verification of video frames progress based on `video.getVideoPlaybackQuality().totalVideoFrames`.
- `loop=false|true` - [default: false] enable testing selected tests continuosly in a loop.
- `stoponfailure=false|true` - [default: false] tests execution will stop on the first failed test.
- `disable_log=false|true` - [default: false] enable/disable logging.
- `engine_shaka=3.0.1|3.2.1|4.3.6` - [default: 3.2.1] select Shaka Player version. Please note it will only affect Shaka test suites.
- `engine_dashjs=3.1.1|4.4.0|4.7.0|latest` - [default: 4.7.0] select dash.js version. Please note it will only affect dash.js test suites.
- `engine_hlsjs=1.0.0|1.2.1|1.3.0|1.4.5` - [default: 1.4.5] select hls.js version. Please note it will only affect hls.js test suites.
- `profile=all|default|desktop|extended_drm` - [default: default] depends of tested unit.
- `debug=true|false` - [default: false] enabling the debug logs for MSE players (shaka, dash.js, hls.js) and adding additional timestamps to the output log.

### JavaScript API

`getMvtTestResults()` is a globally available JavaScript function, which can be run from the browser's console
or via WebDriver to gather the results.
It produces a JSON-like object, which should be easy to read by any automated test runner,
sample output:

```
{
    "name": "codec-support-test",
    "setup_log": "",
    "suites": [],
    "teardown_log": "",
    "tests": [
        {
            "log": "[2022-07-20T14:05:17.007Z] Test 1:IsTypeSupported video/mp4 avc STARTED with timeout 30000 \n[2022-07-20T14:05:17.010Z] Executing IsTypeSupported test for avc (video/mp4; codecs=\"avc1.4d002a\") \n[2022-07-20T14:05:17.014Z] Test 1:IsTypeSupported video/mp4 avc PASSED. \n",
            "name": "IsTypeSupported video/mp4 avc",
            "status": "passed",
            "suites_chain": "MVT_SUITE.codec-support-test",
            "time_ms": 7,
            "type": "test_result",
            "ver": "1.0"
        },
        {
            "log": "[2022-07-20T14:05:17.020Z] Test 2:IsTypeSupported video/mp2t avc STARTED with timeout 30000 \n[2022-07-20T14:05:17.023Z] Executing IsTypeSupported test for avc (video/mp2t; codecs=\"avc1.4d002a\") \n[2022-07-20T14:05:17.027Z] Test 2:IsTypeSupported video/mp2t avc FAILED \n[2022-07-20T14:05:17.032Z] Test :IsTypeSupported video/mp2t avc threw an error: Assert failed: MediaSource.isTypeSupported should be true for video/mp2t; codecs=\"avc1.4d002a\" \n",
            "name": "IsTypeSupported video/mp2t avc",
            "status": "skipped",
            "suites_chain": "MVT_SUITE.codec-support-test",
            "time_ms": 13,
            "type": "test_result",
            "ver": "1.0"
        }
    ],
    "type": "suite_result",
    "ver": "1.0"
}
```

Please note there is also the original `getTestResults()` function provided by the `js_mse_eme`.
It is still supported, but it uses different output format and does not include execution logs.

### Coverage

`/coverage.html` provides a detailed view of media test coverage.

- <span style="color:yellow">Unsupported</span> - case is unsupported, either by container, player or WPEWebKit.
- <span style="color:red">Supported, no content</span> - case is not covered by MVT test suite.
- <span style="color:green">Supported</span> - case is represented by `x` tests. Please note that it does not mean that related tests pass on the active device - it is just a coverage view which does not verify test results.

Screenshot from `v2.9.0`:
![Media coverage screenshot](docs/coverage.png "Coverage")

## Development

1. [Deploy](#deployment) the application
2. [Stop the container](#stop-mvt) - it works on build-time static copy of source files
3. Start development container with:

```
docker run -v $PWD/:/home/MVT -v $TEST_MATERIALS_SRC:/home/MVT/test-materials -p 8080:80 --rm -d -it --name mvt-app mvt-app-img:latest
```

Now you can modify MVT source code and observe changes on: http://localhost:8080/

### General

`index.html` is the entrypoint to the application.
It loads all required scripts in a specific sequence, most importantly, `suites.js`,
where all MVT tests are declared. Once all files are loaded, `startMseTest` function is triggered
in order to start `js_mse_eme` submodule and to render the UI.

### Versioning

Semantic versioning shall be used - vX.Y.Z, where:
```
X - major version (e.g. architectural changes)
Y - minor version (e.g. changes that break API, new features)
Z - patch version (e.g. bug fixes, marking tests as mandatory/optional)
```
After the PR is merged, version should be updated accordingly in the `src/main.js` file (variable `MVT_VERSION`)
and in `CHANGELOG.md`. This should be done in the another PR with the title "release: vX.Y.Z".

After PR "release: vX.Y.Z" is merged, commit should be tagged "vX.Y.Z" and a new release should be created on github.

### Adding new tests

MVT test cases are a product of test templates (`src/mediaTests.js`) and media streams (`src/mediaStreams.js`).
Test templates provide the actual test implementation, which can be parametrized with a given media stream.
It means that e.g. `DASH_FMP4_AVC_AAC Playback` and `DASH_FMP4_MPEG2_MP3 Playback` load different media content,
but the test code is exactly the same (`src/mediaTests.js::testPlayback`). Such approach allows us to verify
browser behavior depending on the media stream properties.
Furthermore, tests are splitted into suites (`suites.js`). Suites differ in type of streaming (e.g. DASH, progressive)
and player (e.g. Shaka, native).

With that in mind, if you wish to extend MVT with a media stream, then it's enough to simply declare it in
`mediaStreams.js` e.g.

```
// Media Streams
var MS = {
    DASH: {
        ...
        PLAYREADY_3_0: {
            variant: "dash",
            container: "fmp4",
            video: {
                codec: "avc",
            },
            audio: {
                codec: "aac",
            },
            src: "MANIFEST URL",
            drm: {
                servers: {
                    "com.microsoft.playready":
                    "LICENSE SERVER URL",
                },
            },
        },
        ...
```

Then the stream has to be added to some test suites in `suites.js`

However, if you wish to implement a new test template, then you have to create `TestTemplate` object:

```
let complicatedTest = new TestTemplate(`complicatedTest`, function (runner, video) {
    // Test code
    // |video| refers to active HTML5 video node
    // |runner| can be used for interactions with the test framework:
    runner.log(`Executing complicatedTest...`);
    // Failed assertion breaks test execution
    runner.assert(video.currentTime >= 0, `message on assertion failure`);
    // Call |runner.succeed| function to mark test as passed
    runner.succeed();
  });
```

The new template has to be binded with media stream and added into a test suite (see `suites.js`):

```
(function () {
  const testSuite = "DASH dashjs";
  ...
  tests.push(new MvtMediaTest(complicatedTest, MS.DASH.PLAYREADY_3_0, engine));
```

Now test case 'DASH_PLAYREADY_3_0 complicatedTest` should appear under 'DASH dashjs' test suite.

### Platform Specific Tests
The config file platform/tests.json can be used to load platform specific tests if any, to MVT during runtime.
By default the config file is empty. It can be be filled in with custom test urls where user need to specify 
the test name in "test" key and corresponding url in "url" key as given below.

[
        {
            "test": "Dummy test 1",
            "url" : "Dummy url 1"
        },
        {
            "test": "Dummy test 2",
            "url" : "Dummy url 2"
        }
]

### Prettier

Source files are auto formatted by [prettier](https://prettier.io/), which should be used before committing any changes:
`prettier -w .`

## Continuous Integration

MVT provides API for triggering tests and gathering results,
therefore it can be employed in an automated testing system.
A recommended setup is presented on below diagram:

![alt text](docs/ci_integration.png "CI integration")

### MVTServer

Deployed application from this repository.

#### MVT source

HTML, JavaScript and CSS sources from this repository.

#### test-materials

Directory with media assets generated during deployment (see `prepare_media_assets.sh`)

### DeviceUnderTest (DUT)

#### WebBrowser

WebBrowser under test (e.g. WPEWebKit).

#### WebDriver

[WebDriver client](https://www.selenium.dev/documentation/webdriver/) for test run control.

#### SSH

Interface that may be used during test setup/cleanup for any additional DUT configuration (e.g. starting WebDriver, gathering artifacts).

### CI

Any CI system which executes MVTJob regularly (e.g. Jenkins).

#### MVTJob

CI job which setups DUT, starts test suites and gathers results.
In example, to execute `DASH shaka` test suite the test runner should:

1. Start `WebBrowser` and connect to `WebDriver`
2. Start test suite by setting URL to `http://MVT_INSTANCE_ADDRESS/?test_type=dash-shaka-test&command=run`
3. Wait till tests finishes i.e. till `WebDriver` command evaluates to true:
   `return globalRunner.currentTestIdx == globalRunner.testList.length`
4. Fetch test results through `WebDriver` with `return getMvtTestResults()`
5. Parse JSON test results to adjust it for the format expected by CI system.

Same procedure can be repeated for each test suite in order to make fully automated MVT test run.
