const api = 'http://193.70.2.77:3050/data/'
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

var actions = []
var process

function getColorByRank(rank)
{
    const info = ranks.find(elem => rank >= elem.interval[0] && rank <= elem.interval[1])
    return info.color
}

async function processChange(elem, number) {
    const info = await fetch(api + number, {
        method: "GET"
    }).then(data => data.json()).then(data => data)
    const color = getColorByRank(info.rank)
    elem.style["background-color"] = color;
}

var observe = new MutationObserver(function(mutations, observer) {
    for (var mutate in mutations) {
        for (var elem of mutations[mutate].addedNodes) {
            actions.push({"target": elem, "mint": elem.querySelector(".card-title").textContent.match(/\d+/g)})
        }
        if (!process)
            process = setInterval(() => {
                if (!actions.length) {
                    clearInterval(process)
                    process = null
                    return;
                }
                const item = actions.pop()
                processChange(item.target, item.mint)
                console.log("proceed")
            }, 20)
    }
})

var loaded = new MutationObserver(function(mutations, observer) {
    const container = document.querySelector(".containerCollection1")
    if (container) {
        observe.observe(container, {
            childList: true,
        })
    } else {
        observe.takeRecords()
    }
});

async function isServeRun() {
    var run = true;
    await fetch(api, { method:'GET'}).catch(a => run = false)
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
