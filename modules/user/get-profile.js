'use-strict';
const parser = require('parse-neo4j');
const driver = require('path').join(__dirname, '_graphenedb');

module.exports.getProfile = (tx, decoded) => {
    return new Promise((resolve, reject) => {
        let q = `match (p:Person{uid:$uid}) return {first:p.first, last:p.last, email:p.email, photo:p.photo}`;

        return tx.run(q, {uid: decoded.uid}).then(parser.parse)
            .then(data => {
                if (!data.length) {
                    return require('./registration').graphRegistration(tx, decoded.uid, decoded.email, "first", "last");
                } else {
                    return data;
                }
            })
            .then(data => resolve(data[0]))
            .catch(err => {
                console.log(err);
                reject({status: err.status || 400, mess: err.mess || 'user/get-profile.js/getProfile'});
            })
    })
}

module.exports.main = (req, res, next) => {
    let session = driver.session();
    let tx = session.beginTransaction();
    let decoded = req.decoded;
    // let params = req.body;

    this.getProfile(tx, decoded)
        .then(data => require('../../services/graph-methods').success(session, tx, res, req.decoded.uid, data))
        .catch(err => {
            console.log(err);
            require('../../services/graph-methods').fail(session, {
                status: err.status || 400,
                mess: err.mess || 'user/get-profile.js/main'
            }, res, tx)
        })
}
