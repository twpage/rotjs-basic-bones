import * as  ROT from 'rot-js/lib/index'
import Simple from "rot-js/lib/scheduler/simple"
// import { InputResponse } from './input-handlers'
// import { processEvents, GameEvent } from './events'
// import { Actor, PlayerActor } from './actor'
import * as Bones from '../bones'

export class Game {
    scheduler : Simple
    player : Bones.Entities.PlayerActor
    architect : Bones.Entities.Actor
    event_queue : Bones.Engine.Events.GameEvent[]

    constructor() {
        this.scheduler = new ROT.Scheduler.Simple()
        this.player = new Bones.Entities.PlayerActor("hero", true)
        this.architect = new Bones.Entities.Actor("architect")

        this.scheduler.add(new Bones.Entities.Actor("mob1"), true)
        this.scheduler.add(new Bones.Entities.Actor("mob2"), true)
        this.scheduler.add(this.player, true)
    }
    

    public async gameLoop() {
        while (1) {
            let actor = this.scheduler.next()
            if (!actor) { break }

            let current_turn_count = actor.turn_count
            this.event_queue = []
            while (actor.turn_count == current_turn_count) {
                let ir : Bones.Engine.InputResponse = await actor.act(this)
                let next_event = new Bones.Engine.Events.GameEvent(actor, ir.event_type)
                this.event_queue.push(next_event)
                
                while (this.event_queue.length > 0) {
                    await Bones.Engine.Events.processEvents(this)
                }
            }
        }
    }
}