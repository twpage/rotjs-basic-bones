import * as Bones from '../bones'
import { ActorType } from '../game-enums/enums'
import { Entity, IEntityDefinition } from './entity'

export class Actor extends Entity implements IActorDefinition {
    public turn_count : number
    public actorType : ActorType
    public name : string

    constructor (actor_def : IActorDefinition) {
        super(actor_def)
        this.turn_count = 1
        this.actorType = actor_def.actorType
        this.name = actor_def.name
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

export interface IActorDefinition extends IEntityDefinition {
    actorType : ActorType,
    name: string,
}
