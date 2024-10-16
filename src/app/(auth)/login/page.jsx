"use client";
import Button from "@/components/Button";
import Input from "@/components/Input"
import { Form, Formik } from 'formik'
import Link from "next/link"
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { status } = useSession();
  const [isFormSubmitting, setFormSubitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status !== "unauthenticated") {
    return null;
  }


  const initialValues = {
    email: "",
    password: "",
  };



  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("Digite um e-mail"),
    password: Yup.string().required("Digite uma senha")
  });



  async function handleSubmit(values, { resetForm }) {
    setFormSubitting(true);
    try {
      signIn("Credentials", { ...values, redirect: false }).then(
        ({ error }) => {
          if (!error) {
            router.push("/");
          } else {
            setError(error.replace("Error: ", ""))
            setTimeout(() => {
              setError("");
            }, 3000);
            resetForm();
          }
          setFormSubitting(false);
        }
      );
    } catch {
      setFormSubitting(false);
      renderError("Erro ao criar uma conta, tente mais tarde")
    }
  }


  
  return (
    <main className='min-h-screen flex items-center justify-center'>
      <Formik initialValues={initialValues} 
      validationSchema={validationSchema} 
      onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form noValidate className="flex flex-col gap-2 p-4 border border-zinc-300 min-w-[300px] bg-white" >
            <Input name="email" type="email" required />
            <Input name="Senha" type="password" required autoComplete="off" />
            <Button type="submit" text={isFormSubmitting ? "Carregando...": "Entrar"} disable={isFormSubmitting} className="bg-green-500 text-white rouded p-2 cursor-pointer" />
            {!values.email && !values.password && error && (
              <span className="text-red-500 text-sm text-center">{error}</span>
            )}
            <span className="text-xs text-zinc-500">
              Criar uma conta?
              <strong className="text-zinc-700">
                <Link href="/register"> Cadastre-se</Link>
              </strong>
            </span>
          </Form>
        )}
      </Formik>
    </main>
  )
}
