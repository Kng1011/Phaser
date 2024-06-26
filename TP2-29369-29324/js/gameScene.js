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
        this.darkAttackDamage = 0;
        this.fireballs = null;
        this.canShootFireball = true;
        this.fireballCooldownTime = 2000; 
        this.fireballCooldownGraphic = null;
        this.fireballDamage = 0;
        this.darkBoltAttack = null;
        this.canDarkBoltAttack = true;
        this.darkBoltAttackDamage = 0;
        this.darkBoltAttackCooldownTime = 8000;
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
        this.lightDecreaseRate = 5; 
        this.maxLightRadius = 200; 
        this.fireballLightMask = null;
        this.fireballLightRadius = 50;
        this.killCount = 0;
        this.maxKills = 10 ;
        this.mapVisible = false;
        this.layer1 = null;
        this.lightFlash = null;

        this.enemies = [];
        this.enemiesGroup = null;
        this.enemyType = null;
        
        this.skillFrames = [];
        this.selectedSkills = [];
        this.selectedPowerUps = [];
        this.level = 0;
        this.mask2 = null;
        this.numberOfEnemies = 0;
        this.enemiesOnField = 0;

        this.enemiesGroupOnField = null;
        this.maxKillsReached = false;
        this.pauseKey = null;

        this.playerAttributes = {
            playerSpeed: 0,
            playerAttack: 0,
            playerAttackSpeed: 0,
            playerHealth: 0,
            playerMaxHealth: 0,
            selectedSkills: [],
            selectedPowerUps: []
        };
        
        this.elapsedTime = 0;
        this.highScore = 0;
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
        this.load.spritesheet('boss', 'assets/BossEnemyWalk.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('bossAttack', 'assets/BossEnemySwipe.png', { frameWidth: 64, frameHeight: 64 });
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
        this.maxKills += this.level * 5;
        console.log(this.selectedSkills);
        console.log(this.selectedPowerUps);
        this.numberOfEnemies = (this.level % 5 === 0) ? 1 : this.level + 1;
        this.enemiesOnField = 0;
        this.maxKillsReached = false;
        this.highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0 ;

        console.log("Numero de inimigos:" + this.numberOfEnemies);
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'tiles');
        this.layer1 = map.createLayer('Camada de Blocos 1', tileset);

        this.setupAnimations();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


        this.selectedSkills.forEach(skill => {
            switch (skill.skillKey) {
                case 'fireball':
                    this.fireballKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
                    break;
                case 'darkAttack':
                    this.darkAttackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
                    break;
                case 'flash':
                    this.mapFlashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
                    break;
                case 'darkBoltAttack':
                    this.darkBoltAttackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
                    break;
            }
        });

        this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);

        this.player = this.physics.add.sprite(400, 300, 'player').setScale(2);

        this.player.setCollideWorldBounds(true);

        this.enemies = [
            {
                key: 'zombie',
                health: 100,
                attack: 5,
                speed: 70,
                attackSpeed: 1000,
                attackRange: 25
            },
            {
                key: 'troll',
                health: 150,
                attack: 7,
                speed: 70,
                attackSpeed: 1500,
                attackRange: 30
            },
            {
                key: 'skeleton',
                health: 50,
                attack: 3,
                speed: 90,
                attackSpeed: 2000,
                attackRange: 20
            },
            {
                key: 'boss',
                health: 10000,
                attack: 12,
                speed: 100,
                attackSpeed: 3000,
                attackRange: 30
            }
        ]

       
        const filteredEnemies = this.enemies.filter(enemy => enemy.key !== 'boss');

        const randomIndex = Math.floor(Math.random() * filteredEnemies.length);
        this.enemyType = filteredEnemies[randomIndex];

        if (this.level % 5 === 0 && this.enemiesOnField === 0 && this.level !== 0) {
            this.enemyType = this.enemies.find(enemy => enemy.key === 'boss');
        }

        this.enemiesGroup = this.physics.add.group({
            defaultKey: this.enemyType.key,
            maxSize: 100
        });
        this.enemiesGroupOnField = this.add.group();

        this.darkness = this.make.graphics();
        this.darkness.fillStyle(0x000000, 1);
        this.darkness.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.darkness.setAlpha(0.9);

        this.lightMask = this.make.graphics();
        this.lightMask.fillStyle(0xffffff, 1);
        this.lightMask.fillCircle(0, 0, this.lightRadius);
        this.lightMask.setBlendMode(Phaser.BlendModes.ERASE);

        const mask = this.darkness.createBitmapMask(this.lightMask);
        this.mask2 = this.darkness.createBitmapMask(this.lightMask);
        this.layer1.setMask(mask);
        this.player.setMask(mask);
        
       
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };


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
            if (skill.skillKey === 'fireball') {
                this.addSkillFrame(baseX + index * frameOffset, baseY, 'fireball');
            } else if (skill.skillKey === 'darkAttack') {
                this.addSkillFrame(baseX + index * frameOffset, baseY, 'DarkAttack1');
            } else if (skill.skillKey === 'flash') {
                this.addSkillFrame(baseX + index * frameOffset, baseY, 'flash');
            } else if (skill.skillKey === 'darkBoltAttack') {
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
            font: '40px Chiller',
            fill: '#ffffff',
        }).setOrigin(1, 0);

  

        this.lightFlash = this.add.graphics();
        this.lightFlash.fillStyle(0xffffe0, 1);
        this.lightFlash.setAlpha(0);

        this.selectedPowerUps.forEach(powerUp => {
            this.applyPowerUp(powerUp.powerUpKey, powerUp.number);
        });

        //this.physics.world.createDebugGraphic();

        this.time.addEvent({
            delay: 1000,
            callback: this.updateElapsedTime,
            callbackScope: this,
            loop: true
        });
    }

    updateElapsedTime() {
        this.elapsedTime++;
    }

    updatePlayerAtributes() {
        this.playerAttributes.playerSpeed = this.playerSpeed;
        this.playerAttributes.playerAttack = this.playerAttack;
        this.playerAttributes.playerAttackSpeed = this.playerAttackSpeed;
        this.playerAttributes.playerHealth = this.playerHealth;
        this.playerAttributes.playerMaxHealth = this.playerMaxHealth;
        this.playerAttributes.selectedSkills = this.selectedSkills;
        this.playerAttributes.selectedPowerUps = this.selectedPowerUps;
    }

    applyPowerUp(powerUp, number) {
        if (powerUp === 'health') {
            this.playerMaxHealth = 150;
            this.playerHealth = 150;    
            
            if (number > 0){
                this.playerHealth = this.playerHealth + (20 *number);
            }
        } else if (powerUp === 'attack') {  
            this.playerAttack = 55;

            if (number > 0){
                this.playerAttack = this.playerAttack + (3 * number);
            }

        } else if (powerUp === 'speed') {
            this.playerSpeed = 300;

            if (number > 0){
                this.playerSpeed = this.playerSpeed + (5 * number);
            }
        } else if (powerUp === 'attackSpeed') {
            this.playerAttackSpeed = 20;

            if (number > 0){
                this.playerAttackSpeed = this.playerAttackSpeed + (2 * number);
            }
        } else if (powerUp === 'cooldownReduction') {
            this.fireballCooldownTime = 1000;
            this.darkAttacksCooldownTime = 2000;
            this.darkBoltAttackCooldownTime = 4000;

            if (number > 0){
                this.fireballCooldownTime = this.fireballCooldownTime - (50 * number);
                this.darkAttacksCooldownTime = this.darkAttacksCooldownTime - (50 * number);
                this.darkBoltAttackCooldownTime = this.darkBoltAttackCooldownTime - (50 * number);
            }

        } else if (powerUp === 'healOnKill') {
            this.healHeath = 10;

            if (number > 0){
                this.healHeath = this.healHeath + (2 *number);
            }

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
            if (!attack) this.player.anims.play('walkleft', true);
            this.direction = 'left';
            isMoving = true;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            if (!attack) this.player.anims.play('walkright', true);
            this.direction = 'right';
            isMoving = true;
        }
    
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
            if (!attack) this.player.anims.play('walkforward', true);
            this.direction = 'forward';
            isMoving = true;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
            if (!attack) this.player.anims.play('walkbackwards', true);
            this.direction = 'backwards';
            isMoving = true;
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            attack = true;
            this.player.anims.play('attack' + this.direction.toLowerCase(), true);
            this.enemiesGroupOnField.children.iterate((enemy) => {
                if (enemy && enemy.active) {
                    this.dealDamage(enemy);  
                }
            });
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.scene.pause();
            this.scene.launch('PauseScene', { playerAttributes: this.playerAttributes });
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
    
        this.enemiesGroupOnField.children.iterate((enemy) => {
            if (enemy && enemy.active) {
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        
                if (distance < enemy.attackRange) {
                    enemy.setVelocity(0, 0);
        
                    if (enemy.key !== 'boss') {
                        if (enemy.anims.currentAnim && enemy.anims.currentAnim.key !== enemy.key + 'Attack') {
                            enemy.anims.play(enemy.key + 'Attack', true);
                            enemy.isAttacking = true;
                        }
                    } else {
                        let bossAttackAnimationKey;
                        switch (this.direction) {
                            case 'left':
                                bossAttackAnimationKey = 'bossAttackLeft';
                                break;
                            case 'right':
                                bossAttackAnimationKey = 'bossAttackRight';
                                break;
                            case 'forward':
                                bossAttackAnimationKey = 'bossAttackForward';
                                break;
                            case 'backwards':
                                bossAttackAnimationKey = 'bossAttackBackwards';
                                break;
                        }
        
                        if (enemy.anims.currentAnim && enemy.anims.currentAnim.key !== bossAttackAnimationKey) {
                            enemy.anims.play(bossAttackAnimationKey, true);
                            enemy.isAttacking = true;
                        }
                    }
        
                    if (enemy.isAttacking && enemy.anims.currentFrame && enemy.anims.currentFrame.isLast) {
                        if (!enemy.hasAttacked) {
                            this.applyDamageToPlayer(enemy);
                            enemy.hasAttacked = true;
                        }
                    } else {
                        enemy.hasAttacked = false;
                    }
                } else {
                    this.physics.moveToObject(enemy, this.player, enemy.speed);
                    this.updateEnemyAnimation(enemy.body.velocity, enemy);
                }
        
                this.updateEnemyHealthBar(enemy);
            }
        });
        
    
        if (this.enemiesOnField < this.numberOfEnemies) {
            this.spawnEnemy(this.enemyType.key);
        }
        
        this.updatePlayerAtributes();
        this.TimeOver();
        if(this.level % 5 === 0 && this.level !== 0){
            this.killCountText.setText(`Kills: ${this.killCount} /1`);
            this.lightRadius = 200;
        } else {
            this.killCountText.setText(`Kills: ${this.killCount} / ${this.maxKills}`);
        }
    
    }
    
    

    applyDamageToPlayer(enemy) {
        if (this.playerHealth > 0) {
            this.playerHealth -= enemy.attack;
            this.updatePlayerHealthBar();
        }
    }

    updateEnemyAnimation(velocity, enemy) {
        if (this.direction === 'right') {
            enemy.anims.play(enemy.key + 'WalkRight', true);
        } else if (this.direction === 'left') {
            enemy.anims.play(enemy.key + 'WalkLeft', true);
        }
    
        if (this.direction === 'backwards') {
            enemy.anims.play(enemy.key + 'WalkBackwards', true);
        } else if (this.direction === 'forward') {
            enemy.anims.play(enemy.key + 'WalkForward', true);
        }
    
        if (velocity.x === 0 && velocity.y === 0) {
            enemy.anims.stop();
        }
    }   
    
      

    setupEnemyAnimation(enemyType) {
        switch (enemyType) {
            case 'zombie':
                this.setupZombieAnimations();
                break;
            case 'troll':
                this.setupTrollAnimations();
                break;
            case 'skeleton':
                this.setupSkeletonAnimations();
                break;
            case 'boss':
                this.setupBossAnimations();
                break;
            default:
                return;
        }
    }

    setupBossAnimations() {
        if (!this.anims.exists('bossWalkBackwards')) {
            this.anims.create({
                key: 'bossWalkBackwards',
                frames: this.anims.generateFrameNumbers('boss', { start: 30, end: 39 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('bossWalkForward')) {
            this.anims.create({
                key: 'bossWalkForward',
                frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('bossWalkRight')) {
            this.anims.create({
                key: 'bossWalkRight',
                frames: this.anims.generateFrameNumbers('boss', { start: 20, end: 29 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('bossWalkLeft')) {
            this.anims.create({
                key: 'bossWalkLeft',
                frames: this.anims.generateFrameNumbers('boss', { start: 10, end: 19 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('bossAttackBackwards')) {
            this.anims.create({
                key: 'bossAttackBackwards',
                frames: this.anims.generateFrameNumbers('bossAttack', { start: 30, end: 39 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('bossAttackForward')) {
            this.anims.create({
                key: 'bossAttackForward',
                frames: this.anims.generateFrameNumbers('bossAttack', { start: 0, end: 9 }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists('bossAttackRight')) {
            this.anims.create({
                key: 'bossAttackRight',
                frames: this.anims.generateFrameNumbers('bossAttack', { start: 20, end: 29 }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists('bossAttackLeft')) {
            this.anims.create({
                key: 'bossAttackLeft',
                frames: this.anims.generateFrameNumbers('bossAttack', { start: 10, end: 19 }),
                frameRate: 5,
                repeat: -1
            });
        }

    }
    
    setupZombieAnimations() {
        if (!this.anims.exists('zombieWalkBackwards')) {
            this.anims.create({
                key: 'zombieWalkBackwards',
                frames: this.anims.generateFrameNumbers('zombie', { start: 6, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('zombieWalkForward')) {
            this.anims.create({
                key: 'zombieWalkForward',
                frames: this.anims.generateFrameNumbers('zombie', { start: 0, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('zombieWalkRight')) {
            this.anims.create({
                key: 'zombieWalkRight',
                frames: this.anims.generateFrameNumbers('zombie', { start: 8, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('zombieWalkLeft')) {
            this.anims.create({
                key: 'zombieWalkLeft',
                frames: this.anims.generateFrameNumbers('zombie', { start: 8, end: 9 }),
                frameRate: 10,
                repeat: -1,
                yoyo: true // Inverte a animação
            });
        }
    
        if (!this.anims.exists('zombieAttack')) {
            this.anims.create({
                key: 'zombieAttack',
                frames: this.anims.generateFrameNumbers('zombie', { start: 12, end: 13 }),
                frameRate: 5,
                repeat: -1
            });
        }
    }
    
    setupTrollAnimations() {
        if (!this.anims.exists('trollWalkBackwards')) {
            this.anims.create({
                key: 'trollWalkBackwards',
                frames: this.anims.generateFrameNumbers('troll', { start: 8, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('trollWalkForward')) {
            this.anims.create({
                key: 'trollWalkForward',
                frames: this.anims.generateFrameNumbers('troll', { start: 12, end: 13 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('trollWalkRight')) {
            this.anims.create({
                key: 'trollWalkRight',
                frames: this.anims.generateFrameNumbers('troll', { start: 14, end: 15 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('trollWalkLeft')) {
            this.anims.create({
                key: 'trollWalkLeft',
                frames: this.anims.generateFrameNumbers('troll', { start: 14, end: 15 }),
                frameRate: 10,
                repeat: -1,
                yoyo: true 
            });
        }
    
        if (!this.anims.exists('trollAttack')) {
            this.anims.create({
                key: 'trollAttack',
                frames: this.anims.generateFrameNumbers('troll', { start: 16, end: 17 }),
                frameRate: 5,
                repeat: -1
            });
        }
    }
    
    setupSkeletonAnimations() {
        if (!this.anims.exists('skeletonWalkBackwards')) {
            this.anims.create({
                key: 'skeletonWalkBackwards',
                frames: this.anims.generateFrameNumbers('skeleton', { start: 6, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('skeletonWalkForward')) {
            this.anims.create({
                key: 'skeletonWalkForward',
                frames: this.anims.generateFrameNumbers('skeleton', { start: 10, end: 11 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('skeletonWalkRight')) {
            this.anims.create({
                key: 'skeletonWalkRight',
                frames: this.anims.generateFrameNumbers('skeleton', { start: 8, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('skeletonWalkLeft')) {
            this.anims.create({
                key: 'skeletonWalkLeft',
                frames: this.anims.generateFrameNumbers('skeleton', { start: 8, end: 9 }),
                frameRate: 10,
                repeat: -1,
                yoyo: true 
            });
        }
    
        if (!this.anims.exists('skeletonAttack')) {
            this.anims.create({
                key: 'skeletonAttack',
                frames: this.anims.generateFrameNumbers('skeleton', { start: 12, end: 13 }),
                frameRate: 5,
                repeat: -1
            });
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

spawnEnemy(enemyTypeKey) {
   
    const randomX = Phaser.Math.Between(50, this.cameras.main.width - 50);
    const randomY = Phaser.Math.Between(50, this.cameras.main.height - 50);
    const newEnemy = this.enemiesGroup.get(randomX, randomY, enemyTypeKey, false, true); 

    if (!newEnemy) {
        console.error('Falha ao gerar novo inimigo:', enemyTypeKey);
        return;
    }
    
    newEnemy.setScale(2);
    newEnemy.setPosition(randomX, randomY);
    newEnemy.health = this.enemyType.health * (1 + 0.05 * this.level);
    newEnemy.speed = this.enemyType.speed * (1 + 0.05 * this.level);
    newEnemy.attack = this.enemyType.attack * (1 + 0.05 * this.level);
    newEnemy.attackSpeed = this.enemyType.attackSpeed;
    newEnemy.attackRange = this.enemyType.attackRange;
    newEnemy.key = enemyTypeKey;
    newEnemy.healthBar = this.add.graphics();
    newEnemy.setMask(this.mask2);
    newEnemy.healthBar.setMask(this.mask2);
    newEnemy.setActive(true).setVisible(true);

    this.setupEnemyAnimation(newEnemy.key);
    this.enemiesGroupOnField.add(newEnemy);
    this.enemiesOnField++;
    console.log(newEnemy.health);
}

    activateEnemies() {
        this.enemiesGroupOnField.children.iterate(function (enemy) {
            enemy.setActive(true).setVisible(true).setRandomPosition(0, 0, this.cameras.main.width, this.cameras.main.height);
        }, this);
    }


    dealDamage(enemy) {
        if (enemy && Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < enemy.attackRange) {
            enemy.health -= this.playerAttack;
            if (enemy.health <= 0) {
                if (enemy.healthBar) {
                    enemy.healthBar.destroy();
                }
                this.dropPowerUp(enemy);
                enemy.destroy();
                this.enemiesOnField--;
                this.spawnEnemy(this.enemyType.key);
                this.increaseLightRadius(); 
                this.incrementKillCount();
                if (this.playerHealth + 10 < this.playerMaxHealth) {
                    this.playerHealth += this.healHeath;
                }
            }
            this.updateEnemyHealthBar(enemy);
        }
    }

    dropPowerUp(enemy) {
        const random = Math.random();
        if (random < 0.1) {
            const powerUps = ['health', 'attack', 'speed', 'attackSpeed', 'cooldownReduction', 'healOnKill'];
            const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
      
            this.selectedPowerUps.forEach(powerUp => {
                if (powerUp.powerUpKey === randomPowerUp) {
                    powerUp.number++;
                    this.applyPowerUp(powerUp.key, powerUp.number);
                }

            });
           
        }
    }

    updateEnemyHealthBar(enemy) {
        if (enemy && enemy.healthBar) {
            enemy.healthBar.clear();
            enemy.healthBar.fillStyle(0xff0000, 1);
            const healthPercent = enemy.health / this.enemyType.health;
            const barWidth = 64 * healthPercent;
            enemy.healthBar.fillRect(enemy.x - 32, enemy.y - 40, barWidth, 10);
            enemy.healthBar.setDepth(11);
        }
    }
    
    flashMap(layer) {
        if (!this.mapVisible) {
            this.mapVisible = true; this.lightFlash.clear();


            this.lightFlash.fillStyle(0xffffe0, 1);
            this.lightFlash.setAlpha(1);
            this.lightFlash.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

            this.time.delayedCall(200, () => {
                this.lightFlash.setAlpha(0);
            }, [], this);

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
        fireball.body.setSize(32, 32);
        fireball.body.setOffset((fireball.width - 32) / 2, (fireball.height - 32) / 2);
    
        fireball.anims.play('fireballAnim');

        this.selectedSkills.forEach(skill => {
            if (skill.skillKey === 'fireball' && skill.proficiency <=100) {
                skill.proficiency++;
                skill.damage = 100 * (1 + skill.proficiency/100) ;
                this.fireballDamage = skill.damage;
            }
        });

        fireball.fireballLightRadius = this.fireballLightRadius;
        fireball.fireballLightColor = 0xffa500;

        this.physics.add.overlap(fireball, this.enemiesGroupOnField, (fireball, enemy) => {
            this.hitEnemy(fireball, enemy);
        }, null, this);
    
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
        console.log("Dano: " + this.darkAttackDamage);
        this.canDarkAttack = false;
        this.darkAttacksCooldownTimeGraphic.setTint(0xff0000);
    
        const darkAttack = this.darkattacks.get(this.player.x, this.player.y, 'DarkAttack1').setScale(2);
        darkAttack.anims.play('DarkAttackAnim');

        this.selectedSkills.forEach(skill => {
            if (skill.skillKey === 'darkAttack' && skill.proficiency <=100) {
                skill.proficiency++;
                skill.damage = 120 * (1 + skill.proficiency/100) ;
                this.darkAttackDamage = skill.damage;
            }
        });
    
        this.physics.add.overlap(darkAttack, this.enemiesGroupOnField, (darkAttack, enemy) => {
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
    
        const numBolts = 8;
        const radius = 100;
    
        this.selectedSkills.forEach(skill => {
            if (skill.skillKey === 'darkBoltAttack' && skill.proficiency <= 100) {
                skill.proficiency++;
                skill.damage = 150 * (1 + skill.proficiency / 100);
                this.darkBoltAttackDamage = skill.damage;
            }
        });
    
        for (let i = 0; i < numBolts; i++) {
            const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
            const posX = this.player.x + radius * Math.cos(angle);
            const posY = this.player.y + radius * Math.sin(angle);
    
            const darkBoltAttack = this.darkBoltAttacks.create(posX, posY, 'boltdark').setScale(2);
            darkBoltAttack.anims.play('DarkBoltAttackAnim');
    
            this.physics.add.collider(darkBoltAttack, this.enemiesGroupOnField, (darkBoltAttack, enemy) => {
                this.hitEnemyWithDarkBolt(darkBoltAttack, enemy);
            }, null, this);
    
            darkBoltAttack.on('animationcomplete', () => {
                darkBoltAttack.destroy();
            });
        }
    
        this.time.addEvent({
            delay: this.darkBoltAttackCooldownTime,
            callback: () => {
                this.canDarkBoltAttack = true;
                if (this.darkBoltAttackCooldownTimeGraphic)
                    this.darkBoltAttackCooldownTimeGraphic.clearTint();
            },
            callbackScope: this
        });
    }

    hitEnemyWithDarkBolt(attack, enemy) {
        if (attack && !attack.anims.isPlaying) {
            attack.destroy();
        }
        if (enemy && enemy.active) {
            enemy.health -= this.darkBoltAttackDamage;
            this.updateEnemyHealthBar(enemy);
            if (enemy.health <= 0) {
                this.destroyEnemy(enemy);
            }
        }
    }
    
    
    hitEnemy(attack, enemy) {
        if (attack) {
            attack.destroy();
        }
        if (enemy) {
            if (attack.texture.key === 'fireball') {
                enemy.health -= this.fireballDamage;
            } else if (attack.texture.key === 'DarkAttack1') {
                enemy.health -= this.darkAttackDamage;
            }
            this.updateEnemyHealthBar(enemy); 
            if (enemy.health <= 0) {
                this.destroyEnemy(enemy);
                if (this.playerHealth + 10 < this.playerMaxHealth) {
                    this.playerHealth += this.healHeath;
                }
            }
        }
    }

    destroyEnemy(enemy) {
        if (enemy.healthBar) {
            enemy.healthBar.destroy();
        }
        this.dropPowerUp(enemy);
        enemy.destroy(); 
        this.enemiesOnField--;
        this.spawnEnemy(this.enemyType.key);
        this.incrementKillCount();
        this.increaseLightRadius();
    }
    
    hitEnemy2(attack, enemy) {
        if (attack && !attack.anims.isPlaying) {
            attack.destroy();
        }
        if (enemy) {
            enemy.health -= this.darkBoltAttackDamage;
            if (enemy.health <= 0) {
                if (enemy.healthBar) {
                    enemy.healthBar.destroy();
                }
                enemy.destroy();
                this.enemiesOnField--;
                this.spawnEnemy(this.enemyType.key);
                this.incrementKillCount();
                this.increaseLightRadius();
                if (this.playerHealth + 10 < this.playerMaxHealth) {
                    this.playerHealth += this.healHeath;
                }
            }
        }
    }
    
    updatePlayerHealthBar() {
        const healthPercentage = this.playerHealth / this.playerMaxHealth;
        const newWidth = this.playerHealthBarBg.displayWidth * healthPercentage;
        this.playerHealthBar.displayWidth = newWidth;

        if(this.playerHealth <= 0){
            if (this.elapsedTime > this.highScore) {
                this.highScore = this.elapsedTime;
                console.log(this.highScore);
                localStorage.setItem('highScore', this.highScore); 
            }
    
            this.scene.start('GameOverScene', { score: this.elapsedTime, highScore: this.highScore });
            this.selectedSkills = [];
            this.selectedPowerUps = [];
            this.playerAttributes = {};
            this.level = 0;
            this.elapsedTime = 0
            this.numberOfEnemies = 0;
        }
        console.log(this.playerHealth);
    }

    increaseLightRadius() {
        if (this.lightRadius < this.maxLightRadius) {
            this.lightRadius += 30; 
            if (this.lightRadius > this.maxLightRadius) {
                this.lightRadius = this.maxLightRadius;
            }
            this.lightMask.clear();
            this.lightMask.fillStyle(0xffffff, 1);
            this.lightMask.fillCircle(this.player.x, this.player.y, this.lightRadius);
        }
    }

    decreaseLightRadius() {

        this.lightRadius -= this.lightDecreaseRate;
        this.lightMask.clear();
        this.lightMask.fillStyle(0xffffff, 1);
        this.lightMask.fillCircle(this.player.x, this.player.y, this.lightRadius);
        
    }

    incrementKillCount() {
        this.killCount += 1;
        if (this.killCount >= this.maxKills && !this.maxKillsReached) {
            this.handleMaxKillsReached();
        }
    
        if (this.level % 5 === 0 && this.killCount === 1 && this.level !== 0) {
            this.handleMaxKillsReached();
        }
    }

    handleMaxKillsReached() {
        if (this.maxKillsReached) {
            return; 
        }
    
        this.maxKillsReached = true; 
    
        console.log("Limite máximo de kills atingido!");
    
        const randomScene = Math.random();
        this.level += 1;
    
        if (randomScene < 0.5 && this.selectedSkills.length < 4) {
            this.scene.start('SkillSelectionScene', { selectedSkills: this.selectedSkills, selectedPowerUps: this.selectedPowerUps, level: this.level });
        } else if(randomScene >= 0.5 && this.selectedPowerUps.length < 6) {
            this.scene.start('PowerUpSelectionScene', { selectedSkills: this.selectedSkills, selectedPowerUps: this.selectedPowerUps, level: this.level });
        } else {
            this.scene.start('GameScene', { selectedSkills: this.selectedSkills, selectedPowerUps: this.selectedPowerUps, level: this.level });
        }
    }

    TimeOver() {
        if(this.lightRadius == 0){
            if (this.elapsedTime > this.highScore) {
                this.highScore = this.elapsedTime;
                localStorage.setItem('highScore', this.highScore); 
            }
    
            this.scene.start('GameOverScene', { score: this.elapsedTime, highScore: this.highScore });
            this.level = 0;
        }
        
    }
    
}