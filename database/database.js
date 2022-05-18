const Sequelize = require('sequelize');

const connection = new Sequelize(
    'guiaperguntas',
    'root',
    'ma020490@', 
{
    host: 'localhost',  ///na onde ele vai rodar
    dialect: 'mysql',   /// qual banco de dados ele vai usar
});

module.exports = connection;