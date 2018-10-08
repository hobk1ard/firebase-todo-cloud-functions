const functions = require('firebase-functions');
const cors = require("cors");
const express = require('express');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const serviceAccount = require("./elementary-firebase-adminsdk-key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://elementary-336ee.firebaseio.com'
});

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// exports.ToDo = functions.https.onRequest((req, res) => {
//     cors(req, res, () => {
//         // Grab the text parameter.
//         const queryText = req.query.text;

//         switch (req.method) {
//             case "POST":
//                 return admin.database().ref('/todos/' + queryText.uid).push({ title: queryText.title }).then((snapshot) => {
//                     return res.status(200).json({ todo: snapshot.val() });
//                 });
//             case "GET":
//                 return admin.database().ref(('/todos/' + queryText.uid)).once('value').then(function (snap) {
//                     return res.status(200).json({ todos: snap.val() });
//                 });
//             case "PUT":
//             default:
//                 return res.status(401);
//         }
//     })
// });

const toDoApp = express();
const toDo = {
    getByUID(uid) {
        return admin.database().ref(('/todos/' + uid)).once('value').then(function (snap) {
            console.log(snap.val());
            return res.status(200).json({ todos: snap.val() });
        }).catch(() => {
            return res.status(200);
        });
    },

    create(uid) {

    },

    delete(uid, toDoId) {

    }
};

// Automatically allow cross-origin requests
toDoApp.use(cors({ origin: true }));
// build multiple CRUD interfaces:
toDoApp.get('/:uid', (req, res) => {
    console.log("toDoApp.get " + req.params.uid)
    res.send(toDo.getByUID(req.params.uid));
});
toDoApp.post('/:uid', (req, res) => res.send(toDo.create(req.params.uid)));
//toDoApp.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));
toDoApp.delete('/:uid:toDoId', (req, res) => res.send(toDo.delete(req.params.uid, req.params.toDoId)));
toDoApp.get('/', (req, res) => res.send(res.status(200).send('An error occurred')));

// Expose Express API as a single Cloud Function:
exports.toDo = functions.https.onRequest(toDoApp);

