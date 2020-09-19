'use strict';

const express = require('express');

const router = express.Router();
const Joi = require('joi');
const score = require('../persistence/score');

// router.post('/test', async(req,res)=>{

//     console.log('match: ', req.params);


//   return res.status(200).json({
//     status:'success',
//     message:'hello: score route',
//     data:null,
//     err:false,
//     count:0,
//     totalCount:0
//   })
// });



const uploadScoreSchema = {
  matchId: Joi.number().integer().required().label('matchId required'),
  userId: Joi.number().integer().required().label('userId required'),
  score: Joi.number().integer().required().label('score required'),
  kills: Joi.number().integer().required().label('kills required')
}

const uploadScoreParser = (request)=>{

  const validationResult = Joi.validate(request,uploadScoreSchema, {
      abortEarly:true,
      allowUnknown:true
  });

  if (validationResult.error){
      const err = new Error(validationResult.error.details[0].context.label);
      err.code=400;
      throw err;
  }

  return {
    matchId: request.matchId,
    userId: request.userId,
    score: request.score,
    kills: request.kills
  }
};


router.get('/:matchId', async(req,res)=>{


try{

  const matchId = req.params.matchId;

  if(!matchId){

    const err = new Error('MatchId missing');
    err.code = 400;
    throw err;
  }

  const result = await score.getLeaderBoardForMatch(matchId,req.query.startdate,req.query.enddate);

  return res.status(200).json({
    status:'success',
    message:'score updated successfully',
    data:result,
    err:false,
    count:0,
    totalCount:0
  });

}
catch(err){

console.log('err: ', err.message,err.stack);
  return res.status(err.code||500).json({
    status:'failed',
    message: err.message
  })
}

});




module.exports = router;