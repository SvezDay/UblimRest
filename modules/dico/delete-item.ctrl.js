'use-strict';
// CONFIG ----------------------------------------------------------------------
const tokenGen = require('../../services/token.service');
const driver = require('path').join(__dirname, '_graphenedb');
// LIB ---------------------------------------------------------------------
const parser = require('parse-neo4j');
// SERVICES --------------------------------------------------------------------
const utils = require('../../services/utils.service');
const validator = require('../../services/validator.service');
// REQUEST ---------------------------------------------------------------------
const miscellaneousReq = require('../../services/miscellaneous.request');
const descendantReq = require('../../services/descendant.request');
// COMMON ----------------------------------------------------------------------
const commonData = require('../../models/common.data');
// CONTROLLERS -----------------------------------------------------------------


/*
* Input: tx, delete_uuid
* Output: {result:true}
*/
module.exports.deleteItem = (tx, delete_uuid) => {
    // DELETE DOC CONTAINER TITLE NODES
    return new Promise((resolve, reject) => {
        let query = `
      MATCH (n:Note{uuid:$delete_uuid})
      OPTIONAL MATCH (n)-[*]->(ns)
      DETACH DELETE n, ns
      `;
        return tx.run(query, {delete_uuid: delete_uuid})
            .then(() => {
                resolve()
            })
            .catch(err => {
                console.log(err);
                reject({status: err.status || 400, mess: err.mess || '_dico/delete-item.ctrl.js/deleteItem'});
            })
    })
}

/*
* Input: delete_uuid
* Output: true
*/
module.exports.main = (req, res, next) => {
    let ps = req.headers;
    let tx = driver.session().beginTransaction();
    ps.uid = req.decoded.uuid;
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! delete item ps',ps)

    validator.uuid(ps.delete_uuid)
        .then(() => miscellaneousReq.access2Note(tx, ps.uid, ps.delete_uuid))

        .then(() => this.deleteItem(tx, ps.delete_uuid))

        .then(() => utils.commit(session, tx, res, ps.uid))
        .catch(err => {
            console.log(err);
            utils.fail(session, {status: err.status || 400, mess: err.mess || 'dico/delete-item.ctrl.js/main'}, res, tx)
        })

};
