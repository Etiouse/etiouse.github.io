
/*
  Laboratoire personnel pour le cours
  d'Algorithmes numériques

  Hüsler Etienne
  Développement logiciel et multimédia classe A
  02.07.2018
*/

// Variables
let planets = [];
let savedPlanets = [];
let realPlanets = [];
let realPlanetIndex = 0;
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let placing = false;
let placed = false;
let placingImage = document.getElementById("placingPlanet");
let placeImagePos;
let displayNames = true;
let displayTrajectories = true;
let blackhole;
let ratioDistance = 1.971 * Math.pow(10, 10);
let G = 6.67 * Math.pow(10, -11);
let FPS = 200;
let canvasPos;
let moveCanvasLeft = 0;
let moveCanvasRight = 0;
let moveCanvasUp = 0;
let moveCanvasDown = 0;
let cameraSpeed = 5;
let simulationSpeed = 2419200 / FPS;
let blackholeMassThreshold = Math.pow(10, 34);
let ratio = 1;
let updateLoop;

// Initialisation de la simulation au lancement de la page
window.onload = init;

// Initialise la simulation
function init()
{
  // Préparation des trous noirs
  blackhole = new Image();
  blackhole.src = 'src/blackhole.png';

  // Instanciation des positions pour le déplacement du canvas
  canvasPos = new Vector(0, 0);
  placeImagePos = new Vector(0, 0);

  // Génération des planètes et préparation au lancement
  instantiateRealPlanets();
  clearSimulation();
  generateSolarSystem();
  changeRatio();

  // Fonction pour le déplacement automatique du canvas
  setInterval(function () {
      let moveCanvasX = moveCanvasLeft + moveCanvasRight;
      let moveCanvasY = moveCanvasUp + moveCanvasDown;
      canvasPos.setX(canvasPos.getX() + cameraSpeed * moveCanvasX / ratio);
      canvasPos.setY(canvasPos.getY() + cameraSpeed * moveCanvasY / ratio);
      document.getElementById("background").style.backgroundPosition =
        (canvasPos.getX() + cameraSpeed * moveCanvasX / (2 * ratio)) + "px " +
        (canvasPos.getY() + cameraSpeed * moveCanvasY / (2 * ratio)) + "px";
      draw();
    }, 10);
}

// Importe et crée les différentes planètes pour la simulation
function instantiateRealPlanets()
{
  let sun = new Image();
  sun.src = 'src/sun.png';
  realPlanets.push(new Planet(new Vector(0, 0), new Vector(0, 0), 8e10, 2.002e30, sun, sun.src, "Sun", simulationSpeed));

  let mercury = new Image();
  mercury.src = 'src/mercury.png';
  realPlanets.push(new Planet(new Vector(5.790e10, 0), new Vector(0, 47870), 2e10, 3.301e23, mercury, mercury.src, "Mercury", simulationSpeed));

  let earth = new Image();
  earth.src = 'src/earth.png';
  realPlanets.push(new Planet(new Vector(1.496e11, 0), new Vector(0, 29780), 2e10, 5.972e24, earth, earth.src, "Earth", simulationSpeed));

  let venus = new Image();
  venus.src = 'src/venus.png';
  realPlanets.push(new Planet(new Vector(1.082e11, 0), new Vector(0, 35020), 2e10, 4.867e24, venus, venus.src, "Venus", simulationSpeed));

  let mars = new Image();
  mars.src = 'src/mars.png';
  realPlanets.push(new Planet(new Vector(2.279e11, 0), new Vector(0, 24070), 2e10, 6.417e23, mars, mars.src, "Mars", simulationSpeed));

  let jupiter = new Image();
  jupiter.src = 'src/jupiter.png';
  realPlanets.push(new Planet(new Vector(7.783e11, 0), new Vector(0, 13070), 3e10, 1.899e27, jupiter, jupiter.src, "Jupiter", simulationSpeed));

  let saturn = new Image();
  saturn.src = 'src/saturn.png';
  realPlanets.push(new Planet(new Vector(1.427e12, 0), new Vector(0, 9690), 3e10, 5.685e26, saturn, saturn.src, "Saturn", simulationSpeed));

  let uranus = new Image();
  uranus.src = 'src/uranus.png';
  realPlanets.push(new Planet(new Vector(2.871e12, 0), new Vector(0, 6810), 2e10, 8.682e25, uranus, uranus.src, "Uranus", simulationSpeed));

  let neptune = new Image();
  neptune.src = 'src/neptune.png';
  realPlanets.push(new Planet(new Vector(4.497e12, 0), new Vector(0, 5430), 2e10, 1.024e26, neptune, neptune.src, "Neptune", simulationSpeed));

  let pluto = new Image();
  pluto.src = 'src/pluto.png';
  realPlanets.push(new Planet(new Vector(5.913e12, 0), new Vector(0, 4670), 2e10, 1.471e22, pluto, pluto.src, "Pluto", simulationSpeed));
}

// Calcul du ratio pour le zoom
function changeRatio()
{
  let min = document.getElementById("range").min;
  let max = document.getElementById("range").max;
  let range = max - min;
  let value = document.getElementById("range").value + 1;
  let scale = 1;
  let minZoom = 1;
  ratio = Math.pow(2, (value / max) * scale);
}

// Fonction asynchrone pour générer un système solaire
async function generateSolarSystem()
{
  // Attente pour permettre la fin de l'importation des images
  await sleep(100);

  // Ajoute les planètes une à une
  for (let i = 0; i < realPlanets.length; i++)
  {
    let newPlanet = copyPlanet(realPlanets[i]);
    newPlanet.setSimulationSpeed(simulationSpeed);
    addPlanetToSystem(newPlanet);
  }

  // Dessine le résultat
  draw();
}

// Permet d'endormir l'application le temps que les images se chargent
function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Affichage du menu d'ajout de planètes
function addPlanet()
{
  document.getElementById("divPlanetCreation").style.display = "block";
  document.getElementById("divAdd").style.display = "none";
  displayRealPlanet();
}

// Affichage de l'aide
function displayHelp()
{
  document.getElementById("help").style.display = "block";
  document.getElementById("divHelp").style.display = "none";
}

// Cache l'aide
function quitHelp()
{
  document.getElementById("help").style.display = "none";
  document.getElementById("divHelp").style.display = "block";
}

// Cache le menu d'ajout de planètes
function cancel()
{
  document.getElementById("divPlanetCreation").style.display = "none";
  document.getElementById("divAdd").style.display = "block";
}

// Affiche la planète qui va être ajoutée avec ses caractéristiques dans son menu
function displayRealPlanet()
{
  let planet = realPlanets[realPlanetIndex];
  document.getElementById("planetName").innerHTML = planet.getName();
  document.getElementById("planetImage").src = planet.getImageSrc();
  document.getElementById("mass").value = planet.getMass();
  document.getElementById("diameter").value = planet.getSize().toExponential();
  document.getElementById("velocityX").value = planet.getVelocity().getX();
  document.getElementById("velocityY").value = planet.getVelocity().getY();
}

// Affiche en survol la planète qui va être ajoutée sous la souris
function placePlanet()
{
  document.getElementById("divPlanetCreation").style.display = "none";
  document.getElementById("divAdd").style.display = "block";
  placing = true;
  placingImage.src = realPlanets[realPlanetIndex].getImageSrc();
}

// Modification de l'échelle du temps
function adaptTime()
{
  let time = document.getElementById('select').value;
  switch(time)
  {
    case "seconds":
      setSimulationSpeed(1 / FPS);
      break;
    case "minutes":
      setSimulationSpeed(60 / FPS);
      break;
    case "hours":
      setSimulationSpeed(360 / FPS);
      break;
    case "days":
      setSimulationSpeed(86400 / FPS);
      break;
    case "weeks":
      setSimulationSpeed(604800 / FPS);
      break;
    case "months":
      setSimulationSpeed(2419200 / FPS);
      break;
    case "years":
      setSimulationSpeed(29030400 / FPS);
      break;
    default:
      setSimulationSpeed(1);
  }
}

// Modification du temps de la simulation et de ses planètes
function setSimulationSpeed(newSimulationSpeed)
{
  simulationSpeed = newSimulationSpeed;
  for (let i = 0; i < planets.length; i++)
  {
    planets[i].setSimulationSpeed(newSimulationSpeed);
  }
}

// Permet d'ajouter une planète à la simulation lors du survol d'ajout
canvas.onmousedown = function(e)
{
  // Si l'utilisateur est en train d'ajouter une planète
  if (placing)
  {
    placing = false;
    placed = true;

    // Création de la planète
    let realPlanet = realPlanets[realPlanetIndex];
    let mass = document.getElementById("mass").value;
    let size = document.getElementById("diameter").value;
    let velocityX = document.getElementById("velocityX").value;
    let velocityY = document.getElementById("velocityY").value;
    let planet = new Planet(new Vector(ratioDistance * ((e.pageX - (canvas.width / 2) - ratio*canvasPos.getX()) / ratio),
                                       ratioDistance * ((e.pageY - (canvas.height / 2) - ratio*canvasPos.getY()) / ratio)),
                            new Vector(velocityX, velocityY),
                            size, mass, realPlanet.getImage(), realPlanet.getImageSrc(), realPlanet.getName(), simulationSpeed);

    // Adapte la simulation
    addPlanetToSystem(planet);
    draw();
  }
}

// Bouge la planète en survol lors de son ajout
canvas.onmousemove = function(e)
{
  let size = document.getElementById("diameter").value / ratioDistance;
  placeImagePos.setX(e.pageX - ((size * ratio) / 2) - (canvas.width / 2));
  placeImagePos.setY(e.pageY - ((size * ratio) / 2) - (canvas.height / 2));
}

// Adapte le canvas à la fenêtre
function resize()
{
  canvas.width = window.innerWidth - 1;
  canvas.height = window.innerHeight - 5;

  context.translate(canvas.width / 2, canvas.height / 2);
  draw();
}

// Démarrage de la simulation
function startSimulation()
{
  document.getElementById('startButton').disabled = true;
  document.getElementById('pauseButton').disabled = false;
  document.getElementById('resetButton').disabled = false;
  updateLoop = window.setInterval(function(){
    update();
  }, 1000 / FPS);
}

// Stop la simulation temporairement
function pauseSimulation()
{
  if (document.getElementById('pauseButton').innerHTML == "Play ")
  {
    document.getElementById('pauseButton').innerHTML = "Pause";
    updateLoop = window.setInterval(function(){
      update();
    }, 16);
  } else
  {
    document.getElementById('pauseButton').innerHTML = "Play ";
    clearInterval(updateLoop);
  }
}

// Gestion de l'affichage des noms
function checkNames()
{
  if (document.getElementById('checkboxNames').checked)
  {
    displayNames = true;
  } else
  {
    displayNames = false;
  }
}

// Gestion de l'affichage des trajectoires
function checkTrajectories()
{
  if (document.getElementById('checkboxTrajectories').checked)
  {
    displayTrajectories = true;
  } else
  {
    displayTrajectories = false;
  }
}

// Replace toutes les planètes à leur position initale et met tout en pause
function resetSimulation()
{
  clearInterval(updateLoop);
  document.getElementById('startButton').disabled = false;
  document.getElementById('pauseButton').innerHTML = "Pause";
  document.getElementById('pauseButton').disabled = true;
  document.getElementById('resetButton').disabled = true;
  document.getElementById('addButton').disabled = false;
  planets = copyPlanets(savedPlanets);
  draw();
}

// Efface la totalité de la simulation
function clearSimulation()
{
  clearInterval(updateLoop);
  document.getElementById('startButton').disabled = false;
  document.getElementById('pauseButton').disabled = true;
  document.getElementById('resetButton').disabled = true;
  document.getElementById('addButton').disabled = false;
  document.getElementById('pauseButton').innerHTML = "Pause";
  planets = [];
  savedPlanets = [];
  resize();
  draw();
}

// Affiche le menu d'aide
function showHelp()
{

}

// Rafraichissement de la simulation
function update()
{
  // Déplacement de planètes
  for (let i = 0; i < planets.length; i++)
  {
    planets[i].move();
  }

  // Application des forces sur tout le système
  for (let i = 0; i < planets.length; i++)
  {
    let p1 = planets[i];
    for (let j = 0; j < planets.length; j++)
    {
      let p2 = planets[j];
      // Evite les interactions avec sois-même
      if (i != j)
      {
        let colliding = collision(p1, p2);
        // Si les planètes ne sont pas en collision
        if (!colliding)
        {
          // Calcul de la force
          let sep = new Vector(p2.getPos().getX() - p1.getPos().getX(), p2.getPos().getY() - p1.getPos().getY());
          let distance = Math.sqrt(sep.getX()*sep.getX() + sep.getY()*sep.getY());
          let direction = sep.div(distance);
          let force = gravitationalForce(p1.getMass(), p2.getMass(), distance);
          let acceleration = force / p1.getMass();
          let speedVector = direction.mult(acceleration * simulationSpeed);
          p1.updateVelocity(speedVector);
        }
      }
    }
  }

  // Draw the planets
  draw();
}

// Vérification de collisions entre deux plaètes
function collision(p1, p2)
{
  // Distance en pixels
  let sepPix = new Vector(p2.getCollisionX() - p1.getCollisionX(), p2.getCollisionY() - p1.getCollisionY());
  let distancePix = Math.sqrt(sepPix.getX()*sepPix.getX() + sepPix.getY()*sepPix.getY());

  // Distance en mètres
  let sep = new Vector(p2.getPos().getX() - p1.getPos().getX(), p2.getPos().getY() - p1.getPos().getY());
  let distance = Math.sqrt(sep.getX()*sep.getX() + sep.getY()*sep.getY());
  let direction = sep.div(distance);

  // Collision
  if (distancePix < (p1.getDrawSize() / 3) ||  distancePix < (p2.getDrawSize() / 3))
  {
    let pHeavier;
    let pLighter;
    let sign;

    // Répartition des rôles
    if (Number(p1.getMass()) > Number(p2.getMass()))
    {
      pHeavier = p1;
      pLighter = p2;
      sign = 1;
    } else
    {
      pHeavier = p2;
      pLighter = p1;
      sign = -1;
    }

    // Modification de la vélocité de la planète la plus lourde
    let massRatio =  Number(pLighter.getMass()) / Number(pHeavier.getMass());
    let velocityToAdd = pLighter.getVelocity().mult(massRatio);
    pHeavier.setVelocity(pHeavier.getVelocity().add(velocityToAdd));

    // Si la masse excède la limite de masse, transforme la planète en trou noir
    let newMass = Number(pHeavier.getMass()) + Number(pLighter.getMass());
    if (newMass > blackholeMassThreshold)
    {
      pHeavier.setImage(blackhole);
    }

    // Modifie la taille et la masse de la planète
    pHeavier.setMass(newMass);
    let newVolume = (4.0 / 3.0) * Math.PI * Math.pow(Number(pHeavier.getSize()), 3) + (4.0 / 3.0) * Math.PI * Math.pow(Number(pLighter.getSize()), 3);
    pHeavier.setSize(Math.cbrt(newVolume / ((4.0 / 3.0) * Math.PI)).toExponential());

    // Efface la planète la plus légère
    let index = planets.indexOf(pLighter);
    if (index > -1)
    {
        planets.splice(index, 1);
    }
    return true;
  } else
  {
    return false;
  }
  return false;
}

// Dessin de la simulation
function draw()
{
  // Supprime tout le canvas
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();

  // Dessine tout le contenu du canvas
  context.save();
  context.scale(ratio, ratio);
  for (let i = 0; i < planets.length; i++)
  {
    // Dessin de la trajectoire
    if (displayTrajectories)
    {
      let trace = planets[i].getTrace();
      if (trace.length > 0)
      {
        context.beginPath();
        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.lineWidth = 1 / ratio;
        context.moveTo(trace[0].getX() + canvasPos.getX(), trace[0].getY() + canvasPos.getY());
        for (let j = 1; j < trace.length; j++)
        {
          context.lineTo(trace[j].getX() + canvasPos.getX(), trace[j].getY() + canvasPos.getY());
        }
        context.stroke();
      }
    }
  }

  // Séparation des boucles for afin d'afficher les trajectoires en arrière plan
  for (let i = 0; i < planets.length; i++)
  {
    // Regarde si la planète est à l'écran
    if (isOnScreen(planets[i]))
    {
      // Dessin de la planète
      let size = planets[i].getDrawSize();
      let posName = Math.sqrt(0.5 * Math.pow(size / 2, 2));
      let posX = planets[i].getDrawX() + canvasPos.getX();
      let posY = planets[i].getDrawY() + canvasPos.getY();
      let length = 50 / ratio;
      context.drawImage(planets[i].getImage(), posX, posY, size, size);

      // Affichage de son nom
      if (displayNames)
      {
        context.beginPath();
        context.font = (14 / ratio) + "px Arial";
        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.lineWidth = 1 / ratio;
        context.moveTo(posX + (size / 4) + posName, posY - (size / 4) + 1.52 * posName);
        context.lineTo(posX + (size / 4) + posName + length, posY - (size / 4) + 1.52 * posName - length);
        context.lineTo(posX + (size / 4) + posName + length + 8 * (planets[i].getName().length / ratio), posY - (size / 4) + 1.52 * posName - length);
        context.stroke();
        context.fillText(planets[i].getName(), posX + (size / 4) + posName + length, posY - (size / 4) + 1.52 * posName - length - 3 / ratio);
      }
    }
  }
  context.restore();

  // Dessine la planète en prévisualisation d'ajout
  if (placing)
  {
    let size = document.getElementById("diameter").value / ratioDistance;
    context.drawImage(placingImage, placeImagePos.getX(), placeImagePos.getY(), size * ratio, size * ratio);
  }
}

// Regarde si une planète est à l'écran ou en dehors
function isOnScreen(planet)
{
  let px = planet.getDrawX() + planet.getDrawSize() / 2;
  let py = planet.getDrawY() + planet.getDrawSize() / 2;
  let cx = -canvasPos.getX();
  let cy = -canvasPos.getY();
  let w = canvas.width / ratio;
  let h = canvas.height / ratio;
  let s = planet.getDrawSize() / 2;

  let isIn = (px > (cx - w/2 - s/2) && px < (cx + w/2 + s/2) && py > (cy - h/2 - s/2) && py < (cy + h/2 + s/2));
  // Dessine un indicateur de position si hors de l'écran
  if (!isIn)
  {
    let indicatorX;
    let indicatorY;
    // Détermine de quel côté de l'écran la planète se trouve
    if (px < (cx - w/2) && py < (cy - h/2)) // En haut à gauche
    {
      indicatorX = - w/2;
      indicatorY = - h/2;
    } else if (px < (cx - w/2) && py > (cy + h/2)) // En bas à gauche
    {
      indicatorX = - w/2;
      indicatorY = h/2;
    } else if (px > (cx + w/2) && py > (cy + h/2)) // En bas à droite
    {
      indicatorX = w/2;
      indicatorY = h/2;
    } else if (px > (cx + w/2) && py < (cy - h/2)) // En haut à droite
    {
      indicatorX = w/2;
      indicatorY = - h/2;
    } else if (px < (cx - w/2 - s/2)) // A gauche
    {
      indicatorX = - w/2;
      indicatorY = py - cy;
    } else if (px > (cx + w/2)) // A droite
    {
      indicatorX = w/2;
      indicatorY = py - cy;
    } else if (py < (cy - h/2)) // En haut
    {
      indicatorX = px - cx;
      indicatorY = - h/2;
    } else if (py > (cy + h/2)) // En bas
    {
      indicatorX = px - cx;
      indicatorY = h/2;
    }

    // Dessin de l'indicateur
    let circle = new Path2D();
    context.fillStyle = "white";
    circle.arc(indicatorX, indicatorY, 10 / ratio, 0, 2 * Math.PI);
    context.fill(circle);
  }

  return isIn;
}

// Copie profonde d'une liste de planètes
function copyPlanets(planetsToCopy)
{
  let result = [];
  for (let i = 0; i < planetsToCopy.length; i++)
  {
    result.push(copyPlanet(planetsToCopy[i]));
  }
  return result;
}

// Copie profonde d'une planète pour la sauvegarde
function copyPlanet(planetToCopy)
{
  return new Planet(
    new Vector(planetToCopy.getPos().getX(), planetToCopy.getPos().getY()),
    new Vector(planetToCopy.getVelocity().getX(), planetToCopy.getVelocity().getY()),
    planetToCopy.getSize(), planetToCopy.getMass(), planetToCopy.getImage(), planetToCopy.getImageSrc(), planetToCopy.getName(), simulationSpeed);
}

// Ajoute une planète au système et en ajoute une copie pour la sauvegarde
function addPlanetToSystem(planetToAdd)
{
  planets.push(copyPlanet(planetToAdd));
  savedPlanets.push(copyPlanet(planetToAdd));
}

// Bouton pour choir la planète à gauche dans le menu d'ajout
function leftChange()
{
  realPlanetIndex--;
  if (realPlanetIndex < 0)
  {
    realPlanetIndex = realPlanets.length - 1;
  }
  displayRealPlanet();
}

// Bouton pour choir la planète à droite dans le menu d'ajout
function rightChange()
{
  realPlanetIndex++;
  if (realPlanetIndex > realPlanets.length - 1)
  {
    realPlanetIndex = 0;
  }
  displayRealPlanet();
}

// Calcul de la force gravitationelle entre deux planètes
function gravitationalForce(m1, m2, d)
{
  // Evite une division par 0
  if (d == 0)
  {
    d = 1;
  }
  return G * ((m1 * m2) / (d * d));

}

// Gestion des touches du clavier (pressées)
function keyDown(e)
{
  if (document.getElementById("divAdd").style.display !== 'none')
  {
    var code = e.keyCode;
    switch (code) {
      case 32: // Barre d'espace (centre la caméra)
        canvasPos.setX(0);
        canvasPos.setY(0);
        break;
      case 37: // Flèche gauche
        moveCanvasLeft = 1;
        break;
      case 38: // Flèche du haut
        moveCanvasUp = 1;
        break;
      case 39: // Flèche droite
        moveCanvasRight = -1;
        break;
      case 40: // Flèche du bas
        moveCanvasDown = -1;
        break;
      case 65: // A (Sélectionne la dernière planète ajoutée)
        if (placed)
        {
          placePlanet();
        }
        break;
      case 67: // C (Annulation du placement d'une nouvelle planète)
        placing = false;
        break;
      case 82: // R (Suppression de la dernière planète ajoutée et sa sauvegarde)
        planets.splice(planets.length - 1, 1);
        savedPlanets.splice(planets.length - 1, 1);
        break;
      case 83: // S (Crée un système solaire centré)
        generateSolarSystem();
        break;
      default:
    }
    draw();
  }
}

// Gestion des touches du clavier (relâchées)
function keyUp(e)
{
  var code = e.keyCode;
  switch (code) {
    case 37: // Flèche gauche
      moveCanvasLeft = 0;
      break;
    case 38: // Flèche du haut
      moveCanvasUp = 0;
      break;
    case 39: // Flèche droite
      moveCanvasRight = 0;
      break;
    case 40: // Flèche du bas
      moveCanvasDown = 0;
      break;
    default:
  }
}
