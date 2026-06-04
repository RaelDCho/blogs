require('dotenv').config()
const { QueryTypes, Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres'
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('success authentication sequelize')
    const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT })
    console.log(blogs)
    sequelize.close()
  } catch(error) {
    console.log('unable to connect to the database', error)
  }
}

main()