import * as THREE from 'three';
import './style.css';

//setting up scene, camera, and renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .7, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//creating moon
const moonTexture = new THREE.TextureLoader().load('/assets/moon.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshBasicMaterial({
        map: moonTexture
    })
);
moon.position.set(-200, 0, -50)
moon.rotation.y = 4;
scene.add(moon);

//animation loop - called on every screen refresh (ex: 60hz)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

//fill 500 stars in a 500 x 500 area centered around (0, -350, 0)
const geometry = new THREE.SphereGeometry(.25, 24, 24);
const material = new THREE.MeshBasicMaterial({color: 0xffffff});
function addStar() {
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
    star.position.set(x, y-350, z);
    scene.add(star);
}
Array(500).fill().forEach(addStar)

function moveMoon(t) {
    moon.position.z = t * -0.0235 - 50;
    moon.position.x = (Math.log(t * -0.05)/Math.log(1.047) - 90);
}

function move() {
    var t = document.body.getBoundingClientRect().top * (931/window.innerHeight);
    camera.position.y = t * 0.2;
    moon.position.y = t * 0.2; //same as camera drop
    if(t < -500){ //change this to adjust when moon first appears
        moveMoon(t+500);
    }
    if(t > -500){
        moon.position.x = -200
    }
    if(t < -80){ //hides and shows the scroll div
        document.getElementById("scroll").classList.remove("show");
        document.getElementById("scroll").classList.add("hide");
    } else {
        document.getElementById("scroll").classList.remove("hide");
        document.getElementById("scroll").classList.add("show");
    }
    
}
document.body.onscroll = move

var graphicalHeight = document.getElementById('graphicalDescription').offsetHeight;
document.getElementById('stellarDescription').style.height = graphicalHeight+"px";
document.getElementById('lumenDescription').style.height = graphicalHeight+"px";

window.onresize = function(event) {
    var graphicalHeight = document.getElementById('graphicalDescription').offsetHeight;
    document.getElementById('stellarDescription').style.height = graphicalHeight+"px";
    document.getElementById('lumenDescription').style.height = graphicalHeight+"px";

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    move();
};

//email
document.getElementById('button').addEventListener('click', function(){
    if (!$('#emailForm')[0].checkValidity()) {
        $('#emailForm')[0].reportValidity()
    } 
    else {
        $.ajax({
            method: 'POST',
            url: 'https://formsubmit.co/ajax/harriganevan@gmail.com',
            dataType: 'json',
            accepts: 'application/json',
            data: {
                name: document.getElementById('namebox').value,
                email: document.getElementById('emailbox').value,
                message: document.getElementById('messagebox').value
            },
            success: (data) => console.log(data),
            error: (err) => console.log(err)
        });
        //clear value boxes
        document.getElementById('emailForm').reset();
        //show and fade thank you message
        document.getElementById('thanks').style.display = 'inline';
        setTimeout(() => {
            document.getElementById('thanks').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('thanks').style.display = 'none';
                document.getElementById('thanks').style.opacity = '1';
            }, 2000);
        }, 2000);
    }
});

