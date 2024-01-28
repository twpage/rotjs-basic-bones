# What Is This

A slightly "less than bare bones" engine written for [rot.js](https://ondras.github.io/rot.js/hp/), the ~~JavaScript~~ TypeScript roguelike toolkit. It is not really a full-blown engine on it's own (I don't believe in writing roguelike engines), rather it is meant to be used as a starting point for other games. It has enough of the underlying structures (grids, entities, events, etc.) without making judgements on gameplay or game style. It uses an event queue and Promises to allow for animations and event chaining within the classic roguelike turn-based environment.

"Basic Bones" includes:

* Grid/Coordinate/Entities class that I have built up over dozens of games
* Event queue easily allows for events can create other events (e.g. explosions or projectiles that do damage)
    * Basic menu system that is handled using the same event queue, including sub-menus and menu inputs that launch other events
    * Basic targeting interface also handled using same event queue, allows for chaining events that need additional play input (firing, throwing, aiming, etc.)
* Using promises/Await to handle player (keyboard) input and animated events
* ROT.js display, with field of view and player memory
* Support for *scrolling* views (e.g. viewable window is smaller than the entire gameplay map)
* Dumb AI - enemies will follow you if they can see you, then attack. They will stand still otherwise.
* 'Architect' construct that runs a 'game tick' event each turn (for simulating environmental effects)
    * Placeholder 'game tick' event will respawn monsters when they are all dead, and resurrect the player if necessary
* Basic Input:
    * *Xbox 360 Gamepad support through browser GamePad API*
    * Move: WASD, Arrow Keys, Gamepad D-pad
    * Wait/Action: SPACE, ENTER, Gamepad 'A' button
    * Abilities: E, Gamepad 'Y' button
    * Cancel/Back: Q, ESC, Gamepad 'B' button
    * Secondary/Next: F, Gamepad 'X' button (no current function)
* 'Cancel' and 'Secondary' inputs fire off placeholder/demo events

"Basic Bones" does *not* include:

* Any fancy level generation (this uses the ROT.js Digger algorithm)
* Any fancy monster AI
* Doors
* Real Combat (one hit and you die)
* ~~Targeting or multiple input handlers (yet..)~~

# See Also

[rotjs-bare-bones](https://github.com/twpage/rotjs-bare-bones) for an actual bare bones repo that simply gets rot.js running on a static HTML page.

# NPM Setup

npm init -y

npm install --save-dev typescript rot-js webpack webpack-cli ts-loader http-server npm-run-all

# Edit Scripts

Edit 'scripts' in package.json:

```
"scripts": {
    "build": "webpack",
    "watch": "webpack --watch",
    "serve": "http-server --port=8085"
  },
```

# Build & Run Server

npx npm-run-all --parallel watch serve
