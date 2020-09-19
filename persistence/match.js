'use strict';

const mysql = require('../core/mysql');


class Match{

  async createNewMatchRecord(name){

    const params=[];
    const matchQuery=`INSERT INTO matches(name) VALUES(?);`;
    params.push(name);

    return await mysql.query(matchQuery,params);
  }

  async createMatch(name,userIds){

    if(!name||!userIds){
      throw Error('name & userids missing');
    }

    const result = await this.createNewMatchRecord(name);
    console.log('insert result: ',result);
    const matchId = result.insertId;
    let userIdQuery='';
    let scoreQuery='';
    const params=[];

    for(let i=0;i<userIds.length;i++){
      userIdQuery=userIdQuery+`INSERT INTO user_match_mapping(matchid,userid) VALUES(?,?); `;
      params.push(matchId,userIds[i]);
    }

    await mysql.transQuery(userIdQuery,params); 
    return await this.createScoreBoard(matchId);
  }

  async createScoreBoard(matchId){

    let insertQuery = ``;
    const params=[];

    const query = `SELECT id FROM user_match_mapping WHERE matchid=?`;

    const result = await mysql.query(query,matchId);

    console.log('createMatchFinal: ', result);

    for(let i=0;i<result.length;i++){

      insertQuery = insertQuery +  `INSERT INTO scores(kills,score,user_match_mapping_id) VALUES(0,0,?); `;
      params.push(result[i].id);
    }

    console.log(insertQuery);
    return await mysql.transQuery(insertQuery,params);
  }
  
}




// exports.getData=async (id)=>{

//   if(!id){
//     throw Error('id missing');
//   }
//   const query=`SELECT ? AS id FROM dual`;

//   const data = await mysql.query(query,[id]);
//   return data;
// }

module.exports = new Match();