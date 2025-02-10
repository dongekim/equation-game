import Preloader from "/Preloader.js";

const gameState = {
    stage: 0,
    maxStage: 4,
    solutions: [],
    userProgress: 0,
    result: 0,
};

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
        this.options = [
            ['DEL'],
            ['ENTER']
        ];
        this.userInput = '';    //declare userInput as a class property to be accessed by all methods
        this.userInputText;
        this.userOperatorText;
        this.currentProblemText = null;
    }

    create() 
    {
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0).setAlpha(0.7);

        // BACKGROUND IMAGE SETUP, CHANGE TO BETTER BACKGROUND LATER
        const monitor = this.add.image(40, 80, 'monitor').setOrigin(0, 0);
        monitor.setScale(1.078, 1);

        // Keeps track of previous stage number to compare against current stage number
        let previousStage = gameState.stage;

        // Tween to animate progress bar
        const updateTween = () => {
            if (gameState.stage > previousStage) {
                this.tweens.add({
                    targets: blueFill,
                    width: ((gameState.stage) * (progressBar.width / gameState.maxStage)) - 48,
                    duration: 2000,
                    ease: 'Quad.easeInOut',
                    onUpdate: () => {
                        blueFill.setSize(blueFill.width, 64);
                    },
                    onComplete: () => {
                        previousStage = gameState.stage;
                        updateTween();
                    }
                });
            }
            else if (gameState.stage === gameState.maxStage) {
                console.log('Game Complete!')
            }
        };

        updateTween();
        

        //Loads math problem as text on screen
        this.problem = this.createProblem(); // Assign the returned problem object to this.problem
        this.currentProblemText = this.add.bitmapText(monitor.x + monitor.width/2, monitor.y + monitor.height/2, 'VCR_osd_mono', this.problem.text, 50).setOrigin(0.5, 0.5).setTint(0x000000);
        console.log(`Current Stage: ${gameState.stage}`);

        //Keypad press animation
        if (!this.anims.exists('keypad_blue_press')) {
            this.anims.create({
                key: 'keypad_blue_press',
                frames: this.anims.generateFrameNumbers('keypad_blue', { start: 0, end: 1 }),
                frameRate: 12,
                repeat: 0,
                yoyo: true
            });
        }

        if (!this.anims.exists('keypad_orange_press')) {
            this.anims.create({
                key: 'keypad_orange_press',
                frames: this.anims.generateFrameNumbers('keypad_orange', { start: 0, end: 1 }),
                frameRate: 12,
                repeat: 0,
                yoyo: true
            });
        }

        if (!this.anims.exists('keypad_wide_press')) {
            this.anims.create({
                key: 'keypad_wide_press',
                frames: this.anims.generateFrameNumbers('keypad_wide', { start: 0, end: 1 }),
                frameRate: 12,
                repeat: 0,
                yoyo: true
            });
        }

        // Specs for numberPad buttons
        this.buttonWidth = 76; // Width of each button
        this.buttonHeight = 76; // Height of each button
        const startX = 800; // Starting X position
        const startY = 400; // Starting Y position
        const spacingX = -4; // Horizontal spacing between buttons
        const spacingY = -4; // Vertical spacing between buttons

        // Creates containers for number keys, operator keys, and option (DEL, ENTER) keys
        this.numContainer = this.add.container(346, 400); // Number Container
        this.opContainer = this.add.container(142, 400); // Operator Container
        this.optionContainer = this.add.container(610, 400); // DEL, ENTER Container

        // Creates UI for Title Box and Log Box
        const titleBg = this.add.nineslice(this.cameras.main.width - 40, 80, 'ui', 'box_yellow', 384, 125, 48, 48, 48, 48).setOrigin(1,0);
        const logBg = this.add.nineslice(0, 0, 'ui', 'box_yellow', 384, 415, 48, 48, 48, 48).setOrigin(0.5, 0);
        const progressBar = this.add.nineslice(0, 24, 'ui', 'progressbar', 800, 112, 48, 48, 24, 24).setScale(0.4).setOrigin(0.5, 0);
        const blueFill = this.add.nineslice(-(progressBar.width * 0.4 / 2) + 10, 32, 'ui', 'fill_blue', 48, 64, 24, 24, 24, 24).setScale(0.4).setOrigin(0, 0);
        console.log(progressBar.width)
        const titleText = this.add.bitmapText(titleBg.x - titleBg.width/2, titleBg.y + titleBg.height/2, 'VCR_osd_mono', 'One Variable Equations', 24).setOrigin(0.5, 0.5).setTint(0x000000);
        const logText = this.add.bitmapText(progressBar.x, logBg.y + 88, 'VCR_osd_mono', 'Log', 24).setTint(0x0000FF);
        this.logContainer = this.add.container(1048, 200);

        const initialLog = this.add.bitmapText(0, 0, 'VCR_osd_mono', this.currentProblemText.text, 32).setTint(0x000000);

        this.logContainer.add([logBg, progressBar, blueFill, initialLog]);
        
        // Loop to create numberpad buttons with sprite image
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const x = col * (this.buttonWidth + spacingX);
                const y = row * (this.buttonHeight + spacingY);
                const buttonSprite = this.add.sprite(x, y, 'keypad_blue').setInteractive();
                const num = this.add.bitmapText(x, y, 'VCR_osd_mono', this.numbers[row][col], 50).setOrigin(0.5).setTint(0xFFFF33).setInteractive();
        
                // Shared event handler function
                const handlePointerDown = (pointer) => {
                    if (buttonSprite.anims.isPlaying) {
                        buttonSprite.anims.stop();
                    }
                    buttonSprite.anims.play('keypad_blue_press', true);

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
                const buttonSprite = this.add.sprite(x, y, 'keypad_orange').setInteractive();
                const operator = this.add.bitmapText(x, y, 'VCR_osd_mono', this.operators[row][col], 50).setOrigin(0.5).setTint(0xFFFFFF).setInteractive();

                // Shared event handler function
                const handlePointerDown = (pointer) => {
                    if (buttonSprite.anims.isPlaying) {
                        buttonSprite.anims.stop();
                    }
                    buttonSprite.anims.play('keypad_orange_press', true);

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
        };
       
       //Displays user selected numbers on screen
       this.userOperatorText = this.add.bitmapText(258, 80 + monitor.height + 48, 'VCR_osd_mono', '', 50).setLetterSpacing(0);
       this.userInputText = this.add.bitmapText(this.userOperatorText.x + this.userOperatorText.width + 38, 80 + monitor.height + 48, 'VCR_osd_mono', '', 50).setLetterSpacing(0);

        //Loop to create DEL and ENTER options
        for (let row = 0; row < 2; row++) {
            const y = row * (this.buttonHeight + 4);
            const buttonSprite = this.add.sprite(0, y, 'keypad_wide').setInteractive();
            const option = this.add.bitmapText(0, y, 'VCR_osd_mono', this.options[row], 32).setOrigin(0.5).setTint(0xFFFFFF).setInteractive();
            
            const handlePointerDown = (pointer) => {
                if (buttonSprite.anims.isPlaying) {
                    buttonSprite.anims.stop();
                }
                buttonSprite.anims.play('keypad_wide_press', true);

                this.selectOption(pointer);

                option.setFontSize(option.fontSize - 4);
                this.time.delayedCall(200, () => {
                    option.setFontSize(option.fontSize + 4);
                });
            };

            const handleHover = () => {
                buttonSprite.setFrame(3);
            };

            const handleHoverOut = () => {
                buttonSprite.setFrame(0);
            };
    
            // Add the event listener to both buttonSprite and option
            buttonSprite.on('pointerdown', handlePointerDown);
            option.on('pointerdown', handlePointerDown);
    
            buttonSprite.on('pointerover', handleHover);
            option.on('pointerover', handleHover);
            buttonSprite.on('pointerout', handleHoverOut);
            option.on('pointerout', handleHoverOut);
    
            this.optionContainer.add(buttonSprite);
            this.optionContainer.add(option);


        }

        //Creates a restart button on top right of screen
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

        //Creates the next button to move progress
        gameState.nextButton = this.add.bitmapText(this.optionContainer.x, this.optionContainer.y + 180, 'VCR_osd_mono', 'Next!', 32).setOrigin(0.5).setInteractive();
        gameState.nextButton.setVisible(false);
        gameState.nextButton.on('pointerover', () => {
            gameState.nextButton.setTint(0x39e75f);
        });
        gameState.nextButton.on('pointerout', () => {
            gameState.nextButton.setTint(0xffffff);
        });
        gameState.nextButton.on('pointerdown', () => {
            updateTween();
            gameState.nextButton.setVisible(false);

            gameState.solutions = [];
            gameState.userProgress = 0;
            gameState.result = 0;
            this.logContainer.removeAll(true);
            this.problem = this.createProblem();
            this.logContainer.add(this.add.bitmapText(0, 0, 'VCR_osd_mono', this.problem.text, 32).setTint(0x000000));
            this.currentProblemText.setText(this.problem.text);
            console.log(`Current Stage: ${gameState.stage}`);
        });

        //this.showPopup('SUCCESS');


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

        // *slice from index 2 because I intentionally put a space after sign for plus and minus
        if (problem.term1.sign === '+') {
            gameState.solutions.push('-' + term1);
            gameState.solutions.push('/' + coefficient);
        }
        else if (problem.term1.sign === '-') {
            gameState.solutions.push('+' + term1);
            gameState.solutions.push('/' + coefficient);
        }
        return problem;
    };

    solveProblem(userProgress) {
        if (userProgress === 0) {
            if (this.problem.term1.sign === '+') {
                gameState.result = this.problem.lastValue - this.problem.term1.value;
            }
            else if (this.problem.term1.sign === '-') {
                gameState.result = this.problem.lastValue + this.problem.term1.value;
            }
            return `${this.problem.coefficient}${this.problem.variable} = ${gameState.result}`;
        }
        else if (userProgress === 1) {
            gameState.result /= this.problem.coefficient;
            // Round the result to 2 decimal places
            gameState.result = parseFloat(gameState.result.toFixed(2));
            return `${this.problem.variable} = ${gameState.result}`;
        }
        else {
            console.log('Error: function solveProblem cannot solve this type of equation');
            return 'Error, cannot solve this type of equation';
        }
    };

    //Method for selecting numbers from the number pad.
    //Interprets clicked number by pointer's relative position to the numberPad
    selectNumber(pointer) {
        const localX = pointer.x - (this.numContainer.x - this.buttonWidth/2);
        const localY = pointer.y - (this.numContainer.y - this.buttonHeight/2);
        
        const cx = Phaser.Math.Snap.Floor(localX, 76, 0, true);
        const cy = Phaser.Math.Snap.Floor(localY, 76, 0, true);

        if (cx >= 0 && cx < 3 && cy >= 0 && cy < 4) {
            const selectedNum = this.numbers[cy][cx];
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

    // Clicking on DEL & ENTER Buttons --> Checks user answer and updates log
    selectOption(pointer) {
        const localY = pointer.y - (this.optionContainer.y - this.buttonHeight/2);
        const cy = Phaser.Math.Snap.Floor(localY, 80, 0, true);
        const selection = this.options[cy][0];
        if (selection === 'DEL') {
            this.userInput = this.userInput.slice(0, -1);
            this.userInputText.setText(this.userInput);
        }
        
        else if (selection === 'ENTER') {
            let userAnswer = `${this.userOperatorText.text}${this.userInputText.text}`
            this.userInput = '';

            if (gameState.userProgress === 0) {
                if (userAnswer === gameState.solutions[0]){
                    console.log('step 1 correct');
                    const result0 = this.solveProblem(gameState.userProgress);
                    this.updateLog(result0);
                    this.userInputText.setText('Good!');
                    this.userOperatorText.setText('');
                    setTimeout(() => {
                        this.userInputText.setText('');
                    }, 1000);
                    this.currentProblemText.setText(result0);
                    gameState.userProgress ++;
                    gameState.solutions.shift();
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
            // Final step in checking user answer
            else if (gameState.userProgress === 1) {
                if (userAnswer === gameState.solutions[0]){
                    console.log('step 2 correct');
                    const solution1 = this.solveProblem(gameState.userProgress);
                    this.updateLog(solution1);
                    this.userInputText.setText('Good!');
                    this.userOperatorText.setText('');
                    setTimeout(() => {
                        this.userInputText.setText('');
                    }, 1000);
                    this.currentProblemText.setText(solution1);
                    gameState.userProgress ++;
                    gameState.solutions.shift();
                    gameState.stage ++;
                    gameState.nextButton.setVisible(true);
                    
                    if (gameState.stage > gameState.maxStage) {
                        this.showPopup('SUCCESS');
                    };
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
        };
    };

    //Method to update the log with user input and result
    updateLog(result) {
        const newLog = this.add.bitmapText(0, (0 + this.logContainer.list.length * 48), 'VCR_osd_mono', this.userOperatorText.text + this.userInputText.text, 32).setTint(0xFF0000);
        newLog.setTint(0xFF0000)
        this.logContainer.add(newLog);

        const nextLog = this.add.bitmapText(0, (0 + this.logContainer.list.length * 48), 'VCR_osd_mono', result, 32).setTint(0x000000);
        this.logContainer.add(nextLog);
    };

    // **** WIP Post-Game Completion Popup message
    showPopup(message) {
        // Pause the game
        //this.scene.pause();
        console.log('Game paused. showing popup...');

        // Create an invisible overlay to block interactions
        let overlay = this.add.rectangle(
            this.cameras.main.width / 2, 
            this.cameras.main.height / 2, 
            this.cameras.main.width, 
            this.cameras.main.height, 
            0x000000, 0.5
        ).setInteractive(); // Prevents clicks on game objects

        // Create a container for the popup
        let popup = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Background for the popup
        let bg = this.add.nineslice(0, 0, 'ui', 'window_blue', 320, 400, 64, 64, 64, 64);
        bg.setOrigin(0.5);

        const title = this.add.bitmapText(0, -112, 'VCR_osd_mono', message, 50).setOrigin(0.5).setTint(0xFFFFFF);
        const body = this.add.text(0, title.y + title.height + 16, 'You cracked the code!\nContinue playing for more practice.', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 240 }
        }).setOrigin(0.5);

        // Option 1: 'Play Again'
        const option1 = this.add.container(0, 48);
        option1.setSize(200, 64).setInteractive();
        const option1Bg = this.add.nineslice(0, 0, 'ui', 'box_yellow', 200, 64, 48, 48, 24, 24).setOrigin(0.5).setTint(0x31CC53);
        const option1Text = this.add.text(0, 0, "PLAY AGAIN", {
            fontFamily: 'Arial',
            fontSize: "20px",
            fontWeight: 'bold'
        }).setOrigin(0.5);

        option1.add([option1Bg, option1Text]);
        option1.on('pointerover', () => {
            option1Bg.setTint(0x2ab849);
        });
        option1.on('pointerout', () => {
            option1Bg.setTint(0x39E75F);
        });
        option1.on("pointerdown", () => {
            popup.destroy();
            overlay.destroy();
            this.scene.restart("GameScene");
            console.log('Playing Again...')
        });

        // Option 2: 'Main Menu'
        const option2 = this.add.container(0, 128);
        option2.setSize(200, 64).setInteractive();
        const option2Bg = this.add.nineslice(0, 0, 'ui', 'box_yellow', 200, 64, 48, 48, 24, 24).setOrigin(0.5);
        const option2Text = this.add.text(0, 0, "MAIN MENU", {
            fontFamily: 'Arial',
            fontSize: "20px",
            color: '#1C1C1C'
        }).setOrigin(0.5);

        option2.add([option2Bg, option2Text]);
        option2.on('pointerover', () => {
            option2Bg.setTint(0xe8d905);
        });
        option2.on('pointerout', () => {
            option2Bg.clearTint();
        });
        option2.on("pointerdown", () => {
            popup.destroy();
            overlay.destroy();
            this.scene.restart("GameScene");
            console.log('**GAME RESTARTED**')
            this.scene.stop('GameScene');
            console.log('**GAMESCENE STOPPED**')
            this.scene.start('StartScene');
        });

        // Add elements to the container
        popup.add([bg, title, body, option1, option2]);
    }

    resetGame() {
        gameState.solutions = [];
        gameState.userProgress = 0;
        gameState.result = 0;
        gameState.stage = 0;
    };




}


export default GameScene;