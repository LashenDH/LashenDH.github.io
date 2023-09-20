import { Item } from './item.js';
// import { Game } from './butter.js';

const STORAGETYPE = {
	SMALL: 18,
	MEDIUM: 20,
	LARGE: 30,
	XTRALARGE: 40,
	CRAFTING: 9,
	RESULTANT_SLOT: 1,
	BOOSTER_EQUIP_SLOT: 3,
	RECIPE: 16
};

const RARITY = {
	common: '#f2f2f2',
	uncommon: '#54e36c',
	rare: '#0a94f7',
	epic: '#bc11f5'
}

const ITEMTYPE = {
	apple: { name: 'Apple', description: `<span style='font-size: 12px;'>Grow in your garden <br> <div style='color: ${RARITY.common}'>+5% Butter Per Second <br></span><span style='font-size: 15px;'>COMMON</span></div>`, include: false },
	buttery: { name: 'Buttery Clicks', description: `<span style='font-size: 12px;'>Slippery <br><div style='color: ${RARITY.uncommon}'>x2 Butter Per Click <br></span><span style='font-size: 15px;'>UNCOMMON</span></div>` },
	dropofbutter: { name: 'Drop Of Butter', description: `<span style='font-size: 12px;'>Tiny Boost <br> <div style='color: ${RARITY.uncommon}'>x2 Butter Per Second <br></span><span style='font-size: 15px;'>UNCOMMON</span></div>` },
	shopkeeperfriend: { name: "Shopkeeper's Friend", description: `<span style='font-size: 12px;'>Friends Forever <br> <div style='color: ${RARITY.rare}'>x2 Shop Discount <br></span><span style='font-size: 15px;'>RARE</span></div>` },
	null: { name: 'Null', description: `<span style='font-size: 12px;'>The End? <br> <div style='color: ${RARITY.epic}'> PERKS UNKNOWN <br><span style='font-size: 15px;'>EPIC</span></div>` },
	wallet: { name: 'Wallet', description: `A wallet for the rich`, gold: 0, silver: 0, copper: 0, include: false },
	backpack: { name: 'Backpack', description: `Bigger storage. Can be upgraded`, include: false }, //include: false is flag for making sure recipes dont take backpack or wallet
};

//INITIALIZE INVENTORY
var inventory = new Item(ITEMTYPE.backpack, STORAGETYPE.SMALL, ITEMTYPE);
inventory.setItem(0, 'apple');
inventory.setItem(1, 'apple');
inventory.setItem(2, 'apple');
inventory.setItem(3, 'apple');
inventory.setItem(4, 'apple');
inventory.setItem(5, 'dropofbutter');
inventory.setItem(7, 'buttery');
inventory.setItem(9, 'dropofbutter');
inventory.setItem(10, 'apple');
inventory.setItem(11, 'apple');
inventory.setItem(12, 'buttery');
inventory.setItem(13, 'dropofbutter');
inventory.setItem(15, 'buttery');
inventory.setItem(16, 'apple');
inventory.setItem(17, 'apple');
inventory.setItem(18, 'apple');
inventory.appendToParent(document.getElementById('inventory_slots'));
inventory.setClass('inventory');

var crafting = new Item(ITEMTYPE.backpack, STORAGETYPE.CRAFTING, ITEMTYPE);
crafting.appendToParent(document.getElementById('crafting_slots'));
crafting.setClass('crafting');
crafting.setParentInventory(inventory);

var result = new Item(ITEMTYPE.backpack, STORAGETYPE.RESULTANT_SLOT, ITEMTYPE);
result.appendToParent(document.getElementById('result'));
result.setClass('result');
crafting.setResult(result);

var equip = new Item(ITEMTYPE.backpack, STORAGETYPE.BOOSTER_EQUIP_SLOT, ITEMTYPE);
equip.appendToParent(document.getElementById('equip_slots'));
equip.setClass('equip');

var recipe = new Item(ITEMTYPE.backpack, STORAGETYPE.RECIPE, ITEMTYPE, false);
recipe.appendToParent(document.getElementById('recipe_information'));
recipe.showRecipe(crafting, result);
recipe.setClass('recipe');

var i = 0;
for (const [key, value] of Object.entries(ITEMTYPE)) {
	if (value.include != false) {
		recipe.setItem(i, key);
	}
	else{
		continue;
	}
	i += 1;
}

var currentTab = 'inventory';
hideShop();
showInventory();
hideEquip();

document.getElementById('backpackicon').addEventListener('click', function () {
	tab('inventory');
});

document.getElementById('houseicon').addEventListener('click', function () {
	tab('shop');
});

function hideInventory() {
	inventory.hide();
	crafting.hide();
	result.hide();
	document.getElementById('crafting_arrow').style.display = 'none';
}

function showInventory() {
	inventory.show();
	crafting.show();
	result.show();
	document.getElementById('crafting_arrow').style.display = 'block';
}

function showShop() {
	document.getElementById('shop_container').style.display = 'block';
}

function hideShop() {
	document.getElementById('shop_container').style.display = 'none';
}

function showEquip() {
	document.getElementById('equip_container').style.display = 'block';
}

function hideEquip() {
	document.getElementById('equip_container').style.display = 'none';
}

function tab(tabToPress) {
	if (tabToPress == 'inventory') {
		hideShop();
		showInventory();
		hideEquip();
	}
	if (tabToPress == 'shop') {
		showShop();
		hideInventory();
		hideEquip();
	}
	if (tabToPress == 'equip') {
		hideShop();
		hideInventory();
		showEquip();
	}
}

// var equip = new Item(ITEMTYPE.backpack, STORAGETYPE.BOOSTER_EQUIP_SLOT, ITEMTYPE);
// equip.appendToParent(document.getElementById('equip_container'));
// equip.setClass('equip');
