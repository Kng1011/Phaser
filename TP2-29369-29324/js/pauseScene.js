export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
        this.playerAttributes = {
            playerSpeed: 0,
            playerAttack: 0,
            playerAttackSpeed: 0,
            playerHealth: 0,
            playerMaxHealth: 0,
            selectedSkills: [],
            selectedPowerUps: []
        };

    }

    init(data) {
        this.playerAttributes = data.playerAttributes;
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(400, 150, 'Game Paused', {
            font: '128px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Continue());

        this.add.text(500, 350, 'Continue', {
            font: '64px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Continue());

        this.add.text(375, 450, 'Stats', {
            font: '64px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Stats());

        this.add.text(250, 350, 'Leave', {
            font: '64px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Leave());

    }

    Continue() {
        this.scene.stop();
        this.scene.resume('GameScene');
    }

    Stats() {
        this.scene.pause();
        this.scene.launch('StatsScene', { playerAttributes: this.playerAttributes });
    }

    Leave() {
        this.scene.stop();  
        this.scene.stop('GameScene');
        this.scene.start('MenuScene');
    }
}