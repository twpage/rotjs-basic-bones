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

# Thanks

Inspired by https://github.com/Mizar999/rotjs-typescript-basics
