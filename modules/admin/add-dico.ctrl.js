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
const graphReq = require('../../services/graph.request');
const miscellaneousReq = require('../../services/miscellaneous.request');
// COMMON ----------------------------------------------------------------------
const commonData = require('../../models/common.data');
// CONTROLLER ------------------------------------------------------------------
// const root = require('./get-main.ctrl');

/*
* Input:
* Output: void
*/
module.exports.addDico = (tx, uid) => {
    return new Promise((resolve, reject) => {
        let file = require('./dico.data.js');
        let data = file.data
        let dico_uuid = file.dico_uuid;

        let one = ` MATCH (idx:Index{uuid:$dico_uuid})-[]->(t:Title) `;
        let two = "";
        for (var i = 0; i < data.length; i++) {
            two += `
        CREATE (item${i}:Note{uuid:apoc.create.uuid(), value: "${data[i].item}", code_label:8.1})
        CREATE (trad${i}:Note{uuid:apoc.create.uuid(), value: "${data[i].trad}", code_label:8.2})
        CREATE (t)-[:Has]->(item${i})-[:Has]->(trad${i})
      `;
        }

        return tx.run(one + two, {uid: uid, dico_uuid: dico_uuid})
        // .then(data => {console.log(data); return data; })
            .then(data => resolve(data[0]))
            .catch(err => {
                console.log(err);
                reject({status: err.status || 400, mess: err.mess || 'model-defined/create.ctrl.js/createModel'});
            })
    })
}
/*
* Input:
* Output: headGraph
*/
module.exports.main = (req, res, next) => {
    let ps = req.body;
    let session = driver.session();
    let tx = session.beginTransaction();
    ps.uid = req.decoded.uuid;

    this.addDico(tx, ps.uid)
        .then(() => utils.commit(session, tx, res, ps.uid))
        .catch(err => {
            console.log(err);
            utils.fail(session, {
                status: err.status || 400,
                mess: err.mess || 'document/create-document.ctr.js/main'
            }, res, tx)
        })
};
