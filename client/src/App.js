import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid'

class App extends React.Component {
  
  state = {
    task: '',
    tasks: 
      [
        {id: '', name: ''}
      ],
  };
  
  componentDidMount() {
    this.socket = io("http://localhost:8000");
    this.socket.on('addTask', newTask => this.addTask(newTask));
    this.socket.on('removeTask', (id, source) => this.removeTask(id, source));
    this.socket.on('updateDate', serverState => this.setState({tasks: serverState}));
  }

  render() {

    this.removeTask = (id, local) => {
      this.state.tasks.splice(this.state.tasks.findIndex(name => name.id === id), 1);
      this.setState({tasks: this.state.tasks});
      if (local === 'local') {
      this.socket.emit('removeTask', id);
      }
    }
    
    this.submitForm = (e) =>{
      e.preventDefault()
      const newTask = {
        id: uuidv4(),
        name: this.state.task
      }
      this.addTask(newTask);
      this.socket.emit('addTask', newTask);
      this.setState({task: ''});
    }

    this.addTask = (newTask) => {
      this.setState({ tasks: [...this.state.tasks, newTask ]})
      console.log(this.state.tasks);
    }

    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((row) => (
              <li key={row.id} className="task">{row.name}
                <button 
                className="btn btn--red"
                onClick={(source) => this.removeTask(row.id, source="local")}
                >Remove</button>
              </li>))}
          </ul>
    
          <form id="add-task-form">
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={this.state.task}
              onChange={e => {
                e.preventDefault()
                this.setState({task: e.currentTarget.value});
              }}/>
            <button className="btn" type="submit"
              onClick={event => this.submitForm(event) }
              >Add</button>
          </form>
    
        </section>
      </div>
    );
  };
};

export default App;