import * as  ROT from 'rot-js/lib/index'
import Simple from "rot-js/lib/scheduler/simple";
import { InputUtility } from './input-utility';
import Options from 'rot-js/lib/map/cellular'

function startMe() {
    ROT.RNG.setSeed(1111)

    let div_footer : HTMLDivElement = <HTMLDivElement>document.getElementById("div_footer")
    div_footer.innerHTML = "<p>loaded typescript</p>"

    let divMain : HTMLDivElement = <HTMLDivElement>document.getElementById("div_display")
    
    let font_size = 12
    let map_width = 31
    let map_height = 31

    let rotDisp = new ROT.Display({
        bg: "white",
        width: map_width,
        height: map_height,
        fontSize: font_size,
        forceSquareRatio: false,
        spacing: 1.05
    })
    let color_rgb = ROT.Color.randomize(ROT.Color.fromString("#4D4DA6"), [30, 30, 30])
    
    let callback = (x: number, y: number, value: number) => {
        if (value == 1) {
            rotDisp.draw(x, y, "#", ROT.Color.toHex(color_rgb), null)
        }
    }
    let d
    let x = ROT.RNG.getUniform()
    if (x < 0.3334) {
        d = new ROT.Map.IceyMaze(map_width, map_height, 0)

    }  else if (x < 0.6667) {
        

        d = new ROT.Map.Cellular(map_width, map_height)
        d.randomize(0.5)
        d.randomize(0.5)

    } else {
        d = new ROT.Map.Digger(map_width, map_height)
    }
    d.create(callback)

    let canvas = <HTMLCanvasElement>rotDisp.getContainer()
    divMain.appendChild(canvas)

    let game = new Game()
    game.gameLoop()
}

class Actor {
    public turn_count : number

    constructor (public name: string, public is_player : boolean = false) {
        this.turn_count = 1
    }

    act (game: Game) : Promise<InputResponse> {
        let x = ROT.RNG.getUniform()
        let mob_response : InputResponse
        if (x > 0.6667) {
            mob_response  = {validInput: true, event_type: EventType.FANCY}
        } else {
            mob_response  = {validInput: true, event_type: EventType.MOVE}
        }
        
        // mob_response  = {validInput: true, event_type: EventType.MOVE}
        return Promise.resolve(mob_response)
    }
}

class PlayerActor extends Actor {
    act (game: Game) : Promise<InputResponse> {
        // this.turn_count += 1
        console.log(`waiting on player input for turn #${this.turn_count}`)
        // console.log(`Player ${this.name} takes turn #${this.turn_count}`)
        
        return InputUtility.waitForInput(handleInput.bind(this))
    }
}
export interface InputResponse {
    validInput: boolean,
    event_type: EventType
}
enum EventType {
    NONE,
    WAIT,
    MOVE,
    FANCY,
    EXTRA_FANCY,
    MENU,
}

class Event {
    constructor(public actor: Actor, public event_type : EventType) {
        
    }
}

function handleInput(event: KeyboardEvent) : InputResponse {
    let code = event.keyCode
    if (code == ROT.KEYS.VK_SPACE) {
        return {validInput: true, event_type: EventType.WAIT}
    } else if (code == ROT.KEYS.VK_F) {
        return {validInput: true, event_type: EventType.FANCY}
    } else if (code == ROT.KEYS.VK_G) {
        return {validInput: true, event_type: EventType.EXTRA_FANCY}
    } else if (code == ROT.KEYS.VK_Q) {
        return {validInput: true, event_type: EventType.MENU}
    }

    return {validInput: false, event_type: EventType.NONE}
}

class Game {
    scheduler : Simple
    player : PlayerActor
    architect : Actor
    event_queue : Event[]

    constructor() {
        this.scheduler = new ROT.Scheduler.Simple()
        this.player = new PlayerActor("hero", true)
        this.architect = new Actor("architect")

        this.scheduler.add(new Actor("mob1"), true)
        this.scheduler.add(new Actor("mob2"), true)
        this.scheduler.add(this.player, true)
    }
    

    public async gameLoop() {
        while (1) {
            let actor = this.scheduler.next()
            if (!actor) { break }

            let current_turn_count = actor.turn_count
            this.event_queue = []
            while (actor.turn_count == current_turn_count) {
                let ir : InputResponse = await actor.act(this)
                let next_event = new Event(actor, ir.event_type)
                this.event_queue.push(next_event)
                
                while (this.event_queue.length > 0) {
                    await processEvents(this)
                }
            }
        }
    }
}
async function processEvents(game: Game): Promise<boolean>{
    let next_event = game.event_queue.shift()
    return await processEvent(game, next_event)
}

async function processEvent(game: Game, event: Event) : Promise<boolean>  {
    let actor = event.actor
    let event_type = event.event_type
    console.log(`${actor.name} takes turn #${actor.turn_count}: ${EventType[event_type]}`)
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
        game.event_queue.push(new Event(actor, EventType.FANCY))
        game.event_queue.push(new Event(game.architect, EventType.FANCY))
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
        wait(i * 1000).then(() => {
            console.log(`waited ${i} seconds ${words}`)
        })
    }
    return wait(3000).then(() => {
        return true
    })
}

startMe()