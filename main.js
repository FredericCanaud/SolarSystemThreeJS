var pointLight; 
var sun, plan, mercury, venus, moon, earth, mars, ring;
var earthOrbit, controls, scene, camera, renderer, scene;

var planetSegments = 48;

var mercuryData = constructPlanetData(87.97, 0.015, 10, "mercure", 0.38, planetSegments);
var venusData = constructPlanetData(224.70, 0.015, 19, "venus", 0.95, planetSegments);
var earthData = constructPlanetData(365.2564, 0.015, 25, "earth", 1, planetSegments);
var moonData = constructPlanetData(29.5, 0.01, 2.8, "moon", 0.5, planetSegments);
var marsData = constructPlanetData(686.98, 0.015, 38, "mars", 0.53, planetSegments);
var jupiterData = constructPlanetData(825.59, 0.007, 53, "jupiter", 11, planetSegments);
var saturnData = constructPlanetData(1075.23, 0.004, 78, "saturne", 8, planetSegments);
var uranusData = constructPlanetData(1485.40, 0.002, 100, "uranus", 2, planetSegments);
var neptuneData = constructPlanetData(1866.00, 0.0005, 120, "neptune", 2, planetSegments);

var orbitData = { value: 10, runOrbit: true, runRotation: true };
var clock = new THREE.Clock();

function constructPlanetData(myOrbitRate, myRotationRate, myDistanceFromAxis, myName, mySize, mySegments) {
    return {
        orbitRate: myOrbitRate
        , rotationRate: myRotationRate
        , distanceFromAxis: myDistanceFromAxis
        , name: myName
        , size: mySize
        , segments: mySegments
    };
}

function getRing(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    var ring1Material = new THREE.MeshBasicMaterial({ color: myColor, side: THREE.DoubleSide });
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

function createVisibleOrbits() {
    var orbitWidth = 0.01;
    mercuryOrbit = getRing(mercuryData.distanceFromAxis + orbitWidth * 3
        , mercuryData.distanceFromAxis - orbitWidth*3
        , 640
        , 0xffffff
        , "mercuryOrbit"
        , 0);
    venusOrbit = getRing(venusData.distanceFromAxis + orbitWidth
        , venusData.distanceFromAxis - orbitWidth
        , 640
        , 0xffffff
        , "venusOrbit"
        , 0);
    earthOrbit = getRing(earthData.distanceFromAxis + orbitWidth
        , earthData.distanceFromAxis - orbitWidth
        , 640
        , 0xffffff
        , "earthOrbit"
        , 0);
    marsOrbit = getRing(marsData.distanceFromAxis + orbitWidth
        , marsData.distanceFromAxis - orbitWidth
        , 640
        , 0xffffff
        , "marsOrbit"
        , 0);
    jupiterOrbit = getRing(jupiterData.distanceFromAxis + orbitWidth
        , jupiterData.distanceFromAxis - orbitWidth
        , 640
        , 0xffffff
        , "jupiterOrbit"
        , 0);
    saturnOrbit = getRing(saturnData.distanceFromAxis + orbitWidth
        , saturnData.distanceFromAxis - orbitWidth
        , 640
        , 0xffffff
        , "saturnOrbit"
        , 0);
    uranusOrbit = getRing(uranusData.distanceFromAxis + orbitWidth
        , uranusData.distanceFromAxis - orbitWidth
        , 640
        , 0xffffff
        , "saturnOrbit"
        , 0);
    neptuneOrbit = getRing(neptuneData.distanceFromAxis + orbitWidth
        , neptuneData.distanceFromAxis - orbitWidth
        , 640
        , 0xffffff
        , "saturnOrbit"
        , 0);
}

function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
}

function getPointLight(intensity, color) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

function movePlanet(myPlanet, myData, myTime, stopRotation) {
    if (orbitData.runRotation && !stopRotation) {
        myPlanet.rotation.y += myData.rotationRate;
    }
    if (orbitData.runOrbit) {
        myPlanet.position.x = Math.cos(myTime
            * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0)
            * myData.distanceFromAxis;
        myPlanet.position.z = Math.sin(myTime
            * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0)
            * myData.distanceFromAxis;
    }
}

function moveMoon(myMoon, myPlanet, myData, myTime) {
    movePlanet(myMoon, myData, myTime);
    if (orbitData.runOrbit) {
        myMoon.position.x = myMoon.position.x + myPlanet.position.x;
        myMoon.position.z = myMoon.position.z + myPlanet.position.z;
    }
}

function animate() {
    pointLight.position.copy(sun.position);
    controls.update();

    var time = Date.now();

    movePlanet(earth, earthData, time);
    movePlanet(mercury, mercuryData, time);
    movePlanet(venus, venusData, time);
    movePlanet(earth, earthData, time);
    movePlanet(mars, marsData, time);
    movePlanet(jupiter, jupiterData, time);
    movePlanet(saturn, saturnData, time);
    movePlanet(uranus, uranusData, time);
    movePlanet(neptune, neptuneData, time);

    moveMoon(moon, earth, moonData, time);
    movePlanet(saturnRing, saturnData, time, true);
    movePlanet(saturnRing2, saturnData, time, true);
    movePlanet(uranusRing, uranusData, time, true);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function init() {

    camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        1,
        1000
    );
    camera.position.z = 30;
    camera.position.x = -30;
    camera.position.y = 30;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    var sunMaterial = new THREE.MeshBasicMaterial({ color: 0xf2e313 });
    var sunGeometry = new THREE.SphereGeometry(8, 24, 24);
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    var planGeometry = new THREE.PlaneGeometry(100, 250, 50);
    var whiteMaterial = new THREE.MeshBasicMaterial({ color: 0x615e5e, side: THREE.DoubleSide });
    plan = new THREE.Mesh(planGeometry, whiteMaterial);
    plan.rotation.x = Math.PI / 2;
    plan.position.y -= 25;
    scene.add(plan);

    mercuryMaterial = new THREE.MeshLambertMaterial({ color: 0xd7711c });
    mercuryMaterial.receiveShadow = true;
    mercuryMaterial.castShadow = true;
    mercuryGeometry = new THREE.SphereGeometry(mercuryData.size);
    mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    mercury.receiveShadow = true;
    mercury.position.set(mercuryData.distanceFromAxis, 0, 0);
    scene.add(mercury);

    venusMaterial = new THREE.MeshLambertMaterial({ color: 0xd7711c });
    venusMaterial.receiveShadow = true;
    venusMaterial.castShadow = true;
    venusGeometry = new THREE.SphereGeometry(venusData.size);
    venus = new THREE.Mesh(venusGeometry, venusMaterial);
    venus.receiveShadow = true;
    venus.position.set(venusData.distanceFromAxis, 0, 0);
    scene.add(venus);

    earthMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    earthMaterial.receiveShadow = true;
    earthMaterial.castShadow = true;
    earthGeometry = new THREE.SphereGeometry(earthData.size);
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.receiveShadow = true;
    earth.position.set(earthData.distanceFromAxis, 0, 0);
    scene.add(earth);

    moonMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    moonMaterial.receiveShadow = true;
    moonMaterial.castShadow = true;
    moonGeometry = new THREE.SphereGeometry(moonData.size);
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.receiveShadow = true;
    moon.position.set(moonData.distanceFromAxis, 0, 0);
    scene.add(moon);

    marsMaterial = new THREE.MeshLambertMaterial({ color: 0xff4800 });
    marsMaterial.receiveShadow = true;
    marsMaterial.castShadow = true;
    marsGeometry = new THREE.SphereGeometry(marsData.size);
    mars = new THREE.Mesh(marsGeometry, marsMaterial);
    mars.receiveShadow = true;
    mars.position.set(marsData.distanceFromAxis, 0, 0);
    scene.add(mars);

    jupiterMaterial = new THREE.MeshLambertMaterial({ color: 0xbfad99 });
    jupiterMaterial.receiveShadow = true;
    jupiterMaterial.castShadow = true;
    jupiterGeometry = new THREE.SphereGeometry(jupiterData.size);
    jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    jupiter.receiveShadow = true;
    jupiter.position.set(jupiterData.distanceFromAxis, 0, 0);
    scene.add(jupiter);

    saturnMaterial = new THREE.MeshLambertMaterial({ color: 0xd1a575 });
    saturnMaterial.receiveShadow = true;
    saturnMaterial.castShadow = true;
    saturnGeometry = new THREE.SphereGeometry(saturnData.size);
    saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
    saturn.receiveShadow = true;
    saturn.position.set(saturnData.distanceFromAxis, 0, 0);
    scene.add(saturn);

    uranusMaterial = new THREE.MeshLambertMaterial({ color: 0x45dfed });
    uranusMaterial.receiveShadow = true;
    uranusMaterial.castShadow = true;
    uranusGeometry = new THREE.SphereGeometry(uranusData.size);
    uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
    uranus.receiveShadow = true;
    uranus.position.set(uranusData.distanceFromAxis, 0, 0);
    scene.add(uranus);

    neptuneMaterial = new THREE.MeshLambertMaterial({ color: 0x146cc4 });
    neptuneMaterial.receiveShadow = true;
    neptuneMaterial.castShadow = true;
    neptuneGeometry = new THREE.SphereGeometry(neptuneData.size);
    neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
    neptune.receiveShadow = true;
    neptune.position.set(neptuneData.distanceFromAxis, 0, 0);
    scene.add(neptune);

    saturnRing = getRing(9.3, 8.3, 480, 0x757064, "ring", saturnData.distanceFromAxis);
    saturnRing2 = getRing(10.3, 9.6, 480, 0x757064, "ring2", saturnData.distanceFromAxis);

    uranusRing = getRing(3.6, 3.3, 480, 0x4fbfff, "ring", uranusData.distanceFromAxis);

    createVisibleOrbits();

    var gui = new dat.GUI();
    var folder1 = gui.addFolder('light');
    folder1.add(pointLight, 'intensity', 0, 10);
    var folder2 = gui.addFolder('speed');
    folder2.add(orbitData, 'value', 1, 10);
    folder2.add(orbitData, 'runOrbit', 0, 1);
    folder2.add(orbitData, 'runRotation', 0, 1);
}

init();
animate();
