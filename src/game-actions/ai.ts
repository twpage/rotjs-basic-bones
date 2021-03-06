import * as ROT from 'rot-js'
import * as Bones from '../bones'
import { InputResponse } from '../game-engine';
import { GameEvent } from '../game-engine/events';
import { ActorType } from '../game-enums/enums';

export function getEventOnMonsterTurn(game: Bones.Engine.Game, actor: Bones.Entities.Actor) : InputResponse {
    let x = ROT.RNG.getUniform()
    let mob_event : InputResponse
    // if (x > 0.6667) {
    //     mob_event  = {validInput: true, actualEvent: new GameEvent(this, Bones.Enums.EventType.FANCY, false)}
    // } else {
    //     mob_event  = {validInput: true, actualEvent: new GameEvent(this, Bones.Enums.EventType.WAIT, true)}
    // }
    if (actor.actorType == ActorType.ARCHITECT) {
        mob_event = {validInput: true, actualEvent: new GameEvent(actor, Bones.Enums.EventType.GAMETICK, true)}
    } else {
        mob_event  = {validInput: true, actualEvent: new GameEvent(actor, Bones.Enums.EventType.WAIT, true)}
    }


    return mob_event
}

export function execGameTick(game: Bones.Engine.Game, actor: Bones.Entities.Actor) : boolean {
    let region = game.current_region

    // are the monsters all gone?
    let found_mobs = game.current_region.actors.getAllEntities().filter((mob) => { return mob.actorType == ActorType.MOB })
    if (found_mobs.length == 0) {
        // make some more
        let safe_xys = ROT.RNG.shuffle(region.getWalkableTerrainWithoutActors())
        let used_xys : Bones.Coordinate[] = []

        for (let i = 0; i < 2; i++) {
            let mob = new Bones.Entities.Actor(Bones.Definitions.Actors.MOB)
            let safe_xy = safe_xys.pop()
            region.actors.setAt(safe_xy, mob)
            game.scheduler.add(mob, true) // need to add to scheduler manually since we already started the region
            used_xys.push(safe_xy)
        }
        game.display.drawList(used_xys)
    }
    return true
}