/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2025 Liberty Global B.V.
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

var config = new XMLHttpRequest();
config.overrideMimeType("application/json");
config.open("GET", "/platform/config.json", true);

config.onreadystatechange = function() {
    if (config.readyState == 4 && config.status == "200") {
        var resp = JSON.parse(config.responseText);
        var mvtRunnerIp = resp.MVT_Runner_IP;
        const wsUrl = 'wss://' + mvtRunnerIp + ':10199';
        const wsSocket = new WebSocket(wsUrl);

        wsSocket.onmessage=function(message)
        {
            let resp = '{"cmd": "", "val" : ""}';
            let respJson = JSON.parse(resp);

            switch(message.data) {
                case "getMvtTestResults":
                respJson.cmd = "getMvtTestResults";
                respJson.val = JSON.stringify(window.getMvtTestResults());
                break;
            
   	        case "getNumberOfTests":
                respJson.cmd = "getNumberOfTests";
                respJson.val = window.globalRunner.testList.length.toString();
                break;

                case "getCurrentTestIdx":
                respJson.cmd = "getCurrentTestIdx";
                respJson.val = window.globalRunner.currentTestIdx.toString();
                break;

                default:
                //Not handled
                break;
	    }

            respJson = JSON.stringify(respJson);
            wsSocket.send(respJson);
        };
    }
};
config.send(null);
