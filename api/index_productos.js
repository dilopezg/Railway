const  {faker} =  require ('@faker-js/faker');
faker.locale = 'es';
const fs = require("fs");

const { commerce, image } = faker;

class Producto {

    constructor(archivo) {
        this.archivo = archivo;
    }

    escribirArchivo(archivo, contenido) {
        try {
              fs.writeFileSync(
                    archivo,
                    JSON.stringify(contenido, null, 2),
                    "utf-8"
              );
        } catch (error) {
              console.log(error.message);
        }
  }

      leerArchivo(archivo) {
        try {
              const data = fs.readFileSync(archivo, "utf-8");
              return JSON.parse(data);
        } catch (error) {
              console.log(error.message);
        }
  }

    generar() {
        for (let index = 0; index < parseInt(5); index++) {            
            const productos = this.leerArchivo(this.archivo);
            productos.push({
            id: index + 1,
            title: commerce.product(),
            price: Number(commerce.price()),
            thumbnail: image.imageUrl(),
            });
            this.escribirArchivo(this.archivo, productos)
        }
        return this.listar();
      }

    listar() {
        return this.leerArchivo(this.archivo);
    }

   
    guardar(producto) {
        const productos = this.leerArchivo(this.archivo)
        producto.id = productos.length + 1;
        productos.push(producto)
        this.escribirArchivo(this.archivo, productos)
        return productos;
    }

}

module.exports = Producto;