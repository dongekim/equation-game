import Preloader from '/Preloader.js';
import GameScene from '/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#240045',
    scene: [Preloader, GameScene]
  };

const game = new Phaser.Game(config);