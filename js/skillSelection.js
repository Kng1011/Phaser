export default class SkillSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SkillSelectionScene' });
        this.selectedSkills = [];
        this.selectedPowerUps = [];
    }

    init(data) {
        this.selectedSkills = data.selectedSkills || [];
        this.selectedPowerUps = data.selectedPowerUps || [];
    }

    create() {
        this.add.text(400, 50, 'Select a Skill', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const skills = [
            {
                name: 'Flash Map',
                description: 'Briefly reveal the map for 1 second.',
                cooldown: 'Cooldown: 5 seconds',
                skillKey: 'flash'
            },
            {
                name: 'Fireball',
                description: 'Shoot a fireball that deals damage to enemies.',
                cooldown: 'Cooldown: 2 seconds',
                skillKey: 'fireball'
            },
            {
                name: 'Dark Attack',
                description: 'Launch a dark attack that deals significant damage.',
                cooldown: 'Cooldown: 3 seconds',
                skillKey: 'darkAttack'
            }
        ];

        
        const availableSkills = skills.filter(skill => !this.selectedSkills.includes(skill.skillKey));

        
        availableSkills.forEach((skill, index) => {
            const yPos = 200 + index * 100;
            const skillButton = this.add.text(400, yPos, skill.name, {
                fontSize: '32px',
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.selectSkill(skill.skillKey));

            this.add.text(400, yPos + 40, skill.description, {
                fontSize: '18px',
                color: '#aaaaaa'
            }).setOrigin(0.5);

            this.add.text(400, yPos + 60, skill.cooldown, {
                fontSize: '18px',
                color: '#aaaaaa'
            }).setOrigin(0.5);
        });
    }

    selectSkill(skill) {
        
        this.selectedSkills.push(skill);
        this.scene.start('GameScene', { selectedSkills: this.selectedSkills, selectedPowerUps: this.selectedPowerUps });
    }
}
