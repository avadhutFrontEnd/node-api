require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('API: GET/POST/PUT/DELETE /api/posts');
  console.log('API: GET/POST/PUT/DELETE /api/posts/:postId/comments');
});