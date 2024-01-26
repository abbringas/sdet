import app from './app';

const port = process.env.PORT || 3100;

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});