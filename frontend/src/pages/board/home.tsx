import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout, Spin, message } from "antd";
import BoardLayout from "@/components/layouts/BoardLayout";
import CardItem from "@/components/CardItem";
import api from "@/services/api"; // Importando API para chamadas HTTP

const { Content } = Layout;

const HomePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<{ id: string; title: string }[]>([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await api.get("/rooms"); // Endpoint para listar cômodos
            setData(response.data);
        } catch (error) {
            message.error("Erro ao buscar cômodos.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        try {
            const response = await api.post("/rooms", { title: "Novo cômodo" });
            setData([...data, response.data]); // Adiciona o novo cômodo ao estado
        } catch (error) {
            message.error("Erro ao adicionar cômodo.");
        }
    };

    const handleEdit = async (id: string, newTitle: string) => {
        try {
            await api.put(`/rooms/${id}`, { title: newTitle });
            setData(data.map(item => (item.id === id ? { ...item, title: newTitle } : item)));
        } catch (error) {
            message.error("Erro ao editar cômodo.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/rooms/${id}`);
            setData(data.filter(item => item.id !== id));
        } catch (error) {
            message.error("Erro ao remover cômodo.");
        }
    };

    if (loading) {
        return (
            <Layout>
                <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
                    <Spin size="large" style={{ marginTop: "50px" }} />
                </Content>
            </Layout>
        );
    }

    return (
        <BoardLayout title="Gerenciar espaço">
            <CardItem title="Cômodos" data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
        </BoardLayout>
    );
};

export default HomePage;
