const express = require('express');
var cors = require('cors');
const app = express();

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Predicate Builder';

app.use(express.json());
app.use(cors());

app.get('/', function(req, res){
  let { filters } = req.query;
  filters = JSON.parse(filters)
  let statement = filters.map(function (filter, index) {
    const { predicate, operator, customValue1, customValue2 } = filter;
    const customFields = customValue2 === 'undefined' || customValue2 === undefined  ? customValue1 : `${customValue1} AND ${customValue2}`
    if (index === 0) {
      return `SELECT * FROM session WHERE ${predicate} ${operator} ${customFields}`
    }
    if (index <= filters.length - 1) {
      return `AND ${predicate} ${operator} ${customFields}`
    }
    if (index === filters.length) {
      return `AND ${predicate} ${operator} ${customFields};`
    }
  }).join(' ');
  console.log(statement);
  res.status(200).json(statement);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});