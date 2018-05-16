const pg = require('pg-promise')();

const builder = process.env.USER
const dbconfig = {
        host: 'localhost',
        port: 5432,
        database: 'tripful',
        user: builder,
        password: 'digitalcrafts'
    }
    //const db = pg(dbconfig);
const db = pg(process.env.DATABASE_URL);

let findUser = (attribute, input) => {
    return db.query(`SELECT * FROM users WHERE ${attribute} = '${input}';`)
};

let getUserById = (id) => {
    return db.query(`SELECT * FROM users WHERE id = ${id};`)
};

let getAllUsers = () => {
    return db.query("SELECT id, username, location, email FROM users;")
};

let insertUser = (username, password, location, email) => {
    let qstr = `INSERT INTO users (username, password, location, email) 
                    VALUES ('${username}', '${password}', '${location}', '${email}'); `;
    console.log(qstr);
    return db.query(qstr);
};

let getAllTrips = (id) => {
    return db.query(`SELECT * FROM trips where userid = ${id};`)
};

let insertTrip = (userid, name, source, destination, startdate, enddate, description, plans) => {
    let qstr = `INSERT INTO trips (userid, name, source, destination, startdate, enddate, description, plans)
        VALUES ('${userid}', '${name}', '${source}', '${destination}', '${startdate}', '${enddate}', '${description}', '${plans}');`;
    console.log(qstr);
    return db.query(qstr);
};

module.exports = {
    findUser,
    getUserById,
    getAllUsers,
    insertUser,
    getAllTrips,
    insertTrip
};