import * as  ROT from 'rot-js/lib/index'
import Simple from "rot-js/lib/scheduler/simple"
import * as Bones from '../bones'
import { EntityType } from '../game-enums/enums'
import { GameEvent } from './events'


export class Game {
    scheduler : Simple
    player : Bones.Entities.PlayerActor
    architect : Bones.Entities.Actor
    event_queue : Bones.Engine.Events.GameEvent[]
    current_region : Bones.Region
    display : Bones.Display

    constructor(divElements : Bones.IDisplayDivElementIDs) {
        this.display = new Bones.Display(this, divElements)


        this.scheduler = new ROT.Scheduler.Simple()
        this.player = new Bones.Entities.PlayerActor(Bones.Definitions.Actors.HERO)
        this.architect = new Bones.Entities.Actor(Bones.Definitions.Actors.ARCHITECT)
        this.architect.name = "architect"

        let first_region = new Bones.Region(Bones.Config.regionSize, 1)
        this.setCurrentRegion(first_region)
    }
    
    setCurrentRegion(region: Bones.Region) {
        // load a new region
        this.current_region = region

        // clear scheduler first
        this.scheduler.clear()

        // add all actors from this region into our scheduler
        for (let a of region.actors.getAllEntities()) {
            this.scheduler.add(a, true)
        }

        // add our player
        this.scheduler.add(this.player, true)
        region.actors.setAt(region.start_xy, this.player)
        
        // add architect
        this.scheduler.add(this.architect, true)

        // draw everything
        this.display.drawAll()

        return true
    }

    public async gameLoop() {

        while (1) {
            let actor = this.scheduler.next()
            if (!actor) { break }

            let current_turn_count = actor.turn_count
            this.event_queue = []
            while (actor.turn_count == current_turn_count) {
                let ir : Bones.Engine.InputResponse = await actor.act(this)
                let next_event : GameEvent

                if (actor.isPlayerControlled()) {
                    // translate player inputs first 
                    next_event = Bones.Engine.Events.convertPlayerInputToEvent(this, actor, ir)
                    // new Bones.Engine.Events.GameEvent(actor, ir.event_type, true)
                } else {
                    // AI can just give you the event directly
                    next_event = ir.actualEvent
                }
                
                this.event_queue.push(next_event)
                
                while (this.event_queue.length > 0) {
                    await Bones.Engine.Events.processEvents(this)
                }
            }
        }
    }

    addEventToQueue(queued_event: GameEvent) {
        this.event_queue.push(queued_event)
    }
}