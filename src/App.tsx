// eslint-disable-next-line no-unused-vars
import {  useState } from "react";
import { Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { FaTrash, FaEdit } from "react-icons/fa";

import "react-responsive-modal/styles.css";
import {   Modal as ResponsiveModal  } from "react-responsive-modal";
// const ModalContainer = styled.div`
//   display: fixed;
//   justify-content: center;
//   align-items: center;
//   padding: 5rem;
//   border-radius: 10px;
//   text-align: center;
//   background: #fff;
//   box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
//   z-index: 10;
//   top: 0;
//   left: 50%;
//   right: 0;
//   bottom: 50%;
// `;

// const ModalContent = styled.div`
//   display: flex;
//   gap: 1rem;
//   align-items: center;
//   justify-content: center;
// `;

const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 30px;
  width: 500px;
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 350px;
`;
const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  padding: 5px 5px 5px 10px;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  
  &:hover {
    transition: 0.3s;
    transform: scale(1.05);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);

  }
  :hover button:hover {
    
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
   
  }
  
  cursor: grab;
`;

interface AppProps {
  id: string;
  content: string;
}

function App() {
  const [items, setItems] = useState<AppProps[]>([]);
  const [newItemContent, setNewItemContent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputEdit, setInputEdit] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const itemsContent = [...items];
    const [removedItem] = itemsContent.splice(result.source.index, 1);
    itemsContent.splice(result.destination.index, 0, removedItem);
    setItems(itemsContent);
  };

  const handleAddItem = () => {
    if (!newItemContent.trim()) return;
    const listItemId = nanoid();
    const newItem = { id: listItemId, content: newItemContent };
    setItems([...items, newItem]);
    setNewItemContent("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddItem();
    }
  };
  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const openModal = (id: string, content: string) => {
    setIsModalOpen(true);
    setInputEdit(content);
    setSelectedId(id);
  };

  const saveEditedItem = () => {
    const selectedItem = items.find((item) => item.id === selectedId);
    if (selectedItem ) {
      if (!inputEdit.trim()) return;
      selectedItem.content = inputEdit;
      setItems([...items]);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="mt-5 container">
        <h1 className="text-center">To-Do List</h1>
        <div className=" d-flex align-items-center justify-content-center">
          <Form.Group>
            <Form.Control
              type="text"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              placeholder="Add new To-Do"
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Button onClick={handleAddItem}>Add</Button>
        </div>
        <ListContainer>
          <List>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {items.map(({ id, content }: AppProps, index) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {content}
                            <div>
                              <Button
                                variant="warning m-2"
                                onClick={() => openModal(id, content)}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() => handleDeleteItem(id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </List>
        </ListContainer>
      </div>
      {isModalOpen && (
        <ResponsiveModal
        classNames={{
          overlay: 'customOverlay',
          modal: 'customModal',
        }}
        open={isModalOpen} onClose={() => setIsModalOpen(false)} center={true}>
          <Form.Group className="m-5">
            <Form.Control
              type="text"
              value={inputEdit}
              onChange={(e) => setInputEdit(e.target.value)}
              placeholder="Edit To-Do"
              
            />
                      <Button variant="primary" onClick={saveEditedItem} >edit</Button>

          </Form.Group>
        </ResponsiveModal>
      )}
    </>
  );
}

export default App;
