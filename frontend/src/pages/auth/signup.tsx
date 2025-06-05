import { useState } from "react";
import { Form, Input, Select, message } from "antd";
import AuthLayout from "@/components/layouts/AuthLayout";
import { usersAPI } from "@/services/usersApi";
import { useRouter } from "next/router";

const { Option } = Select;

const securityQuestions = [
  "Qual foi o nome do seu primeiro animal de estimação?",
  "Qual foi o nome da sua escola primária?",
  "Qual é o nome da sua mãe de solteira?",
  "Em que cidade você nasceu?",
  "Qual foi o nome do seu primeiro professor?",
];

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    secretQuestion: string;
    secretAnswer: string;
  }) => {
    const {        name,
        email,
        password,
        secretAnswer,
        secretQuestion, } = values;
    setLoading(true);
    try {
      await usersAPI.createUser({
        name,
        email,
        password,
        secretAnswer,
        secretQuestion,
        isAdmin: true,
      });
      message.success("Conta criada com sucesso!");
      router.push("/auth/signin");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Criar conta" loading={loading} handleSubmit={handleSubmit} submitButton="Confirmar">
      <Form.Item label="Nome" name="name" rules={[{ required: true, message: "Digite seu nome" }]}>
        <Input placeholder="Digite seu nome" />
      </Form.Item>

      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          { required: true, message: "Digite seu e-mail" },
          { type: "email", message: "Digite um e-mail válido" },
        ]}
      >
        <Input placeholder="ex: nome@email.com" />
      </Form.Item>

      <Form.Item label="Senha" name="password" rules={[{ required: true, message: "Digite sua senha" }]}>
        <Input.Password placeholder="Digite sua senha" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirme a senha"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Confirme a senha" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              return !value || getFieldValue("password") === value
                ? Promise.resolve()
                : Promise.reject(new Error("As senhas não combinam"));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirme a senha" />
      </Form.Item>

      <Form.Item label="Pergunta de segurança" name="secretQuestion" rules={[{ required: true, message: "Selecione uma pergunta" }]}>
        <Select placeholder="Selecione uma pergunta">
          {securityQuestions.map((question, index) => (
            <Option key={index} value={question}>
              {question}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Resposta de segurança" name="secretAnswer" rules={[{ required: true, message: "Digite a resposta de segurança" }]}>
        <Input placeholder="Digite a resposta de segurança" />
      </Form.Item>
    </AuthLayout>
  );
}
