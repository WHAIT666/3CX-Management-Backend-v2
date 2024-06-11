import {Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service'
import sendEmail from '../utils/mailer';

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput>,
    res: Response){

    const body = req.body;
    
    try{
        const user = await createUser(body);

        await sendEmail({
            to: user.email,
            from: "test@example.com",
            subject: "Reset your password",
            text: `Password reset code: ${user.verificationCode}. Id ${user._id}`,
          });
    
    return res.send("User sucessfuly Created")
    }catch(e){
        if(e.code === 11000){
            return res.status(409).send("User already exists")
        }
    

        return res.status(500).send(e);
    }

}