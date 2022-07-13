function update_player(player, version) {
  if (player in Players) {
    let script_url = "";
    version = player == "dashjs" ? `v${version}` : version;
    if (version.includes("latest")) {
      script_url = `${Players[player]["url_pref"]}/latest/${Players[player]["url_suff"]}`;
    } else {
      script_url = `${Players[player]["url_pref"]}/${version}/${Players[player]["url_suff"]}`;
    }
    addScript(script_url, function () {});
  } else {
    console.error(`Player '${player_type}' is not available.`);
  }
}

function addScript(src, callback) {
  var head = document.getElementsByTagName("head")[0];
  var s = document.createElement("script");
  s.src = src;
  s.onload = callback;
  head.appendChild(s);
}

var player_type = getQueryVariable("player");
var player_ver = getQueryVariable("player_ver");
var media_url = getQueryVariable("url");

// var url = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
// const manifestUri = "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd";

function initShaka() {
  if (!shaka.polyfill.installed) {
    shaka.polyfill.installAll();
    shaka.polyfill.installed = true;
  }
  initShakaPlayer();
}

async function initShakaPlayer() {
  const video = document.getElementById("video");
  const player = new shaka.Player(video);
  window.player = player;
  player.addEventListener("error", onErrorEvent);
  try {
    await player.load(media_url);
  } catch (e) {
    onError(e);
  }
}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(error) {
  console.error("Error code", error.code, "object", error);
}

function initDash() {
  var player = dashjs.MediaPlayer().create();
  var video = document.querySelector("video");
  player.initialize();
  player.attachView(video);
  player.attachSource(media_url);
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return false;
}

div_player = document.getElementById("players_list");
let current_conf = document.createElement("div");
current_conf.innerHTML = `Current player: <span style="color: #f60;">${player_type}, ver: ${player_ver}</span><br>`;
current_conf.innerHTML += `Stream URL: <input id="url_input" style="width: 600px;" value="${media_url}"></input> SET`;
current_conf.style = "margin: 20px 0;";
div_player.appendChild(current_conf);

for (var _player in Players) {
  var div = document.createElement("div");
  div.innerHTML = `${_player}: `;
  for (var ver in Players[_player]["versions"]) {
    var same_ver = Players[_player]["versions"][ver] == player_ver;

    if ((!same_ver && _player == player_type) || player_type != _player) {
      var ver_link = document.createElement("a");
      ver_link.href = `${location.origin}${location.pathname}?player=${_player}&player_ver=${Players[_player]["versions"][ver]}&url=${media_url}`;
      ver_link.className = "ver";
      ver_link.innerHTML = Players[_player]["versions"][ver];
    } else {
      var ver_link = document.createElement("span");
      ver_link.className = "ver";
      ver_link.innerHTML = Players[_player]["versions"][ver];
    }
    div.appendChild(ver_link);
  }
  div_player.appendChild(div);
}

createElement = function (tag, id, class_, innerHTML) {
  var element = document.createElement(tag);
  if (id != null) element.id = id;
  if (innerHTML != null) element.innerHTML = innerHTML;
  if (class_ != null) element.classList.add(class_);
  return element;
};

var createAnchor = function (text, id) {
  var anchor = createElement("span", id, "rightmargin20", text);
  anchor.setAttribute("tabindex", "0");
  return anchor;
};

async function init_player(player_type) {
  if (player_type && player_ver && media_url) {
    update_player(player_type, player_ver);
    await new Promise((r) => setTimeout(r, 2000));
    if (player_type == "shaka") {
      initShaka();
    } else if (player_type == "dashjs") {
      initDash();
    }
  } else {
    console.error("Missing some of the parameters: 'player', 'player_ver' or 'url'.");
  }
}

init_player(player_type);
