export class Preloader extends Phaser.Scene
{
    constructor()
    {
        super({
            key: 'Preloader'
        });
    }

    preload()
    {
        //this.load.image();
        //this.load.setBaseURL();
        //this.load.setPath();
        //this.load.audio();

        this.load.image('num1', "assets/numkey (0).png");
    }

    create()
    {
        this.scene.start("GameScene");
    }

    
}