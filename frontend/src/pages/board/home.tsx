import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout, Typography, Button, Spin, Card, List, Avatar, Input, message } from "antd";
import BoardLayout from "@/components/layouts/BoardLayout";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Room, roomsAPI } from "@/services/roomsApi";
import { jwtDecode } from "jwt-decode";
import styles from "@/styles/Home.module.css";
import { authAPI } from "@/services/authAPI";
import Link from "next/link";
const { Title } = Typography;
const { Content } = Layout;

interface RoomWithEditing extends Room {
    isEditing: boolean;
    userId?: string;
}

const HomePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(false);
    const [accessToken, setAccessToken] = useState<string>('');
    const [userId, setUserId] = useState<string>('');


    const [data, setData] = useState<RoomWithEditing[]>([]);
    const [newItem, setNewItem] = useState<string>('');

    useEffect(() => {
        const token = sessionStorage.getItem("access_token");

        if (!isTokenValid) {
            if (!token) {
                router.push("/auth/signin");
            } else {
                validateToken(token);             
            }
        }

        if (userId && data.length === 0) { fetchRooms(); }
    }, [data.length, isTokenValid, router, userId]);

    
    const validateToken = async (token: string) => {
        try {
        const { isValid, userId } = await authAPI.validateToken(token);

        if (isValid) {
            setIsTokenValid(isValid);
            setAccessToken(token)
            setUserId(userId);
            setLoading(false);
        } else {
            setIsTokenValid(false);
        }} catch (error) {
            message.error("Token inválido.");
            sessionStorage.removeItem("access_token");
            router.push("/auth/signin");
        }
    };


    const fetchRooms = async () => {
        try {
            const response = await roomsAPI.getRoomsByUser(userId, accessToken);
            const rooms = response.map(room => ({ ...room, isEditing: false }));
            setData(rooms);
        } catch (error) {
            message.error("Erro ao buscar cômodos.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        const newData = [
            ...data,
            { name: newItem, isEditing: true, id: 'newItem' }
        ];

        setData(newData);
        setNewItem('');
    };

    const handleEditItem = (index: number) => {
        const newData = [...data];
        newData[index].isEditing = true;
        setData(newData);
    };

    const handleSave = async (index: number, newName: string) => {
        const newData = [...data];

        const { id, userId: roomUserId } = newData[index];
        if (!roomUserId) {
            newData[index].name = newName;
            const room = { name: newData[index].name, description: "" }
            await roomsAPI.createRoom(room, accessToken, userId);
            newData[index].isEditing = false;
        } else {
            await roomsAPI.updateRoom({ id, name: newName }, accessToken);
        }
        fetchRooms()
    };

    const handleDeleteRoom = async (index: number, id: string) => {
        await roomsAPI.deleteRoom(id, accessToken);
        fetchRooms();
    }

    const handleBlur = (index: number, newName: string) => {
        handleSave(index, newName);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number, newName: string) => {

        if (e.key === 'Enter') {
            handleSave(index, newName);
        }
    };

    if (loading) {
        return (
            <Layout>
                <Content style={{ padding: '0 50px', minHeight: '100vh' }}>
                    <Spin size="large" style={{ marginTop: "50px" }} />
                </Content>
            </Layout>
        );
    }

    return (
        <BoardLayout title="Gerenciar espaço">
            <Card title="Comôdos" extra={<Button onClick={handleAddItem}>Adicionar</Button>}>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item key={index} actions={[
                            (item.userId ?
                                <div className={styles.cardItemActions}>
                                    <a key="list-edit" onClick={() => handleEditItem(index)}><EditOutlined /></a>
                                    <a key="list-delete" onClick={() => handleDeleteRoom(index, item.id)}><DeleteOutlined /></a>
                                </div>
                                : '')
                        ]}>
                            <List.Item.Meta
                                avatar={<Avatar shape="circle">{item.name.charAt(0)}</Avatar>}
                                title={
                                    item.isEditing ? (
                                        <Input
                                            value={item.name}
                                            onChange={(e) => setData((prev) => {
                                                const updatedData = [...prev];
                                                updatedData[index].name = e.target.value;
                                                return updatedData;
                                            })}
                                            onBlur={() => handleBlur(index, item.name)}
                                            onKeyDown={(e) => handleKeyPress(e, index, item.name)}
                                        />
                                    ) : (
                                        <Link href="/">{item.name}</Link>
                                    )
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </BoardLayout>
    );
};

export default HomePage;
