import React, { useEffect, useState, useRef } from "react";
import Inventory from "../objects/inventory/Inventory";
import InventoryItem from "../objects/inventory/items/InventoryItem";
import { makeNaturalNumber } from "../utils/index";

const InventoryComponent = ({ isActive, inventory }: { isActive: boolean; inventory: Inventory }) => {
	let { items } = inventory;
	const [currentTab, setCurrentTab] = useState("");
	const [tabItems, setTabItems] = useState(items);
	const [activeItem, setActiveItem] = useState(items.length > 0 ? items[0] : null);
	const [searchString, setSearchString] = useState("");
	const inventoryItemsElement = useRef(null);
	const scrollElement = useRef(null);
	isActive = true;
	// falling back to the first inventory item when there is no active element defined
	useEffect(() => {
		if (!activeItem && items.length > 0) {
			setActiveItem(items[0]);
		} else if (activeItem && items.length === 0) {
			setActiveItem(null);
		}
	});

	const searchFilter = (items: InventoryItem[]) => {
		let filteredItems = items.filter((el) => el.description.name.toLowerCase().includes(searchString.toLowerCase()));
		if (searchString !== "") return filteredItems;
		else return items;
	};

	// clean search field when user closes inventory
	useEffect(() => {
		setSearchString("");
	}, [isActive]);
	// pass items through the search filter
	useEffect(() => {
		setTabItems(searchFilter(items));
	}, [items, searchString]);
	// scroll items list all the way to the top each time user type something in search field
	useEffect(() => {
		if (inventoryItemsElement.current) {
			let itemsElement = inventoryItemsElement.current as HTMLElement;
			const itemsList = itemsElement.querySelector(".inventory__items-list") as HTMLElement;
			itemsList.style.transform = `translateY(0px)`;
			setListShiftValue(0);
		}
	}, [searchString]);

	let [listShiftValue, setListShiftValue] = useState(0);
	const itemsListDragMouseDown = (e: any) => {
		e.preventDefault();
		let startY = e.pageY;

		if (inventoryItemsElement.current && scrollElement.current) {
			const itemsListParent = inventoryItemsElement.current as HTMLElement;
			const viewBoxHeight = parseInt(getComputedStyle(itemsListParent).height);

			// Identifying list elements
			const itemsListElement = itemsListParent.querySelector(".inventory__items-list") as HTMLElement;
			const itemsListElementHeight = parseInt(getComputedStyle(itemsListElement).height);
			const maximalVisibleListElementHeight = itemsListElementHeight - viewBoxHeight;
			// Identifying custom scroll
			const scrollEl = scrollElement.current as HTMLElement;
			const scrollHeight = scrollEl.clientHeight;
			const scrollThumb = scrollEl.querySelector(".scroll__thumb") as HTMLElement;
			const scrollThumbHeight = scrollThumb.clientHeight;
			const availableScrollWay = scrollHeight - scrollThumbHeight;

			// Setting up the initial scroll position
			if (itemsListElement.style.transform === "") {
				itemsListElement.style.transform = `translateY(${listShiftValue}px)`;
			}
			let currentShift = 0;
			let mouseEventTarget: HTMLElement | null = null;
			function moveHandler(dragEvent: MouseEvent) {
				e.preventDefault();
				// moving the list
				const diff = dragEvent.pageY - startY;
				if (!mouseEventTarget) {
					mouseEventTarget = dragEvent.target as HTMLElement;
				}
				function calculateShiftForListBody() {
					const speed = 1;
					let shift = diff / speed + listShiftValue;
					if (shift > 0) {
						shift = 0;
					} else if (makeNaturalNumber(shift) >= maximalVisibleListElementHeight) {
						shift = maximalVisibleListElementHeight * -1;
					}
					return shift;
				}
				function calculateShiftForScrollbar() {
					const speed = 0.5;
					let shift = (diff * -1) / speed + listShiftValue;
					if (shift > 0) {
						shift = 0;
					} else if (makeNaturalNumber(shift) >= maximalVisibleListElementHeight) {
						shift = maximalVisibleListElementHeight * -1;
					}
					return shift;
				}
				if (mouseEventTarget.closest(".inventory__items-list")) {
					currentShift = calculateShiftForListBody();
				} else {
					currentShift = calculateShiftForScrollbar();
				}

				itemsListElement.style.transform = `translateY(${currentShift}px)`;
				// itemsListParent.scrollTop = currentShift * -1;
				// moving the scroll
				const thumbShift = makeNaturalNumber((currentShift * availableScrollWay) / maximalVisibleListElementHeight);

				scrollThumb.style.transform = `translateY(${thumbShift}px)`;
			}
			document.onmousemove = moveHandler;
			document.onmouseup = function (e) {
				e.preventDefault();
				setListShiftValue(currentShift);
				document.onmouseup = null;
				document.onmousemove = null;
			};
		}
	};
	let tabBody = null;
	if (!activeItem) {
		tabBody = <p className="inventory__body-is-empty-message">No items here yet...</p>;
	} else {
		// check if item that is currently 'active' still presents in the inventory
		const checkTheActiveItem = () => {
			const index = inventory.items.findIndex((el) => el.id === activeItem.id);
			if (index < 0 && inventory.items.length > 0) setActiveItem(inventory.items[0]);
			else setActiveItem(null);
		};
		// preparing items grid
		// shaping inventory items into html
		const itemsToRender = tabItems.map((el) => {
			return (
				<div
					className={
						`inventory__item available ${el.id === activeItem.id ? "is-active" : ""} 
					`
						// +el.description.isLarge ? "large" : ""
					}
					key={el.id}
					onClick={() => setActiveItem(el)}
				>
					<img src={el.description.image} alt="" className="inventory__item-image" />
					<p className="inventory__item-counter">{el.description.amount}</p>
				</div>
			);
		});
		// creating free grid sloths if there are not enough items to fill all grid. P.s just for visual effect
		const theGridSize = 9;
		if (tabItems.length < theGridSize) {
			let itemsNeededToFillTheGrid = theGridSize - tabItems.length;
			for (let i = 0; i < itemsNeededToFillTheGrid; i++) {
				itemsToRender.push(<div className="inventory__item"></div>);
			}
		}

		// forming side bar with detailed description of an active item
		let asideSection = (
			<div className="inventory__item-card card">
				<div className="card__head">
					<div className="card__head-background"></div>
					<div className="card__head-icon-effect"></div>
					<img src={activeItem.description.image} alt="" className="card__head-icon-image" />
				</div>
				<div className="card__body">
					<p className="card__title">{activeItem.description.name}</p>
					<p className="card__description">{activeItem.description.text}</p>
					<div className="card__actions">
						<div
							className="card__action error"
							onClick={() => {
								inventory.dropItem(activeItem);
								checkTheActiveItem();
							}}
						>
							<p className="card__action-text">Drop</p>
						</div>
						{activeItem.description.isUsable ? (
							<div
								className="card__action success"
								onClick={() => {
									inventory.useItem(activeItem);
									checkTheActiveItem();
								}}
							>
								<p className="card__action-text">Apply</p>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		);
		tabBody = (
			<>
				<div className="inventory__main">
					<div className="inventory__search">
						<div className="inventory__search-icon">
							<svg
								className="inventory__search-icon-image bi bi-search"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 16 16"
							>
								<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
							</svg>
						</div>
						<form action="" className="inventory__search-form">
							<input
								type="text"
								name=""
								id=""
								className="inventory__search-text-input"
								placeholder="Search..."
								onChange={(e) => setSearchString(e.target.value)}
								value={searchString}
							/>
						</form>
					</div>
					<div className="inventory__scroll scroll" ref={scrollElement}>
						{/* <div className="scroll__page is-active"></div>
						<div className="scroll__page"></div>
						<div className="scroll__page"></div> */}
						<div className="scroll__track"></div>
						<div className="scroll__thumb" onMouseDown={(e) => itemsListDragMouseDown(e)}></div>
					</div>
					<div className="inventory__items grabbable" ref={inventoryItemsElement} onMouseDown={(e) => itemsListDragMouseDown(e)}>
						<div className="inventory__items-list">{itemsToRender}</div>

						{/* <div className="inventory__item available">
									<img src="img/inventory/chicken-leg.png" alt="" className="inventory__item-image" />
									<p className="inventory__item-counter">10</p>
								</div>
								<div className="inventory__item available is-active">
									<img src="img/inventory/bullets.png" alt="" className="inventory__item-image" />
									<p className="inventory__item-counter">29</p>
								</div>
								<div className="inventory__item"></div>
								<div className="inventory__item"></div>
								<div className="inventory__item large"></div>
								<div className="inventory__item"></div>
								<div className="inventory__item"></div>
								<div className="inventory__item"></div>
								<div className="inventory__item"></div> */}
					</div>
					<div className="inventory__progress-box progress-box">
						<div className="progress-box__item">
							<div className="progress-box__label-line">
								<p className="progress-box__indicator-name">Speed</p>
								<p className="progress-box__indicator-value">256</p>
							</div>
							<div className="progress-box__bar progress-bar">
								<div className="progress-box__background-bar progress-bar__background"></div>
								<div className="progress-box__main-bar progress-bar__main-line"></div>
							</div>
						</div>
						<div className="progress-box__item">
							<div className="progress-box__label-line">
								<p className="progress-box__indicator-name">Damage</p>
								<p className="progress-box__indicator-value">167</p>
							</div>
							<div className="progress-box__bar progress-bar">
								<div className="progress-box__background-bar progress-bar__background"></div>
								<div className="progress-box__main-bar progress-bar__main-line"></div>
							</div>
						</div>
						<div className="progress-box__item">
							<div className="progress-box__label-line">
								<p className="progress-box__indicator-name">Range</p>
								<p className="progress-box__indicator-value">214</p>
							</div>
							<div className="progress-box__bar progress-bar">
								<div className="progress-box__background-bar progress-bar__background"></div>
								<div className="progress-box__main-bar progress-bar__main-line"></div>
							</div>
						</div>
					</div>
				</div>
				<div className="inventory__asside">{asideSection}</div>
			</>
		);
	}
	return (
		<div className={`popup-screen ${isActive ? "is-active" : ""}`} id="inventory-screen">
			<div className={`popup-screen__inner popup-screen__inventory inventory ${currentTab}`}>
				<div className="inventory__head">
					<div className="inventory__nav">
						<div className={`inventory__nav-item ${currentTab === "" ? "is-active" : ""}`} onClick={() => setCurrentTab("")}>
							<div className="inventory__nav-item-icon">
								<img src="img/inventory/chest.png" alt="" className="inventory__nav-item-image" />
							</div>
							<p className="inventory__nav-item-title">General</p>
						</div>
						{/* <div
							className={`inventory__nav-item ${currentTab === "inventory_tab_ammo" ? "is-active" : ""}`}
							onClick={() => setCurrentTab("inventory_tab_ammo")}
						>
							<div className="inventory__nav-item-icon">
								<img src="img/inventory/magazine.png" alt="" className="inventory__nav-item-image" />
							</div>
							<p className="inventory__nav-item-title">Ammunition</p>
						</div> */}
					</div>
				</div>
				<div className="inventory__body">{tabBody}</div>
			</div>
		</div>
	);
};

export default InventoryComponent;
