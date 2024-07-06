const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/dbconfig.js');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

// Define the Book model
const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  availability: {
    type: DataTypes.STRING,
    defaultValue: 'In Stock'
  }
}, {
  // Add this option to let Sequelize handle the 'id' column automatically
  timestamps: false,
  // Specify the table name if it's different from the model name
  tableName: 'books'
});

// ... rest of your code

module.exports = { sequelize, Book };
