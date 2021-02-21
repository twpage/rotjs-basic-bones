import * as  ROT from 'rot-js/lib/index'
import * as Bones from '../bones'
import { EntityType } from '../game-enums/enums'
import { Entity } from './entity'

export class Actor extends Entity {
    public turn_count : number

    constructor (public name: string, public is_player : boolean = false) {
        super(EntityType.Actor, "x", [0, 0, 0])
        this.turn_count = 1
    }

    act (game: Bones.Engine.Game) : Promise<Bones.Engine.InputResponse> {
        let x = ROT.RNG.getUniform()
        let mob_response : Bones.Engine.InputResponse
        if (x > 0.6667) {
            mob_response  = {validInput: true, event_type: Bones.Enums.EventType.FANCY}
        } else {
            mob_response  = {validInput: true, event_type: Bones.Enums.EventType.MOVE}
        }
        
        // mob_response  = {validInput: true, event_type: EventType.MOVE}
        return Promise.resolve(mob_response)
    }
}
