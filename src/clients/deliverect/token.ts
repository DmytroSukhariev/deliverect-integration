import zod from 'zod'
export enum TokenType {
  BEARER = 'Bearer',
}

export type DeliverectAccessTokenCamel = {
  accessToken: string;
  expiresAt: number;
  tokenType: TokenType;
  scope: string;
}

export type DeliverectAccessTokenSnake = {
  access_token: string;
  expires_at: number;
  token_type: TokenType;
  scope: string;
}

export class DeliverectAccessToken {
  readonly #accessToken: string;
  readonly #expiresAt: number;
  readonly #tokenType: TokenType;
  readonly #scope: string;

  constructor(params: DeliverectAccessTokenCamel) {
    this.#accessToken = params.accessToken;
    this.#expiresAt = params.expiresAt;
    this.#tokenType = params.tokenType;
    this.#scope = params.scope;
  }
  static fromInternal(params: DeliverectAccessTokenCamel): DeliverectAccessToken {
    return new DeliverectAccessToken(
      DeliverectAccessToken.#validateData(params)
    );
  }

  static fromExternal(params: DeliverectAccessTokenSnake): DeliverectAccessToken {
    return new DeliverectAccessToken(
      DeliverectAccessToken.#validateData({
        accessToken: params?.access_token,
        expiresAt: params?.expires_at,
        tokenType: params?.token_type,
        scope: params?.scope
      })
    );
  }

  static #validateData(data: DeliverectAccessTokenCamel): DeliverectAccessTokenCamel {
    return zod.object({
      accessToken: zod.string(),
      expiresAt: zod.number(),
      tokenType: zod.nativeEnum(TokenType),
      scope: zod.string(),
    }).parse(data)
  }

  get accessToken(): string {
    return this.#accessToken;
  }

  get expired(): boolean {
    return this.#expiresAt <= Date.now();
  }

  get toInternal(): DeliverectAccessTokenCamel {
    return {
      accessToken: this.#accessToken,
      expiresAt: this.#expiresAt,
      tokenType: this.#tokenType,
      scope: this.#scope,
    }
  }
}

export interface TokenRepo {
  getToken(): Promise<DeliverectAccessToken | null>;
  putToken(token: DeliverectAccessToken): Promise<DeliverectAccessToken>;
}