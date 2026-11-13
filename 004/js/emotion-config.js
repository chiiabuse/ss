// Initial emotion values and command/personality tuning.
export const emotionDefaults = {
  "evil": {
    "hate": 18,
    "satisfaction": 45,
    "fear": 5
  },
  "normal": {
    "hate": 0,
    "satisfaction": 28,
    "fear": 25
  },
  "red": {
    "hate": 6,
    "satisfaction": 32,
    "fear": 28
  },
  "white": {
    "hate": 12,
    "satisfaction": 45,
    "fear": 14
  }
};

export const emotionDeltas = {
  "snack": [-15, 35, -8],
  "scold": [
    9,
    -9,
    7
  ],
  "poke": [
    13,
    -12,
    12
  ],
  "blanket": [
    11,
    -22,
    8
  ],
  "tease": [
    15,
    -24,
    6
  ],
  "ignore": [
    7,
    -15,
    4
  ],
  "shift": [
    7,
    -12,
    6
  ],
  "toy": [
    14,
    -23,
    7
  ],
  "shoo": [
    11,
    -13,
    11
  ],
  "clap": [
    8,
    -10,
    11
  ],
  "restore": [-4, 23, -10],
  "feed": [-4, 25, -5],
  "pet": [-6, 14, -18],
  "gift": [-5, 22, -10],
  "pochette": [-5, 24, -9],
  "takePochette": [
    14,
    -24,
    8
  ],
  "slap": [
    32,
    -35,
    24
  ]
};

export const personalityMultipliers = {
  "evil": [
    1.4,
    1,
    0.7
  ],
  "normal": [
    0.6,
    1,
    1.15
  ],
  "red": [
    0.8,
    1.1,
    1.2
  ],
  "white": [
    1.15,
    1.3,
    1
  ]
};

// Amplify only recent consecutive uses; lifetime counts remain display/history data.
export const repeatLimits={step:.05,maxMultiplier:1.2,windowSeconds:60};
