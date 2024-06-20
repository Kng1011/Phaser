export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        //pass
    }

    create() {
        this.add.text(400, 200, 'In the Darkness', {
            font: '96px Chiller',
            fill: '#fff'
        }).setOrigin(0.5);

        const startButton = this.add.text(400, 325, 'Start Game', {
            font: '64px Chiller',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.startSelection());

        const controlsButton = this.add.text(400, 425, 'Controls', {
            font: '64px Chiller',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.controls());
    }

    startSelection() {
        const randomScene = Math.random();

        if (randomScene < 0.5) {
            this.scene.start('SkillSelectionScene');
        } else {
            this.scene.start('PowerUpSelectionScene');
        }
    }

    controls() {
        this.scene.start('ControlsScene');
    }
}
