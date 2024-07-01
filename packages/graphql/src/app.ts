import { env } from './config';
import { logger } from './core/Logger';
import { GraphQLServer } from './graphql/GraphQLServer';
import { db } from './infra/database/Db';
import { Server } from './infra/server/App';

(async () => {
  const port = Number(env.get('SERVER_PORT'));
  const graphQLServer = new GraphQLServer(await db.conn());
  const schema = graphQLServer.schema();
  const yoga = graphQLServer.setup(schema);
  const httpServer = new Server();
  const app = httpServer.setup();

  app.use(yoga.graphqlEndpoint, yoga);
  httpServer.listen(app, port).then(async () => {
    logger.info(
      `📟 GraphQL server is running on http://localhost:${port}${yoga.graphqlEndpoint}`,
    );
    logger.info('📝 GraphQLYoga event logs are available at logs/graphql.log');

    const others = ['SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'];
    //biome-ignore lint/complexity/noForEach: <explanation>
    others.forEach((eventType) => {
      process.on(eventType, async (err) => {
        db.close();
        logger.error('❌ GraphQL shutdown error', err);
        process.exit(1);
      });
    });
  });
})();
