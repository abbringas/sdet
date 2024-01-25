export class TradingPage {
    url = "/";

    $ = {
        inventory: {
            lblBalance: () => cy.contains(".inventory div", "Balance:"),
            inventoryItem: {
                lblCoinsOwned: (coinName: string) => cy.contains(".inventory-item div:nth-child(1)", coinName).parent('.inventory-item').contains('div', "Coins owned:"),
                lblMarketValue: (coinName: string) => cy.contains(".inventory-item div:nth-child(1)", coinName).parent('.inventory-item').contains('div', "Market value:")
            },
            lblTotalPorfolioValue: () => cy.contains(".inventory div", "Total Portfolio Value:"),
        },
        availableCoins: {
            lblAvailableCoinNames: () => cy.get(".ticket-name"),
            lblCoinPrice: (coinName: string) => cy.contains(".ticket-name", coinName).parent(".ticket").find('.ticket-price'),
            inputPurchase: (coinName: string) => cy.contains(".ticket-name", coinName).parent(".ticket").find('.purchase-input'),
            btnBuy: (coinName: string) => cy.contains(".ticket-name", coinName).parent(".ticket").contains('button', "Buy"),
            btnSell: (coinName: string) => cy.contains(".ticket-name", coinName).parent(".ticket").contains('button', "Sell")
        }

    }

    /**
     * Navigates to the trading page.
     */
    visit() {
        cy.log('Visiting the trading page.');
        cy.visit(this.url);
    }

    /**
     * Verifies if the balance value on the page matches the expected amount.
     * @param {number} expectedAmount - The expected balance amount.
     */
    verifyBalanceValue(expectedAmount: number) {
        cy.log(`Verifying balance value. Expected amount: ${expectedAmount}`);
        this.$.inventory.lblBalance().getNumericValue().should('equal', expectedAmount);
    }

    /**
     * Verifies if the count of available coins matches the expected count.
     * @param {number} expectedCount - The expected count of available coins.
     */
    verifyAvailableCoinsCount(expectedCount: number) {
        cy.log(`Verifying the count of available coins. Expected count: ${expectedCount}`);
        this.$.availableCoins.lblAvailableCoinNames().should('have.length', expectedCount);
    }

    /**
     * Verifies if the count of coins owned for a specific coin matches the expected count.
     * @param {string} coinName - The name of the coin to check.
     * @param {number} expectedCount - The expected count of coins owned.
     */
    verifyCoinsOwnedCount(coinName: string, expectedCount: number) {
        cy.log(`Verifying coins owned count for ${coinName}. Expected count: ${expectedCount}`);
        this.$.inventory.inventoryItem.lblCoinsOwned(coinName).getNumericValue().should('equal', expectedCount);
    }

    /**
     * Verifies the market value of a specific coin.
     * @param {string} coinName - The name of the coin to check.
     */
    verifyCoinMarketValue(coinName: string) {
        cy.log(`Verifying market value for ${coinName}.`);
        // Get the actual coins owned count
        this.$.inventory.inventoryItem.lblCoinsOwned(coinName).getNumericValue().then((actualCoinsOwnedCount) => {
            // Get the actual coin price
            this.$.availableCoins.lblCoinPrice(coinName).getNumericValue().then((actualCoinPrice) => {
                const expectedMarketValue = actualCoinsOwnedCount * actualCoinPrice;
                cy.log(`Expected market value for ${coinName}: ${expectedMarketValue}`);
                // Assert the expected market value
                this.$.inventory.inventoryItem.lblMarketValue(coinName).getNumericValue().should('equal', expectedMarketValue);
            });
        });
    }

    /**
     * Executes a coin purchase transaction.
     * @param {string} coinName - The name of the coin to purchase.
     * @param {number} quantity - The quantity of the coin to purchase.
     */
    buyCoin(coinName: string, quantity: number) {
        cy.log(`Attempting to buy ${quantity} of ${coinName}.`);
        cy.intercept("POST", `/purchase-coin`).as("waitPurchaseCoin");
        this.$.availableCoins.inputPurchase(coinName).type(quantity.toString());
        this.$.availableCoins.btnBuy(coinName).click();
        cy.wait("@waitPurchaseCoin");
        cy.log(`${quantity} of ${coinName} purchased.`);
        return this;
    }
}
export default new TradingPage();