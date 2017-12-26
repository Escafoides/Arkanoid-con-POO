// pantallas del juego
const pantallaMenu  = 0;
const pantallaJuego  = 1;
const pantallaPuntuacion = 2;

var gameStart = false;

var pantallaActual = pantallaMenu;

// Tipo de Control
const mouse_control    = 0;
const keyboard_control = 1;

var controlActual = mouse_control;

// Objetos del juego
var pelota = new Object();
var navecilla = new Object();
var ladrillos = new Object();

// Niveles
var nivel = 1;
var puntuacion = 0;
var vidas = 3;
var velocidad = 5;

// ladrillos
var ladrillosDestruidos = 0;
var CantidadLadrillos = 0;

function init() {
  noCursor();
}

function draw() {
  textFont("10pt Arial");

  switch(pantallaActual) {
    case pantallaMenu:  drawMenu(); break;
    case pantallaJuego:  drawGame(); break;
    case pantallaPuntuacion: drawPuntuacion(); break;
  }
}

function updateMenu() {
  if(TECLA_W) {
    pantallaActual = pantallaJuego;
    initGame();
  }
  if(TECLA_M) {
    controlActual = mouse_control;
  }
  if(TECLA_K) {
    controlActual = keyboard_control;
  }
}

function drawMenu() {
  textFont('34pt Arial');
  text('ARKANOID',200,130);

  textFont('24pt Arial');
  text('PULSA',120,220);
  textColor("#136aff");
  text('W',235,220);
  textColor("#ffffff");
  text('PARA EMPEZAR',275,220);

  text('CONTROLES',220,300);
  if(controlActual == mouse_control) {
    textColor("#ff00f4");
  } else {
    textColor("#ffffff");
  }
  text('M',190,370);
  textColor("#ffffff");
  text('ouse',217,370);
  textColor("#ffffff");
  text('/',288,370);
  if(controlActual == keyboard_control) {
    textColor("#ff00f4");
  } else {
    textColor("#ffffff");
  }
  text('K',300,370);
  textColor("#ffffff");
  text('eyboard',322,370);
}

function initPelota() {
  pelota.x = 350;
  pelota.y = 300;
  pelota.dx = 0;
  pelota.dy = velocidad;
  pelota.radius = 5;
}

function drawPelota() {
  circulo(pelota.x, pelota.y, pelota.radius, "#57D457");
}

function updatePelota() {

  // Collisions with game nivel
  if(pelota.x + pelota.dx + pelota.radius > canvas.width || pelota.x + pelota.dx - pelota.radius < 0)  pelota.dx = -pelota.dx;
  // Collissions with ladrillos
  rowheight = ladrillos.height + ladrillos.padding;
  colwidth = ladrillos.width + ladrillos.padding;
  row = Math.floor(pelota.y/rowheight);
  col = Math.floor(pelota.x/colwidth);

  // Pelota colision con ladrillo
  if (pelota.y < ladrillos.rows * rowheight && row >= 0 && col >= 0 && ladrillosNivel[row][col] == 1) {
    pelota.dy = -pelota.dy;
    ladrillosNivel[row][col] = 0;
    puntuacion += 50;
    ladrillosDestruidos++;
  }

  // Pelota colision con roca
  if (pelota.y < ladrillos.rows * rowheight && row >= 0 && col >= 0 && ladrillosNivel[row][col] == 2) {
    pelota.dy = -pelota.dy;
    puntuacion += 50;
    ladrillosNivel[row][col] = 1;
  }

  // Pelota colision con diamante
  if (pelota.y < ladrillos.rows * rowheight && row >= 0 && col >= 0 && ladrillosNivel[row][col] == 3) {
    pelota.dy = -pelota.dy;
    puntuacion += 50;
    ladrillosNivel[row][col] = 2;
  }


  // Pelota colision
  if(pelota.y + pelota.dy - pelota.radius < 20) {
    // Collision with top of the room
    pelota.dy = -pelota.dy;
  } else {
    // Collision with navecilla
    if(pelota.y + pelota.dy + pelota.radius > canvas.height - navecilla.height) {
      // Collision with navecilla
      if(pelota.x + pelota.radius > navecilla.x && pelota.x - pelota.radius < navecilla.x + navecilla.width) {
        pelota.dy = -pelota.dy;
        pelota.dx = 8 * ((pelota.x-(navecilla.x+navecilla.width/2))/navecilla.width);
      } else {
        // Collision with the bottom of the room - Water
        if(pelota.y + pelota.dy + pelota.radius > canvas.height) {
          // Restar vidas
          vidas -= 1;
          // Restar puntuacion
          puntuacion = (puntuacion - 100 < 0 ) ? 0 : puntuacion - 100;
          // pegajoso pelota
          gameStart = false;

          // Respawn pelota
          initPelota();
        }
      }
    }
  }

  // se mueve la pelota
  pelota.x += pelota.dx;
  pelota.y += pelota.dy;
}

function magnetPelota() {
  pelota.x = navecilla.x + (navecilla.width/2);
  pelota.y = navecilla.y - navecilla.height;
}


function initNavecilla() {
  navecilla.x = 100;
  navecilla.y = 470;
  navecilla.width = 100;
  navecilla.height = 10;
}

function drawNavecilla() {
  borderColor('#000');
  rectangle(navecilla.x, navecilla.y, navecilla.width, navecilla.height, "#ff00f4");
}


function updateNavecilla() {

  if(controlActual == mouse_control) {
    // Mouse control
    navecilla.x = ratonX - (navecilla.width/2);
  } else {
    // Keybord control
    if(TECLA_LEFT) navecilla.x = navecilla.x - 10;
    if(TECLA_RIGHT) navecilla.x = navecilla.x + 10;
  }


  if(navecilla.x < 0) navecilla.x = 0;
  if(navecilla.x + navecilla.width > 640) navecilla.x = canvas.width - navecilla.width;
}

function initLadrillos() {
  ladrillos.cols = 15;
  ladrillos.rows = 10;
  ladrillos.width = (canvas.width / ladrillos.cols);
  ladrillos.height = 25;
  ladrillos.padding = 3;
  CantidadLadrillos = CantidadLadrillosNivel;
}

function drawladrillos() {
  for (i=0; i < ladrillos.rows; i++) {
    for (j=0; j < ladrillos.cols; j++) {
      // ladrillo Normal
      if (ladrillosNivel[i][j] == 1) {
          rectangle((j * (ladrillos.width + ladrillos.padding)) + ladrillos.padding,
                (i * (ladrillos.height + ladrillos.padding)) + ladrillos.padding,
                    ladrillos.width, ladrillos.height,"#4a4add");
      }
      // ladrillo Fuerte
      if (ladrillosNivel[i][j] == 2) {
        rectangle((j * (ladrillos.width + ladrillos.padding)) + ladrillos.padding,
                (i * (ladrillos.height + ladrillos.padding)) + ladrillos.padding,
                    ladrillos.width, ladrillos.height,"#d2921c");
      }

      // ladrillo Fuerte
      if (ladrillosNivel[i][j] == 3) {
        rectangle((j * (ladrillos.width + ladrillos.padding)) + ladrillos.padding,
                (i * (ladrillos.height + ladrillos.padding)) + ladrillos.padding,
                    ladrillos.width, ladrillos.height,"#ff0000");
      }
    }
  }
}


function updateladrillos() {

  // Si las vidas es 0 GAME OVER
  if(vidas <= 0) {
    pantallaActual = pantallaPuntuacion;
  }


  // Si se destrullen todos los ladrillos se pasa de nivel
  if(CantidadLadrillos != 0) {
    if(ladrillosDestruidos == CantidadLadrillos)  {
      ladrillosDestruidos = 0;
      nivel +=1;
      velocidad +=2;
      gameStart = false;
      initPelota();
    }
  }

  // Load nivels
  switch(nivel) {
    case 1:
      CantidadLadrillosNivel = CantidadLadrillosNivel1;
      ladrillosNivel = ladrillosNivel1;
    break;
    case 2:
      CantidadLadrillosNivel	= CantidadLadrillosNivel2;
      ladrillosNivel = ladrillosNivel2;
    break;
    case 3:
      CantidadLadrillosNivel	= CantidadLadrillosNivel3;
      ladrillosNivel = ladrillosNivel3;
    break;
  }

  if(nivel > 3) {
    pantallaActual = pantallaPuntuacion;
  }
  // Init new nivel here
  initLadrillos();

}

//Iniciar nivel de juego
function initGame() {
  initPelota();
  initNavecilla();
  initLadrillos();
}

//actualizar nivel de juego
function updateGame() {
	if(!TECLA_P){
		if(controlActual == mouse_control) {
			if(ratonClick) gameStart = true;
			if(gameStart) updatePelota(); else magnetPelota();
		} else {
			if(TECLA_SPACE) gameStart = true;
			if(gameStart) updatePelota(); else magnetPelota();
		}
		updateNavecilla();	
		updateladrillos();
	}
}

function updatePuntuacion() {
}


function drawInfo() {
  rectangle(0, 0, 120, 20, "#333");
  rectangle(272, 0, 100, 20, "#333");
  rectangle(550, 0, 90, 20, "#333");  

  textColor('#fff');
  text('Puntuacion: ' + puntuacion,10,15);
  text('Nivel: ' + nivel,300,15);
  text('Vidas: ' + vidas,570,15);

}
//Dibujar el juego
function drawGame() {
  drawInfo();
  drawPelota();
  drawNavecilla();
  drawladrillos();
}

//Dibujar la Puntuacion
function drawPuntuacion() {
  textFont('34pt Arial');
  text('ARKANOID',200,180);

  textFont('24pt Arial');
  text('Puntuacion:',130,280);
  text(puntuacion,350,280);


  text('PULSA',80,380);
  textFont('30pt Arial');
  textColor('#ff00f4');
  text('F5',190,380);
  textColor('#ffffff');
  textFont('24pt Arial');
  text('VOLVER A EMPEZAR',247,380);

}

function update() {
  switch(pantallaActual) {
    case pantallaMenu:  updateMenu(); break;
    case pantallaJuego:  updateGame(); break;
    case pantallaPuntuacion: updatePuntuacion(); break;
  }
}

var ladrillosProcedural;

function generarProcLadrillos(){
  var ladrillosNivelProcAux;
  ladrillosNivelProcAux =[[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
  for (var i = 4; i < 10; i++){
    var ladProd = [0,1];
    for (var j = 0; j < 14; j++){
      var tipoladrillo = Math.floor((Math.random() * 2) + 1);
      ladProd[j] = tipoladrillo;
    }
    ladrillosNivelProcAux.push(ladProd);
  }
  ladrillosProcedural = ladrillosNivelProcAux;
}

//Niveles

//cuadrados
var CantidadLadrillosNivel1  = 98;
var ladrillosNivel1 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [2,2,2,2,2,2,3,3,2,2,2,2,2,2],
                       [1,1,1,1,1,1,2,2,1,1,1,1,1,1],
                       [1,1,1,1,1,1,2,2,1,1,1,1,1,1],
                       [1,1,1,1,1,1,2,2,1,1,1,1,1,1],
                       [1,1,1,1,1,1,2,2,1,1,1,1,1,1],
                       [1,1,1,1,1,1,2,2,1,1,1,1,1,1],
                       [2,2,2,2,2,2,3,3,2,2,2,2,2,2]];

//corazon
 var CantidadLadrillosNivel2  = 126;
 var ladrillosNivel2 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                       [2,1,1,1,2,2,1,2,2,1,1,1,1,2],
                       [2,1,1,2,2,2,3,2,2,2,1,1,1,2],
                       [2,1,1,2,2,3,3,3,2,2,1,1,1,2],
                       [2,1,1,2,3,3,3,3,3,2,1,1,1,2],
                       [2,1,1,1,2,3,3,3,2,1,1,1,1,2],
                       [2,1,1,1,1,2,3,2,1,1,1,1,1,2],
                       [2,1,1,1,1,1,2,1,1,1,1,1,1,2],
                       [2,2,2,2,2,2,2,2,2,2,2,2,2,2]];


//rombo
 var CantidadLadrillosNivel3  = 112;
 var ladrillosNivel3 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [1,1,1,2,1,2,2,2,2,1,2,1,1,1],
                       [1,1,2,1,2,1,1,1,1,2,1,2,1,1],
                       [1,2,1,2,1,0,0,0,0,1,2,1,2,1],
                       [2,1,2,1,0,2,2,2,2,0,1,2,1,2],
                       [1,2,1,0,2,2,3,3,2,2,0,1,2,1],
                       [2,1,2,1,0,2,2,2,2,0,1,2,1,2],
                       [1,2,1,2,1,0,0,0,0,1,2,1,2,1],
                       [1,1,2,1,2,1,1,1,1,2,1,2,1,1],
                       [3,3,3,3,3,3,3,3,3,3,3,3,3,3]];

 // Primer Nivel
 var CantidadLadrillosNivel = CantidadLadrillosNivel1;
 var ladrillosNivel = ladrillosNivel1;
