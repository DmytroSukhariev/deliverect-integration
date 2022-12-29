import { db } from '@db/connection'
import { TokenRepo, DeliverectAccessToken, DeliverectAccessTokenCamel } from '@clients/deliverect/token'

export class DatabaseTokenRepo implements TokenRepo {
  async getToken(): Promise<DeliverectAccessToken | null> {
    const tokenInDb = await db.token.findFirst();
    if (!tokenInDb) return null;
    return DeliverectAccessToken.fromInternal({
      accessToken: tokenInDb?.value,
      expiresAt: tokenInDb?.expirationDate.getTime(),
      tokenType: tokenInDb?.tokenType,
      scope: tokenInDb?.scope
    } as DeliverectAccessTokenCamel); // it will be validated anyway
  }

  async putToken(token: DeliverectAccessToken): Promise<DeliverectAccessToken> {
    await db.token.deleteMany();
    const internalRepresentation = token.toInternal;
    await db.token.create({
      data: {
        value: internalRepresentation.accessToken,
        expirationDate: new Date(internalRepresentation.expiresAt),
        tokenType: internalRepresentation.tokenType,
        scope: internalRepresentation.scope,
      },
    });
    return token;
  }
}