import { ResolverAdapter } from '~/core/Resolver';
import { GQLNodeInfo } from '~/graphql/generated/sdk';
import { GraphQLSDK } from '../GraphQLSDK';

type Source = GQLNodeInfo;
type Params = {
  nodeInfo: null;
};

export class NodeResolver extends ResolverAdapter<Source> {
  constructor() {
    super();
    this.setResolvers({
      nodeInfo: this.nodeInfo.bind(this),
    });
  }

  async nodeInfo(_: Source, _params: Params['nodeInfo']) {
    // TODO: need to check with @luizstacio about the nodeInfo resolver
    const { sdk } = new GraphQLSDK();
    return sdk.nodeInfo();
  }
}
