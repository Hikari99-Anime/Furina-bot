const emoji = {

fish:"🐟",

bait:"🪱",

rod:"🎣",

money:"<:Fcoin_Vang:1534730937298980924>",

bag:"🎒",

shop:"🛒",

caro:"🐟",

cachep:"🐠",

muc:"🦑",

canoc:"🐡",

camap:"🦈",

thanthoai:"✨",

// =================
// CÁ VÙNG NHIỆT ĐỚI
// =================

cahe:"<:cahe:1535197790135648308>",

cabuom:"<:cabuom:1535197637760913408>",

caduoikiem:"<:caduoikiem:1535198065760141414>",

canhietdoi:"<:canhietdoi:1535198264876339251>",

camu:"<:camu:1535198469617221642>"

};






function formatMoney(number){


if(number>=1000000000)

return (number/1000000000)
.toFixed(1)
.replace(".0","")+"B";



if(number>=1000000)

return (number/1000000)
.toFixed(1)
.replace(".0","")+"M";



if(number>=1000)

return (number/1000)
.toFixed(1)
.replace(".0","")+"K";



return number.toString();


}






module.exports={






emoji,



formatMoney,







// =================
// CẦN CÂU
// =================


rods:{



can_1:{


name:"Cần Tre",


emoji:"<:cancau_1:1534625089088393358>",


price:10000,


uses:20,


luck:1,


star:1


},





can_2:{


name:"Cần Bạc",


emoji:"<:cancau_2:1534635569219633212>",


price:25000,


uses:50,


luck:3,


star:2


},





can_3:{


name:"Cần Vàng",


emoji:"<:cancau_3:1534625401119445170>",


price:50000,


uses:100,


luck:6,


star:3


},





can_4:{


name:"Cần Bạch Kim",


emoji:"<:cancau_4:1534635400793165965>",


price:100000,


uses:200,


luck:10,


star:4


},





can_5:{


name:"Cần Thần Thoại",


emoji:"<:cancau_5:1534635179778511100>",


price:500000,


uses:500,


luck:20,


star:5


}



},







// =================
// MỒI
// =================


baits:{



moithuong:{


name:"Mồi thường",


emoji:"🪱",


price:100,


rare:0


},




moibac:{


name:"Mồi bạc",


emoji:"🦐",


price:200,


rare:5


},




moivang:{


name:"Mồi vàng",


emoji:"✨",


price:500,


rare:15


}



},
// =================
// CÁ
// =================


fishList:[



// =================
// CÁ CŨ
// =================


{

id:"caro",

name:"Cá rô",

emoji:emoji.caro,

rarity:"COMMON",

color:"⚪",

rate:45,

min:0.2,

max:5,

sell:100

},




{

id:"cachep",

name:"Cá chép",

emoji:emoji.cachep,

rarity:"UNCOMMON",

color:"🟢",

rate:30,

min:1,

max:10,

sell:200

},




{

id:"muc",

name:"Mực",

emoji:emoji.muc,

rarity:"RARE",

color:"🔵",

rate:15,

min:0.5,

max:5,

sell:500

},




{

id:"canoc",

name:"Cá nóc",

emoji:emoji.canoc,

rarity:"EPIC",

color:"🟣",

rate:7,

min:1,

max:15,

sell:1000

},




{

id:"camap",

name:"Cá mập",

emoji:emoji.camap,

rarity:"LEGENDARY",

color:"🟡",

rate:2.8,

min:20,

max:200,

sell:5000

},




{

id:"thanthoai",

name:"Cá thần thoại",

emoji:emoji.thanthoai,

rarity:"MYTHICAL",

color:"🔴",

rate:0.2,

min:300,

max:1000,

sell:50000

},





// =================
// CÁ VÙNG NHIỆT ĐỚI
// =================



{

id:"cahe",

name:"Cá Hề",

emoji:emoji.cahe,

rarity:"COMMON",

color:"⚪",

rate:40,

min:0.1,

max:3,

sell:150

},




{

id:"cabuom",

name:"Cá Bướm",

emoji:emoji.cabuom,

rarity:"UNCOMMON",

color:"🟢",

rate:30,

min:0.5,

max:5,

sell:300

},




{

id:"caduoikiem",

name:"Cá Đuối Kiếm",

emoji:emoji.caduoikiem,

rarity:"RARE",

color:"🔵",

rate:15,

min:5,

max:30,

sell:800

},




{

id:"canhietdoi",

name:"Cá Nhiệt Đới",

emoji:emoji.canhietdoi,

rarity:"EPIC",

color:"🟣",

rate:8,

min:10,

max:50,

sell:2000

},




{

id:"camu",

name:"Cá Mú",

emoji:emoji.camu,

rarity:"LEGENDARY",

color:"🟡",

rate:2,

min:20,

max:100,

sell:5000

}

],







// =================
// VÙNG CÂU CÁ
// =================


fishingZones:{



// 🌴 NHIỆT ĐỚI

tropical:{


name:"🌴 Vùng Nhiệt Đới",


description:
"Vùng biển ấm áp với nhiều loài cá nhiệt đới.",


image:
"https://media.discordapp.net/attachments/1534756360103788596/1535257413786140733/1000013743-Photoroom.png?ex=6a771b63&is=6a75c9e3&hm=65af921296a30b91fc594ab09cd5a97e85020e3f2d69bfec8a4a58d9d4adac25&=&format=webp&quality=lossless",


luck:5,


fish:[

"cahe",

"cabuom",

"caduoikiem",

"canhietdoi",

"camu"

]

},






// ❄️ VÙNG LẠNH

cold:{


name:"❄️ Vùng Lạnh",


description:
"Vùng biển băng giá.",


image:
"https://media.discordapp.net/attachments/1534756360103788596/1535257294261067868/1000013742-Photoroom.png?ex=6a771b46&is=6a75c9c6&hm=cff7f826e8a228cb90db786dfe973c0f3a366e8b80e5cd7e85f411fe8f55957c&=&format=webp&quality=lossless",


luck:10,


fish:[

"caro",

"cachep",

"muc",

"camap"

]

},






// 🌿 ĐẦM LẦY

swamp:{


name:"🌿 Đầm Lầy",


description:
"Khu vực nước bí ẩn với sinh vật lạ.",


image:
"https://media.discordapp.net/attachments/1534756360103788596/1535257149284941865/1000013741-Photoroom.png?ex=6a771b24&is=6a75c9a4&hm=5faf706dea967f780cb92d9ce9b4a5e4060b4e61a57754838e4be169cdae03a2&=&format=webp&quality=lossless",


luck:15,


fish:[

"caro",

"cachep",

"canoc"

]

},






// 🌌 SÂU THẲM

deep:{


name:"🌌 Vùng Sâu Thẳm",


description:
"Nơi sinh sống của những sinh vật khổng lồ.",


image:
"https://media.discordapp.net/attachments/1534756360103788596/1535256926739374100/1000013740-Photoroom.png?ex=6a771aef&is=6a75c96f&hm=5fc0463cb72bf36592d86146895a76bf7bb8c33105b652dc60063632ae39b1fc&=&format=webp&quality=lossless",


luck:25,


fish:[

"muc",

"canoc",

"camap",

"thanthoai"

]

},






// 🌋 CHỦ NHẬT

volcano:{


name:"🌋 Vùng Núi Lửa",


description:
"Khu vực đặc biệt mở toàn bộ Chủ Nhật.",


image:
"https://media.discordapp.net/attachments/1534756360103788596/1535256789833093150/1000013739-Photoroom.png?ex=6a771ace&is=6a75c94e&hm=a23a2109ebf917d8456ae81cef18482a5a3776aafabe425bc3a8a68fa11f902b&=&format=webp&quality=lossless",


luck:50,


sundayOnly:true,


fish:[

"canoc",

"camap",

"thanthoai"

]

}


},
// =================
// RƯƠNG
// =================

chests:{



chest_1:{


name:"Rương Đồng",


emoji:"🟫",


star:1,


key:"key_1",


drop:[

{

type:"money",

min:400,

max:1400

}

]


},




chest_2:{


name:"Rương Bạc",


emoji:"⬜",


star:2,


key:"key_2",


drop:[

{

type:"money",

min:2000,

max:7000

}

]


},




chest_3:{


name:"Rương Vàng",


emoji:"🟨",


star:3,


key:"key_3",


drop:[

{

type:"money",

min:6000,

max:21000

}

]


},




chest_4:{


name:"Rương Kim Cương",


emoji:"💎",


star:4,


key:"key_4",


drop:[

{

type:"money",

min:20000,

max:70000

}

]


},




chest_5:{


name:"Rương Thần Thoại",


emoji:"🌌",


star:5,


key:"key_5",


drop:[

{

type:"money",

min:80000,

max:280000

}

]


}


},







// =================
// CHÌA KHÓA
// =================

keys:{



key_1:{


name:"Chìa khóa Đồng",


emoji:"🗝️",


price:1000


},



key_2:{


name:"Chìa khóa Bạc",


emoji:"🗝️",


price:5000


},



key_3:{


name:"Chìa khóa Vàng",


emoji:"🗝️",


price:15000


},



key_4:{


name:"Chìa khóa Kim Cương",


emoji:"🗝️",


price:50000


},



key_5:{


name:"Chìa khóa Thần Thoại",


emoji:"🗝️",


price:200000


}


},







// =================
// CƯỜNG HÓA +15
// =================

upgrade:{



success:[


60,

55,

50,

45,

40,

35,

30,

25,

20,

15,

12,

10,

8,

6,

5

],



luckPerLevel:2


},







// =================
// VÉ BẢO HIỂM
// =================

insurance:{



baohiem:{


name:"Vé bảo hiểm",


emoji:"🎫",


price:30000


}


},







// =================
// DANH HIỆU
// =================

rodTitles:{



10:"🌟 Bậc Thầy Ngư Dân",


12:"🌊 Chinh Phục Đại Dương",


15:"👑 Huyền Thoại Biển Sâu"


}



};