/* 
    SolarSystemThreeJS/functions.js
    Auteur/Author : Frédéric CANAUD
*/

/**
 * Stocke les caractéristiques propres à une planète dans un objet, pour éviter les nombres magiques dans le code des fonctions
 * Stores the planet properties in an object, to avoid magic numbers in the function code
 * @param {type} orbitRate Vitesse orbitale
 * @param {type} rotationRate Vitesse de rotation
 * @param {type} distanceFromOrbitCenter Distance du centre de l'objet autour duquel orbite l'astre (Soleil ou autre planète s'il s'agit d'une lune)
 * @param {type} size Taille de la planète (Rayon)
 * @param {type} color Couleur d'une planète (Sans textures) / Planet color (without textures)
 * @returns {THREE.Mesh}
 */
function definePlanet(orbitRate, rotationRate, distanceFromOrbitCenter, size, color) {
    return {
        orbitRate: orbitRate,
        rotationRate: rotationRate,
        distanceFromOrbitCenter: distanceFromOrbitCenter,
        size: size,
        color: color
    };
}



/**
 * Idem que la fonction definePlanet, avec une texture à la place d'une couleur
 * Same as the definePlanet function, with texture instead of color
 * @param {type} orbitRate Vitesse orbitale
 * @param {type} rotationRate Vitesse de rotation
 * @param {type} distanceFromOrbitCenter Distance du centre de l'objet autour duquel orbite l'astre (Soleil ou autre planète s'il s'agit d'une lune)
 * @param {type} size Taille de la planète (Rayon)
 * @param {type} texture Texture de la planète / Planet texture
 * @returns {THREE.Mesh}
 */
function defineTexturedPlanet(orbitRate, rotationRate, distanceFromOrbitCenter, size, texture) {
    return {
        orbitRate: orbitRate,
        rotationRate: rotationRate,
        distanceFromOrbitCenter: distanceFromOrbitCenter,
        size: size,
        texture: texture
    };
}



/**
 * Stocke les caractéristiques propres à un anneau dans un objet, pour éviter les nombres magiques dans le code des fonctions
 * Stores the ring properties in an object, to avoid magic numbers in the function code
 * @param {type} size Taille de la couronne extérieure
 * @param {type} innerDiameter Taille de la couronne extérieure
 * @param {type} distanceFromOrbitCenter Distance du centre de l'objet autour duquel orbite l'anneau (Soleil ou autre planète s'il s'agit d'un)
 * @param {type} color Couleur d'une planète (Sans textures) / Planet color (without textures)
 * @returns {THREE.Mesh}
 */
function defineRing(size, innerDiameter, distanceFromOrbitCenter, color) {
    return {
        size: size,
        innerDiameter: innerDiameter,
        distanceFromOrbitCenter: distanceFromOrbitCenter,
        color: color
    };
}



/**
 * Initialise la planète et l'ajoute à la scène / Initialize the planet et add it to the scene.
 * @param {type} planetData Données de la planète
 * @returns {THREE.Mesh}
 */
function createPlanet(planetData){
    var planetMaterial = new THREE.MeshStandardMaterial({ color: planetData.color });
    planetMaterial.receiveShadow = true;
    planetMaterial.castShadow = true;
    var planetGeometry = new THREE.SphereGeometry(planetData.size);
    planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.receiveShadow = true;
    planet.position.set(planetData.distanceFromOrbitCenter, 0, 0);
    scene.add(planet);
    return planet;
}



/**
 * Idem que la fonction createPlanet, avec une texture à la place d'une couleur
 * Same as the createPlanet function, with texture instead of color 
 * @param {type} planetData Données de la planète
 * @returns {THREE.Mesh}
 */
function createTexturedPlanet(planetData){
    const texture = new THREE.TextureLoader().load( planetData.texture );
    var planetMaterial = new THREE.MeshStandardMaterial({ map: texture });
    planetMaterial.receiveShadow = true;
    planetMaterial.castShadow = true;
    var planetGeometry = new THREE.SphereGeometry(planetData.size);
    planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.receiveShadow = true;
    planet.position.set(planetData.distanceFromOrbitCenter, 0, 0);
    scene.add(planet);
    return planet;
}




/**
 * Initialise l'anneau et l'ajoute à la scène / Initialize the ring et add it to the scene.
 * @param {type} ringData Données de l'anneau
 * @returns {THREE.Mesh}
 */
function createRing(ringData) {
    var ringGeometry = new THREE.RingGeometry(ringData.size, ringData.innerDiameter, 320);
    var ringMaterial = new THREE.MeshStandardMaterial({ color: ringData.color, side: THREE.DoubleSide });
    var ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(ringData.distanceFromOrbitCenter, 0, 0);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    return ring;
}



/**
 *  Dessine la trajectoire des orbites des planètes tournant autour du Soleil
 *  orbitWidth = Epaisseur de l'anneau représentant l'orbite de la planète
 *  Le rayon de l'anneau est donc la distance entre le soleil et la planète
 *  Le troisième paramètre est toujours défini à zéro afin de positionner le centre de l'anneau au centre du soleil
 *  ___________________________________________________________________________
 *  Draw the trajectory of the orbits of the planets revolving around the Sun
 *  The radius of the ring is therefore the distance between the sun and the planet
 *  Third parameter is always set to zero in order to set the center of the ring at the center of the sun
 *  @returns {undefined}
 */
function traceOrbits() {
    var orbitWidth = 0.08;
    mercuryOrbit = createRing(defineRing(mercuryData.distanceFromOrbitCenter + orbitWidth, mercuryData.distanceFromOrbitCenter - orbitWidth, 0, 0xffffff));
    venusOrbit = createRing(defineRing(venusData.distanceFromOrbitCenter + orbitWidth, venusData.distanceFromOrbitCenter - orbitWidth, 0, 0xffffff));
    earthOrbit = createRing(defineRing(earthData.distanceFromOrbitCenter + orbitWidth, earthData.distanceFromOrbitCenter - orbitWidth, 0, 0xffffff));
    marsOrbit = createRing(defineRing(marsData.distanceFromOrbitCenter + orbitWidth, marsData.distanceFromOrbitCenter - orbitWidth, 0, 0xffffff));
    jupiterOrbit = createRing(defineRing(jupiterData.distanceFromOrbitCenter + orbitWidth, jupiterData.distanceFromOrbitCenter - orbitWidth, 0, 0xffffff));
    saturnOrbit = createRing(defineRing(saturnData.distanceFromOrbitCenter + orbitWidth, saturnData.distanceFromOrbitCenter - orbitWidth, 0, 0xffffff));
    uranusOrbit = createRing(defineRing(uranusData.distanceFromOrbitCenter + orbitWidth, uranusData.distanceFromOrbitCenter - orbitWidth, 0, 0xffffff));
    neptuneOrbit = createRing(defineRing(neptuneData.distanceFromOrbitCenter + orbitWidth, neptuneData.distanceFromOrbitCenter - orbitWidth, 0, 0xffffff));
}



/**
 * Déplace une planète autour de son orbite et la fait touner sur elle-même ou un anneau autour de sa planète
 * Move a planet around its orbit and rotate it or move a ring aroung its planet
 * @param {type} planet
 * @param {type} planetData
 * @param {type} time
 * @param {type} isRing Pour ne pas que les anneaux tournent sur eux-mêmes
 * @returns {undefined}
 */
function movePlanet(planet, planetData, time, isRing) {
    // Si le taux de rotation est différent de zéro et ce n'est pas un anneau, 
    // alors on fait tourner la planète ou la lune sur elle-même

    // If the rotation rate is nonzero and it is not a ring,
    // then we rotate the planet or the moon on itself
    if (orbitData.runRotation && !isRing) {
        planet.rotation.y += planetData.rotationRate;
    }

    // Si le taux d'orbite est différent de zéro, 
    // alors on fait tourner la planète ou l'anneau autour de son orbite

    // If the orbit rate is nonzero,
    // then we rotate the planet or the ring around its orbit
    if (orbitData.runOrbit) {

        // En prenant un cercle trigonométrique avec un rayon équivalent à la distance de l'objet à son centre orbital,
        //      On fait osciller la position de x et de y entre -(distanceDeSonOrbite) et +(distanceDeSonOrbite),
        //      en fonction du temps, de la vitesse orbitale de la planète et de vitesse paramétrée dans dat.gui
        planet.position.x = Math.cos(time
            * (1.0 / (planetData.orbitRate * orbitData.value)) + 10.0)
            * planetData.distanceFromOrbitCenter;
            
        planet.position.z = Math.sin(time
            * (1.0 / (planetData.orbitRate * orbitData.value)) + 10.0)
            * planetData.distanceFromOrbitCenter;
    }
}



/**
 * Déplace une planète autour de son orbite et la fait touner sur elle-même ou un anneau autour de sa planète
 * Move a planet around its orbit and rotate it or move a ring aroung its planet
 * @param {type} planet
 * @param {type} planetData
 * @param {type} time
 * @param {type} isRing Pour ne pas que les anneaux tournent sur eux-mêmes
 * @returns {undefined}
 */

function moveMoon(moon, planet, planetData, time) {
    movePlanet(moon, planetData, time);
    if (orbitData.runOrbit) {
        moon.position.x = moon.position.x + planet.position.x;
        moon.position.z = moon.position.z + planet.position.z;
    }
}