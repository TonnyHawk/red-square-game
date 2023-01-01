import Player from "../../basic/Player";
import Game from "../../Game";
import InventoryItem from "./InventoryItem";

export default class ChickenLeggItem extends InventoryItem {
	constructor(game: Game, left: number, top: number) {
		super(game, left, top);
		this.image = document.getElementById("inventory-item-chicken-legg") as HTMLImageElement;
		this.description = {
			name: "Chicken legg",
			amount: 1,
			image: this.image.src,
			text: "MMMhmhm juccy legg to feel great!",
			tag: ["food"],
			isLarge: true,
			isUsable: true,
		};
		this.effect = (owner: Player) => {
			const effectAmount = 20;
			// apply to the owner
			const availableToRestore = owner.hp.full - owner.hp.available;
			if (availableToRestore < effectAmount) {
				owner.hp.available += availableToRestore;
			} else {
				owner.hp.available += effectAmount;
			}
		};
	}
}
