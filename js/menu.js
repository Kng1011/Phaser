export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'MenuScene'});
    }

    preload() {
        // Carregar os recursos, se necessário
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

        const controlsButton = this.add.text(400, 400, 'Controls', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.controls());
    }

    startSkillSelection() {
        this.scene.start('SkillSelectionScene');
    }

    controls() {
        this.scene.start('ControlsScene');
    }
}
