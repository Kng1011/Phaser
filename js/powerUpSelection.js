export default class PowerUpSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PowerUpSelectionScene' });
        this.selectedSkills = [];
        this.selectedPowerUps = [];
    }

    init(data) {
        this.selectedSkills = data.selectedSkills || [];
        this.selectedPowerUps = data.selectedPowerUps || [];
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
                powerUpKey: 'health'
            },
            {
                name: 'Attack Boost',
                description: 'Increases your attack power.',
                powerUpKey: 'attack'
            },
            {
                name: 'Speed Boost',
                description: 'Increases your movement speed.',
                powerUpKey: 'speed'
            },
            {
                name: 'Attack Speed Boost',
                description: 'Increases your attack speed.',
                powerUpKey: 'attackSpeed'
            },
            {
                name: 'Cooldown Reduction',
                description: 'Reduces your ability cooldowns.',
                powerUpKey: 'cooldownReduction'
            },
            {
                name: 'Regeneration',
                description: 'Heals every time you kill an enemy.',
                powerUpKey: 'healOnKill'
            }
        ];


        const availablePowerUps = powerUps.filter(powerUp => !this.selectedPowerUps.includes(powerUp.powerUpKey));

 
        Phaser.Utils.Array.Shuffle(availablePowerUps);
        const selectedPowerUps = availablePowerUps.slice(0, 3);


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
        
        this.selectedPowerUps.push(powerUp);
        this.scene.start('GameScene', { selectedSkills: this.selectedSkills, selectedPowerUps: this.selectedPowerUps });
    }
}
