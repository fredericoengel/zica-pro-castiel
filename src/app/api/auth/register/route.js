import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connect from "@/utils/db";

export async function POST(req) {
    try {
        const { name, email, cep, rua, numero, complemento, cidade, estado, password } = await req.json();

        await connect();

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return NextResponse.json ({
                message: "Esse e-mail já foi cadastrado!",
                status: 409, // mensagem de conflito
            });
        }
        const hashedPassword = await bcrypt.hash(password, 5);
        


        const newUser = new User({
            name,
            email,
            cep,
            rua,
            numero,
            complemento,
            cidade,
            estado,
            password: hashedPassword,
                        
        });

        await newUser.save();

        return NextResponse.json({
            message: "Usuário criado com sucesso!",
            status: 201,
        });
    } catch (error) {
        return NextResponse.json({
            error:"Erro ao cadastrar usuário",
            status: 500,
        });

        
    }
    
}