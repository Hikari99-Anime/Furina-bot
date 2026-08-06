let currentGame = null;



function createGame(){


currentGame = {

players: [],

started: true

};


return currentGame;

}




function getGame(){


return currentGame;


}




function addBet(data){


if(!currentGame)
return false;



currentGame.players.push(data);



return true;


}




function hasBetType(id,type){


if(!currentGame)
return false;



return currentGame.players.some(

p => p.id === id && p.type === type

);


}




function totalBetOf(id){


if(!currentGame)
return 0;



return currentGame.players

.filter(p => p.id === id)

.reduce((sum,p) => sum + p.money, 0);


}




function closeGame(){


const oldGame = currentGame;



currentGame = null;



return oldGame;


}




module.exports = {


createGame,

getGame,

addBet,

hasBetType,

totalBetOf,

closeGame


};
