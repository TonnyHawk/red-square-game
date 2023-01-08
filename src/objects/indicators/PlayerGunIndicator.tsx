import GameObject from "../basic/GameObject";
import Person from "../basic/Person";
import Game from "../Game";
import Indicator from "./Indicator";
import GunIndicator from "../../components/GunIndicator";
import ReactDOM from "react-dom/client";
import React from "react";

export default class PlayerGunIndicator extends Indicator {
	pageElement;
	constructor(game: Game, target: Person | GameObject) {
		super(game, target);
		this.pageElement = ReactDOM.createRoot(document.getElementById("gun") as HTMLElement);
	}

	draw(): void {
		this.update();
		if (this.target.gun) {
			// update indicator element on the page
			const { bulletsInClip } = this.target.gun;
			const { fullAmo } = this.target.gun;
			if (!this.target.gun.isReloading) {
				this.pageElement.render(<GunIndicator available={bulletsInClip} full={fullAmo} />);
			} else {
				this.pageElement.render(<GunIndicator available={bulletsInClip} full={fullAmo} isReloading={true} />);
			}
		}
	}
}
