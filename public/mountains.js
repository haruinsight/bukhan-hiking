// 산별 설정(현재 북한산만 사용). pts: [거리m, 고도m, 지점, 고도출처]
const MOUNTAINS={
 "bukhan": {
  "name": "북한산",
  "peak": "백운대",
  "h": 836,
  "course": "백운대 코스",
  "step": 10,
  "pts": [
   [
    0,
    320,
    "백운대탐방지원센터",
    "공식"
   ],
   [
    350,
    410,
    "도선사 갈림길",
    "추정"
   ],
   [
    800,
    515,
    "하루재",
    "추정"
   ],
   [
    1000,
    500,
    "인수암",
    "추정"
   ],
   [
    1400,
    650,
    "백운대피소",
    "추정"
   ],
   [
    1650,
    725,
    "위문(백운봉암문)",
    "추정"
   ],
   [
    1900,
    836,
    "백운대",
    "공식"
   ]
  ],
  "zones": [
   {
    "to": 800,
    "label": "숲길 · 신갈나무·소나무",
    "trees": [
     "oak",
     "pine",
     "maple",
     "oak",
     "pine"
    ],
    "dens": 1,
    "ground": "#6f8f4e",
    "soil": "#cdb487",
    "grass": "#7fa257"
   },
   {
    "to": 1400,
    "label": "돌계단 · 소나무",
    "trees": [
     "pine",
     "oak",
     "pine"
    ],
    "dens": 0.6,
    "ground": "#7d8c5c",
    "soil": "#c9b48d",
    "grass": "#879c5f",
    "steps": "wood"
   },
   {
    "to": 1900,
    "label": "화강암 암릉 · 쇠난간",
    "trees": [
     "pine"
    ],
    "dens": 0.15,
    "ground": "#b9b2a6",
    "soil": "#d6cfc2",
    "grass": "#9aa070",
    "rail": true,
    "slab": true
   }
  ],
  "rock": {
   "c1": "#ddd6ca",
   "c2": "#bfb6a8",
   "type": "granite"
  },
  "sky": [
   "#8fb8de",
   "#f3e6d2"
  ],
  "far": [
   [
    "river",
    0.55
   ],
   [
    "city",
    0.3
   ],
   [
    "namsan",
    0.5
   ],
   [
    "lotte",
    0.75
   ]
  ],
  "mid": [
   [
    "fortress",
    0.35
   ],
   [
    "temple",
    0.15
   ],
   [
    "dome",
    0.62,
    "인수봉"
   ],
   [
    "jag",
    0.85
   ]
  ],
  "summit": "taegeukgi",
  "special": {
   "icon": "fortress",
   "name": "북한산성"
  }
 }
};
if(typeof module!=='undefined')module.exports=MOUNTAINS;else window.MOUNTAINS=MOUNTAINS;
