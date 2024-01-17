import { useEffect, useRef, useState } from 'react';
import './App.css';
import moment from "moment"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
function App() {
  const [taskData, setTaskData] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [testText, setTestText] = useState("dsfs")
  const arrow = useRef()
  const handleInput = (e) => {
    setTaskName(e.target.value)
  }
  const getData = () => {
    let data = JSON.parse(localStorage.getItem("tasks"))
    if (data != null) {
      setTaskData(data)
    }
  }
  const addTask = () => {
    taskData.push({ task: taskName, date: Date.now(), status: 0 })
    localStorage.setItem("tasks", JSON.stringify(taskData))
    getData()
  }

  const deleteItem = (index) => {
    const confirm = window.confirm("do you want to delete data")
    if (confirm) {
      taskData.splice(index, 1)
      localStorage.setItem("tasks", JSON.stringify(taskData))
      getData()
      alert("data deleted")
    } else {
      alert("data is safe")
    }

  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tasks"))
    data != null ? setTaskData(data) : setTaskData([])
    if (taskData != null) {
      getData()
    }
  }, [taskData.task])


  const changeStatus = (index) => {
    taskData[index].status = 1
    localStorage.setItem("tasks", JSON.stringify(taskData))
    getData()
  }

  const sortData = () => {
    const comparFunc = (a, b) => {
      const data = b.status - a.status
      return data
    }
    const newSortData = taskData.sort(comparFunc)
    setTaskData(newSortData)
    localStorage.setItem("tasks", JSON.stringify(newSortData))
    getData()
    arrow.current.style.rotate = "180deg"
  }
  const HoverEffect = (e) => {
    e.target.style.cursor = "pointer"
  }

  const handleDragEnd = (results) => {
    if (!results.destination) return
    let tempData = [...taskData]
    let [selectRow] = tempData.splice(results.source.index, 1)
    tempData.splice(results.destination.index, 0, selectRow)
    localStorage.setItem("tasks", JSON.stringify(tempData))
    setTaskData(tempData)
    getData()
    console.log(results, selectRow)
  }

  return (
    <>
      <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
        <table className='table text-center table-striped fw-bold'>
          <thead>
            <tr>
              <th>Drag and Drop item</th>
              <th>Task</th>
              <th>Date</th>
              <th onClick={sortData} onMouseEnter={(e) => { HoverEffect(e) }}>Status <ArrowUpwardOutlinedIcon ref={arrow} /></th>
              <th>Action</th>
            </tr>
          </thead>
          <Droppable droppableId='TBODY'>
            {
              (provided) => (
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {taskData.map((data, index) => {
                    return <Draggable draggableId={`${index}`} key={index} index={index}>
                      {(provided) => <tr key={data.date} ref={provided.innerRef} {...provided.draggableProps}>
                        <td {...provided.dragHandleProps} ><FormatLineSpacingIcon /></td>
                        <td>{data.task}</td>
                        <td>{moment(data.date).fromNow()}</td>
                        <td>
                          {
                            data.status == 0 ?
                              <select className='p-2' onChange={() => changeStatus(index)} >
                                <option value={0}>In complete</option>
                                <option value={1}>complete</option>
                              </select> : <h5 className='text-success'>complete</h5>
                          }
                        </td>
                        <td><button className='btn btn-danger' onClick={() => deleteItem(index)}>Delete</button></td>
                      </tr>}
                    </Draggable>
                  })}
                  {provided.placeholder}
                </tbody>

              )
            }
          </Droppable>

        </table>

      </DragDropContext>
      <div className='row p-3'>
        <div className='col-md-3'></div>
        <div className='col-md-6 p-2 text-center shadow-lg'>
          <h2 className='text-center'>Add New Task</h2>
          <input placeholder='task name' onChange={handleInput} className='form-control' /><br />
          <button className='btn btn-primary mt-3' onClick={addTask}>Add Task</button>
        </div>
        <div className='col-md-3'></div>
      </div>
    </>
  );

}

export default App;
