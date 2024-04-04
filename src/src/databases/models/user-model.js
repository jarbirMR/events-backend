const { connectCommonDB } = require("../common");
class UserModel {
    constructor(db) {
      this._db = db;
    }

    findById = async (id_user = "") => {
      try {
        const db = this._db || (await connectCommonDB());
        const user = await db
          .select("*")
          .from("events_users")
          .where("id_user", id_user)
          .first();
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
  
    findByEmail = async (email = "") => {
      try {
        const db = this._db || (await connectCommonDB());
        const user = await db
          .select("*")
          .from("events_users")
          .where("ev_email", email)
          .first();
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    findByPass = async (password = "") => {
      try {
        const db = this._db || (await connectCommonDB());
        const user = await db
          .select("*")
          .from("events_users")
          .where("ev_password", password)
          .first();
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    updateColumnByUserId = async (id, data) => {
      try {
        const db = this._db || (await connectCommonDB());
        const updatedRows = await db
          .from("events_users")
          .where("id_user", id)
          .update(data);
        return updatedRows;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    


    registerUser = async(users)=> {
      try{
        const db = this._db || (await connectCommonDB());
        const [id_user] = await db.insert({
          ev_name: users.ev_name,
          ev_surname: users.ev_surname,
          ev_email: users.ev_email,
          ev_password: users.ev_password
        }, ["id_user"])
        .into("events_users")
        return id_user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    listUsers = async () => {
      try {
        const db = this._db || (await connectCommonDB());
        const listUsers = await db.select([
          "id_user",
          "ev_name",
          "ev_surname",
          "ev_email"
        ]).from("events_users");
        return listUsers;
      }catch (error) {
        console.error(error);
        throw error;
      }
    }
}

module.exports = UserModel;