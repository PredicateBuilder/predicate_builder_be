const express = require('express');
var cors = require('cors');
const app = express();

//Sets the port dynamically
app.set('port', process.env.PORT || 3001);
app.locals.title = 'Predicate Builder';

app.use(express.json());
//Allows broad CORS access
app.use(cors());

app.get('/', function (req, res) {
  //Deconstructs the query string
  let { filters } = req.query;
  //Parses the query string into usable js
  filters = JSON.parse(filters)
  //This map builds the raw SQL query
  let statement = filters.map(function (filter, index) {
    //Deconstructs the filter at the current index
    const { predicate, operator, customValue1, customValue2 } = filter;
    //Special check for operators that require special characters/handling
    const customFields = operator === 'LIKE' ? `${customValue1}%` : customValue2 !== 'undefined' ? `${customValue1} AND ${customValue2}` : `${customValue1}`;
    //Initiates the SQL query
    if (index === 0) {
      return `SELECT * FROM session WHERE ${predicate} ${operator} ${customFields}`
    }
    //Builds the middle of the query
    if (index <= filters.length - 1) {
      return `AND ${predicate} ${operator} ${customFields}`
    }
    //Builds the end of the query
    if (index === filters.length) {
      return `AND ${predicate} ${operator} ${customFields};`
    }
    //Joins the separate statements into a single string
  }).join(' ');
  //Logs the resulting query in node
  console.log(statement);
  //Sends the built statement back to my react app
  res.status(200).json(statement);
});

app.listen(app.get('port'), () => {
  //Provides feedback when initializing the server
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});