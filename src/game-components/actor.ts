import * as  ROT from 'rot-js/lib/index'
import * as Bones from '../bones'

export class Actor {
    public turn_count : number

    constructor (public name: string, public is_player : boolean = false) {
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

export class PlayerActor extends Actor {
    act (game: Bones.Engine.Game) : Promise<Bones.Engine.InputResponse> {
        // this.turn_count += 1
        console.log(`waiting on player input for turn #${this.turn_count}`)
        
        return Bones.Engine.InputUtility.waitForInput(Bones.Engine.handleInput.bind(this))
    }
}