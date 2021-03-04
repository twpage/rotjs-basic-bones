import * as ROT from 'rot-js'
import * as Bones from './bones'

export interface IDisplayDivElementIDs {
    divMain: string
    divFooter: string
}

export class Display {
    private rotMainDisplay : ROT.Display
    private canvasElement : HTMLCanvasElement

    constructor(private game : Bones.Engine.Game, display_divs : IDisplayDivElementIDs) {
        let div_footer : HTMLDivElement = <HTMLDivElement>document.getElementById(display_divs.divFooter)
        div_footer.innerHTML = "<p>loaded typescript</p>"
    
        let divMain : HTMLDivElement = <HTMLDivElement>document.getElementById(display_divs.divMain)
        
        let font_size = 12
        let map_width = Bones.Config.regionSize.width
        let map_height = Bones.Config.regionSize.height
    
        this.rotMainDisplay = new ROT.Display({
            bg: "white",
            width: map_width,
            height: map_height,
            fontSize: font_size,
            forceSquareRatio: false,
            spacing: 1.05
        })

        this.canvasElement = <HTMLCanvasElement>this.rotMainDisplay.getContainer()
        divMain.appendChild(this.canvasElement)
    
    }

    drawAll() {
        let xy : Bones.Coordinate

        for (let x = 0; x < Bones.Config.regionSize.width; x++) {
            for (let y = 0; y < Bones.Config.regionSize.height; y++) {
                xy = new Bones.Coordinate(x, y)
                this.drawAt(xy)
            }
        }
    }

    drawList(coord_xys: Bones.Coordinate[]) {
        for (let xy of coord_xys) {
            this.drawAt(xy)
        }
    }
    
    drawAt(region_xy: Bones.Coordinate) {
        let region = this.game.current_region
        let actor_at = region.actors.getAt(region_xy)
        let terrain_at = region.terrain.getAt(region_xy)
        
        let drawCode : string
        let drawFgColor : Bones.ROTColor
        let drawBgColor : Bones.ROTColor

        if (actor_at) {
            drawCode = actor_at.code
            drawFgColor = actor_at.color
            drawBgColor = [199, 199, 0]
        } else {
            drawCode = terrain_at.code
            drawFgColor = terrain_at.color
            drawBgColor = Bones.Color.default_bg
        }

        this.rotMainDisplay.draw(region_xy.x, region_xy.y, drawCode, ROT.Color.toHex(drawFgColor), ROT.Color.toHex(drawBgColor))

    }

}