const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./config')

const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  // ssl not working
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorised: false
  //   }
  // }
})

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations are up to date', {
    files: migrations.map(migration => migration.name)
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('Successfully connected to the database.')
  } catch(error) {
    console.log('Unsuccessful in connecting to the database')
    console.log(error)
    return process.exit(1)
  }
}

module.exports = { connectToDatabase, rollbackMigration, sequelize }