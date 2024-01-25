import TradingPage from "../support/pages/tradingPage"
import data from "../fixtures/manageCryptoTrading.json"

describe('Verify page default state', () => {
  beforeEach(function () {
    TradingPage.visit();
  })

  it('assert that you begin with a $1000 USD balance', () => {
    TradingPage.verifyBalanceValue(1000);
  })

  it('assert that there are four coin options available', () => {
    TradingPage.verifyAvailableCoinsCount(4);
  })


})

data.forEach(function (coin: any) {
  describe(`Verify inventory calculations - ${coin.name}`, () => {

    beforeEach(function () {
      TradingPage.visit();
      TradingPage.buyCoin(coin.name, coin.quantity)
    })

    it('assert "Coins owned" has incremented by the quantity you provided', () => {
      TradingPage.verifyCoinsOwnedCount(coin.name, coin.quantity);
    })

    it('assert that the "Market value" correctly reflects the cost per coin', () => {
      TradingPage.verifyCoinMarketValue(coin.name);
    })
  })
})