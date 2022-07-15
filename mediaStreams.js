/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2022 Liberty Global B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

function makeTimeCountdownSubtitles() {
  try {
    return {
      de: DeSubtitles,
      en: EnSubtitles,
      es: EsSubtitles,
      fr: FrSubtitles,
    };
  } catch (e) {
    console.error("Failed to read subtitles content: " + e);
    return {
      de: [],
      en: [],
      es: [],
      fr: [],
    };
  }
}

const TimeCountdownSubtitles = makeTimeCountdownSubtitles();

const TimeCountdownSubtitlesLongLangCodes = {
  deu: TimeCountdownSubtitles["de"],
  eng: TimeCountdownSubtitles["en"],
  spa: TimeCountdownSubtitles["es"],
  fra: TimeCountdownSubtitles["fr"],
};

// Media Streams
var MS = {
  DASH: {
    FMP4_AVC_AAC: {
      container: "dash",
      variant: "fmp4",
      src: "test-materials/dash/fmp4_h264_aac/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
    },
    FMP4_AVC_AAC_TTML: {
      testBase: "1.1.2",
      container: "dash",
      variant: "fmp4",
      src: "test-materials/dash/fmp4_h264_aac_ttml/manifest_ttml.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
      subtitles: {
        format: "ttml",
        languages: ["de", "en", "fr", "es"],
        expectedText: TimeCountdownSubtitles,
      },
    },
    FMP4_AVC_AC3: {
      container: "dash",
      variant: "fmp4",
      src: "test-materials/dash/fmp4_h264_ac3/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
    },
    FMP4_HEVC_EAC3: {
      container: "dash",
      variant: "fmp4",
      src: "test-materials/dash/fmp4_hevc_eac3/manifest.mpd",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "eac3",
      },
    },
    FMP4_MPEG2_MP3: {
      container: "dash",
      variant: "fmp4",
      src: "test-materials/dash/fmp4_mpeg2_mp3/manifest.mpd",
      video: {
        codec: "mpeg2",
      },
      audio: {
        codec: "mp3",
      },
    },
    FMP4_MP3: {
      container: "dash",
      variant: "fmp4",
      src: "test-materials/dash/fmp4_mp3/manifest.mpd",
      audio: {
        codec: "mp3",
      },
    },
    WEBM_VP9_OPUS: {
      container: "dash",
      variant: "webm",
      src: "test-materials/dash/webm_vp9_opus/manifest.mpd",
      video: {
        codec: "vp9",
      },
      audio: {
        codec: "opus",
      },
    },
    WEBM_VP9_OPUS_VTT: {
      container: "dash",
      variant: "webm",
      src: "test-materials/dash/webm_vp9_opus/manifest_vtt.mpd",
      video: {
        codec: "vp9",
      },
      audio: {
        codec: "opus",
      },
      subtitles: {
        format: "webvtt",
        languages: ["de", "en", "fr", "es"],
        expectedText: TimeCountdownSubtitles,
      },
    },
    CMAF_HEVC_AAC: {
      container: "dash",
      variant: "cmaf",
      src: "https://dash.akamaized.net/dash264/TestCasesIOP41/CMAF/UnifiedStreaming/ToS_HEVC_MultiRate_MultiRes_AAC_Eng_WebVTT.mpd",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "aac",
      },
    },
    MULTIAUDIO: {
      container: "dash",
      variant: "fmp4",
      note: "video: vid1, audio en: vid1, audio pl: vid2",
      src: "test-materials/dash/fmp4_multiaudio/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
        languages: ["en", "pl"],
      },
    },
    PLAYREADY_2_0: {
      container: "dash",
      variant: "fmp4",
      note: "Source: https://testweb.playready.microsoft.com/Content/Content2X",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
      src: "http://profficialsite.origin.mediaservices.windows.net/c51358ea-9a5e-4322-8951-897d640fdfd7/tearsofsteel_4k.ism/manifest(format=mpd-time-csf)",
      drm: {
        servers: {
          "com.microsoft.playready":
            "https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)",
        },
      },
    },
    DYNAMIC: {
      container: "dash",
      variant: "fmp4",
      src: "https://livesim.dashif.org/livesim/mup_300/tsbd_500/testpic_2s/Manifest.mpd",
      dynamic: true,
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
    },
    MULTIPERIOD: {
      container: "dash",
      variant: "fmp4",
      src: "test-materials/dash/multiperiod/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
    },
    CMAF_AVC_AC3: {
      container: "dash",
      variant: "cmaf",
      src: "test-materials/cmaf/h264_ac3/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
    },
    CMAF_HEVC_EAC3: {
      container: "dash",
      name: "DASH-CMAF-HEVC-EAC3",
      src: "test-materials/cmaf/hevc_eac3/manifest.mpd",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "eac3",
      },
    },
    CMAF_AVC_MP3_VTT: {
      container: "dash",
      variant: "cmaf",
      src: "test-materials/cmaf/h264_mp3/manifest_vtt.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "mp3",
      },
      subtitles: {
        format: "webvtt",
        languages: ["de", "en", "fr", "es"],
        expectedText: TimeCountdownSubtitles,
      },
    },
  },
  HLS: {
    MP2TS_AVC_AAC: {
      container: "hls",
      variant: "mpeg2ts",
      src: "test-materials/hls/mpegts_h264_aac/main.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
    },
    FMP4_AVC_EAC3: {
      container: "hls",
      variant: "fmp4",
      src: "test-materials/hls/fmp4_h264_eac3/main.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "eac3",
      },
    },
    FMP4_HEVC_AC3: {
      container: "hls",
      variant: "fmp4",
      src: "test-materials/hls/fmp4_hevc_ac3/main.m3u8",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "ac3",
      },
    },
    FMP4_MP3: {
      container: "hls",
      variant: "fmp4",
      src: "test-materials/hls/fmp4_mp3/main.m3u8",
      audio: {
        codec: "mp3",
      },
    },
    FMP4_MULTIAUDIO: {
      container: "hls",
      variant: "fmp4",
      src: "test-materials/hls/fmp4_multiaudio/main.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
        languages: ["en", "pl"],
      },
    },
    FMP4_AVC_AAC_VTT: {
      container: "hls",
      variant: "fmp4",
      src: "test-materials/hls/fmp4_h264_aac_vtt/main.m3u8",
      note: "TODO: Prepare stream with multiple subtitles tracks (hard to achieve with ffmpeg)",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
      subtitles: {
        format: "webvtt",
        languages: ["en"],
        testLanguages: ["en"],
        expectedText: TimeCountdownSubtitles,
      },
    },
    CMAF_AVC_AAC: {
      container: "hls",
      variant: "cmaf",
      note: "Source: https://testassets.dashif.org/",
      src: "https://media.axprod.net/TestVectors/v9-MultiFormat/Clear/Manifest_1080p.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
    },
    CMAF_HEVC_AAC: {
      container: "hls",
      variant: "cmaf",
      note: "Source: https://testassets.dashif.org/",
      src: "https://dash.akamaized.net/dash264/TestCasesIOP41/CMAF/UnifiedStreaming/ToS_HEVC_MultiRate_MultiRes_IFrame_AAC_WebVTT.m3u8",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "aac",
      },
    },
    CMAF_AVC_AC3: {
      container: "hls",
      variant: "cmaf",
      src: "test-materials/cmaf/h264_ac3/master.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
    },
    CMAF_HEVC_EAC3: {
      container: "hls",
      variant: "cmaf",
      src: "test-materials/cmaf/hevc_eac3/master.m3u8",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "eac3",
      },
    },
    CMAF_AVC_MP3: {
      container: "hls",
      variant: "cmaf",
      src: "test-materials/cmaf/h264_mp3/master.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "mp3",
        channels: "2",
      },
    },
  },
  HSS: [
    {
      testBase: "3.1.1",
      container: "hss",
      variant: "fmp4",
      name: "HSS-AVC1-AAC",
      note: "Source: https://testweb.playready.microsoft.com/Content/Content2X",
      src: "http://amssamples.streaming.mediaservices.windows.net/683f7e47-bd83-4427-b0a3-26a6c4547782/BigBuckBunny.ism/manifest(format=mpd-time-csf)",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
      subtitles: {
        format: "track-tag-webvtt",
        languages: ["de", "en", "fr", "es"],
        expectedText: TimeCountdownSubtitles,
        tracks: [
          { lang: "de", src: "test-materials/subtitles/countdown-de.vtt" },
          { lang: "en", src: "test-materials/subtitles/countdown-en.vtt" },
          { lang: "fr", src: "test-materials/subtitles/countdown-fr.vtt" },
          { lang: "es", src: "test-materials/subtitles/countdown-es.vtt" },
        ],
      },
    },
    {
      testBase: "3.1.2",
      container: "hss",
      variant: "fmp4",
      name: "HSS-AVC1-AAC-PLAYREADY-2.0",
      note: "Source: https://testweb.playready.microsoft.com/Content/Content2X",
      src: "http://profficialsite.origin.mediaservices.windows.net/c51358ea-9a5e-4322-8951-897d640fdfd7/tearsofsteel_4k.ism/manifest",
      drm: {
        servers: {
          "com.microsoft.playready":
            "https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)",
        },
      },
      video: {
        codec: "avc",
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
  ],
  Progressive: [
    {
      testBase: "4.1.1",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-AVC1-AAC-WEBVTT",
      src: "test-materials/progressive/vid2_h264_aac.mp4",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
      subtitles: {
        format: "track-tag-webvtt",
        languages: ["de", "en", "fr", "es"],
        expectedText: TimeCountdownSubtitles,
        tracks: [
          { lang: "de", src: "test-materials/subtitles/countdown-de.vtt" },
          { lang: "en", src: "test-materials/subtitles/countdown-en.vtt" },
          { lang: "fr", src: "test-materials/subtitles/countdown-fr.vtt" },
          { lang: "es", src: "test-materials/subtitles/countdown-es.vtt" },
        ],
      },
    },
    {
      testBase: "4.1.1",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-AVC1-AAC-WEBVTT",
      src: "test-materials/progressive/vid2_h264_aac.mkv",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
      subtitles: {
        format: "track-tag-webvtt",
        languages: ["de", "en", "fr", "es"],
        expectedText: TimeCountdownSubtitles,
        tracks: [
          { lang: "de", src: "test-materials/subtitles/countdown-de.vtt" },
          { lang: "en", src: "test-materials/subtitles/countdown-en.vtt" },
          { lang: "fr", src: "test-materials/subtitles/countdown-fr.vtt" },
          { lang: "es", src: "test-materials/subtitles/countdown-es.vtt" },
        ],
      },
    },
    {
      testBase: "4.1.2",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-AVC1-AC3",
      src: "test-materials/progressive/vid1_h264_ac3.mp4",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.a5",
        channels: "2",
      },
    },
    {
      testBase: "4.1.2",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-AVC1-AC3",
      src: "test-materials/progressive/vid1_h264_ac3.mkv",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.a5",
        channels: "2",
      },
    },
    {
      testBase: "4.1.3",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-AVC1-EAC3",
      src: "test-materials/progressive/vid1_h264_eac3.mp4",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
      audio: {
        codec: "eac3",
        channels: "2",
      },
    },
    {
      testBase: "4.1.3",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-AVC1-EAC3",
      src: "test-materials/progressive/vid1_h264_eac3.mkv",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
      audio: {
        codec: "eac3",
        channels: "2",
      },
    },
    {
      testBase: "4.1.4",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-AVC1-MP3",
      src: "test-materials/progressive/vid1_h264_mp3.mp4",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp3",
        channels: "2",
      },
    },
    {
      testBase: "4.1.4",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-AVC1-MP3",
      src: "test-materials/progressive/vid1_h264_mp3.mkv",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp3",
        channels: "2",
      },
    },
    {
      testBase: "4.1.5",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-HEVC-AAC",
      src: "test-materials/progressive/vid1_hevc_aac.mp4",
      video: {
        codec: "hvc1.1.6.L120.80",
        resolution: [1920, 800],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "4.1.5",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-HEVC-AAC",
      src: "test-materials/progressive/vid1_hevc_aac.mkv",
      video: {
        codec: "hvc1.1.6.L120.80",
        resolution: [1920, 800],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "4.1.6",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-MPEG2V-AAC",
      src: "test-materials/progressive/vid1_mpeg2video_aac.mp4",
      video: {
        codec: "mp2",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "4.1.6",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-MPEG2V-AAC",
      src: "test-materials/progressive/vid1_mpeg2video_aac.mkv",
      video: {
        codec: "mp2",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "4.1.7",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-VP9-AAC",
      src: "test-materials/progressive/vid1_vp9_aac.mp4",
      video: {
        codec: "vp09.00.20.08.00.02.02.02.00",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "4.1.7",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-VP9-AAC",
      src: "test-materials/progressive/vid1_vp9_aac.mkv",
      video: {
        codec: "vp09.00.20.08.00.02.02.02.00",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "4.1.8",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-MPEG4PART2-AAC",
      src: "test-materials/progressive/vid1_mpeg2video_aac.mp4",
      video: {
        codec: "mpeg4part2",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "4.1.8",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-MPEG4PART2-AAC",
      src: "test-materials/progressive/vid1_mpeg2video_aac.mkv",
      video: {
        codec: "mpeg4part2",
        resolution: [1280, 720],
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "4.1.8",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-EAC3",
      src: "test-materials/progressive/vid2_eac3.mp4",
      audio: {
        codec: "eac3",
        channels: "2",
      },
    },
    {
      testBase: "4.1.8",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-EAC3",
      src: "test-materials/progressive/vid2_eac3.mkv",
      audio: {
        codec: "eac3",
        channels: "2",
      },
    },
    {
      testBase: "4.1.8",
      container: "progressive",
      variant: "mp4",
      name: "PROG-MP4-AVC1",
      src: "test-materials/progressive/vid2_h264.mp4",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
    },
    {
      testBase: "4.1.8",
      container: "progressive",
      variant: "mkv",
      name: "PROG-MKV-AVC1",
      src: "test-materials/progressive/vid2_h264.mkv",
      video: {
        codec: "avc1.42C01E",
        resolution: [1280, 720],
      },
    },
    {
      testBase: "4.1.9",
      container: "progressive",
      variant: "mp3",
      name: "PROG-MP3-MP3",
      src: "test-materials/progressive/vid2_mp3.mp3",
      audio: {
        codec: "mp3",
        channels: "2",
      },
    },
  ],
};

(function setMediaStreamNames() {
  Object.keys(MS).forEach((category) => {
    Object.keys(MS[category]).forEach((streamName) => {
      MS[category][streamName].name = `${category}_${streamName}`.toUpperCase();
    });
  });
})();

const StreamSets = {
  DASH: {
    Common: [
      MS.DASH.FMP4_AVC_AAC,
      MS.DASH.FMP4_AVC_AC3,
      MS.DASH.FMP4_HEVC_EAC3,
      MS.DASH.FMP4_MPEG2_MP3,
      MS.DASH.FMP4_MP3,
      MS.DASH.WEBM_VP9_OPUS,
      MS.DASH.MULTIPERIOD,
      MS.DASH.CMAF_HEVC_AAC,
      MS.DASH.DYNAMIC,
      MS.DASH.CMAF_AVC_AC3,
      MS.DASH.CMAF_HEVC_EAC3,
      MS.DASH.CMAF_AVC_MP3_VTT,
    ],
    DRM: [MS.DASH.PLAYREADY_2_0],
    Subtitles: [MS.DASH.FMP4_AVC_AAC_TTML, MS.DASH.WEBM_VP9_OPUS_VTT, MS.DASH.CMAF_AVC_MP3_VTT],
  },
  HLS: {
    Common: [
      MS.HLS.MP2TS_AVC_AAC,
      MS.HLS.FMP4_AVC_EAC3,
      MS.HLS.FMP4_HEVC_AC3,
      MS.HLS.FMP4_MP3,
      MS.HLS.CMAF_AVC_AAC,
      MS.HLS.CMAF_HEVC_AAC,
      MS.HLS.CMAF_AVC_AC3,
      MS.HLS.CMAF_HEVC_EAC3,
      MS.HLS.CMAF_AVC_MP3,
    ],
    Subtitles: [MS.HLS.FMP4_AVC_AAC_VTT]
  }
};