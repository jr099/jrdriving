import { app } from './app';
import { env } from './env';

app.listen(env.PORT, () => {
  console.log(`🚀 API server ready on port ${env.PORT}`);
});
