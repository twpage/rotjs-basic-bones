import * as  ROT from 'rot-js/lib/index'
import * as Bones from './bones'

function startMe() {
    ROT.RNG.setSeed(1111)

    let div_footer : HTMLDivElement = <HTMLDivElement>document.getElementById("div_footer")
    div_footer.innerHTML = "<p>loaded typescript</p>"

    let divMain : HTMLDivElement = <HTMLDivElement>document.getElementById("div_display")
    
    let font_size = 12
    let map_width = Bones.Config.regionSize.width
    let map_height = Bones.Config.regionSize.height

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
    let d = new ROT.Map.Digger(map_width, map_height)
    d.create(callback)

    let canvas = <HTMLCanvasElement>rotDisp.getContainer()
    divMain.appendChild(canvas)

    let game = new Bones.Engine.Game()
    game.gameLoop()
}






startMe()