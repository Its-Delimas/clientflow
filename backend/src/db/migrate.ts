import pool from '../config/db'

const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      company VARCHAR(255),
      status VARCHAR(50) DEFAULT 'active'
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'active',
      deadline DATE
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'todo',
      priority VARCHAR(50) DEFAULT 'medium',
      due_date DATE
    )
  `)

  console.log('Migration complete')
  await pool.end()
}

run().catch((err) => {
  console.error('Migration failed', err)
  process.exit(1)
})