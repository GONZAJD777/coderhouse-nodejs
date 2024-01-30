class Cart {
    static id = 0;

    constructor(id, cartDetail) {
        this.id = id || ++Cart.id;
        this.cartDetail = cartDetail;
    }
}

class CartDetail {
    constructor(productId, quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }
}

export {Cart,CartDetail};