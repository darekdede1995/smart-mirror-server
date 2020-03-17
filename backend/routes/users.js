const router = require('express').Router();
let User = require('../models/user.model');

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
    const uploaded_photo = false;
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
        newUser.uploaded_photo = uploaded_photo;

        newUser.save()
            .then(() => {
                return res.send({
                    success: true,
                    message: "User added"
                });
            }).catch(err => res.status(400).json("Error: " + err));
    }).catch(err => res.status(400).json("Error: " + err));
})

module.exports = router;