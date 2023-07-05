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
      variant: "dash",
      container: "fmp4",
      src: "test-materials/dash/fmp4_h264_aac/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
    },
    FMP4_AVC_AAC_TTML: {
      variant: "dash",
      container: "fmp4",
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
      variant: "dash",
      container: "fmp4",
      src: "test-materials/dash/fmp4_h264_ac3/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
    },
    FMP4_HEVC_EAC3: {
      variant: "dash",
      container: "fmp4",
      src: "test-materials/dash/fmp4_hevc_eac3/manifest.mpd",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "eac3",
      },
    },
    FMP4_MPEG2_MP3: {
      variant: "dash",
      container: "fmp4",
      src: "test-materials/dash/fmp4_mpeg2_mp3/manifest.mpd",
      video: {
        codec: "mpeg2",
      },
      audio: {
        codec: "mp3",
      },
    },
    FMP4_MP3: {
      variant: "dash",
      container: "fmp4",
      src: "test-materials/dash/fmp4_mp3/manifest.mpd",
      audio: {
        codec: "mp3",
      },
    },
    WEBM_VP9_OPUS: {
      variant: "dash",
      container: "webm",
      src: "test-materials/dash/webm_vp9_opus/manifest.mpd",
      video: {
        codec: "vp9",
      },
      audio: {
        codec: "opus",
      },
    },
    WEBM_VP9_OPUS_VTT: {
      variant: "dash",
      container: "webm",
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
      variant: "dash",
      container: "cmaf",
      src: "https://dash.akamaized.net/dash264/TestCasesIOP41/CMAF/UnifiedStreaming/ToS_HEVC_MultiRate_MultiRes_AAC_Eng_WebVTT.mpd",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "aac",
      },
    },
    MULTIAUDIO: {
      variant: "dash",
      container: "fmp4",
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
      variant: "dash",
      container: "fmp4",
      note: "Source: https://testweb.playready.microsoft.com/Content/Content2X",
      src: "http://profficialsite.origin.mediaservices.windows.net/c51358ea-9a5e-4322-8951-897d640fdfd7/tearsofsteel_4k.ism/manifest(format=mpd-time-csf)",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
      drm: {
        servers: {
          "com.microsoft.playready": {
            serverURL: "https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)",
          },
        },
        shaka: {
          "com.microsoft.playready":
            "https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)",
        },
      },
    },
    PLAYREADY_4_0_CBCS: {
      variant: "dash",
      container: "fmp4",
      note: "PLayReady 4.0 with CBCS encryption",
      src: "https://media.axprod.net/TestVectors/Cmaf/protected_1080p_h264_cbcs/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
      drm: {
        servers: {
          "com.microsoft.playready": {
            serverURL: "https://drm-playready-licensing.axprod.net/AcquireLicense",
            httpRequestHeaders: {
              "X-AxDRM-Message":
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJ2ZXJzaW9uIjogMSwKICAiY29tX2tleV9pZCI6ICI2OWU1NDA4OC1lOWUwLTQ1MzAtOGMxYS0xZWI2ZGNkMGQxNGUiLAogICJtZXNzYWdlIjogewogICAgInR5cGUiOiAiZW50aXRsZW1lbnRfbWVzc2FnZSIsCiAgICAidmVyc2lvbiI6IDIsCiAgICAibGljZW5zZSI6IHsKICAgICAgImFsbG93X3BlcnNpc3RlbmNlIjogdHJ1ZQogICAgfSwKICAgICJjb250ZW50X2tleXNfc291cmNlIjogewogICAgICAiaW5saW5lIjogWwogICAgICAgIHsKICAgICAgICAgICJpZCI6ICIzMDJmODBkZC00MTFlLTQ4ODYtYmNhNS1iYjFmODAxOGEwMjQiLAogICAgICAgICAgImVuY3J5cHRlZF9rZXkiOiAicm9LQWcwdDdKaTFpNDNmd3YremZ0UT09IiwKICAgICAgICAgICJ1c2FnZV9wb2xpY3kiOiAiUG9saWN5IEEiCiAgICAgICAgfQogICAgICBdCiAgICB9LAogICAgImNvbnRlbnRfa2V5X3VzYWdlX3BvbGljaWVzIjogWwogICAgICB7CiAgICAgICAgIm5hbWUiOiAiUG9saWN5IEEiLAogICAgICAgICJwbGF5cmVhZHkiOiB7CiAgICAgICAgICAibWluX2RldmljZV9zZWN1cml0eV9sZXZlbCI6IDE1MCwKICAgICAgICAgICJwbGF5X2VuYWJsZXJzIjogWwogICAgICAgICAgICAiNzg2NjI3RDgtQzJBNi00NEJFLThGODgtMDhBRTI1NUIwMUE3IgogICAgICAgICAgXQogICAgICAgIH0KICAgICAgfQogICAgXQogIH0KfQ._NfhLVY7S6k8TJDWPeMPhUawhympnrk6WAZHOVjER6M",
            },
          },
        },
        shaka: {
          servers: {
            "com.microsoft.playready": "https://drm-playready-licensing.axprod.net/AcquireLicense",
          },
        },
        shaka_headers: [
          "X-AxDRM-Message",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJ2ZXJzaW9uIjogMSwKICAiY29tX2tleV9pZCI6ICI2OWU1NDA4OC1lOWUwLTQ1MzAtOGMxYS0xZWI2ZGNkMGQxNGUiLAogICJtZXNzYWdlIjogewogICAgInR5cGUiOiAiZW50aXRsZW1lbnRfbWVzc2FnZSIsCiAgICAidmVyc2lvbiI6IDIsCiAgICAibGljZW5zZSI6IHsKICAgICAgImFsbG93X3BlcnNpc3RlbmNlIjogdHJ1ZQogICAgfSwKICAgICJjb250ZW50X2tleXNfc291cmNlIjogewogICAgICAiaW5saW5lIjogWwogICAgICAgIHsKICAgICAgICAgICJpZCI6ICIzMDJmODBkZC00MTFlLTQ4ODYtYmNhNS1iYjFmODAxOGEwMjQiLAogICAgICAgICAgImVuY3J5cHRlZF9rZXkiOiAicm9LQWcwdDdKaTFpNDNmd3YremZ0UT09IiwKICAgICAgICAgICJ1c2FnZV9wb2xpY3kiOiAiUG9saWN5IEEiCiAgICAgICAgfQogICAgICBdCiAgICB9LAogICAgImNvbnRlbnRfa2V5X3VzYWdlX3BvbGljaWVzIjogWwogICAgICB7CiAgICAgICAgIm5hbWUiOiAiUG9saWN5IEEiLAogICAgICAgICJwbGF5cmVhZHkiOiB7CiAgICAgICAgICAibWluX2RldmljZV9zZWN1cml0eV9sZXZlbCI6IDE1MCwKICAgICAgICAgICJwbGF5X2VuYWJsZXJzIjogWwogICAgICAgICAgICAiNzg2NjI3RDgtQzJBNi00NEJFLThGODgtMDhBRTI1NUIwMUE3IgogICAgICAgICAgXQogICAgICAgIH0KICAgICAgfQogICAgXQogIH0KfQ._NfhLVY7S6k8TJDWPeMPhUawhympnrk6WAZHOVjER6M",
        ],
      },
      cbcs: true,
    },
    WIDEVINE_CENC: {
      variant: "dash",
      container: "fmp4",
      note: "Widevine with CENC encryption",
      src: "test-materials/dash/widevine/cenc/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
      drm: {
        servers: {
          "com.widevine.alpha": {
            serverURL: "https://proxy.uat.widevine.com/proxy",
          },
        },
        shaka: {
          servers: {
            "com.widevine.alpha": "https://proxy.uat.widevine.com/proxy",
          },
        },
      },
      widevine: true,
    },
    WIDEVINE_CBCS: {
      variant: "dash",
      container: "fmp4",
      note: "Widevine with CBCS encryption",
      src: "test-materials/dash/widevine/cbcs/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
      drm: {
        servers: {
          "com.widevine.alpha": {
            serverURL: "https://proxy.uat.widevine.com/proxy",
          },
        },
        shaka: {
          servers: {
            "com.widevine.alpha": "https://proxy.uat.widevine.com/proxy",
          },
        },
      },
      widevine: true,
    },
    DYNAMIC: {
      variant: "dash",
      container: "fmp4",
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
      variant: "dash",
      container: "fmp4",
      src: "test-materials/dash/multiperiod/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
      unstable: new Unstable("ONEM-26036"),
    },
    CMAF_AVC_AC3: {
      variant: "dash",
      container: "cmaf",
      src: "test-materials/cmaf/h264_ac3/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
    },
    CMAF_HEVC_EAC3: {
      variant: "dash",
      container: "cmaf",
      src: "test-materials/cmaf/hevc_eac3/manifest.mpd",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "eac3",
      },
    },
    CMAF_AVC_MP3: {
      variant: "dash",
      container: "cmaf",
      src: "test-materials/cmaf/h264_mp3/manifest.mpd",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "mp3",
      },
    },
    CMAF_AVC_MP3_VTT: {
      variant: "dash",
      container: "cmaf",
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
      variant: "hls",
      container: "mpeg2ts",
      src: "test-materials/hls/mpegts_h264_aac/main.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
    },
    FMP4_AVC_EAC3: {
      variant: "hls",
      container: "fmp4",
      src: "test-materials/hls/fmp4_h264_eac3/main.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "eac3",
      },
    },
    FMP4_HEVC_AC3: {
      variant: "hls",
      container: "fmp4",
      src: "test-materials/hls/fmp4_hevc_ac3/main.m3u8",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "ac3",
      },
    },
    FMP4_MP3: {
      variant: "hls",
      container: "fmp4",
      src: "test-materials/hls/fmp4_mp3/main.m3u8",
      audio: {
        codec: "mp3",
      },
    },
    FMP4_MULTIAUDIO: {
      variant: "hls",
      container: "fmp4",
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
      variant: "hls",
      container: "fmp4",
      note: "TODO: Prepare stream with multiple subtitles tracks (hard to achieve with ffmpeg)",
      src: "test-materials/hls/fmp4_h264_aac_vtt/main.m3u8",
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
      variant: "hls",
      container: "cmaf",
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
      variant: "hls",
      container: "cmaf",
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
      variant: "hls",
      container: "cmaf",
      src: "test-materials/cmaf/h264_ac3/master.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
    },
    CMAF_HEVC_EAC3: {
      variant: "hls",
      container: "cmaf",
      src: "test-materials/cmaf/hevc_eac3/master.m3u8",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "eac3",
      },
    },
    CMAF_AVC_MP3: {
      variant: "hls",
      container: "cmaf",
      src: "test-materials/cmaf/h264_mp3/master.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "mp3",
        channels: "2",
      },
    },
    WIDEVINE_CENC: {
      variant: "hls",
      container: "fmp4",
      note: "Widevine with CENC encryption",
      src: "test-materials/hls/widevine/cenc/manifest.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
      drm: {
        servers: {
          "com.widevine.alpha": {
            serverURL: "https://proxy.uat.widevine.com/proxy",
          },
        },
        shaka: {
          servers: {
            "com.widevine.alpha": "https://proxy.uat.widevine.com/proxy",
          },
        },
      },
      widevine: true,
    },
    WIDEVINE_CBCS: {
      variant: "hls",
      container: "fmp4",
      note: "Widevine with CBCS encryption",
      src: "test-materials/hls/widevine/cbcs/manifest.m3u8",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
      drm: {
        servers: {
          "com.widevine.alpha": {
            serverURL: "https://proxy.uat.widevine.com/proxy",
          },
        },
        shaka: {
          servers: {
            "com.widevine.alpha": "https://proxy.uat.widevine.com/proxy",
          },
        },
      },
      widevine: true,
    },
  },
  HSS: {
    FMP4_AVC_AAC_VTT: {
      variant: "hss",
      container: "fmp4",
      note: "Source: https://testweb.playready.microsoft.com/Content/Content2X",
      src: "http://amssamples.streaming.mediaservices.windows.net/683f7e47-bd83-4427-b0a3-26a6c4547782/BigBuckBunny.ism/manifest(format=mpd-time-csf)",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
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
    PLAYREADY_2_0: {
      variant: "hss",
      container: "fmp4",
      note: "Source: https://testweb.playready.microsoft.com/Content/Content2X",
      src: "http://profficialsite.origin.mediaservices.windows.net/c51358ea-9a5e-4322-8951-897d640fdfd7/tearsofsteel_4k.ism/manifest",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
      },
      drm: {
        servers: {
          "com.microsoft.playready":
            "https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)",
        },
      },
    },
  },
  PROG: {
    MP4_AVC_AAC_VTT: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid2_h264_aac.mp4",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
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
    MKV_AVC_AAC_VTT: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid2_h264_aac.mkv",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "aac",
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
    MP4_AVC_AC3: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid1_h264_ac3.mp4",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
    },
    MKV_AVC_AC3: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid1_h264_ac3.mkv",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "ac3",
      },
    },
    MP4_AVC_EAC3: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid1_h264_eac3.mp4",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "eac3",
      },
    },
    MKV_AVC_EAC3: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid1_h264_eac3.mkv",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "eac3",
      },
    },
    MP4_AVC_MP3: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid1_h264_mp3.mp4",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "mp3",
      },
    },
    MKV_AVC_MP3: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid1_h264_mp3.mkv",
      video: {
        codec: "avc",
      },
      audio: {
        codec: "mp3",
      },
    },
    MP4_HEVC_AAC: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid1_hevc_aac.mp4",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "aac",
      },
    },
    MKV_HEVC_AAC: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid1_hevc_aac.mkv",
      video: {
        codec: "hevc",
      },
      audio: {
        codec: "aac",
      },
    },
    MP4_MPEG2V_AAC: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid1_mpeg2video_aac.mp4",
      video: {
        codec: "mpeg2",
      },
      audio: {
        codec: "aac",
      },
    },
    MKV_MPEG2V_AAC: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid1_mpeg2video_aac.mkv",
      video: {
        codec: "mpeg2",
      },
      audio: {
        codec: "aac",
      },
    },
    MP4_VP9_AAC: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid1_vp9_aac.mp4",
      video: {
        codec: "vp9",
      },
      audio: {
        codec: "aac",
      },
    },
    MKV_VP9_AAC: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid1_vp9_aac.mkv",
      video: {
        codec: "vp9",
      },
      audio: {
        codec: "aac",
      },
    },
    MP4_MPEG4PART2_AAC: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid1_mpeg2video_aac.mp4",
      video: {
        codec: "mpeg4part2",
      },
      audio: {
        codec: "aac",
      },
    },
    MKV_MPEG4PART2_AAC: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid1_mpeg2video_aac.mkv",
      video: {
        codec: "mpeg4part2",
      },
      audio: {
        codec: "aac",
      },
    },
    MP4_EAC3: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid2_eac3.mp4",
      audio: {
        codec: "eac3",
      },
    },
    MKV_EAC3: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid2_eac3.mkv",
      audio: {
        codec: "eac3",
      },
    },
    MP4_AVC: {
      variant: "progressive",
      container: "mp4",
      src: "test-materials/progressive/vid2_h264.mp4",
      video: {
        codec: "avc",
      },
    },
    MKV_AVC: {
      variant: "progressive",
      container: "mkv",
      src: "test-materials/progressive/vid2_h264.mkv",
      video: {
        codec: "avc",
      },
    },
    MP3_MP3: {
      variant: "progressive",
      container: "mp3",
      src: "test-materials/progressive/vid2_mp3.mp3",
      audio: {
        codec: "mp3",
      },
    },
  },
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
      MS.DASH.CMAF_AVC_MP3,
    ],
    DRM: [MS.DASH.PLAYREADY_2_0, MS.DASH.PLAYREADY_4_0_CBCS, MS.DASH.WIDEVINE_CENC, MS.DASH.WIDEVINE_CBCS],
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
    DRM: [MS.HLS.WIDEVINE_CENC, MS.HLS.WIDEVINE_CBCS],
    Subtitles: [MS.HLS.FMP4_AVC_AAC_VTT],
  },
  Progressive: {
    Common: [
      MS.PROG.MP4_AVC_AC3,
      MS.PROG.MKV_AVC_AC3,
      MS.PROG.MP4_AVC_EAC3,
      MS.PROG.MKV_AVC_EAC3,
      MS.PROG.MP4_AVC_MP3,
      MS.PROG.MKV_AVC_MP3,
      MS.PROG.MP4_HEVC_AAC,
      MS.PROG.MKV_HEVC_AAC,
      MS.PROG.MP4_MPEG2V_AAC,
      MS.PROG.MKV_MPEG2V_AAC,
      MS.PROG.MP4_VP9_AAC,
      MS.PROG.MKV_VP9_AAC,
      MS.PROG.MP4_MPEG4PART2_AAC,
      MS.PROG.MKV_MPEG4PART2_AAC,
      MS.PROG.MP4_EAC3,
      MS.PROG.MP4_AVC,
      MS.PROG.MKV_AVC,
      MS.PROG.MP3_MP3,
    ],
    Subtitles: [MS.PROG.MP4_AVC_AAC_VTT, MS.PROG.MKV_AVC_AAC_VTT],
  },
};

(function () {
  StreamSets.DASH.Video = StreamSets.DASH.Common.filter((stream) => stream.video);
  StreamSets.DASH.CommonAndDRM = StreamSets.DASH.Common.concat(StreamSets.DASH.DRM);
  StreamSets.HLS.Video = StreamSets.HLS.Common.filter((stream) => stream.video);
  StreamSets.HLS.CommonAndDRM = StreamSets.HLS.Common.concat(StreamSets.HLS.DRM);
  StreamSets.Progressive.Video = StreamSets.Progressive.Common.filter((stream) => stream.video);
})();
