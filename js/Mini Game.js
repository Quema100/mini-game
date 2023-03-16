const canvas = document.querySelector('#canvas')
const c = canvas.getContext('2d')

canvas.width = 1690
canvas.height = 600

const gravity = 0.5

class Sprite{
    constructor({position , imageSrc}){
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
    }    
    draw(){
        if (!this.image) return
        c.drawImage(this.image, this.position.x,this.position.y)
    }
    update(){
        this.draw()
    }
}
class Player{
    constructor({position,velocity,color = "red" , offset , offset2}){
        this.width = 50
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.attackBox ={
            position:{
                x: this.position.x,
                y: this.position.y,
            },  
            offset,
            offset2,
            width:100 ,
            height:50,
        }
        this.color = color
        this.isAttacking
        this.lastKey
        this.hp = 100
        
    }
    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
       if (this.isAttacking){
            c.fillStyle = "black"
            c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
       }
    }

    update(){
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        console.log(this.position.x , canvas.height)
        if (this.position.y < 130.5 || this.velocity.y > -2){
            this.velocity.y++
        }
        if (this.position.x < 0){
            this.position.x = 0
        }
        if (this.position.y < 0){
            this.position.y = 0
        }
        if (this.position.x > 1650){
            this.position.x = 1650
        }
        if (this.lastKey === 'a') {
            this.attackBox.position.x = this.position.x + this.attackBox.offset2.x
            this.attackBox.position.y = this.position.y
        }
        if (this.lastKey === 'ArrowRight'){
            this.attackBox.position.x = this.position.x + this.attackBox.offset2.x
            this.attackBox.position.y = this.position.y
        }
        if (this.position.y + this.height + this.velocity.y < canvas.height)
            this.velocity.y += gravity
        else this.velocity.y =0
    }

    attack(){
        this.isAttacking = true
        setTimeout(()=>{
            this.isAttacking = false
        },100)
    }
}
const player = new Player({
    position:{    
        x:100,
        y:450,
    },
    velocity :{
        x:0,
        y:0
    },
    offset:{
        x:0,
        y:0,
    },
    offset2:{
        x:-50,
        y:0
    }
})
const player2 = new Player({
    position:{
        x:1530,
        y:450,
    },
    velocity :{
        x:0  ,      
        y:0
    },
    offset:{
        x:-50,
        y:0,
    },
    offset2:{
        x:0,
        y:0,
    },
    color: "blue"
})
const keys = {
    d:{
        pressed: false,
    },
    a:{
        pressed: false,
    },
    ArrowLeft :{
        pressed: false,
    },
    ArrowRight:{
        pressed: false,
    }
}

const background = new Sprite({
    position:{
        x:0,
        y:0,
    },
    imageSrc:'./img/test.png'
})
function rectangularCollision({rectangle1,rectangle2}){
    return(rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width 
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y+ rectangle2.height
    )
}
function determinwiner({player,player2,timerId}){
    clearTimeout(timerId)
    let Text = document.querySelector('#displayText')
    let popup = document.querySelector('.popup')
    document.querySelector('#displayText').style.display = 'flex'
    if(player.hp === player2.hp){
        Text.innerHTML = '무승부'
        Text.style.animation ='up .8s forwards'
        popup.style.animation ="popup .8s forwards"
    } else if( player.hp > player2.hp){
        Text.innerHTML = 'Player1 Win' 
        Text.style.animation ='up .8s forwards'
        popup.style.animation ="popup .8s forwards"
    } else if( player.hp < player2.hp){
        Text.innerHTML = 'Player2 Win'
        Text.style.animation ='up .8s forwards'
        popup.style.animation ="popup .8s forwards"
    }
}

let timer = 60
let timerId
function decreaseTimer(){
    if(timer > 0) {
        timerId=setTimeout(decreaseTimer,1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0){
        determinwiner({player,player2,timerId})
    }
}

decreaseTimer()
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = "white"
    c.fillRect(0,0, canvas.width, canvas.height)
    c.save()
    background.update()
    c.restore()
    player.update()
    player2.update()
    player.velocity.x = 0
    if (keys.d.pressed) player.velocity.x = 10
    else if (keys.a.pressed) player.velocity.x = -10
    player2.velocity.x = 0
    if (keys.ArrowRight.pressed) player2.velocity.x = 10
    else if (keys.ArrowLeft.pressed) player2.velocity.x = -10


    if(rectangularCollision({rectangle1:player,rectangle2:player2})&& player.isAttacking){
        player.isAttacking = false
        player2.hp -= 10
        document.querySelector('#player2hp').style.width = player2.hp + '%'
    }

    if(rectangularCollision({rectangle1:player2,rectangle2:player})&& player2.isAttacking){
        player2.isAttacking = false
        player.hp -= 10
        document.querySelector('#playerhp').style.width = player.hp + '%'
    }
    if(player.hp <=0||player2.hp <=0){
        determinwiner({ player,player2,timerId })
    }

}

animate()

window.addEventListener('keydown',(event)=>{
    console.log(event)

    switch(event.key){
        case 'w':
            player.velocity.y = -13     
            player.lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'q':
            player.attack()
            break
        case 'ArrowUp':
            player2.velocity.y = -13
            player2.lastKey = 'ArrowUp'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            player2.lastKey = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            player2.lastKey = 'ArrowRight'
            break
        case '1':
            player2.attack()
            break
    }
})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
    }
})



