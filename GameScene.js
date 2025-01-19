import Preloader from "/Preloader.js";

let solutions = [];
let userProgress = 0;
let result = 0;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.problem = {};
    }

    
    preload()
    {
   
    }
    

    create() 
    {
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background').setOrigin(0.5, 0.5);
        const scaleX = this.cameras.main.width / background.width;
        //const scaleY = background.height / this.cameras.main.height;
        //const scale = Math.max(scaleX, scaleY);

        // Apply scale
        background.setScale(scaleX).setScrollFactor(0);
        
        console.log(userProgress)
        //Loads math problem as text on screen
        this.problem = this.createProblem(); // Assign the returned problem object to this.problem
        console.log(this.problem);
        const currentProblemText = this.add.bitmapText(this.cameras.main.width / 2, this.cameras.main.height / 4, 'VCR_osd_mono', this.problem.text, 50).setOrigin(0.5);

        //this.add.text(100, 100, '÷ ×', { fontSize: '50px'})
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

        const operators = 
        [
            ['+', '-'],
            ['x', '/']
        ];

        this.anims.create({
            key: 'keypad_press',
            frames: this.anims.generateFrameNumbers('keypad_bg', { start: 0, end: 1 }),
            frameRate: 12,
            repeat: 0,
            yoyo: true
        });

        const buttonWidth = 64; // Width of each button
        const buttonHeight = 64; // Height of each button
        const startX = 800; // Starting X position
        const startY = 400; // Starting Y position
        const spacingX = 10; // Horizontal spacing between buttons
        const spacingY = 10; // Vertical spacing between buttons
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const x = startX + col * (buttonWidth + spacingX);
                const y = startY + row * (buttonHeight + spacingY);
                const sampleButton = this.add.sprite(x, y, 'keypad_bg').setInteractive();
                sampleButton.on('pointerdown', () => {
                    if (sampleButton.anims.isPlaying) {
                        sampleButton.anims.stop();
                    }
                    sampleButton.anims.play('keypad_press', true);
                });
                sampleButton.on('pointerover', () => {
                    sampleButton.setFrame(3);
                });
                sampleButton.on('pointerout', () => {
                    sampleButton.setFrame(0);
                });
            }
        }

       const cursor = { x: 0, y: 0 };
       let userInput = '';
       const errorMsg = 'Incorrect';
       
       //Displays the number pad as a bitmapText object with each row separated by a newline
       const numPad = this.add.bitmapText(800, 400, 'VCR_osd_mono','123\n456\n789\n.0/', 50).setLetterSpacing(32);
       numPad.setTint(0x39e75f);
       numPad.setInteractive();

       //Block for highlighting hovered keys
       const block = this.add.graphics();
       block.lineStyle(2, 0xFFFFFF, 1); // Line width, color, and alpha
       block.strokeRect(block.x, block.y, 50, 50);
       
       //Displays user selected numbers on screen
       const userInputText = this.add.bitmapText(600, currentProblemText.y + 100, 'VCR_osd_mono', '', 50).setLetterSpacing(0);
       const userOperatorText = this.add.bitmapText(userInputText.x - 50, userInputText.y, 'VCR_osd_mono', '', 50).setLetterSpacing(0);

       
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

        //DEL and ENTER key hover highlights
        sidePad.on('pointermove', (pointer) => 
            {
                const localY = pointer.y - sidePad.y;
                const cy = Phaser.Math.Snap.Floor(localY, 50, 0, true);
                cursor.y = cy;
                block.x = sidePad.x - 10;
                block.y = sidePad.y - 10 + (cy * (34 * 2));
            });

        //DEL and ENTER key click event listeners
        sidePad.on('pointerdown', (pointer) => 
            {
                const localY = pointer.y - sidePad.y;
                const cy = Phaser.Math.Snap.Floor(localY, 50, 0, true);
                const selection = sideOptions[cy][0];
                if (selection === 'DEL') {
                    userInput = userInput.slice(0, -1);
                    userInputText.setText(userInput);
                } else if (selection === 'ENTER') {
                    let userAnswer = `${userOperatorText.text}${userInputText.text}`
                    console.log('User input:', userInput);
                    console.log('User answer:', userAnswer);
                    userInput = '';

                    if (userProgress === 0) {
                        if (userAnswer === solutions[0]){
                            console.log('step 1 correct');
                            userInputText.setText('Good!');
                            userOperatorText.setText('');
                            setTimeout(() => {
                                userInputText.setText('');
                            }, 1000);
                            currentProblemText.setText(this.solveProblem(userProgress));
                            userProgress ++;
                            console.log(`userProgress after step1: ${userProgress}`);
                            solutions.shift();
                            }
                        else {
                            console.log('incorrect');
                            userInputText.setText('Error');
                            userOperatorText.setText('');
                            setTimeout(() => {
                                userInputText.setText('');
                            }, 1000);
                            }
                    }
                    else if (userProgress === 1) {
                        if (userAnswer === solutions[0]){
                            console.log('step 2 correct');
                            userInputText.setText('Good!');
                            userOperatorText.setText('');
                            setTimeout(() => {
                                userInputText.setText('');
                            }, 1000);
                            currentProblemText.setText(this.solveProblem(userProgress));
                            userProgress ++;
                            solutions.shift();
                            }
                            
                        else {
                            console.log('incorrect');
                            userInputText.setText('Error');
                            userOperatorText.setText('');
                            setTimeout(() => {
                                userInputText.setText('');
                            }, 1000);
                            }
                    }
            }
            });

        //Displays operator keys as 2x2 grid
        const operatorPad = this.add.bitmapText(600, 400, 'VCR_osd_mono','+-\nx/', 50).setLetterSpacing(32);
        operatorPad.setTint(0xec885e);
        operatorPad.setInteractive();

        //Hover highlight for operator keys
        operatorPad.on('pointermove', (pointer) => 
            {
                const localX = pointer.x - operatorPad.x;
                const localY = pointer.y - operatorPad.y;
                
                const cx = Phaser.Math.Snap.Floor(localX, 52, 0, true);
                const cy = Phaser.Math.Snap.Floor(localY, 52, 0, true);
    
                cursor.x = cx;
                cursor.y = cy;
                block.x = operatorPad.x - 10 + (cx * 52);
                block.y = operatorPad.y - 2 + (cy * 52);
    
            });
        
            operatorPad.on('pointerdown', (pointer, x, y) =>
            {
                const localX = pointer.x - operatorPad.x;
                const localY = pointer.y - operatorPad.y;
                
                const cx = Phaser.Math.Snap.Floor(localX, 52, 0, true);
                const cy = Phaser.Math.Snap.Floor(localY, 52, 0, true);
                const selectedOperator = operators[cy][cx];
                userOperatorText.setText(selectedOperator);
            });

            const restartButton = this.add.bitmapText(this.cameras.main.width * 0.9, this.cameras.main.height * 0.05, 'VCR_osd_mono', 'RESTART', 32).setOrigin(0.5);
            restartButton.setInteractive();
            restartButton.on('pointerover', () =>
            {
                restartButton.setTint(0x39e75f);
            });
            restartButton.on('pointerout', () =>
            {
                restartButton.setTint(0xffffff);
            });
            restartButton.on('pointerdown', () => 
            {
                this.resetGame();
                this.scene.stop("GameScene");
                this.scene.start("GameScene");
            }
            );




    }

    update() 
    {
    
    }

    //Helper function to random generate math equation problem
    createProblem() {
        let problem = {};

        let coefficient = Math.floor((Math.random()+1) * 10);
        let variable = ['a', 'b', 'c', 'd', 'x', 'y', 'z'];
        let chosenVariable = variable[Math.floor(Math.random() * variable.length)];
        const signs = ['+', '-'];
        let chosenSign = signs[Math.floor(Math.random() * signs.length)];
        let term1 = Math.floor((Math.random()+1) * 30);
        let lastValue = Math.floor((Math.random()+1) * 30);

        problem.variable = chosenVariable;
        problem.coefficient = coefficient;
        problem.term1 = {
            value: term1,
            sign: chosenSign
        };
        problem.lastValue = lastValue;
        problem.text = `${problem.coefficient}${problem.variable} ${problem.term1.sign} ${problem.term1.value} = ${problem.lastValue}`;
        console.log(problem);

        // *slice from index 2 because I intentionally put a space after sign for plus and minus
        if (problem.term1.sign === '+') {
            solutions.push('-' + term1);
            solutions.push('/' + coefficient);
        }
        else if (problem.term1.sign === '-') {
            solutions.push('+' + term1);
            solutions.push('/' + coefficient);
        }
        console.log(solutions);
        return problem;
    };

    solveProblem(userProgress) {
        if (userProgress === 0) {
            if (this.problem.term1.sign === '+') {
                result = this.problem.lastValue - this.problem.term1.value;
            }
            else if (this.problem.term1.sign === '-') {
                result = this.problem.lastValue + this.problem.term1.value;
            }
            console.log(result);
            console.log(solutions);
            return `${this.problem.coefficient}${this.problem.variable} = ${result}`;
        }
        else if (userProgress === 1) {
            result /= this.problem.coefficient;
            // Round the result to 2 decimal places
            result = parseFloat(result.toFixed(2));
            console.log(`Final Answer: ${result}`);
            return `${this.problem.variable} = ${result}`;
        }
        else {
            console.log('Error: function solveProblem cannot solve this type of equation');
            console.log(userProgress)
            return 'Error, cannot solve this type of equation';
        }
    };

    resetGame() {
        solutions = [];
        userProgress = 0;
        result = 0;
    };



}


export default GameScene;