import { useState } from "react";
import { List, Avatar, Input, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface RoomItem {
  id: string;
  title: string;
  isEditing: boolean;
}

interface RoomsCardItemProps {
  roomsData: RoomItem[];
  onUpdate: (updatedRooms: RoomItem[]) => void;
  onAdd: (title: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  userId: string;
  accessToken: string;
}

const RoomsCardItem: React.FC<RoomsCardItemProps> = ({
  roomsData,
  onUpdate,
  onAdd,
  onDelete,
  onEdit,
  userId,
}) => {
  const [newRoomTitle, setNewRoomTitle] = useState<string>("");

  const handleAddItem = () => {
    if (newRoomTitle) {
      onAdd(newRoomTitle);
      setNewRoomTitle("");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedRooms = [...roomsData];
    updatedRooms[index].title = e.target.value;
    onUpdate(updatedRooms);
  };

  const handleEditBlur = (index: number, newTitle: string) => {
    if (newTitle !== roomsData[index].title) {
      onEdit(roomsData[index].id, newTitle);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    newTitle: string
  ) => {
    if (e.key === "Enter") {
      handleEditBlur(index, newTitle);
    }
  };

  return (
    <div>
      <div>
        <Input
          value={newRoomTitle}
          onChange={(e) => setNewRoomTitle(e.target.value)}
          placeholder="Adicionar novo cômodo"
        />
        <Button onClick={handleAddItem} type="primary">
          Adicionar
        </Button>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={roomsData}
        renderItem={(item, index) => (
          <List.Item
            key={item.id}
            actions={[
              <EditOutlined
                key="edit"
                onClick={() => {
                  const updatedRooms = [...roomsData];
                  updatedRooms[index].isEditing = true;
                  onUpdate(updatedRooms);
                }}
              />,
              <DeleteOutlined key="delete" onClick={() => onDelete(item.id)} />,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar>{item.title.charAt(0)}</Avatar>}
              title={
                item.isEditing ? (
                  <Input
                    value={item.title}
                    onChange={(e) => handleEditChange(e, index)}
                    onBlur={() => handleEditBlur(index, item.title)}
                    onKeyDown={(e) => handleKeyPress(e, index, item.title)}
                  />
                ) : (
                  <span>{item.title}</span>
                )
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default RoomsCardItem;
