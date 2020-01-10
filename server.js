const express = require('express');
const app = express();
const querystring = require('querystring');

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Predicate Builder';

app.use(express.json());

app.get('/', function(req, res){
  let { filters } = req.query;
  filters = JSON.parse(filters)
  let statement = filters.map(function(filter, index) {
    const { predicate, operator, customValue } = filter;
    if (index === 0) {
      return `SELECT * FROM session WHERE ${predicate} ${operator} ${customValue}`
    }
    if (index <= filters.length - 1) {
      return `AND ${predicate} ${operator} ${customValue}`
    }
    if (index === filters.length) {
      return `AND ${predicate} ${operator} ${customValue};`
    }
  }).join(' ')
  res.status(200).json(statement);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});