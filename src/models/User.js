import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true},
        cep: { type: String, required: true },
        rua: { type: String, required: true },
        numero: { type: String, required: true },
        complemento: { type: String, required: true },
        bairro: { type: String, required: true },
        cidade: { type: String, required: true },
        estado: { type: String, required: true },
        password:  { type: String, required: true },

                
    },
    { timestamp: true }
);

const modelName = mongoose.models.User || mongoose.model("User", userSchema);

export default modelName;