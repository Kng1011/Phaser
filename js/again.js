export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameOverScene'});
    }

    preload(){
        //pass
    }

    create(){
        this.add.text(400, 200, 'Game Over',
            {font: '96px Chiller', fill: '#fff'}
        ).setOrigin(0.5);

        const restartButton = this.add.text(400, 320, 'Restart', 
            {font: '64px Chiller', fill: '#fff'}
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.restartGame());

        const leaveButton = this.add.text(400, 420, 'Leave',
            {font: '64px Chiller', fill: '#fff'}
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.leaveGame());
    }

    restartGame() {
        this.scene.start('GameScene');
        console.log('restart');
    }

    leaveGame(){
        this.scene.start('MenuScene');
    }
}
