function update_player(player, version) {
  //   let script = document.createElement("script");
  let url = "";
  version = player == "dash" ? `v${version}` : version;
  if (version.includes("latest")) {
    url = `${Players[player]["url_pref"]}/latest/${Players[player]["url_suff"]}`;
  } else {
    url = `${Players[player]["url_pref"]}/${version}/${Players[player]["url_suff"]}`;
  }
  //   script.async = script.defer = true;
  //   script.onload = callback;
  //   document.head.appendChild(script);
  addScript(url, function () {});
}

function addScript(src, callback) {
  var head = document.getElementsByTagName("head")[0];
  var s = document.createElement("script");
  s.src = src;
  s.onload = callback;
  head.appendChild(s);
  //   s.addEventListener('load', () => {
  //     initApp()
  //   })
}

var player_type = getQueryVariable("player");
var player_ver = getQueryVariable("player_ver");

const manifestUri = "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd";

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
    await player.load(manifestUri);
    console.log("The video has now been loaded!");
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

update_player(player_type, player_ver);

function initDash() {
  var url = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
  var player = dashjs.MediaPlayer().create();
  var video = document.querySelector("video");
  player.initialize(); /* initialize the MediaPlayer instance */
  player.attachView(video); /* tell the player which videoElement it should use */
  player.attachSource(url); /* provide the manifest source */
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
// sessionStorage.setItem("player_ver", player_ver);
for (var _player in Players) {
  var div = document.createElement("div");
  div.innerHTML = `${_player}: `;
  for (var ver in Players[_player]["versions"]) {
    console.log(Players[_player]["versions"][ver]);
    let a = document.createElement("button");
    a.onclick = update_player;
    a.className = "ver";
    a.innerHTML = Players[_player]["versions"][ver];
    div.appendChild(a);
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

// let url = `${location.origin}/test_players/?player_ver=3.2.1&player=shaka`
// div_player.appendChild(createAnchor("load shaka"));
// div_player.lastChild.setAttribute('data-href', url);
// div_player.lastChild.onclick = window.navigate;
// div_player.lastChild.classList.add('focusable');

// var prep = createElement('a', 'prep', 'focusable', 'shakalaka');
// prep.href = url
// prep.setAttribute('tabindex', '0');
// div_player.appendChild(prep);

// window.addEventListener('load', function() {
//     var focusManager = new FocusManager;
//     var elements = document.getElementsByClassName('focusable');
//     elements[0].focus();
//     for (var i = 0; i < elements.length; ++i)
//       focusManager.add(elements[i]);
//   });

async function demo(player_type) {
  if (player_type == "shaka") {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("done");
    initShaka();
  } else {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("done");
    initDash();
  }
}

demo(player_type);
