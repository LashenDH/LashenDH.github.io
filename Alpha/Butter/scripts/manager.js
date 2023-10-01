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
	apple: { name: 'Apple', description: `<span style='font-size: 10px;'>Grow in your garden <br> <div style='color: ${RARITY.common}'>+5% Butter Per Second <br></span><span style='font-size: 12px;'>COMMON</span></div>`, include: false, worth: 5000 },
	buttery: { name: 'Buttery Click', description: `<span style='font-size: 10px;'>Slippery <br><div style='color: ${RARITY.uncommon}'>x2 Butter Per Click <br></span><span style='font-size: 12px;'>UNCOMMON</span></div>`, worth: 10000 },
	dropofbutter: { name: 'Drop Of Butter', description: `<span style='font-size: 10px;'>Tiny Boost <br> <div style='color: ${RARITY.uncommon}'>x2 Butter Per Second <br></span><span style='font-size: 12px;'>UNCOMMON</span></div>`, worth: 10000 },
	shopkeeperfriend: { name: "Shopkeeper's Friend", description: `<span style='font-size: 10px;'>Friends Forever <br> <div style='color: ${RARITY.rare}'>x2 Shop Discount <br></span><span style='font-size: 12px;'>RARE</span></div>`, worth: 20000 },
	null: { name: 'Null', description: `<span style='font-size: 10px;'>The End? <br> <div style='color: ${RARITY.epic}'> PERKS UNKNOWN <br><span style='font-size: 12px;'>EPIC</span></div>`, worth: 100000 },
	wallet: { name: 'Wallet', description: `A wallet for the rich`, gold: 0, silver: 0, copper: 0, include: false },
	backpack: { name: 'Backpack', description: `Bigger storage. Can be upgraded`, include: false }, //include: false is flag for making sure recipes dont take backpack or wallet
};

var items = ['apple', 'buttery', 'dropofbutter', 'shopkeeperfriend', 'null', 'x', 'x'];

//INITIALIZE INVENTORY

var crafting = new Item(ITEMTYPE.backpack, STORAGETYPE.CRAFTING, ITEMTYPE);
crafting.appendToParent(document.getElementsByClassName('inventory-container')[0]);
crafting.setClass('main-crafting');

var arrow = document.createElement('img');
arrow.setAttribute('src', './textures/ButterPack/gui/crafting/result_marker.png');
document.getElementsByClassName('inventory-container')[0].appendChild(arrow);
arrow.setAttribute('class', 'main-arrow');

var result = new Item(ITEMTYPE.backpack, STORAGETYPE.RESULTANT_SLOT, ITEMTYPE);
result.appendToParent(document.getElementsByClassName('inventory-container')[0]);

var inventory = new Item(ITEMTYPE.backpack, STORAGETYPE.SMALL, ITEMTYPE);
inventory.appendToParent(document.getElementsByClassName('inventory-container')[0]);
inventory.setClass('main-inventory');

crafting.setParentInventory(inventory);

result.setClass('main-result');
crafting.setResult(result);

var i = 0;
var notX = false;

if (localStorage.getItem('inventory') != null) {
	inventory.getFromLocalStorage('inventory').forEach(slot => {
		if (slot != 'x') {
			notX = true;
		}
		inventory.setItem(i, slot);
		i += 1;
	});
}

// // var equip = new Item(ITEMTYPE.backpack, STORAGETYPE.BOOSTER_EQUIP_SLOT, ITEMTYPE);
// // equip.appendToParent(document.getElementById('equip_slots'));
// // equip.setClass('equip');

var recipe = new Item(ITEMTYPE.backpack, STORAGETYPE.RECIPE, ITEMTYPE, false);
recipe.appendToParent(document.getElementsByClassName('journal-slots')[0]);
recipe.showRecipe(crafting, result);
recipe.setClass('recipe');

// i = 0;
// if (localStorage.getItem('modifiers') != null) {
// 	inventory.getFromLocalStorage('modifiers').forEach(slot => {
// 		equip.setItem(i, slot);
// 		i += 1;
// 	});
// }

i = 0;
for (const [key, value] of Object.entries(ITEMTYPE)) {
	if (value.include != false) {
		recipe.setItem(i, key);
	}
	else {
		continue;
	}
	i += 1;
}

openTab('main-shop');

function openTab(tabClass){
	Array.from(document.getElementsByClassName('sidebar-item')).forEach(item => {
		item.style.display = 'none';
	});
	document.getElementsByClassName(tabClass)[0].style.display = 'initial';
}

document.getElementById('house-tab').addEventListener('mousedown', ()=>{
	openTab('main-shop');
	document.getElementsByClassName('sidebar-header-text')[0].textContent = 'Shop';
});

document.getElementById('backpack-tab').addEventListener('mousedown', ()=>{
	openTab('inventory-container');
	document.getElementsByClassName('sidebar-header-text')[0].textContent = 'Inventory';
});

export {inventory, ITEMTYPE}
