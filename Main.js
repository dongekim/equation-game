import Preloader from '/Preloader.js';
import StartScene from '/StartScene.js';
import GameScene from '/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#240045',
    scene: [Preloader, StartScene, GameScene]
  };

const game = new Phaser.Game(config);