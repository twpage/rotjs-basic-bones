import * as Bones from '../bones'
import { Entity, IEntityDefinition } from './entity'

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

        let mob_response : Bones.Engine.InputResponse
        mob_response = Bones.Actions.AI.getEventOnMonsterTurn(game, this)
        return Promise.resolve(mob_response)
    }
}
