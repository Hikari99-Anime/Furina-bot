const config = require("./config");


// lấy vùng nhiệt đới

const zone = config.fishingZones.tropical;


console.log("=== VÙNG HIỆN TẠI ===");

console.log(zone.name);

console.log(zone.description);




// lọc cá trong vùng

const fishPool = config.fishList.filter(f =>
    zone.fish.includes(f.id)
);



console.log("\n=== CÁ TRONG VÙNG ===");


fishPool.forEach(f => {

    console.log(
        f.emoji,
        f.name,
        "|",
        f.rarity,
        "|",
        f.min + "-" + f.max + " KG"
    );

});





// random cá giống bot

function randomFish(list){


let total = list.reduce(
    (sum, fish)=> sum + fish.rate,
    0
);


let random = Math.random() * total;


for(const fish of list){


random -= fish.rate;


if(random <= 0){

return fish;

}


}


return list[0];

}




console.log("\n=== THỬ CÂU 10 LẦN ===");



for(let i = 1; i <= 10; i++){


const fish = randomFish(fishPool);


const weight =
(
Math.random() *
(fish.max - fish.min)
+ fish.min
).toFixed(2);



console.log(
`${i}. ${fish.emoji} ${fish.name} - ${weight} KG`
);


}