import { useState } from "react";

import { Form, Input, Button } from "antd";
import AuthLayout from "@/components/layouts/AuthLayout";

const links = [
  { label: 'Criar conta', href: '/auth/signup' },
  { label: 'Esqueci minha senha', href: '/auth/forgot-password' },
]

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Login feito!");
    }, 2000);
  };

  return (
    <AuthLayout title="Login" description="Vamos começar com a limpeza!" loading={loading} handleSubmit={handleSubmit} submitButton='Enviar' links={links}>
      <Form.Item label="E-mail" name="email" rules={[{ required: true, message: "Digite seu e-mail" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Senha" name="password" rules={[{ required: true, message: "Digite sua senha" }]}>
        <Input.Password />
      </Form.Item>
    </AuthLayout>
  );
}
