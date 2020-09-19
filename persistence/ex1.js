'use strict';

const mysql = require('../core/mysql');

exports.getData=async (id)=>{

  if(!id){
    throw Error('id missing');
  }
  const query=`SELECT ? AS id FROM dual`;

  const data = await mysql.query(query,[id]);
  return data;
}