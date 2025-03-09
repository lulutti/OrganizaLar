import { Button as AntButton, ButtonProps } from "antd";

interface Props extends ButtonProps {
  children: React.ReactNode;
}

const Button: React.FC<Props> = ({ children, ...props }) => {
  return <AntButton {...props}>{children}</AntButton>;
};

export default Button;