import Player from "../../basic/Player";
import Game from "../../Game";
import InventoryItem from "./InventoryItem";

export default class BulletItem extends InventoryItem {
	constructor(game: Game, left: number, top: number) {
		super(game, left, top);
		this.image = document.getElementById("inventory-item-bullets") as HTMLImageElement;
		this.description = {
			name: "Bullet",
			amount: 23,
			image: this.image.src,
			text: "No gun can shot without bullet, right? Applicable to any weapon",
			tag: ["ammo"],
			isLarge: false,
			isUsable: false,
			itemId: "123",
		};
		this.effect = (owner: Player) => {
			// apply to the owner
			owner.gun.fullAmo += this.description.amount;
		};
		this.clearEffect = (owner: Player) => {
			owner.gun.fullAmo -= this.description.amount;
		};
	}
}
