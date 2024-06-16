export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // pass
    }

    create() {
        this.add.text(400, 200, 'In the Darkness', {
            font: '48px Arial',
            fill: '#fff'
        }).setOrigin(0.5);

        const startButton = this.add.text(400, 300, 'Start Game', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.startSkillSelection());

        const powerUpButton = this.add.text(400, 350, 'Select Power-Up', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.startPowerUpSelection());

        const controlsButton = this.add.text(400, 400, 'Controls', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.controls());
    }

    startSkillSelection() {
        this.scene.start('SkillSelectionScene');
    }

    startPowerUpSelection() {
        this.scene.start('PowerUpSelectionScene');
    }

    controls() {
        this.scene.start('ControlsScene');
    }
}
