div_player = document.getElementById("players_container");
let player_ver = getQueryVariable("player_ver")
sessionStorage.setItem('player_ver', player_ver);
for (var player in Players) {
  var div = document.createElement("div");
  div.innerHTML = `${player}: `;
  for (var ver in Players[player]["versions"]) {
    console.log(Players[player]["versions"][ver]);
    let a = document.createElement("button");
    a.onclick = update_player(player, Players[player]["versions"][ver]);
    a.className = "ver";
    a.innerHTML = Players[player]["versions"][ver];
    div.appendChild(a);
  }
  div_player.appendChild(div);
}

// var script = document.createElement("script");
// script.src = "https://cdn.dashjs.org/v3.1.1/dash.all.min.js";
// document.head.appendChild(script);

// update_player("https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd");
// var scrs = document.getElementsByTagName("script");
// console.log(scrs);

change_source()


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

function change_source() {
  update_player()
  let url = getQueryVariable("url")
  try {
    document.getElementById("player").remove();
  } catch {}
  let video = document.body.appendChild(document.createElement("video"));
  video.id = "player";
  video.controls = "true";
  video.preload = "auto";
  video.autoplay = "true";
  let source = document.createElement("source");
  source.src = url;
  source.type = "application/dash+xml";
  video.append(source);
  var urlValue = document.getElementsByName("video_url")[0].value;
  console.log(urlValue);
}

function update_player(player, version) {
  if (player !== undefined) {
    const newScript = document.createElement("script");
    const oldScript = document.querySelector('script[src*="https://"]');
    newScript.src = `https://cdn.dashjs.org/v${version}/dash.all.min.js`;
    oldScript.parentNode.insertBefore(newScript, oldScript.nextSibling);
    try {
      oldScript.parentNode.removeChild(oldScript);
    } catch {}
  }
}
