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
import xml.etree.ElementTree as ET


LANGS = ["en", "de", "fr", "es"]


def parse_mpd(path):
    tree = ET.parse(path)
    root = tree.getroot()
    xmlns = root.tag[1:].partition("}")[0]
    ns = {"": xmlns}
    ET.register_namespace("", xmlns)
    return tree, root, ns


def add_text_tracks(args):
    tree, root, ns = parse_mpd(args.mpd)
    period = root.find("Period", namespaces=ns)
    mime_type = "text/vtt" if args.kind == "vtt" else "application/ttml+xml"
    for i, lang in enumerate(LANGS):
        adaptation_set = ET.SubElement(period, "AdaptationSet", id=f"as_txt_{i}", contentType="text", lang=lang)
        representation = ET.SubElement(
            adaptation_set,
            "Representation",
            id=f"as_txt_{i}_repr",
            bandwidth="256",
            mimeType=mime_type,
        )
        url = ET.SubElement(representation, "BaseURL")
        url.text = f"../../subtitles/countdown-{lang}.{args.kind}"

    ET.indent(tree)
    tree.write(args.output, encoding="utf-8", xml_declaration=True)


def multiply_periods(args):
    tree, root, ns = parse_mpd(args.mpd)
    first_period = root.find("Period", namespaces=ns)
    root.attrib["mediaPresentationDuration"] = f"PT{args.duration * args.number_of_periods}.0S"
    first_period.attrib["duration"] = f"PT{args.duration}.0S"
    for i in range(1, args.number_of_periods):
        cloned_period = ET.fromstring(ET.tostring(first_period))
        del cloned_period.attrib["start"]
        cloned_period.attrib["id"] = str(i)
        root.append(cloned_period)

    ET.indent(tree)
    tree.write(args.output, encoding="utf-8", xml_declaration=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Tool for DASH MPD files manipulation")
    subparsers = parser.add_subparsers()

    add_subtitles = subparsers.add_parser("add_subtitles", help="Add AdaptationSets with subtitles")
    add_subtitles.add_argument("mpd", type=str, help="Input manifest path")
    add_subtitles.add_argument("kind", choices=["vtt", "ttml"])
    add_subtitles.add_argument("output", type=str, help="Output manifest path")
    add_subtitles.set_defaults(func=add_text_tracks)

    multiperiod = subparsers.add_parser(
        "multiperiod", help="Create multiperiod MPD by making multiple copies of same period from original manifest."
    )
    multiperiod.add_argument("mpd", type=str, help="Input manifest path")
    multiperiod.add_argument("duration", type=int, help="Single period duration in seconds")
    multiperiod.add_argument("number_of_periods", type=int, help="Target number of periods")
    multiperiod.add_argument("output", type=str, help="Output manifest path")
    multiperiod.set_defaults(func=multiply_periods)

    args = parser.parse_args()
    args.func(args)
