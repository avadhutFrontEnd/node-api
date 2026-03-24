require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 API Endpoints:`);
  console.log(`   GET    /api/products`);
  console.log(`   GET    /api/products/:id`);
  console.log(`   POST   /api/products`);
  console.log(`   PUT    /api/products/:id`);
  console.log(`   PATCH  /api/products/:id`);
  console.log(`   DELETE /api/products/:id`);
});