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
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        const title = this.add.bitmapText(centerX, this.cameras.main.height * 0.3, 'VCR_osd_mono', 'Code Breakers', 72).setOrigin(0.5);
        const bodyBg = this.add.nineslice(centerX, centerY + 60, 'ui', 'monitor', 540, 200, 48, 48, 48, 48).setOrigin(0.5, 0).setTint(0xF07890);
        const oneVarSample = this.add.bitmapText(centerX, bodyBg.y + 60, 'VCR_osd_mono', 'x + 9 = 18', 32).setOrigin(0.5, 0.5).setTint(0x1C1C1C);
        const startButton = this.add.bitmapText(centerX, bodyBg.y + 130, 'VCR_osd_mono', 'One variable equations', 32).setOrigin(0.5, 0.5);
        //const bulletPoint = this.add.text(startButton.x - (startButton.width/2) - 24, startButton.y, '•', {fontSize: '50px', fontFamily: 'Arial', color: '#FFFFFF'}).setOrigin(0.5, 0.5);
        const underline = this.add.rectangle(startButton.x, startButton.y + 20, startButton.width, 2, 0xFFFFFF).setOrigin(0.5, 0.5);

        startButton.setInteractive();

        startButton.on('pointerover', () => 
            {
                startButton.setTint(0x39e75f);
                underline.setFillStyle(0x39e75f);
            });
        startButton.on('pointerout', () => 
            {
                startButton.setTint(0xFFFFFF)
                underline.setFillStyle(0xFFFFFF);
            });

        startButton.on('pointerdown', () => this.startGame());

        const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '+', '-', 'x', 'y', 'z', '=', '15x', 'A = bh/2', 'y = 2x', 'F = ma', 'sin(2x)', 'cos(0)', 'tan(x)', 'v = at', 's = d/t', '15/0', 'x - 4', '2g', '16x', 't/4', 'm', 'p', 'E', 'h(t)', 'f(x)', 'g(x)', 'h(x)', 'K'];
        let colWidth = this.cameras.main.width / 5;
        let rowHeight = this.cameras.main.height / 4;
        
        const addTween = (img) => {
            this.tweens.add({
                targets: img,
                x: img.x + Math.floor(Math.random() * 50) - 25,
                y: img.y + Math.floor(Math.random() * 50) - 25,
                duration: 3000,
                ease: 'Linear',
                repeat: -1,
                yoyo: true,
                delay: Math.floor(Math.random() * 1000)
            });
        };

        for (let row = 0; row < 4; row++)
            {
                for (let col = 0; col < 5; col++)
                {
                    for (let i = 0; i < 2; i++)
                    {
                        const randX = Math.floor(Math.random() * colWidth) + (col * colWidth);
                        const randY = Math.floor(Math.random() * rowHeight) + (row * rowHeight);
                        const img = this.add.bitmapText(randX, randY, 'VCR_osd_mono', list[Math.floor(Math.random()*list.length)], 16).setAlpha(0.2);
                        addTween(img);
                    }
                }
            }

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