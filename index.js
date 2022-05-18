const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta');
const raw = require('body-parser/lib/types/raw');
const Resposta = require('./database/Resposta'); 

////DATABASE////
connection.authenticate()/// tentar logar no mysql, ele vai ter duas opções, conseguir ou não. 
.then(() => {
    console.log('Conexão feita com sucesso no banco de dados!'); /// se conseguir logar
}
).catch((err) => { // se não conseguir logar 
    console.log('Erro ao conectar com o banco de dados: ' + err);
});

 //// Body Parser - trazendo ele do express
app.use(bodyParser.urlencoded({ extended: false })); /// recebe os dados do formulário e traduz em uma estrutura javascript - decodificar
app.use(bodyParser.json()); /// dados d formulario json

///// Dizendo que quero usar o ejs como view engine 
app.set('view engine', 'ejs');
app.use(express.static('public'));


        /// Rotas
app.get('/', (req, res) => {
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']]}) //// busca todas as perguntas no banco de dados = select * from pergunta .. order sigf ordenar, sendo DESC= decrescente e ASC = crescente
    .then((pergunta) => {
        res.render('pages/index', { 
            pergunta: pergunta }); //// enviar para o ejs o objeto perguntas
    }
    ).catch((err) => {
        console.log('Erro ao buscar perguntas: ' + err);
    });
 
});

app.get("/perguntar", (req, res) => {
    res.render("pages/perguntar");/// quando tiver uma pasta dentro de um ejs, deve-se colocar o nome da pasta dentro do render, separando o ejs do nome da pasta com o /
}); 

app.post("/salvarPergunta", (req, res) => {
    var titulo = req.body.titulo; /// trouxe o nome do campo do formulário, criei uma variavel para receber o valor do campo, utilizando o bodyParser.nome q use no ejs
    var descricao = req.body.descricao;
    Pergunta.create({ /// criei uma variavel para salvar os dados no banco de dados, sendo que o create = "Insert into perguntas (titulo, descricao) values (titulo, descricao)"
        titulo: titulo, ///1° titulo vem do modelo, 2° titulo vem da variavel que recebeu do formulário. body.titulo, aqui na rota.
        descricao: descricao
    }).then (() => {
         res.redirect('/'); /// redireciona para a rota / poderia simplemente fazer um console.log('Pergunta salva com sucesso!');, porém tem essa opção em envia-lo a uma nova rota.
    }) .catch((err) => {
        console.log('Erro ao salvar pergunta: ' + err);
    }
    );
});
 
app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id; /// pego o id da rota e coloco na variavel id
    Pergunta.findOne({ /// findOne = busca somente um registro no banco  de dados, sendo que o findOne = "Select * from perguntas where id = id"
        where: /// onde o id q eu digitei na pergunta é igual ao id q esta no banco de dados
        {id: id}
    }) .then((pergunta) => {
        if(pergunta != undefined){ // Pergunta encontrada 
            Resposta.findAll({ // Tras a busca de todas as respostas da pergunta selecionada pelo pergunta.id
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            })
            .then((resposta) => {
                res.render('pages/pergunta', {
                pergunta: pergunta,
                resposta: resposta 
            });
            })
            }else{ // Pergunta não encontrada
            res.redirect('/');
        }
    }
    ).catch((err) => {
        console.log('Erro ao buscar pergunta: ' + err);
    }); 
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    })
    .then(() => {
        res.redirect('/pergunta/' + perguntaId);
    }
    ).catch((err) => {
        console.log('Erro ao responder pergunta: ' + err);
    });  
});


app.listen(4000, () => { console.log('Rodando na porta 4000!'); });

