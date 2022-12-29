import { randomBytes } from 'crypto'
import express from 'express';
import { CONFIG } from '@config'
import { db } from '@db/connection';

const app = express();

let token: string | null = null;

const generateNewToken = () => {
  return token = randomBytes(100).toString('hex');
};

// @ts-expect-error
const isNil = <T>(val: T): val is Pick<T, null | undefined> => val === null || val === undefined;

app.use(express.json());

app.post('/oauth/token', (req, res) => {
  console.log('[INFO] POST /oauth/token body:', req.body);
  const {
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      audience,
      grant_type: grantType,
    }
  } = req;

  if (
    clientId !== CONFIG.DELIVERECT.CLIENT.ID ||
    clientSecret !== CONFIG.DELIVERECT.CLIENT.SECRET ||
    isNil(audience) ||
    isNil(grantType)
  ) {
    res.statusCode = 401;
    res.json({
      error: "access_denied",
      error_description: "Unauthorized"
    }).send();
    console.log('[INFO] Invalid credentials');
    return;
  }

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);

  const tokenResBody = {
    access_token: generateNewToken(),
    expires_at: expiration.getTime(),
    token_type: "Bearer",
    scope: "genericPOS stock"
  };

  console.log(`[INFO] Token generated:`, tokenResBody);

  res.statusCode = 200;
  res.json(tokenResBody).send();
});

app.get('/accounts', async (req, res) => {
  const {
    headers: {
      authorization,
    },
  } = req;

  console.log('[INFO] GET /accounts headers:', req.headers);

  if (authorization !== `Bearer ${token}`) {
    res.statusCode = 401;
    res.json({
      _status: "ERR",
      _error: {
        code: 401,
        message: "Please provide proper credentials",
      },
    });

    console.log('[INFO] Unauthorized');

    return;
  }

  res.statusCode = 200;
  res.json({
    "_items": [
      {
        "_id": "5f1***131",
        "name": "Generic account",
        "accountType": 1,
        "currency": 1,
        "posSystem": 10000,
        "_updated": "2021-05-18T08:02:16.000000Z",
        "_created": "2020-07-24T07:36:49.000000Z",
        "_deleted": false,
        "_etag": "004a4df4bcce3cae83fd530c4a502278633ffd42",
        "locations": [
          "5f1***133",
          "606***b86",
          "606***555"
        ],
        "accounts": [],
        "brands": [
          {
            "name": "Generic account",
            "brandId": "606***6c5"
          }
        ],
        "deliverectVersion": "2.0",
        "featureFlags": {
          "menuLocationOverrides": false,
          "autoApply": false,
          "pullAvailabilities": false,
          "combinedProductsPage": false,
          "enableSelfOnboarding": false,
          "reportsV2": false,
          "enableDiscounts": false,
          "enableDelivery": false
        },
        "region": "EU",
        "settings": {
          "taxExcl": false
        },
        "whitelabel": "deliverect",
        "users": [
          "607***ca68"
        ],
        "reportingEndpoints": [
          {
            "endpoint": "https://reporting-endpoint.com/reporting/newOrder",
            "statusTrigger": [
              20
            ],
            "endpointType": 10
          }
        ],
        "_links": {
          "self": {
            "title": "accounts",
            "href": "accounts/5f1***131"
          },
          "related": {
            "users": [
              {
                "title": "users",
                "href": "users/607***a68"
              }
            ],
            "locations": [
              {
                "title": "Locations",
                "href": "locations/5f1***133"
              },
              {
                "title": "Locations",
                "href": "locations/606***b86"
              },
              {
                "title": "Locations",
                "href": "locations/606***555"
              }
            ],
            "accounts": []
          }
        }
      }
    ],
    "_links": {
      "parent": {
        "title": "home",
        "href": "/"
      },
      "self": {
        "title": "accounts",
        "href": "accounts"
      },
      "next": {
        "title": "next page",
        "href": "accounts?page=2"
      },
      "last": {
        "title": "last page",
        "href": "accounts?page=11"
      }
    },
    "_meta": {
      "page": 1,
      "max_results": 25,
      "total": 11
    }
  }).send();
  console.log('[INFO] Data sent');
});

app.listen(CONFIG.MOCK_DELIVERECT_SERVER.PORT, async () => {
  token = await db.token.findFirst().then((token) => token?.value ?? null)
  console.log(`MOCK DELIVERECT SERVER STARTED ON http://localhost:${CONFIG.MOCK_DELIVERECT_SERVER.PORT}`)
});