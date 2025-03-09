import { useState } from "react";

import { Form, Input, Button } from "antd";
import AuthLayout from "@/components/layouts/AuthLayout";
import Link from "antd/es/typography/Link";

const links = [
  { label: 'Criar conta', href: '/auth/signup' },
  { label: 'Entrar', href: '/auth/signin' },
]

enum ForgotPasswordState {
  RequestEmail = "RequestEmail",
  AnswerSecurityQuestion = "AnswerSecurityQuestion",
  ResetPassword = "ResetPassword"
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<ForgotPasswordState>(ForgotPasswordState.RequestEmail);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      switch (state) {
        case ForgotPasswordState.RequestEmail:
          // Endpoint X: Enviar email e obter a pergunta secreta
          // Aqui você vai chamar o endpoint para enviar o e-mail e obter a pergunta secreta
          console.log('Solicitar e-mail e pergunta secreta');
          setState(ForgotPasswordState.AnswerSecurityQuestion); // Se deu certo, muda para o próximo estado
          break;

        case ForgotPasswordState.AnswerSecurityQuestion:
          // Endpoint Y: Enviar a resposta da pergunta secreta
          // Aqui você vai chamar o endpoint para verificar a resposta da pergunta secreta
          console.log('Verificar resposta da pergunta secreta');
          setState(ForgotPasswordState.ResetPassword); // Se a resposta for correta, vai para o reset de senha
          break;

        case ForgotPasswordState.ResetPassword:
          // Endpoint Z: Atualizar a senha
          // Aqui você vai chamar o endpoint para atualizar a senha
          console.log('Atualizar senha');
          // Após atualização, você pode redirecionar para o signin
          window.location.href = '/auth/signin'; // Redireciona para a página de login
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pageStates = {
    [ForgotPasswordState.RequestEmail]: {
      title: "Esqueci minha senha",
      description: "Digite o e-mail cadastrado",
      formItems: (
        <Form.Item label="E-mail" name="email" rules={[{ required: true, message: "Digite seu e-mail" }]}>
          <Input />
        </Form.Item>
      ),
      submitButton: {
        text: "Enviar",
        loading: loading
      }
    },
    [ForgotPasswordState.AnswerSecurityQuestion]: {
      title: "Validação de segurança",
      description: "Responda corretamente a pergunta secreta cadastrada",
      formItems: (
        <Form.Item label="Pergunta secreta" name="secretAnswer" rules={[{ required: true, message: "Digite a resposta de segurança" }]}>
          <Input />
        </Form.Item>
      ),
      submitButton: {
        text: "Continuar",
        loading: loading
      }
    },
    [ForgotPasswordState.ResetPassword]: {
      title: "Atualização de senha",
      description: "",
      formItems: (
        <>
          <Form.Item label="Senha" name="password" rules={[{ required: true, message: "Digite sua senha" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirme a senha"
            name="confirm"
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
            <Input.Password />
          </Form.Item>
        </>
      ),
      submitButton: {
        text: "Confirmar",
        loading: loading
      }
    }
  };

  return (
    <AuthLayout
      title={pageStates[state].title}
      description={pageStates[state].description}
      loading={loading}
      handleSubmit={handleSubmit}
      links={links}
      submitButton={pageStates[state].submitButton.text}
    >
      {pageStates[state].formItems}
    </AuthLayout>
  );
}
