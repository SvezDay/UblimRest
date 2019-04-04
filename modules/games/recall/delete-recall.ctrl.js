'use-strict';
// CONFIG ----------------------------------------------------------------------
const tokenGen = require('../../../services/token.service');
const driver = require('path').join(__dirname, '_graphenedb');
// LIB ---------------------------------------------------------------------
const parser = require('parse-neo4j');
// SERVICES --------------------------------------------------------------------
const utils = require('../../../services/utils.service');
const validator = require('../../../services/validator.service');
let miscellaneous = require('../../../services/miscellaneous.request');
// REQUEST ---------------------------------------------------------------------
// COMMON ----------------------------------------------------------------------
// CONTROLLER ------------------------------------------------------------------

module.exports.deleteRecall = (tx, note_uuid)=>{ // Input: note_uuid  |  Output:  void
  return new Promise((resolve, reject)=>{
    let one = `
      MATCH (r:Recall) WHERE r.q = $note_uuid or r.a = $note_uuid
      DETACH DELETE r
    `;
    tx.run(one, {note_uuid:note_uuid})
    .then(() => resolve() )
    .catch(err =>{console.log(err); reject({status: err.status || 400, mess: err.mess || 'recall/delete-recall.ctrl.js/main'}, res, tx)} )
  })
}

module.exports.main = (req, res, next)=>{ // Input: note_uuid  |  Output: void
  let session = driver.session();
let tx = session.beginTransaction();
  let ps = req.headers;
  ps.uid = req.decoded.uuid;

  validator.uuid(ps.note_uuid, "ps.note_uuid")
  .then(()=> miscellaneous.access2Note(tx, ps.uid, ps.note_uuid))

  .then(() => this.deleteRecall(tx, ps.note_uuid) )

  .then(() => utils.commit(session, tx, res, ps.uid) )
  .catch(err =>{console.log(err); utils.fail(session, {status: err.status || 400, mess: err.mess || 'recall/delete-recall.ctrl.js/main'}, res, tx)} )
};
