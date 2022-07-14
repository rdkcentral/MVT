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
      testBase: "1.1.2",
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
  },
  HSS: {
    FMP4_AVC_AAC_VTT: {
      variant: "hss",
      container: "fmp4",
      name: "HSS-AVC1-AAC",
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
        codec: "aac",
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
      testBase: "4.1.7",
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
  StreamSets.Progressive.Video = StreamSets.Progressive.Common.filter((stream) => stream.video);
})();
