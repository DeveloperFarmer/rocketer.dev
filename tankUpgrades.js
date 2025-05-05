export const bodyupgrades = {//use export so that it is accessible in the main js code
  //note that export only works for modules, i.e. in the html code, the js scripts must have type="module"
  //hardcoded for the upgrade tree. Omit unneccessary properties that dont affect visuals. Remove aura barrels.
  //IF CHANGE STUFF IN THE SERVER, REMEMBER TO CHANGE HERE TOO
  //this is only used for upgrade tree, NOT buttons and the actual game
  //tank names with hyphen need inverted commas, e.g. "auto-guard"
  base: {
    upgradeTo: ['raider','wall','sentry'],//needed for upgrade tree (decide which tank to grey out)
  },
  smasher: {
    assets: {
      assetOne: {
        type: "under",
        sides: 6,
        color: "#5F676C",
        outline: "#41494E",
        size: 1.25,
      },
    },
    upgradeTo: ['spike','armory'],
  },
  spike: {
    assets: {
      assetOne: {
        type: "under",
        sides: 4,
        color: "#5F676C",
        outline: "#41494E",
        size: 1.5,
      },
    },
    upgradeTo: ['thorn'],
  },
  thorn: {
    assets: {
      assetOne: {
        type: "under",
        sides: 5,
        color: "#5F676C",
        outline: "#41494E",
        size: 1.5,
      },
    },
    upgradeTo: ['saw','battalion'],
  },
  saw: {
    assets: {
      assetOne: {
        type: "under",
        sides: 4,
        color: "#5F676C",
        outline: "#41494E",
        size: 1.75,
      },
    },
    upgradeTo: [],
  },
  armory: {
    turretBaseSize: 0.6,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.8,
        barrelHeight: 1.6,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    assets: {
      assetOne: {
        type: "under",
        sides: 6,
        color: "#5F676C",
        outline: "#41494E",
        size: 1.25,
      },
    },
    upgradeTo: ['brigade'],
  },
  brigade: {
    turretBaseSize: 0.7,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.8,
        barrelHeight: 1.6,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    assets: {
      assetOne: {
        type: "under",
        sides: 4,
        color: "#5F676C",
        outline: "#41494E",
        size: 1.5,
      },
    },
    upgradeTo: ['battalion'],
  },
  battalion: {
    turretBaseSize: 0.7,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.8,
        barrelHeight: 1.7,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    assets: {
      assetOne: {
        type: "under",
        sides: 5,
        color: "#5F676C",
        outline: "#41494E",
        size: 1.5,
      },
    },
    upgradeTo: [],
  },
  raider: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(153,153,151)",
        outline: "rgb(122,124,123)",
        size: 0.6,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgb(253,118,118)",
        outline: "rgb(222,88,88)",
        size: 0.3,
      },
    },
    upgradeTo: ['forge'],
  },
  forge: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(153,153,151)",
        outline: "rgb(122,124,123)",
        size: 0.65,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgb(253,118,118)",
        outline: "rgb(222,88,88)",
        size: 0.35,
      },
    },
    upgradeTo: ['foundry','mender','hail'],
  },
  foundry: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(153,153,151)",
        outline: "rgb(122,124,123)",
        size: 0.7,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgb(253,118,118)",
        outline: "rgb(222,88,88)",
        size: 0.35,
      },
    },
    upgradeTo: ['flame'],
  },
  flame: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(153,153,151)",
        outline: "rgb(122,124,123)",
        size: 0.8,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgb(253,118,118)",
        outline: "rgb(222,88,88)",
        size: 0.4,
      },
    },
    upgradeTo: ['inferno','juggernaut'],
  },
  inferno: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(153,153,151)",
        outline: "rgb(122,124,123)",
        size: 0.9,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgb(253,118,118)",
        outline: "rgb(222,88,88)",
        size: 0.45,
      },
    },
    upgradeTo: [],
  },
  juggernaut: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(153,153,151)",
        outline: "rgb(122,124,123)",
        size: 0.75,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgba(120, 118, 194)",
        outline: "rgba(90, 88, 164)",
        size: 0.3,
      },
    },
    upgradeTo: [],
  },
  mender: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(153,153,151)",
        outline: "rgb(122,124,123)",
        size: 0.65,
      },
      assetTwo: {
        type: "above",
        sides: 8,
        color: "rgba(56,183,100)",
        outline: "rgba(26,153,70)",
        size: 0.3,
      },
    },
    upgradeTo: ['remedy'],
  },
  remedy: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(153,153,151)",
        outline: "rgb(122,124,123)",
        size: 0.75,
      },
      assetTwo: {
        type: "above",
        sides: 8,
        color: "rgba(56,183,100)",
        outline: "rgba(26,153,70)",
        size: 0.4,
      },
    },
    upgradeTo: ['fabricator'],
  },
  fabricator: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(153,153,151)",
        outline: "rgb(122,124,123)",
        size: 0.9,
      },
      assetTwo: {
        type: "above",
        sides: 8,
        color: "rgba(56,183,100)",
        outline: "rgba(26,153,70)",
        size: 0.45,
      },
    },
    upgradeTo: [],
  },
  hail: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        size: 0.65,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgba(150, 208, 227)",
        outline: "rgba(132, 190, 209)",
        size: 0.3,
      },
    },
    upgradeTo: ['blizzard'],
  },
  blizzard: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        size: 0.65,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgba(150, 208, 227)",
        outline: "rgba(132, 190, 209)",
        size: 0.3,
      },
    },
    upgradeTo: ['snowstorm'],
  },
  snowstorm: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        size: 0.65,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgba(150, 208, 227)",
        outline: "rgba(132, 190, 209)",
        size: 0.3,
      },
    },
    upgradeTo: [],
  },
  wall: {
    assets: {
      assetOne: {
        type: "above",
        sides: 6,
        color: "default",
        outline: "default",
        size: 1.15,
      },
    },
    upgradeTo: ['castle','smasher','propeller'],
  },
  castle: {
    assets: {
      assetOne: {
        type: "above",
        sides: 6,
        color: "default",
        outline: "default",
        size: 1.2,
      },
      assetTwo: {
        type: "above",
        sides: 6,
        color: "default",
        outline: "default",
        size: 0.6,
      },
    },
    upgradeTo: ['fortress'],
  },
  fortress: {
    assets: {
      assetOne: {
        type: "above",
        sides: 7,
        color: "default",
        outline: "default",
        size: 1.2,
      },
      assetTwo: {
        type: "above",
        sides: 7,
        color: "default",
        outline: "default",
        size: 0.7,
      },
    },
    upgradeTo: ['palace'],
  },
  palace: {
    assets: {
      assetOne: {
        type: "above",
        sides: 8,
        color: "default",
        outline: "default",
        size: 1.1,
      },
      assetTwo: {
        type: "above",
        sides: 6,
        color: "default",
        outline: "default",
        size: 0.8,
      },
    },
    upgradeTo: ['ziggurat'],
  },
  ziggurat: {
    assets: {
      assetOne: {
        type: "above",
        sides: 8,
        color: "default",
        outline: "default",
        size: 1.1,
      },
      assetTwo: {
        type: "above",
        sides: 6,
        color: "default",
        outline: "default",
        size: 0.8,
      },
      assetThree: {
        type: "above",
        sides: 4,
        color: "default",
        outline: "default",
        size: 0.4,
      },
    },
    upgradeTo: [],
  },
  sentry: {
    turretBaseSize: 0.4,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.5,
        barrelHeight: 1,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['mono','hangar'],
  },
  mono: {
    turretBaseSize: 0.6,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.8,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['bastion','turret','armory'],
  },
  bastion: {
    turretBaseSize: 0.7,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.8,
        barrelHeight: 1.6,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['artillery'],
  },
  artillery: {
    turretBaseSize: 0.7,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.9,
        barrelHeight: 1.8,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['bombard','battalion'],
  },
  bombard: {
    turretBaseSize: 0.7,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.9,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  turret: {
    turretBaseSize: 0.7,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.6,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: -0.4,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.6,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0.4,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['triplet'],
  },
  triplet: {
    turretBaseSize: 0.7,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.4,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: -0.4,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0.4,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.6,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['quadruplet'],
  },
  quadruplet: {
    turretBaseSize: 0.7,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0.4,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: -0.4,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: -0.2,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.4,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0.2,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  hangar: {
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['warship'],
  },
  warship: {
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 0,
        x: 0.9,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 0,
        x: -0.9,
        barrelType: "drone",
      },
    },
    upgradeTo: ['battleship'],
  },
  battleship: {
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 0,
        x: 0.9,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 120/180*Math.PI,
        x: 0.9,
        barrelType: "drone",
      },
      barrelThree: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 240/180*Math.PI,
        x: 0.9,
        barrelType: "drone",
      },
    },
    upgradeTo: ['mothership'],
  },
  mothership: {
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 0,
        x: 0.9,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 90/180*Math.PI,
        x: 0.9,
        barrelType: "drone",
      },
      barrelThree: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 180/180*Math.PI,
        x: 0.9,
        barrelType: "drone",
      },
      barrelFour: {
        barrelWidth: 0.75,
        barrelHeight: 0.75,
        additionalAngle: 270/180*Math.PI,
        x: 0.9,
        barrelType: "drone",
      },
    },
    upgradeTo: [],
  },
  propeller: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        size: 0.3,
      },
    },
    upgradeTo: ['thruster'],
  },
  thruster: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        size: 0.4,
      },
    },
    upgradeTo: ['launcher'],
  },
  launcher: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        size: 0.5,
      },
    },
    upgradeTo: ['rocketer'],
  },
  rocketer: {
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        size: 0.6,
      },
    },
    upgradeTo: [],
  },
  oven: {
    eternal: "yes",
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        outlineThickness: 5,
        size: 0.7,
      },
      assetTwo: {
        type: "above",
        sides: 0,
        color: "rgb(250, 112, 112)",
        outline: "rgba(227, 61, 61)",
        outlineThickness: 5,
        size: 0.4,
      },
    },
    upgradeTo: ['heliosphere','corvus'],
  },
  chainsaw: {
    eternal: "yes",
    assets: {
            assetOne: {
              type: "under",
              sides: 8,
              color: "grey",
              outline: "dimgrey",
              outlineThickness: 5,
              size: 1.2,
            },
          },
    upgradeTo: ['blade'],
  },
  blade: {
    eternal: "yes",
    assets: {
            assetOne: {
              type: "under",
              sides: 8,
              color: "#383838",
              outline: "black",
              outlineThickness: 5,
              size: 1.3,
            },
          },
    upgradeTo: [],
  },
  pounder: {
    eternal: "yes",
    assets: {
      assetTwo: {
        type: "under",
        sides: 6,
        color: "slategrey",
        outline: "black",
        outlineThickness: 5,
        size: 1.4,
      },
      assetOne: {
        type: "under",
        sides: 6,
        color: "dimgrey",
        outline: "black",
        outlineThickness: 5,
        size: 1.2,
      },
    },
    upgradeTo: ['chasm'],
  },
  lightning: {
    eternal: "yes",
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        outlineThickness: 5,
        size: 0.5,
      },
    },
    upgradeTo: ['firebolt'],
  },
  meteor: {
    eternal: "yes",
    turretBaseSize: 0.6,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.5,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: -0.3,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.5,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0.3,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['nebula'],
  },
  satellite: {
    eternal: "yes",
    turretBaseSize: 0.4,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.5,
        barrelHeight: 1,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['triton'],
  },
  heliosphere: {
    eternal: "yes",
    assets: {
      assetOne: {
        //grey aura base asset
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        outlineThickness: 5,
        size: 0.4, //in comparison to the player's width
        angle: 0,
        x: 0,
        y: 0,
      },
      assetTwo: {
        //red aura base asset
        type: "above",
        sides: 0,
        color: "rgb(250, 112, 112)",
        outline: "rgba(227, 61, 61)",
        outlineThickness: 5,
        size: 0.2, //in comparison to the player's width
        angle: 0,
        x: 0,
        y: 0,
      },
      assetThree: {
        //grey aura base asset
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        outlineThickness: 5,
        size: 0.2, //in comparison to the player's width
        angle: 0,
        x: 0.7,
        y: 0,
      },
      assetFour: {
        //red aura base asset
        type: "above",
        sides: 0,
        color: "rgb(250, 112, 112)",
        outline: "rgba(227, 61, 61)",
        outlineThickness: 5,
        size: 0.1, //in comparison to the player's width
        angle: 0,
        x: 0.7,
        y: 0,
      },
      assetFive: {
        //grey aura base asset
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        outlineThickness: 5,
        size: 0.2, //in comparison to the player's width
        angle: 0,
        x: -0.4,
        y: -0.6,
      },
      assetSix: {
        //red aura base asset
        type: "above",
        sides: 0,
        color: "rgb(250, 112, 112)",
        outline: "rgba(227, 61, 61)",
        outlineThickness: 5,
        size: 0.1, //in comparison to the player's width
        angle: 0,
        x: -0.4,
        y: -0.6,
      },
      assetSeven: {
        //grey aura base asset
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        outlineThickness: 5,
        size: 0.2, //in comparison to the player's width
        angle: 0,
        x: -0.4,
        y: 0.6,
      },
      assetEight: {
        //red aura base asset
        type: "above",
        sides: 0,
        color: "rgb(250, 112, 112)",
        outline: "rgba(227, 61, 61)",
        outlineThickness: 5,
        size: 0.1, //in comparison to the player's width
        angle: 0,
        x: -0.4,
        y: 0.6,
      },
    },
    upgradeTo: [],
  },
  corvus: {
    eternal: "yes",
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        outlineThickness: 5,
        size: 0.8,
      },
      assetTwo: {
        type: "above",
        sides: 8,
        color: "rgba(56,183,100)",
        outline: "rgba(26,153,70)",
        outlineThickness: 5,
        size: 0.5,
      },
    },
    upgradeTo: [],
  },
  firebolt: {
    eternal: "yes",
    assets: {
      assetOne: {
        type: "above",
        sides: 0,
        color: "rgb(105, 104, 104)",
        outline: "rgb(79, 78, 78)",
        outlineThickness: 5,
        size: 0.6, //in comparison to the player's width
        angle: 0,
        x: 0,
        y: 0,
      },
    },
    upgradeTo: [],
  },
  chasm: {
    eternal: "yes",
    assets: {
      assetOne: {
        type: "under",
        sides: 6,
        color: "#383838",
        outline: "black",
        outlineThickness: 5,
        size: 1.3, //in comparison to the player's width
        angle: 0,
        x: 0,
        y: 0,
      },
    },
    upgradeTo: [],
  },
  nebula: {
    eternal: "yes",
    turretBaseSize: 0.6,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.5,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: -0.3,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.5,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0.3,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.5,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  triton: {
    eternal: "yes",
    turretBaseSize: 0.5,
    bodybarrels: {
      barrelOne: {
        barrelWidth: 0.5,
        barrelHeight: 1,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.3,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: [],
  },
  primordial: {
    eternal: "yes",
    upgradeTo: ['oven','pounder','chainsaw','lightning','meteor','satellite'],
  },
};
export const weaponupgrades = {
  //weapon upgrades for upgrade tree is hardcoded into client. if change in server, remember to change here too
  node: {
    barrels: {},
    upgradeTo: ['basic','guard','trapper'],
  },
  basic: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.8,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['twin','sniper','cannon','flank'],
  },
  twin: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.8,
        barrelHeight: 2,
        additionalAngle: 0,
        x: -0.6,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.8,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0.6,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['gunner','quad','split','stream'],
  },
  sniper: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.2,
        barrelHeight: 2.4,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['targeter','marksman'],
  },
  cannon: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.4,
        barrelHeight: 1.8,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['single'],
  },
  flank: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 180,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['tri-angle','quad'],
  },
  trapper: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.5,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['delta'],
  },
  delta: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['gamma','blockade','minelayer','warden'],
  },
  guard: {
    barrels: {
      barrelOne: {
        barrelWidth: .5,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['commander','overseer'],
  },
  gunner: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: -0.8,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: -0.3,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0.3,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0.8,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['blaster','rimfire','minesweeper'],
  },
  quad: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 90,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 180,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 270,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['octo'],
  },
  split: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.5,
        barrelHeight: 1.4,
        additionalAngle: -30,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.5,
        barrelHeight: 1.4,
        additionalAngle: 30,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.83,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['tower','rimfire'],
  },
  stream: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['jet'],
  },
  targeter: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['streamliner'],
  },
  marksman: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2.8,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['duel'],
  },
  single: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.5,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['destroyer'],
  },
  "tri-angle": {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 150,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 210,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['booster','fighter'],
  },
  gamma: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['beta'],
  },
  blockade: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
      barrelTwo: {
        barrelWidth: 0.75,
        barrelHeight: 2,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['barricade'],
  },
  minelayer: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.6,
        additionalAngle: 0,
        x: 0,
        barrelType: "mine",
      },
    },
    upgradeTo: ['engineer'],
  },
  barricade: {
    barrels: {
      barrelTwo: {
        barrelWidth: 0.6,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
      barrelThree: {
        barrelWidth: 0.6,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['riot'],
  },
  commander: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['director'],
  },
  director: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.25,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['manager','spawner'],
  },
  overseer: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.5,
        barrelHeight: 1.5,
        additionalAngle: 90,
        x: 0,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.5,
        barrelHeight: 1.5,
        additionalAngle: -90,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['protector'],
  },
  protector: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 90,
        x: 0,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: -90,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['king'],
  },
  blaster: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: -0.6,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0.6,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['minigun','knockback'],
  },
  rimfire: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.7,
        barrelHeight: 1.8,
        additionalAngle: -15,
        x: -0.6,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: -0.3,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0.3,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.7,
        barrelHeight: 1.8,
        additionalAngle: 15,
        x: 0.6,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['centrefire'],
  },
  octo: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 45,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 90,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 135,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 180,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 225,
        x: 0,
        barrelType: "bullet",
      },
      barrelSeven: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 270,
        x: 0,
        barrelType: "bullet",
      },
      barrelEight: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 315,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['cyclone','hex'],
  },
  tower: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.6,
        additionalAngle: 40,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.6,
        additionalAngle: -40,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.8,
        additionalAngle: 20,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.8,
        additionalAngle: -20,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['stronghold','centrefire'],
  },
  jet: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['flamethrower'],
  },
  streamliner: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.8,
        barrelHeight: 2.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.8,
        barrelHeight: 2.25,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.8,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.8,
        barrelHeight: 1.75,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['conquerer'],
  },
  duel: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 3,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['hunter'],
  },
  destroyer: {
    barrels: {
      barrelOne: {
        barrelWidth: 2,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['hex','harbinger','hybrid'],
  },
  hybrid: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.65,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.85,
        barrelHeight: 1.6,
        additionalAngle: 180,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: [],
  },
  booster: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 135,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.72,
        additionalAngle: 155,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 225,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 1.72,
        additionalAngle: 205,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['guardian','comet'],
  },
  fighter: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.44,
        additionalAngle: 90,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 150,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.44,
        additionalAngle: -90,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 210,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['wave','amalgam'],
  },
  beta: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.25,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['alpha'],
  },
  warden: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.5,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
      barrelTwo: {
        barrelWidth: 0.5,
        barrelHeight: 1.4,
        additionalAngle: 90,
        x: 0,
        barrelType: "trap",
      },
      barrelThree: {
        barrelWidth: 0.5,
        barrelHeight: 1.4,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
      barrelFour: {
        barrelWidth: 0.5,
        barrelHeight: 1.4,
        additionalAngle: 270,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['defender'],
  },
  engineer: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.8,
        additionalAngle: 0,
        x: 0,
        barrelType: "mine",
      },
    },
    upgradeTo: ['machine','manufacturer','detonator'],
  },
  manager: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.5,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['executive','CEO','hybrid'],
  },
  spawner: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.7,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "minion",
      },
    },
    upgradeTo: ['factory'],
  },
  king: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: -120,
        x: 0,
        barrelType: "drone",
      },
      barrelThree: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 120,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['master','tyrant'],
  },
  factory: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "minion",
      },
    },
    upgradeTo: [],
  },
  master: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: -90,
        x: 0,
        barrelType: "drone",
      },
      barrelThree: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 90,
        x: 0,
        barrelType: "drone",
      },
      barrelFour: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 180,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: [],
  },
  tyrant: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.5,
        additionalAngle: -72,
        x: 0,
        barrelType: "drone",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.5,
        additionalAngle: 72,
        x: 0,
        barrelType: "drone",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.5,
        additionalAngle: -144,
        x: 0,
        barrelType: "drone",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 1.5,
        additionalAngle: 144,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: [],
  },
  industry: {
    eternal: "yes",
    barrels: {
      barrelOne: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "minion",
      },
      barrelTwo: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 120,
        x: 0,
        barrelType: "minion",
      },
      barrelThree: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 240,
        x: 0,
        barrelType: "minion",
      },
    },
    upgradeTo: [],
  },
  battler: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.7,
        barrelHeight: 1.8,
        additionalAngle: -15,
        x: -0.6,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: -0.3,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0.3,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.7,
        barrelHeight: 1.8,
        additionalAngle: 15,
        x: 0.6,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1 ,
        barrelHeight: 2,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: [],
  },
  pinnace: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0.3,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: -0.3,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 1.8,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.75,
        barrelHeight: 2.25,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
      barrelFive: {
        barrelWidth: 0.75,
        barrelHeight: 1.5,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: [],
  },
  minigun: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.4,
        barrelHeight: 2.3,
        additionalAngle: 0,
        x: -0.6,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 2.3,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 2.3,
        additionalAngle: 0,
        x: 0.6,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.4,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: -0.6,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 0.4,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 0.4,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0.6,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  knockback: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.8,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: -0.6,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.8,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0.6,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  centrefire: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.7,
        barrelHeight: 1.6,
        additionalAngle: -10,
        x: -0.6,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.7,
        barrelHeight: 1.6,
        additionalAngle: 10,
        x: 0.6,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 1.8,
        additionalAngle: 0,
        x: -0.3,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 1.8,
        additionalAngle: 0,
        x: 0.3,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 0.5,
        barrelHeight: 2.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  macrofire: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.7,
        barrelHeight: 1.8,
        additionalAngle: -25,
        x: -0.6,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: -0.3,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0.3,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.7,
        barrelHeight: 1.8,
        additionalAngle: 25,
        x: 0.6,
        barrelType: "bullet",
      },
    },
  },
  cyclone: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 30,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 60,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 90,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 120,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 150,
        x: 0,
        barrelType: "bullet",
      },
      barrelSeven: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 180,
        x: 0,
        barrelType: "bullet",
      },
      barrelEight: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 210,
        x: 0,
        barrelType: "bullet",
      },
      barrelNine: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 240,
        x: 0,
        barrelType: "bullet",
      },
      barrelTen: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 270,
        x: 0,
        barrelType: "bullet",
      },
      barrelEleven: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 300,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwelve: {
        barrelWidth: 0.67,
        barrelHeight: 1.6,
        additionalAngle: 330,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  stronghold: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 45,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: -45,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.6,
        additionalAngle: 30,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.6,
        additionalAngle: -30,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 1.8,
        additionalAngle: 15,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 1,
        barrelHeight: 1.8,
        additionalAngle: -15,
        x: 0,
        barrelType: "bullet",
      },
      barrelSeven: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  flamethrower: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  conquerer: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.8,
        barrelHeight: 3,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.8,
        barrelHeight: 2.75,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.8,
        barrelHeight: 2.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 0.8,
        barrelHeight: 2.25,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 0.8,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 0.8,
        barrelHeight: 1.75,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelSeven: {
        barrelWidth: 0.8,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  hunter: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 3.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  hex: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.2,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1.2,
        barrelHeight: 2,
        additionalAngle: 60,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1.2,
        barrelHeight: 2,
        additionalAngle: 120,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1.2,
        barrelHeight: 2,
        additionalAngle: 180,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1.2,
        barrelHeight: 2,
        additionalAngle: 240,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 1.2,
        barrelHeight: 2,
        additionalAngle: 300,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  harbinger: {
    barrels: {
      barrelOne: {
        barrelWidth: 2,
        barrelHeight: 2.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  guardian: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.9,
        additionalAngle: 190,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.9,
        additionalAngle: 170,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 2.05,
        additionalAngle: 180,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  comet: {
    barrels: {
      barrelSix: {
        barrelWidth: 1,
        barrelHeight: 1.34,
        additionalAngle: 245,
        x: 0,
        barrelType: "bullet",
      },
      barrelSeven: {
        barrelWidth: 1,
        barrelHeight: 1.34,
        additionalAngle: -245,
        x: 0,
        barrelType: "bullet",
      },
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 135,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.72,
        additionalAngle: 155,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 225,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 1.72,
        additionalAngle: 205,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  wave: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.44,
        additionalAngle: 100,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 145,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.44,
        additionalAngle: -100,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: -145,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 1,
        barrelHeight: 1.8,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: [],
  },
  amalgam: {
    barrels: {
      barrelOne: {
        barrelWidth: 1/5*4.2,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0.5,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1/5*4.2,
        barrelHeight: 2,
        additionalAngle: 0,
        x: -0.5,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1/1.5,
        barrelHeight: 1.4,
        additionalAngle: -20,
        x: -0.4,
        barrelType: "trap",
      },
      barrelFour: {
        barrelWidth: 1/1.5,
        barrelHeight: 1.4,
        additionalAngle: 20,
        x: 0.4,
        barrelType: "trap",
      },
      barrelFive: {
        barrelWidth: .5,
        barrelHeight: 1.6,
        additionalAngle: 140,
        x: 0,
        barrelType: "drone",
      },
      barrelSix: {
        barrelWidth: .5,
        barrelHeight: 1.6,
        additionalAngle: 220,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: [],
  },
  alpha: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.5,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: [],
  },
  riot: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.6,
        barrelHeight: 2.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
      barrelTwo: {
        barrelWidth: 0.6,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
      barrelThree: {
        barrelWidth: 0.6,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: [],
  },
  defender: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 60,
        x: 0,
        barrelType: "trap",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 120,
        x: 0,
        barrelType: "trap",
      },
      barrelFour: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
      barrelFive: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 240,
        x: 0,
        barrelType: "trap",
      },
      barrelSix: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 300,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['shrapnel'],
  },
  shrapnel: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 45,
        x: 0,
        barrelType: "trap",
      },
      barrelThree: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 90,
        x: 0,
        barrelType: "trap",
      },
      barrelFour: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 135,
        x: 0,
        barrelType: "trap",
      },
      barrelFive: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
      barrelSix: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 225,
        x: 0,
        barrelType: "trap",
      },
      barrelSeven: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 270,
        x: 0,
        barrelType: "trap",
      },
      barrelEight: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 315,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: [],
  },
  machine: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "mine",
      },
    },
    upgradeTo: [],
  },
  manufacturer: {
    barrels: {
      barrelOne: {
        barrelWidth: 1 * 1.3,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "mine",
      },
    },
    upgradeTo: [],
  },
  detonator: {
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "mine",
      },
    },
    upgradeTo: [],
  },
  executive: {
    barrels: {
      barrelOne: {
        barrelWidth: 1.7,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: [],
  },
  CEO: {
    barrels: {
      barrelOne: {
        barrelWidth: 2,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: [],
  },
  hailstorm: {
    eternal: "yes",
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 120,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 240,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['thunderstorm','cosmetic'],
  },
  bunker: {
    eternal: "yes",
    barrels: {
      barrelTwo: {
        barrelWidth: 0.5,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
      barrelThree: {
        barrelWidth: 0.5,
        barrelHeight: 1.5,
        additionalAngle: 120,
        x: 0,
        barrelType: "trap",
      },
      barrelFour: {
        barrelWidth: 0.5,
        barrelHeight: 1.5,
        additionalAngle: 240,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['vault','asteroid','dynamite'],
  },
  chaos: {
    eternal: "yes",
    barrels: {
      barrelOne: {
        barrelWidth: 0.67,
        barrelHeight: 1.3,
        additionalAngle: 90,
        x: 0,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.67,
        barrelHeight: 1.3,
        additionalAngle: -90,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: ['mayhem','industry'],
  },
  bombshell: {
    eternal: "yes",
    barrels: {
      barrelOne: {
        barrelWidth: 1.5,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1.5,
        barrelHeight: 1.2,
        additionalAngle: 120,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1.5,
        barrelHeight: 1.2,
        additionalAngle: 240,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: ['demolisher'],
  },
  warrior: {
    eternal: "yes",
    barrels: {
      barrelEight: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.44,
        additionalAngle: 120,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.44,
        additionalAngle: -120,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 1,
        barrelHeight: 1.8,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['veteran'],
  },
  thunderstorm: {
    eternal: "yes",
    barrels: {
      barrelOne: {
        barrelWidth: 0.9,
        barrelHeight: 1.3,
        additionalAngle: 180,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.9,
        barrelHeight: 1.3,
        additionalAngle: 60,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.9,
        barrelHeight: 1.3,
        additionalAngle: 120,
        x: 0,
        barrelType: "bullet",
      },

      barrelFour: {
        barrelWidth: 0.9,
        barrelHeight: 1.3,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 0.9,
        barrelHeight: 1.3,
        additionalAngle: 240,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 0.9,
        barrelHeight: 1.3,
        additionalAngle: 300,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  cosmetic: {
    eternal: "yes",
    barrels: {
      barrelOne: {
              barrelWidth: 0.9,
              barrelHeight: 1.6,
              additionalAngle: 180,
              x: 0,
              barrelType: "bullet",
            },
            barrelTwo: {
              barrelWidth: 0.9,
              barrelHeight: 1.6,
              additionalAngle: 60,
              x: 0,
              barrelType: "bullet",
            },
            barrelThree: {
              barrelWidth: 0.8,
              barrelHeight: 1.3,
              additionalAngle: 120,
              x: 0,
              barrelType: "bullet",
            },

            barrelFour: {
              barrelWidth: 0.8,
              barrelHeight: 1.3,
              additionalAngle: 0,
              x: 0,
              barrelType: "bullet",
            },
            barrelFive: {
              barrelWidth: 0.8,
              barrelHeight: 1.3,
              additionalAngle: 240,
              x: 0,
              barrelType: "bullet",
            },
            barrelSix: {
              barrelWidth: 0.9,
              barrelHeight: 1.6,
              additionalAngle: 300,
              x: 0,
              barrelType: "bullet",
            },
    },
    upgradeTo: [],
  },
  vault: {
    eternal: "yes",
    barrels: {
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 60,
        x: 0,
        barrelType: "trap",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 120,
        x: 0,
        barrelType: "trap",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 240,
        x: 0,
        barrelType: "trap",
      },
      barrelSix: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 300,
        x: 0,
        barrelType: "trap",
      },
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.2,
        additionalAngle: 0,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: [],
  },
  asteroid: {
    eternal: "yes",
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 1.5,
        additionalAngle: 0,
        x: 0,
        barrelType: "mine",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.5,
        additionalAngle: 120,
        x: 0,
        barrelType: "mine",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.5,
        additionalAngle: 240,
        x: 0,
        barrelType: "mine",
      },
    },
    upgradeTo: [],
  },
  mayhem: {
    eternal: "yes",
    barrels: {
      barrelOne: {
        barrelWidth: 0.67,
        barrelHeight: 1.3,
        additionalAngle: 90,
        x: 0,
        barrelType: "drone",
      },
      barrelTwo: {
        barrelWidth: 0.67,
        barrelHeight: 1.3,
        additionalAngle: -90,
        x: 0,
        barrelType: "drone",
      },
      barrelThree: {
        barrelWidth: 0.67,
        barrelHeight: 1.3,
        additionalAngle: 0,
        x: 0,
        barrelType: "drone",
      },
      barrelFour: {
        barrelWidth: 0.67,
        barrelHeight: 1.3,
        additionalAngle: 180,
        x: 0,
        barrelType: "drone",
      },
    },
    upgradeTo: [],
  },
  dynamite: {
    eternal: "yes",
    barrels: {
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "mine",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 120,
        x: 0,
        barrelType: "mine",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 240,
        x: 0,
        barrelType: "mine",
      },
    },
    upgradeTo: [],
  },
  demolisher: {
    eternal: "yes",
    barrels: {
      barrelOne: {
        barrelWidth: 1.5,
        barrelHeight: 1.3,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1.5,
        barrelHeight: 1.3,
        additionalAngle: 60,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1.5,
        barrelHeight: 1.3,
        additionalAngle: 120,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1.5,
        barrelHeight: 1.3,
        additionalAngle: 180,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1.5,
        barrelHeight: 1.3,
        additionalAngle: 240,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 1.5,
        barrelHeight: 1.3,
        additionalAngle: 300,
        x: 0,
        barrelType: "bullet",
      },
    },
    upgradeTo: [],
  },
  veteran: {
    eternal: "yes",
    barrels: {
      barrelSeven: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 25,
        x: 0,
        barrelType: "drone",
      },
      barrelEight: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: -25,
        x: 0,
        barrelType: "drone",
      },
      barrelOne: {
        barrelWidth: 1,
        barrelHeight: 2,
        additionalAngle: 0,
        x: 0,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 1,
        barrelHeight: 1.44,
        additionalAngle: 100,
        x: 0,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: 145,
        x: 0,
        barrelType: "bullet",
      },
      barrelFour: {
        barrelWidth: 1,
        barrelHeight: 1.44,
        additionalAngle: -100,
        x: 0,
        barrelType: "bullet",
      },
      barrelFive: {
        barrelWidth: 1,
        barrelHeight: 1.4,
        additionalAngle: -145,
        x: 0,
        barrelType: "bullet",
      },
      barrelSix: {
        barrelWidth: 1,
        barrelHeight: 1.8,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: [],
  },
  eternal: {
    eternal: "yes",
    upgradeTo: ['hailstorm','bunker','chaos','bombshell','warrior'],
  },
  minesweeper: {
    barrels: {
      barrelOne: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: -0.3,
        barrelType: "bullet",
      },
      barrelTwo: {
        barrelWidth: 0.4,
        barrelHeight: 1.4,
        additionalAngle: 0,
        x: 0.3,
        barrelType: "bullet",
      },
      barrelThree: {
        barrelWidth: 0.75,
        barrelHeight: 2,
        additionalAngle: 180,
        x: 0,
        barrelType: "trap",
      },
    },
    upgradeTo: ['battler','pinnace'],
  },
};

export const bodyColors = {//side note: color when hit or have spawn protection has values in RGB is 20 higher)
  blue: {
    col: "#00B0E1",
    outline: "#0092C3",
  },
  green: {
    col: "#00E06C",
    outline: "#00C24E",
  },
  red: {
    col: "#F04F54",
    outline: "#b33b3f",
  },
  purple: {
    col: "#BE7FF5",
    outline: "#A061D7",
  },
  magenta: {
    col: "#D82BCF",
    outline: "#BA0DB1",
  },
  fallen: {
    col: "#C0C0C0",
    outline: "#A2A2A2",
  },
  eternal: {
    col: "#934c93",
    outline: "#660066",
  },
  celestial: {
    col: "#F177DD",
    outline: "#D359BF",
  },
  barrel: {
    col: "#999999",
    outline: "#7B7B7B",
  },
  asset: {
    col: "#5F676C",
    outline: "#41494E",
  },
  triangle: {
    col: "#FFE46B",
    outline: "#E1C64D",
  },
  square: {
    col: "#FC7676",
    outline: "#DE5858",
  },
  pentagon: {
    col: "#768CFC",
    outline: "#586EDE",
  },
  hexagon: {
    col: "#FCA644",
    outline: "#DE8826",
  },
  heptagon: {
    col: "#38B764",
    outline: "#1A9946",
  },
  octagon: {
    col: "#4A66BD",
    outline: "#2C489F",
  },
  nonagon: {
    col: "#5D275D",
    outline: "#3F093F",
  },
  decagon: {
    col: "#1A1C2C",
    outline: "#00000E",
  },
  hendecagon: {
    col: "#060011",
    outline: "#000000",
  },
  dodecagon: {
    col: "#403645",
    outline: "#221827",
  },
  tridecagon: {
    col: "#EDEDFF",
    outline: "#CFCFE1",
  },
  tetradecagon: {
    col: "#000000",
    outline: "#000000",
  },
  transparent: {
    col: "transparent",
    outline: "transparent",
  }
};


export const botcolors = {
  //get colors based on dune mob name
  Cluster: {
    color: "#00ffff",
    outline: "#09d3fb",
    specialty: "",
    static: "no",
    minion: "no",
  },
  Pursuer: {
    color: "#00ffff",
    outline: "#09d3fb",
    specialty: "",
    static: "no",
    minion: "yes",
  },
  Crasher: {
    color: "#00ffff",
    outline: "#09d3fb",
    specialty: "",
    static: "no",
    minion: "yes",
  },
  Champion: {
    color: "#00ffff",
    outline: "#09d3fb",
    specialty: "",
    static: "no",
    minion: "no",
  },
  Infestor: {
    color: "#916f6f",
    outline: "#6c5353",
    specialty: "",
    static: "no",
    minion: "no",
  },
  Pillbox: {
    color: "#916f6f",
    outline: "#6c5353",
    specialty: "bullet knockback",
    static: "no",
    minion: "yes",
  },
  Leech: {
    color: "#916f6f",
    outline: "#6c5353",
    specialty: "lifesteal",
    static: "no",
    minion: "yes",
  },

  "Cavern Protector": {
    color: "#FFE46B",
    outline: "#E1C64D",
    specialty: "",
    static: "no",
    minion: "no",
  },
  "Abyssling": {
    color: "#FFE46B",
    outline: "#E1C64D",
    specialty: "",
    static: "no",
    minion: "no",
  },


  Legion: {
    color: "#e9ac7a",
    outline: "#d99b68",
    specialty: "",
    static: "no",
    minion: "no",
  },
  Booster: {
    color: "#e9ac7a",
    outline: "#d99b68",
    specialty: "",
    static: "no",
    minion: "no",
  },
  'Mega-Crasher': {
    color: "#bf3939",
    outline: "#B22222",
    specialty: "",
  },
  Spike: {
    color: "#123573",
    outline: "#0c2859",
    specialty: "it hurts",
  },
  Mortar: {
    color: "#001a47",
    outline: "#001333",
    specialty: "it hurts even more",
  },
  Rogue: {
    color: "#731582",
    outline: "#581063",
    specialty: "lifesteal",
  },
  Shield: {
    color: "#c79b4e",
    outline: "#a6803d",
    specialty: "bullet knockback",
  },
  Grower: {
    color: "#9400D3",
    outline: "#62008B",
    specialty: "grows when it deals damage",
  },
  Protector: {
    color: "#D5CE67",
    outline: "#ABA552",
    specialty: "sniper",
  },
  Boss: {
    color: "#86775F",
    outline: "#404040",
    specialty: "rarely spawns",
  },
  King: {
    color: "#47048a",
    outline: "#830ff7",
    specialty: "high health",
  },
  Titan: {
    color: "#a03333",
    outline: "#791a1a",
    specialty: "superior health",
  },
  Sultan: {
    color: "#0003b3",
    outline: "#00027a",
    specialty: "Upgraded Titan",
  },
  Beast: {
    color: "#B5D648",
    outline: "#5B692C",
    specialty: "Insane health",
  },
  Wall: {
    color: "#3b2b20",
    outline: "#8a6950",
    specialty: "bullet knockback",
  },

  Rock: {
    color: "#909090",
    outline: "#5c5c5c",
    specialty: "",
    static: "yes",
    minion: "no",
  },
  Gravel: {
    color: "#909090",
    outline: "#5c5c5c",
    specialty: "",
    static: "yes",
    minion: "no",
  },
  Boulder: {
    color: "#505250",
    outline: "#000000",
    specialty: "",
    static: "yes",
    minion: "no",
  },
  Mountain: {
    color: "#b8683b",
    outline: "#87563a",
    specialty: "",
    static: "yes",
    minion: "no",
  },
  Cactus: {
    color: "#60b560",
    outline: "#428042",
    specialty: "",
    static: "yes",
    minion: "no",
  },
};