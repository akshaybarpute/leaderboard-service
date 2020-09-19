'use strict';

const express = require('express');

const router = express.Router();

router.get('/test', async(req,res)=>{

  return res.status(200).json({
    status:'success',
    message:'hello',
    data:null,
    err:false,
    count:0,
    totalCount:0
  })
});

module.exports = router;