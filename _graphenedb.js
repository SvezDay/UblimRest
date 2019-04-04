'use-strict';
// Adding the Apoc procedures library at the end of neo4j conf/neo4j-conf
// dbms.security.procedures.whitelist=apoc.coll.*,apoc.load.*
// Then install the apoc plugin in neo4j/plugins
const neo4j = require('neo4j-driver').v1;
const dbdev = require('./_secret').graphene;
const url, usr, pwd;

if (process.env.NODE_ENV === 'dev') {
    url = dbdev.bolt;
    usr = dbdev.username;
    pwd = dbdev.password;
} else {
    url = process.env.GRAPHENEDB_BOLT_URL;
    usr = process.env.GRAPHENEDB_BOLT_USER;
    pwd = process.env.GRAPHENEDB_BOLT_PASSWORD;
}

const driver = neo4j.driver(url, neo4j.auth.basic(usr, pwd));

module.exports = driver;
