import * as Bones from '../bones'
import { ActorType } from '../game-enums/enums'
import { IInputResponse, InputUtility, handleInput } from '../input'
import { Actor, IActorDefinition } from './actor'

export class PlayerActor extends Actor {
    // constructor (actor_def : IActorDefinition) {
    //     super(actor_def)
    // }
    act (game: Bones.Engine.Game) : Promise<IInputResponse> {
        // this.turn_count += 1
        console.log(`waiting on player input for turn #${this.turn_count}`)

        return InputUtility.waitForInput(game, handleInput.bind(this, game))
    }

    isPlayerControlled(): boolean {
        return true
    }

}
