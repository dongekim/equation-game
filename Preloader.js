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
        this.load.image('monitor', 'assets/monitor.png');
        this.load.spritesheet('keypad_blue', 'assets/keypad_button-Sheet.png', {frameWidth: 76, frameHeight: 76});
        this.load.spritesheet('keypad_orange', 'assets/keypad_button_orange-Sheet.png', {frameWidth: 76, frameHeight: 76});
        this.load.spritesheet('keypad_wide', 'assets/keypad_button_wide-Sheet.png', {frameWidth: 152, frameHeight: 76});
        this.load.bitmapFont('VCR_osd_mono', 'assets/VCR_osd_mono.png', 'assets/VCR_osd_mono.xml');
    }

    create()
    {
        this.scene.start("StartScene");
    }

    
}

export default Preloader