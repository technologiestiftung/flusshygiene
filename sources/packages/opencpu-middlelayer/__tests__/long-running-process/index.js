const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.post('/process/:duration', (req, res) => {
  req.setTimeout(0);
  console.log('This is the body that was passed thorough', req.body);
  const dur = parseInt(req.params.duration, 10);
  if (isNaN(dur) === true) {
    res.json({ message: `:duration isNaN "${req.params.duration}"` });
    return;
  }
  setTimeout(() => {
    const body = { message: `waited for ${dur}` };
    console.log(body);
    res.json(body);
  }, dur);
});

app.listen(4444, () => {
  console.log('long running process linstening on http://localhost:4444');
});

module.exports = app;
