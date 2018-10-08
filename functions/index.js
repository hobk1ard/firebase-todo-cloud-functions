'use strict';

const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const serviceAccount = require("./elementary-firebase-adminsdk-key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://elementary-336ee.firebaseio.com'
});

const express = require('express');
const toDoApp = express();
const cors = require('cors');

// Automatically allow cross-origin requests
toDoApp.use(cors({
    origin: true
}));

toDoApp.get('/', (req, res) => {
    const uid = req.header("uid").trim();
    console.log("toDo get '" + uid + "'");
    if (!uid) {
        return res.status(401).json({
            message: 'Not allowed. Please provide uid.'
        })
    }
    return admin.database().ref(('/todos/' + uid)).once('value').then((snap) => {
        console.log(snap.val());
        return res.status(200).json({ todos: snap.val() });
    }).catch((error) => {
        return res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
        })
    });
});

toDoApp.delete('/', (req, res) => {
    const uid = req.header("uid").trim();
    const toDoId = req.header("toDoId").trim();
    console.log("toDo delete '" + uid + "/" + toDoId);
    if (!uid || !toDoId) {
        return res.status(401).json({
            message: 'Not allowed. Please provide uid and toDoId.'
        });
    }
    return admin.database().ref(`/todos/${uid}/${toDoId}`).remove().then(() => {
        console.log(Removed);
        return res.status(200).json({
            message: 'Removed'
        });
    }).catch((error) => {
        return res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
        });
    });
});
//toDoApp.post('/:uid', (req, res) => res.send(toDo.create(req.params.uid)));
//toDoApp.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));
//toDoApp.delete('/:uid:toDoId', (req, res) => res.send(toDo.delete(req.params.uid, req.params.toDoId)));
//toDoApp.get('/', (req, res) => res.send(res.status(200).send('An error occurred')));

// Expose Express API as a single Cloud Function:
const toDo = functions.https.onRequest(toDoApp);

module.exports = {
    toDo
};