export default class PowerUpSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PowerUpSelectionScene' });
    }

    create() {
        this.add.text(400, 50, 'Select a Power-Up', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const powerUps = [
            {
                name: 'Health Boost',
                description: 'Increases your health.',
                position: { x: 400, y: 200 },
                powerUpKey: 'health'
            },
            {
                name: 'Attack Boost',
                description: 'Increases your attack power.',
                position: { x: 400, y: 300 },
                powerUpKey: 'attack'
            },
            {
                name: 'Speed Boost',
                description: 'Increases your movement speed.',
                position: { x: 400, y: 400 },
                powerUpKey: 'speed'
            },
            {
                name: 'Attack Speed Boost',
                description: 'Increases your attack speed.',
                position: { x: 400, y: 500 },
                powerUpKey: 'attackSpeed'
            },
            {
                name: 'Coolwdown Reduction',
                description: 'Reduces your ability cooldowns.',
                position: { x: 400, y: 600 },
                powerUpKey: 'cooldownReduction'
            },
            {
                name: 'Regeneration',
                description: 'Heals every time you kill an enemy.',
                position: { x: 400, y: 700 },
                powerUpKey: 'healOnKill'
            }
        ];

        // Embaralhar as habilidades e selecionar as três primeiras
        Phaser.Utils.Array.Shuffle(powerUps);
        const selectedPowerUps = powerUps.slice(0, 3);

        // Posicionar os power-ups selecionados
        selectedPowerUps.forEach((powerUp, index) => {
            const yPos = 200 + index * 100;
            const powerUpButton = this.add.text(400, yPos, powerUp.name, {
                fontSize: '32px',
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.selectPowerUp(powerUp.powerUpKey));

            this.add.text(400, yPos + 40, powerUp.description, {
                fontSize: '18px',
                color: '#aaaaaa'
            }).setOrigin(0.5);
        });
    }

    selectPowerUp(powerUp) {
        this.scene.start('GameScene', { selectedPowerUp: powerUp });
    }
}
