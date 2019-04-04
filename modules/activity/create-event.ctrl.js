'use-strict';
// CONFIG ----------------------------------------------------------------------
const tokenGen = require('../../services/token.service');
const driver = require('path').join(__dirname, '_graphenedb');
// LIB ---------------------------------------------------------------------
const parser = require('parse-neo4j');
// SERVICES --------------------------------------------------------------------
const utils = require('../../services/utils.service');
const validator = require('../../services/validator.service');
const miscellaneous = require('../../services/miscellaneous.request');
// REQUEST ---------------------------------------------------------------------
// COMMON ----------------------------------------------------------------------
const commonData = require('../../models/common.data');
// CONTROLLER ------------------------------------------------------------------


module.exports.createEvent = (tx, parent_uuid) => {
    // Create and Return an event
    return new Promise((resolve, reject) => {
        let now = new Date().getTime();

        let query = `
      MATCH (parent{uuid:$parent_uuid})
      CREATE (e:Event{uuid:apoc.create.uuid(), code_label:2.1, value:''})
      CREATE (parent)-[:Has]->(e)
      RETURN {event:{uuid:e.uuid, code_label:e.code_label, value:e.value}} `;

        // console.log('model_documentation', model_documentation)
        // console.log("query", query)
        tx.run(query, {parent_uuid: parent_uuid}).then(parser.parse)
        // .then(result=>{console.log(result); return result; })
            .then(result => resolve(result[0]))
            .catch(err => {
                console.log(err);
                reject({status: err.status || 400, mess: err.mess || 'activity/create-event.ctrl.js/createEvent'});
            })
    })
}

module.exports.main = (req, res, next) => {
    // Return an event
    let ps = req.body;
    let session = driver.session();
    let tx = session.beginTransaction();
    ps.uid = req.decoded.uuid;
    // console.log('ps', ps)

    validator.uuid(ps.parent_uuid, 'ps.parent_uuid')
        .then(() => miscellaneous.access2Any(tx, ps.uid, ps.parent_uuid))
        .then(() => this.createEvent(tx, ps.parent_uuid))
        .then(data => utils.commit(session, tx, res, ps.uid, data))
        .catch(err => {
            console.log(err);
            utils.fail(session, {
                status: err.status || 400,
                mess: err.mess || 'activity/create-event.ctrl.js/main'
            }, res, tx)
        })

};
