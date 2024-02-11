import { randomUUID } from 'node:crypto'

class Cart {
    #_id;
    #cartDetail;

    constructor({id, cartDetail}) {
        this.#_id = id || randomUUID();
        this.#cartDetail = cartDetail || [];
    }

    get _id() { return this.#_id }
    get cartDetail() { return this.#cartDetail }

    set cartDetail(value) {this.#cartDetail = value}

    getCartPOJO (){ //Plain Old Javascript Object
        return {
                    _id : this.#_id,
                    cartDetail : this.#cartDetail
                }
    }
}

class CartDetail {
    #product;
    #quantity;

    constructor({productId, quantity}) {
        this.product = productId;
        this.quantity = quantity;
    }

    get product() { return this.#product }
    get quantity() { return this.#quantity }

    set product(value) {this.#product = value}
    set quantity(value) {this.#quantity = value}

    getCartDetailPOJO (){ //Plain Old Javascript Object
        return {
                    productId : this.#product,
                    quantity : this.#quantity
                }
    }

}




export {Cart,CartDetail};