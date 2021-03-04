import * as  ROT from 'rot-js/lib/index'
import * as Bones from '../bones'
import { EntityType } from '../game-enums/enums'
import { Entity, IEntityDefinition } from './entity'
import { GameEvent } from '../game-engine/events'

export class Actor extends Entity {
    public turn_count : number

    constructor (public name: string, public is_player : boolean = false, entity_def : IEntityDefinition) {
        super(entity_def)
        this.turn_count = 1
    }

    public isPlayerControlled(): boolean {
        return false
    }
    
    act (game: Bones.Engine.Game) : Promise<Bones.Engine.InputResponse> {
        let x = ROT.RNG.getUniform()
        let mob_response : Bones.Engine.InputResponse
        if (x > 0.6667) {
            mob_response  = {validInput: true, actualEvent: new GameEvent(this, Bones.Enums.EventType.FANCY, false)}
        } else {
            mob_response  = {validInput: true, actualEvent: new GameEvent(this, Bones.Enums.EventType.WAIT, true)}
        }
        
        // mob_response  = {validInput: true, event_type: EventType.MOVE}
        return Promise.resolve(mob_response)
    }
}
