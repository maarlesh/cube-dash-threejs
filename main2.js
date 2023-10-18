import * as THREE from 'three';
let obstacles = [];
const numObstacles = 5;
let gameStatus = "";
let cube;
let ground;
let light;
let camera;
let scene;
let renderer;
const moveDistance = 1


function initGame(){
    scene = new THREE.Scene();

    const aspectRatio = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.1,1000);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    document.body.appendChild(renderer.domElement);
}

function startGame(){
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshStandardMaterial( {color: 0xffffff, metalness : 0.1} );
    cube = new THREE.Mesh(geometry,material);
    scene.add(cube);
    camera.position.z = 3.5;
    camera.position.y = 1.5;
    cube.position.y = -0.5;
    cube.castShadow = true;
    cube.receiveShadow = true;
    light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(1, 1, 5);
    light.castShadow = true;
    scene.add(light);
    const groundGeometry = new THREE.PlaneGeometry(20,1000);
    const groundMaterial = new THREE.MeshStandardMaterial( {color : 0xff80ff } );
    ground = new THREE.Mesh(groundGeometry,groundMaterial);
    //rotating the ground
    ground.rotation.x = - Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    scene.background = new THREE.Color(0xffe6ff)
    for (let i = 0; i < numObstacles; i++) {
        const obstacleGeometry = new THREE.BoxGeometry( Math.floor(Math.random() * 4) + 2, 1, 1);
        const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff99ff, metalness: 0.1 });
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        scene.add(obstacle);
        obstacle.castShadow = true;
        obstacle.receiveShadow = true;
        
        obstacle.position.y = -0.5;
        // Set random positions for obstacles
        obstacle.position.x = Math.random() * 6 - 3; // Random x position between -3 and 3
        obstacle.position.z = Math.random() * (100 - 10) - 100;
        obstacles.push(obstacle);
    }

}


function animate(){
    requestAnimationFrame(animate);
        if (gameStatus === 'over' || gameStatus === 'level_completed') {
            return;
        }
        gameStatus = checkCollision();
        if(gameStatus == 'over')
        {
            console.log("Game over");
            resetLevel();
            // reset the level
            return ;
        }
        if(gameStatus == 'level_completed'){
            console.log("Level Completed");
            // move to next level
            levelCompleted();
            return;
        }
        cubeForce();
        renderer.render(scene,camera);
}

function cubeForce(){
    if (gameStatus === 'over' || gameStatus === 'level_completed') {
        return;
    }
    //console.log(clock,delta,moveDistance);
    if(cube.position.z > -102 && gameStatus != 'over'){
        cube.position.z -= moveDistance/10;
        camera.position.z -= moveDistance/10;
    }
    else{
        
    }
}


function checkCollision(){
    for (const obstacle of obstacles) {
        if (cube.position.distanceTo(obstacle.position) < 1.5) {
            console.log("Collision Detected");
            console.log(cube.position.distanceTo(obstacle.position)); 
            console.log(obstacle.position);
            console.log(cube.position)
            gameStatus = "over";
            return gameStatus;
        }
        if(cube.position.z < -102){
            gameStatus = "level_completed";
            return gameStatus;
        }
        
    }
}

function levelCompleted(){
    const levelCompletedMessage = document.getElementById("level-completed-message");
    levelCompletedMessage.style.display = 'block'; 
}


function resetLevel(){
        gameStatus = "";
        const levelCompletedMessage = document.getElementById("game-over-message");
        levelCompletedMessage.style.display = 'block';    
}


document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
      document.getElementById("start-message").style.display = 'none';
      initGame()
      startGame();
      animate();
    }
    if(event.key == 'a'){
         if(cube.position.x > -6){
             cube.position.x -= 0.2;
         }
     }
     if(event.key == 'd'){
         if(cube.position.x < 6){
             cube.position.x += 0.2;
         }         
     }
     if(event.code == 'Escape'){
         window.location.reload();
     }
  });