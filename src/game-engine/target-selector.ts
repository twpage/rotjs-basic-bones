import { Utils } from "../bones";
import { Coordinate } from "../game-components";
import { EventType, VisionSource } from "../game-enums/enums";
import { GameEvent } from "./events";
import { Game } from "./game";

export interface ITargetingRules {
    destMustBeVisible: boolean
    destMustBeWalkable: boolean
    maxEucidianDistance: number
    requiresTargetedActor: boolean
    allowedToTargetSelf: boolean
}

export interface ITargetingResponse {
    isValid: boolean
    errMsg?: string
}
export class TargetSelector {
    // private parent_menu : Menu = null
    private completion_event_type : EventType
    private start_xy : Coordinate
    private target_xy : Coordinate

    constructor (
        private game : Game,
        public targetingRules : ITargetingRules,
        private generatingEvent : GameEvent) {
        // private completionEvent : GameEvent,
        // private target_xy : Coordinate = null) {
        
        this.completion_event_type = generatingEvent.eventData.nextEventType
        this.start_xy = (generatingEvent.eventData.from_xy != null) ? generatingEvent.eventData.from_xy : generatingEvent.actor.location.clone()
        
        this.target_xy = (generatingEvent.eventData.to_xy != null) ? generatingEvent.eventData.to_xy : this.start_xy.clone() 
    }

    getTarget() : Coordinate { return this.target_xy }

    addOffsetToTarget(offset_modifier_xy: Coordinate): boolean {
        this.target_xy = this.target_xy.add(offset_modifier_xy)
        // console.log(`target updated to ${this.target_xy.toString()}`)
        return true
    }
    
    checkValidTargetSelection() : boolean {
        // apply targeting rules to our current selection
        // let target_xy = this.getTarget()
        let targeter = this.generatingEvent.actor
        let terrain_at = this.game.current_region.terrain.getAt(this.target_xy)
        let mob_at = this.game.current_region.actors.getAt(this.target_xy)
        let target_is_self = (mob_at == targeter)
        let dist2d = Utils.dist2d(this.start_xy, this.target_xy)
        let target_is_visible = targeter.fov.getAt(this.target_xy) == VisionSource.Self

        // assume target is valid, but must pass all relevant tests first, if any fail then target is invalid

        // check visibility
        if ((this.targetingRules.destMustBeVisible) && (!(target_is_visible))) { return false }

        // ending destination is walkable
        if ((this.targetingRules.destMustBeWalkable) && (terrain_at.blocksWalking)) { return false }

        // check distance
        if (dist2d > this.targetingRules.maxEucidianDistance) { return false }
        
        // check if we need a target at the destination
        if ((this.targetingRules.requiresTargetedActor) && (!(mob_at))) { return false }

        // not allowed to hit yourself?
        if ((target_is_self) && (!(this.targetingRules.allowedToTargetSelf))) { return false }

        return true
    }

    getSelectedEvent() : GameEvent {
        // take the event we were given in the first place, paste in our selected target, 
        // and return event to be fired off

        let generated_event : GameEvent
        let valid_targeting = this.checkValidTargetSelection()
        
        if (valid_targeting) {

            generated_event = new GameEvent(
                this.generatingEvent.actor,
                this.completion_event_type,
                this.generatingEvent.endsTurn,
                {
                    from_xy: this.start_xy.clone(),
                    to_xy: this.target_xy.clone()
                }
            )
        } else {

            generated_event = new GameEvent(
                this.generatingEvent.actor,
                EventType.TARGETING_ERROR,
                false,
                {
                    errMsg: "invalid targeting TODO: better error message"
                }
            )
        }
        return generated_event
    }
}