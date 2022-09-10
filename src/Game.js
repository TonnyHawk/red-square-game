import KeyDetector from './keyDetector';
import Player from './Player';
import PopupScreen from './PopupScreen';

export default class Game{
    constructor(){
        this.animation;
        this.isAnimationRunning = false

        this.draw = this.draw.bind(this)
        this.resume = this.resume.bind(this)
        this.popupScreen = new PopupScreen(this)
    }

    start(){
        this.player = new Player();
        new KeyDetector(this, this.player)
    }

    draw(){
        this.player.move()
        this.animation = requestAnimationFrame(this.draw)
    }

    resume(){
        this.animation = requestAnimationFrame(this.draw)
        this.isAnimationRunning = true;

        this.popupScreen.hide()
    }

    pause(){
        cancelAnimationFrame(this.animation)
        this.isAnimationRunning = false;

        this.popupScreen.show()
    }
}