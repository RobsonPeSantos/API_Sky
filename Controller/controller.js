const user = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../Config/config");

//Funçoes Auxiliares
function createUserToken(email) {
  return jwt.sign({ email: email }, config.jwt_password, {
    expiresIn: config.jwt_expires_in,
  });
}
//--------------------------------------------------------------------------------------------
exports.signUp = async (req, res) => {
  const { nome, email, senha, telefones } = req.body;
  // verificar se ja tem todos dados suficiente
  if (!nome || !email || !senha || !telefones)
    return res.status(400).send({ message: "Dados insuficiente" });
  try {
    // verificar se tem usuario ja cadastrado
    if (await user.findOne({ email }))
      return res.status(400).send({ message: "E-mail já existente" });

    //criação das datas
    const dateInformation = {
      creationDate: new Date(),
      updateDate: new Date(),
      lastLoginDate: new Date(),
    };
    //criação do token
    const tokenInformation = {
      accessToken: createUserToken(email),
    };

    // criação do usuario
    const data = await user.create({
      ...req.body,
      dateInformation,
      ...tokenInformation,
    });

    // retorno do sucesso
    return res.status(201).send({
      message: "Usuário cadastrado com sucesso",
      id: data._id,
      usuário: data.email,
      data_criacao: data.dateInformation.creationDate,
      data_atualizacao: data.dateInformation.updateDate,
      ultimo_login: data.dateInformation.lastLoginDate,
      token: data.accessToken,
    });
  } catch (err) {
    return res.status(500).send({ message: "erro no api " + err });
  }
};
//--------------------------------------------------------------------------------------------
exports.signIn = async (req, res) => {
  const { email, senha } = req.body;
  // verificar se ja tem todos dados suficiente
  if (!email || !senha)
    return res.status(400).send({ message: "Dados insuficiente!" });
  try {
    // verificar se o usuario ja ta cadastrado
    let data = await user.findOne({ email });
    if (!data)
      return res.status(400).send({ message: "Usuário e/ou senha inválidos" });

    // validar a senha
    const senha_ok = await bcrypt.compare(senha, data.senha);
    if (!senha_ok)
      return res.status(401).send({ message: "Usuário e/ou senha inválidos" });

    // alterar ultimo login
    const dateInformation = data.dateInformation;
    await user.updateOne(
      { email: email },
      {
        dateInformation: {
          creationDate: dateInformation.creationDate,
          updateDate: dateInformation.updateDate,
          lastLoginDate: new Date(),
        },
      }
    );
    // alterar token
    await user.updateOne(
      { email: email },
      { accessToken: createUserToken(email) }
    );

    data = await user.findOne({ email });

    // retorno do sucesso
    return res.status(200).send({
      message: "Usuário logado com sucesso",
      id: data._id,
      usuário: data.email,
      data_criacao: data.dateInformation.creationDate,
      data_atualizacao: data.dateInformation.updateDate,
      ultimo_login: data.dateInformation.lastLoginDate,
      token: data.accessToken,
    });
  } catch (err) {
    return res.status(500).send({ message: "erro no api " + err });
  }
};
//--------------------------------------------------------------------------------------------
exports.findUser = async (req, res) => {
  try {
    //procurar o usuario
    const data = await user.findOne({ _id: req.query.id });
    // verificar se existe o usuario
    if (data.length == 0)
      return res.status(404).send({ message: "Usuário inexistente!" });
    // verificar se é o msm token
    if (data.accessToken != req.headers.authorization.replace("Bearer ", "")) {
      return res.status(401).send({ error: "Não autorizado" });
    }
    // verificar se ja passou 30 min
    const dt = new Date();
    dt.setMinutes(dt.getMinutes() - 30);
    if (data.dateInformation.lastLoginDate.getTime() < dt.getTime()) {
      return res.status(401).send({ error: "Sessão inválida" });
    }
    // retorno do sucesso
    return res.status(200).send({ usuário: data.email });
  } catch (err) {
    return res.status(500).send({ message: "erro no api " + err });
  }
};
