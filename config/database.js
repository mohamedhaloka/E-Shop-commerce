
const mongoose = require('mongoose');


const dbConnection = () => {
  const dbUrl = process.env.DB_URI;

  mongoose.connect(`${dbUrl}`).then((connection) => {
    console.log(`Database created ${connection}`)
  });
}

module.exports = dbConnection;