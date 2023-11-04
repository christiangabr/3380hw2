const {Client} = require('pg')

const client = new Client({
    host: 'localhost',
    user: 'team10',
    port: 5432,
    password: 'UsoZ101852',
    database: 'postgres'
})

client.connect();

client.query('SELECT * FROM users', (err, res) => {
    if (!err) {
        console.log(res.rows);
    }
    else {
        console.log(err.message);
    }
    client.end;
})

