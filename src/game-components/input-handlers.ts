import { EventType } from "./events"
import * as  ROT from 'rot-js/lib/index'

export interface InputResponse {
    validInput: boolean,
    event_type: EventType
}

export function handleInput(event: KeyboardEvent) : InputResponse {
    let code = event.keyCode
    if (code == ROT.KEYS.VK_SPACE) {
        return {validInput: true, event_type: EventType.WAIT}
    } else if (code == ROT.KEYS.VK_F) {
        return {validInput: true, event_type: EventType.FANCY}
    } else if (code == ROT.KEYS.VK_G) {
        return {validInput: true, event_type: EventType.EXTRA_FANCY}
    } else if (code == ROT.KEYS.VK_Q) {
        return {validInput: true, event_type: EventType.MENU}
    }

    return {validInput: false, event_type: EventType.NONE}
}