import { Preloader } from "/Preloader.js";

let numPadGrid = [];
let operatorPadGrid = [];

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
    }

    /*
    preload() {}
    */

    create() 
    {
        //Loads math problem as text on screen
        let currentText = this.createProblem();
        this.add.text(800, 200, currentText, { fill: '#FFFFFF', font: '80px Helvetica' }).setOrigin(0.5);

        //Creates 4x3 grid input buttons
        for(let row = 0; row < 4; row++){
            for(let col = 0; col < 3; col++){
               this.createNumPad(900, 400, row, col);
            }
        };

        //Response to each numPad button press | WIP MAKE CASES FOR WHEN . 0 / ARE PRESSED
        for(let idx = 0; idx < numPadGrid.length; idx++) {
            numPadGrid[idx].on('pointerdown', () => {this.add.text(800, 300, `Pressed ${idx + 1}`)});
        };

        for(let row = 0; row < 2; row++){
            for(let col = 0; col < 2; col++){
               this.createOperatorPad(600, 400, row, col);
            }
        };




    }

    update() 
    {
    
    }


    createProblem() {
        let coefficient = Math.floor((Math.random()+1) * 10);
        
        let variable = ['a', 'b', 'c', 'd', 'x', 'y', 'z'];
        let chosenVariable = variable[Math.floor(Math.random() * variable.length)];

        let signs = ['+', '-'];
        let chosenSign = signs[Math.floor(Math.random() * signs.length)];

        let term1 = Math.floor((Math.random()+1) * 30);
        let term2 = Math.floor((Math.random()+1) * 30);


        return `${coefficient}${chosenVariable} ${chosenSign} ${term1} = ${term2}`;
    };

    //Helper function that creates the input button grid
    createNumPad(x, y, row, col) 
    {
        const numPadStyle = {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000',
            align: 'center',
            backgroundColor: '#FFFFFF'
        };

        let numPad;

        if (numPadGrid.length < 9) {
            numPad = this.add.text(x + (col * 50), y + (row * 60), numPadGrid.length + 1, numPadStyle).setPadding(16).setOrigin(0.5);
        } else if (numPadGrid.length === 9) {
            numPad = this.add.text(x + (col * 50), y + (row * 60), '.', numPadStyle).setPadding(16).setOrigin(0.5);
        } else if (numPadGrid.length === 10) {
            numPad = this.add.text(x + (col * 50), y + (row * 60), '0', numPadStyle).setPadding(16).setOrigin(0.5);
        } else if (numPadGrid.length === 11) {
            numPad = this.add.text(x + (col * 50), y + (row * 60), '/', numPadStyle).setPadding(16).setOrigin(0.5);
        } else {
            console.log('Error: numPadGrid length is greater than 12');
        }
        numPad.setInteractive();
        numPad.on('pointerover', () => {numPad.setBackgroundColor('#FF0000');});
        numPad.on('pointerout', () => {numPad.setBackgroundColor('#FFFFFF');});
        numPadGrid.push(numPad);
    }

    createOperatorPad(x, y, row, col) 
    {
        const numPadStyle = {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000',
            align: 'center',
            backgroundColor: '#FFFFFF'
        };

        let operatorPad;

        if (operatorPadGrid.length === 0) {
            operatorPad = this.add.text(x + (col * 50), y + (row * 60), '+', numPadStyle).setPadding(16).setOrigin(0.5);
        } else if (operatorPadGrid.length === 1) {
            operatorPad = this.add.text(x + (col * 50), y + (row * 60), '-', numPadStyle).setPadding(16).setOrigin(0.5);
        } else if (operatorPadGrid.length === 2) {
            operatorPad = this.add.text(x + (col * 50), y + (row * 60), 'x', numPadStyle).setPadding(16).setOrigin(0.5);
        } else if (operatorPadGrid.length === 3) {
            operatorPad = this.add.text(x + (col * 50), y + (row * 60), '/', numPadStyle).setPadding(16).setOrigin(0.5);
        } else {
            console.log('Error: operatorPadGrid length is greater than 4');
        }
        operatorPad.setInteractive();
        operatorPad.on('pointerover', () => {operatorPad.setBackgroundColor('#FF0000');});
        operatorPad.on('pointerout', () => {operatorPad.setBackgroundColor('#FFFFFF');});
        operatorPadGrid.push(operatorPad);
    }



}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 800,
    backgroundColor: '#240045',
    scene: [Preloader, GameScene]
  };
  
new Phaser.Game(config);
