import { inventory, ITEMTYPE } from "./manager.js";
import {giveAchievement} from './achievements.js';
import { displayTickers } from "./newsticker.js";

var upgrades = document.getElementsByClassName('upgrade');
var discount = 1;
var shop_names = [];
var shop_items = [];
var tooltip = document.getElementById('tooltip');

class Game {
  constructor() {
    var butter = document.getElementsByClassName('butter-image')[0];

    if (localStorage.getItem('game_butter') == null) {
      localStorage.setItem('game_butter', 0);
    }

    if (localStorage.getItem('max_butter') == null) {
      localStorage.setItem('max_butter', 0);
    }

    this.butter = parseInt(localStorage.getItem('game_butter'));
    displayTickers(localStorage.getItem('max_butter'));

    setInterval(()=>{ displayTickers(parseInt(localStorage.getItem('max_butter'))); }, 15000);

    this.increment = 1;
    
    document.getElementsByClassName('butter-per-click')[0].textContent = `Butter Per Click: ${this.increment}`;

    this.autoIncrementInterval = null;
    this.bps = 0;
    this.incrementMultiplier = 1;
    this.canBuy = false;

    butter.addEventListener('click', () => {
      this.incrementButter(this.increment * this.incrementMultiplier);
      this.checkAvailableUpgrades();
    });

    this.startAutoIncrement();
  }

  incrementButter(incrementValue) {
    this.setButter(this.butter + incrementValue);
    if(this.butter > localStorage.getItem('max_butter')){
      localStorage.setItem('max_butter', this.butter);
    }
    else{
      localStorage.setItem('max_butter', parseInt(localStorage.getItem('max_butter')) + incrementValue);
    }
    this.checkAvailableUpgrades();
  }

  decrementButter(decrementValue) {
    this.setButter(this.butter - decrementValue);
    this.checkAvailableUpgrades();
  }

  setButter(value) {
    var number = document.getElementsByClassName('butter-value')[0];
    this.butter = value;
    number.textContent = formatNumber(Math.floor(this.butter));
    localStorage.setItem('game_butter', this.butter);
  }

  checkAvailableUpgrades() {
    shop_items.forEach((item) => {
      item.lock();
      if (item.cost <= this.butter) {
        item.unlock();
      }
    });
  }

  startAutoIncrement() {
    if (this.autoIncrementInterval) {
      clearInterval(this.autoIncrementInterval);
    }
    this.autoIncrementInterval = setInterval(() => {
      giveAchievement(localStorage.getItem('max_butter'));
      this.incrementButter(this.bps / 10);
    }, 100);
  }
}

class Shop {
  constructor(game, name, baseCost, tiers, item, delay) {
    this.game = game;
    this.name = name;
    this.item = item;
    this.delay = delay;
    this.bps = 0;
    
    if (localStorage.getItem(`${this.name}_owned`) == null) {
      localStorage.setItem(`${this.name}_owned`, 0);
    }
    if (localStorage.getItem(`${this.name}_cost`) == null) {
      localStorage.setItem(`${this.name}_cost`, Math.ceil(baseCost / discount));
    }

    this.cost = parseInt(localStorage.getItem(`${this.name}_cost`));
    this.owned = parseInt(localStorage.getItem(`${this.name}_owned`));
    this.baseCost = baseCost;

    setInterval(() => { this.addItemToInventory() }, delay);

    for (let i = 0; i < this.owned; i++) {
      this.increaseBPSForShop(this.name);
    }

    if (tiers) {
      this.tiers = tiers;
      this.tier = 0;
    }
    else {
      this.tiers = false;
      this.tier = false;
    }

    shop_names.push(this.name);
    shop_items.push(this);
    this.draw(this.name, this.baseCost);
  }

  addItemToInventory() {
    if (this.owned >= 1) {
      if (inventory.getCurrentItems().indexOf('x') != -1) {
        inventory.setItem(inventory.getCurrentItems().indexOf('x'), this.item);
      }
      else {
        this.game.butter += ITEMTYPE[this.item].worth;
      }
    }
  }

  draw(name, baseCost) {
    this.shop = document.getElementsByClassName('shop-wrapper')[0];

    this.shop_item = document.createElement('div');
    this.shop_item.setAttribute('class', 'shop-item row m-0 mt-3 pl-4');

    this.column_one = document.createElement('div');
    this.column_one.setAttribute('class', 'col-m-1 mt-3');

    this.shop_image = document.createElement('img');
    this.shop_image.setAttribute('class', 'shop-image');
    this.shop_image.style.width = '70px';
    this.column_one.appendChild(this.shop_image);

    this.column_two = document.createElement('div');
    this.column_two.setAttribute('class', 'col-m-1 ml-3 mt-4');

    this.shop_heading = document.createElement('p');
    this.shop_details_row_one = document.createElement('p');
    this.shop_details_row_two = document.createElement('p');
    
    this.shop_details_row_two.innerHTML = `<span style='color: #f7be44;'>One ${ITEMTYPE[this.item].name} Every ${Math.round(this.delay/60000)} Minutes</span>`;

    this.shop_heading.setAttribute('class', 'shop-heading h5');
    this.shop_details_row_one.setAttribute('class', 'shop-cost h6');
    this.shop_details_row_two.setAttribute('class', 'shop-owned h6');

    this.column_two.appendChild(this.shop_heading);
    this.column_two.appendChild(this.shop_details_row_one);
    this.column_two.appendChild(this.shop_details_row_two);

    this.shop_item.appendChild(this.column_one);
    this.shop_item.appendChild(this.column_two);

    this.shop.appendChild(this.shop_item);
    // this.shop_item = document.createElement('div');
    // this.image = document.createElement('img');
    // this.nameLabel = document.createElement('h1');
    // this.shop_details_row_one = document.createElement('h2');
    // this.shop_details_row_two = document.createElement('h2');
    // this.bg = document.createElement('img');
    // this.details = document.createElement('div');

    // this.shop_item.setAttribute('id', name);
    // this.image.setAttribute('id', name + 'image');
    // this.nameLabel.setAttribute('id', name + 'name')
    // this.shop_details_row_one.setAttribute('id', name + 'cost');
    // this.shop_details_row_two.setAttribute('id', name + 'owned');


    if (this.tiers == false) {
      this.shop_image.setAttribute('src', `/textures/ButterPack/gui/shop/${(this.name.replace(' ', '')).toLowerCase()}.png`);
    }
    else {
      this.shop_image.setAttribute('src', `/textures/ButterPack/gui/shop/${(this.name.replace(' ', '')).toLowerCase()}_${this.tiers[this.tier]}.png`);
    }

    this.shop_heading.textContent = this.name;
    this.shop_details_row_one.innerHTML = `<span style='color: #f7be44'>Cost:</span> ${formatNumber(this.cost)}  <span style='color: #f7be44; margin-left: 1em;'>Owned:</span>  ${this.owned} <span style='color: #f7be44; margin-left: 1em;'>BPS:</span> ${this.bps}`;
    // this.shop_details_row_two.textContent = `Owned: ${this.owned}`;

    this.mouseover = false;

    this.shop_item.addEventListener('mouseover', () => {
      this.mouseover = true;

      this.tooltipCanBuy();

      tooltip.style.display = 'block';
    });

    this.shop_item.addEventListener('mouseout', function () {
      this.mouseover = false;
      tooltip.style.display = 'none';
    });

    this.shop_item.addEventListener('mousemove', (event) => {
      this.tooltipCanBuy();

      pos(tooltip, 5, 0, event);
    });

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

    this.shop_item.addEventListener('click', () => {
      if (this.shop_item.classList.contains('unlocked')) {
        this.game.decrementButter(this.cost);
        this.increaseBPSForShop(this.name);
        this.game.checkAvailableUpgrades();
        this.owned += 1;
        this.shop_details_row_one.innerHTML = `<span style='color: #f7be44'>Cost:</span> ${formatNumber(this.cost)}  <span style='color: #f7be44; margin-left: 1em;'>Owned:</span>  ${this.owned} <span style='color: #f7be44; margin-left: 1em;'>BPS:</span> ${this.bps}`;

        this.incrementPrice(1);
        this.tooltipCanBuy(this.name);

        localStorage.setItem(`${this.name}_owned`, this.owned);
        localStorage.setItem(`${this.name}_cost`, this.cost);
      }
    });
  }

  increaseBPSForShop(name) {
    if (name == 'Whisk') {
      this.bps += 1;
      this.game.bps += 1;
    }
    if (name == 'Hand Mixer') {
      this.bps += 10;
      this.game.bps += 10;
    }
    if (name == 'Whip') {
      this.bps += 50;
      this.game.bps += 50;
    }
    if (name == 'Golden Grass') {
      this.bps += 150;
      this.game.bps += 150;
    }
    document.getElementsByClassName('butter-per-second')[0].textContent = `Butter Per Second: ${this.game.bps}`;
  }

  tooltipCanBuy() {
    if (this.canBuy) {
      tooltip.innerHTML = `
        BUILDING: ${this.name} <br>
        COST: <span class='canBuy'>${formatNumber(this.cost)}</span> <br>
        OWNED: ${this.owned}
      `;
    }
    else {
      tooltip.innerHTML = `
        BUILDING: ${this.name} <br>
        COST: <span class='cantBuy'>${formatNumber(this.cost)}</span> <br>
        OWNED: ${this.owned}
      `;
    }
  }

  incrementTier(number) {
    this.tier += number;
    this.image.setAttribute('src', `./textures/ButterPack/gui/shop/${this.name}_${this.tiers[this.tier]}.png`);
  }

  incrementPrice(numberOfIncrements) {
    this.tooltipCanBuy();
    this.cost = Math.round(this.baseCost * Math.pow(1.15, this.owned));
    this.cost = Math.ceil(this.cost / discount);
    this.shop_details_row_one.innerHTML = `<span style='color: #f7be44'>Cost:</span> ${formatNumber(this.cost)}  <span style='color: #f7be44; margin-left: 1em;'>Owned:</span>  ${this.owned} <span style='color: #f7be44; margin-left: 1em;'>BPS:</span> ${this.bps}`;

    localStorage.setItem(`${this.name}_owned`, this.owned);
    localStorage.setItem(`${this.name}_cost`, this.cost);
  }

  setPrice(price) {
    this.tooltipCanBuy();
    this.cost = Math.ceil(price / discount);
    this.shop_details_row_one.innerHTML = `<span style='color: #f7be44'>Cost:</span> ${formatNumber(this.cost)}  <span style='color: #f7be44; margin-left: 1em;'>Owned:</span>  ${this.owned} <span style='color: #f7be44; margin-left: 1em;'>BPS:</span> ${this.bps}`;
  }

  setOwned(owned) {
    this.tooltipCanBuy();
    this.owned = owned;
    this.shop_details_row_one.innerHTML = `<span style='color: #f7be44'>Cost:</span> ${formatNumber(this.cost)}  <span style='color: #f7be44; margin-left: 1em;'>Owned:</span>  ${this.owned} <span style='color: #f7be44; margin-left: 1em;'>BPS:</span> ${this.bps}`;

    localStorage.setItem(`${this.name}_owned`, this.owned);
    localStorage.setItem(`${this.name}_cost`, this.cost);
  }

  setName(name) {
    shop_names[shop_names.indexOf(this.name)] = name;
    this.name = name;
    this.nameLabel.textContent = name;
  }

  unlock() {
    this.canBuy = true;
    this.shop_item.classList.add('unlocked');
  }

  lock() {
    this.canBuy = false;
    this.shop_item.classList.remove('unlocked');
  }
}

function formatNumber(number) {
  const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];
  const tier = Math.log10(Math.abs(number)) / 3 | 0;
  if (tier === 0) return number;
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = number / scale;
  return scaled.toFixed(2) + suffix;
}

var gameInstance = new Game();

function adminToolsUtil() {
  gameInstance.increment = 1;
}

adminToolsUtil();

var whisk = new Shop(gameInstance, 'Whisk', 15, ['bronze', 'silver', 'gold'], 'dropofbutter', 1000000); //16 minutes
var handmixer = new Shop(gameInstance, 'Hand Mixer', 100, [], 'dropofbutter', 500000); //8 minutes
var whip = new Shop(gameInstance, 'Whip', 1_000, [], 'buttery', 1000000); //16 minutes
var cyborg_cows = new Shop(gameInstance, 'Cyborg Cow', 12_000, [], 'apple', 1000000); //16 minutes
var golden_grass = new Shop(gameInstance, 'Golden Grass', 50_000, [], 'buttery', 500000); //8 minutes
var intelligent_cows = new Shop(gameInstance, 'Intelligent Cow', 100_000, [], 'apple', 250000); //8 minutes

gameInstance.startAutoIncrement();
