'use strict';

const mysql = require('../core/mysql');


class Score{

  async updateScore(data){

    if(!data.userId||!data.matchId||!data.score||!data.kills){
      throw Error('required fields misssing userId,matchId,score,kills');
    }


    const query = `SELECT id FROM user_match_mapping WHERE userid=? AND matchid=?`;

    const idReult = await mysql.query(query,[data.userId,data.matchId]);

    if(!idReult.length){
      throw Error('Invalid matchId or userId');
    }
    const id= idReult[0].id;

    console.log('updateScore user_match_mapping_id: ',id);

    const insertQuery=`START TRANSACTION; INSERT INTO scores(kills,score,user_match_mapping_id) VALUES(?,?,?);COMMIT;`;

    return await mysql.transQuery(insertQuery,[data.kills,data.score,id]);
  }

  async getLeaderBoardForMatch(matchId,startdate,enddate){

    // const query = `SELECT scores.score, scores.kills FROM scores
    // INNER JOIN user_match_mapping ON(scores.user_match_mapping_id=user_match_mapping.id)
    // WHERE user_match_mapping.matchid=? AND DATE(created_at) BETWEEN ? AND ?
    // GROUP BY user_match_mapping.userid
    // ORDER BY scores.id DESC;
    // `;

    const dateQuery = startdate&&enddate ? `AND (Date(payments.created_at) BETWEEN '${startdate}' AND '${enddate}')`:'';

    const query = `SELECT MAX(score) maxScore, name FROM (SELECT scores.score, scores.kills, user_match_mapping.userid, users.name FROM scores
    INNER JOIN user_match_mapping ON(scores.user_match_mapping_id=user_match_mapping.id)
    INNER JOIN users ON(user_match_mapping.userid=users.id)
    WHERE user_match_mapping.matchid=  ? ${dateQuery}
    ORDER BY scores.id DESC) scoreboard Group BY userid;
    `;
    return await mysql.query(query,[matchId])
  }
}


module.exports = new Score();