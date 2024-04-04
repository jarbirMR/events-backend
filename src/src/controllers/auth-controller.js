const { response, request } = require("express");
const CustomError = require("../config/errors");
const UserModel = require("../databases/models/user-model");
const { sendRecoveryCode } = require("../emails/recovery");
const JWT = require("../config/jwt");
const { sendEmailCode } = require("../emails/register");
const Encrypter = require("../config/encryptor");


class AuthController {
  static #handleError = (error, res = response) => {
    if (error instanceof CustomError) {
      return res
        .status(error.statusCode)
        .json({ status: false, data: null, error: error.message });
    }
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: null, error: "Internal Server Error" });
  };

  static register = async (req = request, res = response) => {
    try {
      let { ev_name, ev_surname, ev_email}= req.body;
      let {ev_password} = req.body;
      const data = req.body;
      const userModel = new UserModel();
      const newPassword = Encrypter.hash(ev_password)
      data.ev_password = newPassword;
      const user1 = await userModel.findByEmail(ev_email);
      if (user1)
      throw CustomError.notFound("El correo ya se encuentra en la bd, ingresa otro");
      const user = await userModel.registerUser(data);
      const sendEmail = await sendEmailCode(ev_name, ev_surname, ev_email);
      if (!sendEmail)
        throw CustomError.notFound(
          "An error occurred while sending the recovery email"
        );

      


      return res.status(200).json({
        status: true,
        data: user, user1,
        error: null,
      });
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  static loginversion = async (req = request, res = response) => {
    try {
      let { ev_email, password } = req.body;
      const userModel = new UserModel();
      const user = await userModel.findByEmail(ev_email);
      
      if (!user) throw CustomError.notFound("User not exist");
      const { ev_password} = user;
     
      const isValidPassword = Encrypter.compare(password, ev_password);
     if (!isValidPassword)
        throw CustomError.unauthorized("Password is not valid");
      
      
      
      const token = await JWT.generateToken({
        email: user.ev_email

      });


      return res.status(200).json({
        status: true,
        data: {
          token,
          user: {


            email: user.ev_email,


          },
        },
        

        error: null,
      });

    } catch (error) {
      this.#handleError(error, res);
    }
  };

  static recovery = async (req = request, res = response) => {
    try {
      let { ev_email } = req.body;
      const userModel = new UserModel();
      const user = await userModel.findByEmail(ev_email);
      if (!user) throw CustomError.notFound("User not exist");
      const code = Math.floor(Math.random() * 500000) + 100000;
      await userModel.updateColumnByUserId(user.id_user, { ev_code: code });
      const sendEmail = await sendRecoveryCode(ev_email, code);
      if (!sendEmail)
        throw CustomError.notFound(
          "An error occurred while sending the recovery email"
        );
        
      return res.status(200).json({
        status: true,
        data: null,
        error: null,
      });


    } catch (error) {
      this.#handleError(error, res);
    }
  }

  static validateCode = async (req = request, res = response) => {
    try {
      let {email, code} = req.body;
      const userModel = new UserModel();
      const user = await userModel.findByEmail(email);
      if(!user) throw CustomError.notFound("User not exist");
      if (user.ev_code !== code)
      throw CustomError.unauthorized("Code is not valid");
      return res.status(200).json({
        status: true,
        data: null,
        error: null,
      });
    }catch (error) {
      this.#handleError(error, res);
    }
  };

  
}

module.exports = AuthController;