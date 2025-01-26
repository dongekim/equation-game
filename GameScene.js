import Preloader from "/Preloader.js";

let solutions = [];
let userProgress = 0;
let result = 0;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.problem = {};
        this.numbers =
        [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['.', 0, '/']
        ];
        this.operators = 
        [
            ['+', '-'],
            ['x', '/']
        ];
        this.userInput = '';    //declare userInput as a class property to be accessed by all methods
        this.userInputText;
        this.userOperatorText;
    }

    
    preload()
    {
   
    }
    

    create() 
    {
        // BACKGROUND IMAGE SETUP, CHANGE TO BETTER BACKGROUND LATER
        this.add.image(this.cameras.main.width / 2, 80 + 105, 'monitor').setOrigin(0.5, 0.5);
        console.log(userProgress);

        //Loads math problem as text on screen
        this.problem = this.createProblem(); // Assign the returned problem object to this.problem
        console.log(this.problem);
        const currentProblemText = this.add.bitmapText(this.cameras.main.width / 2, this.cameras.main.height / 4, 'VCR_osd_mono', this.problem.text, 50).setOrigin(0.5).setTint(0x000000);

        //Creates the side pad for DEL and ENTER keys
        const sideOptions =
        [
        ['DEL'],
        ['ENTER']
        ];

        //Keypad press animation
        this.anims.create({
            key: 'keypad_press',
            frames: this.anims.generateFrameNumbers('keypad_bg', { start: 0, end: 1 }),
            frameRate: 12,
            repeat: 0,
            yoyo: true
        });

        //Specs for numberPad buttons
        this.buttonWidth = 76; // Width of each button
        this.buttonHeight = 76; // Height of each button
        const startX = 800; // Starting X position
        const startY = 400; // Starting Y position
        const spacingX = -4; // Horizontal spacing between buttons
        const spacingY = -4; // Vertical spacing between buttons

        //Creates containers for numberPad and operatorPad, also sets their positions on screen
        this.numContainer = this.add.container(750, 400);
        this.opContainer = this.add.container(550, 400);
        
        //Loop to create numberpad buttons with sprite image
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const x = col * (this.buttonWidth + spacingX);
                const y = row * (this.buttonHeight + spacingY);
                const buttonSprite = this.add.sprite(x, y, 'keypad_bg').setInteractive();
                const num = this.add.bitmapText(x, y, 'VCR_osd_mono', this.numbers[row][col], 50).setOrigin(0.5).setTint(0xFFFF33).setInteractive();
        
                // Shared event handler function
                const handlePointerDown = (pointer) => {
                    if (buttonSprite.anims.isPlaying) {
                        buttonSprite.anims.stop();
                    }
                    buttonSprite.anims.play('keypad_press', true);

                    this.selectNumber(pointer);
                    
                    // Create a timed event to revert the size back to normal
                    num.setFontSize(num.fontSize - 4);
                    this.time.delayedCall(200, () => {
                        num.setFontSize(num.fontSize + 4);
                    });
                };

                const handleHover = () => {
                    buttonSprite.setFrame(3);
                };

                const handleHoverOut = () => {
                    buttonSprite.setFrame(0);
                };
        
                // Add the event listener to both buttonSprite and num
                buttonSprite.on('pointerdown', handlePointerDown);
                num.on('pointerdown', handlePointerDown);
        
                buttonSprite.on('pointerover', handleHover);
                num.on('pointerover', handleHover);
                buttonSprite.on('pointerout', handleHoverOut);
                num.on('pointerout', handleHoverOut);
        
                this.numContainer.add(buttonSprite);
                this.numContainer.add(num);
            }
        };

        //Loop to create operator pads
        for (let row = 0; row <2; row ++){
            for (let col = 0; col <2; col++){
                const x = col * (this.buttonWidth + spacingX);
                const y = row * (this.buttonHeight + spacingY);
                const buttonSprite = this.add.sprite(x, y, 'keypad_bg').setInteractive();
                const operator = this.add.bitmapText(x, y, 'VCR_osd_mono', this.operators[row][col], 50).setOrigin(0.5).setTint(0xec885e).setInteractive();

                // Shared event handler function
                const handlePointerDown = (pointer) => {
                    if (buttonSprite.anims.isPlaying) {
                        buttonSprite.anims.stop();
                    }
                    buttonSprite.anims.play('keypad_press', true);

                    this.selectOperator(pointer);
                    
                    // Create a timed event to revert the size back to normal
                    operator.setFontSize(operator.fontSize - 4);
                    this.time.delayedCall(200, () => {
                        operator.setFontSize(operator.fontSize + 4);
                    });
                };

                const handleHover = () => {
                    buttonSprite.setFrame(3);
                };

                const handleHoverOut = () => {
                    buttonSprite.setFrame(0);
                };
        
                // Add the event listener to both buttonSprite and operator
                buttonSprite.on('pointerdown', handlePointerDown);
                operator.on('pointerdown', handlePointerDown);
        
                buttonSprite.on('pointerover', handleHover);
                operator.on('pointerover', handleHover);
                buttonSprite.on('pointerout', handleHoverOut);
                operator.on('pointerout', handleHoverOut);
        
                this.opContainer.add(buttonSprite);
                this.opContainer.add(operator);
            }
        }

       const cursor = { x: 0, y: 0 };

       //Block for highlighting hovered keys
       const block = this.add.graphics();
       block.lineStyle(2, 0xFFFFFF, 1); // Line width, color, and alpha
       block.strokeRect(block.x, block.y, 50, 50);
       
       //Displays user selected numbers on screen
       this.userInputText = this.add.bitmapText(600, currentProblemText.y + 100, 'VCR_osd_mono', '', 50).setLetterSpacing(0);
       this.userOperatorText = this.add.bitmapText(this.userInputText.x - 50, this.userInputText.y, 'VCR_osd_mono', '', 50).setLetterSpacing(0);

        //Displays the DEL and ENTER keys on right side of numPad
        const sidePad = this.add.bitmapText(this.numContainer.x + 150 + 100, this.numContainer.y - 20, 'VCR_osd_mono', 'DEL\n\nENTER', 32).setLetterSpacing(0);
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
                    this.userInput = this.userInput.slice(0, -1);
                    this.userInputText.setText(this.userInput);
                } else if (selection === 'ENTER') {
                    let userAnswer = `${this.userOperatorText.text}${this.userInputText.text}`
                    console.log('User input:', this.userInput);
                    console.log('User answer:', userAnswer);
                    this.userInput = '';

                    if (userProgress === 0) {
                        if (userAnswer === solutions[0]){
                            console.log('step 1 correct');
                            this.userInputText.setText('Good!');
                            this.userOperatorText.setText('');
                            setTimeout(() => {
                                this.userInputText.setText('');
                            }, 1000);
                            currentProblemText.setText(this.solveProblem(userProgress));
                            userProgress ++;
                            console.log(`userProgress after step1: ${userProgress}`);
                            solutions.shift();
                            }
                        else {
                            console.log('incorrect');
                            this.userInputText.setText('Error');
                            this.userOperatorText.setText('');
                            setTimeout(() => {
                                this.userInputText.setText('');
                            }, 1000);
                            }
                    }
                    else if (userProgress === 1) {
                        if (userAnswer === solutions[0]){
                            console.log('step 2 correct');
                            this.userInputText.setText('Good!');
                            this.userOperatorText.setText('');
                            setTimeout(() => {
                                this.userInputText.setText('');
                            }, 1000);
                            currentProblemText.setText(this.solveProblem(userProgress));
                            userProgress ++;
                            solutions.shift();
                            }
                            
                        else {
                            console.log('incorrect');
                            this.userInputText.setText('Error');
                            this.userOperatorText.setText('');
                            setTimeout(() => {
                                this.userInputText.setText('');
                            }, 1000);
                            }
                    }
            }
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

    //Method for selecting numbers from the number pad.
    //Interprets clicked number by pointer's relative position to the numberPad
    selectNumber(pointer) {
        const localX = pointer.x - (this.numContainer.x - this.buttonWidth/2);
        const localY = pointer.y - (this.numContainer.y - this.buttonHeight/2);
        console.log(`localX = ${localX}, localY = ${localY}, ${this.buttonWidth}`);
        
        const cx = Phaser.Math.Snap.Floor(localX, 76, 0, true);
        const cy = Phaser.Math.Snap.Floor(localY, 76, 0, true);
        console.log(`cx = ${cx}, cy = ${cy}`);

        if (cx >= 0 && cx < 3 && cy >= 0 && cy < 4) {
            const selectedNum = this.numbers[cy][cx];
            console.log(selectedNum);
            if (this.userInput.length < 5) {
                this.userInput += selectedNum;
                this.userInputText.setText(this.userInput);
            }
        }
    };

    //Method for selecting operators from the operator pad.
    selectOperator(pointer) {
        const localX = pointer.x - (this.opContainer.x - this.buttonWidth/2);
        const localY = pointer.y - (this.opContainer.y - this.buttonHeight/2);
        
        const cx = Phaser.Math.Snap.Floor(localX, 76, 0, true);
        const cy = Phaser.Math.Snap.Floor(localY, 76, 0, true);

        if (cx >= 0 && cx < 3 && cy >= 0 && cy < 4) {
            const selectedOp = this.operators[cy][cx];
            this.userOperatorText.setText(selectedOp);
        }
    };

    resetGame() {
        solutions = [];
        userProgress = 0;
        result = 0;
    };



}


export default GameScene;