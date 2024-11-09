const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('users.json', (err, data) => {
        if (err) throw err;

        const users = JSON.parse(data);

        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            res.send(`Welcome ${username}`);
        } else {
            res.send('Invalid username or password');
        }
    });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('users.json', (err, data) => {
        if (err) throw err;

        const users = JSON.parse(data);

        if (users.find(user => user.username === username)) {
            return res.send('Username already exists');
        }

        users.push({ username, password });

        fs.writeFile('/public/database.json', JSON.stringify(users), err => {
            if (err) throw err;

            res.send('User registered successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
