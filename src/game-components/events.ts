import { Actor } from './actor'
import { Game } from './game'

export enum EventType {
    NONE,
    WAIT,
    MOVE,
    FANCY,
    EXTRA_FANCY,
    MENU,
}

export class GameEvent {
    constructor(public actor: Actor, public event_type : EventType) {
        
    }
}


export async function processEvents(game: Game): Promise<boolean>{
    let next_event = game.event_queue.shift()
    return await processEvent(game, next_event)
}

async function processEvent(game: Game, event: GameEvent) : Promise<boolean>  {
    let actor = event.actor
    let event_type = event.event_type
    console.log(`running event ${EventType[event_type]} for ${actor.name} on turn #${actor.turn_count}`)
    if (event_type == EventType.MENU) {
        console.log("player did not use up their turn")
        return Promise.resolve(false)
    }

    if (event_type == EventType.FANCY) {
        // animation happens
        // twp wuz here: do i need to modify this function to also be aync / await?
        let words = (actor == game.architect) ? "***" : "*"
        await runFancyAnimation(words)
    }

    if (event_type == EventType.EXTRA_FANCY) {
        game.event_queue.push(new GameEvent(actor, EventType.FANCY))
        game.event_queue.push(new GameEvent(game.architect, EventType.FANCY))
        return Promise.resolve(false)
    }

    actor.turn_count += 1
    return Promise.resolve(true)
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
