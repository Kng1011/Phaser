export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.cursors = null;
        this.direction = 'forward';
        this.darkness = null;
        this.lightMask = null;
        this.attackKey = null;
        this.fireballKey = null;
        this.enemy = null;
        this.enemyHealth = 100;
        this.enemyHealthBar = null;
        this.enemyAttackRange = 50;
        this.fireballs = null;
        this.canShootFireball = true;
        this.fireballCooldownTime = 2000; // 2 segundos
        this.fireballCooldownGraphic = null;
        this.playerHealth = 100;
        this.playerHealthBar = null;
        this.playerHealthBarRed = null;
    }

    preload() {
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('fireball', 'assets/fireball.png', { frameWidth: 64, frameHeight: 32 });
        this.load.image('Frame', 'assets/Frame.png');
        this.load.image('lifebar1', 'assets/Lifebar1.png');
        this.load.image('lifebar2', 'assets/Lifebar2.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'tiles');
        const layer1 = map.createLayer('Camada de Blocos 1', tileset);

        this.setupAnimations();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.fireballKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.player = this.physics.add.sprite(400, 300, 'player').setScale(2);

        this.darkness = this.make.graphics();
        this.darkness.fillStyle(0x000000, 1);
        this.darkness.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.darkness.setAlpha(0.9);

        this.lightMask = this.make.graphics();
        this.lightMask.fillStyle(0xffffff, 1);
        this.lightMask.fillCircle(0, 0, 100);
        this.lightMask.setBlendMode(Phaser.BlendModes.ERASE);

        const mask = this.darkness.createBitmapMask(this.lightMask);
        layer1.setMask(mask);
        this.player.setMask(mask);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };

        this.spawnEnemy();
        this.fireballs = this.physics.add.group({
            defaultKey: 'fireball',
            maxSize: 100
        });

        const frame = this.add.sprite(60, 560, 'Frame').setScale(2.5);
        this.fireballCooldownGraphic = this.add.sprite(50, 560, 'fireball').setScale(1.8);
        frame.setDepth(10);
        this.fireballCooldownGraphic.setDepth(11);

        this.playerHealthBarBg = this.add.sprite(0, 20, 'lifebar1').setOrigin(0, 0).setScale(2.5);
        this.playerHealthBar = this.add.sprite(0, 20, 'lifebar2').setOrigin(0, 0).setScale(2.5);
        this.playerHealthBarBg.setDepth(10);
        this.playerHealthBar.setDepth(11);

    }

    update() {
        this.darkness.clear();
        this.darkness.fillStyle(0x000000, 1);
        this.darkness.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.lightMask.clear();
        this.lightMask.fillStyle(0xffffff, 1);
        this.lightMask.fillCircle(this.player.x, this.player.y, 100);
        this.player.setVelocity(0);

        let moving = false;
        let attack = false;
    
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('walkleft', true);
            this.direction = 'left';
            moving = true;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('walkright', true);
            this.direction = 'right';
            moving = true;
        }
    
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play('walkforward', true);
            this.direction = 'forward';
            moving = true;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.setVelocityY(160);
            this.player.anims.play('walkbackwards', true);
            this.direction = 'backwards';
            moving = true;
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            attack = true;
            this.player.anims.play('attack' + this.direction.toLowerCase(), true);
            this.dealDamage();  
                
        }

        if (this.player.anims.currentAnim && this.player.anims.currentAnim.key.startsWith('attack') && this.player.anims.isPlaying) {
            attack = true;
        } else {
            attack = false;
        }

        if (!moving && !attack) {
            this.player.anims.stop();
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.fireballKey) && this.canShootFireball) {
            this.shootFireball();
        }
    
        if (this.enemy) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enemy.x, this.enemy.y);
            if (distance < this.enemyAttackRange) {
                if (!this.enemy.anims.isPlaying || this.enemy.anims.currentAnim.key !== 'enemyAttack') {
                    this.enemy.anims.play('enemyAttack', true);
                    if (this.playerHealth > 0) {
                        this.playerHealth -= 5;
                    }
                }
            } else {
                this.physics.moveToObject(this.enemy, this.player, 100);
                this.updateEnemyAnimation();
            }
    
            // Verificação de visibilidade do inimigo
            const lightRadius = 100;
            const isEnemyVisible = distance <= lightRadius;
            this.enemy.setVisible(isEnemyVisible);
            this.enemyHealthBar.setVisible(isEnemyVisible);
        }
    
        this.updatePlayerHealthBar();
        this.updateEnemyHealthBar();
    }
    

    setupAnimations() {
        
this.anims.create({
    key: 'walkbackwards',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'walkforward',
    frames: this.anims.generateFrameNumbers('player', { start: 48, end: 53 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'walkleft',
    frames: this.anims.generateFrameNumbers('player', { start: 16, end: 20 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'walkright',
    frames: this.anims.generateFrameNumbers('player', { start: 32, end: 36 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'attackbackwards',
    frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: 0
});

this.anims.create({
    key: 'attackright',
    frames: this.anims.generateFrameNumbers('player', { start: 37, end: 40 }),
    frameRate: 10,
    repeat: 0
});

this.anims.create({
    key: 'attackleft',
    frames: this.anims.generateFrameNumbers('player', { start: 21, end: 24 }),
    frameRate: 10,
    repeat: 0
});

this.anims.create({
    key: 'attackforward',
    frames: this.anims.generateFrameNumbers('player', { start: 53, end: 56 }),
    frameRate: 10,
    repeat: 0
});

// Cria as animações de movimento do inimigo usando a spritesheet do jogador
this.anims.create({
    key: 'enemyWalkBackwards',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'enemyWalkForward',
    frames: this.anims.generateFrameNumbers('player', { start: 48, end: 55 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'enemyWalkRight',
    frames: this.anims.generateFrameNumbers('player', { start: 32, end: 39 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'enemyWalkLeft',
    frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'enemyAttack',
    frames: this.anims.generateFrameNumbers('player', { start: 37, end: 40 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'fireballAnim',
    frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
});
    }

    spawnEnemy() {
        const randomX = Phaser.Math.Between(50, this.cameras.main.width - 50);
        const randomY = Phaser.Math.Between(50, this.cameras.main.height - 50);
        this.enemy = this.physics.add.sprite(randomX, randomY, 'player').setScale(2);
        this.enemyHealth = 100;
        this.enemyHealthBar = this.add.graphics();
        this.updateEnemyHealthBar();
    }

    dealDamage() {
        if (this.enemy && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enemy.x, this.enemy.y) < this.enemyAttackRange) {
            this.enemyHealth -= 25;
            if (this.enemyHealth <= 0) {
                this.enemy.destroy();
                this.enemyHealthBar.destroy();
                this.spawnEnemy();
            }
        }
    }

    updateEnemyHealthBar() {
        if (this.enemy && this.enemyHealthBar) {
            this.enemyHealthBar.clear();
            this.enemyHealthBar.fillStyle(0xff0000, 1);
            this.enemyHealthBar.fillRect(this.enemy.x - 32, this.enemy.y - 40, (this.enemyHealth / 100) * 64, 10);
            this.enemyHealthBar.setDepth(11);
        }
    }

    updateEnemyAnimation() {
        if (this.enemy.body.velocity.x > 0) {
            this.enemy.anims.play('enemyWalkRight', true);
        } else if (this.enemy.body.velocity.x < 0) {
            this.enemy.anims.play('enemyWalkLeft', true);
        } else if (this.enemy.body.velocity.y > 0) {
            this.enemy.anims.play('enemyWalkForward', true);
        } else if (this.enemy.body.velocity.y < 0) {
            this.enemy.anims.play('enemyWalkBackwards', true);
        }
    }

    shootFireball() {
        if (!this.canShootFireball) return;
        this.canShootFireball = false;
        this.fireballCooldownGraphic.setTint(0xff0000);
        const fireball = this.fireballs.get(this.player.x, this.player.y, 'fireball').setScale(2);
        fireball.anims.play('fireballAnim');
        this.physics.add.collider(fireball, this.enemy, this.hitEnemy, null, this);
        let velocityX = 0;
        let velocityY = 0;
        switch (this.direction) {
            case 'left':
                velocityX = -300;
                fireball.angle = 180;  // Aponta para a esquerda
                break;
            case 'right':
                velocityX = 300;
                fireball.angle = 0;    // Aponta para a direita (padrão)
                break;
            case 'forward':
                velocityY = -300;
                fireball.angle = -90;  // Aponta para cima
                break;
            case 'backwards':
                velocityY = 300;
                fireball.angle = 90;   // Aponta para baixo
                break;
        }
        fireball.setVelocity(velocityX, velocityY);
        this.time.addEvent({
            delay: this.fireballCooldownTime,
            callback: () => {
                this.canShootFireball = true;
                this.fireballCooldownGraphic.clearTint();
            },
            callbackScope: this
        });
    }

    hitEnemy(fireball, enemy) {
        fireball.destroy();
        this.enemyHealth -= 100;
        if (this.enemyHealth <= 0) {
            this.enemy.destroy();
            this.enemyHealthBar.destroy();
            this.spawnEnemy();
        }
    }

    updatePlayerHealthBar() {
        const healthPercentage = this.playerHealth / 100;
        this.playerHealthBar.displayWidth = this.playerHealthBarBg.width * healthPercentage;
    }
}