const express = require('express');
const mysql = require('mysql');
const cors = require('cors');



const app = express();

app.use(cors());
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'mmi_trombi',
});

app.post ('/login', (req, res) => {
    const sql = "SELECT * FROM users where email = ? and password = ?";
    const values = [req.body.email, req.body.password];
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
