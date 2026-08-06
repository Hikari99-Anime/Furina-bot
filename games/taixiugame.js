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




function playerBet(id){


if(!currentGame)
return false;



return currentGame.players.some(

p => p.id === id

);


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

playerBet,

closeGame


};