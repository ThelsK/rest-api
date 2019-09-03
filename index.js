// ============================================================
// ========== Set up Database
// ============================================================

const Sequelize = require("sequelize")
const sequelize = new Sequelize(
  "postgres://postgres:secret@localhost:5432/postgres")

const User = sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
  }
})

const Task = sequelize.define("task", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

const createTables = () =>
  sequelize.sync()
    .then(() => console.log("Tables created successfully"))
    .catch(err => {
      console.error("Unable to create tables, shutting down:", err)
      process.exit(1)
    })

// ============================================================
// ========== Set up API
// ============================================================

const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = 3000
app.use(bodyParser.json())

const listen = () =>
  app.listen(port, () => console.log(`Listening on port ${port}`))

// ============================================================
// ========== Read Data
// ============================================================

// // Get a user's information
app.get("/users/:userId", (req, res, next) => {
  User.findOne({ where: { id: req.params.userId } })
    .then(user => {
      if (user) {
        res.json(user.get())
      } else {
        res.status(404).end()
      }
    })
})
// // Get all user's tasks
// app.get("/users/:userId/tasks", (req, res, next) => {/*..*/})
// // Get a single user task
// app.get("/users/:userId/tasks/:taskId", (req, res, next) => {/*..*/})

// ============================================================
// ========== Write Data
// ============================================================

app.post('/users', (req, res, next) => {
  User.create(req.body)
    .then(user => res.json(user))
    .catch(err => next(err))
})

// // Create a new user account
// app.post("/users", (req, res, next) => {/*..*/})
// // Update a user's information
// app.put("/users/:userId", (req, res, next) => {/*..*/})
// // Create a new task
// app.post("/users/:userId/tasks", (req, res, next) => {/*..*/})
// // Update an existing task
// app.put("/users/:userId/tasks/:taskId", (req, res, next) => {/*..*/})
// // Delete a user's task
// app.delete("/users/:userId/tasks/:taskId", (req, res, next) => {/*..*/})
// // Delete all user's tasks
// app.delete("/users/:userId/tasks", (req, res, next) => {/*..*/})

// ============================================================
// ========== Initialize
// ============================================================

createTables()
  .then(listen)