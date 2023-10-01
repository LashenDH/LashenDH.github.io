const TICKERS = [
    { butter: 0, message: `You are new to this game aren't you!` },
    { butter: 0, message: `Welcome to Butter Clicker V1` },

    { butter: 10, message: `The grind has only just begun, young farmer.` },
    { butter: 10, message: `Nobody wants your butter.` },
    { butter: 10, message: `Butter my biscuit son, that's all you're good for - Village Father` },
    { butter: 10, message: `I can't believe it's not butter! Oh wait. It is.` },
    { butter: 10, message: `Butter: a pale yellow edible fatty substance made by churning cream and used as a spread or in cooking. If you didn't know that, why are you here?` },
    { butter: 10, message: `You're about to go on the journey of a life time!` },
    { butter: 10, message: `Level up your buildings, those help a ton.` },
    { butter: 10, message: `Your buildings give you items after a while.` },
    { butter: 10, message: `Remember, cheated butter isn't accepted here.` },
    { butter: 10, message: `Relish the moments before war, friend.` },

    { butter: 1000, message: `Return to whence you came mortal!` },
    // { butter: 100, message: `You feel worthless compared to your predecessors.` },
    // { butter: 100, message: `Game News: Butter Clicker 2 delayed for 2045 release` },
    // { butter: 100, message: `Butter Clicker: the next update is always 5 hours away. Always.` },

];

function randomNoRepeats(array) {
    var copy = array.slice(0);
    return function () {
        if (copy.length < 1) { copy = array.slice(0); }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        return item;
    };
}

function displayTickers(butter) {
    var tickers = findTicker(butter);
    var possible_ticker = randomNoRepeats(tickers);
    var ticker = possible_ticker();

    if (ticker == undefined) {
        document.getElementsByClassName('news-ticker')[0].innerHTML = '';
    }
    else {
        document.getElementsByClassName('news-ticker')[0].innerHTML = ticker.message;
    }
}

function findTicker(butter) {
    var tickers = [];
    var currentDistance = Number.MAX_VALUE;
    TICKERS.forEach(ticker => {
        if (ticker.butter <= parseInt(butter)) {
            const distance = Math.abs(parseInt(butter) - parseInt(ticker.butter));

            if (distance < currentDistance) {
                currentDistance = distance;
                tickers = [ticker];
            } else if (distance === currentDistance) {
                tickers.push(ticker);
            }
        }
    });

    return tickers;
}

export { displayTickers };
