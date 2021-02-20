import * as  ROT from 'rot-js/lib/index'
import { Game } from './game-components/game';

function startMe() {
    ROT.RNG.setSeed(1111)

    let div_footer : HTMLDivElement = <HTMLDivElement>document.getElementById("div_footer")
    div_footer.innerHTML = "<p>loaded typescript</p>"

    let divMain : HTMLDivElement = <HTMLDivElement>document.getElementById("div_display")
    
    let font_size = 12
    let map_width = 31
    let map_height = 31

    let rotDisp = new ROT.Display({
        bg: "white",
        width: map_width,
        height: map_height,
        fontSize: font_size,
        forceSquareRatio: false,
        spacing: 1.05
    })
    let color_rgb = ROT.Color.randomize(ROT.Color.fromString("#4D4DA6"), [30, 30, 30])
    
    let callback = (x: number, y: number, value: number) => {
        if (value == 1) {
            rotDisp.draw(x, y, "#", ROT.Color.toHex(color_rgb), null)
        }
    }
    let d
    let x = ROT.RNG.getUniform()
    if (x < 0.3334) {
        d = new ROT.Map.IceyMaze(map_width, map_height, 0)

    }  else if (x < 0.6667) {
        

        d = new ROT.Map.Cellular(map_width, map_height)
        d.randomize(0.5)
        d.randomize(0.5)

    } else {
        d = new ROT.Map.Digger(map_width, map_height)
    }
    d.create(callback)

    let canvas = <HTMLCanvasElement>rotDisp.getContainer()
    divMain.appendChild(canvas)

    let game = new Game()
    game.gameLoop()
}






startMe()