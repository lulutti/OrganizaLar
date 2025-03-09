import { useState } from "react";

import { Form, Input, Button, Select } from "antd";
import AuthLayout from "@/components/layouts/AuthLayout";

const { Option } = Select;

const options = [
  { value: "Qual foi o nome do seu primeiro animal de estimação?" },
  { value: "Qual foi o nome da sua escola primária?" },
  { value: "Qual é o nome da sua mãe de solteira?" },
  { value: "Em que cidade você nasceu?" },
  { value: "Qual foi o nome do seu primeiro professor?" }
];


export default function SignUpPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Login feito!");
    }, 2000);
  };

  return (
    <AuthLayout title="Criar conta" loading={loading} handleSubmit={handleSubmit} submitButton='Confirmar'>
      <Form.Item label="E-mail" name="email" rules={[{ required: true, message: "Digite seu e-mail" }]}>
        <Input placeholder="ex: nome@email.com" />
      </Form.Item>
      <Form.Item label="Senha" name="password" rules={[{ required: true, message: "Digite sua senha" }]}>
        <Input.Password placeholder="Digite sua senha" />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="Confirme a senha"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Confirme a senha",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('As senhas não combinam'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirme a senha" />
      </Form.Item>
      <Form.Item label="Pergunta de segurança" name="secretQuestion" rules={[{ required: true, message: "Selecione uma pergunta" }]}>
        <Select placeholder="Selecione uma pergunta">
          {options?.map((option, index) => {
            const { value } = option;
            return <Option value={value} key={index}>{value}</Option>
          })}
          <Option>1</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Resposta de segurança" name="secretAnswer" rules={[{ required: true, message: "Digite a resposta de segurança" }]}>
        <Input placeholder="Digite a resposta de segurança" />
      </Form.Item>
    </AuthLayout>
  );
}
