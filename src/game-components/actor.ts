import * as  ROT from 'rot-js/lib/index'
import { EventType } from './events'
import { Game } from "./game"
import { InputResponse, handleInput } from "./input-handlers"
import { InputUtility } from "./input-utility"

export class Actor {
    public turn_count : number

    constructor (public name: string, public is_player : boolean = false) {
        this.turn_count = 1
    }

    act (game: Game) : Promise<InputResponse> {
        let x = ROT.RNG.getUniform()
        let mob_response : InputResponse
        if (x > 0.6667) {
            mob_response  = {validInput: true, event_type: EventType.FANCY}
        } else {
            mob_response  = {validInput: true, event_type: EventType.MOVE}
        }
        
        // mob_response  = {validInput: true, event_type: EventType.MOVE}
        return Promise.resolve(mob_response)
    }
}

export class PlayerActor extends Actor {
    act (game: Game) : Promise<InputResponse> {
        // this.turn_count += 1
        console.log(`waiting on player input for turn #${this.turn_count}`)
        
        return InputUtility.waitForInput(handleInput.bind(this))
    }
}