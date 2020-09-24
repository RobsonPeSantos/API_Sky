/* eslint-disable no-undef */
const env = process.env.NODE_ENV || "dev";

const config = () => {
  switch (env) {
    case "dev": {
      return {
        environment: "dev",
        bd_url:
          "mongodb+srv://admin:admin@api-hsdbr.mongodb.net/test?retryWrites=true&w=majority",
        jwt_password: "sky2019",
        jwt_expires_in: "1h",
      };
    }
  }
};

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`);

module.exports = config();
