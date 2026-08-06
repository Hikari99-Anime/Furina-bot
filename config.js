// config.js

const emoji = {

    // ======================
    // GIAO DIỆN
    // ======================

    fish:
    "",

    bait:
    "",

    rod:
    "",

    money:
    "<:Fcoin_Vang:1534730937298980924>",

    bag:
    "",

    shop:
    "",



    // ======================
    // CÁ
    // ======================

    caro:
    "",

    cachep:
    "",

    muc:
    "",

    canoc:
    "",

    camap:
    "",

    thanthoai:
    ""

};





module.exports = {



emoji,





rods:{


    can_1:{

        name:"Cần Tre",

        emoji:"<:cancau_1:1534625089088393358>",

        price:10000,

        uses:20,

        luck:1

    },


    can_2:{

        name:"Cần Bạc",

        emoji:"<:cancau_2:1534635569219633212>",

        price:25000,

        uses:50,

        luck:2

    },


    can_3:{

        name:"Cần Vàng",

        emoji:"<:cancau_3:1534625401119445170>",

        price:50000,

        uses:100,

        luck:4

    },


    can_4:{

        name:"Cần Bạch Kim",

        emoji:"<:cancau_4:1534635400793165965>",

        price:9999999999,

        uses:200,

        luck:7

    },


    can_5:{

        name:"Cần thần thoại",

        emoji:"<:cancau_5:1534635179778511100>",

        price:999999999999,

        uses:500,

        luck:12

    }


},






baits:{


    moithuong:{

        name:"Mồi thường",

        emoji:"🪱",

        price:100

    },


    moibac:{

        name:"Mồi bạc",

        emoji:"🦐",

        price:200

    },


    moivang:{

        name:"Mồi vàng",

        emoji:"✨",

        price:500

    }


},






fishList:[


    {
        name:"Cá rô",
        emoji:emoji.caro || "🐟",
        rate:45,
        min:0.2,
        max:5
    },


    {
        name:"Cá chép",
        emoji:emoji.cachep || "🐟",
        rate:30,
        min:1,
        max:10
    },


    {
        name:"Mực",
        emoji:emoji.muc || "🦑",
        rate:15,
        min:0.5,
        max:5
    },


    {
        name:"Cá nóc",
        emoji:emoji.canoc || "🐡",
        rate:7,
        min:1,
        max:15
    },


    {
        name:"Cá mập",
        emoji:emoji.camap || "🦈",
        rate:2.8,
        min:20,
        max:200
    },


    {
        name:"Cá thần thoại",
        emoji:emoji.thanthoai || "✨",
        rate:0.2,
        min:300,
        max:1000
    }


]


};