import request from 'supertest';
import {app, wss} from '../app';
import Joi from 'joi';

const successResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  inventory: Joi.array().items(
    Joi.object({
      coinId: Joi.number().required(),
      amountOwned: Joi.number().required()
    })
  ).required()
});


describe("when testing the endpoints", () => {
  test("test for a successful response payload from the `purchase-coin` endpoint after a buy order is placed", async () => {
    const response = await request(app).post("/purchase-coin").send({
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


describe("when testing the websocket", () => {
  test("test that CoinB incremements by one dollar with each message over a period of time.", async () => {
  });

  test("test that `inventory.<coinId>.amountOwned` correctly reflects your owned inventory following a `purchase-coin` execution.", async () => {
  });
});
