var upgrades = document.getElementsByClassName('upgrade');
var discount = 1;
var shop_names = [];
var shop_items = [];
var tooltip = document.getElementById('tooltip');

class Game {
  constructor() {
    var butter = document.getElementsByClassName('butter-image')[0];

    if(localStorage.getItem('game_butter') == null){
      localStorage.setItem('game_butter', 0);
    }
    this.butter = parseInt(localStorage.getItem('game_butter'));

    this.increment = 1;
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
      this.incrementButter(this.bps / 10);
    }, 100);
  }
}

class Shop {
  constructor(game, name, baseCost, tiers) {
    this.game = game;
    this.name = name;

    if(localStorage.getItem(`${this.name}_owned`) == null){
      localStorage.setItem(`${this.name}_owned`, 0);
    }
    if(localStorage.getItem(`${this.name}_cost`) == null){
      localStorage.setItem(`${this.name}_cost`, Math.ceil(baseCost / discount));
    }

    this.cost = parseInt(localStorage.getItem(`${this.name}_cost`));
    this.owned = parseInt(localStorage.getItem(`${this.name}_owned`));
    this.baseCost = baseCost;

    for(let i = 0; i < this.owned; i++){
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

  draw(name, baseCost) {
    this.shop = document.getElementsByClassName('main-shop')[0];
    
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
    this.shop_cost = document.createElement('p');
    this.shop_owned = document.createElement('p');

    this.shop_heading.setAttribute('class', 'shop-heading h5');
    this.shop_cost.setAttribute('class', 'shop-cost h6');
    this.shop_owned.setAttribute('class', 'shop-owned h6');

    this.column_two.appendChild(this.shop_heading);
    this.column_two.appendChild(this.shop_cost);
    this.column_two.appendChild(this.shop_owned);

    this.shop_item.appendChild(this.column_one);
    this.shop_item.appendChild(this.column_two);

    this.shop.appendChild(this.shop_item);
    // this.shop_item = document.createElement('div');
    // this.image = document.createElement('img');
    // this.nameLabel = document.createElement('h1');
    // this.shop_cost = document.createElement('h2');
    // this.shop_owned = document.createElement('h2');
    // this.bg = document.createElement('img');
    // this.details = document.createElement('div');

    // this.shop_item.setAttribute('id', name);
    // this.image.setAttribute('id', name + 'image');
    // this.nameLabel.setAttribute('id', name + 'name')
    // this.shop_cost.setAttribute('id', name + 'cost');
    // this.shop_owned.setAttribute('id', name + 'owned');

    var temp_name = this.name.replace(' ', '');
    if (this.tiers == false) {
      this.shop_image.setAttribute('src', `./textures/ButterPack/gui/shop/${temp_name.lower()}.png`);
    }
    else {
      this.shop_image.setAttribute('src', `./textures/ButterPack/gui/shop/${temp_name.lower()}_${(this.tiers[this.tier]).lower()}.png`);
    }

    this.shop_heading.textContent = this.name;
    this.shop_cost.textContent = `Cost: ${formatNumber(this.cost)}`;
    this.shop_owned.textContent = `Owned: ${this.owned}`;

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
        this.game.checkAvailableUpgrades();
        this.owned += 1;
        this.shop_owned.textContent = `Owned: ${this.owned}`;

        this.incrementPrice(1);
        this.increaseBPSForShop(this.name);
        this.tooltipCanBuy(this.name);
          
        localStorage.setItem(`${this.name}_owned`, this.owned);
        localStorage.setItem(`${this.name}_cost`, this.cost);

        console.log(localStorage.getItem(`${this.name}_cost`));
      }
    });
  }

  increaseBPSForShop(name){
    if (name == 'Whisk') {
      this.game.bps += 1;
    }
    if (name == 'Hand Mixer') {
      this.game.bps += 10;
    }
    if (name == 'Creamer') {
      this.game.bps += 25;
    }
    // if (this.name == 'Emulsifier') {
    //   this.game.bps += 1000;
    // }
    // if (this.name == 'Farm') {
    //   this.game.bps += 100000;
    // }
    // if (this.name == 'Factory') {
    //   this.game.bps += 1000000;
    // }
    // if (this.name == 'Meltdown') {
    //   this.game.bps += 10000000;
    // }
    // if (this.name == 'Atomic Creamer') {
    //   this.game.bps += 100000000;
    // }
  }

  tooltipCanBuy(){
    if(this.canBuy){
      tooltip.innerHTML = `
        BUILDING: ${this.name} <br>
        COST: <span class='canBuy'>${formatNumber(this.cost)}</span> <br>
        OWNED: ${this.owned}
      `;
    }
    else{
      tooltip.innerHTML = `
        BUILDING: ${this.name} <br>
        COST: <span class='cantBuy'>${formatNumber(this.cost)}</span> <br>
        OWNED: ${this.owned}
      `;
    }
  }

  incrementTier(number) {
    this.tier += number;
    this.image.setAttribute('src', `/textures/ButterPack/gui/shop/${this.name}_${this.tiers[this.tier]}.png`);
  }

  incrementPrice(numberOfIncrements) {
    this.tooltipCanBuy();
    this.cost = Math.round(this.baseCost * Math.pow(1.15, this.owned));
    this.cost = Math.ceil(this.cost / discount);
    this.shop_cost.textContent = `Cost: ${formatNumber(this.cost)}`;
    
    localStorage.setItem(`${this.name}_owned`, this.owned);
    localStorage.setItem(`${this.name}_cost`, this.cost);
  }

  setPrice(price) {
    this.tooltipCanBuy();
    this.cost = Math.ceil(price / discount);
    this.shop_cost.textContent = `Cost: ${formatNumber(this.cost)}`;
  }

  setOwned(owned) {
    this.tooltipCanBuy();
    this.owned = owned;
    this.shop_owned.textContent = `Owned: ${this.owned}`;
    
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

var whisk = new Shop(gameInstance, 'Whisk', 15, ['bronze', 'silver', 'gold']);
var handmixer = new Shop(gameInstance, 'Hand Mixer', 100);
// new Shop(gameInstance, 'Creamer', 1100);
// new Shop(gameInstance, 'Emulsifier', 12000);
// new Shop(gameInstance, 'Farm', 13000);
// new Shop(gameInstance, 'Factory', 140000);
// new Shop(gameInstance, 'Meltdown', 20000000);
// new Shop(gameInstance, 'Atomic Creamer', 3_300_000_000);

gameInstance.startAutoIncrement();
