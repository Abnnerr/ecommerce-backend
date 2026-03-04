const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/env");

function rotaProtegida(req, res, next) {
    let token = req.headers.authorization;
    // if (!token) {
    //     return res.status(401).send({
    //         mensagem: "Token é obrigatório"
    //     });
    //     // return;
    // } else {
    //     token = token.split(" ")[1];
    //     // token = jwt.sign({ foo: 'bar' }, process.env.SEGREDO);
    //     // console.log(token);
        
    //     jwt.verify(token, jwtSecret, function (err, decoded) {
    //         if (err) {
    //             res.status(401).send({
    //                 mensagem: "Token inválido"
    //             });
    //             return;
                
    //         }
    //         next();
    //     });
    // }
        if (!token) {
        return res.status(401).json({ mensagem: "Token é obrigatório" });
    }
    
    token = token.split(" ")[1];
    
    jwt.verify(token, jwtSecret, function (err, decoded) {
        if (err) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        
        req.usuarioId = decoded.id;
        req.usuario = decoded;
        
        next();
    });

}

module.exports = { rotaProtegida };