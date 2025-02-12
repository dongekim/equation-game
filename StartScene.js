import Preloader from "./Preloader.js";

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload()
    {

    }

    create()
    {
        this.add.bitmapText(this.cameras.main.width / 2, this.cameras.main.height * 0.3, 'VCR_osd_mono', 'Code Breaker', 72).setOrigin(0.5);
        const startButton = this.add.bitmapText(this.cameras.main.width / 2, this.cameras.main.height * 0.7, 'VCR_osd_mono', 'One variable equations', 50).setOrigin(0.5);
        startButton.setInteractive();
        startButton.on('pointerover', () => {startButton.setTint(0x39e75f)});
        startButton.on('pointerout', () => {startButton.setTint(0xFFFFFF)});
        startButton.on('pointerdown', () => this.startGame());
    }

    update()
    {

    }

    startGame() {
        this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress){
            if(progress > .98)
                {
                    this.scene.stop("StartScene");
                    this.scene.start("GameScene");
                }
            }
        )
    };



}

export default StartScene