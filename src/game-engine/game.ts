import * as  ROT from 'rot-js/lib/index'
import Simple from "rot-js/lib/scheduler/simple"
import * as Bones from '../bones'
import { Coordinate } from '../game-components'
import { GameEvent } from './events'
import { Queue } from '../basic-components'
import { Actor } from '../game-entities'
import { IInputResponse, InputUtility, generatedGamepadButtonEvent } from '../input/input-utils'
import { GameState } from '../game-enums/enums'
import { Menu } from './menu'
import { TargetSelector } from './target-selector'



export class Game {
    scheduler : Simple
    player : Bones.Entities.PlayerActor
    architect : Bones.Entities.Actor
    event_queue : Queue<GameEvent>
    
    current_region : Bones.Region
    display : Bones.Display
    cameraOffset : Bones.Coordinate

    gamepad : Gamepad
    gamepad_polling : ReturnType<typeof setInterval>
    accepting_input : boolean = false

    state : GameState
    activeMenu : Menu
    activeTargeting : TargetSelector

    constructor(divElements : Bones.IDisplayDivElementIDs, private init_seed : number) {
        console.log(`starting game with seed ${init_seed}`)
        this.initRNG(init_seed)

        this.display = new Bones.Display(this, divElements)
        this.scheduler = new ROT.Scheduler.Simple()
        this.player = new Bones.Entities.PlayerActor(Bones.Definitions.Actors.HERO)
        this.architect = new Bones.Entities.Actor(Bones.Definitions.Actors.ARCHITECT)
        this.architect.name = "architect"

        this.event_queue = new Queue<GameEvent>()

        this.clearCameraOffset()

        this.state = GameState.GAME_CORE
        let first_region = new Bones.Region(Bones.Config.regionSize, 1)
        this.setCurrentRegion(first_region)
    }

    initRNG(initial_seed : number) {
        ROT.RNG.setSeed(initial_seed)
    }

    setCurrentRegion(region: Bones.Region) {
        // load a new region
        this.current_region = region

        // clear scheduler first
        this.scheduler.clear()

        // add architect -- always goes first
        this.scheduler.add(this.architect, true)
        
        // add our player -- goes before any monsters I guess?
        this.scheduler.add(this.player, true)
        region.actors.setAt(region.start_xy, this.player)
        
        // add all other actors from this region into our scheduler
        for (let a of region.actors.getAllEntities()) {
            // make sure we don't add the player twice
            if (a == this.player) { continue }
            this.scheduler.add(a, true)
        }
        
        // re-center camera
        this.centerCameraOn(this.player)

        // draw everything
        this.display.drawAll()

        return true
    }

    public async gameLoop() {

        while (1) {
            let actor : Actor = this.scheduler.next()
            if (!actor) { break }

            let current_turn_count = actor.turn_count
            this.event_queue.clear()

            // don't process further until turn is completed aka 'something happened'
            while (actor.turn_count == current_turn_count) { 

                // refresh screen for player
                let updates_xys : Coordinate[] = []
                if (actor.location) {
                    updates_xys = Bones.Engine.FOV.updateFieldOfViewFor(this, actor)
                }
                if (actor.isPlayerControlled()) {
                    let updated_camera = this.centerCameraOn(actor)
                    // let updated_camera = this.resetCameraOn(actor)
                    if (updated_camera) {
                        this.display.drawAll()
                    } else {
                        this.display.drawList(updates_xys)
                    }
                }
                
                let ir : IInputResponse = await actor.act(this)
                let next_event : GameEvent

                if (actor.isPlayerControlled()) {
                    // translate player inputs first 
                    next_event = Bones.Engine.Events.convertPlayerInputToEvent(this, actor, ir)

                } else {
                    // AI can just give you the event directly
                    next_event = ir.actualEvent
                }
                
                this.event_queue.enqueue(next_event)
                
                while (this.event_queue.isNotEmpty()) {
                    await Bones.Engine.Events.processEvents(this)
                }
            }
        }
    }

    addEventToQueue(incoming_event: GameEvent) {
        this.event_queue.enqueue(incoming_event)
    }

    centerCameraOn(player_actor: Bones.Entities.Actor) : boolean {
        let player_xy = player_actor.location
        let half_disp_width = Math.floor(Bones.Config.viewableSize.width / 2)
        let half_disp_height =  Math.floor(Bones.Config.viewableSize.height / 2)

        let camera_x : number
        let camera_y : number

        if (player_xy.x < half_disp_width) {
            camera_x = 0
        } else if (player_xy.x > (Bones.Config.regionSize.width - half_disp_width)) {
            camera_x = Bones.Config.regionSize.width - Bones.Config.viewableSize.width
        } else {
            camera_x = player_xy.x - half_disp_width
        }

        if (player_xy.y < half_disp_height) {
            camera_y = 0
        } else if (player_xy.y > (Bones.Config.regionSize.height - half_disp_height)) {
            camera_y = Bones.Config.regionSize.height - Bones.Config.viewableSize.height
        } else {
            camera_y = player_xy.y - half_disp_height
        }

        let camera_xy = new Bones.Coordinate(camera_x, camera_y)
        // console.log(camera_xy.toString())
        let old_camera_xy = this.cameraOffset.clone()
        this.cameraOffset = camera_xy

        return (!(camera_xy.compare(old_camera_xy)))
    }

    // todo: repurpose this code into centerCameraOn ? why two versions?
    // resetCameraOn(player_actor: Bones.Entities.Actor) : boolean { // returns true if camera changed
    //     // only scroll when within the last /5th of the screen
    //     let player_map_xy = player_actor.location
    //     let player_screen_xy = player_actor.location.subtract(this.cameraOffset)

    //     let fifth_disp_width = Math.floor(Bones.Config.viewableSize.width / 5)
    //     let fifth_disp_height =  Math.floor(Bones.Config.viewableSize.height / 5)

    //     let fourfifths_disp_width = Math.floor(Bones.Config.viewableSize.width * 4 / 5)
    //     let fourfifths_disp_height =  Math.floor(Bones.Config.viewableSize.height * 4 / 5)

    //     let camera_offset_x : number = 0
    //     let camera_offset_y : number = 0

    //     if ((player_screen_xy.x < fifth_disp_width) && (player_actor.lastStepOffset.x < 0)) {
    //         camera_offset_x = -1
    //     } else if ((player_screen_xy.x > fourfifths_disp_width) && (player_actor.lastStepOffset.x > 0)) {
    //         camera_offset_x = +1
    //     }

    //     if ((player_screen_xy.y < fifth_disp_height) && (player_actor.lastStepOffset.y < 0)) {
    //         camera_offset_y = -1
    //     } else if ((player_screen_xy.y > fourfifths_disp_height) && (player_actor.lastStepOffset.y > 0)) {
    //         camera_offset_y = +1
    //     }
        
    //     // let camera_x = Math.max(0, Math.min(this.mapSize.width - Bones.Config.viewableSize.width, this.cameraOffset.x + camera_offset_x))
    //     // let camera_y = Math.max(0, Math.min(this.mapSize.height - Bones.Config.viewableSize.height, this.cameraOffset.y + camera_offset_y))

    //     let camera_x = this.cameraOffset.x + camera_offset_x
    //     let camera_y = this.cameraOffset.y + camera_offset_y

    //     let camera_xy = new Bones.Coordinate(camera_x, camera_y)
    //     // console.log(camera_xy.toString())
    //     let old_camera_xy = this.cameraOffset.clone()
    //     this.cameraOffset = camera_xy
    //     return (!(camera_xy.compare(old_camera_xy)))
    // }

    clearCameraOffset() : void { 
        this.cameraOffset = new Bones.Coordinate(0, 0)
    }

    connectGamepad(gp: Gamepad) : void {
        console.log(`gamepad ${gp.id} connected`) 
        this.gamepad = gp

        startGamepadPolling(this)
    }

    disconnectGamepad(gp: Gamepad) : void {
       console.log(`gamepad disconnected`) 
       this.gamepad = null
       stopGamepadPolling(this)
    }
}

function startGamepadPolling(game: Game) {
    // let gamepad = game.gamepad
    
    let button_last_state = false // https://stackoverflow.com/questions/63618281/what-is-onkeyup-in-gamepad-api

    game.gamepad_polling = setInterval(function () {
        if (game.accepting_input) {
            // change this code because apparently gamepad isn't always the first index of list if it's been connected/disconnected
            // let gamepad = navigator.getGamepads()[0] // TODO: store the index instead of the gamepad object?
            let gamepad : Gamepad
            let available_gamepads = navigator.getGamepads()
            for (let g = 0; g < available_gamepads.length; g++) {
                if (available_gamepads[g]) {
                    gamepad = available_gamepads[g]
                    break
                }
            }

            // check if any gamepad button is pressed
            let button_now_state = gamepad.buttons.some(function(button: GamepadButton) { return button.pressed })

            if (button_now_state != button_last_state) {
                button_last_state = button_now_state
                for (let btn = 0; btn < gamepad.buttons.length; btn++) {
                    let button = gamepad.buttons[btn]
                    if (button.pressed) {
                        // console.log(button)
                        InputUtility.processInputCallback(new generatedGamepadButtonEvent(gamepad.id, btn, button.value))
                        break
                    }
                }
            }
        }
    }, 10)
}

function stopGamepadPolling(game: Game) {
    console.log('clear polling')
    clearInterval(game.gamepad_polling)

}