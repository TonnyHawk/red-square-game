import KeyDetector from "./keyDetector";
import Player from "./basic/Player";
import PopupScreen from "./PopupScreen";
import GameObject from "./basic/GameObject";
import Indicator from "./indicators/Indicator";
import { AnimationFrame } from "../types/index";
import BulletItem from "./inventory/items/BulletItem";
import InventoryItem from "./inventory/items/InventoryItem";
import React from "react";
import ReactDOM from "react-dom/client";
import InventoryComponent from "../components/Inventory";
import ChickenLeggItem from "./inventory/items/ChickenLeggItem";

export default class Game {
	animation: AnimationFrame;
	isAnimationRunning: boolean;
	canvasElement: HTMLCanvasElement | null;
	screen: CanvasRenderingContext2D | null;
	objects: GameObject[];
	indicators: Indicator[];
	popupScreen: any;
	player: Player;
	hintText: string;
	items: InventoryItem[];
	inventoryMenu;
	constructor() {
		this.hintText = "Hello";
		this.animation = null;
		this.isAnimationRunning = false;

		this.canvasElement = document.getElementById("screen") as HTMLCanvasElement;

		this.canvasElement.width = window.innerWidth - 10;
		this.canvasElement.height = window.innerHeight - 10;
		this.screen = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;

		this.draw = this.draw.bind(this);
		this.resume = this.resume.bind(this);
		this.popupScreen = new PopupScreen(this);

		this.objects = [];
		this.indicators = [];
		this.items = [];

		this.player = new Player(this);

		this.inventoryMenu = {
			element: ReactDOM.createRoot(document.getElementById("inventory-menu") as HTMLElement),
			render: (isActive: boolean) => {
				this.inventoryMenu.element.render(<InventoryComponent isActive={isActive} inventory={this.player.inventory} />);
			},
		};
	}

	start() {
		this.objects.push(this.player);
		// this.objects.push(new Enemy(this, null, this.player));
		new KeyDetector(this, this.player);
		this.items.push(new BulletItem(this, 200, 300));
		this.items.push(new ChickenLeggItem(this, 300, 300));
		this.items.push(new ChickenLeggItem(this, 250, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.player.collect(new ChickenLeggItem(this, 300, 300));
		this.player.collect(new BulletItem(this, 300, 300));
		this.draw();
	}

	draw() {
		this.deleteMarkedObjects();
		if (this.screen !== null && this.canvasElement !== null) {
			this.screen.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
			// drawing inventory on the game board
			this.items.forEach((item: InventoryItem) => item.draw());
			// drawing game objects
			this.objects.forEach((gameObject: GameObject) => gameObject.move());
			// drawing indicators
			this.indicators.forEach((indicator: Indicator) => indicator.draw());

			if (this.hintText != null) {
				this.screen.textAlign = "center";
				this.screen.font = "30px Arial";
				this.screen.fillText(this.hintText, this.player.position.left + this.player.width / 2, this.player.position.top - 100);
			}
			// storing animation frame information
			this.animation = requestAnimationFrame(this.draw);
			this.isAnimationRunning = true;
		}
	}

	deleteMarkedObjects() {
		const cleanedList: GameObject[] = [];
		this.objects.forEach((el) => {
			if (!el.markedForDeletion) cleanedList.push(el);
		});
		this.objects = cleanedList;

		const cleanedIndicators: Indicator[] = [];
		this.indicators.forEach((el: Indicator) => {
			if (!el.markedForDeletion) cleanedIndicators.push(el);
		});
		this.indicators = cleanedIndicators;

		const cleanedItems: InventoryItem[] = [];
		this.items.forEach((el) => {
			if (!el.markedForDeletion) cleanedItems.push(el);
		});
		this.items = cleanedItems;
	}

	resume() {
		this.draw();
		this.popupScreen.hide();
	}

	pause() {
		if (this.animation !== null) {
			cancelAnimationFrame(this.animation);
			this.isAnimationRunning = false;

			this.popupScreen.show();
		} else {
			console.log("Game can not be stopped");
			console.log("animation was not stored");
		}
	}
}
