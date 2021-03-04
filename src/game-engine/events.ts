import * as Bones from '../bones'
import { InputResponse } from './input-handlers'
import { EventType } from '../game-enums/enums'
import { Game } from './game'

export interface IEventData {
    direction_xy?: Bones.Coordinate
    target?: Bones.Entities.Actor
}

export class GameEvent {
    constructor(
        public actor: Bones.Entities.Actor,
        public event_type : Bones.Enums.EventType, 
        public endsTurn: boolean,
        public eventData : IEventData = {}
        ) {
    }
}


export async function processEvents(game: Bones.Engine.Game): Promise<boolean>{
    let next_event = game.event_queue.shift()
    return await processEvent(game, next_event)
}

async function processEvent(game: Bones.Engine.Game, event: GameEvent) : Promise<boolean>  {
    let actor = event.actor
    let event_type = event.event_type
    console.log(`running event ${Bones.Enums.EventType[event_type]} for ${actor.name} on turn #${actor.turn_count}`)

    if (event_type == Bones.Enums.EventType.MENU) {
        console.log("player did not use up their turn")
        return Promise.resolve(false)
    }

    if (event_type == Bones.Enums.EventType.FANCY) {
        // animation happens
        // twp wuz here: do i need to modify this function to also be aync / await?
        let words = (actor == game.architect) ? "***" : "*"
        await runFancyAnimation(words)
    }

    if (event_type == Bones.Enums.EventType.EXTRA_FANCY) {
        game.event_queue.push(new GameEvent(actor, Bones.Enums.EventType.FANCY, false))
        game.event_queue.push(new GameEvent(game.architect, Bones.Enums.EventType.FANCY, false))
        return Promise.resolve(false)
    }


    if (event.endsTurn) {
        actor.turn_count += 1
        return Promise.resolve(true)
    } else {
        return Promise.resolve(false)
    }

}

function runFancyAnimation(words: string = "*") : Promise<boolean> {
    // return new Promise(resolve => setTimeout(resolve, 3000))
    // let fancy_fn = (num_seconds : number) => new Promise(resolve => setTimeout(resolve, num_seconds))
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

    for (let i = 0; i <= 3; i++) {
        wait(i * 500).then(() => {
            console.log(`waited ${i} times ${words}`)
        })
    }
    return wait(3 * 500).then(() => {
        return true
    })
}

export function convertPlayerInputToEvent(actor: Bones.Entities.Actor, ir: InputResponse) : GameEvent {
    let intended_event : GameEvent

    switch (ir.event_type) {
        case EventType.WAIT:
            intended_event = new GameEvent(actor, ir.event_type, true)
            break
        case EventType.ATTEMPT_MOVE:
            // if 
            // break
        default:
            intended_event = new GameEvent(actor, EventType.NONE, false)
    }

    return intended_event
}