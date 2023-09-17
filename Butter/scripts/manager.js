import { Item } from './item.js';
// import { Game } from './butter.js';

const STORAGETYPE = {
	SMALL: 18,
	MEDIUM: 20,
	LARGE: 30,
	XTRALARGE: 40,
	CRAFTING: 9,
	RESULTANT_SLOT: 1
};

const ITEMTYPE = {
	apple: { name: 'Apple', description: `Grow in your garden` },
	buttery: { name: 'ButteryClicks', description: `2x butter per click` },
	dropofbutter: { name: 'DropOfButter', description: `2x butter per second` },
	shopkeeperfriend: { name: 'ShopkeeperFriend', description: `2x cheaper shop items` },
	wallet: { name: 'Wallet', description: `A wallet for the rich`, gold: 0, silver: 0, copper: 0 },
	backpack: { name: 'Backpack', description: `Bigger storage. Can be upgraded` },
	null: { name: 'Null', description: `The End?` }
};

// var test = new Item(ITEMTYPE.BACKPACK, STORAGETYPE.SMALL, CONTAINERTYPE.CRAFTING);
// test.setItem(1, 'apple');

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

var result = new Item(ITEMTYPE.backpack, STORAGETYPE.RESULTANT_SLOT, ITEMTYPE);
result.appendToParent(document.getElementById('result'));
result.setClass('result');
crafting.setResult(result);

var currentTab = 'inventory';
showShop();

document.getElementById('backpackicon').addEventListener('click', function(){
	tab('inventory');
});

document.getElementById('houseicon').addEventListener('click', function(){
	tab('shop');
});

function hideInventory(){
	inventory.hide();
	crafting.hide();
	result.hide();
	document.getElementById('crafting_arrow').style.display = 'none';
}

function showInventory(){
	inventory.show();
	crafting.show();
	result.show();
	document.getElementById('crafting_arrow').style.display = 'block';
}

function showShop(){
	document.getElementById('shop_container').style.display = 'block';
}

function hideShop(){
	document.getElementById('shop_container').style.display = 'none';
}

if(currentTab == 'inventory'){
	hideInventory();
}

function tab(tabToPress){
	if(tabToPress == 'inventory'){
		hideShop();
		showInventory();
	}
	if(tabToPress == 'shop'){
		showShop();
		hideInventory();
	}
}