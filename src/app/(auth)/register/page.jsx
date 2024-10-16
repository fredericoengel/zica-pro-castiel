"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Formik, Form } from 'formik';
import Link from "next/link"
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Register() {
  const [error, setError] = useState("");
  const [isFormSubmitting, setFormSubitting] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status !== "unauthenticated") {
    return null;
  }


  const initialValues = {
    name: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    password: "",
    
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O campo e-mail é obrigatório"),
    password: Yup.string().required("O campo senha é obrigatório"),

  });

  async function handleSubmit(values, { resetForm }) {
    setFormSubitting(true);
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          cep: values.cep,
          rua: values.rua,
          numero: values.numero,
          complemento: values.complemento,
          cidade: values.cidade,
          estado: values.estado,
          password: values.password,

        }),
      }).then(async (res) => {
        const result = await res.json()

        if ( result.status === 201) {
          alert(result.message)
          router.push("/login")
        } else {
          renderError(result.message);
          resetForm();
        }

        setFormSubitting(false);

      });
    } catch (error) {
      setFormSubitting(false);
      renderError("Erro ao criar conta, tente mais tarde!");

    }
  }
//-----------------MENSAGEM DE EMAIL JÁ CADASTRADO-------------------------
  function renderError(msg) {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 3000);
  }

  
  return (
    <main className='min-h-screen flex items-center justify-center'>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} >
        {({ values }) => (
          <Form noValidate className="flex flex-col gap-2 p-4 border border=zinc-300 min-w-[300px] bg-white" >
            <Input name="name" type="name" required />
            <Input name="email" type="email" required />
            <Input name="cep" type="cep" required />
            <Input name="rua" type="rua" required />
            <Input name="numero" type="numero" required />
            <Input name="complemento" type="complemento" required />
            <Input name="cidade" type="cidade" required />
            <Input name="estado" type="estado" required />
            <Input name="senha" type="password" required autoComplete="off" />
            
            
            <Button type="submit" text={isFormSubmitting ? "Carregando..." : "Cadastrar"} disabled={isFormSubmitting} className="bg-green-500 text-white rounded p-2 cursor-pointer" />
            {!values.name && !values.email && !values.cep && !values.rua && !values.numero && !values.complemento && !values.cidade && !values.estado && !values.password && error && (
              <span className="text-red-500 text-sm text-center">{error}</span>
            )}
            <span className="text-xs text-zinc-500">
              Já possui uma conta?
              <strong className="text-zinc-700">
                <Link href="/login"> Logar</Link>
              </strong>
            </span>
          </Form>
        )}
      </Formik>
    </main>
  );
}
