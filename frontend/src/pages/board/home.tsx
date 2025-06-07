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
import { getInitials } from "@/utils/getInitials.utils";
import { stringToColor } from "@/utils/stringToColor.utils";
import { Contributor, contributorsAPI } from "@/services/contributorsApi";
const { Title } = Typography;
const { Content } = Layout;

interface RoomWithEditing extends Room {
  isEditing: boolean;
  userId?: string;
}

interface ContributorWithEditing extends Contributor {
  isEditing: boolean;
}

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const [roomsData, setRoomsData] = useState<RoomWithEditing[]>([]);
  const [contributorsData, setContributorsData] = useState<ContributorWithEditing[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!isTokenValid) {
      token ? validateToken(token) : router.push("/auth/signin");
    }
    if (userId && roomsData.length === 0) {
      fetchData();
    }
  }, [isTokenValid, userId]);

  const validateToken = async (token: string) => {
    try {
      const { isValid, userId } = await authAPI.validateToken(token);
      if (isValid) {
        setAccessToken(token);
        setUserId(userId);
        setIsTokenValid(true);
      } else {
        throw new Error("Token inválido");
      }
    } catch {
      message.error("Token inválido.");
      sessionStorage.removeItem("access_token");
      router.push("/auth/signin");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [roomsRes, contribsRes] = await Promise.all([
        roomsAPI.getRoomsByUser(userId, accessToken),
        contributorsAPI.getContributors(accessToken),
      ]);
      setRoomsData(roomsRes.map((r) => ({ ...r, isEditing: false })));
      setContributorsData(contribsRes.map((c) => ({ ...c, isEditing: false })));
    } catch {
      message.error("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type: "room" | "contributor") => {
    const newItem = {
      name: "",
      isEditing: true,
      id: "newItem",
      userId,
    };

    if (type === "room") {
      setRoomsData([...roomsData, newItem as RoomWithEditing]);
    } else {
      setContributorsData([...contributorsData, newItem as ContributorWithEditing]);
    }
  };

  const handleEdit = (index: number, type: "room" | "contributor") => {
    const setter = type === "room" ? setRoomsData : setContributorsData;
    const data = type === "room" ? roomsData : contributorsData;

    const updated = [...data];
    updated[index].isEditing = true;
    setter(updated);
  };

  const handleSave = async (index: number, newName: string, type: "room" | "contributor") => {
    const data = type === "room" ? roomsData : contributorsData;
    const setter = type === "room" ? setRoomsData : setContributorsData;

    const item = { ...data[index], name: newName };
    try {
      if (item.id === "newItem") {
        type === "room"
          ? await roomsAPI.createRoom({ name: newName, description: "" }, accessToken, userId)
          : await contributorsAPI.createContributor({ name: newName, userId }, accessToken);
      } else {
        type === "room"
          ? await roomsAPI.updateRoom({ id: item.id, name: newName }, accessToken)
          : await contributorsAPI.updateContributor(item.id, { name: newName }, accessToken);
      }
    } catch {
      message.error(`Erro ao salvar ${type === "room" ? "cômodo" : "membro"}.`);
    } finally {
      fetchData();
    }
  };

  const handleDelete = async (index: number, id: string, type: "room" | "contributor") => {
    try {
      type === "room"
        ? await roomsAPI.deleteRoom(id, accessToken)
        : await contributorsAPI.deleteContributor(id, accessToken);
      fetchData();
    } catch {
      message.error(`Erro ao deletar ${type === "room" ? "cômodo" : "membro"}.`);
    }
  };

  const handleBlur = (index: number, newName: string, type: "room" | "contributor") => {
    handleSave(index, newName, type);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    newName: string,
    type: "room" | "contributor"
  ) => {
    if (e.key === "Enter") {
      handleSave(index, newName, type);
    }
  };

  const renderEditableList = (
    data: (RoomWithEditing | ContributorWithEditing)[],
    type: "room" | "contributor"
  ) => (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item
          key={index}
          actions={
            item.userId && !item.isEditing
              ? [
                  <a key="edit" onClick={() => handleEdit(index, type)}>
                    <EditOutlined />
                  </a>,
                  <a key="delete" onClick={() => handleDelete(index, item.id, type)}>
                    <DeleteOutlined />
                  </a>,
                ]
              : []
          }
        >
          <List.Item.Meta
            avatar={
              <Avatar style={{ backgroundColor: stringToColor(item.name) }}>
                {getInitials(item.name)}
              </Avatar>
            }
            title={
              item.isEditing ? (
                <Input
                  value={item.name}
                  onChange={(e) => {
                    const setter = type === "room" ? setRoomsData : setContributorsData;
                    const updated = [...data];
                    updated[index].name = e.target.value;
                    setter(updated);
                  }}
                  onBlur={() => handleBlur(index, item.name, type)}
                  onKeyDown={(e) => handleKeyPress(e, index, item.name, type)}
                />
              ) : (
                <Link href="/">{item.name}</Link>
              )
            }
          />
        </List.Item>
      )}
    />
  );

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
      <Card
        title="Cômodos"
        style={{ marginBottom: 24 }}
        extra={<Button onClick={() => handleAdd("room")}>Adicionar</Button>}
      >
        {renderEditableList(roomsData, "room")}
      </Card>

      <Card
        title="Membros"
        extra={<Button onClick={() => handleAdd("contributor")}>Adicionar</Button>}
      >
        {renderEditableList(contributorsData, "contributor")}
      </Card>
    </BoardLayout>
  );
};

export default HomePage;
