import { Cart , CartDetail } from '../../../persistencia/models/cart.js';
import ProductsManager from '../managers/products.manager.js';
import FileManager from '../../persistencia/dao/fileSystem/files.manager.js';
import { CustomError, NotFoundError } from '../../../persistencia/models/custom.error.js';

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
          throw new CustomError(500010, 'Error al obtener el ultimo id');
        }
      }

    async createCart () {
        try {
          const cart = new Cart();
          cart.cartDetail = [];
          this.fileManager.saveDataToFile(cart);
          return cart;
        } catch (error) {
          if (error instanceof CustomError) throw error;
          throw new CustomError(500020, 'Error al crear el carrito de compra');
        }
      }

    async addCart (cart) {
        try {
          return this.fileManager.saveDataToFile(cart);
        } catch (error) {
          if (error instanceof CustomError) throw error;
          throw new CustomError(20120, 'Error al agregar el carrito de compra');
        }
      }

    async getCartById (id) {
        try{
            let find = (await this.getCarts().find(cart => cart.id === id)||false)
            if (find) {
              return find;
            } else 
            {
              throw new NotFoundError(500110, 'El codigo ID '+ id + ' no corresponde aun carrito.');
            }    
          } catch(error)
          { 
            if (error instanceof CustomError) throw error;
            throw new CustomError(500120, 'Error al obtener carrito');
          }          
      }

     getCarts () {
        try {
          return  this.fileManager.getDataFromFile();
        } catch (error) {
          
          if (error instanceof CustomError) throw error;
          throw new CustomError(500030, 'Error al obtener carritos');
        }
      }  

    async updateCartAndProduct(idCard, idProduct, units=1, addProduct=true){
        try {
          const product = await this.productsManager.getProductById(idProduct);
          const { indexCart, indexCartDetail } = await this.getIndexOfCartAndDetailCartById(idCard, product.id);
          const carts = await this.getCarts();
    
          if (addProduct) {
            if (product.stock < units) {
              throw new CustomError(500210, 'Error solo quedan en stock ' + product.stock + ' productos');
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
                throw new CustomError(500220, 'Error solo puede quitar ' + cartDetail.quantity + ' productos del carrito de compras');
              }
              cartDetail.quantity -= units;
            }
          }
    
          await this.productsManager.updateProduct({ id: product.id, stock: product.stock });
  
          this.fileManager.saveAllDataToFile(carts);
          return carts[indexCart] ;
        } catch (error) {
          if (error instanceof CustomError) throw error;
          throw new CustomError(500230, 'Error al actualizar el carrito de compra ' +error);
        }
      }
      
    
    async getIndexOfCartAndDetailCartById(idCart, idProduct){
        try {
          const carts = await this.getCarts();
          const indexOfCart = carts.findIndex(cart => cart.id === idCart);
          if (indexOfCart === -1) throw new CustomError(500310, 'Error al obtener el carrito de compra y sus productos');
          
          const indexOfCartDetail = carts[indexOfCart].cartDetail.findIndex(cartDetail => cartDetail.productId === idProduct);  
            
          return {
            indexCart: indexOfCart,
            indexCartDetail: indexOfCartDetail,
          };
        } catch (error) {
          if (error instanceof CustomError) throw error;
          throw new CustomError(500320, 'Error al obtener el carrito de compra y sus productos');
        }
      }


    async deleteCart (id) {
        try {
          const carts = await this.getCarts();
          const indexOfCart = carts.findIndex(cart => cart.id === id);
    
          if (indexOfCart === -1) throw new NotFoundError(500410, 'Carrito de compras no encontrado');
          
    
          carts.splice(indexOfCart, 1);
    
          return this.fileManager.saveAllDataToFile(carts);
        } catch (error) {
          if (error instanceof CustomError) throw error;
          throw new CustomError(500420, 'Error al eliminar el carrito de compra');
        }
      }

}

export default CartsManager;