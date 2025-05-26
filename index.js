import { bodyUpgradeMap,celestialBodyUpgradeMap,weaponUpgradeMap,celestialWeaponUpgradeMap,bodyupgrades,weaponupgrades,bodyColors } from "./tankUpgrades.js";
        // Canvas setup
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const hcanvas = document.getElementById('homeScreen');
        const hctx = hcanvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const mapSizeElement = document.getElementById('mapSize');
        const botnumberElement = document.getElementById('botnumber');
        const shapenumberElement = document.getElementById('shapenumber');
        const dimensionElement = document.getElementById('dimension');
        const drawnentitiesElement = document.getElementById('drawnEntities');
        const changelogPreview = document.getElementById('changelogPreview');
        const subtitle = document.getElementById('subtitle');
        const fullchangelog = document.getElementById('full-changelog');
        const settings = document.getElementById('full-settings');
        const gamemodeTitle = document.getElementById('gamemodeTitle');
        const gamemodeTitleAnimation = document.getElementById('gamemodeTitleAnimation');//for animating purposes
        const regionTitle = document.getElementById('regionTitle');
        const oval = document.getElementById('ovalAnimation');//also for the animation
        const clientTickDiv = document.getElementById('clienttick');
        const signupdiv = document.getElementById('not-signed-in-text');
        const playButton = document.getElementById("playButton");
        const nameInput = document.getElementById("display-name-input");
        const quickchat = document.getElementById("quickchat");
        const darken = document.getElementById('blackScreen');
        document.getElementById('exit-changelog').addEventListener("click", () => {
          //fullchangelog.style.display = "none";
          closePopupFunction(fullchangelog,document.getElementById("changelogtextdiv"));
        });
        //add a way to track settings changes later on
        document.getElementById('exit-settings-apply').addEventListener("click", () => {
          //settings.style.display = "none";
          closePopupFunction(settings,document.getElementById("settingstextdiv"));
          applySettings();
        });
        document.getElementById('exit-settings-cancel').addEventListener("click", () => {
          closePopupFunction(settings,document.getElementById("settingstextdiv"));
          cancelSettings();
        });
        export function openSettings(){
          settings.style.display = "block";
        }
        export function togglePasswordVisibility() {
          let x = document.getElementById("loginpw");
          if (x.type === "password") {
            x.type = "text";
          } else {
            x.type = "password";
          }
          x = document.getElementById("signuppw");
          if (x.type === "password") {
            x.type = "text";
          } else {
            x.type = "password";
          }
          x = document.getElementById("confirmpw");
          if (x.type === "password") {
            x.type = "text";
          } else {
            x.type = "password";
          }
        }
        export function checkPw(){//triggers when input box blurred (when user clicks outside the input box), checks if the password and confirm password are the same
          let f = document.getElementById("signuppw");
          let x = document.getElementById("confirmpw");
          let c = document.getElementById("pwWrong");
          if (f.value != x.value){
            x.style.borderColor = "#f44c54";//make border red
            c.style.display = "block";
          }
          else{
            x.style.borderColor = "black";
            c.style.display = "none";
          }
        }
        export function login(){
          document.getElementById("loginLoading").style.display = "block";
          //send log in request to server
        }
        export function signup(){
          document.getElementById("signupLoading").style.display = "block";
          //send sign up request to server
        }
        document.getElementById('loginButton').addEventListener("click", () => {
          document.getElementById("login").style.display = "block";
          darken.style.display = "block";
        });
        document.getElementById('signupButton').addEventListener("click", () => {
          document.getElementById("signup").style.display = "block";
          darken.style.display = "block";
        });

        // Set canvas to window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        hcanvas.width = window.innerWidth;
        hcanvas.height = window.innerHeight;

        // Game variables
        let score = 0;
        let fov = 1;
        let fovscale = 1;//the amount for canvas to scale, NOT same as FOV, e.g. if fov is 2, then fov scale is 1/2
        let fovAnimation = 1;//slowly change this value to the actual fov value to create nice zooming effect
        let maxshade = 0.3;//whitening effect when objects get hit
        let spawnprotectionShade = 0.1;
        let players = [];//for pve this will be the actual player obj, for oher multiplayer, this is the leaderboard
        const bullets = [];
        const enemies = [];
        const particles = [];
        const shapes = [];
        let MAX_SHAPES = 50;
        let MAX_BOTS = 10;
        let shapeID = 0;
        let botID = 0;
        const gamemodeList = ["PvE arena","Free For All","2 Teams","4 Teams","Tank Editor"];//DO NOT CHANGE THE ORDER AND THE NAMES
        const gamemodeColorsLight = ["#D82BCF","#F04F54","#BE7FF5","#00E06C","#00B0E1"];
        const gamemodeColors = ["#BA0DB1","#D23136","#A061D7","#00C24E","#0092C3"];//for home screen
        const serverLocations = ["local","Sweden","Sweden","Sweden","Sweden"]
        let currentGamemodeID = 0;//PvE
        let gamemode = gamemodeList[currentGamemodeID];
        document.getElementById('gamemodeSelector').style.backgroundColor = gamemodeColors[currentGamemodeID];
        document.getElementById('gamemodeSelectorLighterColor').style.backgroundColor = gamemodeColorsLight[currentGamemodeID];
        //document.getElementById('gamemodeSelector').style.backgroundImage = "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, " + gamemodeColorsLight[currentGamemodeID] + " 51%)";
        gamemodeTitle.textContent = gamemode;
        regionTitle.textContent = serverLocations[currentGamemodeID];
        if (currentGamemodeID == 0){//no connecting required for PvE
          document.getElementById('connecting').style.display = "none";
          playButton.style.display = "block";
          nameInput.style.display = "block";
        }
        const keys = {};

        //add buttons to the list (when you click the gamemode name, the buttons will appear)
        const gamemodebuttonList = document.getElementById("manualButtonList");
        for (const i in gamemodeList){
          let div = document.createElement('div');
          div.classList.add('manualButtonServers');
          div.style.backgroundColor = gamemodeColors[i];
          let divtext = document.createElement('div');
          divtext.classList.add('manualButtonText');
          divtext.textContent = gamemodeList[i];
          let divLighterColor = document.createElement('div');
          divLighterColor.classList.add('manualButtonLighterColor');
          divLighterColor.style.backgroundColor = gamemodeColorsLight[i];
          div.appendChild(divLighterColor);//add the lighter color first! (affects relative positioning)
          div.appendChild(divtext);
          gamemodebuttonList.appendChild(div);
          div.onclick = changeGamemode(i);
          div.setAttribute("onclick", "changeGamemode("+i+")");
        }
        gamemodebuttonList.style.display = "none";//hide the button list
        document.getElementById('gamemodeTitle').addEventListener("click", () => {
          gamemodebuttonList.style.display = "flex";
        });
      
        //function for changing gamemode on home screen
        export function changeGamemode(type) {
          if (gamemodeTitle.classList.contains("animateNext")||gamemodeTitle.classList.contains("animateNext")||oval.classList.contains("left")||oval.classList.contains("right")) return;//dont do anything if it is currently animating (might break the current animation)
          let previousGamemodeID = currentGamemodeID;
          if (type == "n"){//next gamemode
            currentGamemodeID++;
            if (currentGamemodeID >= gamemodeList.length){
              currentGamemodeID = 0;
            }
          }
          else if (type == "p"){//previous gamemode
            currentGamemodeID--;
            if (currentGamemodeID < 0){
              currentGamemodeID = (gamemodeList.length - 1);
            }
          }
          else{//using manual button list, directly change to specific gamemode
            currentGamemodeID = type;
            gamemodebuttonList.style.display = "none";
          }
          gamemode = gamemodeList[currentGamemodeID];
          document.getElementById('gamemodeSelector').style.backgroundColor = gamemodeColors[currentGamemodeID];
          document.getElementById('gamemodeSelectorLighterColor').style.backgroundColor = gamemodeColorsLight[currentGamemodeID];
          //gamemodeTitle.textContent = gamemode;//dont change immediately, only after animation
          gamemodeTitleAnimation.textContent = gamemode;
          regionTitle.textContent = serverLocations[currentGamemodeID];
          setTimeout(function(){ drawingGamemode = currentGamemodeID;zoom = animationZoomValue; }, 400);//change gamemode drawing on home screen 0.4 seconds later (when black oval is 1/3 across the screen) + reset zoom animation
          if (type == "n"){
            gamemodeTitle.classList.toggle('animateNext');
            gamemodeTitleAnimation.classList.toggle('animateNext');
            oval.classList.toggle('left');//animate it (the big chonky oval that yeets across your screen)
          }
          else{
            gamemodeTitle.classList.toggle('animatePrev');
            gamemodeTitleAnimation.classList.toggle('animatePrev');
            oval.classList.toggle('right');
          }
          if (currentGamemodeID != 0){//not PvE, so need to connect to server
            //remove player button and name input, put connecting...
            playButton.style.display = "none";
            nameInput.style.display = "none";
            document.getElementById('connecting').style.display = "block";
            if (previousGamemodeID != 0){//if previous gamemode wasnt PvE, then need to disconnect from the server
              socket.close();//disconnect from current server
            }
            connected = "no";
            connectServer(serverlist[gamemode],"no")
            console.log("Connecting to "+gamemode)
            joinedWhichGM = gamemode;//respawn in the gamemode which you spawned in after you died
            //might want to animate the gamemode region too...
          }
          else{
            playButton.style.display = "block";
            nameInput.style.display = "block";
            document.getElementById('connecting').style.display = "none";
          }
        }
        gamemodeTitle.addEventListener("animationend", () => {//when finish animating the gamemode selector title after changing gamemode, THEN update the real new gamemode
          gamemodeTitle.textContent = gamemode;
          if (gamemodeTitle.classList.contains("animateNext")){//remove the class to allow new animation
            gamemodeTitle.classList.toggle('animateNext');
            gamemodeTitleAnimation.classList.toggle('animateNext');
          }
          else if (gamemodeTitle.classList.contains("animatePrev")){
            gamemodeTitle.classList.toggle('animatePrev');
            gamemodeTitleAnimation.classList.toggle('animatePrev');
          }
        });
        oval.addEventListener("animationend", () => {//you MUST do this cuz you can't just remove and re-add the class to trigger the animation, browser batches such stuff so animation wont trigger
          if (oval.classList.contains("left")){//if havent remove
            oval.classList.toggle('left');//remove it
          }
          if (oval.classList.contains("right")){//if havent remove
            oval.classList.toggle('right');//remove it
          }
        });
        document.getElementById("adminPanelYN").addEventListener("animationend", () => {
          document.getElementById("adminPanelYN").style.display = "none";
        });
        
        // Map settings
        let MAP_WIDTH = 4000;
        let MAP_HEIGHT = 4000;
        let cameraX = 0;
        let cameraY = 0;
        
        // Map background
        let GRID_SIZE = 24;
        let GRID_LINE_COLOR = '#C8C8C8';
        
        // FPS counter variables
        let fps = 0;
        const fpsCounter = document.getElementById('fpsCounter');
        let lastFpsUpdate = 0;
        let frameCount = 0;
        //other debug stuff
        let numberOfObjectsDrawn = 0;
        let debugState = "close";
        let clientTick = "?.?ms";
        let starting = 0;
        const positionDiv = document.getElementById('position');
        const bandwidthDiv = document.getElementById('bandwidth');
        //death stuff
        let isGamePaused = false;
        let startPlayTime = 0;
      
        //home screen (hs) background canvas stuff
        let hsMAP_SIZE = 3000;
        let rotationRadius = 200;//home screen will move in a circular path, and the radius of this circle is this
        let rotationAngle = 0;//in degree, the angle of the circular path that the map is at now (usedto calculate the x and y coords)
        let hsCameraX = hsMAP_SIZE/2 + rotationRadius  - canvas.width / 2;
        let hsCameraY = hsMAP_SIZE/2  - canvas.height / 2;

        //settings variables
        let showshapeinfo = "yes";
        let spawnradparticle = "yes";

        function abbreviateScore(xp){
          if (!xp){return;}//if undefined
          var exp = xp
              .toExponential()
              .split('e+')
              .map(function(el) { return +el; })
          ;
          var mod = exp[1] % 3;
          exp[0] = exp[0] * Math.pow(10, mod);
          exp[1] = [
              '',
              'k',
              'm',
              'b',
              't',
              'qa',
              'qi',
              'sx'
          ][(exp[1] - mod) / 3];
        
          var num = exp[0];
          
          if(parseInt(num).toString().length==3)var fix = 0; // Removes decimal on numbers with 3 digitx; ex: 999
          if(parseInt(num).toString().length==2)var fix = 1; // Only allow 1 decimal on numbers with 2 digits; ex: 99.9
          if(parseInt(num).toString().length==1)var fix = 2; // Allow up to 2 decimals on numbers with 1 digitM ex; 9.99

          return num.toFixed(fix)*1 + exp[1];
        }
        // Player class
        class Player {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 24;
                this.color = '#00B0E1';
                this.outline = '#0092C3';
                this.speed = 3;
                this.angle = 0;
                let health = 100;
                this.health = health;
                this.maxhealth = health;
                this.healSpeed = health/60/8;//takes 8 seconds to fully heal from 0 to max health
                this.healDelay = 60 * 6;//6 seconds of waiting before healing starts
                this.healingValue = 0;//increases when waiting for healDelay time, when reach same value as healdelay, then start healing
                this.bulletCooldown = 0;
                this.bulletCooldownMax = 30;
                this.score = 0;
                this.barrelLength = 48;
                this.barrelWidth = 23;
                this.barrelOffset = 0;
                this.bulletDamage = 10.5;
                this.bulletSpeed = 4;
                this.bodyDamage = 3;
                this.bulletPenetration = 10.5;
                this.tankType = "mono";
                this.bodyType = "base";
                this.tankTypeLevel = 0;
                this.bodyTypeLevel = 0;
                this.barrels = {};//ADD NEXT TIME
                playerBodyCol = '#00B0E1';
                playerBodyOutline = '#0092C3';
            }

            update() {
                // Movement
                let moveX = 0;
                let moveY = 0;

                if (keys['w'] || keys['ArrowUp']) moveY -= this.speed;
                if (keys['s'] || keys['ArrowDown']) moveY += this.speed;
                if (keys['a'] || keys['ArrowLeft']) moveX -= this.speed;
                if (keys['d'] || keys['ArrowRight']) moveX += this.speed;

                // Diagonal movement
                if (moveX !== 0 && moveY !== 0) {
                    moveX *= 0.7071;
                    moveY *= 0.7071;
                }

                this.x += moveX;
                this.y += moveY;

                // Map boundary check
                this.x = Math.max(this.radius, Math.min(MAP_WIDTH - this.radius, this.x));
                this.y = Math.max(this.radius, Math.min(MAP_HEIGHT - this.radius, this.y));

                // Angle towards mouse
                //const mouseWorldX = mouseX + cameraX;
                //const mouseWorldY = mouseY + cameraY;
                //this.angle = Math.atan2(mouseWorldY - this.y, mouseWorldX - this.x);//old code that doesnt work after adding screen resizing
                this.angle = Math.atan2(mouseY - window.innerHeight/2, mouseX - window.innerWidth/2);

                // Reload
                if (this.bulletCooldown > 0) {
                    this.bulletCooldown--;
                }

                // Shoot if mouse is clicked
                if (mouseDown && this.bulletCooldown === 0) {
                    this.shoot();
                    this.bulletCooldown = this.bulletCooldownMax;
                }
                
                // Centre the camera on the player
                cameraX = this.x - canvas.width / 2;
                cameraY = this.y - canvas.height / 2;
                
                // Keep camera within map bounds (add this as a setting in the future)
                //cameraX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, cameraX));
                //cameraY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, cameraY));
              
                //HEALING
                if (this.health < this.maxhealth){
                  if (this.healingValue >= this.healDelay){//heal!
                    this.health += this.healSpeed;
                    if (this.health >= this.maxhealth){//finish healing
                      if (this.health > this.maxhealth){//if overhealed
                        this.health = this.maxhealth;
                      }
                      this.healingValue = 0;//reset the healing delay time
                    }
                  }
                  else{//waiting for healdelay timing before start healing
                    this.healingValue++;
                  }
                }
            }

            shoot() {
                const bulletSpeed = this.bulletSpeed;
                const bulletX = this.x + Math.cos(this.angle) * (this.radius + 10);//change 10 to barrelLength - bulletSpeed
                const bulletY = this.y + Math.sin(this.angle) * (this.radius + 10);
                
                bullets.push(new Bullet(
                    bulletX,
                    bulletY,
                    Math.cos(this.angle) * bulletSpeed,
                    Math.sin(this.angle) * bulletSpeed,
                    this
                ));
            }

            draw() {
                // Convert world coordinates to screen coordinates
                const screenX = this.x - cameraX;
                const screenY = this.y - cameraY;
                const screenXwithfov = canvas.width/2 - (players[0].x - this.x)*fovscale;
                const screenYwithfov = canvas.height/2 - (players[0].y - this.y)*fovscale;
                
                // Only draw if on screen
                if (this.isOnScreen(screenXwithfov, screenYwithfov)) {
                    // Draw tank barrel
                    ctx.strokeStyle = '#7B7B7B';
                    ctx.fillStyle = '#999999'
                    ctx.lineWidth = 4;
                    ctx.lineJoin = 'round';
                    ctx.save();
                    ctx.translate(screenX, screenY);
                    ctx.rotate(this.angle);
                    ctx.fillRect(this.barrelOffset,-this.barrelWidth/2,this.barrelLength,this.barrelWidth);
                    ctx.strokeRect(this.barrelOffset,-this.barrelWidth/2,this.barrelLength,this.barrelWidth);
                    ctx.restore();
                    
                    // Draw tank body
                    ctx.fillStyle = this.color;
                    ctx.strokeStyle = this.outline;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    if (settingsList.showhitboxes === true && debugState == "open"){//show hitbox
                      ctx.strokeStyle = "white";
                      ctx.lineWidth = 1.5;
                      ctx.beginPath();
                      ctx.arc(screenX, screenY, this.radius, 0, 2 * Math.PI);
                      ctx.stroke();
                    }

                    // Draw health bar
                    const healthBarWidth = this.radius * 2;
                    const healthBarHeight = 5;
                    const healthPercentage = this.health / this.maxhealth;
                    ctx.fillStyle = 'black';
                    ctx.beginPath();
                    ctx.roundRect(
                        screenX - healthBarWidth / 2 - 2,//-2 so that black bar bigger than blue
                        screenY + this.radius + 15 - 2,
                        healthBarWidth + 4,//+4 so that black bar bigger
                        healthBarHeight + 4,
                        4
                    );//older browsers might not have roundrect!!!
                    ctx.fill();
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.roundRect(
                        screenX - healthBarWidth / 2,
                        screenY + this.radius + 15,
                        healthBarWidth * healthPercentage,
                        healthBarHeight,
                        4
                    );
                    ctx.fill();
                    numberOfObjectsDrawn++;
                }
            }
            
            isOnScreen(x, y) {
                return x + this.radius*fovscale > 0 && x - this.radius*fovscale < canvas.width*fov &&
                       y + this.radius*fovscale > 0 && y - this.radius*fovscale < canvas.height*fov;
            }
        }

        // Bullet class
        class Bullet {
            constructor(x, y, dx, dy, owner) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.radius = owner.barrelWidth/2;
                this.color = owner.color;
                this.outline = owner.outline;
                this.owner = owner;
                this.lifetime = 100;
                this.damage = owner.bulletDamage;
                this.health = owner.bulletPenetration;
                this.shade = 0;//shade indicates how white it turns when colliding
                this.maxshade = 0.3;//bullets turn 30% whiter when hit
                this.isHit = false;
            }//add bullet offset in the future

            update() {
                this.x += this.dx;
                this.y += this.dy;
                this.lifetime--;

                // Check collision with enemies if player's bullet
                if (this.owner instanceof Player) {
                    for (let i = enemies.length - 1; i >= 0; i--) {
                        const enemy = enemies[i];
                        const dist = Math.hypot(this.x - enemy.x, this.y - enemy.y);
                        if (dist < this.radius + enemy.radius) {
                            // Hit enemy
                            enemy.health -= this.damage;
                            this.health--;//reduce bullet health
                            enemy.isHit = true;
                            this.isHit = true;
                            if (enemy.health <= 0) {
                                this.owner.score += 100000;//bots give 0.1m score
                                score = abbreviateScore(this.owner.score);
                                scoreElement.textContent = `Score: ${score}`;
                                //createParticles(enemy.x, enemy.y, enemy.color, enemy.outline, 15);
                                enemies.splice(i, 1);
                                spawnEnemy();
                            }
                            //return true; // Mark for removal
                        }
                    }
                    for (let i = shapes.length - 1; i >= 0; i--) {
                        const shape = shapes[i];
                        const dist = Math.hypot(this.x - shape.x, this.y - shape.y);

                        if (dist < this.radius + shape.size/2) {
                            shape.health -= this.damage;
                            this.health--;//reduce bullet health
                            shape.isHit = true;
                            this.isHit = true;
                            if (shape.health <= 0) {
                                // Add score based on shape type
                                this.owner.score += shapescores[shape.type];
                                score = abbreviateScore(this.owner.score);
                                scoreElement.textContent = `Score: ${score}`;

                                //createParticles(shape.x, shape.y, shape.color, shape.outline, 8);
                                shapes.splice(i, 1);
                                setTimeout(spawnShape, 1000); // Respawn after delay
                            }
                            //return true; // Bullet is destroyed
                        }
                    }
                }

                // Check collision with player if enemy's bullet
                if (this.owner instanceof Enemy && players.length > 0) {
                    const player = players[0];
                    const dist = Math.hypot(this.x - player.x, this.y - player.y);
                    if (dist < this.radius + player.radius) {
                        player.health -= this.damage;
                        player.healingValue = 0;//reset the healing delay time
                        this.health--;//reduce bullet health
                        this.isHit = true;
                        if (player.health <= 0) {
                            // Game over
                            let lvl = convertXPtoLevel(player.score);
                            showDeathScreen(score,"bot",lvl,"mono","base");
                        }
                        //else{
                          //return true; // Mark for removal
                        //}
                    }
                }

                // Check out of bounds (now against map size)
                if (this.x < 0 || this.x > MAP_WIDTH || this.y < 0 || this.y > MAP_HEIGHT) {
                    return true;//Mark for removal
                }
              
                //check bullet health (penetration)
                if (this.health <= 0) {
                    return true;//Mark for removal
                }

                // Check lifetime
                if (this.lifetime <= 0) {
                    return true;//Mark for removal
                }

                return false;
            }

            draw() {
                // Convert world coordinates to screen coordinates
                const screenX = this.x - cameraX;
                const screenY = this.y - cameraY;
                const screenXwithfov = canvas.width/2 - (players[0].x - this.x)*fovscale;
                const screenYwithfov = canvas.height/2 - (players[0].y - this.y)*fovscale;
                
                // Only draw if on screen
                if (this.isOnScreen(screenXwithfov, screenYwithfov)) {
                    ctx.fillStyle = this.color;
                    ctx.strokeStyle = this.outline;
                    if (this.isHit){//if bullet collided with something
                      this.shade += (this.maxshade/25);//make it whiter
                      if (this.shade > this.maxshade){
                        this.shade = this.maxshade;
                      }
                    }
                    if (this.shade>0){//even if not hit, still need to animate from whitish color to normal bot color
                      ctx.fillStyle = pSBC ( this.shade, this.color );
                      ctx.strokeStyle = pSBC ( this.shade, this.outline );
                    }
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    if (settingsList.showhitboxes === true && debugState == "open"){//show hitbox
                      ctx.strokeStyle = "white";
                      ctx.lineWidth = 1.5;
                      ctx.beginPath();
                      ctx.arc(screenX, screenY, this.radius, 0, 2 * Math.PI);
                      ctx.stroke();
                    }
                    numberOfObjectsDrawn++;
                    if (this.isHit){
                      this.isHit = false;//reset every loop AFTER drawing
                    }
                    else if (this.shade!=0){//if not hit, reduce shade
                      this.shade -= (this.maxshade/25);
                      if (this.shade < 0){
                        this.shade = 0;
                      }
                    }
                }
            }
            
            isOnScreen(x, y) {
                return x + this.radius*fovscale > 0 && x - this.radius*fovscale < canvas.width*fov &&
                       y + this.radius*fovscale > 0 && y - this.radius*fovscale < canvas.height*fov;
            }
        }

        const possibleBotColors = ["#dbab1a","#db861e","#db571e"];
        const possibleBotOutlines = ["#bd8d00","#bd6800","#bd3900"];//when convert hex to rgb, the rgb outline should be 30 less than rgb color, e.g. outline is rgb(0,0,0) then color is rgb(30,30,30)
        // Enemy class
        class Enemy {
            constructor() {
                // Spawn at edge of map
                const side = Math.floor(Math.random() * 4);
                switch (side) {
                    case 0: // top
                        this.x = Math.random() * MAP_WIDTH;
                        this.y = -30;
                        break;
                    case 1: // right
                        this.x = MAP_WIDTH + 30;
                        this.y = Math.random() * MAP_HEIGHT;
                        break;
                    case 2: // bottom
                        this.x = Math.random() * MAP_WIDTH;
                        this.y = MAP_HEIGHT + 30;
                        break;
                    case 3: // left
                        this.x = -30;
                        this.y = Math.random() * MAP_HEIGHT;
                        break;
                }
                
                const botRadius = 20 + Math.random() * 30;
                this.radius = botRadius;
                let botType = Math.floor(Math.random() * possibleBotColors.length);
                //const hslColor = Math.random() * 60;
                //this.color = `hsl(${hslColor}, 70%, 50%)`;
                //this.outline = `hsl(${hslColor}, 50%, 50%)`;//darker saturation
                this.color = possibleBotColors[botType];
                this.outline = possibleBotOutlines[botType];
                this.speed = 1 + Math.random() * 2;
                const health = 100;
                this.health = health;
                this.maxhealth = health;//doesnt change
                this.shootCooldown = Math.floor(Math.random() * 100);
                this.shootCooldownMax = 100;
                this.barrelWidth = botRadius/1.5;
                this.bulletDamage = 2;
                this.bulletPenetration = 5;
                this.id = botID;
                botID++;
                if (botID > 10000){//max 10k bots, also prevent ID from getting too big
                  botID = 0;
                }
                this.shade = 0;//shade indicates how white it turns when colliding
                this.maxshade = 0.3;//bots turn 30% whiter when hit
                this.isHit = false;
            }

            update() {
                // Move towards player
                if (players.length > 0) {
                    const player = players[0];
                    const angle = Math.atan2(player.y - this.y, player.x - this.x);
                    this.x += Math.cos(angle) * this.speed;
                    this.y += Math.sin(angle) * this.speed;
                }

                // Shoot at player
                if (this.shootCooldown <= 0 && players.length > 0) {
                    const player = players[0];
                    const angle = Math.atan2(player.y - this.y, player.x - this.x);
                    const bulletSpeed = 5;
                    
                    bullets.push(new Bullet(
                        this.x,
                        this.y,
                        Math.cos(angle) * bulletSpeed,
                        Math.sin(angle) * bulletSpeed,
                        this
                    ));
                    
                    this.shootCooldown = this.shootCooldownMax;
                } else {
                    this.shootCooldown--;
                }
              
                //collision detection with other enemies
                for (let i = enemies.length - 1; i >= 0; i--) {
                    const bot = enemies[i];
                    if (this.id != bot.id){//different bots
                        const dx = bot.x - this.x;
                        const dy = bot.y - this.y;
                        const dist = Math.hypot(dx, dy);
                        const minDist = this.radius + bot.radius;
                        if (dist < minDist) {// 2 shapes touching each other
                            if (dist < 0.001) {// If shapes are exactly on top of each other
                                // Random push direction
                                const angle = Math.random() * Math.PI * 2;
                                const pushX = Math.cos(angle);
                                const pushY = Math.sin(angle);
                                const separation = minDist * 0.5;
                                this.x -= pushX * separation;
                                this.y -= pushY * separation;
                                bot.x += pushX * separation;
                                bot.y += pushY * separation;
                            }
                            else{//normal collision
                                const nx = dx / dist;
                                const ny = dy / dist;
                                const overlap = minDist - dist;
                                const moveX = nx * overlap * 0.5;
                                const moveY = ny * overlap * 0.5;
                                //bounce
                                const bounceFactor = 0.3;
                                const relativeSpeed = 1;//dont change this
                                // Apply separation (both shapes move half the distance) + bounce
                                this.x -= (moveX + nx * relativeSpeed * bounceFactor);
                                this.y -= (moveY + ny * relativeSpeed * bounceFactor);
                                bot.x += (moveX + nx * relativeSpeed * bounceFactor);
                                bot.y += (moveY + ny * relativeSpeed * bounceFactor);
                            }
                        }
                    }
                }
            }

            draw() {
                // Convert world coordinates to screen coordinates
                const screenX = this.x - cameraX;
                const screenY = this.y - cameraY;
                const screenXwithfov = canvas.width/2 - (players[0].x - this.x)*fovscale;
                const screenYwithfov = canvas.height/2 - (players[0].y - this.y)*fovscale;
                
                // Only draw if on screen
                if (this.isOnScreen(screenXwithfov, screenYwithfov)) {
                    // Draw enemy body
                    ctx.fillStyle = this.color;
                    ctx.strokeStyle = this.outline;
                    if (this.isHit){//if bot collided with player or bullet
                      this.shade += (this.maxshade/25);//make bot whiter
                      if (this.shade > this.maxshade){
                        this.shade = this.maxshade;
                      }
                    }
                    if (this.shade>0){//even if not hit, still need to animate from whitish color to normal bot color
                      ctx.fillStyle = pSBC ( this.shade, this.color );
                      ctx.strokeStyle = pSBC ( this.shade, this.outline );
                    }
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    if (settingsList.showhitboxes === true && debugState == "open"){//show hitbox
                      ctx.strokeStyle = "white";
                      ctx.lineWidth = 1.5;
                      ctx.beginPath();
                      ctx.arc(screenX, screenY, this.radius, 0, 2 * Math.PI);
                      ctx.stroke();
                    }

                    // Draw health bar
                    const healthBarWidth = this.radius * 2;
                    const healthBarHeight = 5;
                    const healthPercentage = this.health / this.maxhealth;
                    
                    ctx.fillStyle = 'black';
                    ctx.beginPath();
                    ctx.roundRect(
                        screenX - healthBarWidth / 2 - 2,
                        screenY + this.radius + 15 - 2,
                        healthBarWidth + 4,
                        healthBarHeight + 4,
                        4
                    );//older browsers might not have roundrect!!!
                    ctx.fill();
                    
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.roundRect(
                        screenX - healthBarWidth / 2,
                        screenY + this.radius + 15,
                        healthBarWidth * healthPercentage,
                        healthBarHeight,
                        4
                    );
                    ctx.fill();
                    numberOfObjectsDrawn++;
                    if (this.isHit){
                      this.isHit = false;//reset every loop AFTER drawing
                    }
                    else if (this.shade!=0){//if not hit, reduce shade
                      this.shade -= (this.maxshade/25);
                      if (this.shade < 0){
                        this.shade = 0;
                      }
                    }
                }
            }
            
            isOnScreen(x, y) {
                return x + this.radius*fovscale > 0 && x - this.radius*fovscale < canvas.width*fov &&
                       y + this.radius*fovscale > 0 && y - this.radius*fovscale < canvas.height*fov;
            }
        }
      
      
                const shapecolors = [
                    '#FC7676', //square
                    '#FFE46B', //triangle
                    '#768CFC',  //pentagon
                    '#FCA644', //hexagon
                    '#38B764', //heptagon
                    '#4A66BD', //octagon
                    '#5D275D', //nonagon
                    '#1A1C2C',//decagon
                    '#060011',//hendecagon
                    '#403645',//dodecagon
                    '#EDEDFF',//tridecagon
                    '#000000'//tetradecagon
                ];
                const shapeoutlines = [
                    '#DE5858',
                    '#E1C64D',
                    '#586EDE',
                    '#DE8826',
                    '#1A9946',
                    '#2C489F',
                    '#3F093F',
                    '#00000E',
                    '#000000',
                    '#221827',
                    '#CFCFE1',
                    '#000000'
                ];
                const shapehealths = [//use formula next time
                    126,
                    35,//NOTE: triangle is second in the list, but it is the smallest and least health
                    454,
                    1633,
                    5879,
                    21163,
                    76187,
                    274275,
                    987338,
                    3554598,
                    12796555,
                    46067596
                ];
                const shapesizes = [
                    35,
                    25,
                    70,
                    100,
                    150,
                    200,
                    300,
                    450,
                    675,
                    1100,
                    2020,
                    3500
                ];
                const shapescores = [
                    1250,
                    250,
                    5250,
                    21250,
                    85250,
                    341250,
                    1365250,
                    5461250,
                    21845250,
                    87381250,
                    349525250,
                    1398101250
                ]//copied from scenexe, do not modify
                const shapeRotationSpeed = [
                  0.002,
                  0.003,
                  0.002,
                  0.0015,
                  0.001,
                  0.0005,
                  0.0004,
                  0.0003,
                  0.0002,
                  0.0001,
                  0.00005,
                  0.00005
                ]//NOTE: 2 IS THE MAXIMUM because 2*Math.PI is 360 degrees
                const shapeNames = [
                  "Square",
                  "Triangle",
                  "Pentagon",
                  "Hexagon",
                  "Heptagon",
                  "Octagon",
                  "Nonagon",
                  "Decagon",
                  "Hendecagon",
                  "Dodecagon",
                  "Tridecagon",
                  "Tetradecagon"
                ]
                const shapeMass = [0.2,0.1,0.2,0.3,0.4,0.6,0.8,0.9,0.9,0.9,0.9,0.9]//MUST be between 0 and 1, dont put 1.0 or else it will be unmovable (will have problems between 2 unmovable shapes)
                //add support for bigger shapes in the future

                //make hex colors lighter shade, needed for collision
                //Huge thank you to: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
                const pSBC=(p,c0,c1,l)=>{
                    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
                    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
                    if(!pSBCr) var pSBCr=(d)=>{
                        let n=d.length,x={};
                        if(n>9){
                            [r,g,b,a]=d=d.split(","),n=d.length;
                            if(n<3||n>4)return null;
                            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
                        }else{
                            if(n==8||n==6||n<4)return null;
                            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
                            d=i(d.slice(1),16);
                            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
                            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
                        }return x};
                    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
                    if(!f||!t)return null;
                    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
                    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
                    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
                    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
                    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
                }

        class Shape {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                const shapeChance = Math.floor(Math.random() * 101); //choose random number from 0 to 100
                let shapetype = 0;  // 0=square, 1=triangle, 2=pentagon, 3=hexagon, 4=heptagon, n=(n+3)sides
                if (shapeChance<15){//15/100 chance
                  shapetype = 0;//spawn a square
                }
                else if (shapeChance<35){//20/100 chance
                  shapetype = 1;//spawn triangle
                }
                else if (shapeChance<50){//15/100 chance
                  shapetype = 2;//spawn penta
                }
                else if (shapeChance<65){//15/100 chance
                  shapetype = 3;//spawn hexa
                }
                else if (shapeChance<74){//9/100 chance
                  shapetype = 4;
                }
                else if (shapeChance<82){//8/100 chance
                  shapetype = 5;
                }
                else if (shapeChance<89){//7/100 chance
                  shapetype = 6;
                }
                else if (shapeChance<94){//5/100 chance
                  shapetype = 7;
                }
                else if (shapeChance<98){//4/100 chance
                  shapetype = 8;
                }
                else if (shapeChance<100){//2/100 chance
                  shapetype = 9;
                }
                else if (shapeChance<101){//1/100 chance
                  shapetype = 10;//spawn tridecagon
                }
                else{
                  console.log("error: invalid shape spawn")
                }
              /*
                else if (shapeChance<101){//tetradecagon and above cannot spawn in FFA (for rocketer)
                  shapetype = 1;
                }
              */
                this.type = shapetype;
                this.size = shapesizes[shapetype];
                this.health = shapehealths[shapetype];
                this.color = shapecolors[shapetype];//note: if shapetype more than 11, just use 11's color and outline (tetradecagon)
                this.outline = shapeoutlines[shapetype];
                this.rotation = Math.random() * Math.PI * 2;//choose a random starting angle
                this.rotationSpeed = shapeRotationSpeed[shapetype] * Math.PI;
                //this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.id = shapeID;
                shapeID++;
                if (shapeID > 10000){//max 10k shapes, also prevent ID from getting too big
                  shapeID = 0;
                }
                // Circular movement properties
                this.circleCenter = {x: x,y: y};
                this.circleRadius = 100;
                this.circleSpeed = shapeRotationSpeed[shapetype];
                this.circleAngle = Math.random() * Math.PI * 2;
                this.mass = shapeMass[shapetype];//relative mass
                let maxshade = 0.3;//shapes turn 30% whiter when hit  (log, not linear)
                if (shapetype > 5){//nonagon, decagon, hendecagon etc. dont turn very white upon collision with bullets or players
                  maxshade = 0.03;
                }
                this.shade = 0;//shade indicates how white it turns when colliding
                this.maxshade = maxshade;
                this.isHit = false;
            }

            update() {
                //Move shape in circular path
                this.circleAngle += this.circleSpeed;
                this.x = this.circleCenter.x + Math.cos(this.circleAngle) * this.circleRadius;
                this.y = this.circleCenter.y + Math.sin(this.circleAngle) * this.circleRadius;
                this.rotation += this.rotationSpeed;
                for (let i = shapes.length - 1; i >= 0; i--) {
                    const shape = shapes[i];
                    if (this.id != shape.id){//different shapes
                        const dx = shape.x - this.x;
                        const dy = shape.y - this.y;
                        const dist = Math.hypot(dx, dy);
                        const minDist = this.size/2 + shape.size/2;
                        if (dist < minDist) {// 2 shapes touching each other
                            const totalMass = this.mass + shape.mass;
                            const ratioThis = shape.mass / totalMass; // if the other shape has higher mass, then this shape moves relatively more
                            const ratioShape = this.mass / totalMass;
                            if (dist < 0.001) {// If shapes are exactly on top of each other
                                // Random push direction
                                const angle = Math.random() * Math.PI * 2;
                                const pushX = Math.cos(angle);
                                const pushY = Math.sin(angle);
                                const separation = minDist * 0.5;
                                this.x -= pushX * separation * ratioThis;
                                this.y -= pushY * separation * ratioThis;
                                shape.x += pushX * separation * ratioShape;
                                shape.y += pushY * separation * ratioShape;
                                
                                // Adjust circular centers to maintain orbits
                                this.circleCenter.x -= pushX * separation * ratioThis;
                                this.circleCenter.y -= pushY * separation * ratioThis;
                                shape.circleCenter.x += pushX * separation * ratioShape;
                                shape.circleCenter.y += pushY * separation * ratioShape;
                            }
                            else{//normal collision
                                const nx = dx / dist;
                                const ny = dy / dist;
                                const overlap = minDist - dist;
                                const moveX = nx * overlap * 0.5;
                                const moveY = ny * overlap * 0.5;
                                //bounce
                                const bounceFactor = 0.3;
                                const relativeSpeed = 1;
                                // Apply separation (both shapes move half the distance) + bounce
                                this.x -= (moveX + nx * relativeSpeed * bounceFactor) * ratioThis;
                                this.y -= (moveY + ny * relativeSpeed * bounceFactor) * ratioThis;
                                shape.x += (moveX + nx * relativeSpeed * bounceFactor) * ratioShape;
                                shape.y += (moveY + ny * relativeSpeed * bounceFactor) * ratioShape;
                                // Adjust circular centers to maintain orbits
                                this.circleCenter.x -= (moveX + nx * relativeSpeed * bounceFactor) * ratioThis;
                                this.circleCenter.y -= (moveY + ny * relativeSpeed * bounceFactor) * ratioThis;
                                shape.circleCenter.x += (moveX + nx * relativeSpeed * bounceFactor) * ratioShape;
                                shape.circleCenter.y += (moveY + ny * relativeSpeed * bounceFactor) * ratioShape;
                                //bounce
                              /*
                                const bounceFactor = 0.3;
                                const relativeSpeed = 1;
                                this.x -= nx * relativeSpeed * bounceFactor;
                                this.y -= ny * relativeSpeed * bounceFactor;
                                shape.x += nx * relativeSpeed * bounceFactor;
                                shape.y += ny * relativeSpeed * bounceFactor;
                                */
                            }
                        }
                    }
                }
                // Map boundary check
                this.x = Math.max(this.size/2, Math.min(MAP_WIDTH - this.size/2, this.x));
                this.y = Math.max(this.size/2, Math.min(MAP_HEIGHT - this.size/2, this.y));
            }

            draw() {
                const screenX = this.x - cameraX;
                const screenY = this.y - cameraY;
                const screenXwithfov = canvas.width/2 - (players[0].x - this.x)*fovscale;
                const screenYwithfov = canvas.height/2 - (players[0].y - this.y)*fovscale;

                if (!this.isOnScreen(screenXwithfov, screenYwithfov)) return;

                ctx.save();
                ctx.translate(screenX, screenY);//already scaled in gameloop, so dont need to scale
                ctx.rotate(this.rotation);
                ctx.fillStyle = this.color;
                ctx.strokeStyle = this.outline;
                if (this.isHit){//if shape collided with player or bullet
                  this.shade += (this.maxshade/25);//make shape whiter
                  if (this.shade > this.maxshade){
                    this.shade = this.maxshade;
                  }
                }
                if (this.shade>0){//even if not hit, still need to animate from whitish color to normal shape color
                  ctx.fillStyle = pSBC ( this.shade, this.color );
                  ctx.strokeStyle = pSBC ( this.shade, this.outline );
                }
                ctx.lineJoin = "round";//to make shape corners round
                ctx.lineWidth = 4;

                switch(this.type) {
                    case 0: // Square
                        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                        ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
                        break;
                    case 1: // Triangle
                        ctx.beginPath();
                        for (let i = 0; i < 3; i++) {
                            const angle = (i * Math.PI * 2 / 3) - Math.PI/2;
                            ctx.lineTo(
                                Math.cos(angle) * this.size/2,
                                Math.sin(angle) * this.size/2
                            );
                        }
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        break;
                    default: // All other polygons
                        const shapeSides = this.type + 3; //pentagon is type 2, but 5 sides
                        ctx.beginPath();
                        for (let i = 0; i < shapeSides; i++) {
                            const angle = (i * Math.PI * 2 / shapeSides) - Math.PI/2;
                            ctx.lineTo(
                                Math.cos(angle) * this.size/2,
                                Math.sin(angle) * this.size/2
                            );
                        }
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                }
              
                if (settingsList.showhitboxes === true && debugState == "open"){//show shape hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(0, 0, this.size/2, 0, 2 * Math.PI);
                  ctx.stroke();
                  //write shape name
                  ctx.rotate(-this.rotation);
                  ctx.fillStyle = "white";
                  ctx.strokeStyle = "black";
                  ctx.lineWidth = 9;
                  ctx.font = "700 15px Roboto";
                  ctx.textAlign = "center";
                  let name = "";
                  let radtier = 0;//not radiant
                  if (radtier == 1){name = "Radiant "}
                  else if (radtier == 2){name = "Gleaming "}
                  else if (radtier == 3){name = "Luminous "}
                  else if (radtier == 4){name = "Lustrous "}
                  else if (radtier == 5){name = "Highly Radiant "}
                  name += shapeNames[this.type];
                  ctx.strokeText(name,0,0 - this.size/2 - 20);
                  ctx.fillText(name,0,0 - this.size/2 - 20);
                }

                ctx.restore();
              
                // Draw health bar
                    const healthBarWidth = this.size;
                    const healthBarHeight = 5;
                    const healthPercentage = this.health / shapehealths[this.type];
                    
                    ctx.fillStyle = 'black';
                    ctx.beginPath();
                    ctx.roundRect(
                        screenX - healthBarWidth / 2 - 2,//-2 so that black bar bigger than blue
                        screenY + healthBarWidth / 2 + 15 - 2,
                        healthBarWidth + 4,//+4 so that black bar bigger
                        healthBarHeight + 4,
                        4
                    );//older browsers might not have roundrect!!!
                    ctx.fill();
                    
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.roundRect(
                        screenX - healthBarWidth / 2,
                        screenY + healthBarWidth / 2 + 15,
                        healthBarWidth * healthPercentage,
                        healthBarHeight,
                        4
                    );
                    ctx.fill();
                numberOfObjectsDrawn++;
                if (this.isHit){
                  this.isHit = false;//reset every loop AFTER drawing
                }
                else if (this.shade!=0){//if not hit, reduce shade
                  this.shade -= (this.maxshade/25);
                  if (this.shade < 0){
                    this.shade = 0;
                  }
                }
            }

            isOnScreen(x, y) {
                return x + this.size/2*fovscale > 0 && x - this.size/2*fovscale < canvas.width*fov &&
                       y + this.size/2*fovscale > 0 && y - this.size/2*fovscale < canvas.height*fov;
            }
        }

        // Particle class for effects
        class Particle {
            constructor(x, y, color, outline) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.outline = outline;
                //this.radius = Math.random() * 3 + 1;
                this.radius = Math.random() * 10 + 5;
                this.dx = (Math.random() - 0.5) * 5;
                this.dy = (Math.random() - 0.5) * 5;
                this.lifetime = 30 + Math.random() * 10;
                this.alpha = 1;
            }

            update() {
                this.x += this.dx;
                this.y += this.dy;
                this.lifetime--;
                //this.alpha = this.lifetime / 60;
                if (this.lifetime < 25){
                  this.alpha-=0.05;
                  if (this.alpha < 0){this.alpha = 0;}
                }
                return this.lifetime <= 0;
            }

            draw() {
                // Convert world coordinates to screen coordinates
                const screenX = this.x - cameraX;
                const screenY = this.y - cameraY;
                
                // Only draw if on screen
                if (screenX + this.radius > 0 && screenX - this.radius < canvas.width &&
                    screenY + this.radius > 0 && screenY - this.radius < canvas.height) {
                    ctx.save();
                    ctx.globalAlpha = this.alpha;
                    ctx.fillStyle = this.color;
                    ctx.strokeStyle = this.outline;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                    numberOfObjectsDrawn++;
                }
            }
        }

        function createParticles(x, y, color, outline, count) {
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(x, y, color, outline));
            }
        }

        function spawnEnemy() {
            enemies.push(new Enemy());
        }
        
        function drawGrid() {//only for game, not home screen
            ctx.strokeStyle = GRID_LINE_COLOR;
            ctx.lineWidth = 4;
            const cameraXwithFOV = players[0].x - canvas.width/2 * fov;
            const cameraYwithFOV = players[0].y - canvas.height/2 * fov;
            // Calculate visible grid area
            const startX = Math.floor(cameraXwithFOV / GRID_SIZE) * GRID_SIZE;
            const startY = Math.floor(cameraYwithFOV / GRID_SIZE) * GRID_SIZE;
            
            //const endX = Math.min(MAP_WIDTH, startX + canvas.width * fov + GRID_SIZE);
            //const endY = Math.min(MAP_HEIGHT, startY + canvas.height * fov + GRID_SIZE);
            const endX = startX + canvas.width * fov + GRID_SIZE;
            const endY = startY + canvas.height * fov + GRID_SIZE;
            
            // Draw vertical lines
            for (let x = startX; x <= endX; x += GRID_SIZE) {
                const screenX = x - cameraXwithFOV +canvas.width/2*(1-fov);
                ctx.beginPath();
                ctx.moveTo(screenX, -canvas.height/2*fov);
                ctx.lineTo(screenX, canvas.height * fov);
                ctx.stroke();
            }
            
            // Draw horizontal lines
            for (let y = startY; y <= endY; y += GRID_SIZE) {
                const screenY = y - cameraYwithFOV +canvas.height/2*(1-fov);
                ctx.beginPath();
                ctx.moveTo(-canvas.width/2*fov, screenY);
                ctx.lineTo(canvas.width * fov, screenY);
                ctx.stroke();
            }
        }
      
        function drawMapBoundary() {// Draw area outside the map (where camera can go beyond)
            ctx.save();
            ctx.translate(-canvas.width/2*(fov-1),-canvas.height/2*(fov-1));
            ctx.fillStyle = 'rgba(95, 103, 108, 0.5)';
            const cameraXwithFOV = players[0].x - canvas.width/2 * fov;
            const cameraYwithFOV = players[0].y - canvas.height/2 * fov;
            const cameraXwithFOVopp = players[0].x + canvas.width/2 * fov;
            const cameraYwithFOVopp = players[0].y + canvas.height/2 * fov;
            // Top border
            ctx.fillRect(0,-cameraYwithFOV,MAP_WIDTH*fov+cameraYwithFOVopp,Math.min(0, cameraYwithFOV));//Math.min so that only draw if cameraY < 0
            // Bottom border
            ctx.fillRect(0,MAP_HEIGHT - cameraYwithFOV,MAP_WIDTH*fov+cameraYwithFOVopp,Math.max(0, cameraYwithFOVopp));
            // Left border
            ctx.fillRect(-cameraXwithFOV,-cameraYwithFOV,Math.min(0, cameraXwithFOV),MAP_HEIGHT);//only draw if cameraX < 0
            // Right border
            ctx.fillRect(MAP_WIDTH - cameraXwithFOV,-cameraYwithFOV,Math.max(0, cameraXwithFOVopp),MAP_HEIGHT);

            if (settingsList.showhitboxes === true && debugState == "open"){//show hitbox (green box around map)
              ctx.strokeStyle = "#00ff00";
              ctx.lineWidth = 1.5;
              ctx.strokeRect(-cameraXwithFOV,-cameraYwithFOV,MAP_WIDTH,MAP_HEIGHT);
            }
            ctx.restore();
        }
      
        function drawMinimap() {
            //draw the minimap at top left corner of screen
            let mmX = 10;
            let mmY = 10;
            let mmWidth = 150/1000*canvas.height;
            let mmHeight = 150/1000*canvas.height;//size scaling depending on height of browser
            //if rectangular map instad of square
            if (MAP_WIDTH > MAP_HEIGHT){
              mmWidth = mmWidth/MAP_HEIGHT*MAP_WIDTH;
            }
            if (MAP_WIDTH < MAP_HEIGHT){
              mmHeight = mmHeight/MAP_WIDTH*MAP_HEIGHT;
            }
            ctx.fillStyle = "rgba(189,189,189,.5)";
            ctx.strokeStyle = "rgb(90,90,90)";
            ctx.lineWidth = 5/1000*canvas.height;//size scaling depending on height of browser
            ctx.fillRect(mmX, mmY, mmWidth, mmHeight);
            ctx.strokeRect(mmX, mmY, mmWidth, mmHeight);
            //player location on minimap
            ctx.fillStyle = "rgb(90,90,90)"; //player always darkgrey triangle on minimap
            if (players.length > 0) {
                const player = players[0];
                ctx.save();
                ctx.translate((player.x / MAP_WIDTH) * mmWidth + mmX, (player.y / MAP_HEIGHT) * mmHeight + mmY);
                ctx.rotate(player.angle+90/180*Math.PI);//traingle code draws it 90 degrees sideways (note that everything is in radians, not degrees)
                ctx.beginPath();//draw triangle
                let h = 10;
                let w = 7;
                ctx.moveTo(0,-h/2)
                ctx.lineTo(w/2,h/2)
                ctx.lineTo(-w/2,h/2)
                ctx.fill();
                ctx.restore();
            }
        }
      
        function drawGridHomeScreen() {//ONLY FOR HOMSCREEN
            hctx.strokeStyle = GRID_LINE_COLOR;
            hctx.lineWidth = 4;
            const cameraXwithFOV = hsCameraX - hcanvas.width/2 * zoom;
            const cameraYwithFOV = hsCameraY - hcanvas.height/2 * zoom;
            // Calculate visible grid area
            const startX = Math.floor(cameraXwithFOV / GRID_SIZE) * GRID_SIZE;
            const startY = Math.floor(cameraYwithFOV / GRID_SIZE) * GRID_SIZE;
            const endX = startX + hcanvas.width * zoom + GRID_SIZE;
            const endY = startY + hcanvas.height * zoom + GRID_SIZE;
            
            // Draw vertical lines
            for (let x = startX; x <= endX; x += GRID_SIZE) {
                const screenX = x - cameraXwithFOV +hcanvas.width/2*(1-zoom);
                hctx.beginPath();
                hctx.moveTo(screenX, -hcanvas.height/2*zoom);
                hctx.lineTo(screenX, hcanvas.height * zoom);
                hctx.stroke();
            }
            
            // Draw horizontal lines
            for (let y = startY; y <= endY; y += GRID_SIZE) {
                const screenY = y - cameraYwithFOV +hcanvas.height/2*(1-zoom);
                hctx.beginPath();
                hctx.moveTo(-hcanvas.width/2*zoom, screenY);
                hctx.lineTo(hcanvas.width * zoom, screenY);
                hctx.stroke();
            }
        }

        //UPGRADE TREE
      function drawUpgradetreeBox(
        name,
        Xadditional,
        Yadditional,
        fontsize,
        width,
        boxcolor,
        boxdarkcolor,
        which
      ) {
        bodysize = width / 5; //size of tank in upgrade tree
        let resizeDiffX = 1/window.innerWidth*hcanvas.width;
        let resizeDiffY = 1/window.innerHeight*hcanvas.height;
        let scale = resizeDiffY/resizeDiffX;//make upgrade tree not squashed
        let greyedOut = "no";
        if (which == "body" && !bodyCanUpgradeTo.includes(name)){//cannot upgrade to this tank
          boxcolor = "#999999";//greyed out
          boxdarkcolor = "#7b7b7b";
          greyedOut = "yes";
        }
        else if (which == "weapon" && !weaponCanUpgradeTo.includes(name)){
          boxcolor = "#999999";//greyed out
          boxdarkcolor = "#7b7b7b";
          greyedOut = "yes";
        }
        hctx.font = "700 " + fontsize + "px Roboto";
        hctx.fillStyle = boxcolor;
        hctx.strokeStyle = "black";
        hctx.lineWidth = bodysize/4;
        if (which == "weapon") {
          var pos = upgradetreepos;
        } else if (which == "body") {
          var pos = bupgradetreepos;
        }
        var w = width;
        var h = width;
        var r = 5; //radius is one third of height
        var x = hcanvas.width / 2 - (width / 2 + Xadditional);
        var y = pos + Yadditional;
        h *= scale;
        hctx.beginPath();
        hctx.moveTo(x + r, y);
        hctx.arcTo(x + w, y, x + w, y + h, r);
        hctx.arcTo(x + w, y + h, x, y + h, r);
        hctx.arcTo(x, y + h, x, y, r);
        hctx.arcTo(x, y, x + w, y, r);
        hctx.closePath();
        hctx.fill();
        hctx.stroke();
        //draw darker area
        var w2 = w - hctx.lineWidth;
        var h2 = h/2 - hctx.lineWidth/4;
        var x2 = x + hctx.lineWidth/2;
        var y2 = y + h2;
        //h *= scale;
        hctx.fillStyle = boxdarkcolor;
        hctx.beginPath();
        hctx.moveTo(x2 + r, y2);
        hctx.arcTo(x2 + w2, y2, x2 + w2, y2 + h2, r);
        hctx.arcTo(x2 + w2, y2 + h2, x2, y2 + h2, r);
        hctx.arcTo(x2, y2 + h2, x2, y2, r);
        hctx.arcTo(x2, y2, x2 + w2, y2, r);
        hctx.closePath();
        hctx.fill();
        //now draw hard-coded tank on upgrade tree
        hctx.save();
        hctx.translate(
          hcanvas.width / 2 - Xadditional,
          pos + Yadditional + h / 2
        );
          hctx.scale(1,scale)
        if (which == "body") {
          hctx.lineWidth = bodysize/4;
          if (bodyupgrades[name].hasOwnProperty("assets")) {
            hctx.lineJoin = "round";
            //draw under assets
            Object.keys(bodyupgrades[name].assets).forEach((assetID) => {
              var asset = bodyupgrades[name].assets[assetID];
              if (asset.type == "under") {
                hctx.rotate(-bodyangle);
                let assetcolor = asset.color;
                let assetoutline = asset.outline;
                if (assetcolor == "default"){//asset same color as body, e.g. ziggurat
                  assetcolor = playerBodyCol;
                  if (bodyupgrades[name].eternal){
                    assetcolor = "#934c93";
                  }
                  if (greyedOut == "yes"){
                    assetcolor = "#c0c0c0";
                  }
                }
                if (assetoutline == "default"){//asset same color as body, e.g. ziggurat
                  assetoutline = playerBodyOutline;
                  if (bodyupgrades[name].eternal){
                    assetoutline = "#660066";
                  }
                  if (greyedOut == "yes"){
                    assetoutline = "#a2a2a2";
                  }
                }
                drawAsset(asset,bodysize,assetcolor,assetoutline,hctx)
                hctx.rotate(bodyangle);
              }
            });
            hctx.lineJoin = "miter";
          }
          //FOR BODY UPGRADES BODY
          if (!bodyupgrades[name].eternal){
            //hctx.fillStyle = "#00B0E1";
            //hctx.strokeStyle = "#0092C3";
            hctx.fillStyle = playerBodyCol;
            hctx.strokeStyle = playerBodyOutline;
            if (greyedOut == "yes"){
              hctx.fillStyle = "#c0c0c0";
              hctx.strokeStyle = "#a2a2a2";
            }
            hctx.beginPath();
            hctx.arc(0, 0, bodysize, 0, 2 * Math.PI);
            hctx.fill();
            hctx.stroke();
          }
          else{
            //if a tier 6 tank
            hctx.fillStyle = "#934c93";
            hctx.strokeStyle = "#660066";
            if (greyedOut == "yes"){
              hctx.fillStyle = "#c0c0c0";
              hctx.strokeStyle = "#a2a2a2";
            }
            hctx.rotate(-bodyangle);
            hctx.beginPath();
            var baseSides = 6;
            hctx.moveTo(bodysize * Math.cos(0), bodysize * Math.sin(0));
            for (var i = 1; i <= baseSides; i += 1) {
              hctx.lineTo(bodysize * Math.cos((i * 2 * Math.PI) / baseSides), bodysize * Math.sin((i * 2 * Math.PI) / baseSides));
            }
            hctx.fill();
            hctx.stroke();
            hctx.rotate(bodyangle);
          }
          
          if (bodyupgrades[name].hasOwnProperty("assets")) {
            hctx.lineJoin = "round";
            //draw above assets
            Object.keys(bodyupgrades[name].assets).forEach((assetID) => {
              var asset = bodyupgrades[name].assets[assetID];
              if (asset.type == "above") {
                hctx.rotate(-bodyangle);
                let assetcolor = asset.color;
                let assetoutline = asset.outline;
                if (assetcolor == "default"){//asset same color as body, e.g. ziggurat
                  assetcolor = playerBodyCol;
                  if (bodyupgrades[name].eternal){
                    assetcolor = "#934c93";
                  }
                  if (greyedOut == "yes"){
                    assetcolor = "#c0c0c0";
                  }
                }
                if (assetoutline == "default"){//asset same color as body, e.g. ziggurat
                  assetoutline = playerBodyOutline;
                  if (bodyupgrades[name].eternal){
                    assetoutline = "#660066";
                  }
                  if (greyedOut == "yes"){
                    assetoutline = "#a2a2a2";
                  }
                }
                drawAsset(asset,bodysize,assetcolor,assetoutline,hctx)
                hctx.rotate(bodyangle);
              }
            });
            hctx.lineJoin = "miter";
          }
          if (bodyupgrades[name].hasOwnProperty("bodybarrels")) {
            //draw barrels
            hctx.lineJoin = "round";
            Object.keys(bodyupgrades[name].bodybarrels).forEach(
              (barrel) => {
                let thisBarrel = bodyupgrades[name].bodybarrels[barrel];
                hctx.rotate(thisBarrel.additionalAngle - bodyangle);
                hctx.fillStyle = bodyColors.barrel.col;
                hctx.strokeStyle = bodyColors.barrel.outline;
                if (thisBarrel.barrelType == "bullet") {
                  drawBulletBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                } else if (thisBarrel.barrelType == "drone") {
                  if (Math.round(thisBarrel.barrelWidth) != Math.round(thisBarrel.barrelHeight)){
                    drawDroneBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                  }
                  else{
                    drawDroneTurret(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,0,1)
                  }
                } else if (thisBarrel.barrelType == "trap") {
                  drawTrapBarrel(hctx, thisBarrel.x*bodysize, thisBarrel.barrelWidth*bodysize, thisBarrel.barrelHeight*bodysize, 0, 1, bodysize)
                }/* else if (thisBarrel.barrelType == "mine") {
                  drawMineBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1, bodysize)
                } else if (thisBarrel.barrelType == "minion") {
                  drawMinionBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                }*/
                hctx.rotate(-thisBarrel.additionalAngle + bodyangle); //rotate back
              }
            );
            //draw turret base
            hctx.beginPath();
            hctx.arc( 0, 0, bodysize * bodyupgrades[name].turretBaseSize, 0, 2 * Math.PI );
            hctx.fill();
            hctx.stroke();
            hctx.lineJoin = "miter"; //change back
          }
        } else if (which == "weapon") {
          hctx.lineWidth = bodysize/4;
          if (weaponupgrades[name].hasOwnProperty("barrels")) {
            hctx.lineJoin = "round";
            Object.keys(weaponupgrades[name].barrels).forEach(
              (assetID) => {
                var thisBarrel = weaponupgrades[name].barrels[assetID];
                hctx.rotate((thisBarrel.additionalAngle * Math.PI) / 180 - bodyangle); //rotate to barrel angle
                hctx.fillStyle = bodyColors.barrel.col;
                hctx.strokeStyle = bodyColors.barrel.outline;
                if (thisBarrel.barrelType == "bullet") {
                  drawBulletBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                } else if (thisBarrel.barrelType == "drone") {
                  drawDroneBarrel(hctx, thisBarrel.x*bodysize, thisBarrel.barrelWidth*bodysize, thisBarrel.barrelHeight*bodysize, 0, 1)
                } else if (thisBarrel.barrelType == "trap") {
                  drawTrapBarrel(hctx, thisBarrel.x*bodysize, thisBarrel.barrelWidth*bodysize, thisBarrel.barrelHeight*bodysize, 0, 1, bodysize)
                } else if (thisBarrel.barrelType == "mine") {
                  drawMineBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1, bodysize)
                } else if (thisBarrel.barrelType == "minion") {
                  drawMinionBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                }
                hctx.rotate((-thisBarrel.additionalAngle * Math.PI) / 180 + bodyangle); //rotate back
              }
            );
            hctx.lineJoin = "miter"; //change back
          }
          //FOR WEAPON BODY
          if (!weaponupgrades[name].eternal){
            //hctx.fillStyle = "#00B0E1";
            //hctx.strokeStyle = "#0092C3";
            hctx.fillStyle = playerBodyCol;
            hctx.strokeStyle = playerBodyOutline;
            if (greyedOut == "yes"){
              hctx.fillStyle = "#c0c0c0";
              hctx.strokeStyle = "#a2a2a2";
            }
            hctx.beginPath();
            hctx.arc(0, 0, bodysize, 0, 2 * Math.PI);
            hctx.fill();
            hctx.stroke();
          }
          else{
            //if a tier 6 tank
            hctx.fillStyle = "#934c93";
            hctx.strokeStyle = "#660066";
            if (greyedOut == "yes"){
              hctx.fillStyle = "#c0c0c0";
              hctx.strokeStyle = "#a2a2a2";
            }
            hctx.rotate(-bodyangle);
            hctx.beginPath();
            var baseSides = 6;
            hctx.moveTo(bodysize * Math.cos(0), bodysize * Math.sin(0));
            for (var i = 1; i <= baseSides; i += 1) {
              hctx.lineTo(bodysize * Math.cos((i * 2 * Math.PI) / baseSides), bodysize * Math.sin((i * 2 * Math.PI) / baseSides));
            }
            hctx.fill();
            hctx.stroke();
            hctx.rotate(bodyangle);
          }
        }
        hctx.restore();
        hctx.fillStyle = "white";
        hctx.strokeStyle = "black";
        hctx.lineWidth = fontsize/2;
        name = name.charAt(0).toUpperCase() + name.slice(1);//make first letter of tank name uppercase
        hctx.save();
        hctx.translate(hcanvas.width / 2 - Xadditional, pos + h + Yadditional - width/9);
        hctx.scale(1,scale);
        hctx.strokeText(name, 0, 0);
        hctx.fillText(name, 0, 0);
        hctx.restore();
      }
      function drawConnection(
        startX,
        startY,
        endX,
        endY,
        topWidth,
        which,
        applystyle
      ) {
        let resizeDiffX = 1/window.innerWidth*hcanvas.width;
        let resizeDiffY = 1/window.innerHeight*hcanvas.height;
        let scale = resizeDiffY/resizeDiffX;//make upgrade tree not squashed
        topWidth*=scale;
        //top width refers to the width of the box where the line starts to draw
        if (which == "weapon") {
          var pos = upgradetreepos;
        } else if (which == "body") {
          var pos = bupgradetreepos;
        }
        if(applystyle !== 0)  {
        hctx.strokeStyle = "black";
        }
        hctx.lineWidth = topWidth/20;
        hctx.beginPath();
        hctx.moveTo(hcanvas.width / 2 - startX, pos + startY + topWidth);
        hctx.lineTo(hcanvas.width / 2 - endX, pos + endY);
        hctx.stroke();
      }

      //function for drawing each tier in upgrade tree
      var col;
      var darkcol;
      function renderUpgradeTree(type,upgradeTier,xdist,y,fontsize,size){//xdist is horizontal distance between upgrades in upgrade tree
            let array = [];
            if (type == "body"){array = bodyUpgradeMap[upgradeTier];}
            else if (type == "weapon"){array = weaponUpgradeMap[upgradeTier];}
            else if (type == "cbody"){array = celestialBodyUpgradeMap[upgradeTier];type="body";}
            else if (type == "cweapon"){array = celestialWeaponUpgradeMap[upgradeTier];type="weapon";}
            else{console.log("error: unknown upgrade type when rendering upgrade tree: " + type)}
            let x = (array.length - 1)*xdist/2;//starting position of x (total distance divided by two, note that left side of screen is positive x, right side is negative)
            for (const tankname of array) {
              let thisObj;
              let widthAnimation;
              if (type == "body"){
                thisObj = bodyupgrades[tankname];
                widthAnimation = xdistMultiplierb;
              }
              else{
                thisObj = weaponupgrades[tankname];
                widthAnimation = xdistMultiplierw;
              }
              if (thisObj){//if has this upgrade data
                drawUpgradetreeBox(tankname,x*widthAnimation,y,fontsize,size,col,darkcol,type);
                if (!upgradeTreeBoxPositions[tankname]){//first time drawing
                  upgradeTreeBoxPositions[tankname] = {};
                  upgradeTreeBoxPositions[tankname].x = x;
                  upgradeTreeBoxPositions[tankname].y = y;
                }
                //draw connecting lines
                for (const upgradableTank of thisObj.upgradeTo) {//tanks that can upgrade to
                  if (upgradeTreeBoxPositions[upgradableTank]){//has the coords of box (only added on the first drawing)
                    let upgradableTankPosition = upgradeTreeBoxPositions[upgradableTank];
                    drawConnection(x*widthAnimation, y, upgradableTankPosition.x*widthAnimation, upgradableTankPosition.y, size, type);
                  }
                }
              }
              x -= xdist;
            }
          }

        function updateUpgradeTrees(player){
          //draw weapon upgrades
          //rotate tanks:
          bodyangle += 0.02*deltaTime;
          
          if (player.bodyType != previousBody){//upgraded tank
            bodyCanUpgradeTo = getTanksThatCanUpgradeTo(bodyupgrades,player.bodyType)//get list of upgradable tanks to figure out which ones to grey out on upgrade tree
            previousBody = player.bodyType;
          }
          if (player.tankType != previousWeapon){//upgraded tank
            weaponCanUpgradeTo = getTanksThatCanUpgradeTo(weaponupgrades,player.tankType)//get list of upgradable tanks to figure out which ones to grey out on upgrade tree
            previousWeapon = player.tankType;
            //below code is for crossroads darkness
            barrelsDarkness = [];
            correspondingBarrelHeight = {};
            for (const barrel in player.barrels){
              let thisBarrel = player.barrels[barrel];
              if (!barrelsDarkness.includes(thisBarrel.additionalAngle)){//dont allow repeated angles in the array
                if (thisBarrel.additionalAngle < 0){//prevent negaive angles to break the darkness code
                  thisBarrel.additionalAngle += 360;
                }
                barrelsDarkness.push(thisBarrel.additionalAngle)
                if (!correspondingBarrelHeight[thisBarrel.additionalAngle]){//add to list of barrel heights
                  correspondingBarrelHeight[thisBarrel.additionalAngle] = thisBarrel.barrelHeight/player.width - 0.5;//barrel height in terms of player's width
                }
                else if (thisBarrel.barrelHeight > correspondingBarrelHeight[thisBarrel.additionalAngle]){//if barrel height more than height of previous barrel with same angle
                  correspondingBarrelHeight[thisBarrel.additionalAngle] = thisBarrel.barrelHeight/player.width - 0.5;
                }
              }
            }
            barrelsDarkness.sort((a,b)=>b-a);//sort array in descending order of number
          }
          
          hctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
          hctx.textAlign = "center";
          if (showUpgradeTree == "yes" || upgradetreepos > upgradetreestart) {//weapon upgrade tree
            if ( player.tankTypeLevel < 60 && player.bodyTypeLevel < 60 && player.team != "eternal" ) {
              //tier 1 of normal tank weapon upgrade tree
              col = "rgba(" + upgradeButtons[1].color + ")";
              darkcol = "rgba(" + upgradeButtons[1].darkcolor + ")";//need for inside the renderupgradetree function
              renderUpgradeTree("weapon",0,0,-40,13,95);//type,upgradeTier,xdist,y,fontsize,size
              //tier 2
              col = "rgba(" + upgradeButtons[2].color + ")";
              darkcol = "rgba(" + upgradeButtons[2].darkcolor + ")";
              renderUpgradeTree("weapon",1,360,110,13,95);
              //tier 3
              col = "rgba(" + upgradeButtons[3].color + ")";
              darkcol = "rgba(" + upgradeButtons[3].darkcolor + ")";
              renderUpgradeTree("weapon",2,80,260,12,75);
              //tier 4
              col = "rgba(" + upgradeButtons[4].color + ")";
              darkcol = "rgba(" + upgradeButtons[4].darkcolor + ")";
              renderUpgradeTree("weapon",3,60,440,10,55);
              //tier 5
              col = "rgba(" + upgradeButtons[5].color + ")";
              darkcol = "rgba(" + upgradeButtons[5].darkcolor + ")";
              renderUpgradeTree("weapon",4,42,580,8,40);
            } else {
              //eternal upgrade tree
              col = "rgba(125, 14, 230)";
              darkcol = "rgba(95, 0, 200)";
              renderUpgradeTree("cweapon",0,0,-40,15,95);//cweapon instead of weapon for celestials
              
              col = "rgba(165, 14, 230)";
              darkcol = "rgba(135, 0, 200)";
              renderUpgradeTree("cweapon",1,180,245,15,95);

              col = "rgba(204, 2, 245)";
              darkcol = "rgba(174, 0, 215)";
              renderUpgradeTree("cweapon",2,120,530,15,95);
            }

            //animate upgrade tree when opening
            if (showUpgradeTree == "yes" && upgradetreepos < upgradetreeend) {
              upgradetreepos += (upgradetreeend - upgradetreepos) / 7*deltaTime; //speed changes based on amount moved so far. the smaller the number, the faster
              if (upgradetreeend - upgradetreepos < 1) { //if very near end point
                upgradetreepos = upgradetreeend;
              }
              if (xdistMultiplierw < xdistMultiplierEnd){//width animation
                xdistMultiplierw+=(xdistMultiplierEnd - xdistMultiplierw)/7*deltaTime;
              }
              else if (xdistMultiplierw > xdistMultiplierEnd){
                xdistMultiplierw = xdistMultiplierEnd;
              }
            } else if (showUpgradeTree == "no") {
              //if upgrade tree is closing
              upgradetreepos -= (upgradetreepos - upgradetreestart) / 7*deltaTime;
              if (upgradetreepos - upgradetreestart < 1) { //if very near end point
                upgradetreepos = upgradetreestart;
              }
              if (xdistMultiplierw > xdistMultiplierStart){
                xdistMultiplierw-=(xdistMultiplierw - xdistMultiplierStart)/7*deltaTime;
              }
              else if (xdistMultiplierw < xdistMultiplierStart){
                xdistMultiplierw = xdistMultiplierStart;
              }
            }
          } else {
            //if upgrade tree not drawn
            upgradetreepos = upgradetreestart; //reset variable
          }

          if (showBodyUpgradeTree == "yes" || bupgradetreepos > bupgradetreestart) {//body upgrade tree
            if ( player.tankTypeLevel < 60 && player.bodyTypeLevel < 60 && player.team != "eternal" ) {
              //tier 1 of normal tank body upgrade tree
              col = "rgba(" + upgradeButtons[1].color + ")";
              darkcol = "rgba(" + upgradeButtons[1].darkcolor + ")";//need for inside the renderupgradetree function
              renderUpgradeTree("body",0,0,-40,13,95);//type,upgradeTier,xdist,y,fontsize,size
              //tier 2
              col = "rgba(" + upgradeButtons[2].color + ")";
              darkcol = "rgba(" + upgradeButtons[2].darkcolor + ")";
              renderUpgradeTree("body",1,190,110,13,95);
              //tier 3
              col = "rgba(" + upgradeButtons[3].color + ")";
              darkcol = "rgba(" + upgradeButtons[3].darkcolor + ")";
              renderUpgradeTree("body",2,110,260,13,95);
              //tier 4
              col = "rgba(" + upgradeButtons[4].color + ")";
              darkcol = "rgba(" + upgradeButtons[4].darkcolor + ")";
              renderUpgradeTree("body",3,100,410,13,90);
              //tier 5
              col = "rgba(" + upgradeButtons[5].color + ")";
              darkcol = "rgba(" + upgradeButtons[5].darkcolor + ")";
              renderUpgradeTree("body",4,95,540,13,85);
            } else {
              //eternal upgrade tree
              col = "rgba(125, 14, 230)";
              darkcol = "rgba(95, 0, 200)";
              renderUpgradeTree("cbody",0,0,-40,15,95);//cbody instead of body for celestials
              
              col = "rgba(165, 14, 230)";
              darkcol = "rgba(135, 0, 200)";
              renderUpgradeTree("cbody",1,180,245,15,95);

              col = "rgba(204, 2, 245)";
              darkcol = "rgba(174, 0, 215)";
              renderUpgradeTree("cbody",2,155,530,15,95);
            }

            hctx.lineJoin = "miter"; //change it back

            //animate upgrade tree when opening
            if (
              showBodyUpgradeTree == "yes" &&
              bupgradetreepos < bupgradetreeend
            ) {
              bupgradetreepos += (bupgradetreeend - bupgradetreepos) / 7*deltaTime; //speed changes based on amount moved so far. the smaller the number, the faster
              if (bupgradetreeend - bupgradetreepos < 1) { //if very near end point
                bupgradetreepos = bupgradetreeend;
              }
              if (xdistMultiplierb < xdistMultiplierEnd){//width animation
                xdistMultiplierb+=(xdistMultiplierEnd - xdistMultiplierb)/7*deltaTime;
              }
              else if (xdistMultiplierb > xdistMultiplierEnd){
                xdistMultiplierb = xdistMultiplierEnd;
              }
            } else if (showBodyUpgradeTree == "no") {
              //if upgrade tree is closing
              bupgradetreepos -= (bupgradetreepos - bupgradetreestart) / 7*deltaTime;
              if (bupgradetreepos - bupgradetreestart < 1) { //if very near end point
                bupgradetreepos = bupgradetreestart;
              }
              if (xdistMultiplierb > xdistMultiplierStart){
                xdistMultiplierb-=(xdistMultiplierb - xdistMultiplierStart)/7*deltaTime;
              }
              else if (xdistMultiplierb < xdistMultiplierStart){
                xdistMultiplierb = xdistMultiplierStart;
              }
            }
          } else {
            //if upgrade tree not drawn
            bupgradetreepos = bupgradetreestart; //reset variable
          }
        }

        // Mouse tracking (now in screen coordinates)
        let mouseX = 0;
        let mouseY = 0;
        let mouseDown = false;
/*
        canvas.addEventListener('mousemove', (e) => {
            mouseX = e.pageX;
            mouseY = e.pageY;
        });

        canvas.addEventListener('mousedown', () => {
            mouseDown = true;
        });

        canvas.addEventListener('mouseup', () => {
            mouseDown = false;
        });

        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            checkForKeybinds(e.key);
        });

        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });
*/
        // Window resize
        const maxWidth = 1920;
        const maxHeight = 1080;
        function resizeCanvas(){
            let w = window.innerWidth;
            let h = window.innerHeight;
            if (w/maxWidth*maxHeight >= h){//if screen is wider than or equal to a 1920x1080 ratio
              canvas.width = maxWidth;
              canvas.height = window.innerHeight/window.innerWidth*maxWidth;
              hcanvas.width = maxWidth;
              hcanvas.height = window.innerHeight/window.innerWidth*maxWidth;
            }
            else{
              canvas.width = window.innerWidth/window.innerHeight*maxHeight;
              canvas.height = maxHeight;
              hcanvas.width = window.innerWidth/window.innerHeight*maxHeight;
              hcanvas.height = maxHeight;
            }
        }
        function resizeUpgradeButtons() {//upgrade buttons have canvas positions that stays the same even if resize, so need to manually change
          for (let i = 8; i < 15; i++){//only for first 8 buttons on right side of screen (the left side of screen always same cuz coords 0)
            let thisbutton = upgradeButtons[i];
            if (!thisbutton.rawX){console.log("Error occurred: button property rawX not found: " + i)}
            thisbutton.x = hcanvas.width + thisbutton.rawX;
            thisbutton.startx = hcanvas.width + thisbutton.rawX;
            thisbutton.endx = hcanvas.width - thisbutton.rawEndX;
          }
          for (let i = 1; i < 15; i++){//for all the buttons, change Y coords
            let thisbutton = upgradeButtons[i];
            if (!thisbutton.rawY){console.log("Error occurred: button property rawY not found: " + i)}
            thisbutton.y = hcanvas.height - thisbutton.rawY;
          }
        }
        window.addEventListener('resize', () => {
          resizeCanvas();
          resizeUpgradeButtons();
        });
        resizeCanvas();

        function spawnShape() {
            shapes.push(new Shape(
                Math.random() * MAP_WIDTH,
                Math.random() * MAP_HEIGHT
            ));
        }
      
        function showDeathScreen(finalScore,killer,lvl,tank,body) {
            isGamePaused = true;
            document.getElementById('finalScore').textContent = finalScore;
            let timeplayed = Date.now() - startPlayTime;
            let datee = new Date(0);
            datee.setSeconds(timeplayed / 1000); // specify value for SECONDS here
            timeplayed = datee.toISOString().substring(11, 19);
            document.getElementById('totalTime').textContent = timeplayed;
            document.getElementById('killer').textContent = killer;
            document.getElementById('finalLvl').textContent = lvl;
            document.getElementById('playerUpgrade').textContent = tank+"-"+body;
            document.getElementById('deathScreen').classList.remove('hidden');
            quickchat.style.display = "none";
        }

        //FORMULA CONVERSIONS
        //SAME AS SCENEXE
        function convertXPtoLevel(xp,type){
          if (type == "tank"){
            return Math.floor(Math.log((xp+1250/3)/500) / Math.log(1.2)) + 1;//same as scenexe
          }//Math.log is ln
          else if (type == "celestial"){
            return Math.floor(Math.log((xp-23477630.98)/5000000 + 1) / Math.log(1.2)) + 75;
          }
        }
        function XPneededInCurrentLevel(level,type){
          if (type == "tank"){
            return Math.round(100 * Math.pow(1.2,level-1));
          }
          else if (type == "celestial" && level >= 75){
            return Math.round(Math.pow(10,6) * Math.pow(1.2,level-75))
          }
        }
        function minimumXPtoReachLevel(level,type){
          if (type == "tank"){
            return 500 * (Math.pow(1.2,level-1) - 1);
          }
          else if (type == "celestial" && level >= 75){
            return 5000000 * (Math.pow(1.2,level-75) - 1) + 23477630.98;
          }
        }
        function shapeXP(sides,radiance){
          if (radiance == 0){//normal shape
            return 250 + ((1000 * (Math.pow(4,sides-3) - 1)) / 3);
          }
          else{//radiant shape
            return (250 + ((1000 * (Math.pow(4,sides-3) - 1)) / 3)) * 25 * Math.pow(4,radiance-1);
          }
        }
        function shapeHealth(sides){
          return 35 * Math.pow(3.6,sides-3);
        }



        function restartGame() {
            document.getElementById('deathScreen').classList.add('hidden');
            resetGame();
            isGamePaused = false;
            gameLoop();//restart the screen updates
        }

        function resetGame() {
            // Clear all game objects
            bullets.length = 0;
            enemies.length = 0;
            particles.length = 0;

            // Reset player
            if (players.length > 0) {
                players[0].x = MAP_WIDTH / 2;
                players[0].y = MAP_HEIGHT / 2;
                players[0].health = 100;
                players[0].score = 0;
            } else {
                players.push(new Player(MAP_WIDTH / 2, MAP_HEIGHT / 2));
            }

            // Reset score
            score = 0;
            scoreElement.textContent = `Score: 0`;

            // Spawn initial enemies
            for (let i = 0; i < MAX_BOTS; i++) {
                spawnEnemy();
            }
        }

        // Game initialization
        function init() {
            players.push(new Player(MAP_WIDTH / 2, MAP_HEIGHT / 2));
            createParticles(MAP_WIDTH / 2, MAP_HEIGHT / 2, players[0].color, players[0].outline, 15);
            
            // Spawn initial enemies
            for (let i = 0; i < MAX_BOTS; i++) {
                spawnEnemy();
            }
            
            // Spawn initial shapes
            for (let i = 0; i < MAX_SHAPES; i++) {
                spawnShape();
            }
            
            // Update map size display
            mapSizeElement.textContent = `Map: ${MAP_WIDTH}x${MAP_HEIGHT}`;
            botnumberElement.textContent = `Number of enemies: ${MAX_BOTS}`;
            shapenumberElement.textContent = `Number of shapes: ${MAX_SHAPES}`;
            dimensionElement.textContent = `Dimension: ${gamemode}`;
            document.getElementById('restartButton').addEventListener('click', restartGame);
            document.getElementById('continueButton').addEventListener('click', returnToHomeScreen);
            connectedToServer();
            startPlayTime = Date.now();
        }
      
        function connectedToServer(){
          document.getElementById('loadingWords').style.display = "none";
          document.getElementById('loadingWords1').style.display = "none";
          document.getElementById('loadingWords2').style.display = "none";
          document.getElementById('loadingWords3').style.display = "none";
        }

        // Game loop
        function gameLoop() {
            if (isGamePaused) return;//dont do anything if at death screen
            starting = performance.now();//for client tick time
            numberOfObjectsDrawn = 0;
            // Clear canvas by drawing over
            ctx.fillStyle = '#CDCDCD';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (fovAnimation != fov){
              fovAnimation += (fov - fovAnimation)/5;
              if (Math.abs(fov - fovAnimation) < 0.01){//use abs to get diff regardless of positive or negative diff
                fovAnimation = fov;
              }
              fovscale = 1/fovAnimation;
            }
            ctx.save();
            ctx.translate(canvas.width/2,canvas.height/2);//to scale from the middle of screen
            ctx.scale(fovscale,fovscale);//scale for the ENTIRE GAME LOOP, if fov is 2, then scale by 1/2 so everything is smaller
            //ctx.translate(-canvas.width/2*fov,-canvas.height/2*fov);//CORRECT CODE, but to lazy to change to the correct code cuz lots of other stuff need to change
            ctx.translate(-canvas.width/2,-canvas.height/2);//translate back to normal
            if (fov < 5){//dont draw grids if they are barely visible
              drawGrid();
            }
            drawMapBoundary();//draw area outside map (translucent rectangles so that grids also change color)
          
            // Update and draw shapes first, so that they will be drawn below everything else
            shapes.forEach(shape => {
                shape.update();
                shape.draw();
            });
            
            // Update enemies
            enemies.forEach(enemy => {
                enemy.update();
                enemy.draw();
            });

            // Update and draw all game objects
            players.forEach(player => {
                player.update();
                player.draw();
            });

            // Update bullets and remove dead ones
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].update() && bullets.splice(i, 1);
            }
            bullets.forEach(bullet => bullet.draw());

            // Update particles and remove dead ones (draw particles last so that they are above everything else)
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update() && particles.splice(i, 1);
            }
            particles.forEach(particle => particle.draw());

            // Occasionally spawn new enemies
            if (Math.random() < 0.01 && enemies.length < MAX_BOTS) {
                spawnEnemy();
            }
          
            ctx.restore();//restore the fov scaling (BEFORE minimap so that it will not be affected by FOV)
            //if debug is open, and if dimension is not crossroads or cavern:
            drawMinimap()

            hctx.clearRect(0, 0, hcanvas.width, hcanvas.height);
            updateUpgradeTrees(players[0]);//DRAW THE UPGRADE TREES AND UPDATE ANGLES
          
            //update debug
            let newtext = `Drawn Entities: ${numberOfObjectsDrawn}`;
            if (drawnentitiesElement.textContent != newtext){//dont update debug 60 times per second, only update when needed (idk if this will change the performance or not)
              drawnentitiesElement.textContent = newtext;
            }
            positionDiv.textContent = "Position: " + Math.round(players[0].x * 100) / 100 + "," + Math.round(players[0].y * 100) / 100;//2 decimal places
            // FPS counter update
            frameCount++;
            const now = performance.now();
            if (now >= lastFpsUpdate + 1000) { // Update every second
                fps = frameCount;
                frameCount = 0;
                lastFpsUpdate = now;
                fpsCounter.textContent = `FPS: ${fps}`;
                fpsCounter.className = 
                  fps >= 45 ? 'high' : 
                  fps >= 15 ? 'medium' : 'low';
            }
            //update tick time
            if (clientTick > 5){
              clientTickDiv.style.color = "yellow";
            }
            else if (clientTick > 15){
              clientTickDiv.style.color = "red";
            }
            else{
              clientTickDiv.style.color = "white";
            }
            clientTickDiv.textContent = "Client Tick Time: " + Math.round(clientTick * 10) / 10 + "ms";//change to 1 decimal place
            clientTick = performance.now() - starting;

            requestAnimationFrame(gameLoop);
        }
      
        function drawPolygon(sides,x,y,rot){//only for home screen background
            let shapetype = sides-3;
            if (sides == 4){//square and triangle are the anomalies that dont follow the sides
              shapetype = 0;
            }
            else if (sides == 3){
              shapetype = 1;
            }
            const size = shapesizes[shapetype];
            hctx.save();
            hctx.translate(x-hsCameraX, y-hsCameraY);
            hctx.rotate(rot/180*Math.PI);
            hctx.fillStyle = shapecolors[shapetype];
            hctx.strokeStyle = shapeoutlines[shapetype];
            switch(shapetype) {
                    case 0: // Square
                        hctx.fillRect(-size/2, -size/2, size, size);
                        hctx.strokeRect(-size/2, -size/2, size, size);
                        break;
                    case 1: // Triangle
                        hctx.beginPath();
                        for (let i = 0; i < 3; i++) {
                            const angle = (i * Math.PI * 2 / 3) - Math.PI/2;
                            hctx.lineTo(
                                Math.cos(angle) * size/2,
                                Math.sin(angle) * size/2
                            );
                        }
                        hctx.closePath();
                        hctx.fill();
                        hctx.stroke();
                        break;
                    default: // All other polygons
                        hctx.beginPath();
                        for (let i = 0; i < sides; i++) {
                            const angle = (i * Math.PI * 2 / sides) - Math.PI/2;
                            hctx.lineTo(
                                Math.cos(angle) * size/2,
                                Math.sin(angle) * size/2
                            );
                        }
                        hctx.closePath();
                        hctx.fill();
                        hctx.stroke();
                }
          
            hctx.restore();
        }

        function drawFakePlayer2(team,weapontype,bodytype,x,y,rot,size){//only for home screen background
          drawFakePlayer(bodytype,x-hsCameraX, y-hsCameraY,size/2,rot/180*Math.PI,bodyColors[team].col,bodyColors[team].outline,"bodyu");//body under
          drawFakePlayer(weapontype,x-hsCameraX, y-hsCameraY,size/2,rot/180*Math.PI,bodyColors[team].col,bodyColors[team].outline,"weapon");//weapon upgrade
          drawFakePlayer(bodytype,x-hsCameraX, y-hsCameraY,size/2,rot/180*Math.PI,bodyColors[team].col,bodyColors[team].outline,"bodya");//body above
        }
      
        //drawing canvas for homescreen background
        let animationZoomValue = 1.8;//always start from this zoom value, then zoom in
        let zoom = animationZoomValue;
        let zoomScale = 1/zoom;
        let darknessValue = 0;//scren slowly become darker when opening website
        let drawingGamemode = currentGamemodeID;//the gamemode that is being drawn on home screen. While gamemode changes immediately when clicking arrow, this value changes after 0.6 seconda (when black oval is half way across the screen)
        function homeScreenLoop() {
            if (state == "ingame") return;//dont do anything if ingame
            //start drawing the homescreen if not ingame
            hctx.fillStyle = '#CDCDCD';
            hctx.fillRect(0, 0, hcanvas.width, hcanvas.height);
            if (zoom > 1){
              //zoom -= 0.005;
              zoom -= (zoom - 1)/13;
              if (zoom < 1.001){
                zoom = 1;
              }
              zoomScale = 1/zoom;
            }
            hctx.save();
            hctx.translate(hcanvas.width/2, hcanvas.height/2);//translate to middle of screen so that scale from there
            hctx.scale(zoomScale,zoomScale);//zoom animations
            hctx.translate(-hcanvas.width/2, -hcanvas.height/2);//translate back
            drawGridHomeScreen();//(no need draw boundary of map)
            //now draw the stuff
            hctx.lineJoin = "round";//to make shape corners round
            hctx.lineWidth = 4;
            //drawPolygon(sides,x,y,rot)
            //drawFakePlayer(team,tanktype,x,y,rot,size)
            //map size is 3000
            if (drawingGamemode == 0){//PvE arena
              drawPolygon(11,2276,1677,3)
              drawPolygon(9,1500,1500,236)
              drawPolygon(8,776,1450,261)
              drawPolygon(7,776,1050,195)
              drawPolygon(6,1790,1069,56)
              drawPolygon(5,1399,1997,228)
              drawPolygon(4,1784,1967,319)
              drawPolygon(3,776,1910,249)
              drawPolygon(3,1046,1288,91)
              drawPolygon(3,2790,2069,204)
            }
            else if (drawingGamemode == 1){//FFA
              drawPolygon(10,600,1500,30)
              drawPolygon(9,2100,1700,55)
              drawPolygon(8,1000,1700,30)
              drawPolygon(7,1200,2000,350)
              drawPolygon(5,999,1897,0)
              drawPolygon(4,1300,1580,50)
              drawPolygon(4,1230,1600,340)
              drawPolygon(3,1270,1530,0)
              drawFakePlayer2("red","split","wall",890,2000,45,50)
              drawFakePlayer2("red","beta","thorn",750,2150,45,60)
              drawFakePlayer2("red","alpha","saw",1100,1450,70,70)
              drawFakePlayer2("red","annihilator","ziggurat",1400,2050,20,70)
              drawFakePlayer2("red","emperor","mothership",1980,1250,20,70)
              drawFakePlayer2("red","wave","saw",2200,1350,290,70)
              drawFakePlayer2("red","palisade","bombard",2500,2050,45,70)
              drawFakePlayer2("red","riot","inferno",1470,1050,170,70)
              drawFakePlayer2("red","marksman","saw",890,1050,60,70)
              drawFakePlayer2("eternal","thunderstorm","chasm",1470,1530,55,90)
              //drawFakePlayer2("celestial","pulsar","chasm",1470,1530,55,90)//use this if change to scenexe celestials
            }
            else if (drawingGamemode == 2){//2tdm
              drawPolygon(9,2100,2200,55)
              drawPolygon(8,450,1700,350)
              drawPolygon(7,750,1350,350)
              drawPolygon(7,1900,1200,350)
              drawPolygon(5,900,1800,350)
              drawFakePlayer2("red","assassin","artillery",1600,1150,225,60)
              drawFakePlayer2("red","penta","saw",1680,1400,270,70)
              drawFakePlayer2("red","alpha","saw",1600,1700,270,70)
              drawFakePlayer2("red","amalgam","bastion",1625,1600,260,70)
              drawFakePlayer2("red","blockade","artillery",1900,1560,45,60)
              drawFakePlayer2("red","palisade","bombard",1830,1650,290,70)
              drawFakePlayer2("red","minigun","ziggurat",1600,1840,280,70)
              drawFakePlayer2("red","trio","artillery",1830,1860,270,60)
              drawFakePlayer2("red","arc","artillery",1715,1940,300,60)
              drawFakePlayer2("red","marksman","saw",2250,1250,220,70)
              drawFakePlayer2("red","riot","inferno",2400,1750,285,70)
              
              drawFakePlayer2("blue","conglomerate","thorn",1300,1300,145,60)//note: 90 degrees is pointing right
              drawFakePlayer2("blue","manager","castle",1300,1400,135,60)
              drawFakePlayer2("blue","quadro","ziggurat",1350,1500,110,70)
              drawFakePlayer2("blue","streamliner","saw",1400,1700,90,70)
              drawFakePlayer2("blue","beta","thorn",1200,1800,60,60)
              drawFakePlayer2("blue","annihilator","bastion",1370,1850,60,70)
              drawFakePlayer2("blue","gunner","artillery",1300,1950,45,60)
              drawFakePlayer2("blue","octo","quadruplet",1000,1650,80,70)
              drawFakePlayer2("blue","emperor","mothership",1200,2000,60,70)
              drawFakePlayer2("blue","executive","ziggurat",1000,1050,105,70)
              drawFakePlayer2("blue","horizon","fabricator",1000,1970,80,70)
              drawFakePlayer2("blue","split","wall",800,1900,80,50)
              drawFakePlayer2("blue","duo","turret",1250,1650,80,50)
            }
            else if (drawingGamemode == 3){//4tdm
              drawPolygon(10,1600,1700,55)
              drawPolygon(10,1050,1000,0)
              drawPolygon(7,750,1700,350)
              drawPolygon(5,2300,1700,350)
              drawFakePlayer2("red","trio","castle",1500,2000,30,60)
              drawFakePlayer2("red","palisade","bombard",1400,1930,10,70)
              drawFakePlayer2("red","penta","saw",800,2130,315,70)
              drawFakePlayer2("purple","mono","sentry",750,1550,170,50)
              drawFakePlayer2("purple","annihilator","bombard",1300,1600,100,70)
              drawFakePlayer2("purple","riot","saw",1350,1450,135,70)
              drawFakePlayer2("purple","flank","fortress",1470,1430,135,50)
              drawFakePlayer2("purple","horizon","ziggurat",550,1130,280,70)
              drawFakePlayer2("green","overlord","battleship",1700,1390,180,60)
              drawFakePlayer2("green","shrapnel","inferno",1850,1450,170,70)
              drawFakePlayer2("green","gunner","artillery",1900,1550,260,60)
              drawFakePlayer2("green","trapper","smasher",1870,1650,260,50)
              drawFakePlayer2("green","mono","node",2300,1100,45,50)
              drawFakePlayer2("blue","manufacturer","saw",2100,1830,280,70)
              drawFakePlayer2("blue","arsenal","ziggurat",1880,1930,305,70)
              drawFakePlayer2("blue","spread","triplet",1780,1950,325,60)
            }
            else if (drawingGamemode == 4){//tank editor
              hctx.fillStyle = "rgba(89, 168, 192, 0.3)";//draw safe zone
              hctx.fillRect(1200-hsCameraX,1550-hsCameraY,1500,1500);
              drawPolygon(10,1900,2100,0)
              drawPolygon(9,1300,2250,0)
              drawPolygon(8,2200,1650,0)
              drawPolygon(7,1900,1450,0)
              drawPolygon(6,1100,1750,0)
              drawPolygon(6,1350,1950,0)
              drawPolygon(5,650,1900,0)
              drawPolygon(5,1750,1250,0)
              drawPolygon(5,1100,2000,0)
              drawPolygon(3,500,2075,0)
              drawPolygon(3,650,1250,0)
              drawFakePlayer2("blue","split","wall",1300,1600,10,50)
            }//increase x value to move right, increase y value to move downwards
            //im assuming 0 degrees is pointing upwards, check this later
            hctx.restore();//restore zoom
            if (darknessValue < 0.5){
              darknessValue += 0.02;
            }
            hctx.fillStyle = 'rgba(0,0,0,'+darknessValue+')';//make homescreen background darker
            hctx.fillRect(0, 0, hcanvas.width, hcanvas.height);
            //now move the camera
            hsCameraX = hsMAP_SIZE/2 + rotationRadius*Math.cos(rotationAngle/180*Math.PI) - hcanvas.width / 2;
            hsCameraY = hsMAP_SIZE/2 + rotationRadius*Math.sin(rotationAngle/180*Math.PI) - hcanvas.height / 2;
            //rotationAngle++;//good for testing
            rotationAngle+=0.2;
            if(rotationAngle>=360){
              rotationAngle-=360;
            }

            requestAnimationFrame(homeScreenLoop);
        }
        homeScreenLoop();

        playButton.addEventListener('click', startGame);
        function startGame(){
          state = "ingame";
          officialGameStart = "no";//becomes "yes" when receive gam info packet
          //remove home screen divs
          playButton.style.display = "none";
          if (gamemode == "PvE arena"){
            //hcanvas.style.display = "none";
            document.getElementById('score').style.display = "block";
            botnumberElement.className = "debugopen";
            shapenumberElement.className = "debugopen";
          }
          else{
            document.getElementById('score').style.display = "none";
            botnumberElement.className = "debug";
            shapenumberElement.className = "debug";
          }
          nameInput.style.display = "none";
          document.getElementById('connecting').style.display = "none";
          changelogPreview.style.display = "none";
          document.getElementById('hometitle').style.display = "none";
          subtitle.style.display = "none";
          document.getElementById('subsubtitle').style.display = "none";
          document.getElementById('gamemodeSelector').style.display = "none";
          document.getElementById('left-buttons').style.display = "none";
          document.getElementById('top-buttons').style.display = "none";
          document.getElementById('right-buttons').style.display = "none";
          signupdiv.style.display = "none";
          //open debug
          /*
          fpsCounter.style.display = "block";
          let allOtherDebugDivs = document.querySelectorAll(".debug");
          for(let i = 0; i < allOtherDebugDivs.length; i++){
            document.getElementById(allOtherDebugDivs[i].id).className = "debugopen";
          }
            */
          document.getElementById("debugContainer").style.display = "flex";//open debug
          debugState = "open";
          //start the game
          hctx.fillStyle = "#cdcdcd";
          hctx.fillRect(0,0,hcanvas.width,hcanvas.height);
          document.getElementById('loadingWords').style.display = "block";
          document.getElementById('loadingWords1').style.display = "block";
          setTimeout(() => {
            if (document.getElementById('loadingWords1').style.display == "block"){
              document.getElementById('loadingWords2').style.display = "block";
            }
          }, 5000);//if still on loading screen 5 seconds later, add the next loading screen words
          setTimeout(() => {
            if (document.getElementById('loadingWords2').style.display == "block"){
              document.getElementById('loadingWords3').style.display = "block";
            }
          }, 15000);//if still on loading screen 15 seconds later, add the next loading screen words
          if (currentGamemodeID == 0){
            init();
            gameLoop();
          }
          else{
            //only do once
            let yourName = nameInput.value;
            let mySlurslist = ["n!g","nig","fag","f@g","fuck","fuk","porn","bitch","bich","dick","cunt","cock","penis","slut","pussy",];
            for (const i of mySlurslist) {
              yourName = yourName.replace(i, "*".repeat(i.length));//if name has fuck, will become ****
            }
            let packet = JSON.stringify(["joinGame", yourName]);
            socket.send(packet)
            startPlayTime = Date.now();//needed to get time played

            if (gamemode=="Tank Editor" && shownEditButton=="no"){
              document.getElementById("openEditor").style.display = "block";
              shownEditButton = "yes";
            }
            //clear list of objects
            objects = {
              wall: {},//walls drawn below everything
              gate: {},
              Fixedportal: {},
              shape: {},
              bot: {},
            };//shapes and bots always below player, fixed portals always under everything
            portals = {};
            oldportals = {};
            screenDrawLoop();//start the canvas drawing
            try {//store name, so next time when open the game, will auto-fill the previous name
              localStorage.prevname = yourName;
            } catch (e) {
              console.log("An error occured when saving your name: " + e);
            }
            if (mobile == "yes"){
              /* Get the documentElement (<html>) to display the page in fullscreen */
              let elem = document.body;
              /* View in fullscreen */
              if (elem.requestFullscreen) {
                elem.requestFullscreen();
              } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
              } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
              }
            }
          }
        }
        function loadChangelog() {//copied from scenexe2 code, thanks cobalt
          return new Promise(function (AS) {
            fetch("/changelog.txt").then(function (AU) {
              return AU.text();
            }).then(function (AU) {
              (function (AP) {
                var AR = "";
                var WI = "";
                for (var AQ = ("CHANGELOG - " + (WI = AP.split("\n\r\n"))[0]).split("\n"), AB = 0; AB < AQ.length; AB++) {
                  if (!AQ[AB].startsWith("    ")) {//no indent
                    AR += AR == "" ? AQ[AB] : "<br />" + AQ[AB];//add break line br if this isnt the first line (AR is not "")
                  }
                  else{//assume that lines with indent are not the first line
                    //e.g.
                    //-bug fixes
                    //(indent)-fixed .....
                    let PI = "";//replace tab indents with tab characters (tab indents doesnt show in html)
                    for (let indent = 0; AQ[AB].startsWith("    ", indent * 4); indent++) {//allow 4 indents max
                      PI += "&emsp;&emsp;";//add paragraph indentation in changelog
                    }
                    AR += ("<br />" + PI + AQ[AB]);
                  }
                }//get the first paragraph (latest version update) (version updates are separated by an empty line in the changelog txt file)
                let additionaltext = "<br>you can view the full changelog ";//leave a blank space cuz we're adding a word after that
                changelogPreview.innerHTML = AR.replace(/\n/g, "<br />") + additionaltext;//replace text new line with html new line, and add to the div
                
                const hereButton = document.createElement("div");
                hereButton.innerText = "here";
                hereButton.id = "openChangelogButton";
                changelogPreview.appendChild(hereButton);
                hereButton.addEventListener("click", () => {
                  fullchangelog.style.display = "block";
                });
                
                subtitle.textContent = WI[0].split("-", 1)[0].trim();//add the version no. to subtitle div
                //now fix the entire changelog text
                AR = "";
                for (var AX = 0; AX < WI.length; AX++) {
                  if (AR != "") {
                    AR += "<br /><br /><hr />";//add horizontal line in changelog
                  }
                  for (var AF = WI[AX].split("\n"), Az = 0; Az < AF.length; Az++) {
                    var Aj = 0;
                    var S0 = "";
                    for (Aj = 0; AF[Az].startsWith("    ", Aj * 4); Aj++) {
                      S0 += "&emsp;&emsp;";//add paragraph indentation in changelog
                    }
                    if (Az == 0) {
                      AR += "<h3>";//font size
                    } else if (AR != "" && Az != 1) {
                      AR += "<br />";//new line
                    }
                    AR += S0 + AF[Az];
                    if (Az == 0) {
                      AR += "</h3>";
                    }
                  }
                }
                fullchangelog.children[0].children[2].innerHTML = AR.replace(/\n/g, "<br />");
              })(AU.replace(/\r?\n/g, "\r\n"));
              AS();
            });
          });
        }
        loadChangelog();
      
        export function accounts(){//not ready yet
          document.getElementById('modal').style.display = "block";
          darken.style.display = "block";
        }
        export function bugs(){//ingame method to report bugs, not ready yet
          document.getElementById('modal2').style.display = "block";
          darken.style.display = "block";
        }
        function closeModalFunction(modalID){//using modal ID, for modals only e.g. disconnect modal
          let thisModal = document.getElementById(modalID);
          thisModal.style.animation = "flyToTop .5s";//0.5 seconds animation fade out
          darken.style.animation = "opacityFadeOpp .5s";
          setTimeout(() => {
            thisModal.style.display = "none";//hide divs
            darken.style.display = "none";
            thisModal.style.animation = "dropFromTop .5s";//reset animation to what is stated in html
            darken.style.animation = "opacityFade .5s";
          }, 500);//0.5 seconds for animation
        }
        function closePopupFunction(popupBackground,popup){//using the popup div variable, for popups only e.g. changelog and settings
          popup.style.animation = "flyToTop .5s";//0.5 seconds animation fade out
          popupBackground.style.animation = "opacityFadeOpp .5s";
          setTimeout(() => {
            popupBackground.style.display = "none";//hide popup
            popup.style.animation = "dropFromTop .5s";//reset animation to what is stated in html
            popupBackground.style.animation = "opacityFade .5s";
          }, 500);//0.5 seconds for animation
        }
        export function closeModal(){
          closeModalFunction('modal')
        }
        export function closeModal2(){
          closeModalFunction('modal2')
        }
        export function closeModal3(){//disconnected modal
          closeModalFunction('modal3')
          //reconnect
          connectServer(serverlist[joinedWhichGM],"no")//join the gamemode which you spawned in
          gamemode = joinedWhichGM;
        }
        export function closeModal3a(){//connection error modal
          closeModalFunction('modal3a')
          //reconnect
          connectServer(serverlist[joinedWhichGM],"no")//join the gamemode which you spawned in
          gamemode = joinedWhichGM;
        }
        export function closeModal5(){
          closeModalFunction('login')
        }
        export function closeModal6(){
          closeModalFunction('signup')
        }
        export function closeModal7(){
          closeModalFunction('modal7')
        }
        export function closeModal8(){//ad blocker
          closeModalFunction('modal8')
        }
        if( window.skibidiGyatt === undefined ){//if ad block is turned on (prevents this from being set in prebid-ads.js file)
          document.getElementById('modal8').style.display = "block";
          darken.style.display = "block";
        }
        let quickchats = {};
        export function openModalquickchat(){
          quickchat.style.display = "none";
          document.getElementById("quickchatmsg").style.display = "block";
          darken.style.display = "block";
        }
        export function closeModalquickchat(){
          quickchat.style.display = "block";
          closeModalFunction('quickchatmsg')
        }
        export function createquickchat(){
          //add quick chat to the next slice, e.g. if first slice is filled, but user click the 3rd slice, still add to the 2nd slice
          quickchat.style.display = "block";
          closeModalFunction('quickchatmsg')
          let newquickchat = document.getElementById('createQuickChat').value;
          if (newquickchat != "" && newquickchat.length < 750){//max length of chats are 750 (if change this, change on server side too)
            if (Object.keys(quickchats).length < 4){//max 4 quick chats for now, cannot increase unless change the html div (need lots of changes though)
              let id = Object.keys(quickchats).length+1;
              quickchats[id] = newquickchat;
              let parentID = "quickchat"+id;
              document.querySelector('#'+parentID).querySelector('.actualqc').textContent = newquickchat;
              document.querySelector('#'+parentID).querySelector('.thecross').style.display = "none";
              document.querySelector('#'+parentID).querySelector('.qcmore').style.display = "block";
              document.querySelector('#'+parentID).querySelector('.qcnumber').style.display = "block";
            }
          }
        }
        function returnToHomeScreen(type){//if type does not exist: return from death screen to home screen, or else if type is disconnect
          state = "homepage";
          if (!type){
            //playButton.style.display = "block";
            //nameInput.style.display = "block";//later gonna connect anyway
          }
          hcanvas.style.display = "block";
          //document.getElementById('connecting').style.display = "block";
          changelogPreview.style.display = "block";
          document.getElementById('hometitle').style.display = "block";
          subtitle.style.display = "block";
          document.getElementById('subsubtitle').style.display = "block";
          document.getElementById('gamemodeSelector').style.display = "block";
          document.getElementById('left-buttons').style.display = "flex";//FLEX, NOT BLOCK (CUZ its a flexbox)
          document.getElementById('top-buttons').style.display = "flex";
          document.getElementById('right-buttons').style.display = "flex";
          signupdiv.style.display = "block";
          document.getElementById('score').style.display = "none";
          fpsCounter.style.display = "none";
          let allOtherDebugDivs = document.querySelectorAll(".debug");
          for(let i = 0; i < allOtherDebugDivs.length; i++){
            document.getElementById(allOtherDebugDivs[i].id).className = "debug";
          }
          debugState = "close";
          document.getElementById('deathScreen').classList.add('hidden');
          if (!type){
            document.getElementById('respawnInfo').style.display = "block";
          }
          
          if (shownEditButton=="yes"){
            document.getElementById("openEditor").style.display = "none";
            shownEditButton = "no";
          }

          if (gamemode != "PvE arena"){
            if (!type){
              //if not already disconnected, only died and reconnecting to respawnable gamemode (if disconnect, user will get modal3 popup asking to reconnect)
              reconnectToDefault = "yes";//prevent disconnect notification
              socket.close();//disconnect from current server
              connectServer(serverlist[joinedWhichGM],"no")//join the gamemode which you spawned in. If you spawned in FFA and died in 2tdm, you can only respawn in FFA
              gamemode = joinedWhichGM;
            }
          }
          else{//PvE singleplayer
            playButton.style.display = "block";
            nameInput.style.display = "block";
          }
        }
      
        //ABOVE IS SINGLEPLAYER CODE
        //------------------------------------------------------------------------------------------------------------------------------------------------
        //BELOW IS MULTIPLAYER CODE (COPIED FROM OLD ROCKETER)
        
        var connected = "no";
        var mainMenuOpacity = 0;
        var state = "homepage"; //homepage, ingame, or deathscreen
        var officialGameStart = "no";//only becomes yes when receive game info
        var drawAreaX = 0; //these two variable placed outside so that can access in mousemove event listener
        var drawAreaY = 0;
        var px = 0;
        var py = 0;
        var oldcamerax = 0;
        var oldcameray = 0;
        var canLogIn = 0; //used for account log in and sign ups
        var accusername = 0;
        var accpassword = 0;
        var accdesc = 0;
        var acctype = "error";
        var loggedInAccount = {};
        var clientAngle = 0;
        var mobile = "no";
        var mobileSentMousePress = "no";
        var crDarknessSize = 0;//darkness growth and shrink in crossroads
        var darknessGrowth = "yes";//determine if growing or shrinking
        var barrelsDarkness = [];//list of barrels in decreasing angle for crossroads darkness
        var correspondingBarrelHeight = {};//height of barrel for crossroads darkness

        var gateTimer = 0.5;//animation for gates
        var startGate = gateTimer;
        var endGate = 9;
        var gatearrow = [90,70,40,20];

        //animate player chats
        var chatlist = {};
        var typingAnimation = 20;

        //animate shape health bar length
        var shapeHealthBar = {};

        //animate skill points number font size
        var extraFontSize = 0;
        var oldskillpointnumber = 0;

        var achievementList;
        var achcolors;

        //keep track of number of upgrade buttons for ignore button to position correctly
        var maxnumberofbuttons = 0;
        var maxnumberofbuttonsb = 0;

        var barrelnumberid = 1;//for tank editor display id. the actual ids for barrels are different
        var assetnumberid = 1;
        var gadgetnumberid = 1;

        //buttons for skill points
        var skillpointsbutton = [
          {hover: "no", clickable: "no",},
          {hover: "no", clickable: "no",},
          {hover: "no", clickable: "no",},
          {hover: "no", clickable: "no",},
          {hover: "no", clickable: "no",},
          {hover: "no", clickable: "no",},
          {hover: "no", clickable: "no",},
          {hover: "no", clickable: "no",},
        ];

        var skillpointsanimation = [0,0,0,0,0,0,0,0];//animate width slowly towards actual position

        var levelwhenignorew = -1;//level when u clicked the ignore button
        var levelwhenignoreb = -1;//level when u clicked the ignore button

        //store player body color for upgrade buttons and tree to have same color
        var playerBodyCol = "";
        var playerBodyOutline = "";

        //ensure that animation run at same speed for different fps
        var prevLoopTime = 0;
        var deltaTime = 1;

        const notifications = document.getElementById("notifFlex");
        function createNotif(text,color,timer){
          const notifone = document.createElement("div");
          notifone.className = "alert";
          notifone.innerText = text;
          notifone.style.backgroundColor = color;
          notifications.prepend(notifone);//prepend is appendchild but insert at top
          setTimeout(() => {
            notifone.style.animation = "animateNotifRemove .5s";//0.5 seconds animation fade out
          }, (timer-500));//0.5 seconds before removing
          setTimeout(() => {
            notifone.remove();
          }, timer);
        }

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {//check if this is a mobile device
          document.getElementById('modal7').style.display = "block";
          darken.style.display = "block";
          mobile = "yes";
        } else {
          // false for not mobile device
          console.log("Not a mobile user. If you are, please report this as a bug.");
        }

        document.addEventListener("contextmenu", (event) =>
          event.preventDefault()
        );//contextmenu is right click popup


        var teleportingTransition = "no";//transition for teleporting
        var teleportingLocation = "error";
        var oldteleportingLocation = "error";
        var teleportingcount = 0;//moves the black background and the transparency animation
        var reconnectToDefault = "no";//when die, reconnect to spawning server, e.g. ffa

        //for the tank editor
        var shownEditButton = "no";
        var openedUI = "no";
        var safeZone = 2000;
        var safeZoneColor = "rgba(133, 194, 212, .5)";

        //keep track of the previous mouse position, and only send the new mouse position when there is a difference of 5px (or else mousemove event listener will trigger every 1px of movement)
        var oldmousex = 0;
        var oldmousey = 0;
        var prevSendMouse = 0;

        //keep track of old player tank and body type to spawn particle when upgrading
        var oldtank = "";
        var oldbody = "";

        //keep track of portal sizes when player touch it
        var portalwidths = {};
        //keep track of radiant shape colors
        var radiantShapes = {};
        var crossroadRadians = 0;
          
        //store settings in computer so that always same when open browser
        let settingsList = {//default settings
          showchat: true,
          showname: true,
          clickablechatlinks: true,
          showownname: false,
          silenttyping: false,
          showtypingindicators: true,
          showids: false,
          showticktime: true,
          showservername: true,
          showplayercount: true,
          showglobalplayercount: true,
          showfps: true,
          showping: true,
          showposition: false,
          showextraperformanceinfo: false,
          showhitboxes: true,
          showminimap: true,
          showhealthpercentages: false,
          showhealthbarHUD: false,
          1: "ESCAPE",
          2: "ENTER",
          3: "SLASH",
          4: "T",
          5: "SPACE / MOUSE DOWN",
          6: "SHIFT",
          7: "W",
          8: "A",
          9: "S",
          10: "D",
          11: "UP ARROW",
          12: "DOWN ARROW",
          13: "LEFT ARROW",
          14: "RIGHT ARROW",
          15: "E",
          16: "C",
          17: "X",
          18: "V",
          19: "M",
          20: "Y",
          21: "U",
          22: "O",
        }
        let temporarySettings = {};//track changes to settings, which only actually change when user clicks the 'apply' button
        
        if(localStorage.settings == undefined) {
          //localStorage.settings = JSON.stringify({"spawnduneparticle":"yes","spawncrossroadsparticle":"yes","spawnradparticle":"yes","showStaticMobName":"no","showMinionMobName":"no","showshapeinfo":"no","radiantSizeRange":5,"theme":"default",showstats:"no",});
          localStorage.settings = JSON.stringify(settingsList);
        }
        else{
          //check if stored settings and new settings are the same
          let old = Object.keys(JSON.parse(localStorage.settings)).sort();
          let current = Object.keys(settingsList).sort();//sort by alphabetical order to prevent differet ordering from causing mismatch
          if (JSON.stringify(old) === JSON.stringify(current)){//usual
            settingsList = JSON.parse(localStorage.settings);
          }
          else{//update
            let newsettings = {};
            let oldsettings = JSON.parse(localStorage.settings);
            for (const settingProp in settingsList) {//loop through new settings
              if (oldsettings.hasOwnProperty(settingProp)){//this setting existed, didnt change
                newsettings[settingProp] = oldsettings[settingProp];
              }
              else{//new setting!
                newsettings[settingProp] = settingsList[settingProp];
              }
            }
            //now update the settings
            settingsList = newsettings;
            localStorage.settings = JSON.stringify(newsettings);
            console.log("Updated settings. This is due to an update.")
          }
        }
          
        //now we update the divs (the switches)
        console.log(settingsList)
        for (const settingProp in settingsList) {//loop through all settings
          if (settingsList[settingProp] === true){
            document.getElementById(settingProp).checked = true;//.setAttribute('checked','true');
          }
          else if (settingsList[settingProp] === false){
            document.getElementById(settingProp).checked = false;//.removeAttribute('checked');
          }
          else if (settingProp.startsWith("1")||
          settingProp.startsWith("2")||
          settingProp.startsWith("3")||
          settingProp.startsWith("4")||
          settingProp.startsWith("5")||
          settingProp.startsWith("6")||
          settingProp.startsWith("7")||
          settingProp.startsWith("8")||
          settingProp.startsWith("9")){//keybind (properties are numbers, but obj prop names are converted to strings)
            //settingsList[settingProp];//add function to change keybinds in the future
          }
          else{//invalid property value
            console.log("AN ERROR OCCURRED WHEN CHECKING SETTINGS: INVALID SETTING TYPE " + settingProp);
          }
        }
          
        export function updateTempSettings(id){//user changed a setting, but DONT change the actual setting until the user clicks the "apply" button
          if (settingsList.hasOwnProperty(id)){//if a legit setting
            if (temporarySettings.hasOwnProperty(id)){//this user changed this setting before, but havent applied changes
              if (temporarySettings[id] === true){
                temporarySettings[id] = false;
              }
              else{
                temporarySettings[id] = true;
              }
            }
            else{//first time changing this setting (since the last time the user clicked 'apply')
              if (settingsList[id] === true){
                temporarySettings[id] = false;
              }
              else{
                temporarySettings[id] = true;
              }
            }
            console.log("updated " + id + " to " + temporarySettings[id])
          }
          else{
            console.log("AN ERROR OCCURRED WHEN UPDATING SETTINGS: INVALID SETTING " + id)
          }
        }
        function applySettings(){//update settings
          for (const settingProp in temporarySettings) {
            settingsList[settingProp] = temporarySettings[settingProp];
            //only those settings which require change in html divs (other settings such as hitboxes are canvas-based, so those are in the game loop function, not here)
            switch(settingProp) {
              case "showticktime":
                if (settingsList[settingProp] === true){
                  document.getElementById("servertick").className = "debugopen";
                  document.getElementById("clienttick").className = "debugopen";
                }
                else{
                  document.getElementById("servertick").className = "debug";
                  document.getElementById("clienttick").className = "debug";
                }
                break;
              case "showservername":
                if (settingsList[settingProp] === true){
                  document.getElementById("dimension").className = "debugopen";
                }
                else{
                  document.getElementById("dimension").className = "debug";
                }
                break;
              case "showplayercount":
                if (settingsList[settingProp] === true){
                  document.getElementById("playercount").className = "debugopen";
                }
                else{
                  document.getElementById("playercount").className = "debug";
                }
                break;
              case "showglobalplayercount":
                if (settingsList[settingProp] === true){
                  document.getElementById("globalplayercount").className = "debugopen";
                }
                else{
                  document.getElementById("globalplayercount").className = "debug";
                }
                break;
              case "showfps":
                if (settingsList[settingProp] === true){
                  document.getElementById("fpsCounter").style.display = "block";
                }
                else{
                  document.getElementById("fpsCounter").style.display = "none";
                }
                break;
              case "showping":
                if (settingsList[settingProp] === true){
                  document.getElementById("ping").className = "debugopen";
                }
                else{
                  document.getElementById("ping").className = "debug";
                }
                break;
              case "showposition":
                if (settingsList[settingProp] === true){
                  document.getElementById("position").className = "debugopen";
                }
                else{
                  document.getElementById("position").className = "debug";
                }
                break;
            }
          }
          localStorage.settings = JSON.stringify(settingsList);
          temporarySettings = {};
          console.log(settingsList)
        }
        function cancelSettings(){//cancel settings + undo all switches
          for (const settingProp in temporarySettings) {
            //undo the switches
            if (settingsList[settingProp] === true){//if switch was on before making the changes
              //document.querySelector('input[settingid="'+settingProp+'"]').setAttribute('checked','true');//old code that doesnt work
              document.getElementById(settingProp).checked = true;
              console.log("Reverted to true: " + settingProp)
            }
            else{
              document.getElementById(settingProp).checked = false;
              console.log("Reverted to false: " + settingProp)
            }
          }
          temporarySettings = {};
          console.log(settingsList)
        }


        function sendTypingIndicator(){
          const packet = JSON.stringify(["chat", "typingAnim"]);
          socket.send(packet)
        }
        function removeTypingIndicator(){
          const packet = JSON.stringify(["removeTyping"]);
          socket.send(packet)
        }

        var keylock = "no";

        var shapeHit = {};//animate change in color when shapes get hit, for all gamemodes except PvE (PvE have it stored in the shape object itself)
        var playerHit = {};

        function getTanksThatCanUpgradeTo(list,tankname){//for upgrade tree
          //get an array of tanks that can upgrade to in the future (these tanks wont be greyed out on upgrade tree)
          let listOfBodyUpgrades = [];
          
          function findChildBodyUpgrade(tank){
            for (const upgrade of tank){
              listOfBodyUpgrades.push(upgrade)
              try{
                let thisTank = list[upgrade].upgradeTo;
                findChildBodyUpgrade(thisTank)
              }
              catch(err){}
            }
          }
          
          try{
            let thisTank = list[tankname].upgradeTo;
            listOfBodyUpgrades.push(tankname)
            findChildBodyUpgrade(thisTank)
          }
          catch(err){}
          return listOfBodyUpgrades;
        }

        //getTanksThatCanUpgradeTo(bodyupgrades,'basic')
        var previousWeapon = '';//check if tank type changed
        var previousBody = '';
        var weaponCanUpgradeTo = [];
        var bodyCanUpgradeTo = [];

        //for the upgrade tree
        var bodysize = 20; //size of tank on upgrade tree
        var bodyangle = 0; //angle of tank on upgrade tree in radians

        //check whether mouse is near left side of screen, which will make skillpoints appear
        var mouseToSkillPoints = "no";

        let defaultNotifColor = "rgb(45,45,45)";
        function randomNotif() {
          //random notification when player joined game
          let randomFunFact = [
            "To get to the crossroads, rupture a portal without entering it.",
            "Press p for passive mode.",
            "Press f for fast rotation.",
            "You can enter the purple portals at lvl 100 only.",
            "Press m to toggle debug.",
            "Press t to open quick chat.",
            "Juggernaut have purple auras that can suck in players, careful!",
            "Blizzard slows down dune mobs.",
            "Press the WASD or arrow keys to move.",
            "Detonator shoots traps that explode on death."
          ]
          let rando = randomFunFact[Math.floor(Math.random() * randomFunFact.length)]; //random fun fact
          createNotif(rando,defaultNotifColor,3000)
        }

        //leaderboard player rotation
        var lbAngle = 0;

        //2tdm colors
        var teamColors = [];

        var socket = "null";
        // Connect to server
        if (window.location.href.includes("developer-rocketer")
          ||window.location.href.includes("rocketer-v2")
          ||window.location.href.includes("rocketer-dev")
          ||window.location.href.includes("127.0.0.1")){//this is a testing website, or local host
          //createNotif("Connected to the developer's testing servers.","rgba(150,0,0)",5000)
          //createNotif("To play the actual game, proceed to rocketer.glitch.me","rgba(150,0,0)",5000)//wss://e2973976-8e79-445f-a922-9602c03fb568-00-1xwdc1uekk0t0.riker.replit.dev/
          document.getElementById("adminPanelYN").style.display = "block";
          var serverlist = {
            "Free For All": "wss://ffa-r.mrharryw.dev/",
            // "Free For All": "wss://e2973976-8e79-445f-a922-9602c03fb568-00-1xwdc1uekk0t0.riker.replit.dev:8080/",
            "2 Teams": "wss://devrocketer2tdm.devrocketer.repl.co/",
            "4 Teams": "wss://devrocketer4tdm.devrocketer.repl.co/",
            "Tank Editor": "wss://devrocketereditor.devrocketer.repl.co/",
            "dune": "wss://devrocketerdune.devrocketer.repl.co/",
            "cavern": "wss://devrocketercavern.devrocketer.repl.co/",
            "cr": "wss://devrocketercr.devrocketer.repl.co/",
            "sanc": "wss://devrocketersanc.devrocketer.repl.co/",
          }
        }
        else{//actual rocketer
          var serverlist = {
            // "Free For All": "",
            "Free For All": "wss://ffa-r.mrharryw.dev/",
            "4 Teams": "wss://rocketer4tdm.rocketer.repl.co/",
            "Tank Editor": ["wss://rocketereditor.rocketer.repl.co/", "wss://rocketereditor2.rocketer.repl.co/"],
            "dune": "wss://rocketerdune.rocketer.repl.co/",
            "cavern": "wss://rocketercavern.rocketer.repl.co/",
            "cr": "wss://rocketercr.rocketer.repl.co/",
            "sanc": "wss://rocketersanc.rocketer.repl.co/",
          }
        }
        function connectServer(whichserver,teleportingYN){
            socket = new WebSocket(whichserver);
            socket.binaryType = "arraybuffer";//receive uint8array instead of blob (when servre compresses game data)
            console.log("Connecting to server...")
            socket.onopen = function(event) {//connected to server
                connected = "yes";
                console.log("Connected!")
                if (teleportingTransition!="yes"){//disconnected and reconnected, but not teleporting
                  playButton.style.display = "block";
                  nameInput.style.display = "block";
                  document.getElementById('connecting').style.display = "none";
                }
                //retrieve world record from server
                var packet = JSON.stringify(["wr"]);
                socket.send(packet)
                //check latency
                var sentBack = "yes";
                setInterval(function () {
                  if (sentBack == "yes") {
                    //dont ping again if server havent replied
                    start = Date.now();
                    var packet = JSON.stringify(["pingServer"]);
                    socket.send(packet)
                    sentBack = "no";
                  }
                }, 1500); //every 1.5 second

                if (teleportingYN=="yes"){
                  var packet = JSON.stringify(["teleporting",prevplayerstring]);
                  socket.send(packet)
                }
                //auto sign into account when open website
                if (
                  localStorage.getItem("rocketerAccountp") &&
                  localStorage.getItem("rocketerAccountu")
                ) {
                  const catss = localStorage.getItem("rocketerAccountp");
                  const dogss = localStorage.getItem("rocketerAccountu");
                  console.log("logging in...");
                  var packet = JSON.stringify(["logInOrSignUp", dogss, catss, "", "login"]);
                  socket.send(packet)
                }

                // Listen for stuff sent from server
                socket.onmessage = function(event) {
                  let info = "";
                  let type = "";
                  try{
                    info = JSON.parse(event.data)
                    type = info[0];//different stuff sent to client from server
                    bandwidth += new TextEncoder().encode(event.data).length;
                  }
                  catch(err){//this packet was compressed using pako, so it cannot be parsed yet
                    //console.log(event.data)
                    info = JSON.parse(pako.inflate(event.data, { to: 'string' }));
                    type = info[0];//different stuff sent to client from server
                    bandwidth += event.data.byteLength;//client receives uint8array packet cuz it is compressed, get byte length using bytelength property
                  }
                  //update bandwidth
                  if (Date.now() - prevBandwidthUpdate > 1000) {
                    //if 1 second has passed
                    shownBandwidth = bandwidth; //update the bandwdth that is shown
                    prevBandwidthUpdate = Date.now();
                    bandwidth = 0;
                  }


                  if (type=="sendID"){//client sending player's id
                    let yourID = info[1];
                    playerstring = yourID;
                  }
                  else if (type=="youtuber"){//re-add featured youtubers to the website in the future
                    /*
                    let icon = info[1];
                    let name = info[2];
                    let url = info[3];
                    //featured youtuber
                    document.getElementById("youtuberimage").src = icon;
                    document.getElementById("youtubername").innerHTML =
                      "Featured YouTuber:<br>" + name;
                    var channelurl = "https://youtube.com/" + url;
                    document.getElementById("featuredyoutuber").onclick = function () {
                      window.open(channelurl);
                    };
                    */
                  }
                  else if (type=="newNotification"){//create notification when server sends it
                    let text = info[1];
                    let color = info[2];
                    if (color != "red"){
                      createNotif(text,color,5000);
                    }
                    else{//server sent an error
                      document.getElementById('modal3a').style.display = "block";
                      document.getElementById('modal3aErr').textContent = "An unexpected error occurred: "+text;
                      darken.style.display = "block";
                    }
                  }
                  else if (type=="receiveWR"){
                    let recordHolder = info[1];//re-add world record leaderboard later on
                    /*
                    document.getElementById("wrwords").innerHTML =
                    "<span style='text-align: center;'><h3>World Record Holder</h3><hr></span><table><tr><th>1. " +
                    recordHolder[0].name +
                    "</th><th>" +
                    recordHolder[0].score +
                    " xp</th><th>" +
                    recordHolder[0].tank +
                    "</th></tr><tr><th>2. " +
                    recordHolder[1].name +
                    "</th><th>" +
                    recordHolder[1].score +
                    " xp</th><th>" +
                    recordHolder[1].tank +
                    "</th></tr><tr><th>3. " +
                    recordHolder[2].name +
                    "</th><th>" +
                    recordHolder[2].score +
                    " xp</th><th>" +
                    recordHolder[2].tank +
                    "</th></tr><tr><th>4. " +
                    recordHolder[3].name +
                    "</th><th>" +
                    recordHolder[3].score +
                    " xp</th><th>" +
                    recordHolder[3].tank +
                    "</th></tr><tr><th>5. " +
                    recordHolder[4].name +
                    "</th><th>" +
                    recordHolder[4].score +
                    " xp</th><th>" +
                    recordHolder[4].tank +
                    "</th></tr></table>";
                    */
                  }
                  else if (type=="accountView"){
                    let accountObject = info[1];
                    //if successfully log into an account, show the account
                    //sample account obj:
                    /*
                    name: accountname,
                    desc: description,
                    pw: password,
                    join: dateToday,
                    achievements: [],
                    topScore: 0,
                    star: 0,
                    pfp: "basic",
                    clr: "blue",
                    bg: "grey",
                    lastSeen: Date.now(),*/

                    loggedInAccount = accountObject;
                    var achievementsDescription = "";
                    function addAchievementDiv(color,color2,name,star,starcol,textcol,desc){
                      achievementsDescription += "<div class='achievementDiv' style='color:"+textcol+";margin:10px;background: linear-gradient(to bottom, "+color+" 50%, "+color2+" 0%);'><span style='font-size:1.5vw;width: 100%;'>"+name+"<span style='float:right;'><span class='material-icons' style='color: "+starcol+";font-size:1.2vw;'> star </span>"+star+"</span></span><br><br>"+desc+"</div>";
                    }
        
                    achievementList = [//the order is the order that achievements appear on the account page (based on star awarded)
                      ['Welcome',5,'Create an account.',1],//name, star, description, achievement id
                      ['Explorer',5,'Enter a portal.',7],
                      ['Killer',20,'Kill a player by shooting.',2],
                      ['Ascended',20,'Enter the sanctuary.',13],
                      ['Rainbow',35,'Kill a radiant shape.',3],
                      ['Bomber',50,'Kill a shape with 10 or more sides.',8],
                      ['Giant',50,'Get 1 million xp in one run.',4],
                      ['Monstrous',75,'Get 10 million xp in one run.',5],
                      ['Titan',150,'Get 100 million xp in one run.',6],
                      ['Survivor',150,'Survive for 20 minutes in FFA. (Achievement given after death)',11],
                      ['Oh Node!',300,'Reach lvl 60 as a node.',9],
                      ['Shiny!',300,'Kill a radiant hendecagon.',10],
                      ['Champion',400,'Reach lvl 85.',14],
                      ['Victor',1500,'Survive for an hour in FFA. (Achievement given after death)',12],
                    ];
        
                    let thingyy = accountObject.achievements.length + "/" + achievementList.length;
                    achcolors = [
                      ['rgb(242,219,120)','rgb(212,189,90)'],
                      ['rgb(126,146,247)','rgb(96,116,217)'],
                      ['rgb(123, 9, 123)','rgb(93, 0, 93)'],
                      ['rgb(194, 63, 63)','rgb(164, 33, 33)'],
                      ['rgb(81, 217, 225)','rgb(51, 187, 195)'],
                      ['rgb(39, 227, 170)','rgb(9, 197, 140)'],
                      ['rgb(184, 123, 181)','rgb(154, 93, 151)'],
                      ['rgb(222, 156, 58)','rgb(192, 126, 28)'],
                    ];//achievements have different colors based on difficulty
        
                    for (var i = 0; i < achievementList.length; i++) {
                      let thisach = achievementList[i];
                      if (accountObject.achievements.includes(thisach[3])) {//have this achievement id
                        let star = thisach[1];//amount of stars awarded
                        let whichcolor = 0;
                        if (star <= 20){//if change this, remember to change below (just search for 'newach' in the code)
                          whichcolor = 0;
                        }
                        else if (star <= 50){
                          whichcolor = 1;
                        }
                        else if (star <= 100){
                          whichcolor = 2;
                        }
                        else if (star <= 200){
                          whichcolor = 3;
                        }
                        else if (star <= 400){
                          whichcolor = 4;
                        }
                        else if (star <= 1500){
                          whichcolor = 5;
                        }
                        else{
                          whichcolor = 6;
                        }
                        addAchievementDiv(achcolors[whichcolor][0],achcolors[whichcolor][1],thisach[0],star,'gold','white',thisach[2])
                      }
                      else{
                        addAchievementDiv('rgb(95,103,108)','rgb(65,73,78)',thisach[0],thisach[1],'rgba(192,192,192)','rgba(192,192,192)',thisach[2])
                      }
                    }
                    //NEW ACHIEVEMENTS TO ADD INGAME: 10 and above

                    //put password and username in local storage
                    try {
                      localStorage.setItem("rocketerAccountp", accountObject.pw);
                      localStorage.setItem("rocketerAccountu", accountObject.name);
                      const cat = localStorage.getItem("rocketerAccountp");
                      const dog = localStorage.getItem("rocketerAccountu");
                    } catch (e) {
                      console.log("An error occured when storing your password: " + e);
                    }
                    /*
                    //RE-ADD THE DIVS, AND FIX THE drawfakeplayer function
                    document.getElementById("accountName").innerHTML = accountObject.name;
                    document.getElementById("accountText").style.textAlign = "left";
                    document.getElementById("accountText").innerHTML =
                      "<canvas id='pfp' style='float:left; width: 8vw; height: 8vw; padding-right: 1vw; padding-top: 1vw;'></canvas><div id='editoverlay' onclick='openeditpfp()'><br>Edit</div><br><span style='font-weight: 900;font-size: 2vw;'>" +
                      accountObject.name +
                      "</span><br><span class='material-icons' style='font-size: 1vw;color: gold;'> star </span>" +
                      accountObject.star +
                      "<br><br>" +
                      accountObject.desc +
                      "<br><br><hr><div style='width:100%;display:flex;flex-wrap: wrap;text-align: center;font-size:1vw;'><div style='width:25%;'><span style='font-size: 1.3vw;font-weight: 900;'>Joined</span><br>" +
                      accountObject.join + "</div><div style='width:25%;'>" + "<span style='font-size: 1.3vw;font-weight: 900;'>Last Online</span><br>0 seconds ago" + "</div><div style='width:25%;'>" + "<span style='font-size: 1.3vw;font-weight: 900;'>Achievements</span><br>" + thingyy + "</div><div style='width:25%;'>" + "<span style='font-size: 1.3vw;font-weight: 900;'>High score</span><br>" + accountObject.topScore +
                      "</div></div><hr><br><span style='width:100%;display:inline-block;font-weight: 900;font-size: 1.5vw;'>Achievements:<br><br></span>" +
                      "<div style='width:100%;display:flex;flex-wrap: wrap;'>"+
                      achievementsDescription +
                      "</div><br>Reload the page to view the latest account information.";
                    var pfpcanvas = document.getElementById("pfp");
                    pfpcanvas.width = "300"; //canvas coordinate width and height, not the actual canvas width and height
                    pfpcanvas.height = "300";
                    var pctx = pfpcanvas.getContext("2d");
                    var pfpPlayerX = 125;
                    var pfpPlayerY = 175;
                    pctx.fillStyle = "#CDCDCD"; //background
                    pctx.strokeStyle = "grey";
                    pctx.lineWidth = 5;
                    pctx.beginPath();
                    pctx.arc(150, 150, 148, 0, 2 * Math.PI);
                    pctx.fill();
                    pctx.stroke();
                    //draw grid
                    var pgridHeight = 150;
                    pctx.lineWidth = 15; //thickness of grid
                    //pctx.strokeStyle = "rgba(180, 180, 180, .2)";
                    pctx.strokeStyle = "#afafaf";
                    for (
                      let x = -pgridHeight - ((-pfpcanvas.width / 2) % pgridHeight);
                      x < pfpcanvas.width;
                      x += pgridHeight
                    ) {
                      pctx.moveTo(x, 0);
                      pctx.lineTo(x, pfpcanvas.height);
                    }
                    for (
                      let y = -pgridHeight - ((-pfpcanvas.height / 2) % pgridHeight);
                      y < pfpcanvas.height;
                      y += pgridHeight
                    ) {
                      pctx.moveTo(0, y);
                      pctx.lineTo(pfpcanvas.width, y);
                    }
                    pctx.stroke();
                    //crop grid to a circle
                    pctx.globalCompositeOperation = "destination-in";
                    pctx.beginPath();
                    pctx.arc(150, 150, 148, 0, 2 * Math.PI);
                    pctx.closePath();
                    pctx.fill();
                    pctx.globalCompositeOperation = "source-over"; //change back to default
                    //draw tank
                    pctx.lineJoin = "round";
                    let x = 150;
                    let y = 150;
                    let bodysize = 60;
                    let bodycolor = "#00B0E1";
                    let bodyoutline = "#0092C3";
                    let which = "weapon";
                    let name = accountObject.pfp;
                    let bodyangle = 45/180*Math.PI;
                    let temphctx = hctx;
                    hctx = pctx;//temporarily change hctx to pctx for function to work
                    drawFakePlayer(name,x,y,bodysize,bodyangle,bodycolor,bodyoutline,which)
                    hctx = temphctx;
                    
                    //draw tanks on the UI for editing account pfp
                    let availablepfp = ['node','basic','trapper','guard','twin','sniper','cannon','flank','delta','commander','overseer']
                    for (let i = 0; i < availablepfp.length; i++) {
                      let divid = 'tank' + availablepfp[i];
                      let tempcanvas = document.getElementById(divid);
                      tempcanvas.width = "100"; //canvas coordinate width and height, not the actual canvas width and height
                      tempcanvas.height = "100";
                      let pctx = tempcanvas.getContext("2d");
                      pctx.lineJoin = "round";
                      let x = 50;
                      let y = 50;
                      let bodysize = 20;
                      let bodycolor = "#00B0E1";
                      let bodyoutline = "#0092C3";
                      let which = "weapon";
                      let name = availablepfp[i];
                      let bodyangle = 45/180*Math.PI;
                      pctx.lineWidth = 3;
                      let temphctx = hctx;
                      hctx = pctx;//temporarily change hctx to pctx for function to work
                      drawFakePlayer(name,x,y,bodysize,bodyangle,bodycolor,bodyoutline,which)
                      hctx = temphctx;
                      pctx.fillStyle = "white";
                      pctx.strokeStyle = "black";
                      pctx.lineWidth = 7;
                      pctx.font = "900 20px Roboto";
                      pctx.textAlign = "center";
                      pctx.strokeText(availablepfp[i], 50, 90);
                      pctx.fillText(availablepfp[i], 50, 90);
                    }
                    */
        
                    //used to get the Last Online string, which currently isnt needed (cuz last seen is literally the time now)
                    //only needed when you can see other people's accounts in search function in future update
                    /*
                    var lastSeenString = "";
                    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];//needed because date wll return number value, e.g. 0 for Sunday
                    var d = new Date(accountObject.lastSeen);
                    var day = weekday[d.getDay()];
                    lastSeenString += day+" "+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+" "+ d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                    */
                    //for editing account
                    accountUsername.value = accountObject.name;
                    accountPassword.value = accountObject.pw;
                    accountDesc.value = accountObject.desc;
                    //document.getElementById("editAccount").style.display = "block";//RE-ADD
                  }
                  else if (type=="newach"){//got a new achievement
                    let id = info[1];//id of the achievement gained
                    if (achievementList){//if this variable exists (if logged in)
                      for (var i = 0; i < achievementList.length; i++) {
                        let thisach = achievementList[i];
                        if (thisach[3] == id){//this is the achievement
                          let star = thisach[1];//amount of stars awarded
                          let whichcolor = 0;
                          if (star <= 20){
                            whichcolor = 0;
                          }
                          else if (star <= 50){
                            whichcolor = 1;
                          }
                          else if (star <= 100){
                            whichcolor = 2;
                          }
                          else if (star <= 200){
                            whichcolor = 3;
                          }
                          else if (star <= 400){
                            whichcolor = 4;
                          }
                          let color = achcolors[whichcolor][0];
                          let color2 = achcolors[whichcolor][1];
                          let name = thisach[0];
                          let desc = thisach[2];
                          let textcol = 'white';
                          let starcol = 'gold';
                          let div = document.createElement('div');
                          div.id = 'achnotifdiv';
                          div.innerHTML = "<div id='achnotiftext' class='achievementText'>New Achievement!</div><div id='achnotif' class='achievementNotif' style='color:"+textcol+";background: linear-gradient(to bottom, "+color+" 50%, "+color2+" 0%);'><span style='font-size:1.5vw;width: 100%;'>"+name+"<span style='float:right;'><span class='material-icons' style='color: "+starcol+";font-size:1.2vw;'> star </span>"+star+"</span></span><br><br>"+desc+"</div>";
                          document.body.appendChild(div);
                          setTimeout(function(){//remove div after some time
                            let x = document.getElementById("achnotifdiv");
                            if (x){
                              x.remove();
                            }
                          }, 5000);
                          break;
                        }
                      }
                    }
                  }
                  else if (type=="pong"){
                    //server reply after client ping to check latency
                    latency = Date.now() - start;
                    start = Date.now();
                    sentBack = "yes";
                  }
                  else if (type=="game"){
                    if(teleportingTransition=="yes"){//is teleporting, that's why re-connected
                      teleportingTransition = "no";
                      teleportingcount = 2.1;
                    }
                    if (officialGameStart == "no"){
                      connectedToServer();
                      officialGameStart = "yes";
                    }
                    let gameobjects = info[1];
                    let serverruntime = info[2];
                    let portalslist = info[3];
                    let servertime = info[4];
                    //update variables
                    oldportals = JSON.parse(JSON.stringify(portals));
                    for (const property in portalslist) {
                      if (portalslist[property] == "del") {
                        //server tells client that a portal is not shown on the screen anymore
                        delete portals[property];
                      } else {
                        if (!portals.hasOwnProperty(property)) {
                          portals[property] = { ...portalslist[property] };
                        } else {
                          for (const propertyy in portalslist[property]) {
                            portals[property][propertyy] =
                              portalslist[property][propertyy];
                          }
                        }
                      }
                    }
                    //server doesnt send all the stuff that can be seen on your screen (will use a lot of bandwidth)
                    //instead, it sends the changes made to the things already on your screen (delete, add, change stuff)
                    function loopobj(obj, actual){
                      for (const propertyy in obj) {
                        if (
                          typeof obj[propertyy] === 'object' &&
                          !Array.isArray(obj[propertyy]) &&
                          obj[propertyy] !== null
                        ) {//property is an object
                          if (!actual.hasOwnProperty(propertyy)){
                            actual[propertyy] = {};
                          }
                          loopobj(obj[propertyy], actual[propertyy])
                        }
                        else if (obj[propertyy]=="del"){
                          delete actual[propertyy];
                        }
                        else{
                          actual[propertyy] = obj[propertyy];
                        }
                      }
                    }
        
                    oldobjects = JSON.parse(JSON.stringify(objects));
                    if (latestServerUpdateTime == 0){//for interpolation (need server's time to calculate movement)
                      latestServerUpdateTime = Date.now();
                    }
                    else{
                      latestServerUpdateTime += (servertime - oldservertime);
                    }
                    let diffTime = Date.now() - latestServerUpdateTime;
                    if (diffTime < 0){
                      latestServerUpdateTime = Date.now();
                    }
                    oldservertime = servertime;

                    for (const type in gameobjects) {
                      if (gameobjects[type]!="del"){
                        for (const property in gameobjects[type]) {
                          if (gameobjects[type][property] == "del") {
                            //server tells client that an object is not shown on the screen anymore
                            //add to list of dead objects
                            if (objects[type][property]){//if we have the dead object info
                              let thisDeadObj = { ...objects[type][property] };
                              thisDeadObj.type = type;
                              thisDeadObj.id = property;
                              listofdeadobjects.push(thisDeadObj);
                            }
                            //delete actual object
                            delete objects[type][property];
                          } else {
                            if (!(type in objects)) {
                              //new object
                              objects[type] = {};
                              objects[type][property] = {
                                ...gameobjects[type][property],
                              };
                            } else if (!(property in objects[type])) {
                              //new object
                              objects[type][property] = {
                                ...gameobjects[type][property],
                              };
                            } else {
                              //changed object
                              loopobj(gameobjects[type][property], objects[type][property])
                            }
                          }
                        }
                      }
                      else{
                        objects[type]  = {};
                      }
                    }
                    if (objects.player){
                      if (playerstring in objects.player) {
                        if (oldtank!=player.tankType || oldbody!=player.bodyType){//tank changed
                          if ((oldtank!=""&&oldbody!="")||gamemode=="Free For All"||gamemode=="Tank Editor"||gamemode=="Cavern"){//particle when spawn only in these gamemodes
                            //spawn particles when upgrade tank
                            oldtank = player.tankType;
                            oldbody = player.bodyType;
                            slightshake = "yes";
                            slightshakeIntensity = 1;
                            let object = player;
                            let playercolor = "";
                            let playeroutline = "";
                            if (object.team == "none") {
                              playercolor = bodyColors.blue.col;
                              playeroutline = bodyColors.blue.outline;
                            } else if (bodyColors.hasOwnProperty(object.team)) {
                                playercolor = bodyColors[object.team].col;
                                playeroutline = bodyColors[object.team].outline;
                            }
                            if (object.developer == "yes") {//if a developer
                              playercolor = object.color;
                              playeroutline = object.outline;
                            }
                            for (let i = 0; i < 30; i++) {
                              let angleRadians = (Math.floor(Math.random() * 360) * Math.PI) / 180; //convert to radians
                              var randomDistFromCenter = Math.floor(Math.random() * player.width) - player.width/2;
                              radparticles[particleID] = {
                                angle: angleRadians,
                                x: player.x + randomDistFromCenter * Math.cos(angleRadians),
                                y: player.y - randomDistFromCenter * Math.sin(angleRadians),
                                width: player.width/6 + Math.floor(Math.random() * player.width/4),
                                height: player.width/6 + Math.floor(Math.random() * player.width/4),
                                speed: 3 + Math.floor(Math.random() * 3),
                                timer: 20 + Math.floor(Math.random() * 10),
                                maxtimer: 200,
                                color: playercolor,
                                outline: playeroutline,
                                type: "particle",
                              };
                              particleID++;
                            }
                          }
                          else if (player.tankType && player.bodyType){
                            oldtank = player.tankType;
                            oldbody = player.bodyType;
                          }
                        }
                        player = objects.player[playerstring]; //refers to the client's tank
                      }
                    }
                    serverCodeTime = serverruntime;
                    sentStuffBefore = "yes";
                  }
                  else if (type=="map"){//map size changed
                    MAP_WIDTH = info[1];//code always uses map_width variable for now, change in the future if rectangular maps supported
                    MAP_HEIGHT = info[1];//same cuz servers only support square maps, two variables cuz singleplayer PvE allows rectanglular maps
                    mapSizeElement.textContent = `Map: ${MAP_WIDTH}x${MAP_HEIGHT}`;
                  }
                  else if (type=="pc"){//player count changed
                    playerCount = info[1];
                  }
                  else if (type=="gpc"){//global player count changed
                    globalPlayerCount = info[1];
                  }
                  else if (type=="lb"){//leaderboard changed
                    players = info[1];
                  }
                  else if (type=="teams"){
                    teamColors = [];
                    teamColors.push(info[1]);
                    teamColors.push(info[2]);
                    if(info[3] !== undefined && info[4] !== undefined) {
                    teamColors.push(info[3]);
                    teamColors.push(info[4]);
                    }
                  }
                  else if (type == "editedTank"){
                    //user import scenexe tank code, so server send info for client to update the UI
                    let player = info[1];
                    //clear the UI//ADD TANK EDITOR DIVS BEFORE ENABLING THIS PART
                    /*
                    $("#assetUI").empty()
                    $("#bbUI").empty()
                    $("#barrelUI").empty()
                    barrelnumberid = 1;
                    assetnumberid = 1;
                    gadgetnumberid = 1;
                    for (const barrelID in player.barrels){
                      addCustomBarrelDiv(barrelID,player.barrels[barrelID])
                    }
                    for (const barrelID in player.bodybarrels){
                      addCustomGadgetDiv(barrelID,player.bodybarrels[barrelID])
                    }
                    for (const barrelID in player.assets){
                      addCustomAssetDiv(barrelID,player.assets[barrelID])
                    }
                    document.getElementById('weapon-fov').value = player.fovMultiplier;
                    document.getElementById('body-health').value = player.maxhealth;
                    document.getElementById('weapon-name').value = player.tankType;
                    document.getElementById('body-name').value = player.bodyType;
                    document.getElementById('tank-size').value = player.width;
                    document.getElementById('body-speed').value = player.speed;
                    document.getElementById('body-damage').value = player.damage;
                    document.getElementById('body-regen').value = player.healthRegenSpeed;
                    document.getElementById('body-regen-time').value = player.healthRegenTime;
                    if (player.turretBaseSize){
                      document.getElementById('turret-base').value = player.turretBaseSize;
                    }
                      */
                  }
                else if (type == "exportCode"){//user export tank as scenexe tank code
                  let code = info[1];
                  //document.getElementById('import-code').value = code;//SAME THING HERE
                }
                  else if (type=="youDied"){
                    let killer = info[1];
                    let player = info[2];
                    let respawnDivide = info[3];
                    let respawnLimit = info[4];
                    //when player died, show death screen
                    sentStuffBefore = "no";
                    let endscore = abbreviateScore(player.score);
                    if (typeof killer == "number") {
                      //killer is a number, which is numer of sides of a shape
                      let shapetype = killer - 3;
                      if (killer == 4){
                        shapetype = 0;
                      }
                      else if (killer == 3){
                        shapetype = 1;
                      }
                      killer = shapeNames[shapetype];
                    }
                    showDeathScreen(endscore,killer,player.level,player.tankType,player.bodyType);
                    state = "deathscreen";//ensure that hctx canvas doesnt clear//remove?
                    
                    //calculating respawn score, change this if server caculation changes
                    let respawnlvl = 0;
                    if (player.score > 0) {
                      //if player didnt die at 0 score
                      let respawningScore = Math.round(player.score / respawnDivide);
                      if (respawningScore > respawnLimit) {
                        respawningScore = respawnLimit;
                      }
                      respawnlvl = convertXPtoLevel(respawningScore);
                    }
                    document.getElementById("respawnLvl").innerHTML = respawnlvl;
                    //hide all the editor UI
                    /*
                    tankEditor1.style.display = "none";
                    tankEditor2.style.display = "none";
                    barrelEditor.style.display = "none";
                    assetEditor.style.display = "none";
                    bbEditor.style.display = "none";*/
                    //reset player state values
                    autorotate = "no";
                    autofire = "no";
                    fastautorotate = "no";
                    passivemode = "no";
                    //reset upgrade ignore
                    ignorebuttonw.ignore = "no";
                    ignorebuttonb.ignore = "no";
                  }
                  else if (type=="teleport"){//server tells player that it successfully teleported, so need to connect to the server for the new dimension
                    let dimension = info[1];
                    prevplayerstring = playerstring;
                    //reset object list when teleport
                    portals = {};
                    oldportals = {};
                    objects = {
                      wall: {},//walls drawn below everything
                      gate: {},
                      Fixedportal: {},
                      shape: {},
                      bot: {},
                    };//specifically shapes and bots so they would be below players, fixed portals always under everything
                    teleportingTransition = "yes";
                    oldteleportingLocation = gamemode;//change all of this
                    teleportingcount = 0;
                    if (dimension=="dune"||dimension=="sanc"||dimension=="cavern"||dimension=="cr"||dimension=="arena"||dimension=="2tdm"||dimension=="4tdm"){
                      socket.close();//disconnect from current server
                      if (dimension=="arena"){
                        dimension = "Free For All";
                      }
                      else if (dimension=="2tdm"){
                        dimension = "2 Teams";
                      }
                      else if (dimension=="4tdm"){
                        dimension = "4 Teams";
                      }
                      connectServer(serverlist[dimension],"yes")
                      if (dimension=="sanc"){
                        gamemode = "sanctuary";
                      }
                      else if (dimension=="cr"){
                        gamemode = "crossroads";
                      }
                      else{
                        gamemode = dimension;//gamemode used to be arena, 2tdm, and 4tdm
                      }
                      teleportingLocation = gamemode;
                    }
                  }
                };

                // Listen for socket closes
                socket.onclose = function(event) {
                  console.log('Disconnected: ',event);
                  if (reconnectToDefault != "yes"){//if not purposely disconnecting to respawn in ffa
                    if (teleportingTransition != "yes"){
                      //disconnect notification
                      //when socket disconnect, this is automatically triggered
                      //createNotif("Disconnected. Reload the page.","rgb(150,0,0)",10000)
                      if (document.getElementById('modal3a').style.display != "block"){//if connection error modal is not open
                        document.getElementById('modal3').style.display = "block";
                        darken.style.display = "block";
                      }
                      returnToHomeScreen("disconnect");
                      connected = "no";
                      playButton.style.display = "none";
                      nameInput.style.display = "none";
                    }
                  }
                  else{
                    reconnectToDefault = "no";
                  }
                };
                socket.onerror = function(err) {//connection error
                  console.error('Socket error: ', err.message);
                  //createNotif("Connection error: "+err.message,"rgb(150,0,0)",10000)
                  document.getElementById('modal3a').style.display = "block";
                  document.getElementById('modal3aErr').textContent = "An unexpected error occurred: "+err.message;
                  darken.style.display = "block";
                  returnToHomeScreen("disconnect");
                  connected = "no";
                  playButton.style.display = "none";
                  nameInput.style.display = "none";
                };
                // To close the socket: socket.close()
              }
            }
            if (gamemode != "PvE arena"){
              connectServer(serverlist[gamemode],"no");//connect to the server when open the website
            }

            var joinedWhichGM = "Free For All";//needed for respawning, cuz some gamemodes like crossroads cannot respawn there, so need to respawn to previous gamemode

            //button 1 to 7 are weapon upgrades, 8 to 14 are body upgrades
            var upgradeButtons = {};
            function addUpgradeButton(i,x,y,endx,color,darkcolor){
              upgradeButtons[i] = {};
              let thisButton = upgradeButtons[i];
              if (i > 7){//right side upgrade buttons//used to be <8
                thisButton.x = canvas.width + x; //poition changes when animating
                thisButton.startx = canvas.width + x; //start position for animating button movement (start position)
                thisButton.endx = canvas.width - endx; //end position
                thisButton.rawX = x;//for resizing purposes (cuz canvas width will change)
                thisButton.rawEndX = endx;//for resizing purposes
              }
              else{//left side upgrade buttons
                thisButton.x = 0-x;
                thisButton.startx = 0-x;
                thisButton.endx = endx;
              }
              thisButton.y = hcanvas.height - y;
              thisButton.rawY = y;
              thisButton.width = 100;
              thisButton.hover = "no";
              thisButton.brightness = 0;
              thisButton.defaultwidth = 100;
              thisButton.animatedwidth = 120;
              thisButton.color = color;
              thisButton.darkcolor = darkcolor;
            }
            addUpgradeButton(1,315,205,75,"255,228,107","225,198,77");
            addUpgradeButton(2,195,205,195,"252,118,118","222,88,88");
            addUpgradeButton(3,75,205,315,"118,140,252","88,110,222");
            addUpgradeButton(4,315,325,75,"252,166,68","222,136,38");
            addUpgradeButton(5,195,325,195,"56,183,100","26,153,70");
            addUpgradeButton(6,75,325,315,"74,102,189","44,72,159");
            addUpgradeButton(7,315,445,75,"93,39,93","63,9,63");
            addUpgradeButton(8,315,205,75,"255,228,107","225,198,77");
            addUpgradeButton(9,195,205,195,"252,118,118","222,88,88");
            addUpgradeButton(10,75,205,315,"118,140,252","88,110,222");
            addUpgradeButton(11,315,325,75,"252,166,68","222,136,38");
            addUpgradeButton(12,195,325,195,"56,183,100","26,153,70");
            addUpgradeButton(13,75,325,315,"74,102,189","44,72,159");
            addUpgradeButton(14,315,445,75,"93,39,93","63,9,63");
            var tankRotate = 0;//for tank rotation in uppgrade button
            var ignorebuttonw = {
                x: -1000,
                y: -1000,
                width: 100,
                height: 40,
                hover: "no",
                brightness: 0,
                defaultwidth: 100,
                animatedwidth: 120,
                color: "255,228,107",
                darkcolor: "225,198,77",
                ignore: "no",
              };
            var ignorebuttonb = {
                x: -1000,
                y: -1000,
                width: 100,
                height: 40,
                hover: "no",
                brightness: 0,
                defaultwidth: 100,
                animatedwidth: 120,
                color: "255,228,107",
                darkcolor: "225,198,77",
                ignore: "no",
              };
            //other game variables
            var barScore = 0; //for score progress bar
            var auraWidth = 0;
            var auraRotate = 0; //for radiant shape aura size increase
            var extraSpikeRotate = 0;
            var extraSpikeRotate1 = 0;
            var extraSpikeRotate2 = 360;
            var clientFovMultiplier = 1;
            var listofdeadobjects = []; //animate dead objects
            //stuff needed for drawing canvas
            var playerstring = "error";
            var prevplayerstring = "error";
            var playerCount = "error";
            var globalPlayerCount = "error";
            var portals = {};
            var oldportals = {};
            var shakeYN = "error";//portal screen shake
            var shakeIntensity = 1;
            var slightshake = "no";//spawn/upgrade screen shake
            var slightshakeIntensity = 1;
            //var players = "error";
            var player = "error";
            var objects = {};
            var oldobjects = {};//for client interpolation
            var interpolatedobjects = {};
            var latestServerUpdateTime = 0;
            var oldservertime = 0;
            var serverCodeTime = "error";
            var sentStuffBefore = "no";
            var latency = "Checking latency...";
            var start;
            var shownBandwidth = 0; //bandwidth that is shown, updates every second
            var bandwidth = 0; //size of packet sent from server
            var prevBandwidthUpdate = 0; //previous time that bandwidth was updated
            //particles are completely clientside to reduce server lag (cuz cavern would have 300+ particles)
            var radparticles = {}; //particle effect for radiants
            var portalparticles = {}; //prticle effect for portals
            var particleID = 0;
            //for mobile
            var joystick1 = {
              //movement joystick on the left
              size: 100,
              xFromCenter: -500,
              yFromCenter: 150,
            };
            var joystick2 = {
              //shooting joystick on the right
              size: 100,
              xFromCenter: 500,
              yFromCenter: 150,
            };
            var touches = {
              0: {
                state: "no",
                x: "no",
                y: "no",
                angle: "no",
                dir: 0,
                oldangle: "no",
              },
              1: {
                state: "no",
                x: "no",
                y: "no",
                angle: "no",
                dir: 0,
                oldangle: "no",
              },
            };
            //weapon upgrade tree
            var showUpgradeTree = "no";
            var upgradetreepos = -750; //current position of upgrade tree
            var upgradetreestart = -750; //start position
            var upgradetreeend = 165; //end position
            //body upgrade tree
            var showBodyUpgradeTree = "no";
            var bupgradetreepos = -750; //current position of upgrade tree
            var bupgradetreestart = -750; //start position
            var bupgradetreeend = 165; //end position
            //both upgrade trees:
            var upgradeTreeBoxPositions = {};//store the positions to draw the connecting lines in upgrade tree (added on the first time drawing the boxes)
            var xdistMultiplierStart = 0.3;//change in width when opening and closing upgrade tree
            var xdistMultiplierEnd = 1;
            var xdistMultiplierw = xdistMultiplierStart;
            var xdistMultiplierb = xdistMultiplierStart;
            //skillpoints
            var skillpointspos = -370; //current position of skill points bar
            var skillpointsstart = -370; //start position
            var skillpointsend = 155; //end position

            const shootBarrelMax = 100;//reduce this value for a larger shooting height change

            function drawBulletBarrel(canvas, x,width,height,shootChange, fov){//shootchange is change in barrel height when shooting
              let h = (height - shootChange/shootBarrelMax*height) / fov;
              canvas.fillRect((x - width / 2) / fov,-h,width / fov,h);
              canvas.strokeRect((x - width / 2) / fov,-h,width / fov,h);
            }

            function drawDroneTurret(canvas, x,width,shootChange, fov){//shootchange is change in barrel height when shooting
              let w = width - shootChange/shootBarrelMax*width;
              canvas.fillRect((x - w / 2) / fov,-w/2 / fov,w / fov,w / fov);
              canvas.strokeRect((x - w / 2) / fov,-w/2 / fov,w / fov,w / fov);
            }

            function drawDroneBarrel(canvas, x,width,height,shootChange, fov){
              let h = -(height - shootChange/shootBarrelMax*height) / fov;
              canvas.beginPath();
              canvas.moveTo((x - width / 2) / fov,0);
              canvas.lineTo((x-width) / fov,h);
              canvas.lineTo((x * 2 + width) / fov,h);
              canvas.lineTo((x * 2 + width/2) / fov,0);
              canvas.fill();
              canvas.stroke();
            }

            function drawTrapBarrel(canvas, x,width,height,shootChange, fov, bodysize){
              let w = width/fov;
              let h = (height - shootChange/shootBarrelMax*height) / fov;
              let hJut = h-0.45 * bodysize / fov;//height of tip of trap barrel
              x = x/fov;
              canvas.fillRect(-w/2 + x, -hJut, w, hJut);
              canvas.strokeRect(-w/2 + x, -hJut, w, hJut);
              canvas.beginPath();
              canvas.moveTo(-w/2 + x, -hJut-canvas.lineWidth/2);
              canvas.lineTo(-w + x, -h);
              canvas.lineTo(w + x, -h);
              canvas.lineTo(w/2 + x, -hJut-canvas.lineWidth/2);
              canvas.fill();
              canvas.stroke();
            }

            function drawMineBarrel(canvas, x,width,height,shootChange, fov, bodysize){
              let w = width/fov;
              let h = (height - shootChange/shootBarrelMax*height) / fov;
              let bottomRectPos = 0.5 * bodysize / fov;
              let trapezoidPos = bottomRectPos/2;
              let hJut = h-bottomRectPos;//height of tip of trap barrel
              x = x/fov;
              canvas.fillRect(-w/2 + x, -hJut, w, hJut);//rectangle base
              canvas.strokeRect(-w/2 + x, -hJut, w, hJut);
              canvas.beginPath();
              canvas.moveTo(-w/2 + x, -hJut-canvas.lineWidth/2);//trapezoid
              canvas.lineTo(-w + x, -h+trapezoidPos);
              canvas.lineTo(w + x, -h+trapezoidPos);
              canvas.lineTo(w/2 + x, -hJut-canvas.lineWidth/2);
              canvas.fill();
              canvas.stroke();
              canvas.fillRect(-w + x, -h, w*2, trapezoidPos);//rectangle tip
              canvas.strokeRect(-w + x, -h, w*2, trapezoidPos);
            }

            function drawMinionBarrel(canvas, x,width,height,shootChange, fov){
              let h = -(height - shootChange/shootBarrelMax*height) / fov;
              canvas.fillRect((x - width / 2) / fov,h,width / fov,-h);
              canvas.strokeRect((x - width / 2) / fov,h,width / fov,-h);
              canvas.fillRect((x - width * 0.75) / fov,h / 1.5,(width / fov) * 1.5,-h / 1.5);
              canvas.strokeRect((x - width * 0.75) / fov,h / 1.5,(width / fov) * 1.5,-h / 1.5);
              canvas.fillRect((x - width * 0.75) / fov,h,(width / fov) * 1.5,-h / 5);
              canvas.strokeRect((x - width * 0.75) / fov,h,(width / fov) * 1.5,-h / 5);
            }
            
            function drawAsset(asset,bodysize,color,outline,canvas){
              if (asset.hasOwnProperty("angle")) {
                if (asset.angle != 0) {
                  canvas.rotate((asset.angle * Math.PI) / 180);
                }
              }
              canvas.translate(bodysize * asset.x, bodysize * asset.y);
              canvas.fillStyle = color;
              canvas.strokeStyle = outline;
              if (asset.sides == 0) {
                canvas.beginPath();
                canvas.arc(0, 0, bodysize * asset.size, 0, 2 * Math.PI);
                canvas.fill();
                canvas.stroke();
              } else if (asset.sides < 0) {//draw a star
                let numberOfSpikes = -asset.sides;
                let outerRadius = bodysize * asset.size;
                let innerRadius = (bodysize * asset.size / 2);
                let rot = (Math.PI / 2) * 3;
                let x = 0;
                let y = 0;
                canvas.beginPath();
                canvas.moveTo(0, -outerRadius);
                for (i = 0; i < numberOfSpikes; i++) {
                  x = Math.cos(rot) * outerRadius;
                  y = Math.sin(rot) * outerRadius;
                  canvas.lineTo(x, y);
                  rot += Math.PI / numberOfSpikes;
                  x = Math.cos(rot) * innerRadius;
                  y = Math.sin(rot) * innerRadius;
                  canvas.lineTo(x, y);
                  rot += Math.PI / numberOfSpikes;
                }
                canvas.lineTo(0, -outerRadius);
                canvas.closePath();
                canvas.fill();
                canvas.stroke();
              } else {
                canvas.beginPath();
                var baseSides = asset.sides;
                canvas.moveTo(bodysize * asset.size * Math.cos(0), bodysize * asset.size * Math.sin(0));
                for (var i = 1; i <= baseSides; i++) {
                  canvas.lineTo(
                    bodysize * asset.size * Math.cos((i * 2 * Math.PI) / baseSides),
                    bodysize * asset.size * Math.sin((i * 2 * Math.PI) / baseSides)
                  );
                }
                canvas.closePath();
                canvas.fill();
                canvas.stroke();
              }
              canvas.translate(-bodysize * asset.x, -bodysize * asset.y);
              if (asset.hasOwnProperty("angle")) {
                if (asset.angle != 0) {
                  canvas.rotate((-asset.angle * Math.PI) / 180);
                }
              }
            }
            function hctxroundRectangle(x,y,r,w,h){
              /*
              hctx.beginPath();
              hctx.moveTo(x + r, y);
              hctx.arcTo(x + w, y, x + w, y + h, r);
              hctx.arcTo(x + w, y + h, x, y + h, r);
              hctx.arcTo(x, y + h, x, y, r);
              hctx.arcTo(x, y, x + w, y, r);
              hctx.closePath();
              hctx.stroke(); //MUST stroke first, or else the rectangle drawn in code below wil cover part of the stroke
              hctx.fill();
          */
              hctx.beginPath();
              hctx.roundRect(x,y,w,h,r);//the roundrect function was newly added in 2023, but most browsers should have it now
              hctx.stroke();
              hctx.fill();
            }
            function ctxroundRectangle(x,y,r,w,h){
              ctx.beginPath();
              ctx.roundRect(x,y,w,h,r);//the roundrect function was newly added in 2023, but most browsers should have it now
              ctx.stroke();
              ctx.fill();
            }
            function hctxroundRectangleFill(x,y,r,w,h){//only fill
              hctx.beginPath();
              hctx.roundRect(x,y,w,h,r);
              hctx.fill();
            }
            function ctxroundRectangleFill(x,y,r,w,h){//only fill
              ctx.beginPath();
              ctx.roundRect(x,y,w,h,r);
              ctx.fill();
            }

            function drawSpikes(innerRadius,outerRadius,numberOfSpikes,width){
              outerRadius *= (width / clientFovMultiplier);
              innerRadius *= (width / clientFovMultiplier);
              let x = 0;
              let y = 0;
              let rot = Math.PI * 1.5;
              ctx.beginPath();
              ctx.moveTo(0, -outerRadius);
              for (let i = 0; i < numberOfSpikes; i++) {
                x = Math.cos(rot) * outerRadius;
                y = Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += Math.PI / numberOfSpikes;
                x = Math.cos(rot) * innerRadius;
                y = Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += Math.PI / numberOfSpikes;
              }
              ctx.lineTo(0, -outerRadius);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
            function renderPolygon(width,sides){//DO NOT confuse with draw polygon, which is only for home screen background
              ctx.beginPath();
              ctx.moveTo(width * Math.cos(0), width * Math.sin(0));
              for (let i = 1; i <= sides + 1; i++) {
                ctx.lineTo(
                  width * Math.cos(i * 2 * Math.PI / sides),
                  width * Math.sin(i * 2 * Math.PI / sides)
                );
              }
              ctx.fill();
              ctx.stroke();
            }

            function renderShape(object,id,auraWidth,drawingX,drawingY){
                if (object.hasOwnProperty("deadOpacity")) { //if this is an animation of a dead object
                  ctx.globalAlpha = object.deadOpacity;
                }
                let radiantAuraSize = 5 * auraWidth;
                let radShapeCol;//store radiant shape color for the health bar
                ctx.save();
                ctx.translate(drawingX,drawingY);
                ctx.rotate((object.angle * Math.PI) / 180);
                if (object.hasOwnProperty("radtier")) {//change back
                  //radiant shape
                  if (!radiantShapes.hasOwnProperty(id)) {
                    let randomState = Math.floor(Math.random() * 3);//state changes from 0.0 to 3.0
                    let randomType = Math.floor(Math.random() * 2) + 1; //choose animation color type (1 or 2)
                    radiantShapes[id] = {
                      state: randomState,
                      type: randomType
                    }
                  }

                  let r = radiantShapes[id];
                  if (r.type == 1){//red yellow blue animtion
                    let blue = "rgb(35,79,146)";
                    let yellow = "rgb(155,142,88)";
                    let red = "rgb(117,50,33)";
                    if (r.state < 1){//yellow --> red
                      ctx.fillStyle = pSBC ( r.state, yellow, red );
                    }
                    else if (r.state < 2){//red --> blue
                      ctx.fillStyle = pSBC ( r.state-1, red, blue );
                    }
                    else if (r.state < 3){//blue --> yellow
                      ctx.fillStyle = pSBC ( r.state-2, blue, yellow );
                    }
                  }
                  else{//blue green yellow animation
                    let blue = "rgb(22,105,122)";
                    let green = "rgb(93,173,120)";
                    let yellow = "rgb(116,122,47)";
                    if (r.state < 1){//yellow --> green
                      ctx.fillStyle = pSBC ( r.state, yellow, green );
                    }
                    else if (r.state < 2){//green --> blue
                      ctx.fillStyle = pSBC ( r.state-1, green, blue );
                    }
                    else if (r.state < 3){//blue --> yellow
                      ctx.fillStyle = pSBC ( r.state-2, blue, yellow );
                    }
                  }
                  ctx.strokeStyle = pSBC ( -0.4, ctx.fillStyle );//radiant shape outline is 40% darker
                  r.state += 0.015;
                  if (r.state > 3){
                    r.state = 0;
                  }
                  radShapeCol = ctx.fillStyle;//store for health bar

                  let originalTransparency = ctx.globalAlpha;//some objects like dead objects already have transparency
                  if (originalTransparency > 0.5){
                    ctx.globalAlpha -= 0.5;//spikes are more transparent
                  }
                  else{
                    ctx.globalAlpha = 0;
                  }
                  ctx.lineWidth = 3 / clientFovMultiplier;
                  //radtier 3 and above have spikes
                  if (object.radtier == 3) {
                    ctx.rotate(extraSpikeRotate * Math.PI / 180);
                    drawSpikes(0.75, radiantAuraSize*3*0.75, 6, object.width);//innerSize,outerSize,number of spikes, object width
                    ctx.rotate(-extraSpikeRotate * Math.PI / 180);
                  }
                  else if (object.radtier == 4) {
                    ctx.rotate(extraSpikeRotate1 * Math.PI / 180);
                    drawSpikes(0.5, radiantAuraSize*3, 3, object.width);
                    ctx.rotate(-extraSpikeRotate1 * Math.PI / 180);
                    ctx.rotate(extraSpikeRotate2 * Math.PI / 180);
                    drawSpikes(0.5, radiantAuraSize*3*0.5, 6, object.width);
                    ctx.rotate(-extraSpikeRotate2 * Math.PI / 180);
                  }
                  else if (object.radtier == 5) {
                    ctx.rotate(extraSpikeRotate1 * Math.PI / 180);
                    drawSpikes(0.5, radiantAuraSize*3*1.5, 3, object.width);
                    ctx.rotate(-extraSpikeRotate1 * Math.PI / 180);
                    ctx.rotate(extraSpikeRotate2 * Math.PI / 180);
                    drawSpikes(0.5, radiantAuraSize*3*0.5, 3, object.width);
                    ctx.rotate(-extraSpikeRotate2 * Math.PI / 180);
                  }
                  //radtier 2 and above have aura
                  if (object.radtier > 2) {
                    let shapeaurasize = object.radtier;
                    if (shapeaurasize > 3) {
                      shapeaurasize = 3; //prevent huge auras
                    }
                    renderPolygon(object.width*radiantAuraSize*shapeaurasize/clientFovMultiplier, object.sides);
                  }
                  ctx.globalAlpha = originalTransparency;

                  //choose whether a particle would spawn
                  //particle spawn chance based on number of sides the shape has, so square has less particles
                  if (spawnradparticle == "yes"){
                    let spawnChance = 20 - object.sides * 2; //lower the number means more particles spawned
                    if (spawnChance < 5) {//prevent spawn chance from going below 0 after reducing it later
                      spawnChance = 5;
                    }
                    if (object.radtier == 4){
                      spawnChance -= 2;
                    }
                    else if (object.radtier == 5){
                      spawnChance -= 3;
                    }
                    if (Math.floor(Math.random() * spawnChance) == 1) { //spawn a particle
                      let particleAngle = Math.floor(Math.random() * 360) * Math.PI / 180;
                      let distanceFromCenter = Math.floor(Math.random() * object.width * 2) - object.width;
                      radparticles[particleID] = {
                        angle: particleAngle,
                        x: object.x + distanceFromCenter * Math.cos(particleAngle),
                        y: object.y + distanceFromCenter * Math.sin(particleAngle),
                        width: 5,
                        height: 5,
                        speed: 1,
                        timer: 25,
                        maxtimer: 25,
                        color: ctx.fillStyle,
                        outline: ctx.strokeStyle,
                        type: "particle",
                      };
                      if (object.radtier == 4){
                        radparticles[particleID].width = Math.floor(Math.random() * 10) + 5;
                      }
                      else if (object.radtier == 5){
                        radparticles[particleID].width = Math.floor(Math.random() * 20) + 5;
                        radparticles[particleID].speed = 3;
                        radparticles[particleID].timer = 50;
                        radparticles[particleID].maxtimer = 50;
                      }
                      particleID++;
                    }
                  }
                } else {
                  //if not radiant
                  //get shape colors in client code based on theme
                  let shapetype = object.sides - 3;
                  if (object.sides == 4){
                    shapetype = 0;
                  }
                  else if (object.sides == 3){
                    shapetype = 1;
                  }
                  ctx.fillStyle = shapecolors[shapetype];
                  ctx.strokeStyle = shapeoutlines[shapetype];
                  
                  if (object.hit > 0){//if shape is hit
                    if (!shapeHit.hasOwnProperty(id)){
                      shapeHit[id] = 0;
                    }
                    if (object.sides > 8){//nonagon, decagon, hendecagon etc. dont turn very white upon collision with bullets or players
                      maxshade = 0.03;
                    }
                    else{
                      maxshade = 0.3;//shapes turn 30% whiter when hit  (log, not linear)
                    }
                    shapeHit[id] += (maxshade/5);//make shape whiter
                    if (shapeHit[id] > maxshade){
                      shapeHit[id] = maxshade;
                    }
                  }
                  else if (shapeHit[id] > 0){
                    shapeHit[id] -= (maxshade/5);//make shape whiter
                    if (shapeHit[id] < 0.00001){
                      shapeHit[id] = 0;
                    }
                  }
                  if (shapeHit[id]>0){//even if not hit, still need to animate from whitish color to normal shape color
                    if (shapeHit[id] == maxshade && object.sides <= 8){//slight flash
                      shapeHit[id]-=(Math.random() * 0.2 + maxshade/5);
                    }
                    ctx.fillStyle = pSBC ( shapeHit[id], shapecolors[shapetype], false, true );//LINEAR BLENDING (dont use log blending, or else heptagon look too greyish)
                    ctx.strokeStyle = pSBC ( shapeHit[id], shapeoutlines[shapetype], false, true );
                  }
                }
                //draw the actual shape
                ctx.lineJoin = "round";
                ctx.lineWidth = 4 / clientFovMultiplier;
                if (object.sides < 0) { //draw a star shape (fix colors and outlines in the future)
                  drawSpikes(0.5, 1, -object.sides, object.width);
                } else {
                  renderPolygon(object.width / clientFovMultiplier, object.sides);
                }
                ctx.lineJoin = "miter"; //change back to default
                ctx.restore(); //must restore to reset angle rotation so health bar wont be rotated sideways
                //draw shape's health bar
                if (object.health < object.maxhealth) {
                  //draw health bar background
                  if (!shapeHealthBar.hasOwnProperty(id)){//for health bar width animation when first get damage
                    shapeHealthBar[id] = 0;
                  }
                  else if (shapeHealthBar[id] < 10){
                    shapeHealthBar[id]+=2*deltaTime;
                  }
                  if (shapeHealthBar[id] > 10){
                    shapeHealthBar[id] = 10;
                  }
                  var w = (object.width / clientFovMultiplier) * 2 * (shapeHealthBar[id]/10);
                  var h = 7 / clientFovMultiplier;
                  var r = h / 2;
                  var x = drawingX - object.width / clientFovMultiplier * (shapeHealthBar[id]/10);
                  var y = drawingY + object.width / clientFovMultiplier + 10;
                  ctx.fillStyle = "black";
                  ctx.strokeStyle = "black";
                  ctx.lineWidth = 2.5 / clientFovMultiplier;//determines with of black area
                  ctx.beginPath();
                  ctx.roundRect(x,y,w,h,r);
                  ctx.fill();
                  ctx.stroke();
                  //draw health bar
                  if (object.health > 0) {
                    //dont draw health bar if negative health
                    w *= (object.health / object.maxhealth);
                    if (r * 2 > w) { //prevent weird shape when radius more than width
                      r = w / 2;
                      y += (h - w) / 2; //move health bar so that it is centered vertically in black bar
                      h = w;
                    }
                    if (object.hasOwnProperty("radtier")) {
                      ctx.fillStyle = radShapeCol;
                    } else {
                      let shapetype = object.sides - 3;
                      if (object.sides == 4){
                        shapetype = 0;
                      }
                      else if (object.sides == 3){
                        shapetype = 1;
                      }
                      ctx.fillStyle = shapecolors[shapetype];
                      if (object.sides==10||object.sides==11||object.sides==14){//these shapes are very dark, cannot see health bar
                        ctx.fillStyle = shapecolors[9];//use dodecagon's grey color for health bar
                      }
                    }
                    ctx.beginPath();
                    ctx.roundRect(x,y,w,h,r);
                    ctx.fill();
                    ctx.stroke();
                  }
                }
                if (object.hasOwnProperty("deadOpacity")) {
                  //if this is an animation of a dead object
                  ctx.globalAlpha = 1.0; //reset opacity
                }
                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(drawingX, drawingY, object.width/clientFovMultiplier, 0, 2 * Math.PI);
                  ctx.stroke();
                  //write shape name
                  ctx.fillStyle = "white";
                  ctx.strokeStyle = "black";
                  ctx.lineWidth = 9;
                  ctx.font = "700 15px Roboto";
                  ctx.textAlign = "center";
                  ctx.lineJoin = "round";
                  let name = "";
                  if (object.radtier == 1){name = "Radiant "}
                  else if (object.radtier == 2){name = "Gleaming "}
                  else if (object.radtier == 3){name = "Luminous "}
                  else if (object.radtier == 4){name = "Lustrous "}
                  else if (object.radtier == 5){name = "Highly Radiant "}
                  let shapetype = object.sides - 3;
                  if (object.sides == 4){shapetype = 0;}
                  else if (object.sides == 3){shapetype = 1;}
                  name += shapeNames[shapetype];
                  ctx.strokeText(name,drawingX, drawingY-(object.width+20) / clientFovMultiplier);
                  ctx.fillText(name,drawingX, drawingY-(object.width+20) / clientFovMultiplier);
                  ctx.lineJoin = "miter";
                }
            }

            function drawPlayer(canvas, object, fov, spawnProtect, playercolor, playeroutline, eternal, objectangle, id){//only barrels and body (no heath bars, names, and chats)
              //objectangle refers to angle rotated before triggering this function
              //fov is clientFovMultiplier for ctx, hctx is 1
                canvas.lineJoin = "round"; //make nice round corners
                //draw assets below body, e.g. rammer body base
                for (const assetID in object.assets){
                  var asset = object.assets[assetID];
                  if (asset.type == "under") {
                    let assetcolor = asset.color;
                    let assetoutline = asset.outline;
                    canvas.lineWidth = asset.outlineThickness / fov;
                    if (assetcolor == "default"){//asset same color as body, e.g. ziggurat
                      assetcolor = playercolor;
                    }
                    if (assetoutline == "default"){//asset same color as body, e.g. ziggurat
                      assetoutline = playeroutline;
                    }
                    drawAsset(asset,object.width/fov,assetcolor,assetoutline,canvas)
                  }
                }

                //draw barrel
                canvas.lineWidth = 4 / fov;
                //weapon barrels
                for (const barrel in object.barrels){
                  let thisBarrel = object.barrels[barrel];
                  canvas.rotate((thisBarrel.additionalAngle * Math.PI) / 180); //rotate to barrel angle
                  canvas.fillStyle = bodyColors.barrel.col;
                  canvas.strokeStyle = bodyColors.barrel.outline;
                  if (spawnProtect == "yes") {
                    //if have spawn protection
                    canvas.fillStyle = pSBC ( spawnprotectionShade, bodyColors.barrel.col );
                    canvas.strokeStyle = pSBC ( spawnprotectionShade, bodyColors.barrel.outline );
                  }
                  //lerp barrel animation
                  let oldbarrelheight;
                  try{
                    oldbarrelheight = oldobjects.player[id].barrels[barrel].barrelHeightChange;
                  }
                  catch(err){}
                  let lerpedheight = thisBarrel.barrelHeightChange;
                  if (oldbarrelheight){
                    lerpedheight = oldbarrelheight + (thisBarrel.barrelHeightChange - oldbarrelheight)/updateInterval*(Date.now() - latestServerUpdateTime);
                  }
                  //bullet barrel
                  //note: barrelHeightChange refers to reduction in barrel height for barrel animation when shooting
                  if (thisBarrel.barrelType == "bullet") {
                    drawBulletBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov)
                  }
                  //drone barrel
                  else if (thisBarrel.barrelType == "drone") {
                    drawDroneBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov)
                  }
                  //trap barrel
                  else if (thisBarrel.barrelType == "trap") {
                    drawTrapBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov,object.width)
                  }
                  //mine barrel
                  else if (thisBarrel.barrelType == "mine") {
                    drawMineBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov,object.width)
                  }
                  //minion barrel
                  else if (thisBarrel.barrelType == "minion") {
                    drawMinionBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov)
                  }
                  canvas.rotate((-thisBarrel.additionalAngle * Math.PI) / 180); //rotate back
                }

                //draw player body
                canvas.fillStyle = playercolor;
                canvas.strokeStyle = playeroutline;
                if (object.rad > 0){//rad player
                  if (!radiantShapes.hasOwnProperty(id)) {
                    var randomstate = Math.floor(Math.random() * 3); //randomly choose a color state for the radiant shape to start (if not when you spawn in cavern, all shapes same color)
                    var randomtype = Math.floor(Math.random() * 2) + 1; //choose animation color type (1 or 2)
                    if (randomtype == 1) {
                      if (randomstate == 0) {
                        radiantShapes[id] = {
                          red: 255,
                          blue: 0,
                          green: 0,
                          rgbstate: 1,
                          radtype: randomtype,
                        }; //keep track of radiant shape colors (done in client code)
                      } else if (randomstate == 1) {
                        radiantShapes[id] = {
                          red: 199,
                          blue: 0,
                          green: 150,
                          rgbstate: 2,
                          radtype: randomtype,
                        };
                      } else if (randomstate == 2) {
                        radiantShapes[id] = {
                          red: -1,
                          blue: 200,
                          green: 0,
                          rgbstate: 3,
                          radtype: randomtype,
                        };
                      }
                    } else {
                      if (randomstate == 0) {
                        radiantShapes[id] = {
                          red: 118,
                          blue: 168,
                          green: 151,
                          rgbstate: 1,
                          radtype: randomtype,
                        };
                      } else if (randomstate == 1) {
                        radiantShapes[id] = {
                          red: 209,
                          blue: 230,
                          green: 222,
                          rgbstate: 2,
                          radtype: randomtype,
                        };
                      } else if (randomstate == 2) {
                        radiantShapes[id] = {
                          red: 234,
                          blue: 240,
                          green: 180,
                          rgbstate: 3,
                          radtype: randomtype,
                        };
                      }
                    }
                  }
                  object.red = radiantShapes[id].red;
                  object.blue = radiantShapes[id].blue;
                  object.green = radiantShapes[id].green;
                  let radiantAuraSize = 5 * auraWidth;
                  //calculate color of spikes, which would be 20 higher than actual rgb value
                  if (object.red + 150 <= 255) {
                    var spikeRed = object.red + 150;
                  } else {
                    var spikeRed = 255;
                  }
                  if (object.blue + 150 <= 255) {
                    var spikeBlue = object.blue + 150;
                  } else {
                    var spikeBlue = 255;
                  }
                  if (object.green + 150 <= 255) {
                    var spikeGreen = object.green + 150;
                  } else {
                    var spikeGreen = 255;
                  }
                  if (object.rad == 3) {
                    //for high rarity radiant shapes, draw spikes
                    canvas.rotate((extraSpikeRotate * Math.PI) / 180);
                    canvas.fillStyle = "rgba(" + spikeRed + ", " + spikeGreen + ", " + spikeBlue + ", 0.7)";
                    canvas.strokeStyle = "rgba(" + spikeRed + ", " + spikeGreen + ", " + spikeBlue + ", 0.3)";
                    var numberOfSpikes = 6;
                    var outerRadius = ((object.width * radiantAuraSize * 3) / fov) * 0.75;
                    var innerRadius = (object.width / fov) * 0.75;
                    var rot = (Math.PI / 2) * 3;
                    var x = 0;
                    var y = 0;

                    canvas.beginPath();
                    canvas.moveTo(0, 0 - outerRadius);
                    for (i = 0; i < numberOfSpikes; i++) {
                      x = 0 + Math.cos(rot) * outerRadius;
                      y = 0 + Math.sin(rot) * outerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                      x = 0 + Math.cos(rot) * innerRadius;
                      y = 0 + Math.sin(rot) * innerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                    }
                    canvas.lineTo(0, 0 - outerRadius);
                    canvas.closePath();
                    canvas.lineWidth = 3 / fov;
                    canvas.fill();
                    canvas.stroke();
                    canvas.rotate((-extraSpikeRotate * Math.PI) / 180);
                  } else if (object.rad == 4) {
                    //for high rarity radiant shapes, draw spikes
                    canvas.rotate((extraSpikeRotate1 * Math.PI) / 180);
                    canvas.fillStyle = "rgba(" + spikeRed + ", " + spikeGreen + ", " + spikeBlue + ", 0.7)";
                    canvas.strokeStyle = "rgba(" + spikeRed + ", " + spikeGreen + ", " + spikeBlue + ", 0.3)";
                    var numberOfSpikes = 3;
                    var outerRadius = (object.width * radiantAuraSize * 3) / fov;
                    var innerRadius = (object.width / fov) * 0.5;
                    var rot = (Math.PI / 2) * 3;
                    var x = 0;
                    var y = 0;
                    canvas.beginPath();
                    canvas.moveTo(0, 0 - outerRadius);
                    for (i = 0; i < numberOfSpikes; i++) {
                      x = 0 + Math.cos(rot) * outerRadius;
                      y = 0 + Math.sin(rot) * outerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                      x = 0 + Math.cos(rot) * innerRadius;
                      y = 0 + Math.sin(rot) * innerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                    }
                    canvas.lineTo(0, 0 - outerRadius);
                    canvas.closePath();
                    canvas.lineWidth = 3 / fov;
                    canvas.fill();
                    canvas.stroke();
                    canvas.rotate((-extraSpikeRotate1 * Math.PI) / 180);
                    canvas.rotate((extraSpikeRotate2 * Math.PI) / 180);
                    var numberOfSpikes = 6;
                    var outerRadius =
                      ((object.width * radiantAuraSize * 3) / fov) *
                      0.5;
                    var innerRadius = (object.width / fov) * 0.5;
                    var rot = (Math.PI / 2) * 3;
                    var x = 0;
                    var y = 0;
                    canvas.beginPath();
                    canvas.moveTo(0, 0 - outerRadius);
                    for (i = 0; i < numberOfSpikes; i++) {
                      x = 0 + Math.cos(rot) * outerRadius;
                      y = 0 + Math.sin(rot) * outerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                      x = 0 + Math.cos(rot) * innerRadius;
                      y = 0 + Math.sin(rot) * innerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                    }
                    canvas.lineTo(0, 0 - outerRadius);
                    canvas.closePath();
                    canvas.lineWidth = 3 / fov;
                    canvas.fill();
                    canvas.stroke();
                    canvas.rotate((-extraSpikeRotate2 * Math.PI) / 180);
                  } else if (object.rad == 5) {
                    //for high rarity radiant shapes, draw spikes
                    canvas.rotate((extraSpikeRotate1 * Math.PI) / 180);
                    canvas.fillStyle = "rgba(" + spikeRed + ", " + spikeGreen + ", " + spikeBlue + ", 0.7)";
                    canvas.strokeStyle = "rgba(" + spikeRed + ", " + spikeGreen + ", " + spikeBlue + ", 0.3)";
                    var numberOfSpikes = 3;
                    var outerRadius = ((object.width * radiantAuraSize * 3) / fov) * 1.5;
                    var innerRadius = (object.width / fov) * 0.5;
                    var rot = (Math.PI / 2) * 3;
                    var x = 0;
                    var y = 0;
                    canvas.beginPath();
                    canvas.moveTo(0, 0 - outerRadius);
                    for (i = 0; i < numberOfSpikes; i++) {
                      x = 0 + Math.cos(rot) * outerRadius;
                      y = 0 + Math.sin(rot) * outerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                      x = 0 + Math.cos(rot) * innerRadius;
                      y = 0 + Math.sin(rot) * innerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                    }
                    canvas.lineTo(0, 0 - outerRadius);
                    canvas.closePath();
                    canvas.lineWidth = 3 / fov;
                    canvas.fill();
                    canvas.stroke();
                    canvas.rotate((-extraSpikeRotate1 * Math.PI) / 180);
                    canvas.rotate((extraSpikeRotate2 * Math.PI) / 180);
                    var numberOfSpikes = 3;
                    var outerRadius =
                      ((object.width * radiantAuraSize * 3) / fov) *
                      0.5;
                    var innerRadius = (object.width / fov) * 0.5;
                    var rot = (Math.PI / 2) * 3;
                    var x = 0;
                    var y = 0;
                    canvas.beginPath();
                    canvas.moveTo(0, 0 - outerRadius);
                    for (i = 0; i < numberOfSpikes; i++) {
                      x = 0 + Math.cos(rot) * outerRadius;
                      y = 0 + Math.sin(rot) * outerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                      x = 0 + Math.cos(rot) * innerRadius;
                      y = 0 + Math.sin(rot) * innerRadius;
                      canvas.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                    }
                    canvas.lineTo(0, 0 - outerRadius);
                    canvas.closePath();
                    canvas.lineWidth = 3 / fov;
                    canvas.fill();
                    canvas.stroke();
                    canvas.rotate((-extraSpikeRotate2 * Math.PI) / 180);
                  }

                  //old code where aura have shape
                  canvas.fillStyle =
                    "rgba(" +
                    object.red +
                    ", " +
                    object.green +
                    ", " +
                    object.blue +
                    ", 0.3)";
                  canvas.strokeStyle =
                    "rgba(" +
                    object.red +
                    ", " +
                    object.green +
                    ", " +
                    object.blue +
                    ", 0.3)";
                  canvas.lineWidth = 3 / fov;
                  canvas.beginPath();

                  let shapeaurasize = object.rad;
                  if (shapeaurasize > 3) {
                    shapeaurasize = 3; //prevent huge auras
                  }
                  canvas.beginPath();
                  canvas.arc(0, 0, object.width * radiantAuraSize * shapeaurasize / fov, 0, 2 * Math.PI);
                  canvas.fill();
                  canvas.stroke();
                  var shadeFactor = 3 / 4; //smaller the value, darker the shade
                  canvas.strokeStyle =
                    "rgb(" +
                    object.red * shadeFactor +
                    ", " +
                    object.green * shadeFactor +
                    ", " +
                    object.blue * shadeFactor +
                    ")";
                  canvas.fillStyle =
                    "rgb(" +
                    object.red +
                    ", " +
                    object.green +
                    ", " +
                    object.blue +
                    ")";
                  if (object.hit > 0) {
                    //if shape is hit
                    canvas.strokeStyle =
                      "rgb(" +
                      (object.red * shadeFactor + 20) +
                      ", " +
                      (object.green * shadeFactor + 20) +
                      ", " +
                      (object.blue * shadeFactor + 20) +
                      ")";
                    canvas.fillStyle =
                      "rgb(" +
                      (object.red + 20) +
                      ", " +
                      (object.green + 20) +
                      ", " +
                      (object.blue + 20) +
                      ")";
                  }

                  //choose whether a particle would spawn
                  //particle spawn chance based on number of sides the shape has, so square has less particles
                  if (spawnradparticle == "yes"){
                    var chooseValue = 20 - object.sides * 2; //lower the number means more particles spawned
                    if (chooseValue < 5) {
                      //5 refers to mimimum particle spawn chance
                      chooseValue = 5;
                    }
                    if (object.radtier == 4){
                      chooseValue -= 2;
                    }
                    else if (object.radtier == 5){
                      chooseValue -= 3;
                    }
                    var choosing = Math.floor(Math.random() * chooseValue); //choose if particle spawn
                    if (choosing == 1) {
                      //spawn a particle
                      var angleDegrees = Math.floor(Math.random() * 360); //choose angle in degrees
                      var angleRadians = (angleDegrees * Math.PI) / 180; //convert to radians
                      var randomDistFromCenter =
                        Math.floor(Math.random() * object.width * 2) - object.width;
                      radparticles[particleID] = {
                        angle: angleRadians,
                        x: object.x + randomDistFromCenter * Math.cos(angleRadians),
                        y: object.y + randomDistFromCenter * Math.sin(angleRadians),
                        width: 5,
                        height: 5,
                        speed: 1,
                        timer: 25,
                        maxtimer: 25,
                        color:
                          "rgba(" +
                          object.red +
                          "," +
                          object.green +
                          "," +
                          object.blue +
                          ",.5)",
                        outline:
                          "rgba(" +
                          (object.red* shadeFactor + 20) +
                          "," +
                          (object.green* shadeFactor + 20) +
                          "," +
                          (object.blue* shadeFactor + 20) +
                          ",.5)",
                        type: "particle",
                      };
                      if (object.radtier == 4){
                        radparticles[particleID].width = Math.floor(Math.random() * 10) + 5;
                      }
                      else if (object.radtier == 5){
                        radparticles[particleID].width = Math.floor(Math.random() * 20) + 5;
                        radparticles[particleID].speed = 3;
                        radparticles[particleID].timer = 50;
                        radparticles[particleID].maxtimer = 50;
                      }
                      particleID++;
                    }
                  }
                } // end of rad player code
                if (eternal == "no") {
                  //not a tier 6 tank
                  if(object.width >= 0) {
                    if (!object.sides){
                      canvas.beginPath();
                      canvas.arc(0, 0, object.width / fov, 0, 2 * Math.PI);
                      canvas.fill();
                      canvas.stroke();
                    }
                    else{
                      if (object.sides >= 0){
                        let baseSides = object.sides;
                        //rotate to fix weird angle
                        if (baseSides == 3){
                          canvas.rotate(30 * Math.PI / 180);
                        }
                        else if (baseSides == 4){
                          canvas.rotate(45 * Math.PI / 180);
                        }
                        else if (baseSides == 5){
                          canvas.rotate(17.5 * Math.PI / 180);
                        }
                        else if (baseSides == 7){
                          canvas.rotate(40 * Math.PI / 180);
                        }
                        else if (baseSides == 9){
                          canvas.rotate(12 * Math.PI / 180);
                        }
                        canvas.beginPath();
                        canvas.moveTo((object.width / fov), 0);
                        for (var i = 1; i <= baseSides; i++) {
                          canvas.lineTo((object.width / fov) * Math.cos((i * 2 * Math.PI) / baseSides), (object.width / fov) * Math.sin((i * 2 * Math.PI) / baseSides));
                        }
                        canvas.fill();
                        canvas.stroke();
                        if (baseSides == 3){
                          canvas.rotate(-30 * Math.PI / 180);
                        }
                        else if (baseSides == 4){
                          canvas.rotate(-45 * Math.PI / 180);
                        }
                        else if (baseSides == 5){
                          canvas.rotate(-17.5 * Math.PI / 180);
                        }
                        else if (baseSides == 7){
                          canvas.rotate(-40 * Math.PI / 180);
                        }
                        else if (baseSides == 9){
                          canvas.rotate(-12 * Math.PI / 180);
                        }
                      }
                      else{
                        let numberOfSpikes = -object.sides;
                        let outerRadius = object.width / fov;
                        let innerRadius = (object.width / fov / 2);
                        let rot = (Math.PI / 2) * 3;
                        let x = 0;
                        let y = 0;
                        canvas.beginPath();
                        canvas.moveTo(0, -outerRadius);
                        for (i = 0; i < numberOfSpikes; i++) {
                          x = Math.cos(rot) * outerRadius;
                          y = Math.sin(rot) * outerRadius;
                          canvas.lineTo(x, y);
                          rot += Math.PI / numberOfSpikes;
                          x = Math.cos(rot) * innerRadius;
                          y = Math.sin(rot) * innerRadius;
                          canvas.lineTo(x, y);
                          rot += Math.PI / numberOfSpikes;
                        }
                        canvas.lineTo(0, -outerRadius);
                        canvas.closePath();
                        canvas.fill();
                        canvas.stroke();
                      }
                    }
                  }
                } else {
                  //if a tier 6 tank
                  canvas.beginPath();
                  let baseSides = 6;
                  canvas.moveTo((object.width / fov), 0);
                  for (var i = 1; i <= baseSides; i++) {
                    canvas.lineTo((object.width / fov) * Math.cos((i * 2 * Math.PI) / baseSides), (object.width / fov) * Math.sin((i * 2 * Math.PI) / baseSides));
                  }
                  canvas.fill();
                  canvas.stroke();
                }
                
                //draw assets above body, e.g. aura assets
                for (const assetID in object.assets){
                  var asset = object.assets[assetID];
                  if (asset.type == "above") {
                    let assetcolor = asset.color;
                    let assetoutline = asset.outline;
                    canvas.lineWidth = asset.outlineThickness / fov;
                    if (assetcolor == "default"){//asset same color as body, e.g. ziggurat
                      assetcolor = playercolor;
                    }
                    if (assetoutline == "default"){//asset same color as body, e.g. ziggurat
                      assetoutline = playeroutline;
                    }
                    drawAsset(asset,object.width/fov,assetcolor,assetoutline,canvas)
                  }
                }

                //barrels in body upgrade
                for (const barrel in object.bodybarrels){
                  let thisBarrel = object.bodybarrels[barrel];
          //lerp barrel angle
                  let oldangle;
                  try{
                    oldangle = oldobjects.player[id].bodybarrels[barrel].additionalAngle;
                  }
                  catch(err){}
                  let newangle = thisBarrel.additionalAngle;
                  let lerpedAngle = newangle;
                  if (oldangle){
                    if ((oldangle - newangle)>5.25){//angle went from 360 to 0
                      oldangle-=2*Math.PI;
                    }
                    else if ((newangle - oldangle)>5.25){//angle went from 0 to 360
                      oldangle+=2*Math.PI;
                    }
                    lerpedAngle = oldangle + (newangle - oldangle)/updateInterval*(Date.now() - latestServerUpdateTime);
                  }
                  canvas.rotate(lerpedAngle - objectangle); //rotate to barrel angle
                  canvas.fillStyle = bodyColors.barrel.col;
                  canvas.strokeStyle = bodyColors.barrel.outline;
                  if (spawnProtect == "yes") {
                    //if have spawn protection
                    canvas.fillStyle = pSBC ( spawnprotectionShade, bodyColors.barrel.col );
                    canvas.strokeStyle = pSBC ( spawnprotectionShade, bodyColors.barrel.outline );
                  }
                  //lerp barrel animation
                  let oldbarrelheight;
                  try{
                    oldbarrelheight = oldobjects.player[id].bodybarrels[barrel].barrelHeightChange;
                  }
                  catch(err){}
                  let lerpedheight = thisBarrel.barrelHeightChange;
                  if (oldbarrelheight){
                    lerpedheight = oldbarrelheight + (thisBarrel.barrelHeightChange - oldbarrelheight)/updateInterval*(Date.now() - latestServerUpdateTime);
                  }
                  //bullet barrel
                  if (thisBarrel.barrelType == "bullet") {
                    drawBulletBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov)
                  }
                  //drone barrel
                  else if (thisBarrel.barrelType == "drone") {
                    if (Math.abs(thisBarrel.barrelWidth - thisBarrel.barrelHeight) > 3){//not a square, dont use equal cuz there might be rounding errors
                      drawDroneBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov)
                    }
                    else{
                      canvas.rotate(objectangle);//rotate to player angle
                      drawDroneTurret(canvas,thisBarrel.x,thisBarrel.barrelWidth,lerpedheight,fov)
                      canvas.rotate(-objectangle);
                    }
                  }
                  //trap barrel (doesnt exist atm)
                  else if (thisBarrel.barrelType == "trap") {
                    drawTrapBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov,object.width)
                  }
                  //mine barrel (doesnt exist atm)
                  else if (thisBarrel.barrelType == "mine") {
                    drawMineBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov,object.width)
                  }
                  //minion barrel (doesnt exist atm)
                  else if (thisBarrel.barrelType == "minion") {
                    drawMinionBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,lerpedheight,fov)
                  }
                  canvas.rotate(-lerpedAngle + objectangle); //rotate back
                }
                //draw turret base
                if ('turretBaseSize' in object){
                  canvas.fillStyle = bodyColors.barrel.col;
                  canvas.strokeStyle = bodyColors.barrel.outline;
                  canvas.beginPath();
                  canvas.arc(0, 0, (object.width / clientFovMultiplier) * object.turretBaseSize, 0, 2 * Math.PI);
                  canvas.fill();
                  canvas.stroke();
                }

                canvas.lineJoin = "miter"; //change back
            }

            function drawFakePlayer(name,x,y,bodysize,bodyangle,bodycolor,bodyoutline,which) {//draw player that doesnt exist, e.g. leaderboard, homepage etc
                  hctx.save();
                  hctx.translate(x, y);
                  hctx.rotate(bodyangle);

                  let bodywhich;
                  let ishomeScreen = false;//if home screen, then turrets turn at an angle
                  if (which == "bodya"){bodywhich="above";which="body";ishomeScreen=true;}
                  else if (which == "bodyu"){bodywhich="under";which="body";}//need to specify to render weapon upgrade in between assets that are below and above the body

                  if (which == "body" && (name in bodyupgrades)) {
                    if (bodyupgrades[name].hasOwnProperty("assets") && bodywhich!="above") {//bodywhich is under or neither (render both)
                      //draw under assets
                      for (const assetID in bodyupgrades[name].assets) {
                        var asset = bodyupgrades[name].assets[assetID];
                        if (asset.type == "under") {
                          let assetcolor = asset.color;
                          let assetoutline = asset.outline;
                          if (assetcolor == "default"){//asset same color as body, e.g. ziggurat
                            assetcolor = bodycolor;
                          }
                          if (assetoutline == "default"){//asset same color as body, e.g. ziggurat
                            assetoutline = bodyoutline;
                          }
                          drawAsset(asset,bodysize,assetcolor,assetoutline,hctx)
                        }
                      }
                    }
                    hctx.fillStyle = bodycolor;
                    hctx.strokeStyle = bodyoutline;
                    if (!bodyupgrades[name].eternal){
                      hctx.beginPath();
                      hctx.arc(0, 0, bodysize, 0, 2 * Math.PI);
                      hctx.fill();
                      hctx.stroke();
                    }
                    else{
                      hctx.beginPath();
                      let baseSides = 6;
                      hctx.moveTo(bodysize, 0);
                      for (var i = 1; i <= baseSides; i++) {
                        hctx.lineTo(bodysize * Math.cos((i * 2 * Math.PI) / baseSides), bodysize * Math.sin((i * 2 * Math.PI) / baseSides));
                      }
                      hctx.fill();
                      hctx.stroke();
                    }
                    if (bodyupgrades[name].hasOwnProperty("assets") && bodywhich!="under") {
                      //draw above assets
                      Object.keys(bodyupgrades[name].assets).forEach((assetID) => {
                        var asset = bodyupgrades[name].assets[assetID];
                        if (asset.type == "above") {
                          let assetcolor = asset.color;
                          let assetoutline = asset.outline;
                          if (assetcolor == "default"){//asset same color as body, e.g. ziggurat
                            assetcolor = bodycolor;
                          }
                          if (assetoutline == "default"){//asset same color as body, e.g. ziggurat
                            assetoutline = bodyoutline;
                          }
                          drawAsset(asset,bodysize,assetcolor,assetoutline,hctx)
                        }
                      });
                    }
                    if (bodyupgrades[name].hasOwnProperty("bodybarrels") && bodywhich!="under") {
                      //draw barrels
                      hctx.fillStyle = bodyColors.barrel.col;
                      hctx.strokeStyle = bodyColors.barrel.outline;
                      for (const barrel in bodyupgrades[name].bodybarrels) {
                          let thisBarrel = bodyupgrades[name].bodybarrels[barrel];
                          hctx.rotate(thisBarrel.additionalAngle);
                          if (ishomeScreen === true && thisBarrel.barrelType != "drone"){//rotate turrets at an angle for home screen so that they dont awkwardly point forward
                            hctx.rotate(45/180*Math.PI);
                          }
                        //bullet barrel
                          if (thisBarrel.barrelType == "bullet") {
                            drawBulletBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                          }
                          //drone barrel
                          else if (thisBarrel.barrelType == "drone") {
                            if (Math.round(thisBarrel.barrelWidth) != Math.round(thisBarrel.barrelHeight)){
                              drawDroneBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                            }
                            else{
                              drawDroneTurret(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,0,1)
                            }
                          }
                          //trap barrel (doesnt exist atm)
                          else if (thisBarrel.barrelType == "trap") {
                            drawTrapBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1, bodysize)
                          }
                          //mine barrel (doesnt exist atm)
                          else if (thisBarrel.barrelType == "mine") {
                            drawMineBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1, bodysize)
                          }
                          //minion barrel (doesnt exist atm)
                          else if (thisBarrel.barrelType == "minion") {
                            drawMinionBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                          }
                          hctx.rotate(-thisBarrel.additionalAngle); //rotate back
                          if (ishomeScreen === true && thisBarrel.barrelType != "drone"){//rotate back
                            hctx.rotate(-45/180*Math.PI);
                          }
                        }
                      //draw turret base
                      hctx.beginPath();
                      hctx.arc(0,0,bodysize * bodyupgrades[name].turretBaseSize,0,2 * Math.PI);
                      hctx.fill();
                      hctx.stroke();
                    }
                  } else if (which == "weapon" && (name in weaponupgrades)) {
                    if (weaponupgrades[name].hasOwnProperty("barrels")) {
                          hctx.fillStyle = bodyColors.barrel.col;
                          hctx.strokeStyle = bodyColors.barrel.outline;
                      Object.keys(weaponupgrades[name].barrels).forEach(
                        (assetID) => {
                          var thisBarrel = weaponupgrades[name].barrels[assetID];
                          hctx.rotate((thisBarrel.additionalAngle * Math.PI) / 180); //rotate to barrel angle
                          //bullet barrel
                          if (thisBarrel.barrelType == "bullet") {
                            drawBulletBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                          }
                          //drone barrel
                          else if (thisBarrel.barrelType == "drone") {
                            drawDroneBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                          }
                          //trap barrel (doesnt exist atm)
                          else if (thisBarrel.barrelType == "trap") {
                            drawTrapBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1, bodysize)
                          }
                          //mine barrel (doesnt exist atm)
                          else if (thisBarrel.barrelType == "mine") {
                            drawMineBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1, bodysize)
                          }
                          //minion barrel (doesnt exist atm)
                          else if (thisBarrel.barrelType == "minion") {
                            drawMinionBarrel(hctx,thisBarrel.x * bodysize,thisBarrel.barrelWidth * bodysize,thisBarrel.barrelHeight * bodysize,0,1)
                          }
                          hctx.rotate(
                            (-thisBarrel.additionalAngle * Math.PI) / 180
                          ); //rotate back
                        }
                      );
                    }
                    hctx.fillStyle = bodycolor;
                    hctx.strokeStyle = bodyoutline;
                    if (!weaponupgrades[name].eternal){
                      hctx.beginPath();
                      hctx.arc(0, 0, bodysize, 0, 2 * Math.PI);
                      hctx.fill();
                      hctx.stroke();
                    }
                    else{
                      hctx.beginPath();
                      let baseSides = 6;
                      hctx.moveTo(bodysize, 0);
                      for (var i = 1; i <= baseSides; i++) {
                        hctx.lineTo(bodysize * Math.cos((i * 2 * Math.PI) / baseSides), bodysize * Math.sin((i * 2 * Math.PI) / baseSides));
                      }
                      hctx.fill();
                      hctx.stroke();
                    }
                  }
                  hctx.restore();
                }

            function drawobjects(object, id, playerstring, auraWidth) {
              //function for drawing objects on the canvas. need to provide aura width because this fuction cannot access variables outside
              var drawingX = (object.x - px) / clientFovMultiplier + canvas.width / 2; //calculate the location on canvas to draw object
              var drawingY = (object.y - py) / clientFovMultiplier + canvas.height / 2;
              
              if (object.type == "bullet") {
                //draw bullet
                if (object.hasOwnProperty("deadOpacity")) {
                  //if this is an animation of a dead object
                  ctx.globalAlpha = object.deadOpacity;
                }
                ctx.lineJoin = "round";
                var chooseflash = 3;
                if (object.hit > 0 && object.bulletType != "aura") {
                  //if shape is hit AND bullet is not aura, choose whether it's color is white or original color to create flashing effect
                  chooseflash = Math.floor(Math.random() * 3); //random number 0, 1 or 2
                }
                if (chooseflash == 0) {
                  ctx.fillStyle = "white";
                } else if (chooseflash == 1) {
                  ctx.fillStyle = "pink";
                } else {
                  if (object.ownsIt == "yes" || object.bulletType == "aura") {
                    //if it's an aura or client's tank owns the bullet
                    ctx.fillStyle = object.color;
                  } else {
                    ctx.fillStyle = "#f04f54"; //bullet color is red
                  }
                }
                if (object.bulletType == "aura") {
                  var choosing = Math.floor(Math.random() * 3); //choose if particle spawn
                  if (choosing == 1) {
                    //spawn a particle
                    var angleDegrees = Math.floor(Math.random() * 360); //choose angle in degrees
                    var angleRadians = (angleDegrees * Math.PI) / 180; //convert to radians
                    var randomDistFromCenter =
                      Math.floor(Math.random() * object.width * 2) - object.width;
                    let auraoutline = object.outline;
                    if (auraoutline == "rgba(255,0,0,.15)"){//damaging aura will have particles that look too dark
                      auraoutline = auraoutline.substring(0, auraoutline.length - 3)+ '05)';//change opacity to 0.05
                    }
                    radparticles[particleID] = {
                      angle: angleRadians,
                      x: object.x + randomDistFromCenter * Math.cos(angleRadians),
                      y: object.y + randomDistFromCenter * Math.sin(angleRadians),
                      width: 5,
                      height: 5,
                      speed: 1,
                      timer: 15,
                      maxtimer: 50,
                      color: object.color,
                      outline: auraoutline,
                      type: "particle",
                    };
                    particleID++;
                  }
                }

                if (object.ownsIt == "yes" || object.bulletType == "aura") {
                  //if it's an aura or client's tank owns the bullet
                  ctx.strokeStyle = object.outline;
                } else {
                  ctx.strokeStyle = "#b33b3f"; //bullet is red
                }


                //bullet is purple even if bullet belongs to enemy
                if (object.color == "#934c93") {
                  ctx.fillStyle = object.color;
                }
                if (object.outline == "#660066") {
                  ctx.strokeStyle = object.outline;
                }

                //team colors
                if (bodyColors.hasOwnProperty(object.team)) {
                  ctx.fillStyle = bodyColors[object.team].col;
                  ctx.strokeStyle = bodyColors[object.team].outline;
                }

                if (object.bulletType == "aura"){
                  //color is aura color, regardless of team
                  ctx.fillStyle = object.color;
                  ctx.strokeStyle = object.outline;
                }

                if (object.passive == "yes") {
                  if (object.bulletType == "aura") {
                    ctx.strokeStyle = "rgba(128,128,128,.2)";
                    ctx.fillStyle = "rgba(128,128,128,.2)";
                  } else {
                    ctx.strokeStyle = "dimgrey";
                    ctx.fillStyle = "grey";
                  }
                }

                if (object.team=="mob"){
                  //dune mob's bullets is the colo of mob
                  ctx.fillStyle = botcolors[object.ownerName].color;
                  ctx.strokeStyle = botcolors[object.ownerName].outline;
                }

                ctx.lineWidth = 4 / clientFovMultiplier;
                if (object.bulletType == "bullet" || object.bulletType == "aura") {
                  if (!object.color.includes('rgba(57,185,102')){//not a heal aura
                    ctx.beginPath();
                    ctx.arc(
                      drawingX,
                      drawingY,
                      object.width / clientFovMultiplier,
                      0,
                      2 * Math.PI
                    );
                    ctx.fill();
                    ctx.stroke();
                  }
                  else{//8 sides for healing aura
                    ctx.beginPath();
                    ctx.moveTo((object.width / clientFovMultiplier) + drawingX, drawingY);
                    for (var i = 1; i <= 8 + 1; i += 1) {
                      ctx.lineTo(
                        (object.width / clientFovMultiplier) *
                            Math.cos((i * 2 * Math.PI) / 8) + drawingX,
                        (object.width / clientFovMultiplier) *
                            Math.sin((i * 2 * Math.PI) / 8) + drawingY
                      );
                    }
                    ctx.fill();
                    ctx.stroke();
                  }
                } else if (object.bulletType == "trap") {
                  //width is the radius, so need to times two to get total width
                  //note: x and y of object are the center of object, but when drawing rectangles, the x and y coordinates given need to be the top left corner of the rectangle, so need to minus the width and height
                  ctx.fillRect(
                    drawingX - object.width / clientFovMultiplier,
                    drawingY - object.width / clientFovMultiplier,
                    (object.width * 2) / clientFovMultiplier,
                    (object.width * 2) / clientFovMultiplier
                  );
                  ctx.strokeRect(
                    drawingX - object.width / clientFovMultiplier,
                    drawingY - object.width / clientFovMultiplier,
                    (object.width * 2) / clientFovMultiplier,
                    (object.width * 2) / clientFovMultiplier
                  );
                } else if (object.bulletType == "drone") {
                  ctx.save();
                  ctx.translate(drawingX, drawingY);
                  ctx.rotate(object.moveAngle);
                  //ctx.rotate((object.moveAngle*180/Math.PI - 90) *Math.PI/180);//cannot straightaway use the angle, must add 90 degrees to it, because 0 degrees is pointing right, but we are drawing the triangle upwards
                  ctx.beginPath();
                  ctx.moveTo(
                    (object.width / clientFovMultiplier) * Math.cos(0),
                    (object.width / clientFovMultiplier) * Math.sin(0)
                  );
                  for (var i = 1; i <= 3; i += 1) {
                    ctx.lineTo(
                      (object.width / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / 3),
                      (object.width / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / 3)
                    );
                  }
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();
                } else if (object.bulletType == "mine" || object.bulletType == "minion") {
                  //console.log(object.moveAngle/Math.PI*180)
                  //mine is trap with barrel, minion is bullet with barrel
                  ctx.save();
                  ctx.translate(drawingX, drawingY);
                  ctx.rotate(object.moveAngle);
                  //ctx.rotate((object.moveAngle*180/Math.PI - 90) *Math.PI/180);//cannot straightaway use the angle, must add 90 degrees to it, because 0 degrees is pointing right, but we are drawing the triangle upwards

                  if (object.bulletType == "minion"){
                    //draw barrels underneath
                    var prevfill = ctx.fillStyle;
                    var prevstroke = ctx.strokeStyle;//store previous bullet color so can change back later
                    ctx.fillStyle = bodyColors.barrel.col;
                    ctx.strokeStyle = bodyColors.barrel.outline;
                    Object.keys(object.barrels).forEach((barrel) => {
                      let thisBarrel = object.barrels[barrel];
                      ctx.rotate(thisBarrel.additionalAngle); //rotate to barrel angle
                      if (thisBarrel.barrelType == "bullet") {
                        drawBulletBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier)
                      }
                      else if (thisBarrel.barrelType == "drone") {
                        drawDroneBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier)
                      }
                      else if (thisBarrel.barrelType == "trap") {
                        drawTrapBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier, object.width)
                      }
                      else if (thisBarrel.barrelType == "mine") {
                        drawMineBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier, object.width)
                      }
                      else if (thisBarrel.barrelType == "minion") {
                        drawMinionBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier)
                      }
                    })
                    ctx.fillStyle = prevfill;
                    ctx.strokeStyle = prevstroke;
                  }
                  ctx.beginPath();
                  if (object.bulletType == "mine"){//mine
                    ctx.moveTo(
                      (object.width / clientFovMultiplier) * Math.cos(0),
                      (object.width / clientFovMultiplier) * Math.sin(0)
                    );
                    for (var i = 1; i <= 3; i += 1) {
                      ctx.lineTo(
                        (object.width / clientFovMultiplier) *
                          Math.cos((i * 2 * Math.PI) / 3),
                        (object.width / clientFovMultiplier) *
                          Math.sin((i * 2 * Math.PI) / 3)
                      );
                    }
                  }
                  else{//minion
                    ctx.arc(0, 0, object.width / clientFovMultiplier, 0, 2 * Math.PI);
                  }
                  ctx.fill();
                  ctx.stroke();
                  ctx.rotate(-object.moveAngle); //rotate back
                  //BARREL FOR THE MINE TRAP
                  if (object.bulletType == "mine"){
                  Object.keys(object.barrels).forEach((barrel) => {
                    let thisBarrel = object.barrels[barrel];
                    ctx.rotate(thisBarrel.additionalAngle); //rotate to barrel angle
                    ctx.fillStyle = "grey";
                    ctx.strokeStyle = "#5e5e5e";
                    if (thisBarrel.barrelType == "bullet") {
                        drawBulletBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier)
                      }
                      else if (thisBarrel.barrelType == "drone") {
                        drawDroneBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier)
                      }
                      else if (thisBarrel.barrelType == "trap") {
                        drawTrapBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier, object.width)
                      }
                      else if (thisBarrel.barrelType == "mine") {
                        drawMineBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier, object.width)
                      }
                      else if (thisBarrel.barrelType == "minion") {
                        drawMinionBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier)
                      }
                    ctx.beginPath();
                    ctx.arc(
                      0,
                      0,
                      thisBarrel.barrelWidth / clientFovMultiplier,
                      0,
                      2 * Math.PI
                    );
                    ctx.fill();
                    ctx.stroke();
                    ctx.rotate(-thisBarrel.additionalAngle); //rotate back
                  });
                }

                  ctx.restore();
                }
                ctx.lineJoin = "miter";
                if (object.hasOwnProperty("deadOpacity")) {
                  //if this is an animation of a dead object
                  ctx.globalAlpha = 1.0; //reset opacity
                }
                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(drawingX, drawingY, object.width/clientFovMultiplier, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              } else if (object.type == "bot") {
                //draw bot
                if (object.hasOwnProperty("deadOpacity")) {
                  //if this is an animation of a dead object
                  ctx.globalAlpha = object.deadOpacity;
                }
                ctx.lineWidth = 4 / clientFovMultiplier;
                ctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
                ctx.save();
                ctx.translate(drawingX, drawingY);
                ctx.rotate(object.angle);
                //draw barrels
                if (object.name!="Pillbox"){//pillbox's barrel is visually a turret
                  Object.keys(object.barrels).forEach((barrel) => {
                    let thisBarrel = object.barrels[barrel];
                    ctx.rotate(((thisBarrel.additionalAngle + 90) * Math.PI) / 180); //rotate to barrel angle
                    ctx.fillStyle = bodyColors.barrel.col;
                    ctx.strokeStyle = bodyColors.barrel.outline;
                    if (thisBarrel.barrelType == "bullet") {
                        drawBulletBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier)
                      }
                      else if (thisBarrel.barrelType == "drone") {
                        drawDroneBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier)
                      }
                      else if (thisBarrel.barrelType == "trap") {
                        drawTrapBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier, object.width)
                      }
                      else if (thisBarrel.barrelType == "mine") {
                        drawMineBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier, object.width)
                      }
                      else if (thisBarrel.barrelType == "minion") {
                        drawMinionBarrel(ctx,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,clientFovMultiplier)
                      }
                    ctx.rotate((-(thisBarrel.additionalAngle + 90) * Math.PI) / 180); //rotate back
                  });
                }
                if (object.name=="Cluster"){
                  //draw the spawning barrels
                  let barrelwidth = object.width*0.7;
                  let barrelheight = object.width*1.2;
                  ctx.fillStyle = bodyColors.barrel.col;
                  ctx.strokeStyle = bodyColors.barrel.outline;
                  ctx.save();
                  ctx.rotate(90 * Math.PI / 180);
                  for (let i = 0; i < 5; i++){
                    if (i!=0){
                      ctx.rotate(72 * Math.PI / 180); //rotate 72 for each barrel
                    }
                    ctx.beginPath();
                    ctx.moveTo(
                      -barrelwidth / 5 / clientFovMultiplier,
                      0
                    );
                    ctx.lineTo(
                      -barrelwidth / clientFovMultiplier,
                      -barrelheight / clientFovMultiplier
                    );
                    ctx.lineTo(
                      barrelwidth / clientFovMultiplier,
                      -barrelheight / clientFovMultiplier
                    );
                    ctx.lineTo(
                      barrelwidth / 5 / clientFovMultiplier,
                      0
                    );
                    ctx.fill();
                    ctx.stroke();
                  }
                  ctx.restore();
                }
                else if (object.name=="Infestor"){
                  //draw the spawning barrels
                  let barrelwidth = object.width*0.7;
                  let barrelheight = object.width*1.2;
                  ctx.fillStyle = bodyColors.barrel.col;
                  ctx.strokeStyle = bodyColors.barrel.outline;
                  ctx.save();
                  for (let i = 0; i < 4; i++){//normal barrels
                    if (i!=0){
                      ctx.rotate(90 * Math.PI / 180);
                    }
                    ctx.fillRect(
                      -barrelwidth / 2 / clientFovMultiplier,
                      -barrelheight / clientFovMultiplier,
                      barrelwidth / clientFovMultiplier,
                      barrelheight / clientFovMultiplier
                    );
                    ctx.strokeRect(
                      -barrelwidth / 2 / clientFovMultiplier,
                      -barrelheight / clientFovMultiplier,
                      barrelwidth / clientFovMultiplier,
                      barrelheight / clientFovMultiplier
                    );
                  }
                  ctx.restore();
                  ctx.save();
                  ctx.rotate(45 * Math.PI / 180);
                  barrelwidth = object.width*0.6;
                  barrelheight = object.width*2;
                  for (let i = 0; i < 4; i++){//traplike barrels
                    if (i!=0){
                      ctx.rotate(90 * Math.PI / 180);
                    }
                    ctx.fillRect(
                      -barrelwidth / 2 / clientFovMultiplier,
                      -barrelheight * 0.55 / clientFovMultiplier,
                      barrelwidth / clientFovMultiplier,
                      barrelheight * 0.5 / clientFovMultiplier
                    );
                    ctx.strokeRect(
                      -barrelwidth / 2 / clientFovMultiplier,
                      -barrelheight * 0.55 / clientFovMultiplier,
                      barrelwidth / clientFovMultiplier,
                      barrelheight * 0.5 / clientFovMultiplier
                    );
                    ctx.beginPath();
                    ctx.moveTo(
                      -barrelwidth / 2 / clientFovMultiplier,
                      -barrelheight * 0.55 / clientFovMultiplier
                    );
                    ctx.lineTo(
                      -barrelwidth/1.7 / clientFovMultiplier,
                      -barrelheight * 0.65 / clientFovMultiplier
                    );
                    ctx.lineTo(
                      barrelwidth/1.7 / clientFovMultiplier,
                      -barrelheight * 0.65 / clientFovMultiplier
                    );
                    ctx.lineTo(
                      barrelwidth / 2 / clientFovMultiplier,
                      -barrelheight * 0.55 / clientFovMultiplier
                    );
                    ctx.fill();
                    ctx.stroke();
                  }
                  ctx.restore();
                }
                else if (object.name=="Champion"){
                  //draw spikes
                  var numberOfSpikes = 5;
                  var outerRadius = object.width / clientFovMultiplier * 1.3;
                  var innerRadius = object.width / clientFovMultiplier /1.3;
                  var rot = (Math.PI / 2) * 3;//dont change this, or else will have strange extra lines
                  var x = 0;
                  var y = 0;
                  ctx.fillStyle = bodyColors.barrel.col;
                  ctx.strokeStyle = bodyColors.barrel.outline;
                  ctx.save();
                  ctx.rotate(90 * Math.PI / 180);
                  ctx.beginPath();
                  ctx.moveTo(0, 0 - outerRadius);
                  for (i = 0; i < numberOfSpikes; i++) {
                    x = 0 + Math.cos(rot) * outerRadius;
                    y = 0 + Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                    x = 0 + Math.cos(rot) * innerRadius;
                    y = 0 + Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                  }
                  ctx.lineTo(0, 0 - outerRadius);
                  ctx.closePath();
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();
                }
                var chooseflash = 3;
                if (object.hit > 0) {
                  //if shape is hit, choose whether it's color is white or original color to create flashing effect
                  chooseflash = Math.floor(Math.random() * 3); //random number 0, 1 or 2
                }
                if (chooseflash == 0) {
                  ctx.fillStyle = "white";
                } else if (chooseflash == 1) {
                  ctx.fillStyle = "pink";
                } else {
                  ctx.fillStyle = botcolors[object.name].color;
                }
                ctx.strokeStyle = botcolors[object.name].outline;
                //draw body
                if (object.side==0) {
                  //draw circle
                  ctx.beginPath();
                  ctx.arc(0, 0, object.width / clientFovMultiplier, 0, 2 * Math.PI);
                  ctx.fill();
                  ctx.stroke();
                } else if (object.side>=0) {
                  if (object.hasOwnProperty('randomPointsArrayX')){
                    //draw for rock and boulder
                    //POLYGON WITH IRREGULAR SIDES
                    ctx.rotate(-object.angle); //rotate back so that rock wont rotate to face you
                    var rockSides = object.side;
                    ctx.beginPath();
                    ctx.moveTo((object.width / clientFovMultiplier) * Math.cos(0), (object.width / clientFovMultiplier) * Math.sin(0));
                    for (var i = 1; i <= rockSides; i++) {
                      var XRandom = object.randomPointsArrayX[i - 1] / clientFovMultiplier;
                      var YRandom = object.randomPointsArrayY[i - 1] / clientFovMultiplier;
                      ctx.lineTo(XRandom + (object.width / clientFovMultiplier) * Math.cos((i * 2 * Math.PI) / rockSides),
                        YRandom + (object.width / clientFovMultiplier) * Math.sin((i * 2 * Math.PI) / rockSides)
                      );
                    }
                    ctx.fill();
                    ctx.stroke();
                  }
                  else{//normal spawner
                    if (object.name=="Cluster"||object.name=="Pursuer"||object.name=="Champion"||object.name=="Infestor"||object.name=="Abyssling"){
                      //need to rotate 72/2 degrees so that pentagon not facing vertex towards player
                      ctx.rotate(Math.PI/object.side);//2 PI / sides / 2
                    }
                    ctx.beginPath();
                    ctx.moveTo((object.width / clientFovMultiplier), 0);
                    for (var i = 1; i <= object.side + 1; i += 1) {
                      ctx.lineTo(
                        (object.width / clientFovMultiplier) *
                            Math.cos((i * 2 * Math.PI) / object.side),
                        (object.width / clientFovMultiplier) *
                            Math.sin((i * 2 * Math.PI) / object.side)
                      );
                    }
                    ctx.fill();
                    ctx.stroke();
                    if (object.name=="Cluster"||object.name=="Pursuer"){
                      ctx.rotate(-Math.PI/object.side);//rotate back
                      //draw circle on top
                      ctx.fillStyle = bodyColors.barrel.col;//light grey
                      ctx.strokeStyle = bodyColors.barrel.outline;
                      ctx.beginPath();
                      ctx.arc(0, 0, object.width/2 / clientFovMultiplier, 0, 2 * Math.PI);
                      ctx.fill();
                      ctx.stroke();
                    }
                    else if (object.name=="Champion"){
                      ctx.rotate(-Math.PI/object.side);//rotate back
                      //draw circle on top
                      ctx.fillStyle = "grey";//darker grey
                      ctx.strokeStyle = "#5e5e5e";
                      ctx.beginPath();
                      ctx.arc(0, 0, object.width/2.5 / clientFovMultiplier, 0, 2 * Math.PI);
                      ctx.fill();
                      ctx.stroke();
                    }
                    else if (object.name=="Infestor"){
                      ctx.rotate(-Math.PI/object.side);//rotate back
                      //draw circle on top
                      ctx.fillStyle = bodyColors.barrel.col;//light grey
                      ctx.strokeStyle = bodyColors.barrel.outline;
                      ctx.beginPath();
                      ctx.arc(0, 0, object.width/5 / clientFovMultiplier, 0, 2 * Math.PI);
                      ctx.fill();
                      ctx.stroke();
                    }
                    else if (object.name=="Leech"){
                      //draw circle on top
                      ctx.fillStyle = bodyColors.barrel.col;//light grey
                      ctx.strokeStyle = bodyColors.barrel.outline;
                      ctx.beginPath();
                      ctx.arc(0, 0, object.width/2 / clientFovMultiplier, 0, 2 * Math.PI);
                      ctx.fill();
                      ctx.stroke();
                    }
                    else if (object.name=="Pillbox"){//pillbox's barrel is visually a turret
                      ctx.lineJoin = "round"; //make nice round corners
                      ctx.rotate(90 * Math.PI / 180);
                      Object.keys(object.barrels).forEach((barrel) => {
                        //note that you must use [barrel] instead of .barrel, if not there will be an error
                        let thisBarrel = object.barrels[barrel];
                        ctx.fillStyle = bodyColors.barrel.col;
                        ctx.strokeStyle = bodyColors.barrel.outline;
                        ctx.fillRect(
                          -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                            thisBarrel.x,
                          -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                            clientFovMultiplier,
                          thisBarrel.barrelWidth / clientFovMultiplier,
                          (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                            clientFovMultiplier
                        );
                        ctx.strokeRect(
                          -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                            thisBarrel.x,
                          -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                            clientFovMultiplier,
                          thisBarrel.barrelWidth / clientFovMultiplier,
                          (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                            clientFovMultiplier
                        );
                      });
                      ctx.rotate(-90 * Math.PI / 180);
                      //draw turret base
                      ctx.beginPath();
                      ctx.arc(
                        0,
                        0,
                        (object.width / clientFovMultiplier) * 0.6,
                        0,
                        2 * Math.PI
                      );
                      ctx.fill();
                      ctx.stroke();
                      ctx.lineJoin = "miter"; //change back
                    } else if (object.name=="Abyssling"){
                      //draw upper layer
                      let oldfill = ctx.fillStyle;
                      let oldstroke = ctx.strokeStyle;
                      ctx.fillStyle = "#5f676c";
                      ctx.strokeStyle = "#41494e";
                      ctx.beginPath();
                      ctx.moveTo((object.width*0.75 / clientFovMultiplier), 0);
                      for (var i = 1; i <= object.side + 1; i += 1) {
                        ctx.lineTo(
                          (object.width*0.75 / clientFovMultiplier) *
                              Math.cos((i * 2 * Math.PI) / object.side),
                          (object.width*0.75 / clientFovMultiplier) *
                              Math.sin((i * 2 * Math.PI) / object.side)
                        );
                      }
                      ctx.fill();
                      ctx.stroke();
                      ctx.fillStyle = oldfill;
                      ctx.strokeStyle = oldstroke;
                      ctx.beginPath();
                      ctx.moveTo((object.width*0.7 / clientFovMultiplier), 0);
                      for (var i = 1; i <= object.side + 1; i += 1) {
                        ctx.lineTo(
                          (object.width*0.7 / clientFovMultiplier) *
                              Math.cos((i * 2 * Math.PI) / object.side),
                          (object.width*0.7 / clientFovMultiplier) *
                              Math.sin((i * 2 * Math.PI) / object.side)
                        );
                      }
                      ctx.fill();
                      ctx.stroke();
                      ctx.rotate(-Math.PI/object.side);//rotate back
                      //draw turret on top (only visual)
                      ctx.fillStyle = bodyColors.barrel.col;//light grey
                      ctx.strokeStyle = bodyColors.barrel.outline;
                      let barrelwidth = 35;
                      let barrelheight = 100;
                      ctx.fillRect(
                        -barrelwidth / 2 / clientFovMultiplier,
                        -barrelheight / clientFovMultiplier,
                        barrelwidth / clientFovMultiplier,
                        barrelheight / clientFovMultiplier
                      );
                      ctx.strokeRect(
                        -barrelwidth / 2 / clientFovMultiplier,
                        -barrelheight / clientFovMultiplier,
                        barrelwidth / clientFovMultiplier,
                        barrelheight / clientFovMultiplier
                      );
                      ctx.beginPath();
                      ctx.arc(0, 0, object.width*0.45 / clientFovMultiplier, 0, 2 * Math.PI);
                      ctx.fill();
                      ctx.stroke();
                    }
                  }
                } else{//negative sides, draw a star! (cactus)
                  var numberOfSpikes = -object.side;
                  var outerRadius = object.width / clientFovMultiplier * 1.5;
                  var innerRadius = object.width / clientFovMultiplier;

                  var rot = (Math.PI / 2) * 3;//dont change this, or else will have strange extra lines
                  var x = 0;
                  var y = 0;
                  ctx.rotate(-object.angle); //rotate back so that rock wont rotate to face you
                  ctx.beginPath();
                  ctx.moveTo(0, 0 - outerRadius);
                  for (i = 0; i < numberOfSpikes; i++) {
                    x = 0 + Math.cos(rot) * outerRadius;
                    y = 0 + Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                    x = 0 + Math.cos(rot) * innerRadius;
                    y = 0 + Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                  }
                  ctx.lineTo(0, 0 - outerRadius);
                  ctx.closePath();
                  ctx.fill();
                  ctx.stroke();
                }
                ctx.restore();
                if (object.health < object.maxhealth) {
                  //draw health bar background
                  var w = (object.width * 2) / clientFovMultiplier;
                  var h = 7 / clientFovMultiplier;
                  var r = h / 2;
                  var x = drawingX - object.width / clientFovMultiplier;
                  var y = drawingY + object.width / clientFovMultiplier + 10;
                  ctx.fillStyle = "black";
                  ctx.strokeStyle = "black";
                  ctx.lineWidth = 2.5 / clientFovMultiplier;
                  ctx.beginPath();
                  ctx.moveTo(x + r, y);
                  ctx.arcTo(x + w, y, x + w, y + h, r);
                  ctx.arcTo(x + w, y + h, x, y + h, r);
                  ctx.arcTo(x, y + h, x, y, r);
                  ctx.arcTo(x, y, x + w, y, r);
                  ctx.closePath();
                  ctx.fill();
                  ctx.stroke();
                  //draw health bar
                  if (object.health > 0) {
                    w = (w / object.maxhealth) * object.health;
                    if (r * 2 > w) {
                      //prevent weird shape when radius more than width
                      r = w / 2;
                      y += (h - w) / 2; //move health bar so that it is centered vertically in black bar
                      h = w;
                    }
                    ctx.fillStyle = botcolors[object.name].color;
                    ctx.beginPath();
                    ctx.moveTo(x + r, y);
                    ctx.arcTo(x + w, y, x + w, y + h, r);
                    ctx.arcTo(x + w, y + h, x, y + h, r);
                    ctx.arcTo(x, y + h, x, y, r);
                    ctx.arcTo(x, y, x + w, y, r);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                  }
                }
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 5 / clientFovMultiplier;
                ctx.font = "700 " + 20 / clientFovMultiplier + "px Roboto";
                ctx.textAlign = "center";
                ctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
                //note: if you stroke then fill, the words will be thicker and nicer. If you fill then stroke, the words are thinner.
                if ((showStaticMobName == "yes"||botcolors[object.name].static=="no") && (showMinionMobName == "yes"||botcolors[object.name].minion=="no")){//settings for showing static and minion names
                  if (botcolors[object.name].specialty != "") {
                    var specialtyText = " (" + botcolors[object.name].specialty + ")";
                  } else {
                    var specialtyText = "";
                  }
                  ctx.strokeText(
                    object.name + specialtyText,
                    drawingX,
                    drawingY - object.width / clientFovMultiplier - 10
                  );
                  ctx.fillText(
                    object.name + specialtyText,
                    drawingX,
                    drawingY - object.width / clientFovMultiplier - 10
                  );
                }
                ctx.lineJoin = "miter"; //prevent spikes above the capital letter "M"
                if (object.hasOwnProperty("deadOpacity")) {
                  //if this is an animation of a dead object
                  ctx.globalAlpha = 1.0; //reset opacity
                }
                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(drawingX, drawingY, object.width/clientFovMultiplier, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              } else if (object.type == "shape") {
                
                renderShape(object,id,auraWidth,drawingX,drawingY);

              } else if (object.type == "spawner") {
                //spawner in sanctuary
                ctx.save();
                ctx.translate(drawingX, drawingY);
                ctx.rotate(object.angle);
                ctx.lineJoin = "round"; //make corners of shape round

                //actual body
                ctx.fillStyle = object.baseColor;
                ctx.strokeStyle = object.baseOutline;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (object.basewidth6 / clientFovMultiplier) * Math.cos(0),
                  0 + (object.basewidth6 / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= object.sides + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (object.basewidth6 / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / object.sides),
                    0 +
                      (object.basewidth6 / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / object.sides)
                  );
                }
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = object.color;
                ctx.strokeStyle = object.outline;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (object.width / clientFovMultiplier) * Math.cos(0),
                  0 + (object.width / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= object.sides + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (object.width / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / object.sides),
                    0 +
                      (object.width / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / object.sides)
                  );
                }
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = object.baseColor;
                ctx.strokeStyle = object.baseOutline;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (object.basewidth4 / clientFovMultiplier) * Math.cos(0),
                  0 + (object.basewidth4 / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= object.sides + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (object.basewidth4 / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / object.sides),
                    0 +
                      (object.basewidth4 / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / object.sides)
                  );
                }
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = object.color;
                ctx.strokeStyle = object.outline;
                ctx.lineWidth = 4 / clientFovMultiplier;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (object.basewidth5 / clientFovMultiplier) * Math.cos(0),
                  0 + (object.basewidth5 / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= object.sides + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (object.basewidth5 / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / object.sides),
                    0 +
                      (object.basewidth5 / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / object.sides)
                  );
                }
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = object.baseColor;
                ctx.strokeStyle = object.baseOutline;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (object.basewidth1 / clientFovMultiplier) * Math.cos(0),
                  0 + (object.basewidth1 / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= object.sides + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (object.basewidth1 / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / object.sides),
                    0 +
                      (object.basewidth1 / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / object.sides)
                  );
                }
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = object.barrelColor;
                ctx.strokeStyle = object.barrelOutline;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (object.basewidth2 / clientFovMultiplier) * Math.cos(0),
                  0 + (object.basewidth2 / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= object.sides + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (object.basewidth2 / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / object.sides),
                    0 +
                      (object.basewidth2 / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / object.sides)
                  );
                }
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = object.color;
                ctx.strokeStyle = object.outline;
                ctx.lineWidth = 4 / clientFovMultiplier;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (object.basewidth3 / clientFovMultiplier) * Math.cos(0),
                  0 + (object.basewidth3 / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= object.sides + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (object.basewidth3 / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / object.sides),
                    0 +
                      (object.basewidth3 / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / object.sides)
                  );
                }
                ctx.fill();
                ctx.stroke();
                //draw barrels
                ctx.fillStyle = object.barrelColor;
                ctx.strokeStyle = object.barrelOutline;
                //trapezoid at the tip
                var barrelwidth = 140;
                var barrelheight = 28;
                //rectangle
                var barrelwidth2 = 180;
                var barrelheight2 = 28;
                //base trapezoid
                var barrelwidth3 = 140;
                var barrelheight3 = 80;
                //note that trapezoids and rectangles are drawn differently

                var barrelDistanceFromCenter = (object.width * (Math.cos(Math.PI/object.sides)));//width of middle of polygon (less than width of circle)

                function drawSancBarrel(barNum){
                  var barAngle = 360/object.sides*(barNum+0.5);//half of a side, cuz barrel is in between sides
                  var barrelX = Math.cos((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter+ barrelheight+ barrelheight2+ barrelheight3);//object.width * 0.9
                  var barrelY = Math.sin((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter+ barrelheight+ barrelheight2+ barrelheight3);
                  var barrelX2 = Math.cos((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter + barrelheight2 + barrelheight3); //move rectangle barrel downwards
                  var barrelY2 = Math.sin((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter + barrelheight2 + barrelheight3);
                  var barrelX3 = Math.cos((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter + barrelheight3); //move base trapezoid barrel downwards
                  var barrelY3 = Math.sin((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter + barrelheight3);
                  //base trapezoid
                  ctx.save();
                  ctx.translate(
                    barrelX3 / clientFovMultiplier,
                    barrelY3 / clientFovMultiplier
                  );
                  ctx.rotate(((barAngle - 90) * Math.PI) / 180);
                  ctx.beginPath();
                  ctx.moveTo(
                    ((-barrelwidth3 / 3) * 2) / clientFovMultiplier,
                    -barrelheight3 / clientFovMultiplier
                  );
                  ctx.lineTo(-barrelwidth3 / clientFovMultiplier, 0);
                  ctx.lineTo(barrelwidth3 / clientFovMultiplier, 0);
                  ctx.lineTo(
                    ((barrelwidth3 / 3) * 2) / clientFovMultiplier,
                    -barrelheight3 / clientFovMultiplier
                  );
                  ctx.lineTo(
                    ((-barrelwidth3 / 3) * 2) / clientFovMultiplier,
                    -barrelheight3 / clientFovMultiplier
                  );
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();
                  //rectangle
                  ctx.save();
                  ctx.translate(
                    barrelX2 / clientFovMultiplier,
                    barrelY2 / clientFovMultiplier
                  );
                  ctx.rotate(((barAngle - 90) * Math.PI) / 180);
                  ctx.fillRect(
                    -barrelwidth2 / 2 / clientFovMultiplier,
                    -barrelheight2 / clientFovMultiplier,
                    barrelwidth2 / clientFovMultiplier,
                    barrelheight2 / clientFovMultiplier
                  );
                  ctx.strokeRect(
                    -barrelwidth2 / 2 / clientFovMultiplier,
                    -barrelheight2 / clientFovMultiplier,
                    barrelwidth2 / clientFovMultiplier,
                    barrelheight2 / clientFovMultiplier
                  );
                  ctx.restore();
                  //trapezium at the tip
                  ctx.save();
                  ctx.translate(
                    barrelX / clientFovMultiplier,
                    barrelY / clientFovMultiplier
                  );
                  ctx.rotate(((barAngle - 90) * Math.PI) / 180);
                  ctx.beginPath();
                  ctx.moveTo(-barrelwidth / 2 / clientFovMultiplier, 0);
                  ctx.lineTo(
                    -barrelwidth / clientFovMultiplier,
                    -barrelheight / clientFovMultiplier
                  );
                  ctx.lineTo(
                    barrelwidth / clientFovMultiplier,
                    -barrelheight / clientFovMultiplier
                  );
                  ctx.lineTo(barrelwidth / 2 / clientFovMultiplier, 0);
                  ctx.lineTo(-barrelwidth / 2 / clientFovMultiplier, 0);
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();
                }

                for (let i = 0; i < object.sides; i++) {
                  drawSancBarrel(i);
                }
                //draw aura
                ctx.fillStyle = object.auraColor;
                ctx.lineWidth = 4 / clientFovMultiplier;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (object.auraWidth / clientFovMultiplier) * Math.cos(0),
                  0 + (object.auraWidth / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= object.sides + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (object.auraWidth / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / object.sides),
                    0 +
                      (object.auraWidth / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / object.sides)
                  );
                }
                ctx.fill();
                ctx.lineJoin = "miter"; //change back
                ctx.restore();
                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(drawingX, drawingY, object.width/clientFovMultiplier, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              } else if (object.type == "player") {
                var spawnProtectionFlashDuration = 3; //higher number indicates longer duration between flashes.
                if (object.hasOwnProperty("deadOpacity")) {
                  //if this is an animation of a dead object
                  ctx.globalAlpha = object.deadOpacity;
                }
                //draw players
                ctx.save(); //save so later can restore
                //translate canvas to location of player so that the player is at 0,0 coordinates, allowing rotation around the center of player's body
                ctx.translate(drawingX, drawingY);

                let objectangle = object.angle;
                if (
                  id == playerstring &&
                  object.autorotate != "yes" &&
                  object.fastautorotate != "yes"
                ) {
                  //if this player is the tank that the client is controlling
                  objectangle = clientAngle;
                  ctx.rotate(clientAngle); //instead of using client's actual tank angle, use the angle to the mouse. this reduces lag effect
                } else {
                  ctx.rotate(object.angle);
                }

                let spawnProtect = "no";
                if (object.spawnProtection < object.spawnProtectionDuration && object.spawnProtection % spawnProtectionFlashDuration == 0) {
                  spawnProtect = "yes";
                }

                let playercolor = "undefined";
                let playeroutline = "undefined";
                let eternal = "no";
                if (object.team == "none") {
                  if (id == playerstring) {
                    playercolor = bodyColors.blue.col;
                    playeroutline = bodyColors.blue.outline;
                  }
                  else{
                    playercolor = bodyColors.red.col;
                    playeroutline = bodyColors.red.outline;
                  }
                } else if (bodyColors.hasOwnProperty(object.team)) {
                    playercolor = bodyColors[object.team].col;
                    playeroutline = bodyColors[object.team].outline;
                    if (object.team == "eternal"){
                      eternal = "yes";
                    }
                }
                if (spawnProtect == "yes"){//make body color lighter
                  playercolor = pSBC ( spawnprotectionShade, playercolor );
                  playeroutline = pSBC ( spawnprotectionShade, playeroutline );
                }
                if (object.hit > 0){//if bro got hit
                  if (!playerHit.hasOwnProperty(id)){
                    playerHit[id] = 0;
                  }
                  maxshade = 0.1;//player change color less
                  playerHit[id] += (maxshade/25);//make shape whiter
                  if (playerHit[id] > maxshade){
                    playerHit[id] = maxshade;
                  }
                  playercolor = pSBC ( playerHit[id], playercolor );
                  playeroutline = pSBC ( playerHit[id], playeroutline );
                }
                else if (playerHit[id] > 0){
                  playerHit[id] -= (maxshade/25);//make shape whiter
                  if (playerHit[id] < 0.00001){
                    playerHit[id] = 0;
                  }
                  playercolor = pSBC ( playerHit[id], playercolor );
                  playeroutline = pSBC ( playerHit[id], playeroutline );
                }
                if (object.developer == "yes") {
                  //if a developer
                  playercolor = object.color;
                  playeroutline = object.outline;
                }
                
                //store player color for upgrade buttons
                if (id == playerstring){
                  playerBodyCol = playercolor;
                  playerBodyOutline = playeroutline;
                }

                drawPlayer(ctx, object, clientFovMultiplier, spawnProtect, playercolor, playeroutline, eternal, objectangle, id)//draw barrel and body
                ctx.restore(); //restore coordinates to saved

                //write player name if not the client's tank

                //draw player health
                if (object.health < object.maxhealth) {
                  //draw health bar background
                  var w = (object.width / clientFovMultiplier) * 2;
                  var h = 7 / clientFovMultiplier;
                  var r = h / 2;
                  var x = drawingX - object.width / clientFovMultiplier;
                  var y = drawingY + object.width / clientFovMultiplier + 10;
                  ctx.fillStyle = "black";
                  ctx.strokeStyle = "black";
                  ctx.lineWidth = 2.5 / clientFovMultiplier;
                  ctx.beginPath();
                  ctx.moveTo(x + r, y);
                  ctx.arcTo(x + w, y, x + w, y + h, r);
                  ctx.arcTo(x + w, y + h, x, y + h, r);
                  ctx.arcTo(x, y + h, x, y, r);
                  ctx.arcTo(x, y, x + w, y, r);
                  ctx.closePath();
                  ctx.fill();
                  ctx.stroke();
                  //draw health bar
                  if (object.health > 0) {
                    w = (w / object.maxhealth) * object.health;
                    //if (id == playerstring) {
                      //if this player is the tank that the client is controlling
                      if (object.team == "none") {
                        if (id == playerstring) {
                          ctx.fillStyle = bodyColors.blue.col;
                        }
                        else{
                          ctx.fillStyle = bodyColors.red.col;
                        }
                      } else if (bodyColors.hasOwnProperty(object.team)) {
                        ctx.fillStyle = bodyColors[object.team].col;
                      }
                    if (r * 2 > w) {
                      //prevent weird shape when radius more than width
                      r = w / 2;
                      y += (h - w) / 2; //move health bar so that it is centered vertically in black bar
                      h = w;
                    }
                    ctx.beginPath();
                    ctx.moveTo(x + r, y);
                    ctx.arcTo(x + w, y, x + w, y + h, r);
                    ctx.arcTo(x + w, y + h, x, y + h, r);
                    ctx.arcTo(x, y + h, x, y, r);
                    ctx.arcTo(x, y, x + w, y, r);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                  }
                }

                if (object.hasOwnProperty("deadOpacity")) {
                  //if this is an animation of a dead object
                  ctx.globalAlpha = 1.0; //reset opacity
                }
                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(drawingX, drawingY, object.width/clientFovMultiplier, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              } else if (object.type == "portal") {
                //draw the aura below the portal
                var auraSpeed = 75; //higher number means slower speed
                var auraWidth = 4; //reative to portal size
                var portalAuraSize = object.timer % auraSpeed;
                var portalwidth = portalwidths[id]; //use this for portal width. it keeps track size changes when players touch portal
                var portalsizeincrease = portalwidths[id] / object.width; //increase in width when someone touch it (needed for the spikes)
                //first aura
                var opacityCalculation =
                  1 - ((auraWidth / auraSpeed) * portalAuraSize) / auraWidth; //goes from 0 to 0.3
                if (opacityCalculation > 0.3) {
                  //max opacity for portal aura
                  opacityCalculation = 0.3;
                }
                if (object.hasOwnProperty("red")) {
                  //if portal is radiant
                  ctx.fillStyle =
                    "rgba(" +
                    object.red +
                    ", " +
                    object.green +
                    ", " +
                    object.blue +
                    "," +
                    opacityCalculation +
                    ")";
                } else {
                  ctx.fillStyle =
                    "rgba(" + object.color + "," + opacityCalculation + ")";
                }
                if ((portalwidth * ((auraWidth / auraSpeed) * portalAuraSize)) /
                    clientFovMultiplier > 0){
                  ctx.beginPath();
                  ctx.arc(
                    drawingX,
                    drawingY,
                    (portalwidth * ((auraWidth / auraSpeed) * portalAuraSize)) /
                      clientFovMultiplier,
                    0,
                    2 * Math.PI
                  );
                  ctx.fill();
                }
                //second smaller aura
                portalAuraSize = (object.timer - auraSpeed / 2) % auraSpeed;
                if (portalAuraSize > 0) {
                  var opacityCalculation =
                    1 - ((auraWidth / auraSpeed) * portalAuraSize) / auraWidth;
                  if (opacityCalculation > 0.3) {
                    //max opacity for portal aura
                    opacityCalculation = 0.3;
                  }
                  if (object.hasOwnProperty("red")) {
                    //if portal is radiant
                    ctx.fillStyle =
                      "rgba(" +
                      object.red +
                      ", " +
                      object.green +
                      ", " +
                      object.blue +
                      "," +
                      opacityCalculation +
                      ")";
                  } else {
                    ctx.fillStyle =
                      "rgba(" + object.color + "," + opacityCalculation + ")";
                  }
                  ctx.beginPath();
                  ctx.arc(
                    drawingX,
                    drawingY,
                    (portalwidth * ((auraWidth / auraSpeed) * portalAuraSize)) /
                      clientFovMultiplier,
                    0,
                    2 * Math.PI
                  );
                  ctx.fill();
                }

                if (object.hasOwnProperty("deadOpacity")) {
                  //if this is an animation of a dead object
                  ctx.globalAlpha = object.deadOpacity;
                }
                //drawing portals
                //create gradient
                //const gradient = ctx.createRadialGradient(drawingX, drawingY, object.width/3/clientFovMultiplier, drawingX, drawingY, object.width/clientFovMultiplier);

                // Add two color stops
                //caluclate color of outline of portal based on time until it die
                var portalColorCalc = object.timer / object.maxtimer;
                var portalColor = 255 - portalColorCalc * 255;
                var portalRGB =
                  "rgb(" +
                  portalColor +
                  "," +
                  portalColor +
                  "," +
                  portalColor +
                  ")";
                var portalRGBoutline =
                  "rgb(" +
                  (portalColor - 20) +
                  "," +
                  (portalColor - 20) +
                  "," +
                  (portalColor - 20) +
                  ")";
                if (object.ruptured == 1) {
                  //portal is ruptured!
                  //draw the stars
                  ctx.save(); //save so later can restore
                  ctx.translate(drawingX, drawingY);
                  ctx.fillStyle = "white";
                  ctx.strokeStyle = "lightgrey";
                  ctx.lineWidth = 3 / clientFovMultiplier;
                  ctx.lineJoin = "round";
                  //first star: 3 spikes
                  ctx.rotate((extraSpikeRotate * Math.PI) / 180);
                  var numberOfSpikes = 3;
                  var outerRadius =
                    ((object.width * 3) / clientFovMultiplier) * portalsizeincrease;
                  var innerRadius =
                    (object.width / 3 / clientFovMultiplier) * portalsizeincrease;
                  var rot = (Math.PI / 2) * 3;
                  var x = 0;
                  var y = 0;
                  ctx.beginPath();
                  ctx.moveTo(0, 0 - outerRadius);
                  for (i = 0; i < numberOfSpikes; i++) {
                    x = 0 + Math.cos(rot) * outerRadius;
                    y = 0 + Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                    x = 0 + Math.cos(rot) * innerRadius;
                    y = 0 + Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                  }
                  ctx.lineTo(0, 0 - outerRadius);
                  ctx.closePath();
                  ctx.fill();
                  ctx.stroke();
                  ctx.rotate((-extraSpikeRotate * Math.PI) / 180);
                  //second star: 6 spikes in opposite direction
                  ctx.rotate(((360 - extraSpikeRotate) * 2 * Math.PI) / 180);
                  var numberOfSpikes = 6;
                  var outerRadius =
                    ((object.width * 1.5) / clientFovMultiplier) *
                    portalsizeincrease;
                  var innerRadius =
                    (object.width / 1.2 / clientFovMultiplier) * portalsizeincrease;
                  var rot = (Math.PI / 2) * 3;
                  var x = 0;
                  var y = 0;
                  ctx.beginPath();
                  ctx.moveTo(0, 0 - outerRadius);
                  for (i = 0; i < numberOfSpikes; i++) {
                    x = 0 + Math.cos(rot) * outerRadius;
                    y = 0 + Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                    x = 0 + Math.cos(rot) * innerRadius;
                    y = 0 + Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                  }
                  ctx.lineTo(0, 0 - outerRadius);
                  ctx.closePath();
                  ctx.fill();
                  ctx.stroke();
                  ctx.rotate((-(360 - extraSpikeRotate) * 2 * Math.PI) / 180);
                  //third star: 6 spikes
                  ctx.rotate((extraSpikeRotate * 2 * Math.PI) / 180);
                  var numberOfSpikes = 6;
                  var outerRadius =
                    ((object.width * 1.5) / clientFovMultiplier) *
                    portalsizeincrease;
                  var innerRadius =
                    (object.width / 1.2 / clientFovMultiplier) * portalsizeincrease;
                  var rot = (Math.PI / 2) * 3;
                  var x = 0;
                  var y = 0;
                  ctx.beginPath();
                  ctx.moveTo(0, 0 - outerRadius);
                  for (i = 0; i < numberOfSpikes; i++) {
                    x = 0 + Math.cos(rot) * outerRadius;
                    y = 0 + Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                    x = 0 + Math.cos(rot) * innerRadius;
                    y = 0 + Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                  }
                  ctx.lineTo(0, 0 - outerRadius);
                  ctx.closePath();
                  ctx.fill();
                  ctx.stroke();
                  ctx.rotate((-extraSpikeRotate * 2 * Math.PI) / 180);
                  //fourth star: 6 dark spikes in opposite direction
                  ctx.fillStyle = portalRGB;
                  ctx.strokeStyle = portalRGBoutline;
                  ctx.rotate(((360 - extraSpikeRotate) * 3 * Math.PI) / 180); //times 2 to make it faster
                  var numberOfSpikes = 6;
                  var outerRadius =
                    ((object.width * 1.5) / clientFovMultiplier) *
                    portalsizeincrease;
                  var innerRadius =
                    (object.width / 2 / clientFovMultiplier) * portalsizeincrease;
                  var rot = (Math.PI / 2) * 3;
                  var x = 0;
                  var y = 0;
                  ctx.beginPath();
                  ctx.moveTo(0, 0 - outerRadius);
                  for (i = 0; i < numberOfSpikes; i++) {
                    x = 0 + Math.cos(rot) * outerRadius;
                    y = 0 + Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                    x = 0 + Math.cos(rot) * innerRadius;
                    y = 0 + Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                  }
                  ctx.lineTo(0, 0 - outerRadius);
                  ctx.closePath();
                  ctx.fill();
                  ctx.stroke();
                  ctx.rotate((-(360 - extraSpikeRotate) * 3 * Math.PI) / 180);
                  //fifth star: tiny black spikes
                  ctx.rotate((extraSpikeRotate * 3 * Math.PI) / 180); //times 2 to make it faster
                  var numberOfSpikes = 6;
                  var outerRadius =
                    ((object.width * 1.25) / clientFovMultiplier) *
                    portalsizeincrease;
                  var innerRadius =
                    (object.width / 4 / clientFovMultiplier) * portalsizeincrease;
                  var rot = (Math.PI / 2) * 3;
                  var x = 0;
                  var y = 0;
                  ctx.beginPath();
                  ctx.moveTo(0, 0 - outerRadius);
                  for (i = 0; i < numberOfSpikes; i++) {
                    x = 0 + Math.cos(rot) * outerRadius;
                    y = 0 + Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                    x = 0 + Math.cos(rot) * innerRadius;
                    y = 0 + Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += Math.PI / numberOfSpikes;
                  }
                  ctx.lineTo(0, 0 - outerRadius);
                  ctx.closePath();
                  ctx.fill();
                  ctx.stroke();
                  ctx.rotate((-extraSpikeRotate * 3 * Math.PI) / 180);
                  ctx.restore();
                  ctx.lineJoin = "miter";
                }
                ctx.fillStyle = portalRGB;
                ctx.strokeStyle = portalRGBoutline;
                ctx.lineWidth = 3 / clientFovMultiplier;
                ctx.beginPath();
                ctx.arc(
                  drawingX,
                  drawingY,
                  portalwidth / clientFovMultiplier,
                  0,
                  2 * Math.PI
                );
                ctx.fill();
                ctx.stroke();
                if (object.hasOwnProperty("deadOpacity")) {
                  //if this is an animation of a dead object
                  ctx.globalAlpha = 1.0; //reset opacity
                }

                //spawn particles
                var choosing = Math.floor(Math.random() * 3); //choose if particle spawn. Lower number means more particles
                if (choosing == 1) {
                  var angleDegrees = Math.floor(Math.random() * 360); //choose angle in degrees
                  var angleRadians = (angleDegrees * Math.PI) / 180; //convert to radians
                  portalparticles[particleID] = {
                    angle: angleRadians,
                    x: object.x,
                    y: object.y,
                    width: 50,
                    height: 50,
                    speed: 10,
                    timer: 30,
                    maxtimer: 15, //difference between timer and maxtimer is the opacity change of the particle. Larger difference means more or less transparent
                    color: "white",
                    outline: "lightgrey",
                    type: "particle",
                  };
                  particleID++;
                }

                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(drawingX, drawingY, object.width/clientFovMultiplier, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              } else if (object.type == "Fixedportal") {
                //drawing rectangular fixed portals, e.g. the portal at top left corner of dune
                ctx.save(); //save so later can restore
                ctx.translate(drawingX, drawingY); //translate so white portal is at 0,0 coordinates so can rotate around center of portal
                ctx.rotate((object.angleDegrees * Math.PI) / 180); //rotate portal
                ctx.fillStyle = object.color;
                ctx.strokeStyle = object.outline;
                ctx.fillRect(
                  -object.width / 2 / clientFovMultiplier,
                  -object.height / 2 / clientFovMultiplier,
                  object.width / clientFovMultiplier,
                  object.height / clientFovMultiplier
                );
                ctx.strokeRect(
                  -object.width / 2 / clientFovMultiplier,
                  -object.height / 2 / clientFovMultiplier,
                  object.width / clientFovMultiplier,
                  object.height / clientFovMultiplier
                );
                ctx.globalAlpha = 0.7; //transparency
                ctx.fillStyle = object.color2;
                ctx.fillRect(
                  -object.width / clientFovMultiplier,
                  -object.height / clientFovMultiplier,
                  (object.width * 2) / clientFovMultiplier,
                  (object.height * 2) / clientFovMultiplier
                );
                ctx.strokeRect(
                  -object.width / clientFovMultiplier,
                  -object.height / clientFovMultiplier,
                  (object.width * 2) / clientFovMultiplier,
                  (object.height * 2) / clientFovMultiplier
                );
                ctx.globalAlpha = 1.0; //reset transparency
                ctx.restore(); //restore after translating
                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(drawingX, drawingY, object.width/2/clientFovMultiplier, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              } else if (object.type == "particle") {
                //draw particles
                if (object.timer <= 10){
                  ctx.globalAlpha = object.timer / 10;
                }
                else if (object.timer >= object.maxtimer-10 && (object.source == "dune" || object.source == "crossroads")) {
                  ctx.globalAlpha = ((((object.timer - object.maxtimer) + 10) - 10) * -1) / 10;
                }
                //ctx.globalAlpha = object.timer / object.maxtimer;
                ctx.fillStyle = object.color;
                ctx.strokeStyle = object.outline;

                ctx.lineWidth = 3 / clientFovMultiplier;
                ctx.beginPath();
                ctx.arc(
                  drawingX,
                  drawingY,
                  object.width / clientFovMultiplier,
                  0,
                  2 * Math.PI
                );
                ctx.fill();
                ctx.stroke();
                ctx.globalAlpha = 1.0;
              } else if (object.type == "wall") {
                //ctx.fillStyle = "#232323";
                ctx.fillStyle = "rgba(15, 15, 15, .5)";//crossroads wall color
                if (gamemode == "sanctuary"){
                  ctx.fillStyle = "rgba(40,40,40, .5)";//sanctuary wall color
                }
                else if (gamemode == "cavern"){
                  ctx.fillStyle = "black";//cavern wall color
                }
                ctx.fillRect(
                  drawingX,
                  drawingY,
                  object.w / clientFovMultiplier,
                  object.h / clientFovMultiplier
                );
                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "#00ff00";//green hitbox for walls
                  ctx.lineWidth = 1.5;
                  ctx.strokeRect(
                    drawingX,
                    drawingY,
                    object.w / clientFovMultiplier,
                    object.h / clientFovMultiplier
                  );
                }
              } else if (object.type == "gate") {
                if (gamemode == "cavern"){//cavern
                  ctx.save();
                  ctx.translate(drawingX, drawingY);
                  ctx.rotate(object.angle/180*Math.PI);
                  //draw white rectangle below
                  ctx.fillStyle = "rgba(255,255,255,.7)";
                  ctx.strokeStyle = "white";
                  //FIRST WHITE RECTANGLE
                  ctx.globalAlpha = 1.0 * (endGate - gateTimer) / (endGate - 1 - startGate);//gateTimer increases from 0.5 to 9, this equation makes the opacity decrease from 1 to 0
                  ctx.fillRect(
                    -(object.height / clientFovMultiplier * gateTimer)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer,
                    object.width / clientFovMultiplier
                  );
                  ctx.strokeRect(
                    -(object.height / clientFovMultiplier * gateTimer)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer,
                    object.width / clientFovMultiplier
                  );
                  ctx.globalAlpha = 1.0;
                  //SECOND WHITE RECTANGLE
                  let gateTimer2 = gateTimer - endGate/2;
                  if (gateTimer2 < startGate){
                    gateTimer2 = endGate - (startGate - gateTimer2)
                  }
                  ctx.globalAlpha = 1.0 * (endGate - gateTimer2) / (endGate - 1 - startGate);//gateTimer increases from 1 to 7, this equation makes the opacity decrease from 1 to 0
                  ctx.fillRect(
                    -(object.height / clientFovMultiplier * gateTimer2)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer2,
                    object.width / clientFovMultiplier
                  );
                  ctx.strokeRect(
                    -(object.height / clientFovMultiplier * gateTimer2)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer2,
                    object.width / clientFovMultiplier
                  );
                  //draw arrows
                  for (var i = 0; i < gatearrow.length; i++) {
                    let y = ((object.height / clientFovMultiplier * 9)/2 + object.height / clientFovMultiplier/2)/45*(gatearrow[i]-45);
                    let arrowwidth = 25/clientFovMultiplier;//half of entire width
                    let arrowheight = 25/clientFovMultiplier;
                    //draw 3 arrows in a row
                    if (gatearrow[i] < 20){
                      ctx.globalAlpha = gatearrow[i]/20;
                    }
                    else if (gatearrow[i] > 70){
                      ctx.globalAlpha = (90-gatearrow[i])/20;
                    }
                    else{
                      ctx.globalAlpha = 1;
                    }
                    ctx.lineWidth = 3/clientFovMultiplier;
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.moveTo(y-arrowheight, 0-arrowwidth);
                    ctx.lineTo(y, 0);
                    ctx.lineTo(y-arrowheight, 0+arrowwidth);
                    ctx.moveTo(y-arrowheight, object.width/clientFovMultiplier/3-arrowwidth);
                    ctx.lineTo(y, object.width/clientFovMultiplier/3);
                    ctx.lineTo(y-arrowheight, object.width/clientFovMultiplier/3+arrowwidth);
                    ctx.moveTo(y-arrowheight, -object.width/clientFovMultiplier/3-arrowwidth);
                    ctx.lineTo(y, -object.width/clientFovMultiplier/3);
                    ctx.lineTo(y-arrowheight, -object.width/clientFovMultiplier/3+arrowwidth);
                    ctx.stroke();
                    //move arrow
                    gatearrow[i]+=0.1;
                    if (gatearrow[i]>45 && gatearrow[i]<65){//move faster when arrow in the middle
                      gatearrow[i]+=0.4;
                    }
                    else if (gatearrow[i]>90){
                      gatearrow[i] = 0;
                    }
                  }
                  ctx.globalAlpha = 1.0;
                  //draw actual black gate
                  ctx.fillStyle = "black";
                  ctx.fillRect(0,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier,
                    object.width / clientFovMultiplier
                  );
                }
                else if (gamemode != "sanctuary"){//cross (default)
                  ctx.save();
                  ctx.translate(drawingX, drawingY);
                  ctx.rotate(object.angle/180*Math.PI);
                  //draw white rectangle below
                  ctx.fillStyle = "rgba(255,255,255,.7)";
                  ctx.strokeStyle = "white";
                  //FIRST WHITE RECTANGLE
                  ctx.globalAlpha = 1.0 * (endGate - gateTimer) / (endGate - 1 - startGate);//gateTimer increases from 0.5 to 9, this equation makes the opacity decrease from 1 to 0
                  ctx.fillRect(
                    -(object.height / clientFovMultiplier * gateTimer)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer,
                    object.width / clientFovMultiplier
                  );
                  ctx.strokeRect(
                    -(object.height / clientFovMultiplier * gateTimer)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer,
                    object.width / clientFovMultiplier
                  );
                  ctx.globalAlpha = 1.0;
                  //SECOND WHITE RECTANGLE
                  let gateTimer2 = gateTimer - endGate/2;
                  if (gateTimer2 < startGate){
                    gateTimer2 = endGate - (startGate - gateTimer2)
                  }
                  ctx.globalAlpha = 1.0 * (endGate - gateTimer2) / (endGate - 1 - startGate);//gateTimer increases from 1 to 7, this equation makes the opacity decrease from 1 to 0
                  ctx.fillRect(
                    -(object.height / clientFovMultiplier * gateTimer2)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer2,
                    object.width / clientFovMultiplier
                  );
                  ctx.strokeRect(
                    -(object.height / clientFovMultiplier * gateTimer2)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer2,
                    object.width / clientFovMultiplier
                  );
                  ctx.globalAlpha = 1.0;
                  //draw actual black gate
                  ctx.fillStyle = "black";
                  ctx.fillRect(0,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier,
                    object.width / clientFovMultiplier
                  );
                }
                else{//sanc
                  ctx.save();
                  ctx.translate(drawingX, drawingY);
                  ctx.rotate(object.angle/180*Math.PI);
                  //draw white rectangle below
                  ctx.fillStyle = "rgba(0,0,0,.2)";
                  ctx.strokeStyle = "rgba(0,0,0,.5)";
                  //FIRST WHITE RECTANGLE
                  ctx.globalAlpha = 1.0 * (endGate - gateTimer) / (endGate - 1 - startGate);//gateTimer increases from 0.5 to 9, this equation makes the opacity decrease from 1 to 0
                  ctx.fillRect(
                    -(object.height / clientFovMultiplier * gateTimer)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer,
                    object.width / clientFovMultiplier
                  );
                  ctx.strokeRect(
                    -(object.height / clientFovMultiplier * gateTimer)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer,
                    object.width / clientFovMultiplier
                  );
                  ctx.globalAlpha = 1.0;
                  //SECOND WHITE RECTANGLE
                  let gateTimer2 = gateTimer - endGate/2;
                  if (gateTimer2 < startGate){
                    gateTimer2 = endGate - (startGate - gateTimer2)
                  }
                  ctx.globalAlpha = 1.0 * (endGate - gateTimer2) / (endGate - 1 - startGate);//gateTimer increases from 1 to 7, this equation makes the opacity decrease from 1 to 0
                  ctx.fillRect(
                    -(object.height / clientFovMultiplier * gateTimer2)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer2,
                    object.width / clientFovMultiplier
                  );
                  ctx.strokeRect(
                    -(object.height / clientFovMultiplier * gateTimer2)/2 + object.height / clientFovMultiplier/2,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier * gateTimer2,
                    object.width / clientFovMultiplier
                  );
                  ctx.globalAlpha = 1.0;
                  //draw actual black gate
                  ctx.fillStyle = "black";
                  ctx.fillRect(0,
                    -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier,
                    object.width / clientFovMultiplier
                  );
                  let numberOfSpikes = 6;
                  let outerRadius = object.width / clientFovMultiplier /8;
                  let innerRadius = object.width / clientFovMultiplier /25;
                  let rot = (Math.PI / 2) * 3;
                  let x = 0;
                  let y = 0;
                  for (let star = 0; star < 4; star++) {
                    x = 0;
                    y = 0;

                    ctx.translate(object.height / clientFovMultiplier, object.width / clientFovMultiplier / 5 * (star-1.5))
                    ctx.rotate(Math.PI * (endGate - gateTimer) / (endGate - 1 - startGate) /204 *360)
                    ctx.beginPath();
                    ctx.moveTo(0, 0 - outerRadius);
                    for (i = 0; i < numberOfSpikes; i++) {
                      x = 0 + Math.cos(rot) * outerRadius;
                      y = 0 + Math.sin(rot) * outerRadius;
                      ctx.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                      x = 0 + Math.cos(rot) * innerRadius;
                      y = 0 + Math.sin(rot) * innerRadius;
                      ctx.lineTo(x, y);
                      rot += Math.PI / numberOfSpikes;
                    }
                    ctx.lineTo(0,0 - outerRadius);
                    ctx.closePath();
                    ctx.fill();
                    ctx.rotate(-Math.PI * (endGate - gateTimer) / (endGate - 1 - startGate) /204 *360)
                    ctx.translate(-object.height / clientFovMultiplier, -object.width / clientFovMultiplier / 5 * (star-1.5))
                  }
                }
                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.strokeRect(0,
                  -object.width/2/clientFovMultiplier,
                    object.height / clientFovMultiplier,
                    object.width / clientFovMultiplier
                  );
                }
                ctx.restore();
                //spawn particles
                if (gamemode != "sanctuary" && gamemode != "cavern"){
                  var choosing = Math.floor(Math.random() * 3); //choose if particle spawn. Lower number means more particles
                  if (choosing == 1) {
                      var dir = Math.floor(Math.random() * 2); //choose angle in degrees
                      if (dir == 0){
                        var angleRadians = (object.angle) * Math.PI / 180; //convert to radians
                      }
                      else{
                        var angleRadians = (object.angle - 180) * Math.PI / 180;
                      }
                      let randX = 0;
                      let randY = 0;
                      //code currently does not support particles for gates that are tilted
                      //i dont see a need to add that in the near future
                      if (object.angle == 0 || object.angle == 180 || object.angle == 360){
                        randY = Math.floor(Math.random() * object.width) - object.width/2;
                      }
                      else if (object.angle == 90 || object.angle == 270){
                        randX = Math.floor(Math.random() * object.width) - object.width/2;
                      }
                      portalparticles[particleID] = {
                        angle: angleRadians,
                        x: object.x + randX,
                        y: object.y + randY,
                        width: 50,
                        height: 50,
                        speed: 10,
                        timer: 30,
                        maxtimer: 15, //difference between timer and maxtimer is the opacity change of the particle. Larger difference means more or less transparent
                        color: "white",
                        outline: "lightgrey",
                        type: "particle",
                      };
                      particleID++;
                  }
                }
                else if (gamemode != "cavern"){
                  var choosing = Math.floor(Math.random() * 7); //choose if particle spawn. Lower number means more particles
                  if (choosing == 1) {
                    var dir = Math.floor(Math.random() * 2); //choose angle in degrees
                    if (dir == 0){
                      var angleRadians = (object.angle) * Math.PI / 180; //convert to radians
                    }
                    else{
                      var angleRadians = (object.angle - 180) * Math.PI / 180;
                    }
                    let randX = 0;
                    let randY = 0;
                    //code currently does not support particles for gates that are tilted
                    //i dont see a need to add that in the near future
                    if (object.angle == 0 || object.angle == 180 || object.angle == 360){
                      randY = Math.floor(Math.random() * object.width) - object.width/2;
                    }
                    else if (object.angle == 90 || object.angle == 270){
                      randX = Math.floor(Math.random() * object.width) - object.width/2;
                    }
                    portalparticles[particleID] = {
                      angle: angleRadians,
                      x: object.x + randX,
                      y: object.y + randY,
                      width: 15,
                      height: 15,
                      speed: 5,
                      timer: 20,
                      maxtimer: 20, //difference between timer and maxtimer is the opacity change of the particle. Larger difference means more or less transparent
                      color: "black",
                      outline: "black",
                      type: "particle",
                    };
                    particleID++;
                  }
                }
              } else if (object.type == "def") {
                //base defender in 2tdm
                ctx.save();
                ctx.translate(drawingX, drawingY);
                ctx.rotate(object.angle);
                ctx.lineJoin = "round"; //make corners of shape round
                ctx.lineWidth = 4 / clientFovMultiplier;

                //draw octagon base
                var octagonWidth = object.width/5*6;
                ctx.fillStyle = bodyColors.asset.col;
                ctx.strokeStyle = bodyColors.asset.outline;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (octagonWidth / clientFovMultiplier) * Math.cos(0),
                  0 + (octagonWidth / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= 8 + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (octagonWidth / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / 8),
                    0 +
                      (octagonWidth / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / 8)
                  );
                }
                ctx.fill();
                ctx.stroke();


                //draw barrels
                ctx.fillStyle = bodyColors.barrel.col;
                ctx.strokeStyle = bodyColors.barrel.outline;
                //trapezoid at the tip
                var barrelwidth = 70;
                var barrelheight = 20;
                //rectangle
                var barrelwidth2 = 90;
                var barrelheight2 = 20;
                //base trapezoid
                var barrelwidth3 = 70;
                var barrelheight3 = 60;
                //note that trapezoids and rectangles are drawn differently

                for (let i = 0; i < 4; i++) {//draw 4 barrels
                  var barrelAngle = 360/4*i;
                  var barrelX = Math.cos((barrelAngle * Math.PI) / 180) * object.width * 1.4;
                  var barrelY = Math.sin((barrelAngle * Math.PI) / 180) * object.width * 1.4;
                  var barrelX2 =
                    Math.cos((barrelAngle * Math.PI) / 180) *
                    (object.width * 1.4 - barrelheight); //move rectangle barrel downwards
                  var barrelY2 =
                    Math.sin((barrelAngle * Math.PI) / 180) *
                    (object.width * 1.4 - barrelheight);
                  var barrelX3 =
                    Math.cos((barrelAngle * Math.PI) / 180) *
                    (object.width * 1.4 - barrelheight - barrelheight2); //move base trapezoid barrel downwards
                  var barrelY3 =
                    Math.sin((barrelAngle * Math.PI) / 180) *
                    (object.width * 1.4 - barrelheight - barrelheight2);
                  //base trapezoid
                  ctx.save();
                  ctx.translate(
                    barrelX3 / clientFovMultiplier,
                    barrelY3 / clientFovMultiplier
                  );
                  ctx.rotate(((barrelAngle - 90) * Math.PI) / 180);
                  ctx.beginPath();
                  ctx.moveTo(
                    ((-barrelwidth3 / 3) * 2) / clientFovMultiplier,
                    -barrelheight3 / clientFovMultiplier
                  );
                  ctx.lineTo(-barrelwidth3 / clientFovMultiplier, 0);
                  ctx.lineTo(barrelwidth3 / clientFovMultiplier, 0);
                  ctx.lineTo(
                    ((barrelwidth3 / 3) * 2) / clientFovMultiplier,
                    -barrelheight3 / clientFovMultiplier
                  );
                  ctx.lineTo(
                    ((-barrelwidth3 / 3) * 2) / clientFovMultiplier,
                    -barrelheight3 / clientFovMultiplier
                  );
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();
                  //rectangle
                  ctx.save();
                  ctx.translate(
                    barrelX2 / clientFovMultiplier,
                    barrelY2 / clientFovMultiplier
                  );
                  ctx.rotate(((barrelAngle - 90) * Math.PI) / 180);
                  ctx.fillRect(
                    -barrelwidth2 / 2 / clientFovMultiplier,
                    -barrelheight2 / clientFovMultiplier,
                    barrelwidth2 / clientFovMultiplier,
                    barrelheight2 / clientFovMultiplier
                  );
                  ctx.strokeRect(
                    -barrelwidth2 / 2 / clientFovMultiplier,
                    -barrelheight2 / clientFovMultiplier,
                    barrelwidth2 / clientFovMultiplier,
                    barrelheight2 / clientFovMultiplier
                  );
                  ctx.restore();
                  //trapezium at the tip
                  ctx.save();
                  ctx.translate(
                    barrelX / clientFovMultiplier,
                    barrelY / clientFovMultiplier
                  );
                  ctx.rotate(((barrelAngle - 90) * Math.PI) / 180);
                  ctx.beginPath();
                  ctx.moveTo(-barrelwidth / 2 / clientFovMultiplier, 0);
                  ctx.lineTo(
                    -barrelwidth / clientFovMultiplier,
                    -barrelheight / clientFovMultiplier
                  );
                  ctx.lineTo(
                    barrelwidth / clientFovMultiplier,
                    -barrelheight / clientFovMultiplier
                  );
                  ctx.lineTo(barrelwidth / 2 / clientFovMultiplier, 0);
                  ctx.lineTo(-barrelwidth / 2 / clientFovMultiplier, 0);
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();
                }

                //draw body
                ctx.fillStyle = object.color;
                ctx.strokeStyle = object.outline;
                ctx.beginPath();
                ctx.arc(
                  0,
                  0,
                  object.width / clientFovMultiplier,
                  0,
                  2 * Math.PI
                );
                ctx.fill();
                ctx.stroke();
                var octagonWidth = object.width/5*4;
                ctx.fillStyle = bodyColors.asset.col;
                ctx.strokeStyle = bodyColors.asset.outline;
                ctx.beginPath();
                ctx.moveTo(
                  0 + (octagonWidth / clientFovMultiplier) * Math.cos(0),
                  0 + (octagonWidth / clientFovMultiplier) * Math.sin(0)
                );
                for (var i = 1; i <= 8 + 1; i += 1) {
                  ctx.lineTo(
                    0 +
                      (octagonWidth / clientFovMultiplier) *
                        Math.cos((i * 2 * Math.PI) / 8),
                    0 +
                      (octagonWidth / clientFovMultiplier) *
                        Math.sin((i * 2 * Math.PI) / 8)
                  );
                }
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = object.color;
                ctx.strokeStyle = object.outline;
                ctx.beginPath();
                ctx.arc(
                  0,
                  0,
                  object.width/2 / clientFovMultiplier,
                  0,
                  2 * Math.PI
                );
                ctx.fill();
                ctx.stroke();

                ctx.lineJoin = "miter"; //change back
                ctx.restore();
                if (settingsList.showhitboxes === true && debugState == "open") {
                  //draw hitbox
                  ctx.strokeStyle = "white";
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(drawingX, drawingY, object.width/clientFovMultiplier, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              }
            }
            function drawplayerdata(object, id, playerstring, auraWidth) {
              //function for drawing objects on the canvas. need to provide aura width because this fuction cannot access variables outside
              var drawingX = (object.x - px) / clientFovMultiplier + canvas.width / 2; //calculate the location on canvas to draw object
              var drawingY = (object.y - py) / clientFovMultiplier + canvas.height / 2;
              if(object.type == "player") {
                //write chats
                if (id != playerstring) {
                  var firstChatY = object.width / clientFovMultiplier /5*4 + 55 / clientFovMultiplier;
                }
                else{
                  var firstChatY = object.width / clientFovMultiplier /5*4;//chat nearer to player body if no need to display name
                }
                ctx.font = "700 25px Roboto";
                ctx.textAlign = "center";
                ctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
                var xpadding = 15;
                var ypadding = 10;
                var lineheight = 30;
                
                var timeWhenChatRemove = 100;//when change on server code, remember to change here too
                
                if (typeof object.chats == 'undefined'){
                  object.chats = [];
                }
                if (!(chatlist[id])){
                  chatlist[id] = JSON.parse(JSON.stringify(object.chats));//used for animating chat positions
                }
                else{
                  let tempArray = [];
                  let messages = {};//prevent bug when multiple chats have same message
                  object.chats.forEach(function (item, index) {
                    let occurence = 0;//prevent bug when multiple chats have same message
                    let foundit = 0;
                    for (var i = 0; i < chatlist[id].length; i++) {//check if oldchats hae this message, to preserve the position for animation
                      if (chatlist[id][i].chat == item.chat){
                        if (messages[item.chat]){//saw a chat with the exact same message before!
                          if (messages[item.chat] <= occurence){//this is a different chat
                            let k = JSON.parse(JSON.stringify(chatlist[id][i]));
                            k.time = item.time;
                            tempArray.push(k);
                            messages[chatlist[id][i].chat]++;
                            foundit = 1;
                            break
                          }
                          else{//this is the same chat that you saw before, continue hunting for the chat
                            occurence++;
                          }
                        }
                        else{
                          let k = JSON.parse(JSON.stringify(chatlist[id][i]));
                          k.time = item.time;
                          tempArray.push(k);
                          messages[chatlist[id][i].chat] = 1;
                          foundit = 1;
                          break
                        }
                      }
                    }
                    if (foundit == 0){//new chat message
                      let k = JSON.parse(JSON.stringify(item));
                      k.opacity = 0;
                      tempArray.push(k);
                    }
                  });
                  chatlist[id] = tempArray;
                }

                object.chats.slice().reverse().forEach((chatObj, index) => {//slice and reverse to loop though array backwards (so older messages are above)
                  ctx.fillStyle = "rgba(69,69,69,.7)";

                  var longestLine = 0;

                  //multiline chat
                  const wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
                    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
                    let words = text.split(' ');
                    let line = ''; // This will store the text of the current line
                    let testLine = ''; // This will store the text when we add a word, to test if it's too long
                    let lineArray = []; // This is an array of lines, which the function will return

                    // Lets iterate over each word
                    for(var n = 0; n < words.length; n++) {
                        // Create a test line, and measure it..
                        testLine += `${words[n]} `;
                        let metrics = ctx.measureText(testLine);
                        let testWidth = metrics.width;
                        // If the width of this test line is more than the max width
                        if (testWidth > maxWidth && n > 0) {
                            // Then the line is finished, push the current line into "lineArray"
                            line = line.slice(0, -1);//remove space at the end of the line
                            lineArray.push([line, x, y]);
                            let thislinewidth = ctx.measureText(line).width;
                            if (thislinewidth > longestLine){
                              longestLine = thislinewidth;
                            }
                            // Increase the line height, so a new line is started
                            y += lineHeight;
                            // Update line and test line to use this word as the first word on the next line
                            line = `${words[n]} `;
                            testLine = `${words[n]} `;
                        }
                        else {
                            // If the test line is still less than the max width, then add the word to the current line
                            line += `${words[n]} `;
                        }
                        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
                        if(n === words.length - 1) {
                            line = line.slice(0, -1);//remove space at the end of the line
                            lineArray.push([line, x, y]);
                            let thislinewidth = ctx.measureText(line).width;
                            if (thislinewidth > longestLine){
                              longestLine = thislinewidth;
                            }
                        }
                    }
                    // Return the line array
                    return lineArray;
                  }

                  let isTypingAnimation = "no";
                  if (chatObj.chat == "typingAnim"){
                    isTypingAnimation = "yes";
                    chatObj.chat = "anim"
                  }
                  let wrappedText = wrapText(ctx, chatObj.chat, drawingX, drawingY - firstChatY, 900, lineheight);//split message into multiline text
                  //draw rect
                  var w = longestLine + xpadding * 2;
                  var h = lineheight * wrappedText.length + ypadding * 2;
                  if (wrappedText.length == 1){//remove spacing between text for single-line text
                    h = 25 + ypadding * 2;
                  }
                  var r = 15;
                  var x = drawingX - longestLine / 2 - xpadding;
                  var y = drawingY - firstChatY - ypadding - h - 20;//the actual y location of this chat message
                  //aniamte towards this y position
                  //remember that the loop is reversed, so indexes are reversed here too
                  let thischat = chatlist[id][chatlist[id].length - 1 - index];
                  let diffpos = 0;
                  if (!thischat.y){
                    thischat.y = y;
                  }
                  else{
                    if (y > thischat.y){
                      thischat.y+=(y - thischat.y)/2*deltaTime;
                      if (y < thischat.y){
                        thischat.y = y;
                      }
                    }
                    else if (y < thischat.y){
                      thischat.y-=(thischat.y - y)/2*deltaTime;
                      if (y > thischat.y){
                        thischat.y = y;
                      }
                    }
                    if (Math.abs(y - thischat.y)<0.1){//small difference between current position and actual position
                      thischat.y = y;
                    }
                    diffpos = y - thischat.y;
                    y = thischat.y;
                  }
                  if (thischat.opacity < 1){
                    thischat.opacity+=0.1;
                  }
                  ctx.globalAlpha = thischat.opacity;
                  ctx.beginPath();
                  ctx.moveTo(x + r, y);
                  ctx.arcTo(x + w, y, x + w, y + h, r);
                  ctx.arcTo(x + w, y + h, x, y + h, r);
                  ctx.arcTo(x, y + h, x, y, r);
                  ctx.arcTo(x, y, x + w, y, r);
                  ctx.closePath();
                  ctx.fill();
                  if (index == 0){
                    //if this is first chat message, draw triangle
                    let trianglewidth = 20;
                    let triangleheight = 10;
                    ctx.beginPath();
                    ctx.moveTo(x + w/2 - trianglewidth/2, y + h);
                    ctx.lineTo(x + w/2 + trianglewidth/2, y + h);
                    ctx.lineTo(x + w/2, y + h + triangleheight);
                    ctx.fill();
                  }
                  //write words
                  ctx.fillStyle = "white";
                  wrappedText.forEach(function(item) {
                    if (isTypingAnimation == "no"){
                      ctx.fillText(item[0], item[1], item[2]-h-diffpos);//write text
                    }
                    else{//typing animation
                      ctx.beginPath();
                      for (let i = 0; i < 3; i++) {
                        let radiusIncrease = 0;
                        if (typingAnimation <= 3*(i+1)+3*i && typingAnimation >= 6*i){
                          radiusIncrease = (typingAnimation - 6*i);
                        }
                        else if (typingAnimation <= 6*(i+1) && typingAnimation >= 6*i){
                          radiusIncrease = (6*(i+1) - typingAnimation);
                        }
                        if (radiusIncrease < 0){
                          radiusIncrease = 0;
                        }
                        ctx.arc(item[1]+(i-1)*18, item[2]-h-diffpos-6, 5+radiusIncrease, 0, 2 * Math.PI);
                      }
                      ctx.fill();
                    }
                  })
                  ctx.globalAlpha = 1.0;
                  firstChatY += (h + 10); //height of chat plus space between chats
                });
                ctx.lineJoin = "miter"; //change it back
                
                if (id != playerstring) {
                  ctx.fillStyle = "white";
                  ctx.strokeStyle = "black";
                  ctx.lineWidth = 8 / clientFovMultiplier;
                  ctx.font = "700 " + 35 / clientFovMultiplier + "px Roboto";
                  ctx.textAlign = "center";
                  ctx.miterLimit = 2;//prevent text spikes, alternative to linejoin round
                  //ctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
                  //note: if you stroke then fill, the words will be thicker and nicer. If you fill then stroke, the words are thinner.
                  if (object.name == "unnamed"){
                    //this guy is unnamed, add a 3 digit identifier
                    let thisID = id.substr(id.length - 3);//last 3 digits of ID
                    object.name += (" #" + thisID);
                  }
                  ctx.strokeText(
                    object.name,
                    drawingX,
                    drawingY - (object.width + 40) / clientFovMultiplier
                  );
                  ctx.fillText(
                    object.name,
                    drawingX,
                    drawingY - (object.width + 40) / clientFovMultiplier
                  );
                  //write player level
                  ctx.font = "700 " + 18 / clientFovMultiplier + "px Roboto";
                  ctx.strokeText(
                    "Lvl " +
                      object.level +
                      " " +
                      object.tankType +
                      "-" +
                      object.bodyType,
                    drawingX,
                    drawingY - (object.width + 10) / clientFovMultiplier
                  );
                  ctx.fillText(
                    "Lvl " +
                      object.level +
                      " " +
                      object.tankType +
                      "-" +
                      object.bodyType,
                    drawingX,
                    drawingY - (object.width + 10) / clientFovMultiplier
                  );
                  ctx.lineJoin = "miter"; //change it back
                }
              }
            }

            //skill points variables
            var currentStatPoints = 0;
            var extraPoints = 0;
            //client send stuff to server
            var autorotate = "no";//keep track of state to create notification
            var autofire = "no";
            var fastautorotate = "no";
            var passivemode = "no";
            //keep track of whether key is pressed down or not to prevent packet sent multiple times when holding down key
            var downpressed = "no";
            var uppressed = "no";
            var leftpressed = "no";
            var rightpressed = "no";
            $("html").keydown(function (e) {
                if(!$("input,textarea").is(":focus")){//if all input and text area do not have focus

                //prevents triggering commands when typing in input boxes
                //console.log(e)
                if (e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
                  if (downpressed == "no" && state=="ingame"){
                    if (gamemode != "PvE arena"){
                      var packet = JSON.stringify(["down"]);
                      socket.send(packet)
                    }
                    else{
                      keys[e.key] = true;
                    }
                    downpressed = "yes";
                  }
                } else if (e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
                  if (uppressed == "no" && state=="ingame"){
                    if (gamemode != "PvE arena"){
                      var packet = JSON.stringify(["up"]);
                      socket.send(packet)
                    }
                    else{
                      keys[e.key] = true;
                    }
                    uppressed = "yes";
                  }
                } else if (e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
                  if (leftpressed == "no" && state=="ingame"){
                    if (gamemode != "PvE arena"){
                      var packet = JSON.stringify(["left"]);
                      socket.send(packet)
                    }
                    else{
                      keys[e.key] = true;
                    }
                    leftpressed = "yes";
                  }
                    else if (state == "homepage"){
                      changeGamemode("p")
                    }
                } else if (e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
                  if (rightpressed == "no" && state=="ingame"){
                    if (gamemode != "PvE arena"){
                      var packet = JSON.stringify(["right"]);
                      socket.send(packet)
                    }
                    else{
                      keys[e.key] = true;
                    }
                    rightpressed = "yes";
                  }
                  else if (state == "homepage"){
                      changeGamemode("n")
                    }
                } else if (e.key == "Shift" && state=="ingame" && gamemode != "PvE arena"){
                  var packet = JSON.stringify(["mousePressed", 3]);
                  socket.send(packet)
                  //e.which refers to whether it's lfet or right click. leftclick is 1, rightclick is 3
                } else if ((e.key == "e" || e.key == "E") && state=="ingame" && gamemode != "PvE arena") {
                  var packet = JSON.stringify(["auto-fire"]);
                  socket.send(packet)
                  if (autofire == "no"){
                    createNotif("Auto Fire (E): ON",defaultNotifColor,3000)
                    autofire = "yes";
                  }
                  else{
                    createNotif("Auto Fire (E): OFF",defaultNotifColor,3000)
                    autofire = "no";
                  }
                } else if ((e.key == "c" || e.key == "C") && state=="ingame" && gamemode != "PvE arena") {
                  var packet = JSON.stringify(["auto-rotate"]);
                  socket.send(packet)
                  if (autorotate == "no"){
                    createNotif("Auto Rotate (C): ON",defaultNotifColor,3000)
                    autorotate = "yes";
                  }
                  else{
                    createNotif("Auto Rotate (C): OFF",defaultNotifColor,3000)
                    autorotate = "no";
                  }
                } else if ((e.key == "f" || e.key == "F") && state=="ingame" && gamemode != "PvE arena") {
                  var packet = JSON.stringify(["fast-auto-rotate"]);
                  socket.send(packet)
                  if (fastautorotate == "no"){
                    createNotif("Fast Auto Rotate (F): ON",defaultNotifColor,3000)
                    fastautorotate = "yes";
                  }
                  else{
                    createNotif("Fast Auto Rotate (F): OFF",defaultNotifColor,3000)
                    fastautorotate = "no";
                  }
                } else if ((e.key == "x" || e.key == "X") && state=="ingame" && gamemode != "PvE arena") {
                  if (keylock == "yes"){
                    keylock = "no";
                    createNotif("Spin Lock (X): OFF",defaultNotifColor,3000)
                  }
                  else{
                    keylock = "yes";
                    createNotif("Spin Lock (X): ON",defaultNotifColor,3000)
                  }
                } else if ((e.key == "m" || e.key == "M") && state=="ingame") {
                  //opening and closing debug info box
                  if (debugState == "open") {
                    document.getElementById("debugContainer").style.display = "none";
                    debugState = "close";
                    createNotif("Debug Mode (M): OFF",defaultNotifColor,3000)
                  } else {
                    document.getElementById("debugContainer").style.display = "flex";
                    debugState = "open";
                    createNotif("Debug Mode (M): ON",defaultNotifColor,3000)
                  }
                } else if ((e.key == "t" || e.key == "T") && state=="ingame") {
                  if (quickchat.style.display == "block"){//close quick chat (turn on closing animation, then reset animation, then hide div)
                    let quickchattext = document.getElementById("quickchattext");
                    let quickchat1 = document.getElementById("quickchat1");
                    let quickchat2 = document.getElementById("quickchat2");
                    let quickchat3 = document.getElementById("quickchat3");
                    let quickchat4 = document.getElementById("quickchat4");
                    quickchattext.style.animation = "rising .5s";
                    quickchat1.style.animation = "shrinking1 .5s";
                    quickchat2.style.animation = "shrinking2 .5s";
                    quickchat3.style.animation = "shrinking3 .5s";
                    quickchat4.style.animation = "shrinking4 .5s";
                    setTimeout(() => {
                      quickchat.style.display = "none";//hide div
                      quickchattext.style.animation = "falling .5s";//reset animation to what is stated in html
                      quickchat1.style.animation = "growing1 .5s";
                      quickchat2.style.animation = "growing2 .5s";
                      quickchat3.style.animation = "growing3 .5s";
                      quickchat4.style.animation = "growing4 .5s";
                    }, 500);//0.5 seconds for animation
                  }
                  else{//if display is none or " "
                    //js will return display as " " because it cant read the css, unless you set it using js before
                    quickchat.style.display = "block";
                  }
                } else if ((e.key == "p" || e.key == "P") && state=="ingame" && gamemode != "PvE arena") {
                  var packet = JSON.stringify(["passive-mode"]);
                  socket.send(packet)
                  if (passivemode == "no"){
                    createNotif("Passive Mode (P): ON",defaultNotifColor,3000)
                    passivemode = "yes";
                  }
                  else{
                    createNotif("Passive Mode (P): OFF",defaultNotifColor,3000)
                    passivemode = "no";
                  }
                } else if (e.key == "Enter" && state == "ingame") {
                  //if press enter, add cursor to chat inputbox
                  document.getElementById("chat").focus(); //add cursor to input field
                } else if (e.key == "Enter" && state != "ingame") {
                  if (state == "deathscreen"){
                    returnToHomeScreen();
                  }
                  else{//if press enter at homepage, enter the game
                    startGame();
                  }
                } else if (e.key == "y" || e.key == "Y") {
                  if (showUpgradeTree == "no") {
                    showUpgradeTree = "yes";
                    showBodyUpgradeTree = "no";
                  } else {
                    showUpgradeTree = "no";
                  }
                } else if (e.key == "u" || e.key == "U") {
                  if (showBodyUpgradeTree == "no") {
                    showBodyUpgradeTree = "yes";
                    showUpgradeTree = "no";
                  } else {
                    showBodyUpgradeTree = "no";
                  }
                } else if (e.key == "o" || e.key == "O") {
                  //open and close settings
                  if (settings.style.display == "none" || settings.style.display == "") {//if settings popup hidden or havent opened before
                    settings.style.display = "block";
                  } else {
                    settings.style.display = "none";
                  }
                } else if (
                  (e.key == "1" ||
                    e.key == "2" ||
                    e.key == "3" ||
                    e.key == "4" ||
                    e.key == "5" ||
                    e.key == "6" ||
                    e.key == "7" ||
                    e.key == "8") &&
                  extraPoints > 0  && state=="ingame" && gamemode != "PvE arena"
                ) {
                  //skill points
                  var packet = JSON.stringify(["upgradeSkillPoints", e.key]);
                  socket.send(packet)
                } else if (e.key == " ") {
                  //space bar
                  var packet = JSON.stringify(["mousePressed"]);
                  socket.send(packet)
                } else if (e.key == "=" && state == "ingame") {//temporary PvE method to change fov for testing purposes only
                  fov++;
                } else if (e.key == "-" && state == "ingame") {//temporary PvE method to change fov for testing purposes only
                  fov--;
                }
              } else if (
                document.activeElement === nameInput
              ) {
                //if name input box is selected
                if (e.key == "Enter") {
                  //if press enter, do the same thing as when pressing the play button
                  startGame();
                }
              } else if (
                document.activeElement === document.getElementById("chat")
              ) {
                //if chat input box is selected
                if (e.key == "Enter"  && state=="ingame" && gamemode != "PvE arena") {
                  //if press enter, send chat message
                  var yourChat = document.getElementById("chat").value; //get message
                  var packet = JSON.stringify(["chat", yourChat]);
                  socket.send(packet)
                  document.getElementById("chat").value = ""; //clear input field
                  document.getElementById("chat").blur(); //remove cursor
                }
              } else if (
                document.activeElement === document.getElementById("devtoken")
              ) {
                //if dev token input box is selected
                if (e.key == "Enter") {
                  //if press enter, send chat message
                  var devToken = document.getElementById("devtoken").value; //get inputted token
                  var packet = JSON.stringify(["developerTest", devToken]);
                  socket.send(packet)
                  document.getElementById("devtoken").value = ""; //clear input field
                  document.getElementById("devtoken").blur(); //remove cursor
                }
              }
            });
            $("html").keyup(function (e) {
              if (document.activeElement !== nameInput) {
                //if the name input box is not selected (prevents triggering commands when typing name)
                //console.log(e)
                if (e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
                  if (downpressed == "yes" && state=="ingame"){
                    if (gamemode != "PvE arena"){
                      var packet = JSON.stringify(["downRelease"]);
                      socket.send(packet)
                    }
                    else{
                      keys[e.key] = false;
                    }
                    downpressed = "no";
                  }
                } else if (e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
                  if (uppressed == "yes" && state=="ingame"){
                    if (gamemode != "PvE arena"){
                      var packet = JSON.stringify(["upRelease"]);
                      socket.send(packet)
                    }
                    else{
                      keys[e.key] = false;
                    }
                    uppressed = "no";
                  }
                } else if (e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
                  if (leftpressed == "yes" && state=="ingame"){
                    if (gamemode != "PvE arena"){
                      var packet = JSON.stringify(["leftRelease"]);
                      socket.send(packet)
                    }
                    else{
                      keys[e.key] = false;
                    }
                    leftpressed = "no";
                  }
                } else if (e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
                  if (rightpressed == "yes" && state=="ingame"){
                    if (gamemode != "PvE arena"){
                      var packet = JSON.stringify(["rightRelease"]);
                      socket.send(packet)
                    }
                    else{
                      keys[e.key] = false;
                    }
                    rightpressed = "no";
                  }
                } else if (e.key == " " && state=="ingame" && gamemode != "PvE arena") {
                  var packet = JSON.stringify(["mouseReleased"]);
                  socket.send(packet)
                } else if (e.key == "Shift" && state=="ingame" && gamemode != "PvE arena"){
                  var packet = JSON.stringify(["mousePressed", 1]);//stop drone repel by left click
                  socket.send(packet)
                  var packet = JSON.stringify(["mouseReleased"]);
                  socket.send(packet)
                }
              }
            });

            var mousex = 0;
            var mousey = 0;

            //mouse move listener
            if (mobile == "no") {
              //if not mobile
              $("html").mousemove(function (e) {
                if (gamemode == "PvE arena"){
                  mouseX = e.pageX;
                  mouseY = e.pageY;
                  return;
                }
                mousex = e.pageX;
                mousey = e.pageY;

                var angle = Math.atan2(
                  window.innerHeight / 2 - mousey,
                  window.innerWidth / 2 - mousex
                );
                //below code stores the player's angle (only for the player the client is controlling)
                //this reduces lag's effect on mouse movement
                if (keylock == "no"){
                  clientAngle = (((angle * 180) / Math.PI - 90) * Math.PI) / 180;
                }
                //change radians to degree, minus 90 degrees, change back to radians
                //must add 90 degress because tank is drawn facing upwards, but 0 degrees is facing right, not upwards

                //for drones
                //this is the mouse coordinates based on game coordinates instead of screen coordinates
                //var mouseXBasedOnCanvas =  (mousex/window.innerWidth)*canvas.width-drawAreaX;
                //var mouseYBasedOnCanvas =  (mousey/window.innerHeight)*canvas.height-drawAreaY;
                var mouseXBasedOnCanvas = (window.innerWidth / 2 - mousex) * clientFovMultiplier;
                var mouseYBasedOnCanvas = (window.innerHeight / 2 - mousey) * clientFovMultiplier;
                //note, the angle is in radians, not degrees
                if (state == "ingame") {
                  //if playing the game
                  if (
                    (Math.abs(mouseXBasedOnCanvas - oldmousex) >= 10 ||
                    Math.abs(mouseYBasedOnCanvas - oldmousey) >= 10) && keylock == "no"
                  ) {
                    if ((Date.now() - prevSendMouse)>30){//limit of one packet sent per 30ms
                      //mousemove event triggered every 1px of movement, so use this if statement to only trigger every 10px of movement
                      var packet = JSON.stringify(["mouseMoved", mouseXBasedOnCanvas/window.innerWidth*canvas.width, mouseYBasedOnCanvas/window.innerHeight*canvas.height, angle]);//mouse positions are in screen coords, need to convert to game cavas coords
                      socket.send(packet)
                      oldmousex = mouseXBasedOnCanvas;
                      oldmousey = mouseYBasedOnCanvas;
                      prevSendMouse = Date.now();
                    }
                  }
                  //check if player mouse touching the upgrade button
                  if (openedUI=="no"){
                    let hoverOne = "no";
                    let resizeDiffX = 1/window.innerWidth*hcanvas.width;//prevent squashed HUD on different sized screens
                    let resizeDiffY = 1/window.innerHeight*hcanvas.height;
                    for (let i = 1; i < 15; i++) {
                      let button = upgradeButtons[i];
                      let x = button.x/canvas.width*window.innerWidth;
                      let y = window.innerHeight - (hcanvas.height - button.y)/canvas.height*window.innerHeight*resizeDiffY/resizeDiffX;
                      let w = button.width/2/canvas.width*window.innerWidth;
                      if (mousex > (x - w) && mousex < (x + w) && mousey < (y + w*resizeDiffY/resizeDiffX) && mousey > (y - w*resizeDiffY/resizeDiffX)) {//note that x coord is not scaled on different screen sizes, only y coord is affected. For upgrade buttons, it scales from the bottom of the screen
                        button.hover = 'yes';
                        hoverOne = "yes";
                      } else {
                        button.hover = 'no';
                      }
                    }

                    let skillpointshitboxY = (hcanvas.height - 138)/canvas.height*window.innerHeight*resizeDiffY/resizeDiffX;
                    let skillpointshitboxXleft = 320/canvas.height*window.innerHeight;
                    let skillpointshitboxXright = (hcanvas.width - 320)/canvas.height*window.innerHeight;
                    if (mousey > skillpointshitboxY && (mousex > skillpointshitboxXright || mousex < skillpointshitboxXleft)) { //make skill points appear
                      mouseToSkillPoints = "yes";
                    } else {
                      mouseToSkillPoints = "no";
                    }
                    
                    //circular button for skill points
                    let x;
                    let y;
                    let width = 20;
                    for (let i = 0; i < 8; i++) {
                      let button = skillpointsbutton[i];
                      if (i < 4){
                        x = 17 * 15 / 2 + skillpointspos - 20 + 5;//15 is number of upgrade points
                        y = (hcanvas.height - 40 - (3 - i)*33) + 25 / 2 + 3;//25 is height
                      }
                      else{
                        x = -17 * 15/2 + hcanvas.width - skillpointspos + 20 - 5;
                        y = (hcanvas.height - 40 - (7-i)*33) + 25 / 2 + 3;
                      }
                      x = x/canvas.width*window.innerWidth;
                      y = window.innerHeight - (hcanvas.height - y)/canvas.height*window.innerHeight*resizeDiffY/resizeDiffX;
                      let w = width/2/canvas.width*window.innerWidth;
                      if (button.clickable == "yes" && mousex > (x - w) && mousex < (x + w) && mousey < (y + w*resizeDiffY/resizeDiffX) && mousey > (y - w*resizeDiffY/resizeDiffX)){
                        button.hover = 'yes';
                        hoverOne = "yes";
                      }
                      else{
                        button.hover = 'no';
                      }
                    }
                    
                    let ignorebutton = ignorebuttonw;
                    x = ignorebutton.x/canvas.width*window.innerWidth;
                    y = window.innerHeight - (hcanvas.height - ignorebutton.y)/canvas.height*window.innerHeight*resizeDiffY/resizeDiffX;
                    if (mousex > x && mousex < (x + ignorebutton.width/canvas.width*window.innerWidth) && mousey < (y + ignorebutton.height/canvas.width*window.innerWidth*resizeDiffY/resizeDiffX) && mousey > y){
                      ignorebutton.hover = 'yes';
                      hoverOne = "yes";
                    }
                    else{
                      ignorebutton.hover = 'no';
                    }
                    ignorebutton = ignorebuttonb;
                    x = ignorebutton.x/canvas.width*window.innerWidth;
                    y = window.innerHeight - (hcanvas.height - ignorebutton.y)/canvas.height*window.innerHeight*resizeDiffY/resizeDiffX;
                    if (mousex > x && mousex < (x + ignorebutton.width/canvas.width*window.innerWidth) && mousey < (y + ignorebutton.height/canvas.width*window.innerWidth*resizeDiffY/resizeDiffX) && mousey > y){
                      ignorebutton.hover = 'yes';
                      hoverOne = "yes";
                    }
                    else{
                      ignorebutton.hover = 'no';
                    }
                    
                    if (hoverOne == "yes"){
                      //one of the button is hovered
                      if (hcanvas.style.cursor != "pointer"){
                        hcanvas.style.cursor = "pointer";//change mouse to a pointer
                      }
                    }
                    else{
                      if (hcanvas.style.cursor != "auto"){
                        hcanvas.style.cursor = "auto";
                      }
                    }
                  }
                }
              });

              //mouse press listener
              $("html").mousedown(function (e) {
                if (gamemode == "PvE arena"){
                  mouseDown = true;
                }
                else{
                  var packet = JSON.stringify(["mousePressed", e.which]);
                  socket.send(packet)
                }
                //e.which refers to whether it's lfet or right click. leftclick is 1, rightclick is 3
              });

              //mouse release listener
              $("html").mouseup(function (e) {
                if (gamemodebuttonList.style.display != "none" && !gamemodebuttonList.contains(e.target)){//if gamemode button list is open and clicked outside gamemode selector
                  gamemodebuttonList.style.display = "none";
                }
                else if (gamemode == "PvE arena"){
                  mouseDown = false;
                  return;
                }
                var packet = JSON.stringify(["mouseReleased", e.which]);
                socket.send(packet);
                if (openedUI=="no"){
                let resizeDiffX = 1/window.innerWidth*hcanvas.width;//prevent squashed HUD on different sized screens
                let resizeDiffY = 1/window.innerHeight*hcanvas.height;
                for (let i = 1; i < 15; i++) {
                  let button = upgradeButtons[i];
                  let x = button.x/canvas.width*window.innerWidth;
                  let w = button.width/2/canvas.width*window.innerWidth;
                  let y = window.innerHeight - (hcanvas.height - button.y)/canvas.height*window.innerHeight*resizeDiffY/resizeDiffX;
                  if (mousex > (x - w) && mousex < (x + w) && mousey < (y + w*resizeDiffY/resizeDiffX) && mousey > (y - w*resizeDiffY/resizeDiffX) &&
                    ((ignorebuttonw.ignore == "no" || i>7) && (ignorebuttonb.ignore == "no" || i<=7))
                  ) {
                    //if player release mouse at button
                    if (i <= 7) {
                      var packet = JSON.stringify(["upgradePlease", "button" + i.toString(), "weaponUpgrade"]);
                      socket.send(packet)
                    } else {
                      var packet = JSON.stringify(["upgradePlease", "button" + i.toString(), "bodyUpgrade"]);
                      socket.send(packet)
                    }
                  }
                }
                for (let i = 0; i < 8; i++) {
                  if (skillpointsbutton[i].hover == "yes"){
                    //skill points
                    var packet = JSON.stringify(["upgradeSkillPoints", (i+1).toString()]);
                    socket.send(packet)
                  }
                }
                if (ignorebuttonw.hover == "yes"){
                  ignorebuttonw.ignore = "yes";
                  levelwhenignorew = player.level;
                }
                if (ignorebuttonb.hover == "yes"){
                  ignorebuttonb.ignore = "yes";
                  levelwhenignoreb = player.level;
                }
                }
              });
            }

            //mobile touch
            if (mobile == "yes") {
              setInterval(function () {
                if (touches[0].state == "moving" && touches[0].oldangle != touches[0].angle) {
                  let tankAngleInDegrees = (touches[0].angle * 180) / Math.PI;
                  if (tankAngleInDegrees < 0) {
                    tankAngleInDegrees += 360;
                  }
                  touches[0].oldangle = touches[0].angle;
                  var packet = JSON.stringify(["360move",tankAngleInDegrees]);
                  socket.send(packet)
                }
                else if (touches[1].state == "moving" && touches[1].oldangle != touches[1].angle) {
                  let tankAngleInDegrees = (touches[1].angle * 180) / Math.PI;
                  if (tankAngleInDegrees < 0) {
                    tankAngleInDegrees += 360;
                  }
                  touches[1].oldangle = touches[1].angle;
                  var packet = JSON.stringify(["360move",tankAngleInDegrees]);
                  socket.send(packet)
                }
                if (touches[0].state == "shooting") {
                  var packet = JSON.stringify(["mouseMoved", touches[0].x, touches[0].y, touches[0].angle]);
                  socket.send(packet)
                  if (mobileSentMousePress=="no"){
                    var packet = JSON.stringify(["mousePressed", 1]);
                    socket.send(packet)
                    mobileSentMousePress = "yes";
                  }
                } else if (touches[1].state == "shooting") {
                  var packet = JSON.stringify(["mouseMoved", touches[1].x, touches[1].y, touches[1].angle]);
                  socket.send(packet)
                  if (mobileSentMousePress=="no"){
                    var packet = JSON.stringify(["mousePressed", 1]);
                    socket.send(packet)
                    mobileSentMousePress = "yes";
                  }
                }
              }, 30);
              document.addEventListener("touchmove", function (e) {
                e.preventDefault();
                //only support 2 touch at each point in time
                let mousex0 = e.touches[0].pageX;
                let mousey0 = e.touches[0].pageY;
                let mousex1;
                let mousey1;
                touches[0].xpos = mousex0;//for drawing the circle on the joystick
                touches[0].ypos = mousey0;//for drawing the circle on the joystick
                if (e.touches[1]) {
                  //if have two touches (might only have one touch)
                  mousex1 = e.touches[1].pageX;
                  mousey1 = e.touches[1].pageY;
                  touches[1].xpos = mousex1;//for drawing the circle on the joystick
                  touches[1].ypos = mousey1;//for drawing the circle on the joystick
                }
                //for drones
                touches[0].x = (window.innerWidth / 2 - mousex0) * clientFovMultiplier;
                touches[0].y = (window.innerHeight / 2 - mousey0) * clientFovMultiplier;
                if (e.touches[1]) {
                  touches[1].x = (window.innerWidth / 2 - mousex0) * clientFovMultiplier;
                  touches[1].y = (window.innerHeight / 2 - mousey0) * clientFovMultiplier;
                }
                //get joystick position relative to screen size, not canvas size
                var joystick1Locationx = (window.innerWidth / hcanvas.width) * (hcanvas.width / 2 + joystick1.xFromCenter);
                var joystick1Locationy = (window.innerHeight / hcanvas.height) * (hcanvas.height / 2 + joystick1.yFromCenter);
                var joystick2Locationx = (window.innerWidth / hcanvas.width) * (hcanvas.width / 2 + joystick2.xFromCenter);
                var joystick2Locationy = (window.innerHeight / hcanvas.height) * (hcanvas.height / 2 + joystick2.yFromCenter);
                var joystick1size = (window.innerHeight / hcanvas.height) * joystick1.size;
                var joystick2size = (window.innerHeight / hcanvas.height) * joystick2.size;
                //there would be two or more touches, so need to figure out whic touch is for which joystick
                //first touch
                if (Math.pow(joystick1Locationx - mousex0, 2) + Math.pow(joystick1Locationy - mousey0, 2) < Math.pow(joystick1size, 2)) { //if touch is inside joystick
                  touches[0].state = "moving";
                }
                else if (Math.pow(joystick2Locationx - mousex0, 2) + Math.pow(joystick2Locationy - mousey0, 2) < Math.pow(joystick2size, 2)) { //if touch is inside joystick
                  touches[0].state = "shooting";
                }
                if (touches[0].state == "shooting") {
                  touches[0].angle = Math.atan2(
                    joystick2Locationy - mousey0,
                    joystick2Locationx - mousex0
                  );
                  //below code stores the player's angle (only for the player the client is controlling)
                  //this reduces lag's effect on mouse movement
                  clientAngle = (((touches[0].angle * 180) / Math.PI - 90) * Math.PI) / 180;
                } else if (touches[0].state == "moving") {
                  touches[0].angle = Math.atan2(
                    joystick1Locationy - mousey0,
                    joystick1Locationx - mousex0
                  );
                }
                //second touch
                if (e.touches[1]) {
                  if (Math.pow(joystick1Locationx - mousex1, 2) + Math.pow(joystick1Locationy - mousey1, 2) < Math.pow(joystick1size, 2)) { //if touch is inside joystick
                    touches[1].state = "moving";
                  } else if (Math.pow(joystick2Locationx - mousex1, 2) + Math.pow(joystick2Locationy - mousey1, 2) < Math.pow(joystick2size, 2)) { //if touch is inside joystick
                    touches[1].state = "shooting";
                  }
                  if (touches[1].state == "shooting") {
                    touches[1].angle = Math.atan2(
                      joystick2Locationy - mousey1,
                      joystick2Locationx - mousex1
                    );
                    clientAngle = (((touches[0].angle * 180) / Math.PI - 90) * Math.PI) / 180;
                  } else if (touches[1].state == "moving") {
                    touches[1].angle = Math.atan2(
                      joystick1Locationy - mousey1,
                      joystick1Locationx - mousex1
                    );
                  }
                }
                //check if player touching the upgrade button
                if (!e.touches[1]) {
                  mousex1 = 0;
                }
                if (!e.touches[1]) {
                  mousey1 = 0;
                }
                let resizeDiffX = 1/window.innerWidth*hcanvas.width;//prevent squashed HUD on different sized screens
                let resizeDiffY = 1/window.innerHeight*hcanvas.height;
                for (let i = 1; i < 15; i++) {
                  let button = upgradeButtons[i];
                  let x = button.x/canvas.width*window.innerWidth;
                  let y = window.innerHeight - (hcanvas.height - button.y)/canvas.height*window.innerHeight*resizeDiffY/resizeDiffX;
                  let w = button.width/2/canvas.width*window.innerWidth;
                  if (
                    (mousex0 > (x - w) && mousex0 < (x + w) && mousey0 < (y + w*resizeDiffY/resizeDiffX) && mousey0 > (y - w*resizeDiffY/resizeDiffX)) ||
                    (mousex1 > (x - w) && mousex1 < (x + w) && mousey1 < (y + w*resizeDiffY/resizeDiffX) && mousey1 > (y - w*resizeDiffY/resizeDiffX) && e.touches[1])
                  ) {
                    button.hover = 'yes';
                  } else {
                    button.hover = 'no';
                  }
                }
              });

              //mouse press listener
              document.addEventListener("touchend", function (e) {
                if (e.changedTouches[0]) {
                  if (e.changedTouches[0].pageX==touches[0].xpos&&e.changedTouches[0].pageY==touches[0].ypos){
                    if (touches[0].state == "moving") {
                      var packet = JSON.stringify(["360Release"]);
                      socket.send(packet)
                    } else {
                      if (mobileSentMousePress=="yes"){
                        var packet = JSON.stringify(["mouseReleased", 1]);
                        socket.send(packet)
                        mobileSentMousePress = "no";
                      }
                    }
                    touches[0].state = "no";
                  }
                  else if (e.changedTouches[0].pageX==touches[1].xpos&&e.changedTouches[0].pageY==touches[1].ypos){
                    if (touches[1].state == "moving") {
                      var packet = JSON.stringify(["360Release"]);
                      socket.send(packet)
                    } else {
                      if (mobileSentMousePress=="yes"){
                        var packet = JSON.stringify(["mouseReleased", 1]);
                        socket.send(packet)
                        mobileSentMousePress = "no";
                      }
                    }
                    touches[1].state = "no";
                  }
                }
                if (e.changedTouches[1]) {
                  if (e.changedTouches[1].pageX==touches[0].xpos&&e.changedTouches[1].pageY==touches[0].ypos){
                    if (touches[0].state == "moving") {
                      var packet = JSON.stringify(["360Release"]);
                      socket.send(packet)
                    } else {
                      if (mobileSentMousePress=="yes"){
                        var packet = JSON.stringify(["mouseReleased", 1]);
                        socket.send(packet)
                        mobileSentMousePress = "no";
                      }
                    }
                    touches[0].state = "no";
                  }
                  else if (e.changedTouches[1].pageX==touches[1].xpos&&e.changedTouches[1].pageY==touches[1].ypos){
                    if (touches[1].state == "moving") {
                      var packet = JSON.stringify(["360Release"]);
                      socket.send(packet)
                    } else {
                      if (mobileSentMousePress=="yes"){
                        var packet = JSON.stringify(["mouseReleased", 1]);
                        socket.send(packet)
                        mobileSentMousePress = "no";
                      }
                    }
                    touches[1].state = "no";
                  }
                }
                for (let j = 0; j < e.changedTouches.length; j++) {
                  let mousex = e.changedTouches[j].pageX;
                  let mousey = e.changedTouches[j].pageY;
                  let resizeDiffX = 1/window.innerWidth*hcanvas.width;//prevent squashed HUD on different sized screens
                  let resizeDiffY = 1/window.innerHeight*hcanvas.height;
                  for (let i = 1; i < 15; i++) {
                    let button = upgradeButtons[i];
                    let x = button.x/canvas.width*window.innerWidth;
                    let y = window.innerHeight - (hcanvas.height - button.y)/canvas.height*window.innerHeight*resizeDiffY/resizeDiffX;
                    let w = button.width/2/canvas.width*window.innerWidth;
                    if (mousex > (x - w) && mousex < (x + w) && mousey < (y + w*resizeDiffY/resizeDiffX) && mousey > (y - w*resizeDiffY/resizeDiffX)) { //if player release mouse at button
                      if (i <= 7) {
                        var packet = JSON.stringify(["upgradePlease", "button" + i.toString(), "weaponUpgrade"]);
                        socket.send(packet)
                      } else {
                        var packet = JSON.stringify(["upgradePlease", "button" + i.toString(), "bodyUpgrade"]);
                        socket.send(packet)
                      }
                    }
                  }
                  let skillwidth = 280/hcanvas.width*window.innerWidth;
                  let skillheight = 30/hcanvas.width*window.innerWidth*resizeDiffY/resizeDiffX;
                  for (let i = 1; i < 9; i++) {//skill points (can only click on mobile)
                    let something = 0;//something is 3,2,1,0,3,2,1,0 from top to bottom of the 8 skill points
                    let skillx = 0;
                    if (i>4){
                      something = 8-i;
                      skillx = (hcanvas.width - skillpointspos - 140)/hcanvas.width*window.innerWidth;
                    }
                    else{
                      something = 4-i;
                      skillx = (skillpointspos - 140)/hcanvas.width*window.innerWidth;
                    }
                    let skilly = window.innerHeight - (40 + 32*something)/canvas.height*window.innerHeight*resizeDiffY/resizeDiffX;
                    if (mousex > skillx && mousex < (skillx+skillwidth) && mousey < (skilly + skillheight) && mousey > skilly) { //if player release mouse at skill point
                      var packet = JSON.stringify(["upgradeSkillPoints", i]);
                      socket.send(packet)
                    }
                  }
                }
              });
            }

  
            var lerpDrawnX = 0;
            var lerpDrawnY = 0;
            let updateInterval = 60;//server send update every 60ms (17 fps)
            function simpleLerpPos(obj,oldobj){
              let timeDiff = Date.now() - latestServerUpdateTime;
              if (timeDiff > updateInterval){timeDiff = updateInterval;}//prevent crazy jumping when lagging servers
              lerpDrawnX = oldobj.x + (obj.x - oldobj.x)/updateInterval*timeDiff;
              lerpDrawnY = oldobj.y + (obj.y - oldobj.y)/updateInterval*timeDiff;
            }
            function simpleLerpAngle(obj,oldobj){
              let timeDiff = Date.now() - latestServerUpdateTime;
              if (timeDiff > updateInterval){timeDiff = updateInterval;}//prevent crazy jumping when lagging servers
              let oldangle = oldobj.angle;
              let newangle = obj.angle;
              //note: player angle in radians
              if ((oldangle - newangle)>5.25){//angle went from 360 to 0
                oldangle-=2*Math.PI;
              }
              else if ((newangle - oldangle)>5.25){//angle went from 0 to 360
                oldangle+=2*Math.PI;
              }
              let lerpedAngle = oldangle + (newangle - oldangle)/updateInterval*timeDiff;
              return lerpedAngle
            }
            function lerpProperty(obj,oldobj,property){
              let timeDiff = Date.now() - latestServerUpdateTime;
              if (timeDiff > updateInterval){timeDiff = updateInterval;}//prevent crazy jumping when lagging servers
              let oldangle = oldobj[property];
              let newangle = obj[property];
              let lerpedAngle = oldangle + (newangle - oldangle)/updateInterval*timeDiff;
              return lerpedAngle
            }

            var requestInterval = function (fn, delay) {//dont use setinterval anymore cuz it affected latency for mobile users (running 30fps on mobile will cause lag cuz it cant do 30fps)
              var requestAnimFrame = (function () {
                return window.requestAnimationFrame || function (callback, element) {
                  window.setTimeout(callback, 1000 / 60);
                };
              })(),
              start = new Date().getTime(),
              handle = {};
              function loop() {
                handle.value = requestAnimFrame(loop);
                var current = new Date().getTime(),
                delta = current - start;
                if (delta >= delay) {
                  fn.call();
                  start = new Date().getTime();
                }
              }
              handle.value = requestAnimFrame(loop);
              return handle;
            };

            function screenDrawLoop(){//everything happens here
              starting = performance.now();//for client tick time
              
              //calculate delta
              let currentLoopTime = Date.now();
              if (prevLoopTime == 0) { //if this is first loop
                  deltaTime = 1;
              } else {
                  let timeLapsed = currentLoopTime - prevLoopTime;
                  deltaTime = timeLapsed / 30;//30fps would be the speed at which animations should run
              }
              prevLoopTime = currentLoopTime;

              var resizeDiffX = 1/window.innerWidth*hcanvas.width;//prevent squashed HUD on different sized screens
              var resizeDiffY = 1/window.innerHeight*hcanvas.height;

              //check if player clicked play button and if joined
              if (canLogIn == "yes") {
                //if client wants to log into an account
                if (acctype != "edit"){
                  var packet = JSON.stringify(["logInOrSignUp", accusername, accpassword, accdesc, acctype]);
                  socket.send(packet)
                  canLogIn = "no";
                }
                else{
                  var packet = JSON.stringify(["editaccount", loggedInAccount.name, loggedInAccount.pw, loggedInAccount.desc, accusername, accpassword, accdesc]);
                  socket.send(packet)
                  canLogIn = "no";
                }
              }
              if (state == "ingame" && sentStuffBefore == "yes") {
                //DRAW THE GAME STUFF
                
                //reset to prevent restore bugs (hctx.restore wont happen if there is an error in the code)
                if (typeof hctx.reset == 'function') { 
                  hctx.reset();
                }
      
                //for chat animation
                typingAnimation+=0.5*deltaTime;
                if (typingAnimation > 20){
                  typingAnimation = 0;
                }
      
                auraRotate += (80)/30*deltaTime;
                if(auraRotate < 0) {auraRotate = 360}
                if(auraRotate > 360) {auraRotate = 0}
                auraWidth = (Math.sin((auraRotate * Math.PI / 180))/20)+0.125;
                //for radiant shape spike
                extraSpikeRotate++;
                if (extraSpikeRotate >= 360) {
                  extraSpikeRotate -= 360;
                }
                extraSpikeRotate1 += 2;
                if (extraSpikeRotate1 >= 360) {
                  extraSpikeRotate1 -= 360;
                }
                extraSpikeRotate2--;
                if (extraSpikeRotate2 <= 0) {
                  extraSpikeRotate2 += 360;
                }
                //for radiant colors
                for (const id in radiantShapes) {
                  let animationSpeed = 3;
                  let thisShape = radiantShapes[id];
                  let radtype = thisShape.radtype;
                  if (radtype == 1) {
                    //red yellow blue
                    if (thisShape.rgbstate == 0) {
                      thisShape.rgbstate = 1;
                    } else if (thisShape.rgbstate == 1) {
                      if (thisShape.red > 200) {
                        thisShape.red -= animationSpeed;
                      }
                      thisShape.green += animationSpeed;
                      if (thisShape.green >= 150) {
                        thisShape.rgbstate = 2; //change to next state
                      }
                    } else if (thisShape.rgbstate == 2) {
                      thisShape.blue += animationSpeed;
                      if (thisShape.green > 0) {
                        thisShape.green -= animationSpeed;
                      }
                      if (thisShape.red > 0) {
                        thisShape.red -= animationSpeed;
                      }
                      if (thisShape.blue >= 200) {
                        thisShape.rgbstate = 3; //change state
                      }
                    } else if (thisShape.rgbstate == 3) {
                      thisShape.blue -= animationSpeed;
                      thisShape.red += animationSpeed;
                      if (thisShape.blue <= 0 && thisShape.red >= 255) {
                        thisShape.rgbstate = 1; //change state
                        thisShape.red = 255;
                        thisShape.blue = 0;
                      }
                    }
                  } else {
                    //greyish-green white yellow 118, 168, 151 -> 209, 230, 222 -> 234, 240, 180
                    if (thisShape.rgbstate == 0) {
                      thisShape.rgbstate = 1;
                    } else if (thisShape.rgbstate == 1) {
                      if (thisShape.red >= 118 && thisShape.red < 209) {
                        thisShape.red += animationSpeed;
                        thisShape.blue += animationSpeed;
                        thisShape.green += animationSpeed;
                      } else {
                        thisShape.rgbstate = 2; //change to next state
                      }
                    } else if (thisShape.rgbstate == 2) {
                      thisShape.blue -= animationSpeed;
                      if (thisShape.green < 240) {
                        thisShape.green += animationSpeed;
                      }
                      if (thisShape.red < 234) {
                        thisShape.red += animationSpeed;
                      }
                      if (thisShape.blue <= 180) {
                        thisShape.rgbstate = 3; //change state
                      }
                    } else if (thisShape.rgbstate == 3) {
                      thisShape.red -= animationSpeed;
                      if (thisShape.green > 168) {
                        thisShape.green -= animationSpeed;
                      }
                      if (thisShape.blue > 151) {
                        thisShape.blue -= animationSpeed;
                      }
                      if (thisShape.red <= 118) {
                        thisShape.rgbstate = 1; //change state
                        thisShape.red = 118;
                        thisShape.blue = 168;
                        thisShape.green = 151;
                      }
                    }
                  }
                }
                //for gates
                gateTimer += 0.1 * deltaTime;
                if (gateTimer >= endGate){
                  gateTimer = startGate;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height); //clear screen so can redraw
                hctx.clearRect(0, 0, hcanvas.width, hcanvas.height); //clear screen so can redraw
                //shake canvas if touch portal
                let prevShakeYN = shakeYN;//this one doesnt change later on
                if (shakeYN == "yes") {
                  ctx.save();
                  let dx = Math.random() * 20 * (1 - shakeIntensity) - 10 * (1 - shakeIntensity);
                  let dy = Math.random() * 20 * (1 - shakeIntensity) - 10 * (1 - shakeIntensity);
                  //-10 at the end so that the chosen number has a range of between -10 and 10
                  //shake intensity 0 means that players is at center of portal
                  ctx.translate(dx, dy);
                }
                else if (slightshake == "yes"){
                  if (slightshakeIntensity<0){
                    slightshake = "no";
                  }
                  else{
                    ctx.save();
                    let dx = Math.random() * 10 * slightshakeIntensity - 5 * slightshakeIntensity;
                    let dy = Math.random() * 10 * slightshakeIntensity - 5 * slightshakeIntensity;
                    ctx.translate(dx, dy);
                    slightshakeIntensity-=0.1;
                  }
                }
     
                //interpolate the player's position first
                lerpDrawnX = 0;
                lerpDrawnY = 0;
                if (objects.player && oldobjects.player && interpolatedobjects.player){
                  interpolatedobjects.player[playerstring] = JSON.parse(JSON.stringify(objects.player[playerstring]));
                  simpleLerpPos(objects.player[playerstring],oldobjects.player[playerstring]);
                  px = lerpDrawnX;//needed for drawing stuff
                  py = lerpDrawnY;
                }
                else{
                  px = player.x;
                  py = player.y;
                }

                //now we are drawing the game area
                if (playerstring != "error") {//checks if server has already sent player's id to client
                  drawAreaX = canvas.width / 2 - px; //needed for mouse movement
                  drawAreaY = canvas.height / 2 - py;
                }
                //COLOR OF AREA OUTSIDE PLAYABLE AREA
                if (gamemode == "dune") {
                  ctx.fillStyle = "#fcdcbb";
                } else if (gamemode == "cavern") {
                  ctx.fillStyle = "#010101";
                } else if (gamemode == "sanctuary") {
                  ctx.fillStyle = "#404040";
                } else if (gamemode == "crossroads") {
                  ctx.fillStyle = "#1f1f1f";
                } else {
                  ctx.fillStyle = "#bebebe";
                }
                ctx.fillRect(0, 0, canvas.width, canvas.height); //drawing background
                //COLOR OF PLAYABLE AREA
                if (gamemode == "dune") {
                  ctx.fillStyle = "#ffead4";
                } else if (gamemode == "cavern") {
                  ctx.fillStyle = "#141414";
                } else if (gamemode == "sanctuary") {
                  ctx.fillStyle = "#595959";
                } else if (gamemode == "crossroads") {
                  ctx.fillStyle = "#303030";
                } else {
                  ctx.fillStyle = "#CDCDCD";
                }
                ctx.fillRect(
                  canvas.width / 2 - px / clientFovMultiplier,
                  canvas.height / 2 - py / clientFovMultiplier,
                  MAP_WIDTH / clientFovMultiplier,
                  MAP_WIDTH / clientFovMultiplier
                ); //drawing area

                if (gamemode == "2 Teams") {//draw team base
                  var baseSize = 1500;
                  let firstColor = teamColors[0];
                  //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
                  if (firstColor == "red"){
                    ctx.fillStyle = "#dbbfc0";
                  }
                  else if (firstColor == "green"){
                    ctx.fillStyle = "#acd0bd";
                  }
                  else if (firstColor == "blue"){
                    ctx.fillStyle = "#acc8d0";
                  }
                  else if (firstColor == "purple"){
                    ctx.fillStyle = "#c0b3c9";
                  }
                  ctx.fillRect(
                    canvas.width / 2 - px / clientFovMultiplier,
                    canvas.height / 2 - py / clientFovMultiplier,
                    baseSize / clientFovMultiplier,
                    MAP_WIDTH / clientFovMultiplier
                  );
                  firstColor = teamColors[1];
                  //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
                  if (firstColor == "red"){
                    ctx.fillStyle = "#dbbfc0";
                  }
                  else if (firstColor == "green"){
                    ctx.fillStyle = "#acd0bd";
                  }
                  else if (firstColor == "blue"){
                    ctx.fillStyle = "#acc8d0";
                  }
                  else if (firstColor == "purple"){
                    ctx.fillStyle = "#c0b3c9";
                  }
                  ctx.fillRect(
                    canvas.width / 2 - px / clientFovMultiplier + MAP_WIDTH / clientFovMultiplier - baseSize / clientFovMultiplier,
                    canvas.height / 2 - py / clientFovMultiplier,
                    baseSize / clientFovMultiplier,
                    MAP_WIDTH / clientFovMultiplier
                  );
                }
                if (gamemode == "4 Teams") {//draw team base
                  var baseSize = 1500;
                  let firstColor = teamColors[0];
                  //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
                  if (firstColor == "red"){
                    ctx.fillStyle = "#dbbfc0";
                  }
                  else if (firstColor == "green"){
                    ctx.fillStyle = "#acd0bd";
                  }
                  else if (firstColor == "blue"){
                    ctx.fillStyle = "#acc8d0";
                  }
                  else if (firstColor == "purple"){
                    ctx.fillStyle = "#c0b3c9";//c7bccf
                  }
                  ctx.fillRect(
                    canvas.width / 2 - px / clientFovMultiplier,
                    canvas.height / 2 - py / clientFovMultiplier,
                    baseSize / clientFovMultiplier,
                    baseSize / clientFovMultiplier
                  );
                  firstColor = teamColors[1];
                  //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
                  if (firstColor == "red"){
                    ctx.fillStyle = "#dbbfc0";
                  }
                  else if (firstColor == "green"){
                    ctx.fillStyle = "#acd0bd";
                  }
                  else if (firstColor == "blue"){
                    ctx.fillStyle = "#acc8d0";
                  }
                  else if (firstColor == "purple"){
                    ctx.fillStyle = "#c0b3c9";
                  }
                  ctx.fillRect(
                    canvas.width / 2 - px / clientFovMultiplier + MAP_WIDTH / clientFovMultiplier - baseSize / clientFovMultiplier,
                    canvas.height / 2 - py / clientFovMultiplier,
                    baseSize / clientFovMultiplier,
                    baseSize / clientFovMultiplier
                  );
                  firstColor = teamColors[2];
                  //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
                  if (firstColor == "red"){
                    ctx.fillStyle = "#dbbfc0";
                  }
                  else if (firstColor == "green"){
                    ctx.fillStyle = "#acd0bd";
                  }
                  else if (firstColor == "blue"){
                    ctx.fillStyle = "#acc8d0";
                  }
                  else if (firstColor == "purple"){
                    ctx.fillStyle = "#c0b3c9";
                  }
                  ctx.fillRect(
                    canvas.width / 2 - px / clientFovMultiplier + MAP_WIDTH / clientFovMultiplier - baseSize / clientFovMultiplier,
                    canvas.height / 2 - py / clientFovMultiplier + MAP_WIDTH / clientFovMultiplier - baseSize / clientFovMultiplier,
                    baseSize / clientFovMultiplier,
                    baseSize / clientFovMultiplier
                  );
                  

                  firstColor = teamColors[3];
                  //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
                  if (firstColor == "red"){
                    ctx.fillStyle = "#dbbfc0";
                  }
                  else if (firstColor == "green"){
                    ctx.fillStyle = "#acd0bd";
                  }
                  else if (firstColor == "blue"){
                    ctx.fillStyle = "#acc8d0";
                  }
                  else if (firstColor == "purple"){
                    ctx.fillStyle = "#c0b3c9";
                  }
                  ctx.fillRect(
                    canvas.width / 2 - px / clientFovMultiplier,
                    canvas.height / 2 - py / clientFovMultiplier + MAP_WIDTH / clientFovMultiplier - baseSize / clientFovMultiplier,
                    baseSize / clientFovMultiplier,
                    baseSize / clientFovMultiplier
                  );
                }
                if (gamemode == "Tank Editor"){//draw safe zone
                  ctx.fillStyle = safeZoneColor;
                  ctx.fillRect(
                    canvas.width / 2 - px / clientFovMultiplier + MAP_WIDTH / clientFovMultiplier /2 - safeZone / clientFovMultiplier /2,
                    canvas.height / 2 - py / clientFovMultiplier + MAP_WIDTH / clientFovMultiplier /2 - safeZone / clientFovMultiplier /2,
                    safeZone / clientFovMultiplier,
                    safeZone / clientFovMultiplier
                  );
                }

                //drawin grid lines
                ctx.beginPath();
                ctx.lineWidth = 1; //thickness of grid
                var gridHeight = 30 / clientFovMultiplier;
                if (gamemode == "dune") {
                  ctx.strokeStyle = "#edddc5";
                } else if (gamemode == "cavern") {
                  ctx.strokeStyle = "#242424";
                  gridHeight = 80 / clientFovMultiplier;
                } else if (gamemode == "sanctuary") {
                  ctx.strokeStyle = "#363636";
                  ctx.lineWidth = 3 / clientFovMultiplier;
                } else if (gamemode == "crossroads") {
                  ctx.strokeStyle = "rgba(18, 18, 18, .5)";
                  gridHeight = 80 / clientFovMultiplier;
                  ctx.lineWidth = 3; //thickness of grid
                } else {
                  ctx.lineWidth = 4; //thickness of grid
                  gridHeight = 24 / clientFovMultiplier;
                  ctx.strokeStyle = "rgba(180, 180, 180, .2)";
                }

                //How does drawing the grid lines work: the equation below is to calculate the negative of the closest number to drawAreaX that is divisible by gridHeight, with drawAreaX referring to the distance from left side of screen to arena, and gridHeight is distance between lines drawn. By calculating this, we can find out the position to start drawing the first line on the left side of the screen, producing the effect of the grid moving in the opposite direction of the user. Need to be opposite, that's why negative in equation. Because the lines are drawn relative to the left and top of arena, that's why the lines are always drawn exactly on the left and top of arena on screen, unless people disconnect or connect, resulting in change og arena size.
                //for x: -gridHeight-(-drawAreaX%gridHeight)
                //for y: -gridHeight-(-drawAreaY%gridHeight)
                //edit: instead of using drawAreaX, use (canvas.width/2 - player.x/fov) for accurate grid drawing
                if (player.fovMultiplier < 10) {
                  //dont draw grid lines if field of vision is high, to prevent lag from drawing too many grid lines
                  for (let x = -gridHeight - (-(canvas.width / 2 - px / clientFovMultiplier) % gridHeight); x < canvas.width; x += gridHeight) {
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                  }
                  for (let y = -gridHeight - (-(canvas.height / 2 - py / clientFovMultiplier) % gridHeight); y < canvas.height; y += gridHeight) {
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                  }
                  ctx.stroke();
                }
                
                
                //drawing the objects that are sent from the server, order of drawings are already changed by the server, so if you want something to be below another thing, change the order of adding to the object list in the server code, not the client code
                for (const id in portalparticles) {
                  //potral particle list first, so that it is drawn at the bottom
                  let thisobject = portalparticles[id];
                  thisobject.x += Math.cos(thisobject.angle) * thisobject.speed*deltaTime;
                  thisobject.y += Math.sin(thisobject.angle) * thisobject.speed*deltaTime;
                  drawobjects(thisobject, id, playerstring, auraWidth); //draw the objects on the canvas
                  thisobject.timer-=1*deltaTime;
                  if (thisobject.timer < 0) {
                    delete portalparticles[id];
                  }
                };
                shakeYN = "no"; //reset portal screen shake
                shakeIntensity = 1;
                Object.keys(portals).forEach((id) => {
                  //draw portals. portals not inside object list because all need to be sent for the minimap anyways
                  if (!portalwidths.hasOwnProperty(id)) {
                    portalwidths[id] = portals[id].width; //this is used for keeping track the sizes of portal that changes when player enter and exit a portal
                  } else {
                    //if this portal already existed
                    if (portalwidths[id] < portals[id].width + portals[id].peopleTouch * 45) { //45px portal size growth per person
                      portalwidths[id] += 3;
                    } else if (portalwidths[id] > portals[id].width + portals[id].peopleTouch * 45) {
                      portalwidths[id] -= 3;
                    }
                  }
                  var thisobject = portals[id];
                  thisobject.type = "portal";
                  let oldtimer = thisobject.timer;
                  if (oldportals[id]){
                    thisobject.timer = lerpProperty(thisobject,oldportals[id],'timer')
                  }
                  drawobjects(thisobject, id, playerstring, auraWidth); //draw the objects on the canvas
                  thisobject.timer = oldtimer;//reset timer to original (not lerped)

                  //check for collision with portal to check if shake canvas or not
                  var DistanceBetween = Math.sqrt(
                    (player.x - thisobject.x) * (player.x - thisobject.x) +
                      (player.y - thisobject.y) * (player.y - thisobject.y)
                  ); //calculate distance between center of portal and player
                  if (DistanceBetween <= player.width + thisobject.width * 3) {
                    //portal width times 3 so that shake will be felt from a distance
                    shakeYN = "yes";
                    if (DistanceBetween / (player.width + thisobject.width * 3) < shakeIntensity) { //if new shake intensity higher than shake intensity from anither portal
                      shakeIntensity = DistanceBetween / (player.width + thisobject.width * 3); //ranges from 1 to 0, 0 meaning player is at center of portal
                    }
                  }
                });
      
                //smoothly change player's fov
                if (player.fovMultiplier){
                  if (clientFovMultiplier != player.fovMultiplier){
                    clientFovMultiplier += (player.fovMultiplier - clientFovMultiplier)/5;
                    if (Math.abs(clientFovMultiplier - player.fovMultiplier)<0.001){
                      clientFovMultiplier = player.fovMultiplier;
                    }
                  }
                }
      
      
                for (const type in objects) {
                  for (const id in objects[type]) {
                    var thisobject = JSON.parse(JSON.stringify(objects[type][id]));
                    if (!interpolatedobjects[type]){
                      interpolatedobjects[type] = {};
                    }
                    interpolatedobjects[type][id] = JSON.parse(JSON.stringify(objects[type][id]));
                    if (oldobjects[type]){
                      if (oldobjects[type][id]){
                        //do lerping if not new object
                        if (id != playerstring){//not the player
                          if (type != "bullet" || thisobject.bulletType != "bullet"){
                            lerpDrawnX = thisobject.x;
                            lerpDrawnY = thisobject.y;
                            simpleLerpPos(thisobject,oldobjects[type][id])
                            thisobject.x = lerpDrawnX;
                            thisobject.y = lerpDrawnY;
                            if (type == "player" || type == "shape" || type == "def"){//lerp angle
                              thisobject.angle = simpleLerpAngle(thisobject,oldobjects[type][id])
                              if (type == "shape"){
                                thisobject.health = lerpProperty(thisobject,oldobjects[type][id],'health')
                              }
                            }
                          }
                        }
                        else{
                          //camera is lerped
                          simpleLerpPos(thisobject,oldobjects[type][id])
                          thisobject.x = px;
                          thisobject.y = py;
                          thisobject.angle = simpleLerpAngle(thisobject,oldobjects[type][id])
                        }
                      }
                    }
                    thisobject.type = type;
                    interpolatedobjects[type][id].x = thisobject.x;
                    interpolatedobjects[type][id].y = thisobject.y;
                    if (type == "bullet" && thisobject.bulletType == "bullet"){
                      //server wont send bullet updates all the time if the bullet is a bullet and not a trap or drone or minion etc.
                      //client move bullet yourself
                      //console.log(id + ',' + objects[type][id].x + ',1')
                      objects[type][id].y += Math.sin(thisobject.moveAngle - 0.5 * Math.PI) * thisobject.amountAddWhenMove * deltaTime;
                      objects[type][id].x += Math.cos(thisobject.moveAngle - 0.5 * Math.PI) * thisobject.amountAddWhenMove * deltaTime;
                      //console.log(id + ',' + objects[type][id].x + ',2')
                    }
                    drawobjects(thisobject, id, playerstring, auraWidth); //draw the objects on the canvas
                  }
                }
                
                  for (const id in objects.player) {
                    var thisobject = JSON.parse(JSON.stringify(objects.player[id]));
                    if (oldobjects.player){
                      if (oldobjects.player[id]){
                        //do lerping if not new object
                        if (id != playerstring){//not the player
                          lerpDrawnX = thisobject.x;
                          lerpDrawnY = thisobject.y;
                          simpleLerpPos(thisobject,oldobjects.player[id])
                          thisobject.x = lerpDrawnX;
                          thisobject.y = lerpDrawnY;
                          thisobject.angle = simpleLerpAngle(thisobject,oldobjects.player[id])
                        }
                        else{
                          simpleLerpPos(thisobject,oldobjects.player[id])
                          thisobject.x = px;
                          thisobject.y = py;
                          //update debug position
                          positionDiv.textContent = "Position: " + Math.round(px * 100) / 100 + "," + Math.round(py * 100) / 100;//2 decimal places
                        }
                      }
                    }
                    thisobject.type = "player";
                    interpolatedobjects.player[id].x = thisobject.x;
                    interpolatedobjects.player[id].y = thisobject.y;
                    drawplayerdata(thisobject, id, playerstring, auraWidth); //draw the obcjects on the canvas
                  }
                
                listofdeadobjects.forEach((object) => {
                  //dead object array
                  if (object.bulletType != "aura") {
                    if (object.type == "bullet") {
                      //check if bullet belongs to player. usually server does this, but not for dead objects
                      if (object.ownerId == playerstring) {
                        object.ownsIt = "yes";
                      }
                    }
                    else if (object.type == "shape"){
                      if (shapeHealthBar.hasOwnProperty(object.id)){//for health bar width animation when die
                        if (shapeHealthBar[object.id] > 0){
                          shapeHealthBar[object.id]-=5*deltaTime;
                        }
                        if (shapeHealthBar[object.id] < 0){
                          shapeHealthBar[object.id] = 0;
                        }
                      }
                    }
                    if (object.hasOwnProperty("deadanimation")) {
                      object.deadanimation--; //animate object
                      //object.width += 5;
                      object.width *= 1.1;
                      if (object.deadOpacity > 0) {
                        object.deadOpacity -= 0.2;
                      }
                      if (object.deadOpacity < 0) {
                        object.deadOpacity = 0;
                      }
                      if (object.deadanimation < 0) {
                        //remove object from array
                        var index = listofdeadobjects.indexOf(object);
                        if (index > -1) {
                          // only splice array when item is found
                          listofdeadobjects.splice(index, 1); // 2nd parameter means remove one item only
                        }
                      }
                    } else {
                      object.deadanimation = 5; //duration of dead animation
                      object.deadOpacity = 1;
                    }
                    drawobjects(object, object.id, playerstring, auraWidth); //draw the objects on the canvas
                  }
                });
                Object.keys(radparticles).forEach((id) => {
                  //radiant particle list last so that it is drawn at the top
                  var thisobject = radparticles[id];
                  drawobjects(thisobject, id, playerstring, auraWidth); //draw the objects on the canvas
                  thisobject.x += Math.cos(thisobject.angle) * thisobject.speed*deltaTime;
                  thisobject.y += Math.sin(thisobject.angle) * thisobject.speed*deltaTime;
                  thisobject.timer-=1*deltaTime;
                  if(thisobject.source == "dune") {
                    thisobject.angle = (((-90 * Math.PI) / 180) + (thisobject.angle * 199)) / 200;
                  }

                  if (thisobject.timer < 0) {
                    delete radparticles[id];
                  }
                });

                // FPS counter update
                frameCount++;
                const now = performance.now();
                if (now >= lastFpsUpdate + 1000) { // Update every second
                    fps = frameCount;
                    frameCount = 0;
                    lastFpsUpdate = now;
                    fpsCounter.textContent = `FPS: ${fps}`;
                    fpsCounter.className = 
                      fps >= 45 ? 'high' : 
                      fps >= 15 ? 'medium' : 'low';
                }

                if (gamemode == "dune") {
                  //spawn random particles if in dune
                  if (spawnduneparticle == "yes"){
                    var choosing = Math.floor((Math.random() * 10)/clientFovMultiplier); //choose if particle spawn
                    if (choosing <= 0) {
                      //spawn a particle
                      let angleRadians = (-30+Math.floor(Math.random() * 30) * Math.PI) / 180; //convert to radians
                      var size = 50*(Math.floor(Math.random() * 3) + 1)-25;
                      var randomDistFromCenterX = (Math.floor(Math.random() * canvas.width+size) - (canvas.width+size)/2)*clientFovMultiplier;
                      var randomDistFromCenterY = (Math.floor(Math.random() * canvas.height+size) - (canvas.height+size)/2)*clientFovMultiplier;
                      radparticles[particleID] = {
                        angle: angleRadians,
                        x: player.x + randomDistFromCenterX,// * Math.cos(angleRadians),
                        y: player.y - randomDistFromCenterY,// * Math.sin(angleRadians),
                        width: size,
                        height: size,
                        speed: 5,
                        timer: 200,
                        maxtimer: 200,
                        color: `rgba(222, 152, 22, ${0.3/((size/50)+1)})`,
                        outline: `rgba(0,0,0,${0.1/((size/50)+1)})`,
                        type: "particle",
                        source: "dune",
                      };
                      particleID++;
                    }
                  }
                  //cover whole screen in darkness for dune
                  ctx.fillStyle = "rgba(0,0,0,.2)"; //make background darker
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                function anglecalc(cx, cy, ex, ey) {
                  var dy = ey - cy ;
                  var dx = cx - ex ;
                  return Math.atan2(dx, dy) * 180 / Math.PI;
                }
                if (player.x && player.y){
                  var rangeX = player.x-(MAP_WIDTH/2);
                  var rangeY = player.y-(MAP_WIDTH/2);
                }
                else{
                  var rangeX = 0;
                  var rangeY = 0;
                }
                crossroadRadians = (crossroadRadians*29 + anglecalc(0, 0, rangeX, rangeY)+90) / 30;   
                if(isNaN(crossroadRadians)) {
                  crossroadRadians = anglecalc(0, 0, rangeX, rangeY)+90; // not really radians but ok
                }

                if (gamemode == "crossroads") {
                  //spawn random particles if in crossroads
                  if (spawncrossroadsparticle == "yes"){
                    var choosing = Math.floor((Math.random() * 2)/clientFovMultiplier); //choose if particle spawn
                    if (choosing <= 0) {
                      //spawn a particle

                      let angleRadians = crossroadRadians+ ((-30 + Math.floor(Math.random() * 60)));
                      var size = 50*(Math.floor(Math.random() * 3) + 1)-25;
                      var randomDistFromCenterX = (Math.floor(Math.random() * canvas.width+size) - (canvas.width+size)/2)*clientFovMultiplier;
                      var randomDistFromCenterY = (Math.floor(Math.random() * canvas.height+size) - (canvas.height+size)/2)*clientFovMultiplier;
                      radparticles[particleID] = {
                        angle: angleRadians * Math.PI / 180,
                        x: player.x + randomDistFromCenterX,// * Math.cos(angleRadians),
                        y: player.y - randomDistFromCenterY,// * Math.sin(angleRadians),
                        width: size,
                        height: size,
                        speed: 25,
                        timer: 100,
                        maxtimer: 100,
                        color: `rgba(152, 152, 152, ${0.3})`,
                        outline: `rgba(0,0,0,${0.1})`,
                        type: "particle",
                        source: "crossroads",
                      };
                      particleID++;
                    }
                  }
                }

                if (prevShakeYN == "yes" || slightshake == "yes") {
                  ctx.restore();
                }

                if (gamemode == "crossroads") {
                  //draw the darkness for crossroads
                  //the rectangle (entire screen)
                  hctx.fillStyle = "rgba(0,0,0,.7)";
                  hctx.fillRect(0,0,hcanvas.width,hcanvas.height)
                  
                  if (barrelsDarkness.length == 0){//no barrels
                    barrelsDarkness.push(0);//circle tourchlight
                  }
                
                  hctx.save();
                  hctx.translate(hcanvas.width/2, hcanvas.height/2);//bottom left of screen
                  hctx.scale(1,resizeDiffY/resizeDiffX);
                  hctx.translate(-hcanvas.width/2, -hcanvas.height/2);//translate back after scaling
                  hctx.globalCompositeOperation='destination-out';//'erase' the darkness
                  //let circleWidth = player.width * 4 + 50;
                  let circleWidth = player.width * 6;
                  //let barrelCorner = 25;//radius of rounded corner
                  let barrelCorner = player.width;//radius of rounded corner
                  hctx.beginPath();
                  hctx.save();
                  hctx.translate(canvas.width / 2, canvas.height / 2);
                  let playerAngle = clientAngle;
                  if (player.autorotate == "yes" || player.fastautorotate == "yes"){
                    playerAngle = player.angle;
                  }
                  hctx.rotate(playerAngle - (90 * Math.PI) / 180);
                
                  let holeInArc = 0.15 * Math.PI;//angle towards edge of torchlight, same value as the value used to arc (code above this line)
                  let radius = circleWidth+crDarknessSize;
                  //calculate the endpoint of the arc around the player
                  let torchlightHeightDefault = circleWidth/4*3+crDarknessSize;//size of torchlight
                  let torchlightWidthAngle = 10/180*Math.PI;//angle of torchlight
                  let endx;
                  let endy;
                  let extraamount = player.width/25*4.2;//if there is a spike at the corner of the barrel, change this value
                
                  function drawBarrelDarkness(angle,prevAngle){
                    if (prevAngle == 0){
                      prevAngle = 2 * Math.PI;
                    }
                    hctx.arc(0, 0, circleWidth+crDarknessSize, prevAngle-holeInArc, angle+holeInArc, true); //draw an incomplete circle (circle around the tank)
                
                    //the torchlight
                    
                    hctx.save();
                    hctx.rotate(angle);
                    endx = Math.cos(holeInArc) * radius;
                    endy = Math.sin(holeInArc) * radius;
                    endx += Math.cos(torchlightWidthAngle) * torchlightHeightDefault;
                    endy += Math.sin(torchlightWidthAngle) * torchlightHeightDefault;
                    hctx.lineTo(endx, endy);
                    //rounded corner of barrel
                    hctx.arc(endx-barrelCorner, endy-barrelCorner-extraamount, barrelCorner, 0.5 * Math.PI, 0, true); //-2 cuz barrel is slanted line
                    //line furthest from player
                    endx = Math.cos(-holeInArc) * radius;
                    endy = Math.sin(-holeInArc) * radius;
                    endx += Math.cos(-torchlightWidthAngle) * torchlightHeightDefault;
                    endy += Math.sin(-torchlightWidthAngle) * torchlightHeightDefault;
                    hctx.lineTo(endx, endy);
                  //rounded corner of barrel
                    hctx.arc(endx-barrelCorner, endy+barrelCorner+extraamount, barrelCorner, 2 * Math.PI, 1.5 * Math.PI, true); //27 instead of 25 cuz barrel is slanted line
                    //line back player towards
                    endx = Math.cos(-holeInArc) * radius;
                    endy = Math.sin(-holeInArc) * radius;
                    hctx.lineTo(endx, endy);
                    hctx.restore();
                    
                  }
                
                  for (var i = 0; i < barrelsDarkness.length; i++) {
                      let thisAngle = barrelsDarkness[i];
                      let previousAngle = barrelsDarkness[i-1]
                      if (i == 0){
                        previousAngle = barrelsDarkness[barrelsDarkness.length-1]
                      }
                      let barrelHeight = correspondingBarrelHeight[thisAngle]*player.width
                      torchlightHeightDefault = circleWidth/4*3/45*barrelHeight+crDarknessSize;
                      drawBarrelDarkness(thisAngle*Math.PI/180, previousAngle*Math.PI/180)
                  }
                
                  hctx.closePath();
                  hctx.restore();
                
                  hctx.fillStyle = "white";//make a hole in the darkness
                  hctx.fill();
                  hctx.restore();
                  
                  //create the second inner circle
                  circleWidth = player.width * 4;
                  barrelCorner = player.width/2;//radius of rounded corner
                  hctx.globalCompositeOperation='source-over';
                  hctx.fillStyle = "rgba(0,0,0,.4)";
                  hctx.fillRect(0,0,hcanvas.width,hcanvas.height)
                
                  hctx.save();
                  hctx.translate(hcanvas.width/2, hcanvas.height/2);//bottom left of screen
                  hctx.scale(1,resizeDiffY/resizeDiffX);
                  hctx.translate(-hcanvas.width/2, -hcanvas.height/2);//translate back after scaling
                  hctx.globalCompositeOperation='destination-out';//'erase' the darkness
                  hctx.beginPath();
                  hctx.save();
                  hctx.translate(canvas.width / 2, canvas.height / 2);
                  playerAngle = clientAngle;
                  if (player.autorotate == "yes" || player.fastautorotate == "yes"){
                    playerAngle = player.angle;
                  }
                  hctx.rotate(playerAngle - (90 * Math.PI) / 180);
                  
                  //the torchlight
                  holeInArc = 0.1 * Math.PI;
                  radius = circleWidth+crDarknessSize;
                  extraamount /= 2;//if there is a spike at the corner of the barrel, change this value
                
                  for (var i = 0; i < barrelsDarkness.length; i++) {
                      let thisAngle = barrelsDarkness[i];
                      let previousAngle = barrelsDarkness[i-1]
                      if (i == 0){
                        previousAngle = barrelsDarkness[barrelsDarkness.length-1]
                      }
                      let barrelHeight = correspondingBarrelHeight[thisAngle]*player.width
                      torchlightHeightDefault = (circleWidth + player.width*2)/4*3/45*barrelHeight+crDarknessSize;
                      drawBarrelDarkness(thisAngle*Math.PI/180, previousAngle*Math.PI/180)
                  }
                  
                  hctx.closePath();
                  hctx.restore();
                  hctx.fillStyle = "white";
                  hctx.fill();
                  
                  if (darknessGrowth == "yes"){
                    crDarknessSize+=0.2;
                    if (crDarknessSize >= 50){
                      darknessGrowth = "no";
                    }
                  }
                  else{
                    crDarknessSize-=0.2;
                    if (crDarknessSize <= 0){
                      darknessGrowth = "yes";
                    }
                  }
                
                  hctx.restore();
                  hctx.globalCompositeOperation='source-over';
                }

                if (mobile == "yes") {
                  //mobile joystick controls
                  hctx.fillStyle = "rgba(69,69,69,.5)";
                  let resizeDiffX = 1/window.innerWidth*hcanvas.width;//prevent squashed HUD on different sized screens
                  let resizeDiffY = 1/window.innerHeight*hcanvas.height;
                  hctx.save();
                  hctx.translate(hcanvas.width / 2 + joystick1.xFromCenter,hcanvas.height / 2 + joystick1.yFromCenter);
                  hctx.scale(1,resizeDiffY/resizeDiffX);
                  
                  //first joystick
                  hctx.beginPath();
                  hctx.arc(0, 0, joystick1.size, 0, 2 * Math.PI);
                  hctx.fill();
                  
                  hctx.restore();
                  hctx.save();
                  hctx.translate(hcanvas.width / 2 + joystick2.xFromCenter,hcanvas.height / 2 + joystick2.yFromCenter);
                  hctx.scale(1,resizeDiffY/resizeDiffX);
                  
                  //second joystick
                  hctx.beginPath();
                  hctx.arc(0, 0, joystick2.size, 0, 2 * Math.PI);
                  hctx.fill();
                  
                  hctx.restore();
                  //circle at thumb when using joystick
                  hctx.fillStyle = "rgba(0,0,0,.5)";
                  if (touches[0].state!="no"){
                    //calculate position on joystick
                    
                    //get angle of touch from joystick
                    //position of touch
                    let ex = touches[0].xpos/window.innerWidth*hcanvas.width;
                    let ey = touches[0].ypos/window.innerHeight*hcanvas.height;
                    //position of joystick
                    let cx;
                    let cy;
                    let radius;
                    if (touches[0].state=="moving"){
                      cx = hcanvas.width / 2 + joystick1.xFromCenter;
                      cy = hcanvas.height / 2 + joystick1.yFromCenter;
                      radius = joystick1.size;
                    }
                    else{
                      cx = hcanvas.width / 2 + joystick2.xFromCenter;
                      cy = hcanvas.height / 2 + joystick2.yFromCenter;
                      radius = joystick2.size;
                    }
                    let dy = ey - cy;
                    let dx = ex - cx;
                    let theta = -Math.atan2(dy, dx) + 90/180*Math.PI;
                    
                    dx = radius * Math.sin(theta) + cx;
                    dy = radius * Math.cos(theta) + cy;
                    
                    hctx.save();
                    hctx.translate(cx,cy);
                    hctx.scale(1,resizeDiffY/resizeDiffX);
                    
                    hctx.beginPath();
                    hctx.arc(dx - cx,dy - cy,joystick2.size/2,0,2 * Math.PI);
                    hctx.fill();
                    
                    hctx.restore();
                  }
                  if (touches[1].state!="no"){
                    //calculate position on joystick
                    
                    //get angle of touch from joystick
                    //position of touch
                    let ex = touches[1].xpos/window.innerWidth*hcanvas.width;
                    let ey = touches[1].ypos/window.innerHeight*hcanvas.height;
                    //position of joystick
                    let cx;
                    let cy;
                    let radius;
                    if (touches[1].state=="moving"){
                      cx = hcanvas.width / 2 + joystick1.xFromCenter;
                      cy = hcanvas.height / 2 + joystick1.yFromCenter;
                      radius = joystick1.size;
                    }
                    else{
                      cx = hcanvas.width / 2 + joystick2.xFromCenter;
                      cy = hcanvas.height / 2 + joystick2.yFromCenter;
                      radius = joystick2.size;
                    }
                    let dy = ey - cy;
                    let dx = ex - cx;
                    let theta = -Math.atan2(dy, dx) + 90/180*Math.PI;
                    
                    dx = radius * Math.sin(theta) + cx;
                    dy = radius * Math.cos(theta) + cy;
                    
                    hctx.save();
                    hctx.translate(cx,cy);
                    hctx.scale(1,resizeDiffY/resizeDiffX);
                    
                    hctx.beginPath();
                    hctx.arc(dx - cx,dy - cy,joystick2.size/2,0,2 * Math.PI);
                    hctx.fill();
                    
                    hctx.restore();
                  }
                }

      //note: ctx requires /clientFovMultiplier, but hctx does not because the canvas size does not change
      //drawing upgrade buttons
      function buttondraw(buttonNumber,possibleupgrades) {
        if ((ignorebuttonw.ignore == "no" || buttonNumber>7) && (ignorebuttonb.ignore == "no" || buttonNumber<=7)){//if not ignore
        let thisbutton = upgradeButtons[buttonNumber];

        let tankButtonName = "Error";
          if (buttonNumber == 1 || buttonNumber == 8) {
            tankButtonName = possibleupgrades[0];
          } else if (buttonNumber == 2 || buttonNumber == 9) {
            tankButtonName = possibleupgrades[1];
          } else if (buttonNumber == 3 || buttonNumber == 10) {
            tankButtonName = possibleupgrades[2];
          } else if (buttonNumber == 4 || buttonNumber == 11) {
            tankButtonName = possibleupgrades[3];
          } else if (buttonNumber == 5 || buttonNumber == 12) {
            tankButtonName = possibleupgrades[4];
          } else if (buttonNumber == 6 || buttonNumber == 13) {
            tankButtonName = possibleupgrades[5];
          } else if (buttonNumber == 7 || buttonNumber == 14) {
            tankButtonName = possibleupgrades[6];
          }

        if (thisbutton.hover == "yes") {
          if (thisbutton.brightness < 50) {
            //increase brightness when hovering over upgrade button
            thisbutton.brightness += 10*deltaTime;
          } else {
            thisbutton.brightness = 50;
          }
          if (
            thisbutton.width < thisbutton.animatedwidth
          ) {
            let amountAdd = thisbutton.animatedwidth - thisbutton.width;
            if (amountAdd >= 0.05){//if not too near to the end width
              amountAdd /= 3;//button enlarges faster before decreasing in speed
            }
            thisbutton.width += amountAdd*deltaTime;
          } else {
            thisbutton.width = thisbutton.animatedwidth;
          }
        } else {
          if (thisbutton.brightness > 0) {
            //decrease brightness when hovering over upgrade button
            thisbutton.brightness -= 10*deltaTime;
          } else {
            thisbutton.brightness = 0;
          }
          if (thisbutton.width > thisbutton.defaultwidth) {
            let amountAdd = thisbutton.width - thisbutton.defaultwidth;
            if (amountAdd >= 0.05){//if not too near to the end width
              amountAdd /= 3;//button enlarges faster before decreasing in speed
            }
            thisbutton.width -= amountAdd*deltaTime;
          } else {
            thisbutton.width = thisbutton.defaultwidth;
          }
        }
        //check if button is animating
        if (buttonNumber <= 7){//upgrade buttons on right side of screen
          if (thisbutton.x > thisbutton.endx) {
            thisbutton.x -= (thisbutton.x - thisbutton.endx)/10*deltaTime; //animating the button with a speed of distStillNeedToMove/10
          }
          else if ((thisbutton.x-thisbutton.endx)<1) {
            thisbutton.x = thisbutton.endx; //if distance between current position and actual position is less than 1
          }
          else if (thisbutton.x < thisbutton.endx) {
            thisbutton.x = thisbutton.endx;//might be reason why body upgrade animation isnt working?
            //thisbutton.x += (thisbutton.endx - thisbutton.x)/10;
          }
        }
        else{//upgrade buttons on left side of screen
          if (thisbutton.x < thisbutton.endx) {
            thisbutton.x += (thisbutton.endx - thisbutton.x)/10*deltaTime; //animating the button with a speed of distStillNeedToMove/10
          }
          else if ((thisbutton.endx-thisbutton.x)<1) {
            thisbutton.x = thisbutton.endx; //if distance between current position and actual position is less than 1
          }
          else if (thisbutton.x > thisbutton.endx) {
            thisbutton.x = thisbutton.endx;//might be reason why body upgrade animation isnt working?
            //thisbutton.x += (thisbutton.endx - thisbutton.x)/10;
          }
        }
        hctx.strokeStyle = "black";
          //change color based on brightness
          let splitRGB = thisbutton.color.split(",");
          let red = Number(splitRGB[0]) + thisbutton.brightness;
          let blue = Number(splitRGB[1]) + thisbutton.brightness;
          let green = Number(splitRGB[2]) + thisbutton.brightness;
          hctx.fillStyle = "rgb(" + red + "," + blue + "," + green + ")";
        hctx.lineWidth = 5;
        //draw button
        var w = thisbutton.width;
        var h = thisbutton.width;
        var r = 7;
          var r2 = r;//radius of bottom part of dark area
        var x = thisbutton.x - thisbutton.width/2;
        var y = thisbutton.y - thisbutton.width/2;
        hctx.beginPath();
        hctx.moveTo(x + r, y);
        hctx.arcTo(x + w, y, x + w, y + h, r);
        hctx.arcTo(x + w, y + h, x, y + h, r);
        hctx.arcTo(x, y + h, x, y, r);
        hctx.arcTo(x, y, x + w, y, r);
        hctx.closePath();
        hctx.fill();
        hctx.stroke();
          //draw dark area
          splitRGB = thisbutton.darkcolor.split(",");
          red = Number(splitRGB[0]) + thisbutton.brightness;
          blue = Number(splitRGB[1]) + thisbutton.brightness;
          green = Number(splitRGB[2]) + thisbutton.brightness;
          hctx.fillStyle = "rgb(" + red + "," + blue + "," + green + ")";

          var w = thisbutton.width - hctx.lineWidth;
        var h = thisbutton.width/2 - hctx.lineWidth/2;
        var r = 0;//top of dark area dont have radius
        var x = thisbutton.x - thisbutton.width/2 + hctx.lineWidth/2;
        var y = thisbutton.y;
        hctx.beginPath();
        hctx.moveTo(x + r, y);
        hctx.arcTo(x + w, y, x + w, y + h, r);
          r = r2;//actual radius
        hctx.arcTo(x + w, y + h, x, y + h, r);
        hctx.arcTo(x, y + h, x, y, r);
          r = 0;//top of dark area dont have radius
        hctx.arcTo(x, y, x + w, y, r);
        hctx.closePath();
        hctx.fill();
        //end of drawing button rectangles
        
        let playerSize = 25; //DONT CHANGE THIS
        let playerX = thisbutton.x;
        let playerY = thisbutton.y;
        hctx.save();
        hctx.translate(playerX, playerY);
        hctx.rotate(tankRotate * Math.PI / 180);
        var widthIncrease = thisbutton.width / thisbutton.defaultwidth;
        hctx.scale(0.8 * widthIncrease, 0.8 * widthIncrease); //change the size of tanks inside the button, 1 refers to the size of tank when spawning
        hctx.lineWidth = 5;

        if (buttonNumber > 7){
          drawFakePlayer(tankButtonName,0,0,playerSize,0,playerBodyCol,playerBodyOutline,"body")
        }
        else{
          drawFakePlayer(tankButtonName,0,0,playerSize,0,playerBodyCol,playerBodyOutline,"weapon")
        }
        
        hctx.restore(); //restore coordinates to saved

        //write names of tanks
        hctx.fillStyle = "white";
        hctx.strokeStyle = "black";
        hctx.lineWidth = 8;
        var widthIncrease = thisbutton.width / thisbutton.defaultwidth;
        hctx.font = "700 " + 15 * widthIncrease + "px Roboto";
        hctx.textAlign = "center";
        tankButtonName = tankButtonName.charAt(0).toUpperCase() + tankButtonName.slice(1);//make first letter of tank name uppercase
          hctx.lineJoin = "miter";
          hctx.miterLimit = 2;
        hctx.strokeText(
          tankButtonName,
          thisbutton.x,
          thisbutton.y + thisbutton.width/2 - 10
        );
        hctx.fillText(
          tankButtonName,
          thisbutton.x,
          thisbutton.y + thisbutton.width/2 - 10
        );
        hctx.lineWidth = 6;
        }
      } //end of function

      //IF ADD A TANK OR CHANGE UPGRADES, REMEMBER TO UPDATE UPGRADE TREE BELOW THESE CODE
      //note: try not to use the seventh button
      
      function drawIgnoreButton(nextbuttonnumber,type){
        if (nextbuttonnumber == 7 || nextbuttonnumber == 6 || nextbuttonnumber == 5){
          nextbuttonnumber = 4;
        }
        else if (nextbuttonnumber == 2 || nextbuttonnumber == 3 || nextbuttonnumber == 4){
          nextbuttonnumber = 1;
        }
        else if (nextbuttonnumber == 8){
          nextbuttonnumber = 7;
        }
        else if (nextbuttonnumber == 9 || nextbuttonnumber == 10 || nextbuttonnumber == 11){
          nextbuttonnumber = 8;
        }
        else if (nextbuttonnumber == 13 || nextbuttonnumber == 12 || nextbuttonnumber == 14){
          nextbuttonnumber = 11;
        }
        else if (nextbuttonnumber == 15){
          nextbuttonnumber = 14;
        }
        let thisbutton = upgradeButtons[nextbuttonnumber];
        if (type == "weapon"){
          var ignorebutton = ignorebuttonw;
        }
        else{
          var ignorebutton = ignorebuttonb;
        }
        if (ignorebutton.hover == 'yes'){
          if (ignorebutton.brightness < 50) {
            ignorebutton.brightness += 10*deltaTime;
          } else {
            ignorebutton.brightness = 50;
          }
          if (
            ignorebutton.width < ignorebutton.animatedwidth
          ) {
            let amountAdd = ignorebutton.animatedwidth - ignorebutton.width;
            if (amountAdd >= 0.05){//if not too near to the end width
              amountAdd /= 3;//button enlarges faster before decreasing in speed
            }
            ignorebutton.width += amountAdd*deltaTime;
          } else {
            ignorebutton.width = ignorebutton.animatedwidth;
          }
        }
        else{
          if (ignorebutton.brightness > 0) {
            ignorebutton.brightness -= 10*deltaTime;
          } else {
            ignorebutton.brightness = 0;
          }
          if (
            ignorebutton.width > ignorebutton.defaultwidth
          ) {
            let amountAdd = ignorebutton.width - ignorebutton.defaultwidth;
            if (amountAdd >= 0.05){//if not too near to the end width
              amountAdd /= 3;//button enlarges faster before decreasing in speed
            }
            ignorebutton.width -= amountAdd*deltaTime;
          } else {
            ignorebutton.width = ignorebutton.defaultwidth;
          }
        }
        var w = ignorebutton.width;
        var h = ignorebutton.height * ignorebutton.width / ignorebutton.defaultwidth;
        var originalh = h;
        var r = 7;
          var r2 = r;//radius of bottom part of dark area
        var x = thisbutton.x - ignorebutton.width/2;
        var y = thisbutton.y - ignorebutton.width/2 - 55 - (ignorebutton.height - originalh)/2;
        ignorebutton.x = x;
        ignorebutton.y = y;
        hctx.lineWidth = 5;
        //change color based on brightness
          let color = "173,173,173"
          let splitRGB = color.split(",");
          let red = Number(splitRGB[0]) + ignorebutton.brightness;
          let blue = Number(splitRGB[1]) + ignorebutton.brightness;
          let green = Number(splitRGB[2]) + ignorebutton.brightness;
          hctx.fillStyle = "rgb(" + red + "," + blue + "," + green + ")";
        hctx.beginPath();
        hctx.moveTo(x + r, y);
        hctx.arcTo(x + w, y, x + w, y + h, r);
        hctx.arcTo(x + w, y + h, x, y + h, r);
        hctx.arcTo(x, y + h, x, y, r);
        hctx.arcTo(x, y, x + w, y, r);
        hctx.closePath();
        hctx.fill();
        hctx.stroke();
        //draw dark area
          color = "143,143,143";
          splitRGB = color.split(",");
          red = Number(splitRGB[0]) + ignorebutton.brightness;
          blue = Number(splitRGB[1]) + ignorebutton.brightness;
          green = Number(splitRGB[2]) + ignorebutton.brightness;
          hctx.fillStyle = "rgb(" + red + "," + blue + "," + green + ")";
        var w = ignorebutton.width - hctx.lineWidth;
        var h = h/2 - hctx.lineWidth/2;
        var r = 0;//top of dark area dont have radius
        var x = thisbutton.x - ignorebutton.width/2 + hctx.lineWidth/2;
        var y = thisbutton.y - ignorebutton.width/2 + originalh/2 - 55 - (ignorebutton.height - originalh)/2;
        hctx.beginPath();
        hctx.moveTo(x + r, y);
        hctx.arcTo(x + w, y, x + w, y + h, r);
          r = r2;//actual radius
        hctx.arcTo(x + w, y + h, x, y + h, r);
        hctx.arcTo(x, y + h, x, y, r);
          r = 0;//top of dark area dont have radius
        hctx.arcTo(x, y, x + w, y, r);
        hctx.closePath();
        hctx.fill();
        hctx.fillStyle = "white";
        hctx.strokeStyle = "black";
        hctx.lineWidth = 9;
        var widthIncrease = ignorebutton.width / ignorebutton.defaultwidth;
        hctx.font = "900 " + 19 * widthIncrease + "px Roboto";
        hctx.miterLimit = 2;
        hctx.textAlign = "center";
        hctx.strokeText(
          "IGNORE",
          thisbutton.x,
          y + 19 * widthIncrease/2 - 3
        );
        hctx.fillText(
          "IGNORE",
          thisbutton.x,
          y + 19 * widthIncrease/2 - 3
        );
      }
      
      //scale button
      hctx.save();
      hctx.translate(0, hcanvas.height);//bottom left of screen
      hctx.scale(1,resizeDiffY/resizeDiffX);
      hctx.translate(-0, -hcanvas.height);//translate back after scaling
      tankRotate += 1.5*deltaTime;

      //Weapon upgrades
      if (player.tankType){//prevent error at the start of the game
        let upgrades = weaponupgrades[player.tankType].upgradeTo;//array of possible upgrades
        if ((player.level >= 0 && player.tankTypeLevel < 0)
        ||(player.level >= 15 && player.tankTypeLevel < 15)
        ||(player.level >= 30 && player.tankTypeLevel < 30)
        ||(player.level >= 45 && player.tankTypeLevel < 45)
        ||(gamemode == "sanctuary" && player.level >= 60 && player.tankTypeLevel < 60)
        ||(gamemode == "sanctuary" && player.level >= 70 && player.tankTypeLevel < 70)) { //if player can upgrade but havent
          for (let i = 1; i < 1+upgrades.length; i++) {
            buttondraw(i, upgrades);
          }
          maxnumberofbuttons = upgrades.length;
        }
        else{//cannot upgrade
          for (let i = 1; i < 8; i++) {
            upgradeButtons[i].x = upgradeButtons[i].startx; //reset position of all upgrade buttons for the next animation
          }
        }
      }

      if(openedUI != "yes") {
        let textToWrite = "";
        if (player.tankTypeLevel < 15) {
          textToWrite = "Next upgrade at lvl 15";
        } else if (player.tankTypeLevel < 30) {
          textToWrite = "Next upgrade at lvl 30";
        } else if (player.tankTypeLevel < 45) {
          textToWrite = "Next upgrade at lvl 45";
        } else if (player.tankTypeLevel < 60) {
          textToWrite = "Upgrade to an eternal at lvl 60";
        } else if (player.tankTypeLevel < 70) {
          textToWrite = "Next upgrade at lvl 70";
        } else {
          textToWrite = "No more upgrades";
        }
        
          hctx.fillStyle = "black";
          hctx.font = "700 20px Roboto";
          hctx.textAlign = "center";
          hctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
          //draw rect
          var textWidth = hctx.measureText(textToWrite).width; //get width of text
          var xpadding = 25;
          var ypadding = 7;
          let w = textWidth + xpadding * 2;
          let h = 20 + ypadding * 2;
          let r = h / 2; //radius is one third of height
          let x = hcanvas.width - w - 30 - 180 - (skillpointspos/1.95);
          let y = hcanvas.height - h - 10;
          hctx.save();
          hctx.translate(x+w/2, y+h/2);
          x = -w/2;
          y = -h/2;
          hctxroundRectangleFill(x,y,r,w,h);
          hctx.fillStyle = "white";
          hctx.fillText(textToWrite, 0, 7.5);
          hctx.lineJoin = "miter"; //change it back
          hctx.restore();
      }
      
      if (ignorebuttonw.ignore == "no"){//if not ignore
        drawIgnoreButton(maxnumberofbuttons + 1,"weapon")
      }
      else{
        let maxplayertanklvl = -1;
        if (player.level >= 70){
          maxplayertanklvl = 70;
        }
        else if (player.level >= 60){
          maxplayertanklvl = 60;
        }
        else if (player.level >= 45){
          maxplayertanklvl = 45;
        }
        else if (player.level >= 30){
          maxplayertanklvl = 30;
        }
        else if (player.level >= 15){
          maxplayertanklvl = 15;
        }
        else if (player.level >= 0){
          maxplayertanklvl = 0;
        }
        if (maxplayertanklvl > levelwhenignorew){//can upgrade to something that previously couldnt
          ignorebuttonw.ignore = "no";
        }
      }
      if (ignorebuttonb.ignore == "no"){//if not ignore
        drawIgnoreButton(maxnumberofbuttonsb + 1,"body")
      }
      else{
        let maxplayertanklvl = -1;
        if (player.level >= 70){
          maxplayertanklvl = 70;
        }
        else if (player.level >= 60){
          maxplayertanklvl = 60;
        }
        else if (player.level >= 45){
          maxplayertanklvl = 45;
        }
        else if (player.level >= 30){
          maxplayertanklvl = 30;
        }
        else if (player.level >= 15){
          maxplayertanklvl = 15;
        }
        else if (player.level >= 0){
          maxplayertanklvl = 0;
        }
        if (maxplayertanklvl > levelwhenignoreb){//can upgrade to something that previously couldnt
          ignorebuttonb.ignore = "no";
        }
      }

      //body upgrades
      //note: try not to use the last button
      if (player.bodyType){//prevent error at the start of the game
        let upgrades = bodyupgrades[player.bodyType].upgradeTo;//array of possible upgrades
        if ((player.level >= 0 && player.bodyTypeLevel < 0)
        ||(player.level >= 15 && player.bodyTypeLevel < 15)
        ||(player.level >= 30 && player.bodyTypeLevel < 30)
        ||(player.level >= 45 && player.bodyTypeLevel < 45)
        ||(gamemode == "sanctuary" && player.level >= 60 && player.bodyTypeLevel < 60)
        ||(gamemode == "sanctuary" && player.level >= 70 && player.bodyTypeLevel < 70)) { //if player can upgrade but havent
          for (let i = 8; i < 8+upgrades.length; i++) {
            buttondraw(i, upgrades);
          }
          maxnumberofbuttonsb = 7+upgrades.length;
        }
        else{//cannot upgrade
          for (let i = 8; i < 15; i++) {
            upgradeButtons[i].x = upgradeButtons[i].startx; //reset position of all upgrade buttons for the next animation
          }
        }
      }
      
      hctx.restore();//restore from scaling for different screen sizes
      hctx.textAlign = "center";

      updateUpgradeTrees(player);//DRAW THE UPGRADE TREES AND UPDATE ANGLES

      //drawing score progress bar at bottom of screen
      //use barScore instead of actual player's score to animate the score
      if (player.score > barScore) {
        barScore += Math.round((player.score - barScore) / 15);
        if (Math.round((player.score - barScore) / 15) < 1) {
          //if score increment is too small
          barScore = player.score;
        }
      } else {
        barScore = player.score; //neccessary when player respawns and have score lower than previously
      }

      const type = player.team != "eternal" ? "tank" : "celestial";
      const currentLvl = convertXPtoLevel(barScore,type);//type is tank of celestial
      let totalXPinLvl = XPneededInCurrentLevel(currentLvl,type);
      let XPinCurrentLvl = barScore - minimumXPtoReachLevel(currentLvl,type);


      function drawBar(w,borderw,coloredw,barcolor,h,x,y){//y is 52.5//coloredw would be the blue bar
        let innerW = w - borderw;//width of colored part
        let r = h / 2;
        let newx = - w/2 - x;
        let newy = - h/2 - y;
        hctx.fillStyle = "black";
        hctxroundRectangleFill(newx,newy,r,w,h);
        h-=borderw;
        w = coloredw;
        if (w < h) {
          w = h;
        }
        newx = - innerW/2 - x;
        newy = - h/2 - y;
        if (r > w / 2) {
          r = w / 2;
        } else {
          r = h / 2;
        }
        hctx.fillStyle = barcolor;
        hctxroundRectangleFill(newx,newy,r,w,h);
      }

      let teamcolor;
      if (player.team == "none") {
        teamcolor = bodyColors.blue.col;
      } else if (bodyColors.hasOwnProperty(player.team)) {
        teamcolor = bodyColors[player.team].col;
      }
      let leader = players[Object.keys(players)[0]].score; //person with most score on leaderboard
      let w = 298;//total width
      let bottomy = 52.5;//dist from bottom
      if (settingsList.showhealthbarHUD === true){//if health bar settings turned on, widths are diff
        w = 250;
        bottomy = 82.5;
      }
      let widthOfBlackBorder = 10;//total width of border top and bottom (each is half of this value)
      let coloredWidth = 0;
      if (barScore > 0) {
        coloredWidth = ((w - widthOfBlackBorder) / leader) * barScore;
      }
      hctx.save();
      hctx.translate(hcanvas.width/2, hcanvas.height);
      hctx.scale(1, resizeDiffY/resizeDiffX);
      drawBar(w,widthOfBlackBorder,coloredWidth,teamcolor,25,0,bottomy)

      let healthPercentage;
      if (settingsList.showhealthbarHUD === true){//draw health bar
        w = 320;
        bottomy = 52.5;
        healthPercentage = Math.round((player.health / player.maxhealth * 100)*10)/10;//*10 and /10 to round to 1 decimal place
        coloredWidth = ((w - widthOfBlackBorder) / player.maxhealth) * player.health;
        drawBar(w,widthOfBlackBorder,coloredWidth,teamcolor,25,0,bottomy)
      }
      
      coloredWidth = 0;
      if (barScore > 0) {
        coloredWidth = ((w - widthOfBlackBorder) / totalXPinLvl) * XPinCurrentLvl;
      }
      drawBar(398,widthOfBlackBorder,coloredWidth,teamcolor,30,0,21)
      
      totalXPinLvl = abbreviateScore(totalXPinLvl);
      XPinCurrentLvl = abbreviateScore(Math.round(XPinCurrentLvl));
      const abbreviatedXP = abbreviateScore(barScore);

      hctx.fillStyle = "white";
      hctx.strokeStyle = "black";
      hctx.font = "700 18px Roboto";
      hctx.lineWidth = 5;
      hctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
      hctx.textAlign = "center";
      let y = -47.5;
      if (settingsList.showhealthbarHUD === true){
        hctx.strokeText("Health: " + healthPercentage + "%", 0, y);
        hctx.fillText("Health: " + healthPercentage + "%", 0, y);
        y = -77.5;
      }
      hctx.strokeText("Score: " + abbreviatedXP, 0, y);
      hctx.fillText("Score: " + abbreviatedXP, 0, y);
      hctx.font = "900 22px Roboto";
      hctx.strokeText(XPinCurrentLvl + " / " + totalXPinLvl, 0, -13);
      hctx.fillText(XPinCurrentLvl + " / " + totalXPinLvl, 0, -13);
      hctx.font = "700 18px Roboto";
      hctx.lineWidth = 9;
      hctx.miterLimit = 2;//prevent spikes, alternative method instead of linejoin round
      hctx.lineJoin = "miter";
      let weapontank = player.tankType;
      let bodytank = player.bodyType;
      if (weapontank && bodytank){
        weapontank = weapontank.charAt(0).toUpperCase() + weapontank.slice(1);//make first letter of tank name uppercase
        bodytank = bodytank.charAt(0).toUpperCase() + bodytank.slice(1);//make first letter of tank name uppercase
      }
      else{
        weapontank = "";
        bodytank = "";
      }
      y = -75;
      if (settingsList.showhealthbarHUD === true){
        y = -105;
      }
      hctx.strokeText("Level " + currentLvl + " " + weapontank + "-" + bodytank, 0, y);
      hctx.fillText("Level " + currentLvl + " " + weapontank + "-" + bodytank, 0, y);
      hctx.font = "900 52px Roboto";
      y = -102.5;
      if (settingsList.showhealthbarHUD === true){
        y = -132.5;
      }
      hctx.strokeText(player.name, 0, y);
      hctx.fillText(player.name, 0, y);
      hctx.restore();

      //drawing minimap
      if (openedUI=="no"){//in tank editor, only draw when editor is closed
        if (gamemode != "crossroads" && gamemode != "cavern") {
          //dont draw anything on minimap for crossroads and cavern
          let mmX = 10;
          let mmY = 10;
          let mmSize = 150;
          hctx.save();
          hctx.scale(1,resizeDiffY/resizeDiffX);//ensure that minimap is proportional and not squashed
          //hctx.scale(resizeDiffX,resizeDiffY);

          //draw the map area
          //hctx.fillStyle = "rgba(128,128,128,.5)";
          hctx.fillStyle = "rgba(189,189,189,.5)";
          hctx.strokeStyle = "rgb(90,90,90)";
          hctx.lineWidth = 5;

          hctx.fillRect(mmX, mmY, mmSize, mmSize);//MINIMAP

          if (gamemode == "2 Teams") {//draw team base
            var baseSize = 1500;
            let firstColor = teamColors[0];
            //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
            if (firstColor == "red"){
              hctx.fillStyle = "#dbbfc0";
            }
            else if (firstColor == "green"){
              hctx.fillStyle = "#acd0bd";
            }
            else if (firstColor == "blue"){
              hctx.fillStyle = "#acc8d0";
            }
            else if (firstColor == "purple"){
              hctx.fillStyle = "#c0b3c9";
            }
            hctx.fillRect(mmX, mmY, baseSize / MAP_WIDTH * mmSize, mmSize);
            firstColor = teamColors[1];
            //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
            if (firstColor == "red"){
              hctx.fillStyle = "#dbbfc0";
            }
            else if (firstColor == "green"){
              hctx.fillStyle = "#acd0bd";
            }
            else if (firstColor == "blue"){
              hctx.fillStyle = "#acc8d0";
            }
            else if (firstColor == "purple"){
              hctx.fillStyle = "#c0b3c9";
            }
            hctx.fillRect(mmX + mmSize - baseSize / MAP_WIDTH * mmSize, mmY, baseSize / MAP_WIDTH * mmSize, mmSize);
          }

          if (gamemode == "4 Teams") {//draw team base
            var baseSize = 1500;
            let firstColor = teamColors[0];
            //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
            if (firstColor == "red"){
              hctx.fillStyle = "#dbbfc0";
            }
            else if (firstColor == "green"){
              hctx.fillStyle = "#acd0bd";
            }
            else if (firstColor == "blue"){
              hctx.fillStyle = "#acc8d0";
            }
            else if (firstColor == "purple"){
              hctx.fillStyle = "#c0b3c9";
            }
            hctx.fillRect(mmX, mmY, baseSize / MAP_WIDTH * mmSize,  baseSize / MAP_WIDTH * mmSize);
            firstColor = teamColors[1];
            //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
            if (firstColor == "red"){
              hctx.fillStyle = "#dbbfc0";
            }
            else if (firstColor == "green"){
              hctx.fillStyle = "#acd0bd";
            }
            else if (firstColor == "blue"){
              hctx.fillStyle = "#acc8d0";
            }
            else if (firstColor == "purple"){
              hctx.fillStyle = "#c0b3c9";
            }
            hctx.fillRect(mmX + mmSize - baseSize / MAP_WIDTH * mmSize, mmY, baseSize / MAP_WIDTH * mmSize, baseSize / MAP_WIDTH * mmSize);
            firstColor = teamColors[2];
            //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
            if (firstColor == "red"){
              hctx.fillStyle = "#dbbfc0";
            }
            else if (firstColor == "green"){
              hctx.fillStyle = "#acd0bd";
            }
            else if (firstColor == "blue"){
              hctx.fillStyle = "#acc8d0";
            }
            else if (firstColor == "purple"){
              hctx.fillStyle = "#c0b3c9";
            }
            hctx.fillRect(mmX + mmSize - baseSize / MAP_WIDTH * mmSize, mmY + mmSize - baseSize / MAP_WIDTH * mmSize, baseSize / MAP_WIDTH * mmSize, baseSize / MAP_WIDTH * mmSize);
            firstColor = teamColors[3];
            //NOTE: THESE ARE DIFFERENT COLORS FROM THE BODY COLORS!
            if (firstColor == "red"){
              hctx.fillStyle = "#dbbfc0";
            }
            else if (firstColor == "green"){
              hctx.fillStyle = "#acd0bd";
            }
            else if (firstColor == "blue"){
              hctx.fillStyle = "#acc8d0";
            }
            else if (firstColor == "purple"){
              hctx.fillStyle = "#c0b3c9";
            }
            hctx.fillRect(mmX, mmY + mmSize - baseSize / MAP_WIDTH * mmSize, baseSize / MAP_WIDTH * mmSize, baseSize / MAP_WIDTH * mmSize);
          }

          hctx.strokeRect(mmX, mmY, mmSize, mmSize);//MINIMAP OUTLINE

          if (gamemode == "Tank Editor"){//draw safe zone
            hctx.fillStyle = safeZoneColor;
            hctx.fillRect(mmX + mmSize/2 - safeZone/MAP_WIDTH*mmSize/2, mmY + mmSize/2 - safeZone/MAP_WIDTH*mmSize/2, safeZone/MAP_WIDTH*mmSize, safeZone/MAP_WIDTH*mmSize);
          }


          //player location on minimap
          hctx.fillStyle = "rgb(90,90,90)"; //player always darkgrey triangle on minimap
          hctx.save();
          hctx.translate((player.x / MAP_WIDTH) * mmSize + mmX, (player.y / MAP_WIDTH) * mmSize + mmY);
          hctx.rotate(clientAngle);
          hctx.beginPath();//draw triangle
          let h = 10;
          let w = 7;
          hctx.moveTo(0,-h/2)
          hctx.lineTo(w/2,h/2)
          hctx.lineTo(-w/2,h/2)
          hctx.fill();
          hctx.restore();
          //drawing portals on minimap
          Object.keys(portals).forEach((portalID) => {
            let portal = portals[portalID];
            if (portal.hasOwnProperty("red")) {
              //if portal is radiant
              hctx.fillStyle =
                "rgb(" +
                portal.red +
                ", " +
                portal.green +
                ", " +
                portal.blue +
                ")";
            } else {
              hctx.fillStyle = "rgb(" + portal.color + ")";
            }
            hctx.beginPath();
            hctx.arc(
              (portal.x / MAP_WIDTH) * mmSize + mmX,
              (portal.y / MAP_WIDTH) * mmSize + mmY,
              4,
              0,
              2 * Math.PI
            );
            //5 refers to width of portal on minimap, the size is not based on actual portal size bcause portal would be almost invisible on minimap if the map is big
            hctx.fill();
          });

          hctx.restore();
        }

      //drawing stat points, the stuff that appear on middle left of screen
      hctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
        /*
      var statPointColors = [
        "#9BFF91",
        "#9BFFFF",
        "#8196FF",
        "#6464FF",
        "#9664FF",
        "#C864FF",
        "#FF64FF",
        "#FF6496",
        "#ff6464",
      ]; //list of colors
      */
      var statPointColors = [
        "#768cfc",
        "#fc7676",
        "#38b764",
        "#ffe46b",
        "#768cfc",
        "#fc7676",
        "#38b764",
        "#ffe46b",
      ]; //list of colors
      var darkstatpointcolors = [
        "#3b467e",
        "#7e3b3b",
        "#1c5c32",
        "#726630",
        "#3b467e",
        "#7e3b3b",
        "#1c5c32",
        "#726630",
      ];
      currentStatPoints = player.skillPoints;
      extraPoints = player.unusedPoints;
      var plusbuttonsize = 20;
      function drawStatPoints(
        name,
        distFromTop,
        totalnumberOfPoints,
        pointsRemaining,
        currentpoints
      ) {
        if (currentpoints < 4) {
          var extraX = skillpointspos - 20; //stats on left side of screen
        } else {
          var extraX = hcanvas.width - skillpointspos + 20; //stats on right side of screen
        }
        var w = 17 * totalnumberOfPoints;
        var h = 30;
        var r = h / 2; //radius is one third of height
        var y = distFromTop;
        var x = -w / 2 + extraX;
        w += plusbuttonsize;
        if (currentpoints >= 4) {
          x -= plusbuttonsize;
        }
        //draw max points
        hctx.fillStyle = "rgb(0, 0, 0)";
        hctxroundRectangleFill(x,y,r,w,h);
        //grey points representing points that can be upgraded
          h = 20;
          r = h / 2;
          x += (40 - 30) / 2;
          y += (40 - 30) / 2; //40 is original height, 30 is new height
          if (currentpoints >= 4) {
            x += w;
            x -= (40 - 30);
          }
        //draw current stat points
        if (currentStatPoints[currentpoints] > 0) {
          //draw the lighter colored bar below
          hctx.fillStyle = darkstatpointcolors[currentpoints];
          let statw = 17 * currentStatPoints[currentpoints] - (40 - 30)/totalnumberOfPoints*currentStatPoints[currentpoints];
          if (statw<h){
            h = statw;
            r = h/2;
            y += (20 - h)/2;
          }
          if (currentpoints >= 4) {
            x -= statw;
          }
          hctx.beginPath();
          hctx.moveTo(x + r, y);
          hctx.arcTo(x + statw, y, x + statw, y + h, r);
          hctx.arcTo(x + statw, y + h, x, y + h, r);
          hctx.arcTo(x, y + h, x, y, r);
          hctx.arcTo(x, y, x + statw, y, r);
          hctx.closePath();
          hctx.fill();
          //draw the animated bar above
          hctx.fillStyle = statPointColors[currentpoints];
          if (statw<h){
            h = statw;
            r = h/2;
            y += (20 - h)/2;
          }
          if (currentpoints >= 4) {
            x += statw;//remove old statw
          }
          skillpointsanimation[currentpoints] += (statw - skillpointsanimation[currentpoints])/10*deltaTime;
          statw = skillpointsanimation[currentpoints];
          if (currentpoints >= 4) {
            x -= statw;//add new statw
          }
          hctx.beginPath();
          hctx.moveTo(x + r, y);
          hctx.arcTo(x + statw, y, x + statw, y + h, r);
          hctx.arcTo(x + statw, y + h, x, y + h, r);
          hctx.arcTo(x, y + h, x, y, r);
          hctx.arcTo(x, y, x + statw, y, r);
          hctx.closePath();
          hctx.fill();
        }
        h = 25; //change back to original - 5
        x = -w / 2;
        hctx.font = "900 20px Roboto";
        hctx.fillStyle = "white";
        hctx.strokeStyle = "black";
        hctx.lineWidth = 4;
        hctx.strokeText(
          name,
          x + w / 2 + extraX,
          distFromTop + h / 2 + 8
        );
        hctx.fillText(name, x + w / 2 + extraX, distFromTop + h / 2 + 8);
        //draw the number thingy
        if (currentStatPoints[currentpoints] < totalnumberOfPoints) {
          skillpointsbutton[currentpoints].clickable = "yes";//allow the circular button to be clickable
          hctx.font = "900 16px Roboto";
          if (currentpoints < 4) {
            hctx.strokeText(
              "[" + (currentpoints + 1) + "]",
              x + w + extraX - 30,
              distFromTop + h / 2 + 8
            );
            hctx.fillText(
              "[" + (currentpoints + 1) + "]",
              x + w + extraX - 30,
              distFromTop + h / 2 + 8
            );
          } else {
            hctx.strokeText(
              "[" + (currentpoints + 1) + "]",
              x + extraX + 30,
              distFromTop + h / 2 + 8
            );
            hctx.fillText(
              "[" + (currentpoints + 1) + "]",
              x + extraX + 30,
              distFromTop + h / 2 + 8
            );
          }
        }
          else{
            skillpointsbutton[currentpoints].clickable = "no";
          }
        //draw button
            let extrawidth = 0;
            if (skillpointsbutton[currentpoints].hover == "yes"){
              extrawidth = 2;
            }
          if (currentpoints < 4) {
            if (currentStatPoints[currentpoints] < totalnumberOfPoints) {
              hctx.fillStyle = "white";
            }
            else{
              hctx.fillStyle = "grey";
            }
            hctx.beginPath();
            hctx.arc(17 * totalnumberOfPoints / 2 + extraX + 5, distFromTop + h / 2 + 3, plusbuttonsize/2 + extrawidth, 0, 2 * Math.PI);
            hctx.fill();
            hctx.font = "900 " + (20 + extrawidth) + "px Roboto";
            hctx.fillStyle = "black";
            hctx.fillText(
              "+",
              17 * totalnumberOfPoints / 2 + extraX + 5, distFromTop + h / 2 + 10
            );
          } else {
            if (currentStatPoints[currentpoints] < totalnumberOfPoints) {
              hctx.fillStyle = "white";
            }
            else{
              hctx.fillStyle = "grey";
            }
            hctx.beginPath();
            hctx.arc(-17 * totalnumberOfPoints/2 + extraX - 5, distFromTop + h / 2 + 3, plusbuttonsize/2 + extrawidth, 0, 2 * Math.PI);
            hctx.fill();
            hctx.font = "900 " + (20 + extrawidth) + "px Roboto";
            hctx.fillStyle = "black";
            hctx.fillText(
              "+",
              -17 * totalnumberOfPoints/2 + extraX - 5, distFromTop + h / 2 + 10
            );
          }
      }
      if (extraPoints > 0 || mouseToSkillPoints == "yes") {
        //if there are extra points
        //animate skill points bar when appearing
        skillpointspos += (skillpointsend - skillpointspos) / 5; //speed changes based on amount moved so far. the smaller the number, the faster
        if (skillpointsend - skillpointspos < 1) {
          //if very near end point
          skillpointspos = skillpointsend;
        }
      } else {
        //animate skill points bar when disappearing
        skillpointspos -= (skillpointspos - skillpointsstart) / 5;
        if (skillpointspos - skillpointsstart < 1) {
          //if very near end point
          skillpointspos = skillpointsstart;
        }
      }
      if (
        skillpointspos != skillpointsstart ||
        mouseToSkillPoints == "yes"
      ) {
        //if skill points is supposed to be shown or animating
        hctx.save();
      if(gamemode == "Tank Editor") {//if tank editor
      hctx.translate(60, hcanvas.height);//bottom left of screen + 60px while in tank editor
      } else {
      hctx.translate(0, hcanvas.height);//bottom left of screen
      }
      hctx.scale(1,resizeDiffY/resizeDiffX);
      hctx.translate(-0, -hcanvas.height);//translate back after scaling
        drawStatPoints("Heal", hcanvas.height - 138, 15, 0, 0);
        drawStatPoints("Max Health", hcanvas.height - 105, 15, 0, 1);
        drawStatPoints("Body Damage", hcanvas.height - 72, 15, 0, 2);
        drawStatPoints("Bullet Speed", hcanvas.height - 40, 15, 0, 3);
        hctx.restore();
        hctx.save();
      hctx.translate(hcanvas.width, hcanvas.height);//bottom right of screen
      hctx.scale(1,resizeDiffY/resizeDiffX);
      hctx.translate(-hcanvas.width, -hcanvas.height);//translate back after scaling
        drawStatPoints("Bullet Damage", hcanvas.height - 138, 15, 0, 4);
        drawStatPoints("Weapon Reload", hcanvas.height - 105, 15, 0, 5);
        drawStatPoints("Movement Speed", hcanvas.height - 72, 15, 0, 6);
        drawStatPoints("FoV", hcanvas.height - 40, 15, 0, 7);
        hctx.restore();
        if (extraPoints > 0) {//write the number of extra points
          let width = 20 * 15 /2;//20 is width of each point, 15 is number of skill points
          //var extraFontSize = 0;
//var oldskillpointnumber = 0;
          let fontsize = 33;
          if (extraPoints != oldskillpointnumber){
            extraFontSize++;
            if (extraFontSize > 8){
              extraFontSize = 0;
              oldskillpointnumber = extraPoints;
            }
            let newfont = extraFontSize;
            if (newfont > 4){
              newfont = 8 - newfont;
            }
            fontsize+=newfont;
          }
          hctx.font = "700 "+fontsize+"px Roboto";
          hctx.lineWidth = 10;
          hctx.fillStyle = "white";
        hctx.strokeStyle = "black";
          hctx.lineJoin = "miter";
          //hctx.miterLimit = 2;//prevent text spikes, alternative to linejoin round
          hctx.save();
          hctx.translate(hcanvas.width, hcanvas.height);//bottom right of screen
      hctx.scale(1,resizeDiffY/resizeDiffX);
      hctx.translate(-hcanvas.width, -hcanvas.height);//translate back after scaling
          //x pos doesnt really affect scaling so whatever
          hctx.strokeText(
            extraPoints + "x",
            hcanvas.width - skillpointspos - width - 20,
            hcanvas.height - 15.5 - 40
          );
          hctx.fillText(
            extraPoints + "x",
            hcanvas.width - skillpointspos - width - 20,
            hcanvas.height - 15.5 - 40
          );
          if(gamemode == "Tank Editor") {
          hctx.strokeText(
            "x" + extraPoints,
            skillpointspos + width + 20 + 60,
            hcanvas.height - 15.5
          );
          hctx.fillText(
            "x" + extraPoints,
            skillpointspos + width + 20 + 60,
            hcanvas.height - 15.5
          );
          } else {
          hctx.strokeText(
            "x" + extraPoints,
            skillpointspos + width + 20,
            hcanvas.height - 15.5
          );
          hctx.fillText(
            "x" + extraPoints,
            skillpointspos + width + 20,
            hcanvas.height - 15.5
          );     
          }
          hctx.restore();
        }
      }
      hctx.lineJoin = "miter"; //change back

      //draw leaderboard
      hctx.save();
      hctx.translate(hcanvas.width, 0);//top right of screen
      hctx.scale(1,resizeDiffY/resizeDiffX);
      hctx.translate(-hcanvas.width, 0);//translate back after scaling
      var fromTop = 75;
      hctx.fillStyle = "white";
      hctx.strokeStyle = "black";
      hctx.lineWidth = 8;
      hctx.font = "900 30px Roboto";
      hctx.textAlign = "center";
      hctx.miterLimit = 2;//prevent text spikes, alternative to linejoin round
      hctx.strokeText("LEADERBOARD", hcanvas.width - 130, 40);
      hctx.fillText("LEADERBOARD", hcanvas.width - 130, 40);
      hctx.lineWidth = 3;
      //draw leaderboard on home page canvas so that game canvas redraw in main game loop will not cause leaderboard to flash
      var playerWithMostScore = -1;
      let numberOfPlayersOnLB = Object.keys(players).length;
      let maxSpaceAvailable = 240;
      let spaceBetween = 60/numberOfPlayersOnLB;
      let outlineThickness = 5;
      let textoutline = 3;
      let tankWidth = 8;//the width of tank drawn beside leaderboard bar
        if (numberOfPlayersOnLB<=5){
          spaceBetween = 60/4;
          outlineThickness = 7;
          textoutline = 5;
        }
      let maxPlayers = 8;
      for (const id in players) {
        //draw score bar background
        let w = 240;
        var maxw = w - outlineThickness;
        let h;
        //maxw is for colored bar
        if (numberOfPlayersOnLB>=5){
          h = maxSpaceAvailable/numberOfPlayersOnLB - spaceBetween;
        }
        else{
          h = maxSpaceAvailable/5 - spaceBetween;
        }
        tankWidth = h/2 * 0.64;
        //var h = 25;
        let r = h / 2;
        let x = hcanvas.width - 130 - w / 2; //if change this, remember to change the value of this above the code for drawing colored bar
        var actualX = x - 15;//doesnt change, 15 refer to distance of displayed tank from leaderboard
        let y = fromTop - h / 2;
        var actualY = fromTop;//doesnt change
        hctx.fillStyle = "black";
        hctxroundRectangleFill(x,y,r,w,h);

        //draw score bar based on first player on leaderboard, which is always drawn as 200px, IF the player's score is not 0
        //the variable w will be NaN if any of their score is 0, because 0 cannot divide by anything. Note that the code below did not check for the leader being zero if the other player is not zero bcause the leader have a higher or same score than the other players
        x = hcanvas.width - 130 - w / 2 + outlineThickness/2;
        if (playerWithMostScore == -1) {
          //if this is the first player in the loop
          w = maxw;
          playerWithMostScore = players[id].score;
        } else {
          w = (players[id].score / playerWithMostScore) * maxw;
        }
        if (w < 0) {
          //prevent error
          w = 0;
        }
        h -= outlineThickness;
        r = h / 2;
        y = fromTop - h / 2;
        if (r * 2 > w) {
          w = h;
        }
        //draw colored bar
        //hctx.fillStyle = players[id].color;
        //if not developer, color property is team, else if developer, color is color
        let drawncolor = hctx.fillStyle;
        let drawnoutline = hctx.strokeStyle;
        if (players[id].color == "none") {
          if (id==playerstring){
            drawncolor = bodyColors.blue.col;
            drawnoutline = bodyColors.blue.outline;
          }
          else{
            drawncolor = bodyColors.red.col;
            drawnoutline = bodyColors.red.outline;
          }
        } else if (bodyColors.hasOwnProperty(players[id].color)) {
          drawncolor = bodyColors[players[id].color].col;
          drawnoutline = bodyColors[players[id].color].outline;
        }
        else{//a developer
          drawncolor = players[id].color;
          drawnoutline = players[id].color;
        }

        hctx.fillStyle = drawncolor;
        hctxroundRectangleFill(x,y,r,w,h);
        //ABBREVIATE SCORE, e.g. 6000 -> 6k
        //player's score is not abbreviated because need to do calculations using the number, and server might get laggy if it need to abbreviate everyone's score, so abbreviating score is done in client side code
        var newValue = players[id].score;
        if (players[id].score >= 1000) {
          var suffixes = ["", "k", "m", "b", "t"];
          var suffixNum = Math.floor(("" + players[id].score).length / 3);
          var shortValue = "";
          for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat(
              (suffixNum != 0
                ? players[id].score / Math.pow(1000, suffixNum)
                : players[id].score
              ).toPrecision(precision)
            );
            var dotLessShortValue = (shortValue + "").replace(
              /[^a-zA-Z 0-9]+/g,
              ""
            );
            if (dotLessShortValue.length <= 2) {
              break;
            }
          }
          if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
          newValue = shortValue + suffixes[suffixNum];
        }
        //write player name and score
        hctx.fillStyle = "white";
        if (numberOfPlayersOnLB>=5){
          var textSize = 17 + 1* (8 - numberOfPlayersOnLB);
        }
        else{
          var textSize = 17 + 1* (8 - 5);
        }
        hctx.font = "900 "+textSize+"px Roboto";
        hctx.textAlign = "center";
        hctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
        hctx.lineWidth = textoutline;
        hctx.strokeText(
          players[id].name + " - " + newValue,
          hcanvas.width - 130,
          fromTop + 6
        ); //additional 6 to center word properly
        hctx.fillText(
          players[id].name + " - " + newValue,
          hcanvas.width - 130,
          fromTop + 6
        );
        //draw player's tank
        if (players[id].tank&&players[id].body){
          if (players[id].tank!="0"){
            hctx.lineWidth = 2;
            drawFakePlayer(players[id].tank,actualX,actualY,tankWidth,lbAngle*Math.PI/180,drawncolor,drawnoutline,"weapon")
            drawFakePlayer(players[id].body,actualX,actualY,tankWidth,lbAngle*Math.PI/180,drawncolor,drawnoutline,"body")
          }
        }
        hctx.lineJoin = "miter"; //change it back
        if (numberOfPlayersOnLB>=5){//if 5 or more players on leaerboard, the bars fill up the whole space
          fromTop += (maxSpaceAvailable/numberOfPlayersOnLB);//space between bars changes based on number of players
        }
        else{
          fromTop += (maxSpaceAvailable/5);
        }
        //fromTop += 32.5; //height plus space between bars
      }
        hctx.restore();
        lbAngle+=0.4;//make leaderboard tanks rotate
      }

      if (teleportingTransition == "yes"){//if player is teleporting between servers
        //draw the transition
        if (teleportingcount<1){//transparncy animation
          hctx.globalAlpha = teleportingcount;
        }
        if (
          teleportingcount >= 0 &&
          teleportingcount <= 1.8
        ) {//oval appearing
          hctx.fillStyle = "black";
          hctx.beginPath();
          hctx.ellipse(
            hcanvas.width * (teleportingcount-1.1),
            hcanvas.height / 2,
            hcanvas.width / 1.4,
            hcanvas.height,
            0,
            0,
            Math.PI * 2
          ); //draw oval
          hctx.fill();
        }
        else{//full black screen
          hctx.fillStyle = "black";
          hctx.fillRect(0, 0, hcanvas.width, hcanvas.height);
        }
        hctx.fillStyle = "white";
        hctx.font = "900 90px Roboto";
        hctx.strokeStyle = "black";
        hctx.lineWidth = 4;
        hctx.textAlign = "center";
        hctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
        if (teleportingLocation=="Free For All" || teleportingLocation=="2 Teams" || teleportingLocation=="4 Teams"){
          if (oldteleportingLocation == "crossroads"){
            hctx.strokeText("Returning from The Crossroads...", hcanvas.width/2, hcanvas.height/2);
            hctx.fillText("Returning from The Crossroads...", hcanvas.width/2, hcanvas.height/2);
          }
          else if (oldteleportingLocation == "cavern"){
            hctx.strokeText("Returning from The Cavern...", hcanvas.width/2, hcanvas.height/2);
            hctx.fillText("Returning from The Cavern...", hcanvas.width/2, hcanvas.height/2);
          }
          else if (oldteleportingLocation == "dune"){
            hctx.strokeText("Returning from The Dunes...", hcanvas.width/2, hcanvas.height/2);
            hctx.fillText("Returning from The Dunes...", hcanvas.width/2, hcanvas.height/2);
          }
          else{
            hctx.strokeText("Exiting The "+oldteleportingLocation+"...", hcanvas.width/2, hcanvas.height/2);
            hctx.fillText("Exiting The "+oldteleportingLocation+"...", hcanvas.width/2, hcanvas.height/2);
          }
        }
        else if (teleportingLocation=="sanc"){
          hctx.strokeText("Ascending to The Sanctuary...", hcanvas.width/2, hcanvas.height/2);
          hctx.fillText("Ascending to The Sanctuary...", hcanvas.width/2, hcanvas.height/2);
        }
        else if (teleportingLocation=="dune"){
          hctx.strokeText("Launching to The Dunes...", hcanvas.width/2, hcanvas.height/2);
          hctx.fillText("Launching to The Dunes...", hcanvas.width/2, hcanvas.height/2);
        }
        else if (teleportingLocation=="cr"){
          hctx.strokeText("Descending into The Crossroads...", hcanvas.width/2, hcanvas.height/2);
          hctx.fillText("Descending into The Crossroads...", hcanvas.width/2, hcanvas.height/2);
        }
        else if (teleportingLocation=="cavern"){
          hctx.strokeText("Entering The Cavern...", hcanvas.width/2, hcanvas.height/2);
          hctx.fillText("Entering The Cavern...", hcanvas.width/2, hcanvas.height/2);
        }
        else{
          hctx.strokeText("Launching to " + teleportingLocation, hcanvas.width/2, hcanvas.height/2);
          hctx.fillText("Launching to " + teleportingLocation, hcanvas.width/2, hcanvas.height/2);
        }
        hctx.textAlign = "left";
        hctx.lineJoin = "miter";
        hctx.globalAlpha = 1.0;
        teleportingcount+=0.1;
      }
      else if(teleportingcount>2){//black oval disappear
        if (teleportingcount>=3.3){
          teleportingcount = 0;
        }
        if (
          teleportingcount >= 2.1 &&
          teleportingcount < 3.2
        ) {//oval appearing
          hctx.fillStyle = "black";
          hctx.beginPath();
          hctx.ellipse(
            hcanvas.width * (teleportingcount-1.1),
            hcanvas.height / 2,
            hcanvas.width / 1.5,
            hcanvas.height,
            0,
            0,
            Math.PI * 2
          ); //draw oval
          hctx.fill();
          teleportingcount+=0.1;
        }
      }

      if (debugState == "open" && openedUI=="no") {
        //update debug
        let pingdiv = document.getElementById("ping");
        if (latency < 250) {
          pingdiv.style.color = "white";
        } else if (latency < 350) {
          pingdiv.style.color = "orange";
        } else if (latency < 600) {
          pingdiv.style.color = "red";
        } else {
          pingdiv.style.color = "#800000";
        }
        pingdiv.textContent = "Ping: " + latency + "ms";
        let servertick = document.getElementById("servertick");
        if (serverCodeTime < 40) {
          servertick.style.color = "white";
        } else if (serverCodeTime < 50) {
          servertick.style.color = "orange";
        } else {
          servertick.style.color = "red";
        }
        servertick.textContent = "Server Tick Time: " + serverCodeTime + "ms";

        if (clientTick > 5){
          clientTickDiv.style.color = "yellow";
        }
        else if (clientTick > 15){
          clientTickDiv.style.color = "red";
        }
        else{
          clientTickDiv.style.color = "white";
        }
        clientTickDiv.textContent = "Client Tick Time: " + Math.round(clientTick * 10) / 10 + "ms";//change to 1 decimal place
        clientTick = performance.now() - starting;
        document.getElementById("playercount").textContent = "Player Count: " + playerCount;
        document.getElementById("globalplayercount").textContent = "Global Player Count: " + globalPlayerCount;
        document.getElementById("dimension").textContent = "Dimension: " + gamemode;

        //shownBandwidth
        if (shownBandwidth < 15000) {
          bandwidthDiv.style.color = "white";
        } else if (shownBandwidth < 25000) {
          bandwidthDiv.style.color = "yellow";
        } else if (shownBandwidth < 50000) {
          bandwidthDiv.style.color = "red";
        } else {
          bandwidthDiv.style.color = "#800000";
        }
        let newbandwidth = shownBandwidth / 1000; //__k bytes
        newbandwidth = Math.round(newbandwidth * 100) / 100;//2 decimal place
        bandwidthDiv.textContent = "Bandwidth: " + newbandwidth + "kb/s";

        var numberOfObjectsDrawn = 0;
        for (const type in objects) {
          for (const item in objects[type]) {
            numberOfObjectsDrawn++;
          }
        }
        document.getElementById("drawnEntities").textContent = "Drawn Entities: " + numberOfObjectsDrawn;
      }
    }
  //}, 30); //check every 30ms //dont use setinterval anymore
        requestAnimationFrame(screenDrawLoop);//chage this to request interval after figuring out how to call it and stop it
  }

//requestInterval(screenDrawLoop,10);//number refers to delay between redraws, e.g. 16 = 60fps

  //auto fill in previous name into text input field
  if (localStorage.prevname) {
    nameInput.value = localStorage.prevname;
  }
/*
  //sandbox
  //listen for enter presses to change tank properties
  var inputfield0 = document.getElementById("tank-name");
  var inputfield1 = document.getElementById("tank-rad");
  var inputfield2 = document.getElementById("tank-xp");
  var inputfield3 = document.getElementById("tank-size");
  var inputfield4 = document.getElementById("weapon-name");
  var inputfield5 = document.getElementById("weapon-fov");
  var inputfield6 = document.getElementById("body-name");
  var inputfield7 = document.getElementById("body-sides");
  var inputfield8 = document.getElementById("body-health");
  var inputfield9 = document.getElementById("body-regen");
  var inputfield10 = document.getElementById("body-regen-time");
  var inputfield11 = document.getElementById("body-damage");
  var inputfield12 = document.getElementById("body-speed");
  var inputfield13 = document.getElementById("team-select");
  var inputfield15 = document.getElementById("turret-base");
  function sendSanboxValue(value,id){
    var packet = JSON.stringify(["sandbox", value, id]);
    socket.send(packet)
  }
  function sendBarrelEdit(value,type,id){
    if (value === undefined || value === null || (typeof value === "number" && isNaN(value)) || value == "" || value == "NaN" || value == "undefined" || value == "null"){
      createNotif("This property value is not allowed: "+value,"darkorange",3000)
    }
    else{
      var packet = JSON.stringify(["BarEdit", value, type, id]);
      socket.send(packet)
    }
  }
  function sendAssetEdit(value,type,id){
    if (value === undefined || value === null || (typeof value === "number" && isNaN(value)) || value == "" || value == "NaN" || value == "undefined" || value == "null"){
      createNotif("This property value is not allowed: "+value,"darkorange",3000)
    }
    else{
      var packet = JSON.stringify(["AssEdit", value, type, id]);
      socket.send(packet)
    }
  }
  function sendBbEdit(value,type,id){
    if (value === undefined || value === null || (typeof value === "number" && isNaN(value)) || value == "" || value == "NaN" || value == "undefined" || value == "null"){
      createNotif("This property value is not allowed: "+value,"darkorange",3000)
    }
    else{
      var packet = JSON.stringify(["BbEdit", value, type, id]);
      socket.send(packet)
    }
  }
  inputfield0.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {//pressed enter inside input field
        sendSanboxValue(inputfield0.value,0)
      }
  });
  $( "#"+inputfield0.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield0.value,0)
  });
  inputfield1.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield1.value,1)
      }
  });
$( "#"+inputfield1.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield1.value,1)
  });
  inputfield2.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield2.value,2)
      }
  });
$( "#"+inputfield2.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield2.value,2)
  });
  inputfield3.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          if(inputfield3.value >= 0) {
          sendSanboxValue(inputfield3.value,3)
          }
      }
  });
$( "#"+inputfield3.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield3.value,3)
  });
  inputfield4.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield4.value,4)
      }
  });
$( "#"+inputfield4.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield4.value,4)
  });
  inputfield5.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield5.value,5)
      }
  });
$( "#"+inputfield5.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield5.value,5)
  });
  inputfield6.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield6.value,6)
      }
  });
$( "#"+inputfield6.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield6.value,6)
  });
  inputfield7.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield7.value,7)
      }
  });
$( "#"+inputfield7.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield7.value,7)
  });
  inputfield8.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield8.value,8)
      }
  });
$( "#"+inputfield8.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield8.value,8)
  });
  inputfield9.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield9.value,9)
      }
  });
$( "#"+inputfield9.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield9.value,9)
  });
  inputfield10.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield10.value,10)
      }
  });
$( "#"+inputfield10.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield10.value,10)
  });
  inputfield11.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield11.value,11)
      }
  });
$( "#"+inputfield11.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield11.value,11)
  });
  inputfield12.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield12.value,12)
      }
  });
$( "#"+inputfield12.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield12.value,12)
  });
   inputfield13.onchange = (event) => {//dropdown select
     sendSanboxValue(event.target.value,13)
   }
  inputfield15.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          sendSanboxValue(inputfield15.value,15)
      }
  });
$( "#"+inputfield15.id ).blur(function() {//clicked outside the input field after input field was selected
    sendSanboxValue(inputfield15.value,15)
  });
   //inside barrel editor
  $('#barrelUI').on('keyup', 'input', function(event) {
    if (event.key === "Enter") {//someone press enter on an input field in barrel editor
      var barrelID = $(event.target).parent().attr('id');
      var inputType = $(event.target).attr('placeholder');
      var value = event.target.value;
      sendBarrelEdit(value,inputType,barrelID)
    }
  });
$('#barrelUI').on('focusout', 'input', function(event) {
      var barrelID = $(event.target).parent().attr('id');
      var inputType = $(event.target).attr('placeholder');
      var value = event.target.value;
      sendBarrelEdit(value,inputType,barrelID)
  });
  $('#barrelUI').on('change', 'select', function(event) {//dropdown select for choosing barrel type
        var barrelID = $(event.target).parent().attr('id');
        var inputType = $(event.target).attr('name');//differentiate between different dropdowns, but not neccessary for now cuz there's only one dropdown
        var selection = event.target.value;
    sendBarrelEdit(selection,inputType,barrelID)
    if (selection =="drone"){//changed barrel type to drone
      //need to add one more
      var htmlObject = document.createElement('div');
      var divid = 'dc'+barrelID;
      var divid2 = 'dc2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="droneLimit" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="3"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Max Drone Count</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      //remove trap stuff
      try{
      document.getElementById("tr"+barrelID).remove();
      document.getElementById("tr2"+barrelID).remove();
      }
      catch(err){}
      //remove minion stuff
      try{
      document.getElementById("mc"+barrelID).remove();
      document.getElementById("mc2"+barrelID).remove();
        document.getElementById("md"+barrelID).remove();
      document.getElementById("md2"+barrelID).remove();
        document.getElementById("minion"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("ma"+barrelID).remove();
      document.getElementById("ma2"+barrelID).remove();
      document.getElementById("mha"+barrelID).remove();
      document.getElementById("mha2"+barrelID).remove();
      document.getElementById("mine"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("bk"+barrelID).remove();
      document.getElementById("bk2"+barrelID).remove();
      document.getElementById("bg"+barrelID).remove();
      document.getElementById("bg2"+barrelID).remove();
      }
      catch(err){}
    }
    else if (selection =="trap"){//changed barrel type to trap
      //need to add one more
      var htmlObject = document.createElement('div');
      var divid = 'tr'+barrelID;
      var divid2 = 'tr2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="trapDistBeforeStop" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="10"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Trap Distance</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      //remove drone stuff
      try{
      document.getElementById("dc"+barrelID).remove();
      document.getElementById("dc2"+barrelID).remove();
      }
      catch(err){}
      //remove minion stuff
      try{
      document.getElementById("mc"+barrelID).remove();
      document.getElementById("mc2"+barrelID).remove();
        document.getElementById("md"+barrelID).remove();
      document.getElementById("md2"+barrelID).remove();
        document.getElementById("minion"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("ma"+barrelID).remove();
      document.getElementById("ma2"+barrelID).remove();
      document.getElementById("mha"+barrelID).remove();
      document.getElementById("mha2"+barrelID).remove();
      document.getElementById("mine"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("bk"+barrelID).remove();
      document.getElementById("bk2"+barrelID).remove();
      document.getElementById("bg"+barrelID).remove();
      document.getElementById("bg2"+barrelID).remove();
      }
      catch(err){}
    }
    else if (selection == "bullet"){
      var htmlObject = document.createElement('div');
      var divid = 'bk'+barrelID;
      var divid2 = 'bk2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="knockback" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="no"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Knockback (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'bg'+barrelID;
      var divid2 = 'bg2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="growth" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="no"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet growth (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      //remove drone stuff when chnge barrel to bllet
      try{
      document.getElementById("dc"+barrelID).remove();
      document.getElementById("dc2"+barrelID).remove();
      }
      catch(err){}
      //remove trap stuff
      try{
      document.getElementById("tr"+barrelID).remove();
      document.getElementById("tr2"+barrelID).remove();
      }
      catch(err){}
      //remove minion stuff
      try{
      document.getElementById("mc"+barrelID).remove();
      document.getElementById("mc2"+barrelID).remove();
        document.getElementById("md"+barrelID).remove();
      document.getElementById("md2"+barrelID).remove();
        document.getElementById("minion"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("ma"+barrelID).remove();
      document.getElementById("ma2"+barrelID).remove();
      document.getElementById("mha"+barrelID).remove();
      document.getElementById("mha2"+barrelID).remove();
      document.getElementById("mine"+barrelID).remove();
      }
      catch(err){}
    }
    else if (selection == "minion"){
      $('*[placeholder="Timer"]').attr("value", "1000");
      var htmlObject = document.createElement('div');
      var divid = 'mc'+barrelID;
      var divid2 = 'mc2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="droneLimit" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="5"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Max Minion Count</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'md'+barrelID;
      var divid2 = 'md2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="minDist" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="200"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Minimum Distance</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
       var htmlObject = document.createElement('div');
      var divid = 'minion'+barrelID;
      
      //MINION EDITING UI
      
      var textnode = '<div id='+divid+'>'+
      '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Minion Barrel Positioning</div>'+
  '<input autocomplete="off" placeholder="Minion Barrel Width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="15">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Width</div>'+
  '<input autocomplete="off" placeholder="Minion Barrel Height" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="21">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Length</div>'+
  '<input autocomplete="off" placeholder="Minion Additional Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Angle (WIP)</div>'+
  '<input autocomplete="off" placeholder="Minion x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset</div>'+
  '<input autocomplete="off" placeholder="Minion y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Minion Barrel Attributes</div>'+
  '<input autocomplete="off" placeholder="Minion Reload" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="10">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Shoot Interval</div>'+
  '<input autocomplete="off" placeholder="Minion Health" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="20">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Health</div>'+
  '<input autocomplete="off" placeholder="Minion Damage" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0.1">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Damage</div>'+
  '<input autocomplete="off" placeholder="Minion Penetration" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="2">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Penetration</div>'+
  '<input autocomplete="off" placeholder="Minion Timer" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="30">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Lifetime</div>'+
  '<input autocomplete="off" placeholder="Minion Speed" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="20">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Speed</div>'+
  '<input autocomplete="off" placeholder="Minion Recoil" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0.5">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Recoil Amount (WIP)</div>'+
  '<input autocomplete="off" placeholder="Minion Delay" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Barrel Delay</div>'+
        '</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      
      try{
      document.getElementById("dc"+barrelID).remove();
      document.getElementById("dc2"+barrelID).remove();
      }
      catch(err){}
      //remove trap stuff
      try{
      document.getElementById("tr"+barrelID).remove();
      document.getElementById("tr2"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("ma"+barrelID).remove();
      document.getElementById("ma2"+barrelID).remove();
      document.getElementById("mha"+barrelID).remove();
      document.getElementById("mha2"+barrelID).remove();
      document.getElementById("mine"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("bk"+barrelID).remove();
      document.getElementById("bk2"+barrelID).remove();
      document.getElementById("bg"+barrelID).remove();
      document.getElementById("bg2"+barrelID).remove();
      }
      catch(err){}
    }
    else if (selection == "mine"){
      var htmlObject = document.createElement('div');
      var divid = 'tr'+barrelID;
      var divid2 = 'tr2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="trapDistBeforeStop" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="10"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Trap Distance</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'ma'+barrelID;
      var divid2 = 'ma2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="AIdetectRange" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="450"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Detection Range</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'mha'+barrelID;
      var divid2 = 'mha2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="haveAI" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="yes"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Mine AI (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
       var htmlObject = document.createElement('div');
      var divid = 'mine'+barrelID;
      
      //MINE EDITING UI
      
      var textnode = '<div id='+divid+'>'+
  '<select name="Mine type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines</option> <option value="minion">Spawner</option><option value="nothing">Nothing (WIP)</option></select>' +
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;"> Mine Barrel Type (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Mine Barrel Positioning</div>'+
  '<input autocomplete="off" placeholder="Mine Barrel Width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="5">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Width</div>'+
  '<input autocomplete="off" placeholder="Mine Barrel Height" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="12.5">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Length</div>'+
  '<input autocomplete="off" placeholder="Mine Additional Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Angle (WIP)</div>'+
  '<input autocomplete="off" placeholder="Mine x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset (WIP)</div>'+
  '<input autocomplete="off" placeholder="Mine y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Mine Barrel Attributes</div>'+
  '<input autocomplete="off" placeholder="Mine Reload" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="15">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Shoot Interval</div>'+
  '<input autocomplete="off" placeholder="Mine Health" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="20">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Health</div>'+
  '<input autocomplete="off" placeholder="Mine Damage" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0.25">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Damage</div>'+
  '<input autocomplete="off" placeholder="Mine Penetration" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="2">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Penetration</div>'+
  '<input autocomplete="off" placeholder="Mine Timer" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="30">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Lifetime</div>'+
  '<input autocomplete="off" placeholder="Mine Speed" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="20">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Speed</div>'+
  '<input autocomplete="off" placeholder="Mine Recoil" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0.5">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Recoil Amount (WIP)</div>'+
  '<input autocomplete="off" placeholder="Mine Delay" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Barrel Delay</div>'+
        '</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      //remove drone stuff
      try{
      document.getElementById("dc"+barrelID).remove();
      document.getElementById("dc2"+barrelID).remove();
      }
      catch(err){}
      //remove minion stuff
      try{
      document.getElementById("mc"+barrelID).remove();
      document.getElementById("mc2"+barrelID).remove();
        document.getElementById("md"+barrelID).remove();
      document.getElementById("md2"+barrelID).remove();
        document.getElementById("minion"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("bk"+barrelID).remove();
      document.getElementById("bk2"+barrelID).remove();
      document.getElementById("bg"+barrelID).remove();
      document.getElementById("bg2"+barrelID).remove();
      }
      catch(err){}
    }
  })

$('#assetUI').on('keyup', 'input', function(event) {
    if (event.key === "Enter") {//someone press enter on an input field in barrel editor
      var barrelID = $(event.target).parent().attr('id');
      var inputType = $(event.target).attr('placeholder');
      var value = event.target.value;
      sendAssetEdit(value,inputType,barrelID)
    }
  });
$('#assetUI').on('focusout', 'input', function(event) {//focusout is blur but bubbles. Doing this applies the blur event listener to all children. (blur triggered when click outside input field)
      var barrelID = $(event.target).parent().attr('id');
      var inputType = $(event.target).attr('placeholder');
      var value = event.target.value;
      sendAssetEdit(value,inputType,barrelID)
  });
  $('#assetUI').on('change', 'select', function(event) {//dropdown select for choosing barrel type
        var barrelID = $(event.target).parent().attr('id');
        var inputType = $(event.target).attr('name');//differentiate between different dropdowns, but not neccessary for now cuz there's only one dropdown
        var selection = event.target.value;
    sendAssetEdit(selection,inputType,barrelID)
  })

$('#bbUI').on('keyup', 'input', function(event) {
    if (event.key === "Enter") {//someone press enter on an input field in barrel editor
      var barrelID = $(event.target).parent().attr('id');
      var inputType = $(event.target).attr('placeholder');
      var value = event.target.value;
      sendBbEdit(value,inputType,barrelID)
    }
  });
$('#bbUI').on('focusout', 'input', function(event) {
      var barrelID = $(event.target).parent().attr('id');
      var inputType = $(event.target).attr('placeholder');
      var value = event.target.value;
      sendBbEdit(value,inputType,barrelID)
  });
  $('#bbUI').on('change', 'select', function(event) {//dropdown select for choosing barrel type
        var barrelID = $(event.target).parent().attr('id');
        var inputType = $(event.target).attr('name');//differentiate between different dropdowns, but not neccessary for now cuz there's only one dropdown
        var selection = event.target.value;
    sendBbEdit(selection,inputType,barrelID)
    if (inputType == "auratype"){//change aura type
      if (selection == "damage"){//change the aura color that is shown in the input field
        $('*[placeholder="auraColor"]').attr("value", "rgba(255,0,0,.15)");
        $('*[placeholder="auraOutline"]').attr("value", "rgba(255,0,0,.15)");
        try{
        document.getElementById("hp"+barrelID).remove();
        document.getElementById("hp2"+barrelID).remove();
        }
        catch(err){}
      }
      else if (selection == "freeze"){
        $('*[placeholder="auraColor"]').attr("value", "rgba(173,216,230,.5)");
        $('*[placeholder="auraOutline"]').attr("value", "rgba(150, 208, 227)");
        try{
        document.getElementById("hp"+barrelID).remove();
        document.getElementById("hp2"+barrelID).remove();
        }
        catch(err){}
      }
      else if (selection == "attraction"){
        $('*[placeholder="auraColor"]').attr("value", "rgba(87, 85, 163, .3)");
        $('*[placeholder="auraOutline"]').attr("value", "rgba(75, 73, 143)");
        try{
        document.getElementById("hp"+barrelID).remove();
        document.getElementById("hp2"+barrelID).remove();
        }
        catch(err){}
      }
      else if (selection == "heal"){
        $('*[placeholder="auraColor"]').attr("value", "rgba(56,183,100,.15)");
        $('*[placeholder="auraOutline"]').attr("value", "rgba(26,153,70,.15)");
        var htmlObject = document.createElement('div');
        var divid = 'hp'+barrelID;
        var divid2 = 'hp2'+barrelID;
        var textnode = '<input id='+divid+' autocomplete="off" placeholder="healPower" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0.6"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura Heal Power</div>';
        htmlObject.innerHTML = textnode;
        htmlObject.setAttribute("id", barrelID);
        document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      }
    }
    if (selection =="drone"){//changed barrel type to drone
      //need to add one more
      var htmlObject = document.createElement('div');
      var divid = 'dc'+barrelID;
      var divid2 = 'dc2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="droneLimit" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="3"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Max Drone Count</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      //remove trap stuff
      try{
      document.getElementById("tr"+barrelID).remove();
      document.getElementById("tr2"+barrelID).remove();
      }
      catch(err){}
      //remove aura stuff
      try{
      document.getElementById("ao"+barrelID).remove();
      document.getElementById("ao2"+barrelID).remove();
        document.getElementById("ac"+barrelID).remove();
      document.getElementById("ac2"+barrelID).remove();
        document.getElementById("as"+barrelID).remove();
      document.getElementById("as2"+barrelID).remove();
        document.getElementById("at"+barrelID).remove();
      document.getElementById("at2"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("hp"+barrelID).remove();
      document.getElementById("hp2"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("bk"+barrelID).remove();
      document.getElementById("bk2"+barrelID).remove();
      document.getElementById("bg"+barrelID).remove();
      document.getElementById("bg2"+barrelID).remove();
      }
      catch(err){}
    }
    else if (selection =="trap"){//changed barrel type to trap
      //need to add one more
      var htmlObject = document.createElement('div');
      var divid = 'tr'+barrelID;
      var divid2 = 'tr2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="trapDistBeforeStop" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="10"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Trap Distance</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      //remove drone stuff
      try{
      document.getElementById("dc"+barrelID).remove();
      document.getElementById("dc2"+barrelID).remove();
      }
      catch(err){}
      //remove aura stuff
      try{
      document.getElementById("ao"+barrelID).remove();
      document.getElementById("ao2"+barrelID).remove();
        document.getElementById("ac"+barrelID).remove();
      document.getElementById("ac2"+barrelID).remove();
        document.getElementById("as"+barrelID).remove();
      document.getElementById("as2"+barrelID).remove();
        document.getElementById("at"+barrelID).remove();
      document.getElementById("at2"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("hp"+barrelID).remove();
      document.getElementById("hp2"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("bk"+barrelID).remove();
      document.getElementById("bk2"+barrelID).remove();
      document.getElementById("bg"+barrelID).remove();
      document.getElementById("bg2"+barrelID).remove();
      }
      catch(err){}
    }
    else if (selection == "bullet"){
      var htmlObject = document.createElement('div');
      var divid = 'bk'+barrelID;
      var divid2 = 'bk2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="knockback" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="no"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Knockback (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'bg'+barrelID;
      var divid2 = 'bg2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="growth" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="no"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet growth (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      //remove drone stuff when chnge barrel to bllet
      try{
      document.getElementById("dc"+barrelID).remove();
      document.getElementById("dc2"+barrelID).remove();
      }
      catch(err){}
      //remove trap stuff
      try{
      document.getElementById("tr"+barrelID).remove();
      document.getElementById("tr2"+barrelID).remove();
      }
      catch(err){}
      //remove aura stuff
      try{
      document.getElementById("ao"+barrelID).remove();
      document.getElementById("ao2"+barrelID).remove();
        document.getElementById("ac"+barrelID).remove();
      document.getElementById("ac2"+barrelID).remove();
        document.getElementById("as"+barrelID).remove();
      document.getElementById("as2"+barrelID).remove();
        document.getElementById("at"+barrelID).remove();
      document.getElementById("at2"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("hp"+barrelID).remove();
      document.getElementById("hp2"+barrelID).remove();
      }
      catch(err){}
    }
    else if (selection == "aura"){
      //changing body barrel to aura will change several barrel properties, so need to change them
      //get the inputs using their placeholders
      $('*[placeholder="Reload"]').attr("value", "1");
      $('*[placeholder="Health"]').attr("value", "1000");
      $('*[placeholder="Damage"]').attr("value", "0.2");
      $('*[placeholder="Penetration"]').attr("value", "0");
      $('*[placeholder="Timer"]').attr("value", "3");
      $('*[placeholder="Speed"]').attr("value", "0");
      var htmlObject = document.createElement('div');
      var divid = 'as'+barrelID;
      var divid2 = 'as2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="auraSize" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="4"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura size</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'ac'+barrelID;
      var divid2 = 'ac2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="auraColor" class="sandboxInput" style="clear:both;position:relative;float:left;" value="rgba(255,0,0,.15)"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura color</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'ao'+barrelID;
      var divid2 = 'ao2'+barrelID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="auraOutline" class="sandboxInput" style="clear:both;position:relative;float:left;" value="rgba(255,0,0,.15)"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura outline</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'at'+barrelID;
      var divid2 = 'at2'+barrelID;
      var textnode = '<select id='+divid+' name="auratype" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="damage">Damage</option><option value="freeze">Freeze</option><option value="attraction">Attraction</option><option value="repulsion">Repulsion</option><option value="heal">Heal</option></select><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura Type</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", barrelID);
      document.getElementById("btn"+barrelID).before(htmlObject);//add before the delete barrel button
      //remove drone stuff when chnge barrel to bllet
      try{
      document.getElementById("dc"+barrelID).remove();
      document.getElementById("dc2"+barrelID).remove();
      }
      catch(err){}
      //remove trap stuff
      try{
      document.getElementById("tr"+barrelID).remove();
      document.getElementById("tr2"+barrelID).remove();
      }
      catch(err){}
      try{
      document.getElementById("bk"+barrelID).remove();
      document.getElementById("bk2"+barrelID).remove();
      document.getElementById("bg"+barrelID).remove();
      document.getElementById("bg2"+barrelID).remove();
      }
      catch(err){}
    }
  })
//});

//change radiant aura size when move slider in settings
var slider = document.getElementById("radiantSizeRange");
var output = document.getElementById("sizevalue");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
};

//for accounts
var accountUsername = document.getElementById("accountUsername");
var accountPassword = document.getElementById("accountPassword");
var accountDesc = document.getElementById("accountDesc");
var logInButton = document.getElementById("logInButton");
var signUp = document.getElementById("signUp");
var logIn = document.getElementById("logIn");
var accountWords = document.getElementById("accountText");
function accountsignup() {
  //for bth sign up and log in
  accountUsername.style.display = "block";
  accountPassword.style.display = "block";
  accountDesc.style.display = "block";
  logInButton.style.display = "block";
  signUp.style.display = "none";
  logIn.style.display = "none";
  if (acctype == "login") {
    if (
      localStorage.getItem("rocketerAccountp") &&
      localStorage.getItem("rocketerAccountu")
    ) {
      const cats = localStorage.getItem("rocketerAccountp");
      const dogs = localStorage.getItem("rocketerAccountu");
      accountUsername.value = dogs;
      accountPassword.value = cats;
    }
  }
}
function providedUsername() {
  var usernameGiven = document.getElementById("accountUsername").value;
  var passwordGiven = document.getElementById("accountPassword").value;
  var descGiven = document.getElementById("accountDesc").value;
  //restrictions
  //if change, remember to change in server code
  if (usernameGiven.length > 15) {
    accountWords.innerHTML = "Username must be less than 15 characters.";
  } else if (passwordGiven.length > 15 || passwordGiven.length < 5) {
    accountWords.innerHTML =
      "Password must be between 5 and 15 characters.";
  } else if (descGiven.length > 50) {
    accountWords.innerHTML =
      "Description must be less than 50 characters.";
  } else {
    accountUsername.style.display = "none";
    accountPassword.style.display = "none";
    accountDesc.style.display = "none";
    logInButton.style.display = "none";
    accountWords.innerHTML = "Waiting for server's reply...";
    canLogIn = "yes"; //cannot send to server here because this part of the code cannot access socket, and the pasrt of the code accessing socket cant access functions
    accusername = usernameGiven;
    accpassword = passwordGiven;
    accdesc = descGiven;
  }
}

//tank editor
//allowing to swap the object
function showHideTankObject(section, id) {
document.querySelector(`#${section}UI > div > #${id}`).classList.toggle("tankObjectHide");
  
  if (document.getElementById(id).style.width != "auto"){
    console.log(document.getElementById(id).style.width)
    document.getElementById(id).style.width = "auto";
    document.getElementById(id).style.padding = "1vw 2vw";
    document.getElementById(id).firstChild.style.fontSize = "1.5vw";
    console.log(document.getElementById(id).firstChild.innerHTML)
    document.getElementById(id).firstChild.innerHTML = document.getElementById(id).firstChild.innerHTML.slice(0, -1) + '▴'; //change the arrow
  }
  else{
    document.getElementById(id).style.width = "30%";
    document.getElementById(id).style.padding = "0.5vw 1vw";
    document.getElementById(id).firstChild.style.fontSize = "1vw";
    document.getElementById(id).firstChild.innerHTML = document.getElementById(id).firstChild.innerHTML.slice(0, -1) + '▾'; //change the arrow
  }
}
//adding a barrel (add a div to the editor)
function addBarrelDiv(first) {
  var htmlObject = document.createElement('div');
  if (first!="yes"){
    var dataidgen = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    dataidgen = dataidgen.split('');
    var specialID  = "";
    for(let i = 0; i < 20; ++i) {
      specialID += dataidgen[Math.floor(Math.random() * dataidgen.length)];
    }
    //var specialID  = Math.random();
  }
  else{//this is the first barrel, which is always barrelOne on the server
    var specialID  = "barrelOne";
  }
  var buttonID = 'btn'+specialID; //note: use 'clear:both;' inside style instead of <br> (doesnt work for relative positioning)
  //overflow auto below is to make div take up space of nested items (s that background-color will work)
  var textnode = '<div id=' + specialID + ' class="sandboxStack tankObjectHide" style="overflow: auto;background-color:rgba(0,0,0,.2);width: 30%;padding: 0.5vw 1vw;border-radius:1vw;margin-top: 20px;">' +
  '<div class="sandboxText" style="font-size: 1vw;clear:both;position:relative;float:left;padding:0.3vw 0.3vw;width:calc(100% - 1vw);cursor: pointer;" onclick="showHideTankObject(\'barrel\', \'' + specialID + '\')">Barrel '+barrelnumberid+' ▾</div>' +
  '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines</option> <option value="minion">Spawner</option><option value="nothing">Nothing (WIP)</option></select>' +
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;"> Barrel Type</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Positioning</div>'+
  '<input autocomplete="off" placeholder="Barrel Width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="25">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Width</div>'+
  '<input autocomplete="off" placeholder="Barrel Height" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="45">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Length</div>'+
  '<input autocomplete="off" placeholder="Additional Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Rotation</div>'+
  '<input autocomplete="off" placeholder="x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset</div>'+
  '<input autocomplete="off" placeholder="y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Attributes</div>'+
  '<input autocomplete="off" placeholder="Reload" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="20">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Shoot Interval</div>'+
  '<input autocomplete="off" placeholder="Health" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="10">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Health</div>'+
  '<input autocomplete="off" placeholder="Damage" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0.5">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Damage</div>'+
  '<input autocomplete="off" placeholder="Penetration" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="2">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Penetration</div>'+
  '<input autocomplete="off" placeholder="Timer" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="50">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Lifetime</div>'+
  '<input autocomplete="off" placeholder="Speed" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="12">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Speed</div>'+
  '<input autocomplete="off" placeholder="Recoil" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="1">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Recoil Amount</div>'+
  '<input autocomplete="off" placeholder="Delay" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Barrel Delay</div>'+
  '<button id=' + buttonID + ' class="sandboxButton" style="position: relative;clear:both;float:left;" onclick=delbar(this)>Delete Barrel</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:10vw;" onclick=duplicatebar(this)>Duplicate Barrel</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Forward (WIP)</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Backward (WIP)</button></div>';
  htmlObject.innerHTML = textnode;
  document.getElementById("barrelUI").appendChild(htmlObject);
  document.getElementById("barrels").innerHTML = "Barrels (" + $("#barrelUI").children().length + ")";//update barrel count on button
  barrelnumberid++;
  
  var htmlObject = document.createElement('div');
      var divid = 'bk'+specialID;
      var divid2 = 'bk2'+specialID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="knockback" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="no"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Knockback (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", specialID);
      document.getElementById("btn"+specialID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'bg'+specialID;
      var divid2 = 'bg2'+specialID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="growth" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="no"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet growth (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", specialID);
      document.getElementById("btn"+specialID).before(htmlObject);//add before the delete barrel button
  if (gamemode=="Tank Editor"){//prevent error which causes editor to not be able to open
    var packet = JSON.stringify(["barrel",specialID]);
    socket.send(packet)
  }
}

function addAssetDiv() {
  var htmlObject = document.createElement('div');
  var dataidgen = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    dataidgen = dataidgen.split('');
    var specialID  = "";
    for(let i = 0; i < 20; ++i) {
      specialID += dataidgen[Math.floor(Math.random() * dataidgen.length)];
    }
  var buttonID = 'btn'+specialID;
  
  var textnode = '<div id=' + specialID + ' class="sandboxStack tankObjectHide" style="overflow: auto;background-color:rgba(0,0,0,.2);width: 30%;padding: 0.5vw 1vw;border-radius:1vw;margin-top: 20px;">'+
  '<div class="sandboxText" style="font-size: 1vw;clear:both;position:relative;float:left;padding:0.3vw 0.3vw;cursor: pointer;" onclick="showHideTankObject(\'asset\', \'' + specialID + '\')">Asset '+assetnumberid+' ▾</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Positioning</div>'+
  '<select name="position" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="under">Under tank</option><option value="above">Above tank</option></select>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;"> Position</div>'+
  '<input autocomplete="off" placeholder="Relative size" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="1.5">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Relative Size</div>'+
  '<input autocomplete="off" placeholder="Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Rotation</div>'+
  '<input autocomplete="off" placeholder="x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset</div>'+
  '<input autocomplete="off" placeholder="y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Attributes</div>'+
  '<input autocomplete="off" placeholder="Asset sides" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="5">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Sides</div>'+
  '<input autocomplete="off" placeholder="Asset color" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="#5F676C">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Color</div>'+
  '<input autocomplete="off" placeholder="Asset outline" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="#41494E">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Outline</div>'+
  '<input autocomplete="off" placeholder="Outline width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="5">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Outline width</div>'+
  '<button id=' + buttonID + ' class="sandboxButton" style="position: relative;clear:both;float:left;" onclick=delass(this)>Delete Asset</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:10vw;" onclick=duplicateass(this)>Duplicate Asset</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Forward (WIP)</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Backward (WIP)</button></div>';
  htmlObject.innerHTML = textnode;
  document.getElementById("assetUI").appendChild(htmlObject);
  document.getElementById("assets").innerHTML = "Assets (" + $("#assetUI").children().length + ")";//update barrel count on button
  assetnumberid++;
  if (gamemode=="Tank Editor"){//prevent error which causes editor to not be able to open
    var packet = JSON.stringify(["asset",specialID]);
    socket.send(packet)
  }
}
function addBBDiv() {
  var htmlObject = document.createElement('div');
  var dataidgen = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    dataidgen = dataidgen.split('');
    var specialID  = "";
    for(let i = 0; i < 20; ++i) {
      specialID += dataidgen[Math.floor(Math.random() * dataidgen.length)];
    }
  var buttonID = 'btn'+specialID;
  var textnode = '<div id=' + specialID + ' class="sandboxStack tankObjectHide" style="overflow: auto;background-color:rgba(0,0,0,.2);width: 30%;padding: 0.5vw 1vw;border-radius:1vw;margin-top: 20px;">' +
  '<div class="sandboxText" style="font-size: 1vw;clear:both;position:relative;float:left;padding:0.3vw 0.3vw;cursor: pointer;" onclick="showHideTankObject(\'bb\', \'' + specialID + '\')">Gadget '+gadgetnumberid+' ▾</div>' +
  '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines (WIP)</option><option value="aura">Aura</option><option value="minion">Spawner (WIP)</option><option value="nothing">Nothing (WIP)</option></select>' +
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;"> Barrel Type</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Positioning</div>'+
  '<input autocomplete="off" placeholder="Barrel Width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="25">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Width</div>'+
  '<input autocomplete="off" placeholder="Barrel Height" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="45">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Length</div>'+
  '<input autocomplete="off" placeholder="Additional Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Rotation</div>'+
  '<input autocomplete="off" placeholder="x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset</div>'+
  '<input autocomplete="off" placeholder="y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Attributes</div>'+
  '<input autocomplete="off" placeholder="Reload" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="20">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Shoot Interval</div>'+
  '<input autocomplete="off" placeholder="Health" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="10">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Health</div>'+
  '<input autocomplete="off" placeholder="Damage" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0.5">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Damage</div>'+
  '<input autocomplete="off" placeholder="Penetration" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="2">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Penetration</div>'+
  '<input autocomplete="off" placeholder="Timer" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="50">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Lifetime</div>'+
  '<input autocomplete="off" placeholder="Speed" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="12">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Speed</div>'+
  '<input autocomplete="off" placeholder="Recoil" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="1">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Recoil Amount</div>'+
  '<input autocomplete="off" placeholder="Delay" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Barrel Delay</div>'+
  '<button id=' + buttonID + ' class="sandboxButton" style="position: relative;clear:both;float:left;" onclick=delbb(this)>Delete Gadget</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:10vw;" onclick=duplicatebb(this)>Duplicate Gadget</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Forward (WIP)</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Backward (WIP)</button></div>';
  htmlObject.innerHTML = textnode;
  document.getElementById("bbUI").appendChild(htmlObject);
  document.getElementById("turrets").innerHTML = "Gadgets (" + $("#bbUI").children().length + ")";//update barrel count on button
  document.getElementById('turret-base').value = 0.7;//update the turret base size
  gadgetnumberid++;
  
  var htmlObject = document.createElement('div');
      var divid = 'bk'+specialID;
      var divid2 = 'bk2'+specialID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="knockback" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="no"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Knockback (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", specialID);
      document.getElementById("btn"+specialID).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'bg'+specialID;
      var divid2 = 'bg2'+specialID;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="growth" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="no"><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet growth (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", specialID);
      document.getElementById("btn"+specialID).before(htmlObject);//add before the delete barrel button
  if (gamemode=="Tank Editor"){//prevent error which causes editor to not be able to open
    var packet = JSON.stringify(["bodybarrel",specialID]);
    socket.send(packet)
  }
}

//customized adding barrel
//use the below 3 functions only for importing/upgrading tank
//instead of adding default UI, it adds UI based on current properties
function addCustomBarrelDiv(id,barrel) {
  var htmlObject = document.createElement('div');
  let type = barrel.barrelType;
  let barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines</option> <option value="minion">Spawner</option><option value="nothing">Nothing (WIP)</option></select>';
  //add "selected" inside the option which is the current barrel type
  if (type == "bullet"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet" selected>Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines</option> <option value="minion">Spawner</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  else if (type == "drone"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone" selected>Drone</option><option value="trap">Trap</option><option value="mine">Mines</option> <option value="minion">Spawner</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  else if (type == "trap"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap" selected>Trap</option><option value="mine">Mines</option> <option value="minion">Spawner</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  else if (type == "mine"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine" selected>Mines</option> <option value="minion">Spawner</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  else if (type == "minion"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines</option> <option value="minion" selected>Spawner</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  var buttonID = 'btn'+id; //note: use 'clear:both;' inside style instead of <br> (doesnt work for relative positioning)
  //overflow auto below is to make div take up space of nested items (s that background-color will work)
  var textnode = '<div id=' + id + ' class="sandboxStack tankObjectHide" style="overflow: auto;background-color:rgba(0,0,0,.2);width: 30%;padding: 0.5vw 1vw;border-radius:1vw;margin-top: 20px;">' +
  '<div class="sandboxText" style="font-size: 1vw;clear:both;position:relative;float:left;padding:0.3vw 0.3vw;cursor: pointer;" onclick="showHideTankObject(\'barrel\', \'' + id + '\')">Barrel '+barrelnumberid+' ▾</div>' +
  barrelTypeSelect +
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;"> Barrel Type</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Positioning</div>'+
  '<input autocomplete="off" placeholder="Barrel Width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.barrelWidth+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Width</div>'+
  '<input autocomplete="off" placeholder="Barrel Height" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.barrelHeight+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Length</div>'+
  '<input autocomplete="off" placeholder="Additional Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.additionalAngle+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Rotation</div>'+
  '<input autocomplete="off" placeholder="x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.x+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset</div>'+
  '<input autocomplete="off" placeholder="y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Attributes</div>'+
  '<input autocomplete="off" placeholder="Reload" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.reloadRecover+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Shoot Interval</div>'+
  '<input autocomplete="off" placeholder="Health" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletHealth+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Health</div>'+
  '<input autocomplete="off" placeholder="Damage" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletDamage+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Damage</div>'+
  '<input autocomplete="off" placeholder="Penetration" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletPenetration+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Penetration</div>'+
  '<input autocomplete="off" placeholder="Timer" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletTimer+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Lifetime</div>'+
  '<input autocomplete="off" placeholder="Speed" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletSpeed+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Speed</div>'+
  '<input autocomplete="off" placeholder="Recoil" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.recoil+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Recoil Amount</div>'+
  '<input autocomplete="off" placeholder="Delay" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.reload+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Barrel Delay</div>'+
  '<button id=' + buttonID + ' class="sandboxButton" style="position: relative;clear:both;float:left;" onclick=delbar(this)>Delete Barrel</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:10vw;" onclick=duplicatebar(this)>Duplicate Barrel</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Forward (WIP)</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Backward (WIP)</button></div>';
  htmlObject.innerHTML = textnode;
  document.getElementById("barrelUI").appendChild(htmlObject);
  document.getElementById("barrels").innerHTML = "Barrels (" + $("#barrelUI").children().length + ")";//update barrel count on button
  barrelnumberid++;
  if (type == "drone"){
    var htmlObject = document.createElement('div');
      var divid = 'dc'+id;
      var divid2 = 'dc2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="droneLimit" class="sandboxInput" style="clear:both;position:relative;float:left;" value='+barrel.droneLimit+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Max Drone Count</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
  }
  else if (type == "trap"){
    var htmlObject = document.createElement('div');
      var divid = 'tr'+id;
      var divid2 = 'tr2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="trapDistBeforeStop" class="sandboxInput" style="clear:both;position:relative;float:left;" value='+barrel.trapDistBeforeStop+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Trap Distance</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
  }
  else if (type == "minion"){
    var htmlObject = document.createElement('div');
      var divid = 'mc'+id;
      var divid2 = 'mc2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="droneLimit" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.droneLimit+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Max Minion Count</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'md'+id;
      var divid2 = 'md2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="minDist" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.minDist+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Minimum Distance</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
    let minionbar = barrel.barrels[Object.keys(barrel.barrels)[0]];//get first property of barrels (assuming only one minion barrel)
       var htmlObject = document.createElement('div');
      var divid = 'minion'+id;
      
      //MINION EDITING UI
      
      var textnode = '<div id='+divid+'>'+
      '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Minion Barrel Positioning</div>'+
  '<input autocomplete="off" placeholder="Minion Barrel Width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.barrelWidth+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Width</div>'+
  '<input autocomplete="off" placeholder="Minion Barrel Height" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.barrelHeight+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Length</div>'+
  '<input autocomplete="off" placeholder="Minion Additional Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.additionalAngle+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Angle (WIP)</div>'+
  '<input autocomplete="off" placeholder="Minion x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.x+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset</div>'+
  '<input autocomplete="off" placeholder="Minion y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Minion Barrel Attributes</div>'+
  '<input autocomplete="off" placeholder="Minion Reload" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.reloadRecover+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Shoot Interval</div>'+
  '<input autocomplete="off" placeholder="Minion Health" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletHealth+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Health</div>'+
  '<input autocomplete="off" placeholder="Minion Damage" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletDamage+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Damage</div>'+
  '<input autocomplete="off" placeholder="Minion Penetration" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletPenetration+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Penetration</div>'+
  '<input autocomplete="off" placeholder="Minion Timer" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletTimer+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Lifetime</div>'+
  '<input autocomplete="off" placeholder="Minion Speed" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletSpeed+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Speed</div>'+
  '<input autocomplete="off" placeholder="Minion Recoil" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.recoil+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Recoil Amount (WIP)</div>'+
  '<input autocomplete="off" placeholder="Minion Delay" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.reload+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Barrel Delay</div>'+
        '</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
  }
  else if (type == "mine"){
    var htmlObject = document.createElement('div');
      var divid = 'tr'+id;
      var divid2 = 'tr2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="trapDistBeforeStop" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.trapDistBeforeStop+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Trap Distance</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'ma'+id;
      var divid2 = 'ma2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="AIdetectRange" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.AIdetectRange+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Detection Range</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
    let minionbar = barrel.barrels[Object.keys(barrel.barrels)[0]];//get first property of barrels (assuming only one minion barrel)
       var htmlObject = document.createElement('div');
      var divid = 'mine'+id;
      
      //MINE EDITING UI
      
      var textnode = '<div id='+divid+'>'+
  '<select name="Mine type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines</option> <option value="minion">Spawner</option><option value="nothing">Nothing (WIP)</option></select>' +
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;"> Mine Barrel Type (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Mine Barrel Positioning</div>'+
  '<input autocomplete="off" placeholder="Mine Barrel Width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.barrelWidth+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Width</div>'+
  '<input autocomplete="off" placeholder="Mine Barrel Height" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.barrelHeight+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Length</div>'+
  '<input autocomplete="off" placeholder="Mine Additional Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.additionalAngle+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Angle (WIP)</div>'+
  '<input autocomplete="off" placeholder="Mine x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.x+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset (WIP)</div>'+
  '<input autocomplete="off" placeholder="Mine y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Mine Barrel Attributes</div>'+
  '<input autocomplete="off" placeholder="Mine Reload" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.reloadRecover+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Shoot Interval</div>'+
  '<input autocomplete="off" placeholder="Mine Health" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletHealth+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Health</div>'+
  '<input autocomplete="off" placeholder="Mine Damage" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletDamage+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Damage</div>'+
  '<input autocomplete="off" placeholder="Mine Penetration" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletPenetration+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Penetration</div>'+
  '<input autocomplete="off" placeholder="Mine Timer" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletTimer+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Lifetime</div>'+
  '<input autocomplete="off" placeholder="Mine Speed" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.bulletSpeed+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Speed</div>'+
  '<input autocomplete="off" placeholder="Mine Recoil" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.recoil+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Recoil Amount (WIP)</div>'+
  '<input autocomplete="off" placeholder="Mine Delay" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+minionbar.reload+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Barrel Delay</div>'+
        '</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
  }
  else if (type == "bullet"){
    let value = "no";
    if (barrel.knockback == "yes"){
      value = "yes";
    }
  var htmlObject = document.createElement('div');
      var divid = 'bk'+id;
      var divid2 = 'bk2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="knockback" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+value+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Knockback (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
    value = "no";
    if (barrel.growth == "yes"){
      value = "yes";
    }
      var htmlObject = document.createElement('div');
      var divid = 'bg'+id;
      var divid2 = 'bg2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="growth" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+value+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet growth (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
  }
}

function addCustomGadgetDiv(id,barrel) {
  var htmlObject = document.createElement('div');
  let type = barrel.barrelType;
  let barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines (WIP)</option><option value="aura">Aura</option><option value="minion">Spawner (WIP)</option><option value="nothing">Nothing (WIP)</option></select>';
  //add "selected" inside the option which is the current barrel type
  if (type == "bullet"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines (WIP)</option><option value="aura">Aura</option><option value="minion">Spawner (WIP)</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  else if (type == "drone"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone" selected>Drone</option><option value="trap">Trap</option><option value="mine">Mines (WIP)</option><option value="aura">Aura</option><option value="minion">Spawner (WIP)</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  else if (type == "trap"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap" selected>Trap</option><option value="mine">Mines (WIP)</option><option value="aura">Aura</option><option value="minion">Spawner (WIP)</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  else if (type == "mine"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine" selected>Mines (WIP)</option><option value="aura">Aura</option><option value="minion">Spawner (WIP)</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  else if (type == "minion"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines (WIP)</option><option value="aura">Aura</option><option value="minion" selected>Spawner (WIP)</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  else if (type == "aura"){
    barrelTypeSelect = '<select name="type" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="bullet">Bullet</option><option value="drone">Drone</option><option value="trap">Trap</option><option value="mine">Mines (WIP)</option><option value="aura" selected>Aura</option><option value="minion">Spawner (WIP)</option><option value="nothing">Nothing (WIP)</option></select>';
  }
  var buttonID = 'btn'+id; //note: use 'clear:both;' inside style instead of <br> (doesnt work for relative positioning)
  //overflow auto below is to make div take up space of nested items (s that background-color will work)
  var textnode = '<div id=' + id + ' class="sandboxStack tankObjectHide" style="overflow: auto;background-color:rgba(0,0,0,.2);width: 30%;padding: 0.5vw 1vw;border-radius:1vw;margin-top: 20px;">' +
  '<div class="sandboxText" style="font-size: 1vw;clear:both;position:relative;float:left;padding:0.3vw 0.3vw;cursor: pointer;" onclick="showHideTankObject(\'bb\', \'' + id + '\')">Gadget '+gadgetnumberid+' ▾</div>' +
  barrelTypeSelect +
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;"> Barrel Type</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Positioning</div>'+
  '<input autocomplete="off" placeholder="Barrel Width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.barrelWidth+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Width</div>'+
  '<input autocomplete="off" placeholder="Barrel Height" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.barrelHeight+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Length</div>'+
  '<input autocomplete="off" placeholder="Additional Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.additionalAngle+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Rotation</div>'+
  '<input autocomplete="off" placeholder="x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.x+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset</div>'+
  '<input autocomplete="off" placeholder="y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value="0">'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset (WIP)</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Attributes</div>'+
  '<input autocomplete="off" placeholder="Reload" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.reloadRecover+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Shoot Interval</div>'+
  '<input autocomplete="off" placeholder="Health" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletHealth+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Health</div>'+
  '<input autocomplete="off" placeholder="Damage" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletDamage+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Damage</div>'+
  '<input autocomplete="off" placeholder="Penetration" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletPenetration+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Penetration</div>'+
  '<input autocomplete="off" placeholder="Timer" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletTimer+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Lifetime</div>'+
  '<input autocomplete="off" placeholder="Speed" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.bulletSpeed+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet Speed</div>'+
  '<input autocomplete="off" placeholder="Recoil" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.recoil+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Recoil Amount</div>'+
  '<input autocomplete="off" placeholder="Delay" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.reload+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Barrel Delay</div>'+
  '<button id=' + buttonID + ' class="sandboxButton" style="position: relative;clear:both;float:left;" onclick=delbb(this)>Delete Gadget</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:10vw;" onclick=duplicatebb(this)>Duplicate Gadget</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Forward (WIP)</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Backward (WIP)</button></div>';
  htmlObject.innerHTML = textnode;
  document.getElementById("bbUI").appendChild(htmlObject);
  document.getElementById("turrets").innerHTML = "Gadgets (" + $("#bbUI").children().length + ")";//update barrel count on button
  gadgetnumberid++;
  if (type == "drone"){
    var htmlObject = document.createElement('div');
      var divid = 'dc'+id;
      var divid2 = 'dc2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="droneLimit" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.droneLimit+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Max Drone Count</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
  }
  else if (type == "trap"){
    var htmlObject = document.createElement('div');
      var divid = 'tr'+id;
      var divid2 = 'tr2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="trapDistBeforeStop" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.trapDistBeforeStop+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Trap Distance</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
  }
  else if (type == "aura"){
    var htmlObject = document.createElement('div');
      var divid = 'as'+id;
      var divid2 = 'as2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="auraSize" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.auraSize+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura size</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'ac'+id;
      var divid2 = 'ac2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="auraColor" class="sandboxInput" style="clear:both;position:relative;float:left;" value='+barrel.auraColor+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura color</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'ao'+id;
      var divid2 = 'ao2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="auraOutline" class="sandboxInput" style="clear:both;position:relative;float:left;" value='+barrel.auraOutline+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura outline</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
      var htmlObject = document.createElement('div');
      var divid = 'at'+id;
      var divid2 = 'at2'+id;
      var textnode = '<select name="auratype" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="damage">Damage</option><option value="freeze">Freeze</option><option value="attraction">Attraction</option><option value="repulsion">Repulsion</option><option value="heal">Heal</option></select><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura Type</div>';
      if (barrel.auraSpecialty == "freeze"){
        textnode = '<select name="auratype" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="damage">Damage</option><option value="freeze" selected>Freeze</option><option value="attraction">Attraction</option><option value="repulsion">Repulsion</option><option value="heal">Heal</option></select><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura Type</div>';
      }
      else if (barrel.auraSpecialty == "attraction"){
        textnode = '<select name="auratype" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="damage">Damage</option><option value="freeze">Freeze</option><option value="attraction" selected>Attraction</option><option value="repulsion">Repulsion</option><option value="heal">Heal</option></select><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura Type</div>';
      }
      else if (barrel.auraSpecialty == "heal"){
        textnode = '<select name="auratype" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="damage">Damage</option><option value="freeze">Freeze</option><option value="attraction">Attraction</option><option value="repulsion">Repulsion</option><option value="heal" selected>Heal</option></select><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura Type</div>';
      }
      else if (barrel.auraSpecialty == "repulsion"){
        textnode = '<select name="auratype" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="damage">Damage</option><option value="freeze">Freeze</option><option value="attraction">Attraction</option><option value="repulsion" selected>Repulsion</option><option value="heal">Heal</option></select><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura Type</div>';
      }
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
      if (barrel.auraSpecialty == "heal"){//heal power div
        var htmlObject = document.createElement('div');
        var divid = 'hp'+id;
        var divid2 = 'hp2'+id;
        var textnode = '<input id='+divid+' autocomplete="off" placeholder="healPower" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.healPower+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Aura Heal Power</div>';
        htmlObject.innerHTML = textnode;
        htmlObject.setAttribute("id", id);
        document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
      }
  }
  else if (type == "bullet"){
    let value = "no";
    if (barrel.knockback == "yes"){
      value = "yes";
    }
  var htmlObject = document.createElement('div');
      var divid = 'bk'+id;
      var divid2 = 'bk2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="knockback" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+value+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Knockback (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
    value = "no";
    if (barrel.growth == "yes"){
      value = "yes";
    }
      var htmlObject = document.createElement('div');
      var divid = 'bg'+id;
      var divid2 = 'bg2'+id;
      var textnode = '<input id='+divid+' autocomplete="off" placeholder="growth" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+value+'><div id='+divid2+' class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Bullet growth (y/n)</div>';
      htmlObject.innerHTML = textnode;
      htmlObject.setAttribute("id", id);
      document.getElementById("btn"+id).before(htmlObject);//add before the delete barrel button
  }
}

function addCustomAssetDiv(id,barrel) {
  var htmlObject = document.createElement('div');
  let type = barrel.type;
  let barrelTypeSelect = '<select name="position" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="under">Under tank</option><option value="above">Above tank</option></select>';
  //add "selected" inside the option which is the current barrel type
  if (type == "under"){
  //nothing
  }
  else{
    barrelTypeSelect = '<select name="position" class="sandboxSelect" style="clear:both;position:relative;float:left;"><option value="under">Under tank</option><option value="above" selected>Above tank</option></select>';
  }
  var buttonID = 'btn'+id; //note: use 'clear:both;' inside style instead of <br> (doesnt work for relative positioning)
  //overflow auto below is to make div take up space of nested items (s that background-color will work)
  var textnode = '<div id=' + id + ' class="sandboxStack tankObjectHide" style="overflow: auto;background-color:rgba(0,0,0,.2);width: 30%;padding: 0.5vw 1vw;border-radius:1vw;margin-top: 20px;">'+
  '<div class="sandboxText" style="font-size: 1vw;clear:both;position:relative;float:left;padding:0.3vw 0.3vw;cursor: pointer;" onclick="showHideTankObject(\'asset\', \'' + id + '\')">Asset '+assetnumberid+' ▾</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Positioning</div>'+
  barrelTypeSelect+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw;"> Position</div>'+
  '<input autocomplete="off" placeholder="Relative size" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.size+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Relative Size</div>'+
  '<input autocomplete="off" placeholder="Angle" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.angle+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Rotation</div>'+
  '<input autocomplete="off" placeholder="x-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.x+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Side Offset</div>'+
  '<input autocomplete="off" placeholder="y-offset" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.y+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Forward Offset</div>'+
  '<div class="sandboxText" style="clear:both;position:relative;font-size:1.25vw;float:left;padding:0.3vw 0.3vw;">Attributes</div>'+
  '<input autocomplete="off" placeholder="Asset sides" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.sides+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Sides</div>'+
  '<input autocomplete="off" placeholder="Asset color" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.color+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Color</div>'+
  '<input autocomplete="off" placeholder="Asset outline" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.outline+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Outline</div>'+
  '<input autocomplete="off" placeholder="Outline width" class="sandboxInput" style="clear:both;position:relative;float:left;width:5vw;" value='+barrel.outlineThickness+'>'+
  '<div class="sandboxText" style="position:relative;font-size:1vw;float:left;padding:0.3vw 0.3vw 0.3vw 1vw;">Outline width</div>'+
  '<button id=' + buttonID + ' class="sandboxButton" style="position: relative;clear:both;float:left;" onclick=delass(this)>Delete Asset</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:10vw;" onclick=duplicateass(this)>Duplicate Asset</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Forward (WIP)</button>'+
  '<button class="sandboxButton" style="position: relative;float:left;width:12vw;" >Move Backward (WIP)</button></div>';
  htmlObject.innerHTML = textnode;
  document.getElementById("assetUI").appendChild(htmlObject);
  document.getElementById("assets").innerHTML = "Assets (" + $("#assetUI").children().length + ")";//update barrel count on button
  assetnumberid++;
}

function delbar(e) {//barrel
  var par = $(event.target).parent();
  var parID = par.attr('id');
  if (gamemode=="Tank Editor"){//prevent error which causes editor to not be able to open
    var packet = JSON.stringify(["delbarrel",parID]);//tell server to delete barrel
    socket.send(packet)
  }
  par.parent().remove();//delete html div
  document.getElementById("barrels").innerHTML = "Barrels (" + $("#barrelUI").children().length + ")";//update barrel count on button
}
function delass(e) {//asset
  var par = $(event.target).parent();
  var parID = par.attr('id');
  if (gamemode=="Tank Editor"){//prevent error which causes editor to not be able to open
    var packet = JSON.stringify(["delasset",parID]);//tell server to delete barrel
    socket.send(packet)
  }
  par.parent().remove();//delete html div
  document.getElementById("assets").innerHTML = "Assets (" + $("#assetUI").children().length + ")";//update barrel count on button
}
function delbb(e) {//bodybarrel
  var par = $(event.target).parent();
  var parID = par.attr('id');
  if (gamemode=="Tank Editor"){//prevent error which causes editor to not be able to open
    var packet = JSON.stringify(["delbb",parID]);//tell server to delete barrel
    socket.send(packet)
  }
  par.parent().remove();//delete html div
  document.getElementById("turrets").innerHTML = "Gadgets (" + $("#bbUI").children().length + ")";//update barrel count on button
}


function duplicatebar(e){
  var par = $(event.target).parent();
  var parID = par.attr('id');
  //new ids
  var dataidgen = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    dataidgen = dataidgen.split('');
    var specialID  = "";
    for(let i = 0; i < 20; ++i) {
      specialID += dataidgen[Math.floor(Math.random() * dataidgen.length)];
    }
  var buttonID = 'btn'+specialID;
  if (gamemode=="Tank Editor"){//prevent error which causes editor to not be able to open
    var packet = JSON.stringify(["dupbarrel",parID, specialID]);//tell server to duplicate barrel
    socket.send(packet)
  }
  //clone div
  var row = par.parent(),
    inputVal = row.find('input').val(),
    selectVal = row.find('select').val(),
    clone = $(row).clone(true, true);
  //change ID
  //dont use find. It doesnt work but idk why.
  clone.children(":first").attr('id', specialID);
  clone.children(":first").children("button:first").attr('id', buttonID);
  //copy the input field values
  clone.find('input[type="text"]').val(inputVal);
  clone.find('select').val(selectVal);
  
  //replace div number
  let divtitle = 'Barrel ';
  let text = clone.find(">:first-child").find(">:first-child").text();
  let indexofnumber = text.indexOf(divtitle) + divtitle.length;
  let number = text.charAt(indexofnumber);
  let texttoreplace = divtitle+number.toString();
  text = text.replace(divtitle+number.toString(), divtitle+barrelnumberid);
  clone.find(">:first-child").find(">:first-child").text(text);
  barrelnumberid++;

  //change onclick event
  clone.find(">:first-child").find(">:first-child").attr("onclick","showHideTankObject(\'barrel\', \'" + specialID + "\')");
  
  //change all the ids of custom properties, e.g. minion customization div
  clone.find(">:first-child").children().each(function () {// "this" is the current html element, but use $(this) to access it as jquery
    if (this.id == parID){//this div contains the divs that we need to change the id of
      $(this).attr('id', specialID);
      $(this).children().each(function () {
        let newid = this.id.replace(parID, specialID);
        $(this).attr('id', newid);
      })
    }
  });
  
  $('#barrelUI').append(clone);//add clone
  document.getElementById("barrels").innerHTML = "Barrels (" + $("#barrelUI").children().length + ")";//update barrel count on button
}
function duplicateass(e){
  var par = $(event.target).parent();
  var parID = par.attr('id');
  //new ids
  var dataidgen = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    dataidgen = dataidgen.split('');
    var specialID  = "";
    for(let i = 0; i < 20; ++i) {
      specialID += dataidgen[Math.floor(Math.random() * dataidgen.length)];
    }
  var buttonID = 'btn'+specialID;
  if (gamemode=="Tank Editor"){//prevent error which causes editor to not be able to open
    var packet = JSON.stringify(["dupasset",parID, specialID]);//tell server to duplicate barrel
    socket.send(packet)
  }
  //clone div
  var row = par.parent(),
    inputVal = row.find('input').val(),
    selectVal = row.find('select').val(),
    clone = $(row).clone(true, true);
  //change ID
  //dont use find. It doesnt work but idk why.
  clone.children(":first").attr('id', specialID);
  clone.children(":first").children("button:first").attr('id', buttonID);
  //copy the input field valuessss
  clone.find('input[type="text"]').val(inputVal);
  clone.find('select').val(selectVal);
  
  //replace div number
  let divtitle = 'Asset ';
  let text = clone.find(">:first-child").find(">:first-child").text();
  let indexofnumber = text.indexOf(divtitle) + divtitle.length;
  let number = text.charAt(indexofnumber);
  let texttoreplace = divtitle+number.toString();
  text = text.replace(divtitle+number.toString(), divtitle+assetnumberid);
  clone.find(">:first-child").find(">:first-child").text(text);
  assetnumberid++;

  //change onclick event
  clone.find(">:first-child").find(">:first-child").attr("onclick","showHideTankObject(\'asset\', \'" + specialID + "\')");
  
  $('#assetUI').append(clone);//add clone
  document.getElementById("assets").innerHTML = "Assets (" + $("#assetUI").children().length + ")";//update barrel count on button
}
function duplicatebb(e){
  var par = $(event.target).parent();
  var parID = par.attr('id');
  //new ids
  var dataidgen = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    dataidgen = dataidgen.split('');
    var specialID  = "";
    for(let i = 0; i < 20; ++i) {
      specialID += dataidgen[Math.floor(Math.random() * dataidgen.length)];
    }
  
  var buttonID = 'btn'+specialID;
  if (gamemode=="Tank Editor"){//prevent error which causes editor to not be able to open
    var packet = JSON.stringify(["dupbb",parID, specialID]);//tell server to duplicate barrel
    socket.send(packet)
  }
  //clone div
  var row = par.parent(),
    inputVal = row.find('input').val(),
    selectVal = row.find('select').val(),
    clone = $(row).clone(true, true);
  //change ID
  //dont use find. It doesnt work but idk why.
  clone.children(":first").attr('id', specialID);
  clone.children(":first").children("button:first").attr('id', buttonID);
  //copy the input field valuessss
  clone.find('input[type="text"]').val(inputVal);
  clone.find('select').val(selectVal);
  
  //replace div number
  let divtitle = 'Gadget ';
  let text = clone.find(">:first-child").find(">:first-child").text();
  let indexofnumber = text.indexOf(divtitle) + divtitle.length;
  let number = text.charAt(indexofnumber);
  let texttoreplace = divtitle+number.toString();
  text = text.replace(divtitle+number.toString(), divtitle+gadgetnumberid);
  clone.find(">:first-child").find(">:first-child").text(text);
  gadgetnumberid++;

  //change onclick event
  clone.find(">:first-child").find(">:first-child").attr("onclick","showHideTankObject(\'bb\', \'" + specialID + "\')");
  
  //change all the ids of custom properties, e.g. minion customization div
  clone.find(">:first-child").children().each(function () {// "this" is the current html element, but use $(this) to access it as jquery
    if (this.id == parID){//this div contains the divs that we need to change the id of
      $(this).attr('id', specialID);
      $(this).children().each(function () {
        let newid = this.id.replace(parID, specialID);
        $(this).attr('id', newid);
      })
    }
  });
  
  $('#bbUI').append(clone);//add clone
  
  document.getElementById("turrets").innerHTML = "Gadgets (" + $("#bbUI").children().length + ")";//update barrel count on button
  
  //update the aura type if have
  try{
    let e = document.getElementById("at"+parID);
    let value = e.value;
    let text = e.options[e.selectedIndex].text;
    console.log(text)
    if (text == "Damage"){
        document.getElementById("at"+specialID).innerHTML = '<option value="damage" selected>Damage</option><option value="freeze">Freeze</option><option value="attraction">Attraction</option><option value="repulsion">Repulsion</option><option value="heal">Heal</option>';
      }
    else if (text == "Freeze"){
        document.getElementById("at"+specialID).innerHTML = '<option value="damage">Damage</option><option value="freeze" selected>Freeze</option><option value="attraction">Attraction</option><option value="repulsion">Repulsion</option><option value="heal">Heal</option>';
      }
      else if (text == "Attraction"){
        document.getElementById("at"+specialID).innerHTML = '<option value="damage">Damage</option><option value="freeze">Freeze</option><option value="attraction" selected>Attraction</option><option value="repulsion">Repulsion</option><option value="heal">Heal</option>';
      }
      else if (text == "Heal"){
        document.getElementById("at"+specialID).innerHTML = '<option value="damage">Damage</option><option value="freeze">Freeze</option><option value="attraction">Attraction</option><option value="repulsion">Repulsion</option><option value="heal" selected>Heal</option>';
      }
      else if (text == "Repulsion"){
        document.getElementById("at"+specialID).innerHTML = '<option value="damage">Damage</option><option value="freeze">Freeze</option><option value="attraction">Attraction</option><option value="repulsion" selected>Repulsion</option><option value="heal">Heal</option>';
      }
  }
  catch(err){}
}

//addBarrelDiv("yes");//add one barrel to the editor UI cuz the player spawns with one barrel (basic tank)

var tankEditor1 = document.getElementById("sandbox");
var tankEditor2 = document.getElementById("sandbox2");
var barrelEditor = document.getElementById("sandbox3");
var assetEditor = document.getElementById("sandbox4");
var bbEditor = document.getElementById("sandbox5");
function openBarrelUI(){
  if (barrelEditor.style.display == "none"){
    barrelEditor.style.display = "block";
    assetEditor.style.display = "none";
    bbEditor.style.display = "none";
  }
  else{
    barrelEditor.style.display = "none";
  }
}
function openAssetUI(){
  if (assetEditor.style.display == "none"){
    assetEditor.style.display = "block";
    barrelEditor.style.display = "none";
    bbEditor.style.display = "none";
  }
  else{
    assetEditor.style.display = "none";
  }
}
function openBBUI(){
  if (bbEditor.style.display == "none"){
    bbEditor.style.display = "block";
    assetEditor.style.display = "none";
    barrelEditor.style.display = "none";
  }
  else{
    bbEditor.style.display = "none";
  }
}
function openEditorUI(){
  if (tankEditor1.style.display == "none"){
    tankEditor1.style.display = "block";
    tankEditor2.style.display = "block";
    openedUI = "yes";
    document.getElementById("chat").style.display = "none";
  }
  else{
    tankEditor1.style.display = "none";
    tankEditor2.style.display = "none";
    barrelEditor.style.display = "none";
    assetEditor.style.display = "none";
    bbEditor.style.display = "none";
    openedUI = "no";
    document.getElementById("chat").style.display = "block";
  }
}
        //open UI for editing account pfp
        function openeditpfp(){
          document.getElementById("editProfilePic").style.display = "block";
          document.getElementById("accountsPopup").style.display = "none";
        }
        function closeeditpfp(){
          document.getElementById("editProfilePic").style.display = "none";
          document.getElementById("accountsPopup").style.display = "block";
        }

//import tank code
//send the tank code to server
function sendTankCode(){
  var tankcode = document.getElementById("import-code").value;
  var packet = JSON.stringify(["tankcode",tankcode]);
  socket.send(packet)
}
//get tank code
function getTankCode(){
  var packet = JSON.stringify(["export"]);
  socket.send(packet)
  createNotif("Exporting tank code...",defaultNotifColor,3000)
  createNotif("Note that this feature is new and may not work properly.",defaultNotifColor,3000)
}

//change account pfp
function changepfp(weapon){
  alert(weapon)
}
*/
window.onbeforeunload = () =>  {
    if(state == "ingame"){//in game (show confirmation)
       return true
    }else{//dont show
       return null
    }
}//confirmation dialog when close tab
