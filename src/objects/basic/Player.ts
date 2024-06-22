import Person from "./Person";
import Gun from "./Gun";
import Game from "../Game";
import HealthIndicator from "../indicators/HealthIndicator";
import ActionRange from "../addones/ActionRange";
import PlayerGunIndicator from "../indicators/PlayerGunIndicator";
import Inventory from "../inventory/Inventory";
import { checkColision } from "../../utils/index";
import InventoryItem from "../inventory/items/InventoryItem";
import GameObject from "./GameObject";

export default class Player extends Person {
	visibilityRange: ActionRange;
	inventory: Inventory;
	game: Game;
	gun: Gun;
	around: {
		objects: InventoryItem[];
		check: (object: InventoryItem) => boolean;
		remove: (object: InventoryItem) => void;
		add: (object: InventoryItem) => void;
	};
	constructor(game: Game) {
		super(game);
		this.game = game;

		this.height = 50;
		this.width = 50;

		if (this.game.canvasElement !== null) {
			this.position = {
				top: this.game.canvasElement.height / 2 - this.height / 2,
				left: this.game.canvasElement.width / 2 - this.width / 2,
			};
		}

		this.speed = 6;
		this.direction = {
			top: 0,
			left: 0,
		};

		this.gun = new Gun(game, this);
		this.hp.indicator = new HealthIndicator(game, this);

		this.moveVectorName = "up";

		this.visibilityRange = new ActionRange(this.game, this, 50, "blue");
		this.actionRanges.add(this.visibilityRange);

		this.indicators.push(new PlayerGunIndicator(this.game, this));

		this.inventory = new Inventory(this.game, this);
		this.around = {
			objects: [],
			check: function (object) {
				const index = this.objects.indexOf(object);
				if (index >= 0) return true;
				return false;
			},
			add: function (object) {
				if (!this.check(object)) this.objects.push(object);
			},
			remove: function (object) {
				if (this.check(object)) {
					const index = this.objects.indexOf(object);
					this.objects.splice(index, 1);
				}
			},
		};
		this.updateIndicators();
	}

	draw() {
		this.actionRanges.draw();
		if (this.game.screen !== null) {
			this.game.screen.fillStyle = "red";
			this.game.screen.fillRect(this.position.left, this.position.top, this.width, this.height);

			const arrowImage = document.getElementById("player-direction-arrow") as HTMLImageElement;
			const shrinkRatio = this.height / arrowImage.height;

			const rotateObject = (angle: number) => {
				if (this.game.screen !== null) {
					this.game.screen.save();
					this.game.screen.translate(this.position.left + this.width / 2, this.position.top + this.height / 2);
					this.game.screen.rotate((angle * Math.PI) / 180);
					this.game.screen.fillStyle = "blue";
					this.game.screen.drawImage(arrowImage, (-1 * this.width) / 2 + 8.5, (-1 * this.height) / 2, this.width * shrinkRatio, this.height);
					this.game.screen.restore();
				}
			};

			switch (this.moveVectorName) {
				case "left":
					rotateObject(-90);
					break;
				case "right":
					rotateObject(90);
					break;
				case "up":
					rotateObject(0);
					break;
				case "down":
					rotateObject(180);
					break;
			}
		}
	}

	move() {
		this.heal();
		if (this.game.canvasElement !== null) {
			const newTopCoord = this.getCoords().top + this.direction.top;
			const newLeftCoord = this.getCoords().left + this.direction.left;
			const newBottomCoord = this.getCoords().bottom + this.direction.top;
			const newRightCoord = this.getCoords().right + this.direction.left;

			if (newTopCoord > 0 && newBottomCoord < this.game.canvasElement.height) {
				this.position.top = newTopCoord;
			}
			if (newLeftCoord >= 0 && newRightCoord < this.game.canvasElement.width) {
				this.position.left = newLeftCoord;
			}

			// check collisions
			this.game.items.forEach((item: InventoryItem) => {
				if (checkColision(item, this.visibilityRange)) {
					this.game.setHintText("Press 'e' to pick the item");
					this.around.add(item);
				} else {
					// this.game.setHintText("");
					this.around.remove(item);
				}
			});
			if (this.game.items.length === 0) {
				this.game.setHintText("");
			}
			this.draw();
		}
	}

	shoot() {
		this.gun.shot();
	}

	collect(item: InventoryItem) {
		this.around.remove(item);
		this.inventory.addItem(item);
		item.die();
	}
}
