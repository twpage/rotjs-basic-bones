import * as ROT from 'rot-js'
import * as Bones from './bones'
import { IMenuEntry, Menu } from './game-engine/menu'
import { Rectangle, WallSide } from './game-components/shapes'
import { EventType } from './game-enums/enums'
import { TargetSelector } from './game-engine/target-selector'

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
        
        let font_size = 15
        let view_width = Bones.Config.viewableSize.width
        let view_height = Bones.Config.viewableSize.height
    
        this.rotMainDisplay = new ROT.Display({
            bg: "white",
            width: view_width,
            height: view_height,
            fontSize: font_size,
            fontFamily: 'Consolas',
            // fontStyle: 'bold',
            forceSquareRatio: true,
            spacing: 1.05
        })

        this.canvasElement = <HTMLCanvasElement>this.rotMainDisplay.getContainer()
        divMain.appendChild(this.canvasElement)
    
    }

    drawAll() {
        let xy : Bones.Coordinate

        // for (let x = 0; x < Bones.Config.regionSize.width; x++) {
        //     for (let y = 0; y < Bones.Config.regionSize.height; y++) {
        //         xy = new Bones.Coordinate(x, y)
        //         this.drawPoint(xy)
        //     }
        // }
        for (let v_xy of this.getViewWindow()) {
            this.drawPoint(v_xy)
        }
    }

    private getViewWindow() : Bones.Coordinate[] {
        let view_xys : Bones.Coordinate[] = []

        for (let x = 0; x < Bones.Config.viewableSize.width; x++) {
            for (let y = 0; y < Bones.Config.viewableSize.height; y++) {
                // this.drawPoint(new Coordinate(x, y))
                view_xys.push((new Bones.Coordinate(x, y)).add(this.game.cameraOffset))
            }
        }
        // console.log("viewport size: ", view_xys.length)
        return view_xys
    }

    drawList(coord_xys: Bones.Coordinate[]) {
        for (let xy of coord_xys) {
            this.drawPoint(xy)
        }
    }
    
    drawPointAtScreen(screen_xy: Bones.Coordinate, drawCode: string, fg_color: Bones.ROTColor, bg_color: Bones.ROTColor) {
        this.rotMainDisplay.draw(screen_xy.x, screen_xy.y, drawCode, ROT.Color.toHex(fg_color), ROT.Color.toHex(bg_color))
    }
    
    drawPoint(region_xy: Bones.Coordinate) {
        let screen_xy = region_xy.subtract(this.game.cameraOffset)

        let region = this.game.current_region
        let actor_at = region.actors.getAt(region_xy)
        let terrain_at = region.terrain.getAt(region_xy)
        
        let drawCode : string = ' '
        let drawFgColor : Bones.ROTColor = Bones.Color.white
        let drawBgColor : Bones.ROTColor = Bones.Color.dark_gray

        // drawCode = '?'
        // drawFgColor = Bones.Color.white
        // drawBgColor = Bones.Color.black

        // check if in player FOV
        let player = this.game.player
        let fov_at = player.fov.getAt(region_xy)
        if ((player.fov.hasAt(region_xy)) && (fov_at != Bones.Enums.VisionSource.NoVision)) {

            if (terrain_at) {
                drawCode = terrain_at.code
                drawFgColor = terrain_at.color
                drawBgColor = terrain_at.bg_color
            } 
            if (actor_at) {
                drawCode = actor_at.code
                drawFgColor = actor_at.color
                drawBgColor = [199, 199, 0]
            }
        } else {
            // check if in player memory
            let memory_at = player.memory.getAt(region_xy)
            if (memory_at) {
                drawCode = memory_at.code
                drawFgColor = Bones.Color.gray
                drawBgColor = Bones.Color.dark_gray
            }
        }

        this.drawPointAtScreen(screen_xy, drawCode, drawFgColor, drawBgColor)
    }

    drawMenu(active_menu: Menu) {
        // draw a super basic menu on top of the existing screen
        
        // figure out how to center our menu
        let longest_text = Math.max(...active_menu.getEntries().map((entry: IMenuEntry, idx: number) => { return entry.menuName.length })) + 1 // +1 buffer for selector 
        let menu_width = longest_text + 2 // menu width needs +2 for borders
        let screen_width = Bones.Config.viewableSize.width
        let starting_x = (screen_width - menu_width) / 2
        let menu_length = active_menu.getEntries().length + 2
        let screen_height = Bones.Config.viewableSize.height
        let starting_y = (screen_height - menu_length) / 2

        // draw some rough borders
        let border_rect : Rectangle = new Rectangle(starting_x, starting_y, menu_width, menu_length)
        for (let xy of border_rect.getCorners()) {
            this.drawPointAtScreen(xy, '+', Bones.Color.white, Bones.Color.dark_gray)
        }
        for (let xy of border_rect.getPerimeter_NoCorners()) {
            if ([WallSide.Top, WallSide.Bottom].indexOf(border_rect.getPerimeterSide(xy)) > -1) {
                this.drawPointAtScreen(xy, '\u2014', Bones.Color.white, Bones.Color.dark_gray)
            } else {
                this.drawPointAtScreen(xy, '|', Bones.Color.white, Bones.Color.dark_gray)
            }
        }
        
        // draw our entries, with basic selection indicator
        let drawing_row = starting_y + 1
        let rowColor : Bones.ROTColor
        let rowBgColor : Bones.ROTColor
        for (let m = 0; m < active_menu.getEntries().length; m++) {
            let menu_entry = active_menu.getEntries()[m]
            let entry_name = menu_entry.menuName + ((menu_entry.menuTriggeredEvent.eventType == EventType.MENU_START) ? '>' : ' ')

            for (let i = 0; i < Math.max(longest_text, entry_name.length); i ++) {
                let ch = (i > entry_name.length) ? ' ' : entry_name[i]
                rowColor = (active_menu.isCurrentIndex(m)) ? Bones.Color.dark_gray : Bones.Color.white
                rowBgColor = (active_menu.isCurrentIndex(m)) ? Bones.Color.white : Bones.Color.dark_gray
                
                this.drawPointAtScreen(new Bones.Coordinate(starting_x + 1 + i, drawing_row), ch, rowColor, rowBgColor)
            }
            drawing_row += 1
        }
    }

    drawTargeting(active_tgt_selector: TargetSelector) {
        // for now assume a simple single point highlighted
        let screen_xy = active_tgt_selector.getTarget().subtract(this.game.cameraOffset)
        // console.log(`drawing at ${active_tgt_selector.getTarget().toString()}`)
        let bgColor : Bones.ROTColor = (active_tgt_selector.checkValidTargetSelection()) ? Bones.Color.forest_green : Bones.Color.red
        this.drawPointAtScreen(screen_xy, 'x', Bones.Color.white, bgColor)
    }

    undrawTargeting(active_tgt_selector: TargetSelector) {
        // console.log(`undrawing at ${active_tgt_selector.getTarget().toString()}`)
        // for now assume a simple single point highlighted
        this.drawPoint(active_tgt_selector.getTarget())
    }
}