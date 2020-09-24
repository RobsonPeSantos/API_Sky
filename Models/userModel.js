const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const TelefonesSchema = new Schema(
  {
    numero: {
      type: String,
    },
    ddd: {
      type: String,
    },
  },
  { _id: false }
);

const DateInformationSchema = new Schema(
  {
    creationDate: {
      type: Date,
    },
    updateDate: {
      type: Date,
    },
    lastLoginDate: {
      type: Date,
    },
  },
  { _id: false }
);

const UserSchema = new Schema({
  nome: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  senha: {
    type: String,
    required: true,
  },
  telefones: {
    type: [TelefonesSchema],
    required: true,
  },
  dateInformation: {
    type: DateInformationSchema,
  },
  accessToken: {
    type: String,
  },
});

UserSchema.pre("save", async function (next) {
  let user = this;
  user.senha = await bcrypt.hash(user.senha, 10);
  return next();
});

module.exports = mongoose.model("User", UserSchema);
