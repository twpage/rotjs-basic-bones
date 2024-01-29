/*
    Translate physical input from player (mouse / keyboard / gamepad)
    into basic 'UI' elements, that are interpretted based on game state, menu, etc.
*/

import { Util } from 'rot-js'
import { Rectangle } from '../game-components/shapes'
import { UI } from '../game-enums/enums'
import { generatedGamepadButtonEvent } from './input-utils'


export function convertGamepadButtonInputToUI(gp_btn_event: generatedGamepadButtonEvent) : UI {
    // action or OK
    if (gp_btn_event.button_number == 0) {
        return UI.CONFIRM_ACTION
    
    // secondary action or NEXT
    } else if (gp_btn_event.button_number == 2) {
        return UI.NEXT_SECONDARY

    // cancel-back
    } else if (gp_btn_event.button_number == 1) {
        return UI.CANCEL_BACK
    
    // player menu AKA inventory or powers or whatever menu
    } else if (gp_btn_event.button_number == 3) {
        return UI.PLAYER_MENU

    // game menu AKA pause/continue/restart/debug/options/etc.
    } else if (gp_btn_event.button_number == 9) {
        return UI.GAME_MENU
    
    // movement - WASD or Arrows
    } else if (gp_btn_event.button_number == 14) {
        return UI.LEFT
    } else if (gp_btn_event.button_number == 15) {
        return UI.RIGHT
    } else if (gp_btn_event.button_number == 12) {
        return UI.UP
    } else if (gp_btn_event.button_number == 13) {
        return UI.DOWN
    }

}

export function translateMouseInputToUI(mouse_event: MouseEvent) : UI {

    if (mouse_event.button == 0) {
        console.log()
        return UI.CONFIRM_ACTION
    }

    console.log(`received unknown mouse input. button:${mouse_event.button}|`)
    return UI.ERROR
}

export function convertKeyboardInputToUI(kb_event: KeyboardEvent) : UI {
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
    // TODO: move this into its own config so someday there is some good chance of custom keymapping

    // action or OK
    if ([" ", "Enter"].indexOf(kb_event.key) > -1) {
        return UI.CONFIRM_ACTION
    
    // secondary action or NEXT
    } else if (["f"].indexOf(kb_event.key) > -1) {
        return UI.NEXT_SECONDARY
    
    // cancel-back
    } else if (["q", "Escape"].indexOf(kb_event.key) > -1) {
        return UI.CANCEL_BACK

    // player menu AKA inventory or powers or whatever menu
    } else if (["e"].indexOf(kb_event.key) > -1) {
        return UI.PLAYER_MENU

    // game menu AKA pause/continue/restart/debug/options/etc.
    } else if (["?", "/"].indexOf(kb_event.key) > -1) {
        return UI.GAME_MENU

    // movement - WASD or Arrows
    } else if (["a", "ArrowLeft"].indexOf(kb_event.key) > -1) {
        return UI.LEFT
    } else if (["d", "ArrowRight"].indexOf(kb_event.key) > -1) {
        return UI.RIGHT
    } else if (["w", "ArrowUp"].indexOf(kb_event.key) > -1) {
        return UI.UP
    } else if (["s", "ArrowDown"].indexOf(kb_event.key) > -1) {
        return UI.DOWN
    }
    
    console.log(`received unknown keyboard input. key:${kb_event.key}|`)
    return UI.ERROR
}





