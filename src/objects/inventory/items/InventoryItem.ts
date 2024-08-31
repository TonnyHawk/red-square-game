import { generateKey } from "../../../utils/index";
import GameObject from "../../basic/GameObject";
import Player from "../../basic/Player";
import Game from "../../Game";

export default class InventoryItem extends GameObject {
	image: HTMLImageElement;
	// description for inventary
	description: {
		name: string;
		amount: number;
		// link to the image
		image: string;
		text: string;
		// for inventory to decide in which tab will this one go
		tag: string[];
		// is the image large or pretty much compact?
		isLarge: boolean;
		// some items will function as a passive effect for the player
		isUsable: boolean;
		itemId: string;
	};
	effect: (owner: Player) => void;
	use: () => boolean;
	// apply one time effect that will end at some point
	executeEffect: (owner: Player) => boolean;
	// apply passive effect that will exist when player has this item in his inventory
	applyPassiveEffect: (owner: Player) => void;
	// clean function for the passive effects
	clearEffect: (owner: Player) => void;
	constructor(game: Game, left: number, top: number) {
		super(game);
		this.game = game;
		this.image = document.getElementById("inventory-item-random") as HTMLImageElement;
		this.setPosition(left, top);
		this.setSize(30, 30);
		this.game.objects.push(this);
		this.isCollactable = true;
		this.description = {
			name: "Empty item",
			amount: 1,
			image: this.image.src,
			text: "No description",
			tag: [],
			isLarge: false,
			isUsable: false,
			itemId: "",
		};
		this.id = generateKey("inv");
		this.effect = () => {};
		this.clearEffect = () => {};
		// descrease amount of self and returns bool value that represents availability of this item
		this.use = () => {
			this.description.amount -= 1;
			if (this.description.amount === 0) {
				return false;
			}
			return true;
		};
		this.executeEffect = (owner: Player) => {
			if (this.description.amount > 0) {
				this.effect(owner);
				// decrease self ammount
				return this.use();
			}
			return false;
		};
		this.applyPassiveEffect = (owner: Player) => {
			this.effect(owner);
			return true;
		};
	}

	draw() {
		const { screen } = this.game;
		if (screen) {
			if (this.image) {
				screen.strokeStyle = "brown";
				screen.drawImage(this.image, this.position.left, this.position.top, this.width, this.height);
				screen.strokeRect(this.position.left, this.position.top, this.width, this.height);
			} else console.log("can not find image to draw inventory item called - " + this.description.name);
		}
	}
}
