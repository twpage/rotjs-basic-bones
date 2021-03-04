import * as  ROT from 'rot-js/lib/index'
import * as Bones from '../bones'
import { Directions } from '../game-components'
import { EventType } from '../game-enums/enums'


export interface InputResponse {
    validInput: boolean,
    event_type: Bones.Enums.EventType
    direction_xy?: Bones.Coordinate
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
    } else if ([ROT.KEYS.VK_W, ROT.KEYS.VK_A, ROT.KEYS.VK_S, ROT.KEYS.VK_D].indexOf(code) > -1) {
        let dir_lst = [Directions.UP, Directions.LEFT, Directions.DOWN, Directions.RIGHT]
        let index = [ROT.KEYS.VK_W, ROT.KEYS.VK_A, ROT.KEYS.VK_S, ROT.KEYS.VK_D].indexOf(code)
        return {validInput: true, event_type: EventType.MOVE, direction_xy: dir_lst[index]}
    }

    return {validInput: false, event_type: EventType.NONE}
}