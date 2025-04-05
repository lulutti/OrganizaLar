import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Layout,
  Typography,
  Button,
  Spin,
  Collapse,
  message,
  Table,
  FormInstance,
  Form,
  InputRef,
  Input,
} from "antd";
import BoardLayout from "@/components/layouts/BoardLayout";
import { Room, roomsAPI } from "@/services/roomsApi";
import { authAPI } from "@/services/authAPI";
import { Task, tasksAPI } from "@/services/tasksApi";
import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import styles from  "@/styles/TasksPage.module.css";

const { Title } = Typography;
const { Content } = Layout;
const { Panel } = Collapse;

const TasksPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

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
    const fetchData = async () => {
      if (!userId || !accessToken) return;

      try {
        const [taskResponse, roomResponse] = await Promise.all([
          tasksAPI.getTasksByUser(userId, accessToken),
          roomsAPI.getRoomsByUser(userId, accessToken),
        ]);

        setTasks(taskResponse);
        setRooms(roomResponse);
      } catch (error) {
        message.error("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, accessToken]);

  const handleAddTask = async (roomId: string) => {
    try {
      const newTask: Partial<Task> = {
        name: "Nova tarefa",
        roomId,
      };

      await tasksAPI.createTask(newTask as Task, accessToken, userId);
      const updatedTasks = await tasksAPI.getTasksByUser(userId, accessToken);
      setTasks(updatedTasks);
    } catch (error) {
      message.error("Erro ao adicionar tarefa.");
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Planejada",
      dataIndex: "planned",
      key: "planned",
      render: (planned: boolean) => (planned ? "Sim" : "Não"),
    },
    {
      title: "Última realização",
      dataIndex: "last_time_done",
      key: "last_time_done",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ações",
      key: "action",
      render: (_: any, record: Task) => (
        <Button
          danger
          type="link"
          onClick={() => handleDeleteTask(record.id)}
        >
          <DeleteOutlined />
        </Button>
      ),
    }
  ];

  if (loading) {
    return (
      <Layout>
        <Content className={styles.loadingContent}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  const EditableContext = React.createContext<FormInstance<any> | null>(null);

  const EditableRow: React.FC<{ index: number; children: React.ReactNode }> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell: React.FC<any> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          className={styles.noMarginFormItem}
          name={dataIndex}
          rules={[{ required: true, message: `${title} é obrigatório.` }]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div onClick={toggleEdit} className={styles.editableCellWrapper}>
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const handleSave = async (updatedTask: Task) => {
    try {
      await tasksAPI.updateTask(updatedTask, accessToken);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        )
      );

      message.success("Tarefa atualizada com sucesso.");
    } catch (error) {
      message.error("Erro ao salvar a tarefa.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksAPI.deleteTask(taskId, accessToken);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      message.success("Tarefa excluída com sucesso.");
    } catch (error) {
      message.error("Erro ao excluir a tarefa.");
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const editableColumns = columns.map((col) => {
    if (col.dataIndex !== "name") return col;

    return {
      ...col,
      onCell: (record: Task) => ({
        record,
        editable: true,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <BoardLayout title="Tarefas">
      <Collapse accordion>
        {rooms.map((room) => {
          const tasksForRoom = tasks.filter(
            (task) => task?.room?.id === room.id
          );

          return (
            <Panel
              header={room.name}
              key={room.id}
              extra={
                <Button
                  type="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTask(room.id);
                  }}
                >
                  + Adicionar tarefa
                </Button>
              }
            >
              <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={tasksForRoom}
                columns={editableColumns}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: "Nenhuma tarefa cadastrada." }}
              />
            </Panel>
          );
        })}
      </Collapse>
    </BoardLayout>
  );
};

export default TasksPage;