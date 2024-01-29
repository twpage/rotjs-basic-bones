import * as Bones from '../bones'

import { EventType, GameState, MenuType, UI } from '../game-enums/enums'
import * as Translate from './translate'
import * as InputUtils from './input-utils'
import { Game } from '../game-engine'
// import { Config, Coordinate } from '../bones'
// import { dist2d } from '../game-components/utils'
// import { Rectangle } from '../game-components/shapes'
// import { Coordinate } from '../game-components'

export function handleKeyAndGamepadHelper(game: Game, ui : UI) : InputUtils.IInputResponse {

    // handle inputs for in-game menu
    if (game.state == GameState.GAME_CORE) {
        if (ui == UI.CONFIRM_ACTION) {
            return {validInput: true, event_type: EventType.WAIT}

        } else if (InputUtils.isMovementUi(ui)) {
            let attempt_dir = InputUtils.convertUIMovementToDirectionCoord(ui)
            return {
                validInput: true, 
                event_type: EventType.ATTEMPT_MOVE, 
                eventData: {
                    direction_xy: attempt_dir
                }
            }

        } else if (ui == UI.PLAYER_MENU) {
            return {validInput: true, event_type: EventType.MENU_START, eventData: {menuType: MenuType.PLAYER_ABILITIES}}
        } else if (ui == UI.CANCEL_BACK) {
            return {validInput: true, event_type: EventType.DEMO_NOTURNCOUNT}
        } else if (ui == UI.NEXT_SECONDARY) {
            return {validInput: true, event_type: EventType.DEMO_EXTRA_FANCY}
            // return {validInput: true, event_type: EventType.ABILITY_JUMP, eventData: {targetingPassThrough: true}}
        } else if (ui == UI.GAME_MENU) {
            return {validInput: true, event_type: EventType.MENU_START, eventData: {menuType: MenuType.GAME_CONFIG}}
        }
    
    // handle inputs for in-game menu and Intro Menu
    } else if ((game.state == GameState.GAME_MENU) || (game.state == GameState.INTRO_MENU)) {
        if (ui == UI.CONFIRM_ACTION) {
            return {validInput: true, event_type: EventType.MENU_SELECT} // no eventData needed since menu is already active
        } else if (ui == UI.DOWN) {
            return {validInput: true, event_type: EventType.MENU_UPDATE, eventData: {incrementAmount: 1}} 
        } else if (ui == UI.UP) {
            return {validInput: true, event_type: EventType.MENU_UPDATE, eventData: {incrementAmount: -1}} 
        } else if (ui == UI.CANCEL_BACK) {
            return {validInput: true, event_type: EventType.MENU_CANCEL} 
        }
    
    // handle inputs for in-game targeting / target selector
    } else if (game.state == GameState.GAME_TARGETING) {
    if (ui == UI.CONFIRM_ACTION) {
        return {validInput: true, event_type: EventType.TARGETING_SELECT} 
    } else if (InputUtils.isMovementUi(ui)) {
        let selector_dir = InputUtils.convertUIMovementToDirectionCoord(ui)
        return {
            validInput: true, 
            event_type: EventType.TARGETING_UPDATE, 
            eventData: {
                direction_xy: selector_dir
            }
        }
    } else if (ui == UI.CANCEL_BACK) {
        return {validInput: true, event_type: EventType.TARGETING_CANCEL} 
    }
}
    return {validInput: false, event_type: EventType.NONE}
}

function pointInRectanglePart(x: number, y: number, w: number, h: number)  : number {
    /**
     * @param {number} x X coordinate of the point
     * @param {number} y Y coordinate of the point
     * @param {number} w Width of the rectangle
     * @param {number} h Height of the rectangle
     * @returns {-1 | 0 | 1 | 2 | 3} -1 = Outside, 0 = Left, 1 = Right, 2 = Top, 3 = Bottom
    */
    // https://stackoverflow.com/questions/68206499/divide-a-rectangle-into-four-triangles-mathematically-and-determinate-the-pointe
    const y1 = h * x / w; // y of 1st diagonal at x
    const y2 = h - y1; // y of 2nd diagonal at x
    return (
      x < 0 || w <= x || y < 0 || h <= y ? -1 :
      y < y1 ? (y < y2 ? 2 : 1) : (y < y2 ? 0 : 3)
    )
}

export function handleMouseInput(game: Game, mouse_event: MouseEvent) : InputUtils.IInputResponse {
    let ui : UI = Translate.translateMouseInputToUI(mouse_event)


    if (game.state == GameState.GAME_CORE) {

        if (ui == UI.CONFIRM_ACTION) {
            let game_x_and_y = game.display.getROTDisplay().eventToPosition(mouse_event)
            let dist_from_center = Bones.Utils.dist2d(new Bones.Coordinate(Bones.Config.viewableSize.width/2, Bones.Config.viewableSize.height / 2), new Bones.Coordinate(game_x_and_y[0], game_x_and_y[1]))
            let arc_from_point = pointInRectanglePart(game_x_and_y[0], game_x_and_y[1], Bones.Config.viewableSize.width, Bones.Config.viewableSize.height)

            if (dist_from_center <= 5) {
                console.log(`clicked ${game_x_and_y} in center`)
                return {validInput: true, event_type: EventType.WAIT}
            } else {
                console.log(`clicked ${game_x_and_y} in vertex ${arc_from_point}`)
                let attempt_dir : Bones.Coordinate
                if (arc_from_point == 0) { attempt_dir = Bones.Directions.LEFT }
                else if (arc_from_point == 1) { attempt_dir = Bones.Directions.RIGHT }
                else if (arc_from_point == 2) { attempt_dir = Bones.Directions.UP }
                else if (arc_from_point == 3) { attempt_dir = Bones.Directions.DOWN }
                else {
                    return {validInput: false, event_type: EventType.NONE}
                }
                return {
                    validInput: true, 
                    event_type: EventType.ATTEMPT_MOVE, 
                    eventData: {
                        direction_xy: attempt_dir
                    }
                }            }
            
            
            
        } 
    }
        
    return {validInput: false, event_type: EventType.NONE}
}