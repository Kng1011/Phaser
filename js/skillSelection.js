export default class SkillSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SkillSelectionScene' });
    }

    create() {
        this.add.text(400, 50, 'Select a Skill', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Descrições das habilidades
        const skills = [
            {
                name: 'Flash Map',
                description: 'Briefly reveal the map for 1 second.',
                cooldown: 'Cooldown: 5 seconds',
                position: { x: 400, y: 200 },
                skillKey: 'flash'
            },
            {
                name: 'Fireball',
                description: 'Shoot a fireball that deals damage to enemies.',
                cooldown: 'Cooldown: 2 seconds',
                position: { x: 400, y: 300 },
                skillKey: 'fireball'
            },
            {
                name: 'Dark Attack',
                description: 'Launch a dark attack that deals significant damage.',
                cooldown: 'Cooldown: 3 seconds',
                position: { x: 400, y: 400 },
                skillKey: 'darkAttack'
            }
        ];

        // Criar botões de habilidades e descrições
        skills.forEach(skill => {
            const skillButton = this.add.text(skill.position.x, skill.position.y, skill.name, {
                fontSize: '32px',
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.selectSkill(skill.skillKey));

            this.add.text(skill.position.x, skill.position.y + 40, skill.description, {
                fontSize: '18px',
                color: '#aaaaaa'
            }).setOrigin(0.5);

            this.add.text(skill.position.x, skill.position.y + 60, skill.cooldown, {
                fontSize: '18px',
                color: '#aaaaaa'
            }).setOrigin(0.5);
        });
    }

    selectSkill(skill) {
        this.scene.start('GameScene', { selectedSkill: skill });
    }
}
