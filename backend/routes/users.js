const router = require('express').Router();
let User = require('../models/user.model');
const calendar = require('../utils/calendar');

router.route("/login").post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.find({
        username: username
    })
        .then(users => {
            if (users.length < 1) {
                return res.status(400).json("User doesnt exist");
            }
            const user = users[0];
            if (!user.validPassword(password)) {
                return res.status(400).json("Wrong password");
            }

            return res.send({
                success: true,
                user: users[0]
            });

        })
        .catch(err => {
            return res.status(400).json("Error: " + err);
        });
});

router.route('/register').post(async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    let number = 0;
    let unique = false;

    while (!unique) {
        number = (Math.round(Math.random() * 1000000));
        await User.find({
            number: number
        }).then((users) => {
            if (users.length === 0) {
                unique = true;
            }
        })
    }

    User.find({
        username: username
    }).then(users => {
        if (users.length > 0) {
            return res.status(400).json("Username is already used");
        }

        const newUser = new User();
        newUser.username = username;
        newUser.password = newUser.generateHash(password);
        newUser.number = number;
        newUser.connection_key = '';


        newUser.save()
            .then(() => {
                return res.send({
                    success: true,
                    message: "User added"
                });
            }).catch(err => res.status(400).json("Error: " + err));
    }).catch(err => res.status(400).json("Error: " + err));
})


router.route('/uploadPhoto/:id').post((req, res) => {
    User.findById(req.params.id)
        .then(user => {

            const id = user.id;

            user.connection_key = id.substring(id.length - 4).toUpperCase();
            user.photo = req.body.url;

            user.save()
                .then((user) => res.json(user))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
})


router.route('/code').post((req, res) => {

    const code = req.body.code;
    const user = req.body.user;

    calendar.getToken(code).then((token) => {
        User.findById(user._id).then((user) => {
            user.token = JSON.stringify(token);
            user.save()
                .then((user) => res.json(user))
                .catch(err => res.status(400).json('Error: ' + err));
        })
    });
})

router.route("/getEvents").post((req, res) => {

    const token = req.body.token;
    calendar.getEvents(token).then((events) => {
        res.json(events)
    })
});

router.route("/verify").post((req, res) => {

    const number = req.body.number;
    const connection_key = req.body.connection_key;

    User.find({
        number: number,
        connection_key: connection_key
    })
        .then(users => {
            if (users.length < 1) {
                return res.status(400).json("User doesnt exist");
            }
            return res.send({
                success: true,
                user: users[0]
            });
        })
        .catch(err => {
            return res.status(400).json("Error: " + err);
        });
});




module.exports = router;