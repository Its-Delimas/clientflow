import { Request,Response } from "express";
import { registerSchema,loginSchema } from "../validators/auth.validator";
import { loginUser, registerUser } from "../services/auth.service";

export const register = async (req:Request,res:Response)=>{
    try {
        const input = registerSchema.parse(req.body)
        const result = await registerUser(input)
        res.status(201).json(result)
    }catch(err:any){
        if (err.name==='ZodError'){
            return res.status(400).json({error:err.errors})
        }
        if(err.message==='Email already in use'){
            return res.status(409).json({error:err.message})
        }
        res.status(500).json({error:'Something went wrong'})
    }
}

export const login = async (req:Request,res:Response)=>{
    try {
        const input = loginSchema.parse(req.body)
        const result = await loginUser(input)
        res.status(201).json(result)
    }catch(err:any){
        if(err.name==='ZodError'){
            return res.status(400).json({error:err.errors})
        }
        if(err.message==='Invalid credentials'){
            return res.status(401).json({error:err.message})
        }
        res.status(500).json({error:'Something went wrong'})
    }
}