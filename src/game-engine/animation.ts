import { Color } from 'rot-js';
import * as Bones from '../bones'
import { CoordinateArea } from '../game-components/coordinate-area';
import { GridOfEntities } from '../game-components/grid';
import { Entity } from '../game-entities';
import { AnimationType, EntityType, EventType } from "../game-enums/enums";
import { GameEvent } from './events';

export function doesEventRequireAnimation(game: Bones.Engine.Game, event: GameEvent) : boolean {
    return [EventType.ABILITY_JUMP, EventType.ABILITY_ZAP].indexOf(event.eventType) > -1
}

export function getAnimationObject(game: Bones.Engine.Game, event: GameEvent) : TurnBasedAnimation {
    let animationType : AnimationType

    switch (event.eventType) {

        case EventType.ABILITY_PLANT:
        case EventType.ABILITY_ZAP:
            animationType = AnimationType.FLASH
            break

        case EventType.ABILITY_JUMP:
            animationType = AnimationType.PATH
            break
    }

    let animate = new TurnBasedAnimation(game, event, animationType)
    return animate
}


export class TurnBasedAnimation {
    private frames : Array<TurnBasedAnimationFrame> = []

    constructor (
        private game: Bones.Engine.Game,
        public generatingEvent : GameEvent,
        public animationType : AnimationType,
    ) {
        this.frames = generateAnimationFrames(this)
    }

    getFrames() : Array<TurnBasedAnimationFrame> {
        return this.frames
    }

    getNumberOfFrames() : number { return this.frames.length }

    getFrameNumber(x: number) : TurnBasedAnimationFrame {
        return this.frames[x]
    }
}

function generateAnimationFrames(tbanimation: TurnBasedAnimation)  : Array<TurnBasedAnimationFrame> {
    let frames : Array<TurnBasedAnimationFrame> = []
    
    if (tbanimation.animationType == AnimationType.FLASH) {
        let only_frame = new TurnBasedAnimationFrame(tbanimation)
        only_frame.addCell('x', Bones.Color.white, Bones.Color.red, tbanimation.generatingEvent.eventData.to_xy)
        frames.push(only_frame)

    } else if (tbanimation.animationType == AnimationType.PATH) {
        let start_xy = tbanimation.generatingEvent.eventData.from_xy
        let end_xy = tbanimation.generatingEvent.eventData.to_xy
        let path_xys = Bones.Utils.getLineBetweenPoints(start_xy, end_xy)
        for (let i = 0; i < path_xys.length; i++) {
            let my_frame = new TurnBasedAnimationFrame(tbanimation)
            my_frame.addCell('x', Bones.Color.white, Bones.Color.red, path_xys[i])
            frames.push(my_frame)
        }
    }

    return frames
}

/// twpwuz here - create a new file called special-events that handles menus targeting animation!
// dictinoary of event type -> function, dont need case statement, just check dict first and then call function


class TurnBasedAnimationFrame {
    constructor (
        private parent : TurnBasedAnimation,
        private cells : Array<Entity> = []
    ) {
        
    }

    getParent() : TurnBasedAnimation { return this.parent }

    getCoordinates() : Array<Bones.Coordinate> {
        return this.cells.map((extant: Entity) => { return extant.location })
    }

    getCells() : Array<Entity> {
        return this.cells
    }

    addCell(char: string, fg_color: Bones.ROTColor, bg_color: Bones.ROTColor, location_xy: Bones.Coordinate) : boolean {
        
        // don't add if we already have it in here
        let my_area = new CoordinateArea(this.getCoordinates())
        if (my_area.hasCoordinate(location_xy)) { 
            return false
        }

        let extant = new Entity({
            code: char, color: fg_color, bg_color: bg_color, entityType: EntityType.AnimationBlip,
            location: location_xy
        })
        this.cells.push(extant)
        return true
    }
}

export function runAnimation(game: Bones.Engine.Game, event: GameEvent) : Promise<boolean> {
    let turnBasedAnimation = event.eventData.animationObject
    
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    
    let num_frames = turnBasedAnimation.getNumberOfFrames()
    console.log(turnBasedAnimation)

    for (let i = 0; i < num_frames; i++) {
        wait(i * 500).then(() => {
            // console.log(`waited ${i} times ${words}`)
            
            if (i > 0) {
                // 'undraw' previous frame
                let animating_xys = turnBasedAnimation.getFrameNumber(i-1).getCoordinates()
                game.display.drawList(animating_xys)
            } 
            
            let animating_frame = turnBasedAnimation.getFrameNumber(i)
            let animating_cells = animating_frame.getCells()
            for (let j = 0; j < animating_cells.length; j++) {
                let cell = animating_cells[j]
                let screen_xy = cell.location.subtract(game.cameraOffset)
                game.display.drawPointAtScreen(screen_xy, cell.code, cell.color, cell.bg_color)
            }
        })
    }
    return wait((num_frames + 0) * 500).then(() => {
        return true
    })
}