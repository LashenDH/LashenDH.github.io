var tooltip = document.getElementById('tooltip');

var recipes = [
	{ recipe: ['apple', 'apple'], result: 'buttery' },
	{ recipe: ['buttery', 'buttery'], result: 'dropofbutter' },
	{ recipe: ['dropofbutter', 'dropofbutter'], result: 'shopkeeperfriend' },
	{ recipe: ['shopkeeperfriend', 'shopkeeperfriend', 'shopkeeperfriend'], result: 'null' }
];

recipes.forEach(recipe => {
	while (recipe.recipe.length < 9) {
		recipe.recipe.push('x');
	}
});

class Item {
	constructor(itemData, inventorySize, ITEMTYPE, drag) {
		this.name = itemData.name;
		this.description = itemData.description;
		this.itemType = ITEMTYPE;
		this.drag = drag;

		switch (this.name) {
			case 'Wallet':
				const gold = itemData.gold || 0;
				const silver = itemData.silver || 0;
				const copper = itemData.copper || 0;
				return new Wallet(gold, silver, copper);
			case 'Backpack':
				return new Inventory(inventorySize, this.itemType, this.drag);
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
		currentlyDraggedItem = this;

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
	constructor(size, itemType, drag) {
		this.drag = drag;
		this.inventory = [];
		this.elementInventory = [];
		this.itemType = itemType;

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

		if (size == 3) {
			this.initializeModifiers();
		}
	}

	addToLocalStorage(storageName){
		var temp = [];
		this.inventory.forEach(slot => {
			temp.push(slot.item);
		});
		localStorage.setItem(storageName, JSON.stringify(temp));
	}

	getFromLocalStorage(storageName){
		return JSON.parse(localStorage.getItem(storageName));
	}

	initializeModifiers() {
		this.modifiers = true;
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

	setItem(index, item){
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

	showRecipe(show, result) {
		this.recipeResult = show;
		this.recipeOutput = result;
	}

	setParentInventory(inventory) {
		this.parentInventory = inventory;
	}

}

var pos = function (o, x, y, event) {
	var posX = 0, posY = 0;
	var e = event || window.event;
	if (e.pageX || e.pageY) {
		posX = e.pageX;
		posY = e.pageY;
	} else if (e.clientX || e.clientY) {
		posX = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		posY = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}
	o.style.position = "absolute";
	o.style.top = (posY + y) + "px";
	o.style.left = (posX + x) + "px";
}

tooltip.style.display = 'none';

let currentlyHoldingDown = false;
let currentlyDraggedItem = null;
document.addEventListener('visibilitychange', (event) => {
	if (currentlyDraggedItem) {
	  const inventorySlot = currentlyDraggedItem.sourceSlot;
	  if (inventorySlot) {
		inventorySlot.SetItem(currentlyDraggedItem.type);
		currentlyDraggedItem.item.remove();
		currentlyDraggedItem = null;
	  }
	}
});

document.addEventListener('keydown', (event) => {
	if (currentlyDraggedItem && event.key == 'Meta') {
	  const inventorySlot = currentlyDraggedItem.sourceSlot;
	  if (inventorySlot) {
		inventorySlot.SetItem(currentlyDraggedItem.type);
		currentlyDraggedItem.item.remove();
		currentlyDraggedItem = null;
	  }
	}
});

document.addEventListener('blur', (event) => {
	currentlyHoldingDown = false;
	if (currentlyDraggedItem) {
	  const inventorySlot = currentlyDraggedItem.sourceSlot;
	  if (inventorySlot) {
		inventorySlot.SetItem(currentlyDraggedItem.type);
		currentlyDraggedItem.item.remove();
		currentlyDraggedItem = null;
	  }
	}
});

document.addEventListener('pointerdown', (e)=>{
	currentlyHoldingDown = true;
});

document.addEventListener('pointerup', (e)=>{
	currentlyHoldingDown = false;
});

class Slot {
	constructor(inventory) {
		this.slot = document.createElement('img');
		this.slot.src = `./textures/ButterPack/gui/inventory/slot.png`;
		this.slot.setAttribute('id', 'slot');
		this.slot.setAttribute('draggable', 'false');
		this.inventory = inventory;

		this.item = 'x';

		this.slot.addEventListener('mousemove', (e) => {
			if (this.item != 'x') {
				tooltip.style.display = 'block';
				tooltip.innerHTML = `${this.inventory.itemType[this.item].name} <br> ${this.inventory.itemType[this.item].description}`;
				pos(tooltip, 5, 0, e);
			}
		});

		this.slot.addEventListener('mouseout', (e) => {
			tooltip.style.display = 'none';
		});

		if (inventory.drag != false) {
			this.slot.addEventListener('mousedown', (e) => this.HandleClick(e));
			document.addEventListener('mouseup', (e) => this.RemoveClick(e));
		}
		else {
			this.slot.addEventListener('mousedown', (e) => {
				var recipe = this.ShowRecipe();

				if (recipe != null) {
					this.clearCraftingGrid(inventory.recipeResult);

					for (var i = 0; i < recipe.length; i++) {
						inventory.recipeResult.setItem(i, recipe[i]);
						inventory.recipeResult.elementInventory[i].style.opacity = '0.5';
						inventory.recipeResult.drag = false;
						inventory.recipeOutput.drag = false;
					}
					inventory.recipeOutput.elementInventory[0].style.opacity = '0.5';
				}
				else {
					this.clearCraftingGrid(inventory.recipeResult);

					for (var i = 0; i < 9; i++) {
						inventory.recipeResult.setItem(i, 'x');
						inventory.recipeResult.elementInventory[i].style.opacity = '1';
						inventory.recipeOutput.elementInventory[0].style.opacity = '1';
					}
				}
			});
		}
		
		this.slot.instance = this;

		return this;
	}

	findEmptySlot(inventory) {
		for (let i = 0; i < inventory.size; i++) {
			const slot = inventory.parentInventory.inventory[i];
			if (slot.item === 'x') {
				return i;
			}
		}
	}

	clearCraftingGrid(inventory) {
		for (let i = 0; i < 9; i++) {
			const craftingSlot = inventory.inventory[i];
			if (craftingSlot.item !== 'x') {
				if(craftingSlot.slot.style.opacity == 1){
					inventory.parentInventory.setItem(this.findEmptySlot(inventory), craftingSlot.item);
					craftingSlot.SetItem('x');
				}
			}
		}
	}

	ShowRecipe() {
		try {
			const matchingRecipe = recipes.find(recipe => recipe.result == this.item);
			return matchingRecipe.recipe;
		} catch (error) {
			return null;
		}
	}
	SetItem(item) {
		if (item !== 'x') {
			this.slot.src = `./textures/ButterPack/item/slot/${item}.png`;
			this.slot.setAttribute('item', item);
			this.item = item;
		} else {
			this.slot.src = `./textures/ButterPack/gui/inventory/slot.png`;
			this.slot.setAttribute('item', 'x');
			this.item = 'x';
		}

		if (this.inventory.size === 9) {
			this.inventory.craft();
		}

		if (item === 'x' && this.item !== 'x') {
			current_item_single.sourceSlot = this;
		}
		
		if(this.inventory.size == 18){
			this.inventory.addToLocalStorage('inventory');
		}

		if(this.inventory.size == 3){
			this.inventory.addToLocalStorage('modifiers');
		}
	}
	HandleClick(e) {
		if (this.inventory.modifiers == true && this.item != 'x') {
			this.modifierRemovalModal();
		}
		else {
			if (this.inventory.drag != false) {
				if (this.item === 'x') {
					return;
				}
				current_item_single = this.ItemSingle();
				this.SetItem('x');
			}
		}
	}

	modifierRemovalModal() {
		this.container = document.createElement('div');
		this.container.setAttribute('id', 'modifierRemovalContainer');

		this.bg = document.createElement('img');
		this.bg.setAttribute('id', 'modifierRemovalBg');
		this.bg.setAttribute('src', './textures/ButterPack/gui/inventory/shop.png');

		this.imageInformation = document.createElement('img');
		this.imageInformation.setAttribute('src', `./textures/ButterPack/item/slot/${this.item}.png`);
		this.imageInformation.setAttribute('id', 'modalImage');

		this.imageInformation.addEventListener('mousemove', (e) => {
			tooltip.style.display = 'block';
			tooltip.innerHTML = `${this.inventory.itemType[this.item].name} <br> ${this.inventory.itemType[this.item].description}`;
			pos(tooltip, 5, 0, e);
		});

		this.imageInformation.addEventListener('mouseleave', (e) => {
			tooltip.style.display = 'none';
		})

		this.textInformation = document.createElement('h2');
		this.textInformation.innerHTML = `<span style='color: white; font-size: 20px;'>WARNING</span><br> You are about to delete your modifier <br> <span style='color: #d90e00; cursor: pointer;' id='deleteModalButton'>DELETE</span> OR <span style='color: #0fd457; cursor: pointer;' id='goBackModalButton'>GO BACK</span>`
		this.textInformation.setAttribute('id', 'modalText');

		this.container.classList.add('modalShow');
		this.container.style.display = 'block';
		this.container.classList.remove('modalHide');

		this.container.appendChild(this.textInformation);
		this.container.appendChild(this.imageInformation);
		this.container.appendChild(this.bg);
		document.body.appendChild(this.container);

		document.getElementById('deleteModalButton').addEventListener('mousedown', (e)=>{
			this.SetItem('x');
			this.container.classList.remove('modalShow');
			this.container.classList.add('modalHide');

			setTimeout(()=>{
				this.container.remove()}, 500);
		});
		
		document.getElementById('goBackModalButton').addEventListener('mousedown', (e)=>{
			this.container.classList.remove('modalShow');
			this.container.classList.add('modalHide');

			setTimeout(()=>{
				this.container.remove()}, 500);
		});
	}

	RemoveClick(e) {
		if (current_item_single) {
			currentlyDraggedItem = null;
			if (e.target.slot && e.target.instance.inventory.size != 1 && e.target.instance.inventory.size != 16) {
				if (e.target.instance.inventory.drag == false) {
					for (var i = 0; i < 9; i++) {
						e.target.instance.inventory.setItem(i, 'x');
						e.target.instance.inventory.elementInventory[i].style.opacity = '1';
					}
					e.target.instance.inventory.result.elementInventory[0].style.opacity = '1';
					e.target.instance.inventory.drag = true;
					e.target.instance.inventory.result.drag = true;
				}

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
	if (currentlyDraggedItem && event.buttons == 0) {
		const inventorySlot = currentlyDraggedItem.sourceSlot;
		if (inventorySlot) {
			console.log(event.buttons);
		  inventorySlot.SetItem(currentlyDraggedItem.type);
		  currentlyDraggedItem.item.remove();
		  currentlyDraggedItem = null;
		}
	  }

	mouse_x = event.clientX;
	mouse_y = event.clientY;

	if (current_item_single !== null) {
		current_item_single.SetToMousePointer();
	}
});

export { Item, ItemSingle, Wallet, Inventory, Slot };