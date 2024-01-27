import { mod } from "rot-js/lib/util"
import { EventType, MenuType } from "../game-enums/enums"
import { GameEvent } from "./events"
import { Game } from "./game"

export interface IMenuEntry {
    menuName : string
    menuDesc : string
    showAsDisabled? : boolean
    menuTriggeredEvent : GameEvent
}

// interface IEventRequiresMenuResult {
//     requiresMenu : boolean
//     nextMenu : Menu
// }

export class Menu {
    private parent_menu : Menu = null
    
    constructor (
        private game : Game,
        public menuType : MenuType,
        private menuGeneratingEvent : GameEvent, // todo: make all events have a parent so we can collapse them?
        private menu_entities : Array<IMenuEntry>,
        private current_index : number = 0) {

    }

    getCurrentIndex() : number { return this.current_index }
    isCurrentIndex(entry_index: number) : boolean { return entry_index == this.current_index }

    hasParent() : boolean {
        return (this.parent_menu == null) ? false : true
    }

    getParent() : Menu {
        return this.parent_menu
    }

    getEntries() : Array<IMenuEntry> {
        return this.menu_entities
    }

    setParent(new_parent : Menu) : void {
        this.parent_menu = new_parent
    }

    // createNestedMenu(triggering_event : GameEvent, menu_entities : Array<IMenuEntry>) : Menu {
    //     let nested_menu = new Menu(
    //         this.game, this.menuType, triggering_event, menu_entities, 0
    //     )

    //     nested_menu.setParent(this)
    //     return nested_menu
    // }

    // createNestedMenuEvent(triggering_event : GameEvent, menu_entities : Array<IMenuEntry>) : GameEvent {
    //     let nested_menu = this.createNestedMenu(triggering_event, menu_entities)
    //     let nested_menu_event = new GameEvent(
    //         triggering_event.actor,
    //         EventType.MENU_START,
    //         false,
    //         {
    //             activeMenu: nested_menu
    //         }
    //     )

    //     return nested_menu_event
    // }

    getSelectedEvent() : GameEvent {
        return this.getTriggeredEvent(this.current_index)
    }

    getTriggeredEvent(menu_index : number) : GameEvent {
        let triggered_event : GameEvent = this.menu_entities[menu_index].menuTriggeredEvent
        
        // figure out if event leads to another menu, in which case return new menu with this one nested inside
        let needs_sub_menu = (triggered_event.eventType == EventType.MENU_START)

        if (needs_sub_menu) {
            triggered_event.eventData.activeMenu.setParent(this)
            // let sub_menu_entries = getRequiredMenuEntriesFromEvent(triggered_event)
            // let sub_menu_event = this.createNestedMenuEvent(triggered_event, sub_menu_entries)
            // return sub_menu_event
        }
        return triggered_event
    }

    incrementMenuIndex(inc: number) : void {
        // increment index and return the new one
        let new_index = mod(this.current_index + inc, this.menu_entities.length)
    
        this.current_index = new_index
    }
}

// export function checkIfEventRequiresMenu(checked_event: GameEvent) : boolean {
//     return false
// }

// export function getRequiredMenuEntriesFromEvent(checked_event : GameEvent) : Array<IMenuEntry> {
//     return []
// }