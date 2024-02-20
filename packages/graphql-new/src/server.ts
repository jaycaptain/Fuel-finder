import { env } from './config';
import { Server } from './infra/core/Server';
import { GraphQLServer } from './infra/graphql/GraphQLServer';

const port = Number(env.get('SERVER_PORT'));
const graphQLServer = new GraphQLServer();
const schema = graphQLServer.schema();
const yoga = graphQLServer.setup(schema);

const httpServer = new Server();
const app = httpServer.setup();

app.use(yoga.graphqlEndpoint, yoga);
httpServer.listen(app, port).then(() => {
  console.log(
    `📟 GraphQL server is running on http://localhost:${port}${yoga.graphqlEndpoint}`,
  );
});
