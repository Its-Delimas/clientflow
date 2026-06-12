import pool from '../config/db'
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import { RegisterInput,LoginInput } from '../validators/auth.validator'

export const registerUser = async (input: RegisterInput) => {
    const {email,password} = input

    const existing = await pool.query(
        `SELECT id FROM users WHERE email = $1`, [email]
    )

    if(existing.rows.length > 0){
        throw new Error ('Email already in use')
    }

    const password_hash = await bcrypt.hash(password,10)

    const result = await pool.query(
        'INSERT INTO Users (email,password_hash) VALUES ($1,$2) RETURNING id, email, created_at',
        [email,password_hash]
    )

    const user = result.rows[0]
    const token = Jwt.sign(
        {id:user.id,email:user.emaiL},
        process.env.JWT_SECRET as string,
        {expiresIn:'7d'}
    )
    return {user, token}
}

export const loginUser = async (input:LoginInput) =>{
    const {email,password} = input

    const result = await pool.query(
        `SELECT * FROM Users WHERE email = $1`,
        [email]
    )

    if(result.rows.length===0){
        throw new Error('Invalid credentials')
    }

    const user = result.rows[0]
    const valid = await bcrypt.compare(password,user.password_hash)

    if(!valid){
        throw new Error ('Invalid credentials')
    }

    const token  = Jwt.sign(
        {id:user.id,email:user.emaiL},
        process.env.JWT_SECRET as string,
        {expiresIn:'7d'}
    )

    return {user:{id:user.id,email:user.emaiL,created_at:user.created_at},token}
}
