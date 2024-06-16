export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'MenuScene'});
    }

    preload() {
        //pass
    }

    create() {
        this.add.text(400, 200, 'In the darkness',
            {font: '48px Arial',
             fill: '#fff'}
        ).setOrigin(0.5);

        const startButton = this.add.text(400, 300, 'Start',
            {font: '32px Arial',
             fill: '#fff'}
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.startGame());
        
        const controlsButton = this.add.text(400, 400, 'Controls',
            {font: '32px Arial',
             fill: '#fff'
            }
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.controls());
    }

    startGame() {
        this.scene.start('GameScene');
    }

    controls() {
        this.scene.start('ControlsScene');
    }
}