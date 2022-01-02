const api = 'http://localhost:3050/data/'
const ContainerClass = "containerCollection1"

const ranks = [
    {
        "rarity": "mythic",
        "interval": [1, 26],
        "color": "red"
    },
    {
        "rarity": "legendary",
        "interval": [27, 132],
        "color": "orange"
    },
    {
        "rarity": "epic",
        "interval": [133, 397],
        "color": "purple"
    },
    {
        "rarity": "rare",
        "interval": [398, 927],
        "color": "blue"
    },
    {
        "rarity": "uncommon",
        "interval": [928, 1590],
        "color": "green"
    },
    {
        "rarity": "common",
        "interval": [1591, 2650],
        "color": "gray"
    }
]

function getColorByRank(rank)
{
    const info = ranks.find(elem => rank > elem.interval[0] && rank < elem.interval[1])
    return info.color
}

async function processChange(elem, number) {
    var info;
    await fetch(api + number, {
        method: "GET"
    }).then(data => data.json()).then(data => info = data)
    const color = getColorByRank(info.rank)
    elem.style["background-color"] = color;
}

var observe = new MutationObserver(function(mutations, observer) {
    for (var mutate in mutations) {
        mutations[mutate].addedNodes.forEach(elem => {
            processChange(elem, elem.querySelector(".card-title").textContent.match(/\d+/g))
        })
    }
})

var loaded = new MutationObserver(function(mutations, observer) {
    const container = document.getElementsByClassName(ContainerClass).item(0)
    if (container) {
        observe.observe(container, {
            childList: true,
        })
    }
});

async function isServeRun() {
    var run = true;
    await fetch(api + 1, { method:'GET'}).catch(a => run = false)
    return run
}

async function launchScript() {
    if (await isServeRun()) {
        loaded.observe(document.body, {
            subtree: true,
            attributes: true
        });
    }
}

launchScript()
