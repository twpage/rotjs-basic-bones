import { Coordinate } from "../game-components";
import { Game } from "../game-engine";
import { GameEvent } from "../game-engine/events";
import { ITargetingRules, TargetSelector } from "../game-engine/target-selector";
import { Actor } from "../game-entities";
import { EventType, GameState } from "../game-enums/enums";


export function activateNewTargeting(game: Game, precursor_tgt_event: GameEvent) : boolean { 
    // assume we need to make our own target selector
    let given_tgt_rules = generateTargetingRules(game, precursor_tgt_event.actor, precursor_tgt_event.eventData.nextEventType)

    // todo: default offset based off target type or something
    let built_targeter = new TargetSelector(game, given_tgt_rules, precursor_tgt_event) //buildTargetSelector(game, precursor_tgt_event, given_tgt_rules)
    return setupGameStateForTargeting(game, built_targeter)
}

function setupGameStateForTargeting(game: Game, given_tgt: TargetSelector) : boolean {
    game.activeTargeting = given_tgt
    game.state = GameState.GAME_TARGETING

    game.display.drawTargeting(given_tgt)

    return true
}

export function updateActiveTargeting(game: Game, precursor_tgt_event: GameEvent, offset_xy: Coordinate) : boolean {
    console.log(offset_xy)
    game.display.undrawTargeting(game.activeTargeting)
    game.activeTargeting.addOffsetToTarget(offset_xy)
    game.display.drawTargeting(game.activeTargeting)
    return true
}

export function cancelActiveTargeting(game: Game, precursor_tgt_event: GameEvent) : boolean { 
    clearActiveTargeting(game)
    return true
}

export function errorOnActiveTargeting(game: Game, precursor_tgt_event: GameEvent) : boolean {
    console.log(precursor_tgt_event.eventData.errMsg)
    return true
}

function clearActiveTargeting(game: Game) : void {
    // cancel altogether
    game.state = GameState.GAME_CORE
    game.activeTargeting = null
    game.display.drawAll()
}

export function confirmActiveTargeting(game: Game, precursor_tgt_event: GameEvent) : boolean {
        // fire off whatever action/event was just selected
        let selected_event = game.activeTargeting.getSelectedEvent() // grab before we clear everything out

        // clear out of active menu
        clearActiveTargeting(game)
    
        // add our next event
        game.addEventToQueue(selected_event)

    return true
}

function generateTargetingRules(game: Game, targeter: Actor, event_type: EventType) {
    let default_rules : ITargetingRules = {
        maxEucidianDistance: (event_type==EventType.ABILITY_JUMP) ? 3.5: 6.5,
        destMustBeVisible: true,
        destMustBeWalkable: true,
        requiresTargetedActor: (event_type==EventType.ABILITY_JUMP) ? false : true,
        allowedToTargetSelf: false
    }

    return default_rules
}
