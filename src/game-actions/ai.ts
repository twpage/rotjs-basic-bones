import * as ROT from 'rot-js'
import * as Bones from '../bones'
import { InputResponse } from '../game-engine';
import { GameEvent } from '../game-engine/events';

export function getEventOnMonsterTurn(game: Bones.Engine.Game, actor: Bones.Entities.Actor) : InputResponse {
    let x = ROT.RNG.getUniform()
    let mob_event : InputResponse
    if (x > 0.6667) {
        mob_event  = {validInput: true, actualEvent: new GameEvent(this, Bones.Enums.EventType.FANCY, false)}
    } else {
        mob_event  = {validInput: true, actualEvent: new GameEvent(this, Bones.Enums.EventType.WAIT, true)}
    }

    return mob_event
}