import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import AuthLayout from "@/components/layouts/AuthLayout";

import { useRouter } from "next/router";
import { authAPI } from "@/services/authAPI";

const links = [
  { label: "Criar conta", href: "/auth/signup" },
];

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await authAPI.signIn(values.email, values.password);

      sessionStorage.setItem("access_token", response.access_token);
      message.success("Login realizado com sucesso!");
      router.push("/board/home");
    } catch (error) {
      message.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login"
      description="Vamos começar com a limpeza!"
      loading={loading}
      handleSubmit={handleSubmit}
      submitButton="Enviar"
      links={links}
    >
      <Form.Item
        label="E-mail"
        name="email"
        rules={[{ required: true, message: "Digite seu e-mail" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Senha"
        name="password"
        rules={[{ required: true, message: "Digite sua senha" }]}
      >
        <Input.Password />
      </Form.Item>
    </AuthLayout>
  );
}
