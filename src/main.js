import Phaser from 'phaser'
import React from "react";
import ReactDOM from "react-dom"
import App from "./components/App"

import Game from './scenes/Game'

const config = {
	type: Phaser.AUTO,
	width: 640,
	height: 510,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [Game]
}

const game = new Phaser.Game(config);

ReactDOM.render(
  <App />,
  document.getElementById("root") || document.createElement("div")
);
