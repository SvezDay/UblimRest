"use-strict";
const express = require('express');

module.exports.routes = () => {
    let routes = express.Router();
    routes

    // ADMIN
        .post('/admin/add-dico', require('./modules/admin/add-dico.ctrl').main)
        // USER
        .get('/user/get-profile', require('./modules/user/get-profile').main)
        .post('/user/registration', require('./modules/user/registration').main)
        .delete('/user/delete-account', require('./modules/user/delete-account.ctrl').main)
        // TESTS

        // DOCUMENTATION

        // Models defined
        .get('/model-defined/read', require('./modules/model-defined/read.ctrl').main)
        // DOCUMENT
        .post('/document/create-document', require('./modules/document/create-document.ctrl').main)
        .post('/document/create-note', require('./modules/document/create-note.ctrl').main)
        .get('/document/get-main', require('./modules/document/get-main.ctrl').main)
        .get('/document/read-document', require('./modules/document/read-document.ctrl').main)
        .get('/document/read-extend-document', require('./modules/document/read-extend-document.ctrl').main)
        .put('/document/update-title', require('./modules/document/update-title.ctrl').main)
        .put('/document/update-note-label', require('./modules/document/update-note-label.ctrl').main)
        .delete('/document/delete-document-recursively', require('./modules/document/delete-document-recursively.ctrl').main)
        .delete('/document/delete-document', require('./modules/document/delete-document.ctrl').main)
        .delete('/document/delete-note', require('./modules/document/delete-note.ctrl').main)
        // ACTIVITY
        .get('/activity/get-main', require('./modules/activity/get-main.ctrl').main)
        .post('/activity/create-activity', require('./modules/activity/create-activity.ctrl').main)
        .post('/activity/create-event', require('./modules/activity/create-event.ctrl').main)
        // FREE
        .post('/free/graph-detail', require('./modules/free/read-graph-detail.ctrl').main)
        .post('/free/create-note', require('./modules/free/create-note.ctrl').main)
        .put('/free/update-note-value', require('./modules/free/update-note-value.ctrl').main)
        // .put('/free/update-note-label', require('./free/update-note-label.ctrl').main)
        .put('/free/update-order', require('./modules/free/update-order.ctrl').main)
        .delete('/free/delete-graph', require('./modules/free/delete-graph.ctrl').main)
        .delete('/free/delete-graph-and-descendant', require('./modules/free/delete-graph-and-descendant.ctrl').main)
        // .delete('/free/delete-note', require('./free/delete-note.ctrl').main) // Redirect to document/delete-note
        // DICO
        .post('/dico/create-item', require('./modules/dico/create-item.ctrl').main)
        .post('/dico/create-traduction', require('./modules/dico/create-traduction.ctrl').main)
        .post('/dico/create-definition', require('./modules/dico/create-definition.ctrl').main)
        .delete('/dico/delete-dico', require('./modules/dico/delete-dico.ctrl').main)
        .delete('/dico/delete-item', require('./modules/dico/delete-item.ctrl').main)
        .delete('/dico/delete-traduction', require('./modules/dico/delete-traduction.ctrl').main)
        .delete('/dico/delete-definition', require('./modules/dico/delete-definition.ctrl').main)
        .get('/dico/read-extend-head-graph', require('./modules/dico/read-extend-head-graph.ctrl').main)
        .get('/dico/read-extend-column-graph', require('./modules/dico/read-extend-column-graph.ctrl').main)
        .put('/dico/update-traduction-value', require('./modules/dico/update-value.ctrl').main)
        .put('/dico/update-traduction-label', require('./modules/dico/update-label.ctrl').main)
        .put('/dico/update-definition', require('./modules/dico/update-definition.ctrl').main)
        // TREE
        .post('/tree/move', require('./modules/tree/move.ctrl').main)
        .get('/tree', require('./modules/tree/tree.ctrl').main)

        // GAME
        .get('/games/suspended', require('./modules/games/get-suspended.ctrl').main)
        .put('/games/update-brut-data', require('./modules/games/update-brut-data.ctrl').main)
        // GAME - RECALL
        .post('/recall/create-index-recall', require('./modules/games/recall/create-index-recall.ctrl').main)
        .post('/recall/create-recall', require('./modules/games/recall/create-recall.ctrl').main)
        .get('/recall/main-list', require('./modules/games/recall/main-list.ctrl').main)
        .get('/recall/run', require('./modules/games/recall/run.ctrl').main)
        .get('/recall/suspended-recall-list', require('./modules/games/recall/suspended-recall-list.ctrl').main)
        .put('/recall/update-recallable-state', require('./modules/games/recall/update-recallable-state.ctrl').main)
        .put('/recall/update-recall', require('./modules/games/recall/update-recall.ctrl').main)
        .put('/recall/scoring', require('./modules/games/recall/scoring.ctrl').main)
        .put('/recall/update-status-recall', require('./modules/games/recall/update-status-recall.ctrl').main)
        .put('/recall/update-recallable-state', require('./modules/games/recall/update-recallable-state.ctrl').main)
        .put('/recall/update-index-recall-next-deadline', require('./modules/games/recall/update-index-recall-next-deadline.ctrl').main)
        .delete('/recall/delete-index-recall', require('./modules/games/recall/delete-index-recall.ctrl').main)
        .delete('/recall/delete-recall', require('./modules/games/recall/delete-recall.ctrl').main)
    // GAME RECALL ONE
    // .post('/games-recall-one/scoring/win', require('./games-recall-one/scoring.ctrl').win)
    // .post('/games-recall-one/scoring/lose', require('./games-recall-one/scoring.ctrl').lose)
    // .get('/games-recall-one/update-recall', require('./games-recall-one/update-recall.ctrl').main)
    // .get('/games-recall-one/run', require('./games-recall-one/run.ctrl').main)
    // .put('/games-recall-one/status', require('./games-recall-one/status.ctrl').main)
    // .put('/games-recall-one/recallStatus', require('./games-recall-one/status.ctrl').recallStatus)

    return routes;
};
