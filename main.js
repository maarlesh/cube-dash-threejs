import * as THREE from 'three';

let obstacles = [];
const numObstacles = 5;
let gameStatus = "";
let cube;
let ground;
let light;
let camera;
const moveDistance = 1
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
      document.getElementById("start-message").style.display = 'none';
      var res = startGame();
      console.log(res)
    }
    
  });
  

 //1. Creating a scene
 const scene = new THREE.Scene();

 //console.log(window.innerHeight); //838
 //console.log(window.innerWidth);  //1104

 //2. Creating a Perspective Camera takes 4 arguement 1. FOV (Field of view) 2. Aspect ration 3. Nearest clipping point 4. farthest clipping window point 
 const aspectRatio = window.innerWidth/window.innerHeight;
 camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.1,1000);

 //3. Creating a Renderer to render
 const renderer = new THREE.WebGLRenderer({antialias: true});
 //setting size of the renderer
 renderer.setSize(window.innerWidth,window.innerHeight);
 renderer.shadowMap.enabled = true; // Enable shadow mapping
 //appending the render to the dom of the body
 document.body.appendChild(renderer.domElement);


function startGame(){
    var clock = new THREE.Clock();
    //4. Creating a Cube
    //4.1 Create a BoxGeometry to store the dimension of the cube
    const geometry = new THREE.BoxGeometry(1,1,1);
    //4.2 Creating a material (MeshMaterial) to add to the cube it takes a argument to pass the properties (eg. color takes a hexadecimal value)
    const material = new THREE.MeshStandardMaterial( {color: 0xffffff, metalness : 0.1} );
    //4.3 Create a Mesh with the geometry and the material
    cube = new THREE.Mesh(geometry,material);
    //4.4 add the cube to the scene
    scene.add(cube);
    //By default, when we call scene.add(), the thing we add will be added to the coordinates (0,0,0). This would cause both the camera and the cube to be inside each other. To avoid this, we simply move the camera out a bit.
    camera.position.z = 3.5;
    camera.position.y = 1.5;
    cube.position.y = -0.5;
    //enabling shadow
    cube.castShadow = true;
    cube.receiveShadow = true;

     //7. Adding Light
     light = new THREE.DirectionalLight(0xffffff, 3);
     light.position.set(1, 1, 5);
     light.castShadow = true;
     scene.add(light);


    //5. Render the scene
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
            return -1;
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
    var a = animate();
    console.log(a);
    //6.Creating a ground
    const groundGeometry = new THREE.PlaneGeometry(20,1000);
    const groundMaterial = new THREE.MeshStandardMaterial( {color : 0xff80ff } );
    ground = new THREE.Mesh(groundGeometry,groundMaterial);
    //rotating the ground
    ground.rotation.x = - Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;

    scene.add(ground);

   


    //8. Changing Scene Background color
    scene.background = new THREE.Color(0xffe6ff)

    //9. creating obstacles

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



    document.addEventListener('keydown', (event) =>{
        var delta = clock.getDelta();
       // var moveDistance = 200* delta;
        if(event.key == 'a'){
           // console.log(cube.position);
            if(cube.position.x > -6){
                //cube.position.x -= moveDistance/10;
                cube.position.x -= 0.2;
               // console.log(event.key+" key is pressed");
            }
            
        }
        if(event.key == 'd'){
           // console.log(cube.position)
            if(cube.position.x < 6){
                //cube.position.x += moveDistance/10;
                cube.position.x += 0.2;
               // console.log(event.key+" key is pressed")
            }
            
        }

        //Restarting game
        if(event.code == 'Escape'){
            window.location.reload();
        }
        
    }
    )

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
        //collision detection

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
                camera.position.y++;
                return gameStatus;
            }
            
        }
    }

    function levelCompleted(){
        const levelCompletedMessage = document.getElementById("level-completed-message");
        levelCompletedMessage.style.display = 'block'; 
        
    }
    return 0;
    
}

function resetLevel(){
    setTimeout(() => {
        gameStatus = "";
        scene.remove(cube);
        scene.remove(ground);
        scene.remove(light);
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle1 = obstacles[i];
            scene.remove(obstacle1);
        }
        obstacles.length = 0;
    }, 3000);
}