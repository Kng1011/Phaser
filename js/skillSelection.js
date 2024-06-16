export default class SkillSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SkillSelectionScene'});
    }

    create() {
        this.add.text(400, 100, 'Select a Skill', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const flashSkillButton = this.add.text(400, 200, 'Flash Map', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.selectSkill('flash'));

        const fireballSkillButton = this.add.text(400, 300, 'Fireball', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.selectSkill('fireball'));

        const darkAttackSkillButton = this.add.text(400, 400, 'Dark Attack', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.selectSkill('darkAttack'));
    }

    selectSkill(skill) {
        this.scene.start('GameScene', { selectedSkill: skill });
    }
}
