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
  Input,
  Table,
  Avatar,
  Dropdown,
  Menu,
} from "antd";
import type { DataNode } from "antd/es/tree";

import React from "react";
import BoardLayout from "@/components/layouts/BoardLayout";
import { authAPI } from "@/services/authAPI";
import {
  CleaningSchedule,
  CleaningScheduleStatus,
  scheduleAPI,
  ScheduleTaskStatus,
} from "@/services/scheduleAPI";
import { Task, tasksAPI } from "@/services/tasksApi";
import styles from "@/styles/CleaningPlanningPage.module.css";
import { CheckOutlined } from "@ant-design/icons";
import { Contributor, contributorsAPI } from "@/services/contributorsApi";
import { usersAPI } from "@/services/usersApi";
import { stringToColor } from "@/utils/stringToColor.utils";
import { getInitials } from "@/utils/getInitials.utils";

const { Title } = Typography;
const { Content } = Layout;
const { Panel } = Collapse;

const CleaningPlanningPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [cleaningSchedule, setCleaningSchedule] = useState<CleaningSchedule>();
  const [tasks, setTasks] = useState<Task[]>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(["0-0-0", "0-0-1"]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [titleValue, setTitleValue] = useState("");
  const [contributors, setContributors] = useState<Contributor[]>();

  const fetchData = async () => {
    if (!userId || !accessToken) return;

    try {
      const cleaningScheduleResponse = await scheduleAPI.findActiveByUser(userId, accessToken);
      const tasksResponse = await tasksAPI.getTasksByUser(userId, accessToken);
      const contributorsResponse = await contributorsAPI.getContributors(accessToken);
      setCleaningSchedule(cleaningScheduleResponse);
      setTasks(tasksResponse);
      setContributors([...contributorsResponse, { id: userId, name: userName, userId }]);
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
        const { isValid, userId, userName } = await authAPI.validateToken(token);
        if (!isValid || !userId || !userName) {
          router.push("/auth/signin");
          return;
        }

        setAccessToken(token);
        setUserId(userId);
        setUserName(userName);
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

        const contributorName = contributors?.find(
          (contributor) => contributor.id === task.assignedContributorId
        );
        groupedByRoom[roomKey].tasks.push({
          ...originalTask,
          id: task.id,
          status: task.status,
          contributorName: contributorName ? contributorName.name : userName,
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
          newStatus: ScheduleTaskStatus.DONE,
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
            title: titleValue || "Planejamento da limpeza",
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

  function transformTasksToTreeData(tasks: Task[] | undefined): DataNode[] {
    const roomMap: Record<string, DataNode> = {};

    tasks?.forEach((task) => {
      const roomId = task?.room?.id || "";

      if (!roomMap[roomId]) {
        roomMap[roomId] = {
          title: task?.room?.name || "",
          key: roomId,
          children: [],
        };
      }

      roomMap[roomId].children?.push({
        title: task.name,
        key: task.id,
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




  const changeContributor = async (contributorId: string, taskId: string) => {
    try {
      const payload: Record<string, string | null> = {};
      if (contributorId === userId) {
        payload["assignedToAdminUserId"] = userId;
        payload["assignedToContributorId"] = null;
      } else {
        payload["assignedToContributorId"] = contributorId;
        payload["assignedToAdminUserId"] = null;
      }
      await scheduleAPI.updateTaskStatus(
        {
          cleaningScheduleId: cleaningSchedule?.id,
          taskId: taskId,
          ...payload,
        },
        accessToken
      );
      message.success("Responsável atualizado com sucesso!");
      fetchData();
    } catch (error) {
      message.error("Erro ao atualizar Responsável.");
    }
  };

  const contributorsMenu = (taskId: string) => (
    <Menu onClick={({ key }) => changeContributor(key, taskId)}>
      {contributors?.map((contributor) => (
        <Menu.Item key={contributor.id}>{contributor.name}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <BoardLayout title={`${cleaningSchedule ? cleaningSchedule.title : "Planejamento da limpeza"}`}>
      {cleaningSchedule ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
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
                        ),
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
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Dropdown overlay={contributorsMenu(task.id)} trigger={["click"]}>
                                <Avatar
                                  style={{
                                    backgroundColor: stringToColor(task.contributorName),
                                    cursor: "pointer",
                                  }}
                                >
                                  {" "}
                                  {getInitials(task.contributorName)}
                                </Avatar>
                              </Dropdown>
                            }
                            title={task.name}
                            description={task.description}
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
          <Button style={{ marginTop: "16px" }} danger onClick={handleCancelCleaningSchedule}>
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
              gap: "16px",
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
