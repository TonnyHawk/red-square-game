import { getTimestamp } from "../../utils/index";
import Game from "../Game";
import Bullet from "./Bullet";
import { AnimationFrame } from "../../types/index";
import Person from "./Person";
import GunIndicator from "../indicators/GunIndicator";

export default class Gun {
	// bullets available
	clipSize: number;
	bulletsInClip: number;
	fullAmo: number;
	shotRange: number;
	isReloading: boolean;
	reloadingTime: {
		full: number;
		left: number;
		end: number;
	};
	remainingTime: {
		min: number;
		max?: number;
	};
	owner: Person;
	lastShotTime: number;
	game: Game;
	reloadingAnimation: AnimationFrame;
	indicator: GunIndicator;

	constructor(game: Game, owner: Person) {
		this.clipSize = 3;
		this.bulletsInClip = 3;
		this.fullAmo = 3;
		this.shotRange = 200;
		this.isReloading = false;
		this.reloadingAnimation = null;
		// time betwen two shots
		this.remainingTime = {
			min: 300,
		};
		this.reloadingTime = {
			full: 2000,
			left: 2000,
			end: 0,
		};
		this.owner = owner;
		this.lastShotTime = getTimestamp();
		this.game = game;
		this.indicator = new GunIndicator(game, owner);
	}
	reload() {
		this.isReloading = true;
		console.log("gun is reloading");
		const reloading = () => {
			const now = getTimestamp();
			if (this.reloadingTime.end === 0) this.reloadingTime.end = now + this.reloadingTime.full;
			this.reloadingTime.left = this.reloadingTime.end - now;
			if (this.reloadingTime.left <= 0) {
				this.isReloading = false;
				this.reloadingTime.end = 0;

				let restOfAmmo = this.fullAmo - this.clipSize;
				if (restOfAmmo >= 0) {
					this.bulletsInClip = this.clipSize;
					this.fullAmo = restOfAmmo;
				} else if (restOfAmmo < 0) {
					this.bulletsInClip = this.fullAmo;
					this.fullAmo = 0;
				}

				if (this.reloadingAnimation) {
					cancelAnimationFrame(this.reloadingAnimation);
					this.reloadingAnimation = null;
				}
				console.log("gun is ready to shot");
			} else {
				this.reloadingAnimation = requestAnimationFrame(reloading);
			}
		};
		if (!this.reloadingAnimation) {
			this.reloadingAnimation = requestAnimationFrame(reloading);
		}
	}
	shot() {
		if (this.bulletsInClip > 0) {
			const now = getTimestamp();
			if (now - this.lastShotTime > this.remainingTime.min) {
				this.owner.game.objects.push(new Bullet(this.game, this.owner));
				this.bulletsInClip -= 1;
				this.lastShotTime = now;
			}
		} else if (this.bulletsInClip === 0 && this.isReloading === false) {
			if (this.fullAmo > 0) this.reload();
			else {
				console.log("No bullets to reload");
				this.game.setHintText("No bullets to reload", 2000);
			}
		}
	}
}
