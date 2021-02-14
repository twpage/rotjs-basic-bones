# What Is This

A slightly "less than bare bones" engine written for [rot.js](https://ondras.github.io/rot.js/hp/), the ~~JavaScript~~ TypeScript roguelike toolkit. Meant to be used as a starting point for other games, it is not really a full-blown engine on it's own. It uses an event queue and Promises to allow for animations and event chaining within a turn-based environment.

# See Also

[rotjs-bare-bones](https://github.com/twpage/rotjs-bare-bones) for an actual bare bones repo that simply gets rot.js running on a static HTML page.

# NPM Setup

npm init -y

npm install --save-dev typescript rot-js webpack webpack-cli ts-loader live-server npm-run-all

# Edit Scripts

Edit 'scripts' in package.json:

```
"scripts": {
    "build": "webpack",
    "watch": "webpack --watch",
    "serve": "live-server --port=8085"
  },
```

# Build & Run Server

npx npm-run-all --parallel watch serve
