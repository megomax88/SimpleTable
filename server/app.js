require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const {
  Table,
} = require('./db/models');

const app = express();

app.use(cors({
  credentials: true,
  origin: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(process.env.PWD, 'public')));

// получение данных из таблицы
app.get('/table', async (req, res) => {
  const result = await Table.findAll();
  console.log(result);
  res.json(result);
});
// сортировка и фильтрация таблицы
app.post('/filterTable', async (req, res) => {
  try {
    const { columnValue, conditionValue } = req.body;
    console.log(!!columnValue, '++++++++++++++++++++++++++++');
    if (columnValue === 'all') {
      const result = await Table.findAll();
      res.json(result);
    }
    if (columnValue && conditionValue) {
      const filterColumnValue = await Table.findAll({
        attributes: [columnValue],
        order: [[columnValue, conditionValue]],
      });
      res.json(filterColumnValue);
    }
    if (columnValue) {
      const filterColumnValue = await Table.findAll({
        attributes: [columnValue],
      });
      res.json(filterColumnValue);
    }
    if (conditionValue) {
      const filterColumnValue = await Table.findAll({
        order: [['id', conditionValue]],
      });
      res.json(filterColumnValue);
    }

    // console.log(filterColumnValue);
  } catch (error) {
    console.log(error);
  }
});

// app.delete('/delete/:id', async (req, res) => {
//   setTimeout(async () => {
//     const { id } = req.params;
//     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', id);
//     await Todo.destroy({ where: { id } });
//     res.sendStatus(200);
//   }, 500);
// });

// app.post('/addTodo', async (req, res) => {
//   setTimeout(async () => {
//     const { name, isDone, user_id } = req.body;
//     console.log(name, isDone, user_id);
//     // const { userId } = req.session;

//     const result = await Todo.create({ name, isDone, user_id });
//     res.json(result);
//   }, 500);
// });

// app.post('/changeTodo/:id', async (req, res) => {
//   setTimeout(async () => {
//     const { name, isDone } = req.body;
//     // console.log(req.body);
//     // console.log('!!!!!!!!!!!!!', name, isDone);
//     // const { userId } = req.session;

//     await Todo.update(
//       { name, isDone },
//       { where: { id: req.params.id } },
//     );
//     const result1 = await Todo.findByPk(req.params.id);
//     console.log(result1);
//     res.json(result1);
//   }, 500);
// });
app.listen(process.env.PORT, () => {
  console.log('server start ', process.env.PORT);
});
