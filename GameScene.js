import { Preloader } from "/Preloader.js";

let numPadGrid = [];
let operatorPadGrid = [];
const solutions = [];

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
    }

    
    preload()
    {
    }
    

    create() 
    {
        //Loads math problem as text on screen
        let currentAnswer;
        const currentProblem = this.createProblem();
        const currentProblemText = this.add.bitmapText(this.cameras.main.width / 2, this.cameras.main.height / 4, 'VCR_osd_mono', currentProblem, 50).setOrigin(0.5);

        this.add.text(100, 100, '÷ ×', { fontSize: '50px'})
        //Creates the number pad
        const numbers =
        [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['.', 0, '/']
        ];

        //Creates the side pad for DEL and ENTER keys
        const sideOptions =
        [
        ['DEL'],
        ['ENTER']
        ];

       const cursor = { x: 0, y: 0 };
       let userInput = '';
       
       //Displays the number pad as a bitmapText object with each row separated by a newline
       const numPad = this.add.bitmapText(800, 400, 'VCR_osd_mono','123\n456\n789\n.0/', 50).setLetterSpacing(32);
       numPad.setTint(0x39e75f);
       numPad.setInteractive();

       //Block for highlighting hovered keys
       const block = this.add.graphics();
       block.lineStyle(2, 0xFFFFFF, 1); // Line width, color, and alpha
       block.strokeRect(block.x, block.y, 50, 50);
       
       //Displays user selected numbers on screen
       const userInputText = this.add.bitmapText(600, currentProblemText.y + 100, 'VCR_osd_mono', userInput, 50).setLetterSpacing(0);
       
       //Event listeners to highlight hovered keys 
       numPad.on('pointermove', (pointer) => 
        {
            const localX = pointer.x - numPad.x;
            const localY = pointer.y - numPad.y;
            
            const cx = Phaser.Math.Snap.Floor(localX, 52, 0, true);
            const cy = Phaser.Math.Snap.Floor(localY, 52, 0, true);
            //const char = numberGrid[cy][cx];

            cursor.x = cx;
            cursor.y = cy;
            block.x = numPad.x - 10 + (cx * 52);
            block.y = numPad.y - 2 + (cy * 52);

        });

        //Event listener to click and select numbers, then update displayed userInput
        numPad.on('pointerdown', (pointer, x, y) =>
        {
            const localX = pointer.x - numPad.x;
            const localY = pointer.y - numPad.y;
            
            const cx = Phaser.Math.Snap.Floor(localX, 52, 0, true);
            const cy = Phaser.Math.Snap.Floor(localY, 52, 0, true);
            const selectedNums = numbers[cy][cx];
            if (userInput.length < 5) {
                userInput += selectedNums;
                userInputText.setText(userInput);
            }
        });

        //Displays the DEL and ENTER keys on right side of numPad
        const sidePad = this.add.bitmapText(numPad.x + 150 + 20, numPad.y + 8, 'VCR_osd_mono', 'DEL\n\nENTER', 32).setLetterSpacing(0);
        sidePad.setInteractive();

        sidePad.on('pointermove', (pointer) => 
            {
                const localY = pointer.y - sidePad.y;
                const cy = Phaser.Math.Snap.Floor(localY, 50, 0, true);
                cursor.y = cy;
                block.x = sidePad.x - 10;
                block.y = sidePad.y - 10 + (cy * (34 * 2));
            });

        sidePad.on('pointerdown', (pointer) => 
            {
                const localY = pointer.y - sidePad.y;
                const cy = Phaser.Math.Snap.Floor(localY, 50, 0, true);
                const selection = sideOptions[cy][0];
                if (selection === 'DEL') {
                    userInput = userInput.slice(0, -1);
                } else if (selection === 'ENTER') {
                    console.log('User input:', userInput);
                    userInput = '';
                }
                userInputText.setText(userInput);
            });


    }

    update() 
    {
    
    }

    //Helper function to random generate math equation problem
    createProblem() {
        let coefficient = Math.floor((Math.random()+1) * 10);
        
        let variable = ['a', 'b', 'c', 'd', 'x', 'y', 'z'];
        let chosenVariable = variable[Math.floor(Math.random() * variable.length)];

        const signs = ['+', '-'];
        let chosenSign = signs[Math.floor(Math.random() * signs.length)];

        let term1 = signs[Math.floor(Math.random() * signs.length)] + ' ' + Math.floor((Math.random()+1) * 30);
        let term2 = Math.floor((Math.random()+1) * 30);

        if (chosenSign === '+') {
            solutions.push('-' + term1);
            solutions.push('/' + coefficient);
        }
        else if (chosenSign === '-') {
            solutions.push('+' + term1);
            solutions.push('/' + coefficient);
        }


        return `${coefficient}${chosenVariable} ${term1} = ${term2}`;
    };

    //Helper function that creates the input button grid
    //DEPRECATED FUNCTIONS ****************************************************
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
    //END OF DEPRECATED FUNCTIONS **********************************************



}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 800,
    backgroundColor: '#240045',
    scene: [Preloader, GameScene]
  };
  
new Phaser.Game(config);
