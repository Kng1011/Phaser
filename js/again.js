export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameOverScene'});
    }

    preload(){
        //pass
    }

    create(){
        this.add.text(400, 200, 'Game Over',
            {font: '48px Arial',
             fill: '#fff'   
            }
        ).setOrigin(0.5);

        const restartButton = this.add.text(400, 300, 'Restart', 
            {font: '32px Arial',
             fill: '#fff'
            }
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.restartGame());

        const leaveButton = this.add.text(400, 400, 'Leave',
            {font: '32px Arial',
             fill: '#fff'
            }
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.leaveGame());
    }

    restartGame() {
        this.scene.start('Function'); 

        this.scene.get('Function').events.emit('restart');
    }

    leaveGame(){
        this.scene.start('MainMenuScene');
    }
}