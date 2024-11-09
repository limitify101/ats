"use strict";
import fs from "fs";
import path from "path";
import process from "process";
import { Sequelize, DataTypes } from "sequelize";
const basename = path.basename(import.meta.url);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const env = process.env.NODE_ENV || "development";
const config = await import(path.join(__dirname, "/../config/config.js")).then(
  (module) => module[env]
);
const db: any = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".ts" &&
      file.indexOf(".test.ts") === -1
    );
  })
  .forEach(async (file: any) => {
    const model = await import(path.join(__dirname, file));
    db[model.default.name] = model.default(sequelize, DataTypes);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
