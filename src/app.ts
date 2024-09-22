import * as  ROT from 'rot-js/lib/index'
import * as Bones from './bones'

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144#901144
function getParameterByName(name: string) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

let browser_given_seed = getParameterByName("seed")

function startMe() {
    // ROT.RNG.setSeed(1111)

    let divElementsIDs : Bones.IDisplayDivElementIDs = {
        divMain: "div_display",
        divFooter: "div_footer"
    }

    let init_seed : number = 0
    if (browser_given_seed) {
        init_seed = parseInt(browser_given_seed)
    }
    let game = new Bones.Engine.Game(divElementsIDs, init_seed)

    window.addEventListener("gamepadconnected", function(gamepad_event : GamepadEvent) {
        var gp = navigator.getGamepads()[gamepad_event.gamepad.index]
        game.connectGamepad(gp)
    })

    window.addEventListener("gamepaddisconnected", function(gamepad_event : GamepadEvent) {
        console.log('got disconnected event')
        var gp = navigator.getGamepads()[gamepad_event.gamepad.index]
        game.disconnectGamepad(gp)
    })

    game.gameLoop()
}


startMe()