import { Cart , CartDetail } from '../model/cart.js';
import ProductsManager from '../manager/products.manager.js';
import FileManager from '../manager/files.manager.js';

class CartsManager {
    productsManager;
    fileManager;
  
    constructor() {
      this.fileManager = new FileManager('\\data\\carts.json');
      this.productsManager = new ProductsManager();
      this.getLatestIdCart();
    }

     getLatestIdCart() {
        try {
          const carts =  this.getCarts();
          if (carts.length > 0) Cart.id = carts.reduce((prev, current) => (prev.id > current.id ? prev : current)).id;
          else Cart.id = 0;
        } catch (error) {
          //throw new CustomError(200101, 'Error al obtener el ultimo id');
          throw new Error ('200101|Error al obtener el ultimo id');
        }
      }

    async createCart () {
        try {
          const cart = new Cart();
          cart.cartDetail = [];
          return this.fileManager.saveDataToFile(cart);
        } catch (error) {
          //if (error instanceof CustomError) throw error;
          //throw new CustomError(20101, 'Error al crear el carrito de compra');
          throw new Error ('20101|Error al obtener el ultimo id');

        }
      }

    async addCart (cart) {
        try {
          return this.fileManager.saveDataToFile(cart);
        } catch (error) {
          if (error instanceof CustomError) throw error;
          //throw new CustomError(20120, 'Error al agregar el carrito de compra');
          throw new Error ('20120|Error al obtener el ultimo id');

        }
      }

    async getCartById (id) {
          let find = (await this.getCarts().find(cart => cart.id === id)||false)
          if (find) {
            return find;
          } else 
          {
            throw new Error ('40020|El codigo ID '+ id + ' no corresponde aun carrito.') 
          }              
      }

     getCarts () {
        try {
          return  this.fileManager.getDataFromFile();
        } catch (error) {
            throw new Error ('20110|Error al obtener el ultimo id');

          //if (error instanceof CustomError) throw error;
          //throw new CustomError(20110, 'Error al obtener el carrito de compra');
        }
      }  

    async updateCartAndProduct(idCard, idProduct, units=1, addProduct=true){
        try {
          const product = await this.productsManager.getProductById(idProduct);
          const { indexCart, indexCartDetail } = await this.getIndex(idCard, product.id);
          const carts = await this.getCarts();
    
          if (addProduct) {
            if (product.stock < units) {
              throw new Error ('10015|Error solo quedan en stock ' + product.stock + ' productos');
            }
            product.stock -= units;
          } else {
            product.stock += units;
          }
    
          if (indexCartDetail === -1) {
            carts[indexCart].cartDetail.push(new CartDetail(product.id, units));
          }
          else {
            const cartDetail = carts[indexCart].cartDetail[indexCartDetail];
            if (addProduct) {
                cartDetail.quantity += units;
            } else {
              if (cartDetail.quantity < units) {
                throw new Error ('10016|Error solo puede quitar ' + cartDetail.quantity + ' productos del carrito de compras');
              }
              cartDetail.quantity -= units;
            }
          }
    
          await this.productsManager.updateProduct({ id: product.id, stock: product.stock });
    
          return this.fileManager.saveAllDataToFile(carts);
        } catch (error) {
          throw new Error ('20130|Error al actualizar el carrito de compra ' +error);
        }
      }
      
    
    async getIndex(idCart, idProduct){
        try {
          const carts = await this.getCarts();
          const indexOfCart = carts.findIndex(cart => cart.id === idCart);
          if (indexOfCart === -1) throw new Error ('20111|Error al obtener el carrito de compra y sus productos');

          const indexOfCartDetail = carts[indexOfCart].cartDetail.findIndex(cartDetail => cartDetail.productId === idProduct);  
            
          return {
            indexCart: indexOfCart,
            indexCartDetail: indexOfCartDetail,
          };
        } catch (error) {
          throw new Error ('20113|Error al obtener el carrito de compra y sus productos '+error);
        }
      }


    async deleteCart (id) {
        try {
          const carts = await this.getCarts();
          const indexOfCart = carts.findIndex(cart => cart.id === id);
    
          if (indexOfCart === -1) throw new Error ('20111|Error al obtener el ultimo id');
          //throw new NotFoundError(20111, 'Carrito de compras no encontrado');
    
          carts.splice(indexOfCart, 1);
    
          return this.fileManager.saveAllDataToFile(carts);
        } catch (error) {
            throw new Error ('20111|Error al obtener el ultimo id');
            //if (error instanceof CustomError) throw error;
          //throw new CustomError(20140, 'Error al eliminar el carrito de compra');
        }
      }

}

export default CartsManager;