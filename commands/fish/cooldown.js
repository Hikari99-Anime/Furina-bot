const cooldowns={};


function checkFish(userID,time=5000){


const now=Date.now();


if(
cooldowns[userID] &&
now-cooldowns[userID]<time
){


return false;


}


cooldowns[userID]=now;


return true;


}



module.exports={
checkFish
};