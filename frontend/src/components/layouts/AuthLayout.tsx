import { useState } from "react";
import { Button, Form, Spin, Typography, Grid } from "antd";

import Image from "next/image";
import styles from "@/styles/AuthLayout.module.css";


const { Title, Paragraph, Link } = Typography;

const { useBreakpoint } = Grid;


interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
    handleSubmit: (values: any) => void;
    submitButton: string;
    description?: string;
    loading?: boolean;
    links?: any[]; //
}

export default function AuthLayout({ title, children, handleSubmit, description, submitButton, loading = false, links = [] }: AuthLayoutProps) {
    const screens = useBreakpoint();
    return (
        <div className={styles.container}>
            {screens.md && (
                <div className={styles.illustration}>
                    <Image src="/assets/clean-illustration.svg" alt="" width={380} height={376} objectFit="contain" />
                </div>
            )}
            <div className={styles.formContainer}>
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className={styles.form}>
                        <Image src="/assets/logo.svg" alt="" width={214} height={41} objectFit="contain" />

                        <div>
                            <Title id={styles.title} level={1}>{title}</Title>
                            <Paragraph>{description}</Paragraph>
                        </div>

                        <>
                            <Form onFinish={handleSubmit} layout="vertical" size="large">
                                {children}
                                <Button type="primary" htmlType="submit" block loading={loading}>
                                    {submitButton}
                                </Button>
                            </Form>
                            {links?.length > 0 &&
                                <div className={styles.linksContainer}>
                                    {links?.map((link, index) => {
                                        const { label, href } = link;
                                        return <Link href={href} key={index}>
                                            <Button type="link">{label}</Button>
                                        </Link>
                                    })}
                                </div>
                            }
                        </>
                    </div>
                )}
            </div>
        </div>
    );
}

