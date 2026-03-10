import app from './app';

const PORT = Number(process.env['PORT'] ?? 3001);

app.listen(PORT, () => {
  console.info(`🚀 Bundle Up API running on http://localhost:${PORT}`);
  console.info(`   ENV: ${process.env['NODE_ENV'] ?? 'development'}`);
});
