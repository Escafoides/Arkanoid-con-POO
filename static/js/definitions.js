

// Variables de entorno
var canvas = null; 	  //el objeto canvas
var ctx = null;   // el contexto del canvas

/* INPUT
-----------------------------------------*/

// input Raton 
var ratonX      = 0;
var ratonY      = 0;
var ratonClick  = false;

// input Teclado 
var TECLA_LEFT  = false;
var TECLA_RIGHT = false;
var TECLA_SPACE = false;
var TECLA_W     = false;
var	TECLA_K     = false;
var	TECLA_M     = false;
var	TECLA_P     = false;




// Coger la posicion del raton en movimiento
function ratonMove(event) {
  ratonX = event.clientX - canvas.offsetLeft;
  ratonY = event.clientY - canvas.offsetTop;
}


// Hemos hecho click
function ratonDown(event) {
  ratonClick = true;
}

// Hemos dejado de hacer click
function ratonUp(event) {
  ratonClick = false;
}

// Pulsamos las teclas
function actualizarEstadoTeclado(event) {
  TECLA = event.keyCode;
  if(TECLA == 39) TECLA_RIGHT = true;
  if(TECLA == 37) TECLA_LEFT  = true;
  if(TECLA == 87) TECLA_W     = true;
  if(TECLA == 75) TECLA_K     = true;
  if(TECLA == 77) TECLA_M     = true;
  if(TECLA == 32) TECLA_SPACE = true;
}

// Cambiamos los estados de las teclas
function borrarEstadoTeclado(event) {
  TECLA = event.keyCode;
  if(TECLA == 39) TECLA_RIGHT = false;
  if(TECLA == 37) TECLA_LEFT  = false;
  if(TECLA == 87) TECLA_W     = false;
  if(TECLA == 75) TECLA_K     = false;
  if(TECLA == 77) TECLA_M     = false;
  if(TECLA == 32) TECLA_SPACE = false;
}

//Poner en pausa el juego
function ponerEnPausa(event){
	TECLA = event.keyCode;
	console.log(TECLA);
	if(TECLA == 112){
		TECLA_P ^= true;		
	}
}


// Cambiar la fuente
function textFont(font) {
  ctx.font = font;
}

// color de la fuente (y lineas)
function textColor(color) {
  ctx.fillStyle = color;
}

// Dibujar texto
function text(str, x, y) {
      ctx.fillText(str, x, y);
}


//Quitamos el cursor del canvas
function noCursor() {
  canvas.style.cursor = "url('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='), auto";
}

// Pintar Circulo
  function circulo(x, y, radio, colorRelleno) {
      anguloInicio =  0 * Math.PI;
      anguloFin    = 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(x, y, radio, anguloInicio, anguloFin, false);
      ctx.fillStyle = colorRelleno;
      ctx.fill();
      ctx.stroke();
  }

  // Draw rectangle
  function rectangle(topLeftCornerX, topLeftCornerY, width, height, colorRelleno) {
        ctx.beginPath();
        ctx.rect(topLeftCornerX, topLeftCornerY, width, height);
        ctx.fillStyle = colorRelleno;
        ctx.fill();
        ctx.stroke();
    }

 
    function clear() {
      ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.beginPath();
    }

    function loop() {
  		var tiempoNow = new Date().getTime(),
  		time = 0;
  		function timer() {
  			time += 15;
  			var diff = (new Date().getTime() - tiempoNow) - time;
  			clear();
  			update(); 	   // Update
  			draw(); 	   // Draw
  			window.setTimeout(timer, (15 - diff));
  		}
  		window.setTimeout(timer, 15);
  	}


    // Set border color
    function borderColor(color) {
      ctx.strokeStyle = color;
    }

    // Run
    function run() {
      canvas = document.getElementById("canvas");
      ctx    = canvas.getContext("2d");
      init(); 	// Init game scene
      draw(); 	// Draw game scene
      loop();	// Start game loop
    }
