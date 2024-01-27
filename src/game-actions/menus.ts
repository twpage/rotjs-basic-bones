import { Game } from "../game-engine";
import { GameEvent } from "../game-engine/events";
import { IMenuEntry, Menu } from "../game-engine/menu";
import { EventType, GameState, MenuType } from "../game-enums/enums";

function clearActiveMenu(game: Game) : void {
    // cancel altogether
    game.state = GameState.GAME_CORE
    game.activeMenu = null
    game.display.drawAll()
}

export function selectFromActiveMenu(game: Game, start_menu_event: GameEvent) : boolean {
    // fire off whatever action/event was just selected
    let selected_event = game.activeMenu.getSelectedEvent() // grab before we clear everything out

    // clear out of active menu
    clearActiveMenu(game)

    // add our next event
    game.addEventToQueue(selected_event)
    return true
}

export function updateActiveMenu(game: Game, start_menu_event: GameEvent, updateDirection: number) : boolean {
    game.activeMenu.incrementMenuIndex(updateDirection)
    game.display.drawMenu(game.activeMenu)
    return true
}

export function cancelActiveMenu(game: Game, start_menu_event: GameEvent) : boolean {
    if (game.activeMenu.hasParent()) {
        // go back to parent menu from child
        setupGameStateForMenu(game, game.activeMenu.getParent())
    } else {
        // cancel altogether
        clearActiveMenu(game)
    }
    
    return true
}

export function activateNewMenu(game: Game, start_menu_event: GameEvent) : boolean {
    
    // check if we were given a menu, in which case use that one
    let given_menu = start_menu_event.eventData.activeMenu
    if (given_menu) {
        
        return setupGameStateForMenu(game, given_menu)

    } else {
        // assume we need to make our own menu
        let given_menu_type = start_menu_event.eventData.menuType
        let built_menu = buildMenuOfType(game, start_menu_event, given_menu_type)
        return setupGameStateForMenu(game, built_menu)
    }
}

function setupGameStateForMenu(game: Game, given_menu: Menu) : boolean {
    game.activeMenu = given_menu
    game.state = GameState.GAME_MENU

    game.display.drawMenu(given_menu)

    return true
}

function getMenuEntriesFor_PlayerAbilities(game: Game, start_menu_event: GameEvent) : Array<IMenuEntry> {
    let built_menu_entries : Array<IMenuEntry> = []
    let entry_carpet : IMenuEntry = {
        menuName : "Plant",
        menuDesc: "Plant some grass",
        menuTriggeredEvent: new GameEvent(
            start_menu_event.actor,
            EventType.ABILITY_PLANT,
            true,
            {
                from_xy: start_menu_event.actor.location.clone(),
                to_xy: start_menu_event.actor.location.clone()
            }
        )
    }

    let entry_teleport : IMenuEntry = {
        menuName : "Teleport",
        menuDesc: "Teleport to a random safe location",
        menuTriggeredEvent: new GameEvent(
            start_menu_event.actor,
            EventType.ABILITY_TELEPORT,
            true,
            {
                from_xy: start_menu_event.actor.location.clone()
            }
        )
    }

    let entry_summon : IMenuEntry = {
        menuName : "Summon",
        menuDesc: "Summon a new monster nearby",
        menuTriggeredEvent: new GameEvent(
            start_menu_event.actor,
            EventType.ABILITY_SUMMON,
            true,
            {
                from_xy: start_menu_event.actor.location.clone()
            }
        )
    }

    let entry_zap : IMenuEntry = {
        menuName : "Zap",
        menuDesc: "Zap a monster from a distance",
        menuTriggeredEvent: new GameEvent(
            start_menu_event.actor,
            EventType.ABILITY_ZAP,
            true,
            {
                from_xy: start_menu_event.actor.location.clone(),
                targetingPassThrough: true
            }
        )
    }

    let entry_jump : IMenuEntry = {
        menuName : "Jump",
        menuDesc: "Jump to a nearby location",
        menuTriggeredEvent: new GameEvent(
            start_menu_event.actor,
            EventType.ABILITY_JUMP,
            true,
            {
                from_xy: start_menu_event.actor.location.clone(),
                targetingPassThrough: true
            }
        )
    }

    // stick 2 of these into a sub-menu for funsies
    let entry_submenu : IMenuEntry = {
        menuName: "More",
        menuDesc: "Sub-menu test",
        menuTriggeredEvent: new GameEvent(
            start_menu_event.actor,
            EventType.MENU_START,
            false,
            {
                activeMenu: new Menu(
                    game,
                    MenuType.PLAYER_ABILITIES,
                    start_menu_event,
                    [
                        entry_carpet,
                        entry_summon,
                    ]
                )
            }
        )
    }

    built_menu_entries.push(entry_jump, entry_zap,  entry_teleport, entry_submenu)
    return built_menu_entries
}

function buildMenuOfType(game: Game, start_menu_event: GameEvent, given_menu_type: MenuType) : Menu {
    let built_menu_entries : Array<IMenuEntry> = []

    if (given_menu_type == MenuType.PLAYER_ABILITIES) {
        let ability_entries = getMenuEntriesFor_PlayerAbilities(game, start_menu_event)
        built_menu_entries = built_menu_entries.concat(ability_entries)
    } else {
        // unknown menu type?
    }

    let built_menu = new Menu(
        game,
        given_menu_type,
        start_menu_event,
        built_menu_entries
    )

    return built_menu
}
