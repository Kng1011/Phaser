export default class SkillSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SkillSelectionScene' });
        this.selectedSkills = [];
        this.selectedPowerUps = [];
        this.level = 0;
    }

    init(data) {
        this.selectedSkills = data.selectedSkills || [];
        this.selectedPowerUps = data.selectedPowerUps || [];
        this.level = data.level || 0;
    }

    create() {
        this.add.text(400, 50, 'Select a Skill', {
            font: '64px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5);

        if (this.level > 0) {
            this.add.text(400, 100, 'Level Completed(' + this.level + ')', {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5);
        }

        const skills = [
            {
                name: 'Flash Map',
                description: 'Briefly reveal the map for 1 second.',
                cooldown: 'Cooldown: 5 seconds',
                skillKey: 'flash',
                proficiency: 0
            },
            {
                name: 'Fireball',
                description: 'Shoot a fireball that deals damage to enemies.',
                cooldown: 'Cooldown: 2 seconds',
                skillKey: 'fireball',
                damage: 100,
                proficiency: 0
            },
            {
                name: 'Dark Attack',
                description: 'Launch a dark attack that deals significant damage.',
                cooldown: 'Cooldown: 3 seconds',
                skillKey: 'darkAttack',
                damage: 120,
                proficiency: 0
            },
            {
                name: 'DarkBolt',
                description: 'Shoot multiple dark bolts that deals damage to enemies.',
                cooldown: 'Cooldown: 8 seconds',
                skillKey: 'darkBoltAttack',
                damage: 150,
                proficiency: 0
            }
        ];

        const availableSkills = skills.filter(skill => !this.selectedSkills.some(selectedSkill => selectedSkill.skillKey === skill.skillKey));

        Phaser.Utils.Array.Shuffle(availableSkills);
        const selectedSkills = availableSkills.slice(0, 3);

        skills.forEach((skill) => {
            if (skill.damage) {
                skill.damage += 2 * skill.proficiency;
            }
        });

        selectedSkills.forEach((skill, index) => {
            const yPos = 200 + index * 100;
            const skillButton = this.add.text(400, yPos, skill.name, {
                font: '50px Chiller',
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.selectSkill(skill));

            this.add.text(400, yPos + 30, skill.description, {
                font: '26px Chiller',
                color: '#aaaaaa'
            }).setOrigin(0.5);

            this.add.text(400, yPos + 55, skill.cooldown, {
                font: '26px Chiller',
                color: '#aaaaaa'
            }).setOrigin(0.5);
        });
    }

    selectSkill(skill) {
        if (!this.selectedSkills.some(selectedSkill => selectedSkill.skillKey === skill.skillKey)) {
            this.selectedSkills.push(skill);
        }
        this.scene.start('GameScene', { selectedSkills: this.selectedSkills, selectedPowerUps: this.selectedPowerUps });
    }
}
