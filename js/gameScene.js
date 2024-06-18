export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene'});
        
        this.cursors = null;
        this.direction = 'forward';
        this.darkness = null;
        this.lightMask = null;

        this.attackKey = null;
        this.fireballKey = null;
        this.darkAttackKey = null;
        this.mapFlashKey = null;
        this.darkBoltAttackKey = null;

        this.enemy = null;
        this.enemyHealth = 100;
        this.enemyHealthBar = null;
        this.enemyAttackRange = 25;

        this.selectedSkill = null;
        this.darkattacks = null;
        this.canDarkAttack = true;
        this.darkAttacksCooldownTime = 3000;
        this.darkAttacksCooldownTimeGraphic = null;
        this.fireballs = null;
        this.canShootFireball = true;
        this.fireballCooldownTime = 2000; 
        this.fireballCooldownGraphic = null;
        this.darkBoltAttack = null;
        this.canDarkBoltAttack = true;
        this.darkBoltAttackCooldownTime = 4500;
        this.darkBoltAttackCooldownTimeGraphic = null;
        
        this.player = null;
        this.playerSpeed = 200;
        this.playerAttack = 25;
        this.playerAttackSpeed = 10;
        this.playerHealth = 100;
        this.playerMaxHealth = 100;
        this.playerHealthBar = null;
        this.playerHealthBarRed = null;
        this.healHeath = 0;

        this.lightRadius = 100; 
        this.lightDecreaseRate = 3; 
        this.maxLightRadius = 200; 
        this.minLightRadius = 50;
        this.fireballLightMask = null;
        this.fireballLightRadius = 50;
        this.killCount = 0;
        this.maxKills = 10 ;
        this.mapVisible = false;
        this.layer1 = null;
        this.lightFlash = null;
        

        this.skillFrames = [];
        this.selectedSkills = [];
        this.selectedPowerUps = [];
    }

    preload() {
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('fireball', 'assets/fireball.png', { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet('DarkAttack1', 'assets/DarkVFX1.png', { frameWidth: 40, frameHeight: 32 });
        this.load.spritesheet('boltdark', 'assets/DarkBolt.png', { frameWidth: 64, frameHeight: 88 });
        this.load.image('Frame', 'assets/Frame.png');
        this.load.image('lifebar1', 'assets/Lifebar1.png');
        this.load.image('lifebar2', 'assets/Lifebar2.png');
        this.load.spritesheet('zombie', 'assets/ZombieSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('troll', 'assets/TrollSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('skeleton', 'assets/SkeletonSheet.png', { frameWidth: 32, frameHeight: 32 });
    }

    init(data) {
        this.playerHealth = this.playerMaxHealth;
        this.killCount = 0;
        this.lightRadius = 100; 
        this.selectedSkills = data.selectedSkills || [];  
        this.selectedPowerUps = data.selectedPowerUps || [];
        this.canShootFireball = true;
        this.canDarkAttack = true;
        this.canDarkBoltAttack = true;
        console.log(this.selectedSkills);
        console.log(this.selectedPowerUps);
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'tiles');
        this.layer1 = map.createLayer('Camada de Blocos 1', tileset);

        this.setupAnimations();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.selectedSkills.forEach(skill => {
            switch (skill) {
                case 'fireball':
                    this.fireballKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
                    break;
                case 'darkAttack':
                    this.darkAttackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
                    break;
                case 'flash':
                    this.mapFlashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
                    break;
                case 'darkBoltAttack':
                    this.darkBoltAttackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
                    break;
            }
        });

        this.player = this.physics.add.sprite(400, 300, 'player').setScale(2);

        this.darkness = this.make.graphics();
        this.darkness.fillStyle(0x000000, 1);
        this.darkness.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.darkness.setAlpha(0.9);

        this.lightMask = this.make.graphics();
        this.lightMask.fillStyle(0xffffff, 1);
        this.lightMask.fillCircle(0, 0, this.lightRadius);
        this.lightMask.setBlendMode(Phaser.BlendModes.ERASE);

        const mask = this.darkness.createBitmapMask(this.lightMask);
        this.layer1.setMask(mask);
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

        this.darkattacks = this.physics.add.group({
            defaultKey: 'DarkAttack1',
            maxSize: 100
        });

        this.darkBoltAttacks = this.physics.add.group({
            defaultKey: 'boltdark',
            maxSize: 100
        });

        this.fireballLightMask = this.make.graphics();
        this.fireballLightMask.fillStyle(0xffffff, 1);
        this.fireballLightMask.fillCircle(0, 0, this.fireballLightRadius);
        this.fireballLightMask.setBlendMode(Phaser.BlendModes.ERASE);
        
        this.fireballs.children.each(function(fireball) {   
            fireball.setMask(this.darkness.createBitmapMask(this.fireballLightMask));
        }, this);

        const baseX = 60;
        const baseY = 560;
        const frameOffset = 70;
        this.selectedSkills.forEach((skill, index) => {
            if (skill === 'fireball') {
                this.addSkillFrame(baseX + index * frameOffset, baseY, 'fireball');
            } else if (skill === 'darkAttack') {
                this.addSkillFrame(baseX + index * frameOffset, baseY, 'DarkAttack1');
            } else if (skill === 'flash') {
                this.addSkillFrame(baseX + index * frameOffset, baseY, 'flash');
            } else if (skill === 'darkBoltAttack') {
                this.addSkillFrame(baseX + index * frameOffset, baseY, 'darkBoltAttack');
            }
        });
    
        this.playerHealthBarBg = this.add.sprite(10, 20, 'lifebar1').setOrigin(0, 0).setScale(2.5);
        this.playerHealthBar = this.add.sprite(10, 20, 'lifebar2').setOrigin(0, 0).setScale(2.5);
        this.playerHealthBarBg.setDepth(10);
        this.playerHealthBar.setDepth(11);

        this.updatePlayerHealthBar();

        this.time.addEvent({
            delay: 1000,
            callback: this.decreaseLightRadius,
            callbackScope: this,
            loop: true
        });

        this.killCountText = this.add.text(760, 10, `Kills: ${this.killCount} / ${this.maxKills}`, {
            font: '20px Arial',
            fill: '#ffffff',
        }).setOrigin(1, 0);

        this.timerValue = 60; 
        this.timerText = this.add.text(760, 50, `Tempo: ${this.timerValue}`, {
            font: '20px Arial',
            fill: '#ffffff', 
        }).setOrigin(1, 0); 

    
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        }); 

        this.lightFlash = this.add.graphics();
        this.lightFlash.fillStyle(0xffffe0, 1);
        this.lightFlash.setAlpha(0);

        this.selectedPowerUps.forEach(powerUp => {
            this.applyPowerUp(powerUp);
        });

    
    }

    applyPowerUp(powerUp) {
        if (powerUp === 'health') {
            this.playerMaxHealth = 150;
            this.playerHealth = 150;    
        } else if (powerUp === 'attack') {  
            this.playerAttack = 55;
        } else if (powerUp === 'speed') {
            this.playerSpeed = 300; 
        } else if (powerUp === 'attackSpeed') {
            this.playerAttackSpeed = 20;
        } else if (powerUp === 'cooldownReduction') {
            this.fireballCooldownTime = 1000;
            this.darkAttacksCooldownTime = 2000;
        } else if (powerUp === 'healOnKill') {
            this.healHeath = 10;
        }
    }

    addSkillFrame(x, y, skill) {
        const frame = this.add.sprite(x, y, 'Frame').setScale(2.5);
        let skillGraphic;
        if (skill === 'fireball') {
            skillGraphic = this.add.sprite(x - 10, y, 'fireball').setScale(1.8);
            this.fireballCooldownGraphic = skillGraphic;
        } else if (skill === 'DarkAttack1') {
            skillGraphic = this.add.sprite(x , y, 'DarkAttack1').setScale(1.8);
            this.darkAttacksCooldownTimeGraphic = skillGraphic;
        } else if (skill === 'flash') {
            skillGraphic = this.add.text(x , y, 'Flash', { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);
        } else if (skill === 'darkBoltAttack') {
            skillGraphic = this.add.sprite(x - 10 , y - 12, 'boltdark', 3).setScale(0.9);
            this.darkBoltAttackCooldownTimeGraphic = skillGraphic;
        }
        frame.setDepth(10);
        skillGraphic.setDepth(11);
        this.skillFrames.push({ frame, skillGraphic });
    }

    updateTimer() {
        if (this.timerValue > 0) {
            this.timerValue--;
            this.timerText.setText(`Tempo: ${this.formatTime(this.timerValue)}`);
        } 
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const partInSeconds = seconds % 60;
        const partInSecondsStr = partInSeconds.toString().padStart(2, '0');
        return `${minutes}:${partInSecondsStr}`;
    }

    update() {
        this.darkness.clear();
        this.darkness.fillStyle(0x000000, 1);
        this.darkness.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.lightMask.clear();
        this.lightMask.fillStyle(0xffffff, 1);
        this.lightMask.fillCircle(this.player.x, this.player.y, this.lightRadius);
        this.player.setVelocity(0);

        console.log(this.playerHealth);

        this.fireballs.children.each(function(fireball) {
            if (fireball.active) {
                this.lightMask.fillStyle(fireball.fireballLightColor, 1);
                this.lightMask.fillCircle(fireball.x, fireball.y, fireball.fireballLightRadius);
            }
        }, this);

        let isMoving = false;
        let attack = false;
    
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.anims.play('walkleft', true);
            this.direction = 'left';
            isMoving = true;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.anims.play('walkright', true);
            this.direction = 'right';
            isMoving = true;
        }
    
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
            this.player.anims.play('walkforward', true);
            this.direction = 'forward';
            isMoving = true;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
            this.player.anims.play('walkbackwards', true);
            this.direction = 'backwards';
            isMoving = true;
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

        if (!isMoving && !attack) {
            this.player.anims.stop();
        }

        if (this.fireballKey && Phaser.Input.Keyboard.JustDown(this.fireballKey) && this.canShootFireball) {
            this.shootFireball();
        }
    
        if (this.darkAttackKey && Phaser.Input.Keyboard.JustDown(this.darkAttackKey) && this.canDarkAttack) {
            this.DarkAttack();
        }
    
        if (this.mapFlashKey && Phaser.Input.Keyboard.JustDown(this.mapFlashKey)) {
            this.flashMap(this.layer1);
        }

        if (this.darkBoltAttackKey && Phaser.Input.Keyboard.JustDown(this.darkBoltAttackKey) && this.canDarkBoltAttack) {
            this.darkBoltAttack1();
        }
    
        if (this.enemy) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enemy.x, this.enemy.y);
        
            if (distance < this.enemyAttackRange) {
                this.enemy.setVelocity(0, 0);

                if (this.enemy.anims.currentAnim.key !== 'enemyAttack') {
                    this.enemy.anims.play('enemyAttack', true);
                }
        
                if (!this.enemyAttackTimer || this.time.now > this.enemyAttackTimer) {
                    if (this.playerHealth > 0) {
                        this.playerHealth -= 5; 
                    }
                    this.enemyAttackTimer = this.time.now + 1000; 
                }
            } else {
               
                this.physics.moveToObject(this.enemy, this.player, 100);
                this.updateEnemyAnimation(this.enemy.body.velocity);
            }
        
            const isEnemyVisible = distance <= this.lightRadius;
            this.enemy.setVisible(isEnemyVisible);
            this.enemyHealthBar.setVisible(isEnemyVisible);
        }
    
        this.updatePlayerHealthBar();
        this.updateEnemyHealthBar();
        this.killCountText.setText(`Kills: ${this.killCount} / ${this.maxKills}`);

    }

    updateEnemyAnimation(velocity) {
    if (velocity.x > 0) {
        this.enemy.anims.play('enemyWalkRight', true);
    } else if (velocity.x < 0) {
        this.enemy.anims.play('enemyWalkLeft', true);
    } else if (velocity.y > 0) {
        this.enemy.anims.play('enemyWalkForward', true);
    } else if (velocity.y < 0) {
        this.enemy.anims.play('enemyWalkBackwards', true);
    }
}

    

    setupAnimations() {
 
    if (!this.anims.exists('walkbackwards')) {
        this.anims.create({
            key: 'walkbackwards',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
    }


    if (!this.anims.exists('walkforward')) {
        this.anims.create({
            key: 'walkforward',
            frames: this.anims.generateFrameNumbers('player', { start: 48, end: 53 }),
            frameRate: 10,
            repeat: -1
        });
    }


    if (!this.anims.exists('walkleft')) {
        this.anims.create({
            key: 'walkleft',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 20 }),
            frameRate: 10,
            repeat: -1
        });
    }

  
    if (!this.anims.exists('walkright')) {
        this.anims.create({
            key: 'walkright',
            frames: this.anims.generateFrameNumbers('player', { start: 32, end: 36 }),
            frameRate: 10,
            repeat: -1
        });
    }

   
    if (!this.anims.exists('attackbackwards')) {
        this.anims.create({
            key: 'attackbackwards',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: this.playerAttackSpeed,
            repeat: 0
        });
    }

    if (!this.anims.exists('attackright')) {
        this.anims.create({
            key: 'attackright',
            frames: this.anims.generateFrameNumbers('player', { start: 37, end: 40 }),
            frameRate: this.playerAttackSpeed,
            repeat: 0
        });
    }

    if (!this.anims.exists('attackleft')) {
        this.anims.create({
            key: 'attackleft',
            frames: this.anims.generateFrameNumbers('player', { start: 21, end: 24 }),
            frameRate: this.playerAttackSpeed,
            repeat: 0
        });
    }

    if (!this.anims.exists('attackforward')) {
        this.anims.create({
            key: 'attackforward',
            frames: this.anims.generateFrameNumbers('player', { start: 53, end: 56 }),
            frameRate: this.playerAttackSpeed,
            repeat: 0
        });
    }

    if (!this.anims.exists('enemyWalkBackwards')) {
        this.anims.create({
            key: 'enemyWalkBackwards',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }

    if (!this.anims.exists('enemyWalkForward')) {
        this.anims.create({
            key: 'enemyWalkForward',
            frames: this.anims.generateFrameNumbers('player', { start: 48, end: 55 }),
            frameRate: 10,
            repeat: -1
        });
    }

    if (!this.anims.exists('enemyWalkRight')) {
        this.anims.create({
            key: 'enemyWalkRight',
            frames: this.anims.generateFrameNumbers('player', { start: 32, end: 39 }),
            frameRate: 10,
            repeat: -1
        });
    }

 
    if (!this.anims.exists('enemyWalkLeft')) {
        this.anims.create({
            key: 'enemyWalkLeft',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
    }

   
    if (!this.anims.exists('enemyAttack')) {
        this.anims.create({
            key: 'enemyAttack',
            frames: this.anims.generateFrameNumbers('player', { start: 37, end: 40 }),
            frameRate: 10,
            repeat: -1
        });
    }

  
    if (!this.anims.exists('fireballAnim')) {
        this.anims.create({
            key: 'fireballAnim',
            frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    }

    if (!this.anims.exists('DarkAttackAnim')) {
        this.anims.create({
            key: 'DarkAttackAnim',
            frames: this.anims.generateFrameNumbers('DarkAttack1', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
    }

    if (!this.anims.exists('DarkAttackAnimHit')) {
        this.anims.create({
            key: 'DarkAttackAnimHit',
            frames: this.anims.generateFrameNumbers('DarkAttack1', { start: 10, end: 15}),
            frameRate: 100,
            repeat: 1
        });
    }

    if(!this.anims.exists('DarkBoltAttackAnim')){
        this.anims.create({
            key: 'DarkBoltAttackAnim',
            frames: this.anims.generateFrameNumbers('boltdark', { start: 0, end: 10 }),
            frameRate: 10,
            repeat: 0
        });
    }
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
            this.enemyHealth -= this.playerAttack;
            if (this.enemyHealth <= 0) {
                this.enemy.destroy();
                this.enemyHealthBar.destroy();
                this.spawnEnemy();
                this.increaseLightRadius();
                this.incrementKillCount();
                if (this.playerHealth + 10 < this.playerMaxHealth) {
                    this.playerHealth += this.healHeath;
                }
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

    flashMap(layer) {
        if (!this.mapVisible) {
            this.mapVisible = true;
    
            const originalLightRadius = this.lightRadius;
            this.lightRadius = this.cameras.main.width; 
            this.updateLightMask();
    
            this.time.delayedCall(1000, () => {
                this.lightRadius = originalLightRadius;
                this.updateLightMask();
                this.mapVisible = false;
            }, [], this);
        }
    }
    
    updateLightMask() {
        this.lightMask.clear();
        this.lightMask.fillStyle(0xffffff, 1);
        this.lightMask.fillCircle(this.player.x, this.player.y, this.lightRadius);
        const mask = this.darkness.createBitmapMask(this.lightMask);
        this.layer1.setMask(mask);
        this.player.setMask(mask);
    }
    

    shootFireball() {
    if (!this.canShootFireball) return;
    this.canShootFireball = false;
    this.fireballCooldownGraphic.setTint(0xff0000);

    const fireball = this.fireballs.get(this.player.x, this.player.y, 'fireball').setScale(2);
    fireball.anims.play('fireballAnim');

    fireball.fireballLightRadius = this.fireballLightRadius;
    fireball.fireballLightColor =  0xffa500;

    this.physics.add.overlap(fireball, this.enemy, this.hitEnemy, null, this);

    let velocityX = 0;
    let velocityY = 0;
    switch (this.direction) {
        case 'left':
            velocityX = -300;
            fireball.angle = 180;  
            break;
        case 'right':
            velocityX = 300;
            fireball.angle = 0;    
            break;
        case 'forward':
            velocityY = -300;
            fireball.angle = -90; 
            break;
        case 'backwards':
            velocityY = 300;
            fireball.angle = 90;   
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

    DarkAttack() {
        if (!this.canDarkAttack) return;
        this.canDarkAttack = false;
        this.darkAttacksCooldownTimeGraphic.setTint(0xff0000);
    
        const darkAttack = this.darkattacks.get(this.player.x, this.player.y, 'DarkAttack1').setScale(2);
        darkAttack.anims.play('DarkAttackAnim');
    
        this.physics.add.overlap(darkAttack, this.enemy, (darkAttack, enemy) => {
            darkAttack.anims.play('DarkAttackAnimHit');
            this.hitEnemy(darkAttack, enemy);
        }, null, this);
    
        let velocityX = 0;
        let velocityY = 0;
        switch (this.direction) {
            case 'left':
                velocityX = -300;
                darkAttack.angle = 180;  
                break;
            case 'right':
                velocityX = 300;
                darkAttack.angle = 0;    
                break;
            case 'forward':
                velocityY = -300;
                darkAttack.angle = -90; 
                break;
            case 'backwards':
                velocityY = 300;
                darkAttack.angle = 90;   
                break;
        }
        darkAttack.setVelocity(velocityX, velocityY);
        this.time.addEvent({
            delay: this.darkAttacksCooldownTime,
            callback: () => {
                this.canDarkAttack = true;
                this.darkAttacksCooldownTimeGraphic.clearTint();
            },
            callbackScope: this
        });
    }

    darkBoltAttack1() {

        if (!this.canDarkBoltAttack) return;
        this.canDarkBoltAttack = false;
        if (this.darkBoltAttackCooldownTimeGraphic)
        this.darkBoltAttackCooldownTimeGraphic.setTint(0xff0000);

        const darkBoltAttack = this.darkBoltAttacks.get(this.player.x, this.player.y, 'boltdark').setScale(2);
        darkBoltAttack.anims.play('DarkBoltAttackAnim');

        this.physics.add.collider(darkBoltAttack, this.enemy, (darkBoltAttack, enemy) => {
            this.hitEnemy2(darkBoltAttack, enemy);
        }, null, this);

        darkBoltAttack.on('animationcomplete', () => {
            darkBoltAttack.destroy(); 
        });

        this.time.addEvent({
            delay: this.darkBoltAttackCooldownTime,
            callback: () => {
                this.canDarkBoltAttack = true;
                this.darkBoltAttackCooldownTimeGraphic.clearTint();
            },
            callbackScope: this
        });
    }

    
    hitEnemy(attack, enemy) {
        attack.destroy();
        this.enemyHealth -= 100;
        if (this.enemyHealth <= 0) {
            this.enemy.destroy();
            this.enemyHealthBar.destroy();
            this.spawnEnemy();
            this.incrementKillCount();
            this.increaseLightRadius();
        }
    }

    hitEnemy2(attack, enemy) {

        if(!attack.anims.isPlaying){
        atacck.destroy();
        }

        this.enemyHealth -= 100;
        if (this.enemyHealth <= 0) {
            this.enemy.destroy();
            this.enemyHealthBar.destroy();
            this.spawnEnemy();
            this.incrementKillCount();
            this.increaseLightRadius(); 
        }
    }


    updatePlayerHealthBar() {
        const healthPercentage = this.playerHealth / this.playerMaxHealth;
        const newWidth = this.playerHealthBarBg.displayWidth * healthPercentage;
        this.playerHealthBar.displayWidth = newWidth;

        if(this.playerHealth <= 0){
            this.scene.start('GameOverScene');
        }
    }

    increaseLightRadius() {
        if (this.lightRadius < this.maxLightRadius) {
            this.lightRadius += 20; 
            if (this.lightRadius > this.maxLightRadius) {
                this.lightRadius = this.maxLightRadius;
            }
            this.lightMask.clear();
            this.lightMask.fillStyle(0xffffff, 1);
            this.lightMask.fillCircle(this.player.x, this.player.y, this.lightRadius);
        }
    }

    decreaseLightRadius() {
        if (this.lightRadius > this.minLightRadius) {
            this.lightRadius -= this.lightDecreaseRate;
            if (this.lightRadius < this.minLightRadius) {
                this.lightRadius = this.minLightRadius;
            }
            this.lightMask.clear();
            this.lightMask.fillStyle(0xffffff, 1);
            this.lightMask.fillCircle(this.player.x, this.player.y, this.lightRadius);
        }
    }

    incrementKillCount() {
        this.killCount += 1;
        if (this.killCount >= this.maxKills) {
            this.handleMaxKillsReached();
        }
    }

    handleMaxKillsReached() {
        console.log("Limite máximo de kills atingido!");
    
        const randomScene = Math.random();
    
        if (randomScene < 0.5) {
           
            this.scene.start('SkillSelectionScene', { selectedSkills: this.selectedSkills, selectedPowerUps: this.selectedPowerUps });
        } else {
            
            this.scene.start('PowerUpSelectionScene', { selectedSkills: this.selectedSkills, selectedPowerUps: this.selectedPowerUps });
        }
    }
    
}