export const GAME_ASSETS = {
  ssbu: {
    config: require("./games/ssbu/base_files/config.json"),
    icon: {
      config: require("./games/ssbu/base_files/icon/config.json"),
      path: "/games/ssbu/base_files/icon",
      skin_numbers: 2,
    },
    portrait: {
      config: require("./games/ssbu/portrait/config.json"),
      path: "/games/ssbu/portrait",
      skin_numbers: 2,
    },
    full: {
      config: require("./games/ssbu/full/config.json"),
      path: "/games/ssbu/full",
      skin_numbers: 2,
    },
  },
  ssbm: {
    config: require("./games/ssbm/base_files/config.json"),
    icon: {
      config: require("./games/ssbm/base_files/icon/config.json"),
      path: "/games/ssbm/base_files/icon",
      skin_numbers: 2,
    },
    portrait: {
      config: require("./games/ssbm/portrait/config.json"),
      path: "/games/ssbm/portrait",
      skin_numbers: 1,
    },
    full: {
      config: require("./games/ssbm/full/config.json"),
      path: "/games/ssbm/full",
      skin_numbers: 1,
      zoom: 1.8
    },
  },
  sfv: {
    config: require("./games/sfv/base_files/config.json"),
    icon: {
      config: require("./games/sfv/base_files/icon/config.json"),
      path: "/games/sfv/base_files/icon",
      skin_numbers: 2,
    },
    portrait: {
      config: require("./games/sfv/full/config.json"),
      path: "/games/sfv/full",
      skin_numbers: 1,
    },
    full: {
      config: require("./games/sfv/full/config.json"),
      path: "/games/sfv/full",
      skin_numbers: 1,
    },
  },
};

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join("0") + number;
  }
  return number + ""; // always return a string
}

export function GetCharacterAsset(game, char, skin, asset) {
  let dict = GAME_ASSETS[game][asset];

  if (!dict) return "";

  let charCodename = char.toLowerCase();

  return (
    dict["path"] +
    "/" +
    (dict.config.prefix || "") +
    charCodename +
    (dict.config.postfix || "") +
    zeroFill(skin, dict.skin_numbers) +
    ".png"
  );
}

export function GetCharacterCodename(game, char) {
  if (char == null) {
    char = "";
  }
  return char.replace(/ /g, "_").replace(/\./g, "").toLowerCase();
}

export function GetCharacterName(game, char) {
  let dict = GAME_ASSETS[game].config.character_to_codename;

  let found = Object.entries(dict).find((c)=>c[1].codename === char);

  if(found){
    return found[0]
  } else {
    return char
  }
}

export function CenterImage(element, eyesight, game, asset, customZoom = 1) {
  element = window.jQuery(element);
  let image = element.css("background-image");

  if (image != undefined && image.includes("url(")) {
    let img = new Image();
    img.src = image.split('url("')[1].split('")')[0];

    window.jQuery(img).on("load", () => {
      if (!eyesight) {
        eyesight = {
          x: img.naturalWidth / 2,
          y: img.naturalHeight / 2,
        };
        console.log("eyesight", eyesight)
      }

      let zoom_x = element.innerWidth() / img.naturalWidth;
      let zoom_y = element.innerHeight() / img.naturalHeight;

      let zoom = 1;

      if (zoom_x > zoom_y) {
        zoom = zoom_x;
      } else {
        zoom = zoom_y;
      }

      zoom *= GAME_ASSETS[game][asset].zoom || 1;

      let xx = 0;
      let yy = 0;

      xx = -eyesight.x * zoom + element.innerWidth() / 2;
      console.log("xx", xx);

      let maxMoveX = Math.abs(element.innerWidth() - img.naturalWidth * zoom);
      console.log("maxMoveX", maxMoveX);

      if (xx > 0) xx = 0;
      if (xx < -maxMoveX) xx = -maxMoveX;

      yy = -eyesight.y * zoom + element.innerHeight() / 2;
      console.log("yy", yy);

      let maxMoveY = Math.abs(element.innerHeight() - img.naturalHeight * zoom);
      console.log("maxMoveY", maxMoveY);

      if (yy > 0) yy = 0;
      if (yy < -maxMoveY) yy = -maxMoveY;

      console.log("zoom", zoom);

      element.css(
        "background-position",
        `
            ${xx}px
            ${yy}px
            `
      );

      element.css(
        "background-size",
        `
            ${img.naturalWidth * zoom}px
            ${img.naturalHeight * zoom}px
            `
      );

      //element.css("background-position", "initial");
      //element.css("position", "fixed");
      //element.css("width", img.naturalWidth * zoom);
      //element.css("height", img.naturalHeight * zoom);
    });
  }
}

export function GetCharacterEyesight(game, char, skin, asset) {
  let dict = GAME_ASSETS[game][asset].config;

  console.log(game, char, skin, asset)
  console.log(dict)

  let charCodename = char.toLowerCase();

  if (!dict?.eyesights || !(charCodename in dict.eyesights) || null) return null;

  console.log(dict?.eyesights[charCodename]);

  let eyesight = dict.eyesights[charCodename]["0"];

  if (String(skin) in dict.eyesights[charCodename])
    eyesight = dict.eyesights[charCodename][String(skin)];

  
  console.log(eyesight)

  return eyesight;
}

export function GetPlayerSkin(playerData, id){
  let skin = 0;

  if(playerData.hasOwnProperty("skins")){
      skin = playerData["skins"][playerData["mains"][id]];
      if(skin == undefined){
          skin = 0;
      }
  }
  
  return skin;
}

export const CHARACTERS_GG_TO_BRAACKET = {
  Mario: "Mario",
  "Donkey Kong": "Donkey Kong",
  Link: "Link",
  Samus: "Samus",
  "Dark Samus": "Dark Samus",
  Yoshi: "Yoshi",
  Kirby: "Kirby",
  Fox: "Fox",
  Pikachu: "Pikachu",
  Luigi: "Luigi",
  Ness: "Ness",
  "Captain Falcon": "Captain Falcon",
  Jigglypuff: "Jigglypuff",
  Peach: "Peach",
  Daisy: "Daisy",
  Bowser: "Bowser",
  "Ice Climbers": "Ice Climbers",
  Sheik: "Sheik",
  Zelda: "Zelda",
  "Dr. Mario": "Dr Mario",
  Pichu: "Pichu",
  Falco: "Falco",
  Marth: "Marth",
  Lucina: "Lucina",
  "Young Link": "Young Link",
  Ganondorf: "Ganondorf",
  Mewtwo: "Mewtwo",
  Roy: "Roy",
  Chrom: "Chrom",
  "Mr. Game & Watch": "Mr Game And Watch",
  "Meta Knight": "Meta Knight",
  Pit: "Pit",
  "Dark Pit": "Dark Pit",
  "Zero Suit Samus": "Zero Suit Samus",
  Wario: "Wario",
  Snake: "Snake",
  Ike: "Ike",
  "Pokemon Trainer": "Pokemon Trainer",
  "Diddy Kong": "Diddy Kong",
  Lucas: "Lucas",
  Sonic: "Sonic",
  "King Dedede": "King Dedede",
  Olimar: "Olimar",
  Lucario: "Lucario",
  "R.O.B.": "Rob",
  "Toon Link": "Toon Link",
  Wolf: "Wolf",
  Villager: "Villager",
  "Mega Man": "Mega Man",
  "Wii Fit Trainer": "Wii Fit Trainer",
  Rosalina: "Rosalina And Luma",
  "Little Mac": "Little Mac",
  Greninja: "Greninja",
  "Mii Brawler": "Mii Brawler",
  "Mii Swordfighter": "Mii Swordfighter",
  "Mii Gunner": "Mii Gunner",
  Palutena: "Palutena",
  "Pac-Man": "Pac Man",
  Robin: "Robin",
  Shulk: "Shulk",
  "Bowser Jr.": "Bowser Jr",
  "Duck Hunt": "Duck Hunt",
  Ryu: "Ryu",
  Ken: "Ken",
  Cloud: "Cloud",
  Corrin: "Corrin",
  Bayonetta: "Bayonetta",
  Inkling: "Inkling",
  Ridley: "Ridley",
  "Simon Belmont": "Simon",
  Richter: "Richter",
  "King K. Rool": "King K Rool",
  Isabelle: "Isabelle",
  Incineroar: "Incineroar",
  "Piranha Plant": "Piranha Plant",
  Joker: "Joker",
  Hero: "Hero",
  "Banjo-Kazooie": "Banjo-Kazooie",
  Terry: "Terry",
  Byleth: "Byleth",
  "Min Min": "Min Min",
  Steve: "Steve",
  Sephiroth: "Sephiroth",
  "Pyra & Mythra": "Pyra & Mythra",
  Kazuya: "Kazuya",
};
