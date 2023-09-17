var recipes = [
	{ recipe: ['apple', 'apple'], result: 'buttery' },
	{ recipe: ['buttery', 'buttery'], result: 'dropofbutter' },
	{ recipe: ['dropofbutter', 'dropofbutter'], result: 'shopkeeperfriend' },
	{ recipe: ['apple', 'apple', 'apple', 'apple', 'apple'], result: 'shopkeeperfriend' },
	{ recipe: ['shopkeeperfriend', 'shopkeeperfriend', 'shopkeeperfriend'], result: 'null' }
];

recipes.forEach(recipe => {
	while (recipe.recipe.length < 9) {
		recipe.recipe.push('x');
	}
});

console.log(recipes);

class Item {
	constructor(itemData, inventorySize, ITEMTYPE) {
		this.name = itemData.name;
		this.description = itemData.description;
		this.itemType = ITEMTYPE;

		switch (this.name) {
			case 'Wallet':
				const gold = itemData.gold || 0;
				const silver = itemData.silver || 0;
				const copper = itemData.copper || 0;
				return new Wallet(gold, silver, copper);
			case 'Backpack':
				return new Inventory(inventorySize, this.itemType);
			default:
				return null;
		}
	}
}

class ItemSingle {
	constructor(slot, itemType) {
		this.item = document.createElement('img');
		this.type = itemType;
		this.sourceSlot = slot;

		this.item.src = `textures/ButterPack/item/single/${itemType}.png`;
		this.item.setAttribute('id', 'single');
		this.item.setAttribute('draggable', 'false');

		this.instance = slot;

		document.body.appendChild(this.item);

		this.SetToMousePointer();
		this.item.addEventListener('mousemove', () => this.SetToMousePointer());
	}
	SetToMousePointer() {
		this.item.style.left = mouse_x + 'px';
		this.item.style.top = mouse_y + 'px';
	}
}

class Wallet {
	constructor(gold = 0, silver = 0, copper = 0) {
		this.gold = gold;
		this.silver = silver;
		this.copper = copper;
	}
	AddGold(amount) {
		this.gold += amount;
		return this.gold;
	}
	AddSilver(amount) {
		this.silver += amount;
		return this.silver;
	}
	AddCopper(amount) {
		this.copper += amount;
		return this.copper;
	}
}

class Inventory {
	constructor(size, itemType) {
		this.inventory = [];
		this.elementInventory = [];

		const inventory = document.createElement('div');
		this.inventoryElement = inventory;
		this.size = size;

		for (let i = 0; i < size; i++) {
			const slot = new Slot(this);
			slot.slot.setAttribute('item', 'x');
			slot.slot.setAttribute('slot', i);
			inventory.appendChild(slot.slot);

			if (size === 9) {
				slot.slot.setAttribute('craft', true);
				slot.slot.classList.add('crafting-slot');
			}

			this.inventory.push(slot);
			this.elementInventory.push(slot.slot);


			// slot.slot.addEventListener('mouseenter', () => {
			// 	if (slot.slot.getAttribute('item') != 'x') {
			// 		document.getElementById('information_image').src = `textures/ButterPack/item/slot/${slot.slot.getAttribute('item')}.png`
			// 		document.getElementById('information_name').textContent = slot.slot.getAttribute('item');
			// 		document.getElementById('information_description').textContent = 'DESCRIPTION: ' + itemType[slot.slot.getAttribute('item')].description;
			// 	}
			// });
		}
	}

	hide() {
		this.inventoryElement.style.display = 'none';
	}

	show() {
		this.inventoryElement.style.display = 'block';
	}

	appendToParent(parent) {
		parent.appendChild(this.inventoryElement);
	}

	setItem(index, item) {
		try {
			this.inventory[index].SetItem(item);
		} catch (error) {
			console.log('Failure to append item to inventory. Index could not be found.');
		}
	}

	setClass(name) {
		this.inventoryElement.setAttribute('class', name);
	}

	getCurrentItems() {
		var itemsList = [];
		this.elementInventory.forEach((slot) => {
			itemsList.push(slot.getAttribute('item'));
		});
		return itemsList;
	}

	setResult(result) {
		this.result = result;
	}

	matchingRecipe(inventoryItems) {
		const matchingRecipes = [];

		for (const recipe of recipes) {
			const singleRecipe = recipe.recipe;
			let isMatching = true;

			for (const recipeItem of singleRecipe) {
				const recipeItemCount = singleRecipe.filter(item => item === recipeItem).length;
				const inventoryItemCount = inventoryItems.filter(item => item === recipeItem).length;

				if (inventoryItemCount !== recipeItemCount) {
					isMatching = false;
					break;
				}
			}

			if (isMatching) {
				matchingRecipes.push(recipe.result);
			}
		}

		return matchingRecipes.length > 0 ? matchingRecipes : false;
	}

	craft() {
		var currentItems = this.getCurrentItems();
		if (this.matchingRecipe(currentItems) != false) {
			this.result.setItem(0, this.matchingRecipe(currentItems));
		}
		else {
			this.result.setItem(0, 'x');
		}
	}

	delete() {
		this.inventory.forEach((slot) => {
			const slotElement = slot.slot;
			if (slotElement && slotElement.parentElement) {
				slotElement.parentElement.removeChild(slotElement);
			}
		});
	}
}

class Slot {
	constructor(inventory) {
		this.slot = document.createElement('img');
		this.slot.src = `textures/ButterPack/gui/inventory/slot.png`;
		this.slot.setAttribute('id', 'slot');
		this.slot.setAttribute('draggable', 'false');

		this.item = 'x';

		this.slot.addEventListener('mousedown', (e) => this.HandleClick(e));
		document.addEventListener('mouseup', (e) => this.RemoveClick(e));

		this.slot.instance = this;
		this.inventory = inventory;

		return this;
	}
	SetItem(item) {
		if (item !== 'x') {
			this.slot.src = `textures/ButterPack/item/slot/${item}.png`;
			this.slot.setAttribute('item', item);
			this.item = item;
		} else {
			this.slot.src = `textures/ButterPack/gui/inventory/slot.png`;
			this.slot.setAttribute('item', 'x');
			this.item = 'x';
		}

		if (this.inventory.size === 9) {
			this.inventory.craft();
		}

		if (item === 'x' && this.item !== 'x') {
			current_item_single.sourceSlot = this;
		}
	}
	HandleClick(e) {
		if (this.item === 'x') {
			return;
		}
		current_item_single = this.ItemSingle();
		this.SetItem('x');
	}

	RemoveClick(e) {
		if (current_item_single) {
			if (e.target.slot && e.target.instance.inventory.size != 1) {
				const resultSlot = current_item_single.instance.inventory.size == 1;

				if (resultSlot) {
					document.querySelectorAll('.crafting-slot').forEach(craftingSlot => {
						craftingSlot.instance.SetItem('x');
					});
				}

				if (e.target.instance.item === 'x') {
					e.target.instance.SetItem(current_item_single.type);
				} else {
					current_item_single.instance.SetItem(current_item_single.type);
				}
			}
			else {
				current_item_single.instance.SetItem(current_item_single.type);
			}
			current_item_single.item.remove();
			current_item_single = null;
		}
	}

	ItemSingle() {
		return new ItemSingle(this, this.item);
	}
}

let mouse_x = 0;
let mouse_y = 0;
let current_item_single = null;

document.addEventListener('mousemove', (event) => {
	mouse_x = event.clientX;
	mouse_y = event.clientY;

	if (current_item_single !== null) {
		current_item_single.SetToMousePointer();
	}
});

export { Item, ItemSingle, Wallet, Inventory, Slot };