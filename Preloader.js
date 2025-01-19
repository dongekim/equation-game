class Preloader extends Phaser.Scene
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
        this.load.image('background', 'assets/background2.jpg');
        this.load.spritesheet('keypad_bg', 'assets/keypad_button-Sheet.png', {frameWidth: 76, frameHeight: 76});
        this.load.bitmapFont('VCR_osd_mono', 'assets/VCR_osd_mono.png', 'assets/VCR_osd_mono.xml');
        
    }

    create()
    {
        this.scene.start("StartScene");
    }

    
}

export default Preloader