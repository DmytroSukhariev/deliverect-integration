import { fetch } from 'undici';
import { CONFIG } from '@config';
import { DeliverectAccessToken, DeliverectAccessTokenSnake, TokenRepo } from '@clients/deliverect/token'


export class Deliverect {
  readonly #tokenRepo: TokenRepo;
  #token: DeliverectAccessToken | null;
  constructor(tokenRepo: TokenRepo) {
    this.#tokenRepo = tokenRepo;
    this.#token = null;
  }

  async accounts(): Promise<{ status: number; body: Record<string, unknown> }> {
    const token = await this.#getToken();
    const res = await fetch(`${CONFIG.DELIVERECT.API_HOST}/accounts`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token.accessToken}`,
      }
    });
    return {
      status: res.status,
      body: (await res.json()) as Record<string, unknown>,
    }
  }

  async #getToken(): Promise<DeliverectAccessToken> {
    const token = this.#token ??= await this.#tokenRepo.getToken();

    if (!token || token.expired) {
      this.#token = await this.#requestNewToken();
      await this.#tokenRepo.putToken(this.#token);
    }

    return this.#token!;
  }

  async #requestNewToken(): Promise<DeliverectAccessToken> {
    const res = await fetch(`${CONFIG.DELIVERECT.API_HOST}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CONFIG.DELIVERECT.CLIENT.ID,
        client_secret: CONFIG.DELIVERECT.CLIENT.SECRET,
        audience: CONFIG.DELIVERECT.API_HOST,
        grant_type: 'token',
      }),
    });

    if (res.status !== 200) throw new Error(await res.text());

    return DeliverectAccessToken.fromExternal(await res.json() as DeliverectAccessTokenSnake);
  }
}