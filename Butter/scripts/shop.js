
var upgrades = document.getElementsByClassName('upgrade');
var discount = 1;
var shop_names = [];
var shop_items = [];
var tooltip = document.getElementById('tooltip');

class Game {
  constructor() {
    var butter = document.getElementById('butter-container');

    this.butter = 410;
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
    var number = document.getElementById('number');
    this.butter = value;
    number.textContent = formatNumber(Math.floor(this.butter));
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
    this.cost = Math.ceil(baseCost / discount);
    this.baseCost = baseCost;
    if (tiers) {
      this.tiers = tiers;
      this.tier = 0;
    }
    else {
      this.tiers = false;
      this.tier = false;
    }
    this.owned = 0;

    shop_names.push(this.name);
    shop_items.push(this);
    this.draw(this.name, this.baseCost);
  }

  draw(name, baseCost) {
    var shop = document.getElementById('shop_container');
    var name = 'product' + shop_names.indexOf(name);

    this.container = document.createElement('div');
    this.image = document.createElement('img');
    this.nameLabel = document.createElement('h1');
    this.costLabel = document.createElement('h2');
    this.ownedLabel = document.createElement('h2');
    this.bg = document.createElement('img');
    this.details = document.createElement('div');

    this.container.setAttribute('id', name);
    this.image.setAttribute('id', name + 'image');
    this.nameLabel.setAttribute('id', name + 'name')
    this.costLabel.setAttribute('id', name + 'cost');
    this.ownedLabel.setAttribute('id', name + 'owned');

    this.bg.setAttribute('id', 'shop_bg');
    this.bg.setAttribute('src', '/textures/ButterPack/gui/inventory/shop.png');

    if (this.tiers == false) {
      this.image.setAttribute('src', `/textures/ButterPack/gui/shop/${this.name.replace(' ', '')}.png`);
    }
    else {
      this.image.setAttribute('src', `/textures/ButterPack/gui/shop/${this.name.replace(' ', '')}_${this.tiers[this.tier]}.png`);
    }

    this.container.setAttribute('class', 'shop_item');
    this.details.setAttribute('class', 'shop_details')
    this.nameLabel.setAttribute('class', 'shop_name')
    this.costLabel.setAttribute('class', 'shop_cost');
    this.ownedLabel.setAttribute('class', 'shop_owned');
    this.image.setAttribute('class', 'shop_image');

    shop.appendChild(this.container);
    this.container.appendChild(this.bg);
    this.container.appendChild(this.image);
    this.container.appendChild(this.details);
    this.details.appendChild(this.nameLabel);
    this.details.appendChild(this.costLabel);
    this.details.appendChild(this.ownedLabel);

    this.nameLabel.textContent = this.name;
    this.costLabel.textContent = formatNumber(this.cost);
    this.ownedLabel.textContent = this.owned;

    this.mouseover = false;

    this.container.addEventListener('mouseover', () => {
      this.mouseover = true;

      this.tooltipCanBuy();

      tooltip.style.display = 'block';
    });

    this.container.addEventListener('mouseout', function () {
      this.mouseover = false;
      tooltip.style.display = 'none';
    });

    this.container.addEventListener('mousemove', (event) => {
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

    this.container.addEventListener('click', () => {
      if (this.container.classList.contains('unlocked')) {
        this.game.decrementButter(this.cost);
        this.game.checkAvailableUpgrades();
        this.owned += 1;
        this.ownedLabel.textContent = this.owned;

        this.incrementPrice(1);

        this.tooltipCanBuy();

        if (this.name == 'Whisk') {
          this.game.bps += 1;
        }
        if (this.name == 'Hand Mixer') {
          this.game.bps += 10;
        }
        if (this.name == 'Creamer') {
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
    });
  }

  tooltipCanBuy(){
    if(this.canBuy){
      tooltip.innerHTML = `
        BUILDING: ${this.name} <br>
        COST: <span class='canBuy'>${this.cost}</span> <br>
        OWNED: ${this.owned}
      `;
    }
    else{
      tooltip.innerHTML = `
        BUILDING: ${this.name} <br>
        COST: <span class='cantBuy'>${this.cost}</span> <br>
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
    this.costLabel.textContent = formatNumber(this.cost);
  }

  setPrice(price) {
    this.tooltipCanBuy();
    this.cost = Math.ceil(price / discount);
    this.costLabel.textContent = formatNumber(this.cost);
  }

  setOwned(owned) {
    this.tooltipCanBuy();
    this.owned = owned;
    this.ownedLabel.textContent = this.owned;
  }

  setName(name) {
    shop_names[shop_names.indexOf(this.name)] = name;
    this.name = name;
    this.nameLabel.textContent = name;
  }

  unlock() {
    this.canBuy = true;
    this.container.classList.add('unlocked');
  }

  lock() {
    this.canBuy = false;
    this.container.classList.remove('unlocked');
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
