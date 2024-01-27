// import * as Directions from '../game-components/direction'
import * as Bones from '../bones'
import { GameEvent, IEventData } from '../game-engine/events';
import { Game } from '../game-engine/game';
import { EventType, UI } from '../game-enums/enums';
import * as Translate from './translate'
import * as Handle from './handle'

export class generatedGamepadButtonEvent {
    constructor (
        private id: string,
        public button_number: number,
        public button_value: number
    ) {

    }
}

export interface IInputResponse {
    validInput: boolean
    actualEvent?: GameEvent
    event_type?: EventType
    eventData?: IEventData
}

// return Input Response ("suggested" user-generated event) based on physical input
export function handleInput(game: Game, web_event: PhysicalInputEvent) : IInputResponse {
    
    if (web_event instanceof KeyboardEvent) {
        return sendKeyboardInputToHandler(game, web_event)
    } else if (web_event instanceof MouseEvent) {
        return Handle.handleMouseInput(game, web_event)
    } else if (web_event instanceof generatedGamepadButtonEvent) {
        return sendGamepadInputToHandler(game, web_event)
    }
}

export type PhysicalInputEvent = KeyboardEvent | MouseEvent | generatedGamepadButtonEvent //| GamepadEvent

// class to handle async calls for player input (keyboard, mouse, and toggle game state to receive gamepad input)
export class InputUtility {
    public static processInputCallback: (event: PhysicalInputEvent) => any;
    private static resolve: (value?: any) => void;

    static waitForInput(game: Game, handleInput: (event: PhysicalInputEvent) => IInputResponse): Promise<IInputResponse> {
        return new Promise(resolve => {
            if (InputUtility.processInputCallback !== undefined) {
                InputUtility.stopProcessing(game, null);
            }

            InputUtility.resolve = resolve;
            InputUtility.processInputCallback = (event: PhysicalInputEvent) => InputUtility.processInput(game, event, handleInput);

            window.addEventListener("keydown", InputUtility.processInputCallback);
            window.addEventListener("mouseup", InputUtility.processInputCallback);
            game.accepting_input = true
            // console.log("start accepting input")
        });
    }

    private static processInput(game: Game, event: PhysicalInputEvent, handleInput: (event: PhysicalInputEvent) => IInputResponse ): void {
        let input_response = handleInput(event)
        if (input_response.validInput) {
            InputUtility.stopProcessing(game, input_response)
        }
    }

    private static stopProcessing(game: Game, input_response : IInputResponse): void {
        window.removeEventListener("keydown", InputUtility.processInputCallback);
        window.removeEventListener("mouseup", InputUtility.processInputCallback);
        InputUtility.processInputCallback = undefined;
        InputUtility.resolve(input_response);
        game.accepting_input = false
        // console.log("stop accepting input")
    } 
}



function sendGamepadInputToHandler(game: Game, gp_btn_event: generatedGamepadButtonEvent) : IInputResponse {
    let ui : UI = Translate.convertGamepadButtonInputToUI(gp_btn_event)
    return Handle.handleKeyAndGamepadHelper(game, ui)
}

function sendKeyboardInputToHandler(game: Game, kb_event: KeyboardEvent) : IInputResponse {
    let ui : UI = Translate.convertKeyboardInputToUI(kb_event)
    return Handle.handleKeyAndGamepadHelper(game, ui)
}

export function isMovementUi(given_ui: UI) : boolean {
    let movement_ui_list = [UI.UP, UI.LEFT, UI.DOWN, UI.RIGHT]
    return movement_ui_list.indexOf(given_ui) > -1
}

export function convertUIMovementToDirectionCoord(given_ui : UI) : Bones.Coordinate {
    let movement_ui_list = [UI.UP, UI.LEFT, UI.DOWN, UI.RIGHT]
    let movement_dir_lst = [Bones.Directions.UP, Bones.Directions.LEFT, Bones.Directions.DOWN, Bones.Directions.RIGHT]
        
    let idx = movement_ui_list.indexOf(given_ui)

    if (idx == -1) {
        // should not have been given this coord
        console.warn(`given non-movement UI ${UI[given_ui]} to conversion function`)
        return new Bones.Coordinate(0, 0)
    }

    let corresponding_dir = movement_dir_lst[idx]
    return corresponding_dir
}

