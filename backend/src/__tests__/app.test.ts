import request from 'superwstest';
import { server } from '../index';
import Joi from 'joi';

describe("when testing the endpoints", () => {
  afterEach(() => {
    request.closeAll(); // recommended when using remote servers
  });

  const successResponseSchema = Joi.object({
    success: Joi.boolean().required(),
    inventory: Joi.array().items(
      Joi.object({
        coinId: Joi.number().required(),
        amountOwned: Joi.number().required()
      })
    ).required()
  });

  test("test for a successful response payload from the `purchase-coin` endpoint after a buy order is placed", async () => {
    const response = await request(server).post("/purchase-coin").send({
      coinId: 2,
      amount: 2
    });
    expect(response.statusCode).toBe(200);
    // Validate the schema of the response
    const { error } = successResponseSchema.validate(response.body);
    // Ensure there are no validation errors
    expect(error).toBeUndefined(); 
  });
});


describe('When testing the websocket', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('Test that CoinB incremements by one dollar with each message over a period of time.', async () => {
    // Initialize variables to store initial and updated CoinB prices
    let initialCoinPrice: number;
    let updatedCoinPrice: number;

    await request(server)
      .ws('/')
      .expectJson((message) => {
        // Capture the initial price of CoinB
        initialCoinPrice = message.coins.find((coin: any) => coin.id === 3).price;
        console.log(`Initial CoinB Price: ${initialCoinPrice}`);
      })
      .expectJson((message) => {
        // Capture the updated price of CoinB
        updatedCoinPrice = message.coins.find((coin: any) => coin.id === 3).price;
        console.log(`Updated CoinB Price: ${updatedCoinPrice}`);

        // Validate that CoinB price increased by 1
        expect(updatedCoinPrice).toEqual(++initialCoinPrice);

        console.log(`WebSocket message received: ${JSON.stringify(message)}`);
      });
  }, 10000);

  it('Test that `inventory.<coinId>.amountOwned` correctly reflects your owned inventory following a `purchase-coin` execution.', async () => {
    const coinId:number = 3;
    const amount:number = 5;
    // Initialize variables to store initial and updated coin price
    let initialAmountOwned: number;
    let updatedAmountOwned: number;

    // Define the makePurchase function
    const makePurchase = async (coinId:number, amount:number) => {
      const purchasePayload = {
        coinId: coinId,
        amount: amount,
      };
    
      const purchaseResponse = await request(server)
        .post('/purchase-coin')
        .send(purchasePayload)
        .expect(200);
    };

    await request(server)
      .ws('/')
      .expectJson((message) => {
        // Capture the initial AmountOwned
        initialAmountOwned = message.inventory.find((inventoryItem: any) => inventoryItem.coinId === 3).amountOwned;
        console.log(`Initial AmountOwned: ${initialAmountOwned}`);
      })
      .exec((ws) => {
        makePurchase(coinId,amount);
      })
      .expectJson((message) => {
        // Capture the updated AmountOwned
        updatedAmountOwned = message.inventory.find((inventoryItem: any) => inventoryItem.coinId === 3).amountOwned;
        console.log(`Updated AmountOwned: ${updatedAmountOwned}`);

        // Validate that AmountOwned increased by purchased amount
        expect(updatedAmountOwned).toEqual(initialAmountOwned + amount);

        console.log(`WebSocket message received: ${JSON.stringify(message)}`);
      });
  }, 10000);
});