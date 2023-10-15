import * as THREE from 'three';

//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffe6ff);
//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
var clock = new THREE.Clock();
//renderer
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; //enable shadow rendering
//set where to render
document.body.appendChild(renderer.domElement);

//player cube
const playerCubeGeometry = new THREE.BoxGeometry(1,1,1);
const playerMaterial = new THREE.MeshBasicMaterial({
    color: 0xff99ff})
const playerCube = new THREE.Mesh(playerCubeGeometry,playerMaterial);
const cubeBox = new THREE.Box3().setFromObject(playerCube);
scene.add(playerCube);

//ground plane
const groundGeometry = new THREE.PlaneGeometry(10,100000,1);
const groundMaterial = new THREE.MeshStandardMaterial({color: 0xff00ff })
const ground = new THREE.Mesh(groundGeometry,groundMaterial);
scene.add(ground);
ground.rotation.x = -Math.PI/2;
ground.position.z = 0;
ground.position.x = 0;
ground.position.y = -1;

console.log(playerCube.position);

camera.position.z = 5;
camera.position.y = 2;
function animate(){
    requestAnimationFrame(animate);
    //cubeForce();
    renderer.render(scene,camera);
}
animate()

function cubeForce(){
    var delta = clock.getDelta();
    var moveDistance = 200* delta;
    //console.log(clock,delta,moveDistance);
    playerCube.position.z -= moveDistance/10;
    camera.position.z -= moveDistance/10;
}
document.addEventListener('keydown', (event) =>{
    var delta = clock.getDelta();
    var moveDistance = 200* delta;
    if(event.key == 'a'){
        playerCube.position.x -= moveDistance/10;
        console.log(event.key+" key is pressed");
    }
    if(event.key == 'd'){
        playerCube.position.x += moveDistance/10;
        console.log(event.key+" key is pressed")
    }
}
)
