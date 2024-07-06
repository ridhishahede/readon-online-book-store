module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'Ridhisha29@', // Provide your MySQL password here
    DB: 'bookstore',
    dialect: 'mysql',
    operators: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
  };
  