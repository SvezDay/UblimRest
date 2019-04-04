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

module.exports.deleteIndexRecall = (tx, idx_uuid)=>{ // Input: idx_uuid  |  Output:  void
  return new Promise((resolve, reject)=>{
    console.log("deleteIndexRecall", idx_uuid)
    let one = `
      MATCH (ir:IndexRecall{idx_uuid:$idx_uuid})
      OPTIONAL MATCH (ir)-[]->(rs:Recall)
      DETACH DELETE ir, rs
    `;
    return tx.run(one, {idx_uuid:idx_uuid})
    .then(() => resolve() )
    .catch(err =>{console.log(err); reject({status: err.status || 400, mess: err.mess || 'recall/delete-index-recall.ctrl.js/main'}, res, tx)} )
  })
}

module.exports.main = (req, res, next)=>{ // Input: idx_uuid  |  Output: void
  let session = driver.session();
let tx = session.beginTransaction();
  let ps = req.headers;
  ps.uid = req.decoded.uuid;

  validator.uuid(ps.idx_uuid, "ps.idx_uuid")
  .then(()=> miscellaneous.access2Any(tx, ps.uid, ps.idx_uuid))

  .then(() => this.deleteIndexRecall(tx, ps.idx_uuid) )

  .then(() => utils.commit(session, tx, res, ps.uid) )
  .catch(err =>{console.log(err); utils.fail(session, {status: err.status || 400, mess: err.mess || 'recall/delete-index-recall.ctrl.js/main'}, res, tx)} )
};
