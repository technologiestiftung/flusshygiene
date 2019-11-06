const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT;
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// catch all
//app.get("*", (req, res) => {
//  res.sendStatus(404);
//});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
