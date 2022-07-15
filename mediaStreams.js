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

// Define content
var MvtMedia = {
  HLS: [
    {
      testBase: "2.1.1",
      container: "hls",
      variant: "mpeg2ts",
      name: "HLS-MP2TS-AVC1-AAC",
      src: "test-materials/hls/mpegts_h264_aac/main.m3u8",
      video: {
        codec: "avc1.42C00D",
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "2.2.1",
      container: "hls",
      variant: "fragmentedmp4",
      name: "HLS-FMP4-AVC1-EAC3",
      src: "test-materials/hls/fmp4_h264_eac3/main.m3u8",
      video: {
        codec: "avc1.42C00D",
      },
      audio: {
        codec: "mp4a.a6",
        channels: "2",
      },
    },
    {
      testBase: "2.2.2",
      container: "hls",
      variant: "fragmentedmp4",
      name: "HLS-FMP4-HEVC-AC3",
      src: "test-materials/hls/fmp4_hevc_ac3/main.m3u8",
      video: {
        codec: "hvc1.1.6.L150.90",
      },
      audio: {
        codec: "mp4a.a5",
        channels: "2",
      },
    },
    {
      testBase: "2.2.3",
      container: "hls",
      variant: "fragmentedmp4",
      name: "HLS-FMP4-MP3",
      src: "test-materials/hls/fmp4_mp3/main.m3u8",
      audio: {
        codec: "mp4a.69",
        channels: "2",
      },
    },
    {
      testBase: "2.2.4",
      container: "hls",
      variant: "fragmentedmp4",
      name: "HLS-FMP4-MULTIAUDIO",
      src: "test-materials/hls/fmp4_multiaudio/main.m3u8",
      video: {
        codec: "avc1.42C00D",
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
        languages: ["en", "pl"],
      },
    },
    {
      testBase: "2.2.4",
      container: "hls",
      variant: "fragmentedmp4",
      name: "HLS-FMP4-AVC1-AAC-VTT",
      src: "test-materials/hls/fmp4_h264_aac_vtt/main.m3u8",
      note: "TODO: Prepare stream with multiple subtitles tracks (hard to achieve with ffmpeg)",
      video: {
        codec: "avc1.42C00D",
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
      subtitles: {
        format: "webvtt",
        languages: ["en"],
        testLanguages: ["en"],
        expectedText: TimeCountdownSubtitles,
      },
    },
    {
      testBase: "2.3.1",
      container: "hls",
      variant: "cmaf",
      name: "HLS-CMAF-AVC1-AAC",
      note: "Source: https://testassets.dashif.org/",
      src: "https://media.axprod.net/TestVectors/v9-MultiFormat/Clear/Manifest_1080p.m3u8",
      video: {
        codec: "avc1.42C00D",
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "2.3.2",
      container: "hls",
      variant: "cmaf",
      name: "HLS-CMAF-HEVC-AAC",
      note: "Source: https://testassets.dashif.org/",
      src: "https://dash.akamaized.net/dash264/TestCasesIOP41/CMAF/UnifiedStreaming/ToS_HEVC_MultiRate_MultiRes_IFrame_AAC_WebVTT.m3u8",
      video: {
        codec: "hvc1.1.6.L150.90",
      },
      audio: {
        codec: "mp4a.40.2",
        channels: "2",
      },
    },
    {
      testBase: "2.3.3",
      container: "hls",
      variant: "cmaf",
      name: "HLS-CMAF-AVC1-AC3",
      src: "test-materials/cmaf/h264_ac3/master.m3u8",
      video: {
        codec: "avc1.42C00D",
      },
      audio: {
        codec: "mp4a.a5",
        channels: "2",
      },
    },
    {
      testBase: "2.3.4",
      container: "hls",
      variant: "cmaf",
      name: "HLS-CMAF-HEVC-EAC3",
      src: "test-materials/cmaf/hevc_eac3/master.m3u8",
      video: {
        codec: "hvc1.1.6.L150.90",
      },
      audio: {
        codec: "mp4a.a6",
        channels: "2",
      },
    },
    {
      testBase: "2.3.5",
      container: "hls",
      variant: "cmaf",
      name: "HLS-CMAF-AVC1-MP3",
      src: "test-materials/cmaf/h264_mp3/master.m3u8",
      video: {
        codec: "avc1.42C00D",
      },
      audio: {
        codec: "mp4a.69",
        channels: "2",
      },
    },
  ],
  HSS: [
    {
      testBase: "3.1.1",
      container: "hss",
      variant: "fragmentedmp4",
      name: "HSS-AVC1-AAC",
      note: "Source: https://testweb.playready.microsoft.com/Content/Content2X",
      src: "http://amssamples.streaming.mediaservices.windows.net/683f7e47-bd83-4427-b0a3-26a6c4547782/BigBuckBunny.ism/manifest(format=mpd-time-csf)",
      video: {
        codec: "avc1.42C00D",
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
      variant: "fragmentedmp4",
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
        codec: "avc1.42C00D",
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
        codec: "mp4a.a6",
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
        codec: "mp4a.a6",
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
        codec: "mp4a.69",
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
        codec: "mp4a.69",
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
        codec: "mp4a.a6",
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
        codec: "mp4a.a6",
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
        codec: "mp4a.69",
        channels: "2",
      },
    },
  ],
};

function makeStreamDefaultName(category, container, vCodec, aCodec) {
  let name = `${category}_${container}`;
  if (vCodec) name = name.concat(`_${vCodec}`);
  if (aCodec) name = name.concat(`_${aCodec}`);
  return name.toUpperCase();
}

class MediaStream {
  constructor(category, container, src, vCodec, aCodec, name = null, custom = null) {
    this.category = category;
    this.name = name;
    this.container = container;
    this.src = src;
    this.videoCodec = vCodec;
    this.audioCodec = aCodec;

    if (name) this.name = name;
    else this.name = makeStreamDefaultName(category, container, vCodec, aCodec);

    if (!custom) custom = {};
    this.subtitles = custom.subtitles;
    this.drm = custom.drm;
    if (custom.audio && custom.audio.languages) this.audioLanguages = custom.audio.languages;
    else this.audioLanguages = ["en"];
    this.dynamic = Boolean(custom.dynamic);
  }
}

class DashStream extends MediaStream {
  constructor(container, src, vCodec, aCodec, name = null, custom = null) {
    super("DASH", container, src, vCodec, aCodec, name, custom);
  }
}

// MS = MediaStreams
const MS = { DASH: {}, HLS: {}, HSS: {}, progressive: {} };

MS.DASH.FMP4_AVC_AAC = new DashStream("fmp4", "test-materials/dash/fmp4_h264_aac/manifest.mpd", "avc", "aac");
MS.DASH.FMP4_AVC_AC3 = new DashStream("fmp4", "test-materials/dash/fmp4_h264_ac3/manifest.mpd", "avc", "ac3");
MS.DASH.FMP4_HEVC_EAC3 = new DashStream("fmp4", "test-materials/dash/fmp4_hevc_eac3/manifest.mpd", "hevc", "eac3");
MS.DASH.FMP4_MPEG2_MP3 = new DashStream("fmp4", "test-materials/dash/fmp4_mpeg2_mp3/manifest.mpd", "mpeg2", "mp3");
MS.DASH.MULTIPERIOD = new DashStream(
  "fmp4",
  "test-materials/dash/multiperiod/manifest.mpd",
  "avc",
  "aac",
  "DASH_MULTIPERIOD"
);
MS.DASH.FMP4_AVC_AAC_TTML = new DashStream(
  "fmp4",
  "test-materials/dash/fmp4_h264_aac_ttml/manifest_ttml.mpd",
  "avc",
  "aac",
  "DASH_FMP4_AVC_AAC_TTML",
  {
    subtitles: {
      format: "ttml",
      languages: ["de", "en", "fr", "es"],
      expectedText: TimeCountdownSubtitles,
    },
  }
);
// Source: https://testweb.playready.microsoft.com/Content/Content2X"
MS.DASH.PLAYREADY_2_0 = new DashStream(
  "fmp4",
  "http://profficialsite.origin.mediaservices.windows.net/c51358ea-9a5e-4322-8951-897d640fdfd7/tearsofsteel_4k.ism/manifest(format=mpd-time-csf)",
  "avc",
  "aac",
  "DASH_PLAYREADY_2_0",
  {
    drm: {
      servers: {
        "com.microsoft.playready":
          "https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)",
      },
    },
  }
);
MS.DASH.FMP4_MP3 = new DashStream("fmp4", "test-materials/dash/fmp4_mp3/manifest.mpd", null, "mp3");
MS.DASH.WEBM_VP9_OPUS = new DashStream("webm", "test-materials/dash/webm_vp9_opus/manifest.mpd", "vp9", "opus");
MS.DASH.WEBM_VP9_OPUS_VTT = new DashStream(
  "webm",
  "test-materials/dash/webm_vp9_opus/manifest_vtt.mpd",
  "vp9",
  "opus",
  "DASH_WEBM_VP9_OPUS_VTT",
  {
    subtitles: {
      format: "webvtt",
      languages: ["de", "en", "fr", "es"],
      expectedText: TimeCountdownSubtitles,
    },
  }
);
MS.DASH.CMAF_HEVC_AAC = new DashStream(
  "cmaf",
  "https://dash.akamaized.net/dash264/TestCasesIOP41/CMAF/UnifiedStreaming/ToS_HEVC_MultiRate_MultiRes_AAC_Eng_WebVTT.mpd",
  "hevc",
  "aac"
);
MS.DASH.MULTIAUDIO = new DashStream(
  "fmp4",
  "test-materials/dash/fmp4_multiaudio/manifest.mpd",
  "avc",
  "aac",
  "DASH_MULTIAUDIO",
  {
    audio: {
      languages: ["en", "pl"],
    },
  }
);
MS.DASH.DYNAMIC = new DashStream(
  "fmp4",
  "https://livesim.dashif.org/livesim/mup_300/tsbd_500/testpic_2s/Manifest.mpd",
  "avc",
  "aac",
  "DASH_DYNAMIC",
  {
    dynamic: true,
  }
);
MS.DASH.CMAF_AVC_AC3 = new DashStream("cmaf", "test-materials/cmaf/h264_ac3/manifest.mpd", "avc", "ac3");
MS.DASH.CMAF_HEVC_EAC3 = new DashStream("cmaf", "test-materials/cmaf/hevc_eac3/manifest.mpd", "hevc", "eac3");
MS.DASH.CMAF_AVC_MP3_VTT = new DashStream(
  "cmaf",
  "test-materials/cmaf/h264_mp3/manifest_vtt.mp",
  "avc",
  "mp3",
  "DASH-CMAF-AVC1-MP3-VTT",
  {
    subtitles: {
      format: "webvtt",
      languages: ["de", "en", "fr", "es"],
      expectedText: TimeCountdownSubtitles,
    },
  }
);

// MS.DASH. = new DashStream(
//   "",
//   "",
//   "",
//   ""
// );
