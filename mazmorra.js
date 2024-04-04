var canvas
var ctx
var fps = 60
var anchoFicha = 50
var altoFicha = 50
var tileMap
var protagonista
var enemigo = []
var imagenAntorcha
var camara
var camara2
var anchoEscenario = 25
var altoEscenario = 20
var sonido1, sonido2, sonido3, sonido4, sonido5
var musica1
var escenario = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,2,2,2,2,2,2,2,0,0,0,0,0,2,2,2,2,0,0,0,0],
    [0,0,2,0,0,0,2,2,2,0,0,0,0,0,2,2,2,2,0,0,0,0],
    [0,0,2,2,2,0,0,2,0,0,0,0,0,0,2,2,2,2,0,0,0,0],
    [0,2,2,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0],
    [0,0,2,0,0,0,2,2,2,0,0,0,0,0,0,2,0,0,0,0,0,0],
    [0,2,2,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
    [0,2,2,2,0,0,2,2,2,2,2,2,2,0,0,2,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,2,0,0,2,2,2,2,0,0,0,0,0,0],
    [0,2,2,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,2,0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,0],
    [0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,2,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,2,0,0,0,0,0],
    [0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,2,0,0,0,0,0],
    [0,0,2,2,2,0,0,2,2,2,0,0,1,2,2,2,2,2,0,0,0,0],
    [0,0,2,3,2,0,0,0,2,2,0,0,0,0,0,2,2,2,2,0,0,0],
    [0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

sonido1 = new Howl({
    src:['sound/efecto1.wav'],
    loop: false
})

sonido2 = new Howl({
    src:['sound/efecto2.wav'],
    loop: false
})

sonido3 = new Howl({
    src:['sound/fuego.wav'],
    loop: false
})

sonido4 = new Howl({
    src:['sound/llave.wav'],
    loop: false
})

sonido5 = new Howl({
    src:['sound/puerta.wav'],
    loop: false
})

musica1 = new Howl({
    src:['music/fortaleza.mp3'],
    loop: true
})

var ObjetoCamara = function(x, y, tamX, tamY, posX, posY) {
    this.x = x;
    this.y = y;
    this.tamX = tamX;
    this.tamY = tamY;
    this.posX = posX;
    this.posY = posY;

    this.dibuja = function() {
        for(y = this.y-1; y < (this.tamY + this.y); y++) {
            for(x = this.x; x < (this.tamX + this.x); x++) { 

                var tile = escenario[y][x]
                ctx.drawImage(tileMap, tile* 32, 0, 32, 32, anchoFicha * ((x - this.x) + this.posX), altoFicha * ((y - this.y)+ this.posY), anchoFicha, altoFicha)
            
            }

        }
    }  

    this.dibujaEscenario = function() {
        for(y = 0; y < 20; y++) {
            for(x = 0; x < 22; x++) {
    
               var tile = escenario[y][x]
                ctx.drawImage(tileMap, tile*32, 0, 32, 32, anchoFicha * x, altoFicha * y, anchoFicha, altoFicha)
            }
    
        }
    
    }
    
    this.arriba = function() {
        if(this.y > 0) this.y--
    }

    this.abajo = function() {
        if(this.y < altoEscenario - this.tamY) this.y++
    }

    this.izquierda = function() {
        if(this.x > 0) this.x--
    }

    this.derecha = function() {
        if(this.y < anchoEscenario - this.tamX) this.x++
    }

}

var antorcha = function(x, y) {
    this.x = x
    this.y = y
    this.retraso = 10
    this.contador = 0
    this.fotograma = 0

    this.cambiaFotograma = function() {
        if(this.fotograma < 3) {
            this.fotograma++
        }
        else {
            this.fotograma = 0
        }
    }

    this.dibuja = function() {
        if(this.contador < this.retraso) {
            this.contador++
        }
        else {
            this.contador = 0
            this.cambiaFotograma()
        }
         ctx.drawImage(tileMap, this.fotograma * 32, 64, 32, 32, anchoFicha * x, altoFicha * y, anchoFicha, altoFicha)
    }
}

var malo = function(x, y) {
    this.x = x
    this.y = y
    this.direccion = Math.floor(Math.random()*4)
    this.retraso = 50
    this.fotogramas = 0
    
    this.dibuja = function() {
        ctx.drawImage(tileMap, 0, 32, 32, 32, anchoFicha * this.x, altoFicha * this.y, anchoFicha, altoFicha)
    }
     
    this.compruebaColision = function(x, y) {
        var colisiona = false

        if(escenario[y][x] == 0) {
            colisiona = true
        }
        return colisiona
    }

    this.mueve = function() {
        protagonista.colisionEnemigo(this.x, this.y)

        if(this.contador < this.retraso) {
            this.contador++
        }
        else {
            this.contador = 0

            if(this.direccion == 0) {
                if(this.compruebaColision(this.x, this.y-1) == false) {
                    this.y--
                }
                else {
                    this.direccion = Math.floor(Math.random()*4)
                }
            }

            if(this.direccion == 1){
                if(this.compruebaColision(this.x, this.y+1) == false){
                    this.y++;
                }
                else {
                    this.direccion = Math.floor(Math.random()*4)
                }
            }

            if(this.direccion == 2) {
                if(this.compruebaColision(this.x-1,this.y) == false) {
                    this.x--
                }
                else {
                    this.direccion = Math.floor(Math.random()*4)
                }
            }

            if(this.direccion == 3) {
                if(this.compruebaColision(this.x+1, this.y) == false){
                    this.x++;
                }
                else {
                    this.direccion = Math.floor(Math.random()*4)
                }

            }
        }

    }
   
}

var jugador = function() {
    this.x = 1;
    this.y = 1;
    this.color = '#820c01'
    this.llave = false

    this.dibuja = function() {
        ctx.drawImage(tileMap, 32, 32, 32, 32, anchoFicha * this.x, altoFicha * this.y, anchoFicha, altoFicha)
    }

    this.margenes = function(x, y) {
        var colision = false
        if(escenario[y][x] == 0) {
            colision = true
        }
        return(colision)
    }

    this.arriba = function() {
        if(this.margenes(this.x, this.y-1) == false) {
            this.y--
            this.obtenerLlave()
        }
    }
    
    this.abajo = function() {
        if(this.margenes(this.x, this.y+1) == false) {
            this.y++
            this.obtenerLlave()
        }
    }

    this.izquierda = function() {
        if(this.margenes(this.x-1, this.y) == false) {
            this.x--
            this.obtenerLlave()
        }
        
    }

    this.derecha = function() {
        if(this.margenes(this.x+1, this.y) == false) {
            this.x++
            this.obtenerLlave()
        }
    }

    this.victoria = function() {
        sonido5.play()
        console.log('Has ganado')
        this.x = 1
        this.y = 1
        this.llave = false
        escenario[17][3] = 3
    }

    this.derrota = function() {
        sonido3.play()
        console.log('Has perdido')
        this.x = 1
        this.y = 1
        this.llave = false
        escenario[17][3] = 3
    }

    this.obtenerLlave = function() {   
        var objeto = escenario[this.y][this.x]
        if(objeto == 3) {
            this.llave = true
            sonido4.play()
            escenario[this.y][this.x] = 2
            console.log('Has obtenido la llave')
        }

        if(objeto == 1) {
            if(this.llave == true)
                this.victoria()
            else
                console.log('Te falta la llave.')
        }
        
    }

    this.colisionEnemigo = function(x, y) {

        if(this.x == x && this.y == y) {
            this.derrota()
        }
    }
}

function guardar(valor) {
    localStorage.setItem("nombre_jugador", valor)
    console.log('dato guardado')
}

function cargar() {
    return(localStorage.getItem("nombre_jugador"))
}

function borrar() {
    localStorage.removeItem("nombre_jugador")
    console.log("dato eliminado")
}

function borrarCanvas() {
    canvas.width = 1000
    canvas.height = 1000
}

function principal(){
    borrarCanvas();
    camara.dibujaEscenario();
    //camara.dibuja();
    //camara2.dibuja();
    protagonista.dibuja(); 
    imagenAntorcha.dibuja();
    
   for(x = 0;x < enemigo.length; x++){
    enemigo[x].mueve();
    enemigo[x].dibuja();
   }
    
}

function inicializa() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')

    protagonista = new jugador()
    tileMap = new Image()
    tileMap.src = 'img/tilemap.png'
   
    enemigo.push(new malo(3,3))
    enemigo.push(new malo(4,5))
    enemigo.push(new malo(6,6))
    imagenAntorcha = new antorcha(0,0)

    camara = new ObjetoCamara(2,2,5,5,1,1)
    camara2= new ObjetoCamara(7,9,4,6,8,2)

    document.addEventListener('keydown', function(tecla){

        if(tecla.keyCode == 38) {
            protagonista.arriba()
            camara.arriba()
            sonido2.play()
        }

        if(tecla.keyCode == 40) {
            protagonista.abajo()
            camara.abajo()
        }

        if(tecla.keyCode == 37) {
            protagonista.izquierda()
            camara.izquierda()
        }

        if(tecla.keyCode == 39) {
            protagonista.derecha()
            camara.derecha()
        }

    })

    musica1.play()
    setInterval(function() {
        principal()
    }, 1000/fps)

}
