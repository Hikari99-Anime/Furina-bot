const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser
} = require("../database");


const {
    rods,
    baits,
    emoji
} = require("../config");



module.exports = {


name:"inv",



async execute(message){



const user =
getUser(
message.guild.id,
message.author.id
);





// ======================
// TIỀN
// ======================

const money =

`${user.money.toLocaleString()} xu`;







// ======================
// CẦN CÂU
// ======================


let rodText = "";



for(
const id in user.can.danhSach
){



if(
!rods[id]
)

continue;



const rod =
rods[id];



const active =

user.can.dangDung === id

? " ✅ Đang dùng"

: "";



rodText +=

`
${rod.emoji} **${rod.name}**${active}

🆔 ID:
\`${id}\`

🎣 Lượt:
${user.can.danhSach[id]}

⭐ Luck:
${rod.luck}

`;



}



if(!rodText)

rodText =
"❌ Chưa có cần câu";







// ======================
// MỒI
// ======================


let baitText = "";



for(
const id in user.moi
){



if(
!baits[id]
)

continue;



if(
user.moi[id] <= 0
)

continue;



const bait =
baits[id];



baitText +=

`
${bait.emoji} ${bait.name} x${user.moi[id]}
`;



}



if(!baitText)

baitText =
"❌ Không có mồi";







// ======================
// KHO CÁ
// ======================


let fishText = "";



for(
const name in user.fish
){



const fish =
user.fish[name];



if(
!Array.isArray(fish)
)

continue;



if(
fish.length <= 0
)

continue;



fishText +=

`
${name} x${fish.length}
`;



}



if(!fishText)

fishText =
"❌ Chưa có cá";







// ======================
// EMBED
// ======================


const embed =

new EmbedBuilder()

.setColor("#00ccff")

.setTitle(
`${emoji.bag || "🎒"} INVENTORY`
)


.setDescription(

`
💰 **TIỀN**

${money}

━━━━━━━━━━━━━━

🎣 **CẦN CÂU**

${rodText}

━━━━━━━━━━━━━━

🪱 **MỒI**

${baitText}

━━━━━━━━━━━━━━

🐟 **KHO CÁ**

${fishText}

`

)


.setThumbnail(

message.author.displayAvatarURL()

)


.setTimestamp();






message.reply({

embeds:[
embed
]

});



}


};