export const PLAYER = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  speedX: 0,
  speedY: 0,
  maxSpeedX: 5,
  maxSpeedY: 5,
  ammo: 0, // loaded from ship
  ammoColor: '', //loaded from lasers
  shieldStrength: 0, //loaded from ships
  shieldStrengthOriginal: 0,
  numbersOfLaser: 0, //loaded from ships
  laserName: '', //loaded from ships
  laserColor: '', //loaded from lasers
  score: 0,
  image: null,
  isDamaged: false,
  isDelete: false,

  shieldImage: null,
  shieldName: '', //loaded from ships
  shieldWidth: 0, //loaded from image
  shieldHeight: 0, //loaded from image
  shieldDisplayTime: 0, //loaded from SHIELDSALL
  animationShieldTimeBuffer: 0,

  explosImage: null,
  explosName: '', //loaded from ships
  explosWidth: 0, //loaded from image
  explosHeight: 0, //loaded from image
  explosIsSheet: true, //loaded from image
  explosRows: 0, //loaded from EXPLOSALL
  explosColumns: 0, //loaded from EXPLOSALL
  explosFrameX: 0,
  explosFrameY: 0,
  explosFrameWidth: 0,
  explosFrameHeight: 0,
  explosDisplayTime: 0, //loaded from EXPLOSALL
  animationExplosTimeBuffer: 0,

  nextImage: null,
  nextName: 'PLAYERNEXT',
  nextWidth: 0, //loaded from image
  nextHeight: 0, //loaded from image
  nextIsSheet: true,
  nextRows: 0, //loaded from PLAYERNEXTALL
  nextColumns: 0, //loaded from PLAYERNEXTALL
  nextFrameX: 0,
  nextFrameY: 0,
  nextFrameWidth: 0,
  nextFrameHeight: 0,
  nextDisplayTime: 0, //loaded from PLAYERNEXTALL
  nextDelayFrames: 0, //loaded from PLAYERNEXTALL
  animationNextTimeBuffer: 0,
  isAnimatingNext: false,
};

export const PLAYERSHIPS = [
  {
    name: 'FALCON',
    image: null,
    src: '/gameImages/shipFalcon.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    ammo: 100,
    shieldStrength: 60,
    laserName: 'LASERSMALLBLUE',
    numbersOfLaser: 1,
    shieldImage: null,
    shieldName: 'SHIELDBLUE',
    explosImage: null,
    explosName: 'EXPLOS',
    explosWidth: 0, //loaded from image
    explosHeight: 0, //loaded from image
  },
  {
    name: 'XWING',
    image: null,
    src: '/gameImages/shipXwing.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    ammo: 170,
    shieldStrength: 100,
    laserName: 'LASERSMALLBLUE',
    numbersOfLaser: 2,
    shieldImage: null,
    shieldName: 'SHIELDBLUE',
    explosImage: null,
    explosName: 'EXPLOS',
    explosWidth: 0, //loaded from image
    explosHeight: 0, //loaded from image
  },
  {
    name: 'ADVANCEDSHIP',
    image: null,
    src: '/gameImages/Xwing.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    ammo: 170,
    shieldStrength: 100,
    laserName: 'LASERMEDIUMBLUE',
    numbersOfLaser: 2,
    shieldImage: null,
    shieldName: 'SHIELDBLUE',
    explosImage: null,
    explosName: 'EXPLOS',
    explosWidth: 0, //loaded from image
    explosHeight: 0, //loaded from image
  },
];

export const ENEMYSHIPS = [
  {
    name: 'STORMTROOPERBIKE',
    image: null,
    src: '/gameImages/shipBike.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    score: 10,
    shieldStrength: 10,
    laserName: 'LASERSMALLRED',
    numbersOfLaser: 1,
    shieldImage: null,
    shieldName: 'SHIELDBLUE',
    explosImage: null,
    explosName: 'EXPLOSMEDIUM',
    explosWidth: 0, //loaded from image
    explosHeight: 0, //loaded from image
  },
  {
    name: 'TIEFIGHTER',
    image: null,
    src: '/gameImages/shipTieFighter.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    score: 20,
    shieldStrength: 20,
    laserName: 'LASERMEDIUMRED',
    numbersOfLaser: 1,
    shieldImage: null,
    shieldName: 'SHIELDBLUE',
    explosImage: null,
    explosName: 'EXPLOSMEDIUM',
    explosWidth: 0, //loaded from image
    explosHeight: 0, //loaded from image
  },
  {
    name: 'TIEFIGHTER2',
    image: null,
    src: '/gameImages/shipTieFighter2.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    score: 30,
    shieldStrength: 50,
    laserName: 'LASERMEDIUMRED',
    numbersOfLaser: 1,
    shieldImage: null,
    shieldName: 'SHIELDBLUE',
    explosImage: null,
    explosName: 'EXPLOSMEDIUM',
    explosWidth: 0, //loaded from image
    explosHeight: 0, //loaded from image
  },
];

export const LASERSALL = [
  {
    name: 'LASERSMALLBLUE',
    image: null,
    src: '/gameImages/laserSmallBlue.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    strength: 10,
    speed: 10,
    color: '#00FFFF', //text Ammo color
  },
  {
    name: 'LASERMEDIUMBLUE',
    image: null,
    src: '/gameImages/laserMediumBlue.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    strength: 30,
    speed: 10,
    color: '#00FFFF', //text Ammo color
  },
  {
    name: 'LASERSMALLRED',
    image: null,
    src: '/gameImages/laserSmallRed.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    strength: 10,
    speed: 10,
    color: '#FF0000', //text Ammo color
  },
  {
    name: 'LASERMEDIUMRED',
    image: null,
    src: '/gameImages/laserMediumRed.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
    strength: 30,
    speed: 10,
    color: '#FF0000', //text Ammo color
  },
];

export const SHIELDSALL = [
  {
    name: 'SHIELDBLUE',
    image: null,
    src: '/gameImages/shield.png',
    displayTime: 100, //milliseconds
  },
];

export const EXPLOSALL = [
  {
    name: 'EXPLOS',
    image: null,
    src: '/gameImages/explosAnimSheet.png',
    isSheet: true, //is png animation sheet
    rows: 1,
    columns: 6,
    displayTime: 300, //milliseconds
  },
  {
    name: 'EXPLOSMEDIUM',
    image: null,
    src: '/gameImages/explos.png',
    isSheet: true, //is png animation sheet
    rows: 6,
    columns: 8,
    displayTime: 700, //milliseconds
  },
];

export const PLAYERNEXTALL = [
  {
    name: 'PLAYERNEXT',
    image: null,
    src: '/gameImages/playerLightAnim.png',
    isSheet: true, //is png animation sheet
    rows: 2,
    columns: 5,
    displayTime: 1000, //milliseconds
    delayFrames: 0, //milliseconds
  },
];

export const TEXTNEXTLEVEL0 = {
  fontSize: 0.02, //0.02 * (canvasWidth + canvasHeight) px
  fontWeight: '300',
  color: '#ffdf00',
  fontFamily: 'C64-Pro',
  align: 'center',
  positionX: 0.5, //0.5 * canvasWidth
  positionY: 0.1, //0.1 * canvasHeight
};

export const TEXTNEXTLEVEL1 = {
  positionX: 0.5, //0.5 * canvasWidth
  positionY: 0.2, //0.2 * canvasHeight
};

export const TEXTNEXTLEVEL = {
  fontSize: 0.06, //0.05 * (canvasWidth + canvasHeight) px
  fontWeight: '300',
  color: '#00FFFF',
  fontFamily: 'C64-Pro',
  align: 'center',
  positionX: 0.5, //0.5 * canvasWidth
  positionY: 0.45, //0.45 * canvasHeight
};

export const TEXTCOMPANY = {
  fontSize: 0.015, //0.01 * (canvasWidth + canvasHeight) px
  lineHeightModifier: 1.1, //1.1 * calculate lineHeight
  fontWeight: '300',
  color: '#ffdf00',
  fontFamily: 'C64-Pro',
  align: 'center',
  positionX: 0.5, //0.5 * canvasWidth
  positionY: 0.7, //0.7 * canvasHeight
};

export const TEXTARROW = {
  fontSize: 0.01, //0.01 * (canvasWidth + canvasHeight) px
  fontWeight: '300',
  color: 'white',
  fontFamily: 'C64-Pro',
  align: 'center',
  positionX: 0.5, //0.5 * canvasWidth
  positionY: 0.97, //0.97 * canvasHeight
};

export const TEXTSCROLL = {
  fontSize: 0.01, //0.01 * (canvasWidth + canvasHeight) px
  fontWeight: '300',
  color: 'white',
  fontFamily: 'C64-Pro',
  align: 'start',
  positionX: 1, //1 * canvasWidth
  positionY: 0.03, //0.1 * canvasHeight
  scrollSpeed: 2,
};

export const TEXTAMMO = {
  fontSize: 0.01, //0.01 * (canvasWidth + canvasHeight) px
  fontFamily: 'C64-Pro',
  color: '', // loaded from laser
  align: 'start',
  positionX: 5, //px
  positionY: 60, //px
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowColor: 'black',
};

export const TEXTSHIELD = {
  fontSize: 0.01, //0.01 * (canvasWidth + canvasHeight) px
  fontFamily: 'C64-Pro',
  color: '#ffdf00',
  align: 'start',
  positionX: 5, //px
  positionY: 90, //px
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowColor: 'black',
};

export const TEXTLEVELS = {
  fontSize: 0.01, //0.01 * (canvasWidth + canvasHeight) px
  fontFamily: 'C64-Pro',
  color: 'pink',
  align: 'end',
  positionX: 0.01, // canvasWidth - 0.01 * (canvasWidth + canvasHeight) px
  positionY: 60, //px
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowColor: 'black',
};

export const TEXTSCORE = {
  fontSize: 0.01, //0.01 * (canvasWidth + canvasHeight) px
  fontFamily: 'C64-Pro',
  color: '#EF5959',
  align: 'end',
  positionX: 0.01, // canvasWidth - 0.01 * (canvasWidth + canvasHeight) px
  positionY: 90, //px
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowColor: 'black',
};

export const TEXTTIME = {
  fontSize: 0.015, //0.01 * (canvasWidth + canvasHeight) px
  fontFamily: 'C64-Pro',
  color: '#EF5959',
  align: 'center',
  positionX: 0.5, //0.5 * canvasWidth px
  positionY: 90, //px
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowColor: 'black',
};

export const BACKGROUNDS = [
  {
    name: 'background0',
    image: null,
    src: './gameImages/background0.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
  },
  {
    name: 'background1',
    image: null,
    src: './gameImages/background1.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
  },
  {
    name: 'background2',
    image: null,
    src: './gameImages/background2.png',
    width: 0, //loaded from image
    height: 0, //loaded from image
  },
];

export const BACKGROUND = {
  image: null,
  x: 0,
  y: 0,
  width: 0, //loaded from image
  height: 0, //loaded from image
  scrollX: 0, // loaded from ANIMATIONS
  scale: 1,
};

export const AI = {
  numberOfEnemies: [10, 10, 15], //number of Enemies at GameLevels
  enemiesShootingLaser: [0.05, 0.1, 0.15], // % random shooting at each update
  enemiesSpeedXMax: [-1.5, -1.5, -1.5], //px max random value at each display refresh
  enemiesSpeedXMin: [-1, -1, -1], //px min random value at each display refresh
  enemiesRecruitment: {
    deleted: [3, 3, 3], //number of deleted enemies
    added: [1, 1, 1], //number of added enemies
  },
  chooseableEnemiesShip: [1, 2, 2], // range 0...maximum indexes of ENEMYSHIPS
  playerDeleteScore: -100,
};

export const GAME = {
  // 0 -- 30000ms, 30000+13000 -- 43000+30000, 73000+13000 - 86000+106000
  levelTime: [30000, 73000, 116000], //absolute values, milliseconds for each levels from game start
  levelTextTime: [13000, 13000, 13000], //relative values, milliseconds for each next levels and company texts
  levelTextNextTime: 3500, //relative value, milliseconds after company text start drawing
  levelTextNextTime0: 1500, //relative value, millisecons after text upper of next level text start drawing
};

export const ANIMATION = {
  isPlayerExplosion: true,
  isEnemyExplosion: true,
  isBackgroundScrollOnBigDisplay: false,
  isBackgroundScrollOnSmallDisplay: true,
  bigDisplay: 900000, // bigDisplay > number of pixels of canvas
  backgroundScrollSpeed: [-0.5, -0.5, -0.5],
};

export const MOBILE = {
  smallerPixels: 700000, // below this display width * height use ships mobile
  ammo: [350, 600, 600], // ammo when mobile play
  shootingDeltaTime: 60,
};
