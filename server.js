const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const tasks = [];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client')));

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

const server =  app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateDate', tasks);
  socket.on('addTask', (taskName) => {
    tasks.push(taskName);
    socket.broadcast.emit('addTask', taskName);
  });
  socket.on('removeTask', (taskIndex) => {
    tasks.splice(taskIndex, 1);
    console.log('removeTask', taskIndex,)
    socket.broadcast.emit('removeTask', taskIndex, source = 'server');
  })
});



