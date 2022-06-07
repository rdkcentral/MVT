#! /usr/bin/python3
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
#
import argparse
import math
from os import path
from xml.sax.saxutils import escape

NUM2SPECIAL = {0: ")", 1: "!", 2: "@", 3: "#", 4: "$", 5: "%", 6: "^", 7: "&", 8: "*", 9: "("}

# There are some packages that provide number to word conversion, but we are trying to avoid GPL dependencies,
# so here is a plain and simple conversion table.
NUM2WORD = {
    "de": {
        0: "Null",
        1: "Eins",
        2: "Zwei",
        3: "Drei",
        4: "Vier",
        5: "Fünf",
        6: "Sechs",
        7: "Sieben",
        8: "Acht",
        9: "Neun",
    },
    "en": {
        0: "Zero",
        1: "One",
        2: "Two",
        3: "Three",
        4: "Four",
        5: "Five",
        6: "Six",
        7: "Seven",
        8: "Eight",
        9: "Nine",
    },
    "es": {
        0: "Cero",
        1: "Uno",
        2: "Dos",
        3: "Tres",
        4: "Cuatro",
        5: "Cinco",
        6: "Seis",
        7: "Siete",
        8: "Ocho",
        9: "Nueve",
    },
    "fr": {
        0: "Zéro",
        1: "Un",
        2: "Deux",
        3: "Trois",
        4: "Quatre",
        5: "Cinq",
        6: "Six",
        7: "Sept",
        8: "Huit",
        9: "Neuf",
    },
}


def num2special(num):
    return "".join([NUM2SPECIAL[int(digit)] for digit in str(num)])


def num2words(num, language):
    return " ".join([NUM2WORD[language][int(digit)] for digit in str(num)])


def save(content, path):
    with open(path, "w") as out:
        out.write(content)


def make_timestamp(i):
    minutes = str(math.floor(i / 60)).rjust(2, "0")
    seconds = str(i % 60).rjust(2, "0")
    return f"00:{minutes}:{seconds}.000"


def generate_content(length, language):
    out = []
    for i in range(1, length + 1):
        caption = num2words(i, language) + "\n"
        caption += f"{i} {num2special(i)}"
        out.append(caption)
    return out


def make_vtt(content):
    out = "WEBVTT\n\n"
    for i, caption in enumerate(content, 1):
        out += str(i) + "\n"
        out += f"{make_timestamp(i - 1)} --> {make_timestamp(i)}\n"
        out += caption + "\n\n"
    return out


def make_ttml(content, language):
    out = f"""<?xml version="1.0" encoding="utf-8"?>
<tt xmlns="http://www.w3.org/ns/ttml">
    <head>
        <metadata xmlns:ttm="http://www.w3.org/ns/ttml#metadata">
        <ttm:title>MVT TTML sample ({language})</ttm:title>
        </metadata>
        <styling xmlns:tts="http://www.w3.org/ns/ttml#styling">
        <style xml:id="s1" tts:color="white" tts:backgroundColor="transparent" tts:fontFamily="proportionalSansSerif" tts:fontSize="22px" tts:textAlign="center" />
        </styling>
        <layout xmlns:tts="http://www.w3.org/ns/ttml#styling">
        <region xml:id="subtitleArea" style="s1" tts:extent="560px 62px" tts:padding="5px 3px" tts:displayAlign="after" />
        </layout>
    </head>
    <body region="subtitleArea">
        <div xml:lang="en">
"""

    for i, caption in enumerate(content, 1):
        out += " " * 12
        out += f'<p begin="{make_timestamp(i - 1)}" end="{make_timestamp(i)}">'
        out += escape(caption, {"\n": "<br />"})
        out += "</p>\n"
    out += "        </div>\n</body>\n</tt>"
    return out


def make_js_array(content, language):
    out = f"const {language.capitalize()}Subtitles = [\n"
    for caption in content:
        out += " " * 4
        encoded_caption = caption.encode("unicode_escape").decode("utf-8")
        out += f'"{encoded_caption}",\n'
    out += "]"
    return out


def main(args):
    assert args.length < 3600, "Length should be less than 3600"
    content = generate_content(args.length, args.language)
    name = f"countdown-{args.language}"
    save(make_vtt(content), path.join(args.output_dir, name + ".vtt"))
    save(make_ttml(content, args.language), path.join(args.output_dir, name + ".ttml"))
    save(make_js_array(content, args.language), path.join(args.output_dir, name + ".js"))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Tool for generation of time-countdown subtitles in VTT, TTML and JS array formats"
    )
    parser.add_argument("length", type=int, help="Subtitles length in seconds")
    parser.add_argument("language", type=str, help="Captions language")
    parser.add_argument("output_dir", type=str)
    main(parser.parse_args())
