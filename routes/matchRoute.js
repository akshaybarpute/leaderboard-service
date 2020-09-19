'use strict';

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Match = require('../persistence/match');



const createMatchSchema = {
  matchName: Joi.string().required().label('matchId required'),
  userIds: Joi.array().items(Joi.number().integer().required().label('userId required')).required().label('userids required')
}

const createMatchParser = (request)=>{



  const validationResult = Joi.validate(request,createMatchSchema, {
      abortEarly:true,
      allowUnknown:true
  });

  if (validationResult.error){
      const err = new Error(validationResult.error.details[0].context.label);
      err.code=400;
      throw err;
  }

  return {
    matchName: request.matchName,
    userIds: request.userIds
  }
};

router.post('/create', async(req,res)=>{

  console.log('match: ', req.params);


try{
  const request = {
    matchName: req.body.name,
    userIds: req.body.userIds
  };

  console.log({request});

  const parsedRequest= createMatchParser(request);

  console.log(parsedRequest);

  const result = await Match.createMatch(parsedRequest.matchName,parsedRequest.userIds);

  console.log({parsedRequest});

  return res.status(200).json({
    status:'success',
    message:'match created successfully',
    data:null,
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



router.post('/submit/:userId/:matchId', async(req,res)=>{

  console.log('match: ', req.params);


try{
  const request = {
    score:'',
    kills:''
  };

  console.log({request});

  const parsedRequest= createMatchParser(request);

  console.log(parsedRequest);

  const result = await Match.createMatch(parsedRequest.matchName,parsedRequest.userIds);

  console.log({parsedRequest});

  return res.status(200).json({
    status:'success',
    message:'match created successfully',
    data:null,
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