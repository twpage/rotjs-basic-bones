import { EventType, GameState, MenuType, UI } from '../game-enums/enums'
import { IInputResponse } from './input-utils'
import * as Translate from './translate'
import * as InputUtils from './input-utils'
import { Game } from '../game-engine'
import { Menu } from '../game-engine/menu'

export function handleKeyAndGamepadHelper(game: Game, ui : UI) : IInputResponse {

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

export function handleMouseInput(game: Game, mouse_event: MouseEvent) : IInputResponse {
    let ui : UI = Translate.translateMouseInputToUI(mouse_event)

    if (game.state == GameState.GAME_CORE) {

        if (ui == UI.CONFIRM_ACTION) {
            return {validInput: true, event_type: EventType.WAIT}
        } 
    }
        
    return {validInput: false, event_type: EventType.NONE}
}