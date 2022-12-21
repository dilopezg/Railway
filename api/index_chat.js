const fs = require("fs");
class MessageController {
      constructor(archivo) {
            this.archivo = archivo;
      }

      async escribirArchivo(archivo, contenido) {
            try {
                  await fs.writeFileSync(
                        archivo,
                        JSON.stringify(contenido, null, 2),
                        "utf-8"
                  );
            } catch (error) {
                  console.log(error.message);
            }
      }

      async leerArchivo(archivo) {
            try {
                  const data = await fs.readFileSync(archivo, "utf-8");
                  
                  return JSON.parse(data);
                  
            } catch (error) {
                  console.log(error.message);
            }
      }

      saberSiExiste(archivo) {
            try {
                  if (!fs.existsSync(archivo)) {
                        throw new Error("El archivo no se encontro!!");
                  } else {
                        return true;
                  }
            } catch (error) {
                  console.log(error.message);
            }
      }

      async save(message) {
            try {

                  if (!this.saberSiExiste(this.archivo)) {

                        let arrayMessages = [];

                        arrayMessages.push(message);

                        await this.escribirArchivo(this.archivo, arrayMessages);

                        return;
                  } else {

                        if (this.leerArchivo(this.archivo)) {
                              const data = await this.leerArchivo(this.archivo);

                              data.push(message);

                              this.escribirArchivo(this.archivo, data);
                        }
                  }
            } catch (error) {
                  console.log(error.message);
            }
      }

      async getAll() {
            try {

                  if (this.saberSiExiste(this.archivo)) {
                        const data = await this.leerArchivo(this.archivo);

                        if (data.length !== 0) {
                              return data;
                        } else {
                              
                              throw new Error(
                                    `el archivo ${this.archivo} esta vacio`
                              );
                        }
                  }
            } catch (error) {
                  console.log(error.message);
            }
      }
}
module.exports = MessageController;
