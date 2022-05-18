const Sequelize = require ('sequelize');
const connection = require('./database');

const Pergunta = connection.define('pergunta', {  /// nome da tabela
    titulo: {  /// nome do campo
        type: Sequelize.STRING, /// tipo do campo , string para textos curtos
        allowNull: false /// impode q o campo receba valores nulos
    } ,
    descricao: {
        type: Sequelize.TEXT, /// text = texto longo
        allowNull: false
    }
}
);

Pergunta.sync({ force: false }) /// sincroniza a tabela com o banco de dados, sem forcar a criação da tabela
.then(() => {
    console.log('');
}   
).catch((err) => {
    console.log('Erro ao criar a tabela: ' + err);
}
);

module.exports = Pergunta;
