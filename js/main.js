import GameScene from './gameScene.js';
import GameOverScene from './again.js';
import MenuScene from './menu.js';
import ControlsScene from './controls.js';
import PauseScene from './pauseScene.js';

import SkillSelectionScene from './skillSelection.js';
import PowerUpSelectionScene from './powerUpSelection.js'; 

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },

    scene: [MenuScene, SkillSelectionScene, PowerUpSelectionScene, GameScene, GameOverScene, ControlsScene, PauseScene]
};

var game = new Phaser.Game(config);
