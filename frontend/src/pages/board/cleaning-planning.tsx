import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Layout,
  Typography,
  Button,
  Spin,
  Collapse,
  message,
  Card,
  List,
  Row,
  Col,
  Tree,
  TreeProps,
  Input
} from "antd";
import React from "react";
import BoardLayout from "@/components/layouts/BoardLayout";
import { authAPI } from "@/services/authAPI";
import {
  CleaningSchedule,
  CleaningScheduleStatus,
  scheduleAPI,
  ScheduleTaskStatus
} from "@/services/scheduleAPI";
import { Task, tasksAPI } from "@/services/tasksApi";
import styles from "@/styles/CleaningPlanningPage.module.css";
import { CheckOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Content } = Layout;
const { Panel } = Collapse;

const CleaningPlanningPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [cleaningSchedule, setCleaningSchedule] = useState<CleaningSchedule>();
  const [tasks, setTasks] = useState<Task[]>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(["0-0-0", "0-0-1"]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [titleValue, setTitleValue] = useState("");

  const fetchData = async () => {
    if (!userId || !accessToken) return;

    try {
      const cleaningScheduleResponse = await scheduleAPI.findActiveByUser(userId, accessToken);
      const tasksResponse = await tasksAPI.getTasksByUser(userId, accessToken);
      setCleaningSchedule(cleaningScheduleResponse);
      setTasks(tasksResponse);
    } catch (error) {
      message.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      router.push("/auth/signin");
      return;
    }

    const validate = async () => {
      try {
        const { isValid, userId } = await authAPI.validateToken(token);
        if (!isValid) {
          router.push("/auth/signin");
          return;
        }

        setAccessToken(token);
        setUserId(userId);
      } catch (error) {
        message.error("Erro ao validar token.");
        router.push("/auth/signin");
      }
    };

    validate();
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [userId, accessToken]);

  const groupedByRoom: Record<string, { tasks: Task[] }> = {};

  if (cleaningSchedule) {
    cleaningSchedule?.tasks.forEach((task) => {
      const { task: originalTask } = task;
      const roomKey = originalTask.room?.name;

      if (roomKey) {
        if (!groupedByRoom[roomKey]) {
          groupedByRoom[roomKey] = { tasks: [] };
        }
        groupedByRoom[roomKey].tasks.push({
          ...originalTask,
          id: task.id,
          status: task.status
        });
      }
    });
  }

  if (loading) {
    return (
      <Layout>
        <Content className={styles.loadingContent}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  const handleTaskCompletion = async (taskId: string) => {
    try {
      await scheduleAPI.updateTaskStatus(
        {
          cleaningScheduleId: cleaningSchedule?.id,
          taskId,
          newStatus: ScheduleTaskStatus.DONE
        },
        accessToken
      );
      fetchData();
      message.success("Tarefa concluída com sucesso!");
    } catch (error) {
      message.error("Erro ao concluir a tarefa.");
    }
  };

  const handleCreateCleaningSchedule = async () => {
    try {
      if (checkedKeys.length < 1) {
        message.error("Selecione no mínimo 1 tarefa");
      } else {
        await scheduleAPI.create(
          {
            userId,
            taskIds: checkedKeys as string[],
            title: titleValue || "Planejamento da limpeza"
          },
          accessToken
        );
        fetchData();
      }
    } catch (error) {
      message.error("Erro ao concluir a tarefa.");
    }
  };

  const handleCancelCleaningSchedule = async () => {
    try {
      cleaningSchedule &&
        (await scheduleAPI.updateStatus(
          cleaningSchedule.id,
          CleaningScheduleStatus.CANCELLED,
          accessToken
        ));
      fetchData();
    } catch (error) {
      message.error("Erro ao tentar cancelar planejamento");
    }
  };

  function transformTasksToTreeData(tasks: Task[] | undefined): Tree.TreeDataNode[] {
    const roomMap: Record<string, Tree.TreeDataNode> = {};

    tasks?.forEach((task) => {
      const roomId = task?.room?.id || "";

      if (!roomMap[roomId]) {
        roomMap[roomId] = {
          title: task?.room?.name || "",
          key: roomId,
          children: []
        };
      }

      roomMap[roomId].children?.push({
        title: task.name,
        key: task.id
      });
    });

    return Object.values(roomMap);
  }

  const treeData = transformTasksToTreeData(tasks);

  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  return (
    <BoardLayout
      title={`${
        cleaningSchedule ? cleaningSchedule.title : "Planejamento da limpeza"
      }`}
    >
      {cleaningSchedule ? (
        <div style={{ display: 'flex', flexDirection: 'column'}}>
        <Row gutter={[16, 16]}>
          {Object.keys(groupedByRoom).map((roomKey: string) => {
            const roomData = groupedByRoom[roomKey];
            return (
              <Col key={roomKey} xs={24} sm={12}>
                <Card key={roomKey} title={roomKey}>
                  <List
                    dataSource={roomData.tasks.filter((task) => task.status !== "done")}
                    locale={{
                      emptyText: (
                        <div style={{ textAlign: "center", color: "#999" }}>
                          Eba! Tudo limpo por aqui! ✨
                        </div>
                      )
                    }}
                    renderItem={(task) => (
                      <List.Item
                        actions={[
                          <Button
                            key={task.id}
                            type="primary"
                            onClick={() => handleTaskCompletion(task.id)}
                          >
                            <CheckOutlined />
                          </Button>
                        ]}
                      >
                        {task.name}
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
        <Button style={{ marginTop: '16px'}} danger onClick={handleCancelCleaningSchedule}>
        Cancelar planejamento
      </Button>
      </div>
      ) : (
        <div>
          <p>🗓️ Nenhum planejamento encontrado, comece agora</p>
          <Card
            bodyStyle={{
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >
            <Input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              className={styles.planningTitle}
              placeholder="Insira um título"
              variant="borderless"
            />
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
            <Button type="primary" onClick={handleCreateCleaningSchedule}>
              Criar planejamento
            </Button>
          </Card>
        </div>
      )}
    </BoardLayout>
  );
};

export default CleaningPlanningPage;
