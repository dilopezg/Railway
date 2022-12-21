const { schema, normalize, denormalize } = require('normalizr');
const { v4: uuidv4 } = require('uuid');

function Normalizador(data) {

    
    let pruebaData = {
        id: 'mensaje',
        post: [],
    };

    

    data.map((item) => {
        pruebaData.post.push({
            id: uuidv4(),
            message: item.message,
            date: item.time,
            author: {
                email: item.author.email,
                nombre: item.author.name,
                apellido: item.author.lastname,
                edad: item.author.age,
                alias: item.author.alias,
                avatar: item.author.avatar,
            },
        });
    });

    

    const autorScheme = new schema.Entity(
        'author',
        {},
        { idAttribute: 'email' }
    );

    const postScheme = new schema.Entity('post', {
        author: autorScheme,
    });
    const mensajeTotla = new schema.Entity('mensaje', {
        post: [postScheme],
    });
    const dataNormalized = normalize(pruebaData, mensajeTotla);

    

    return dataNormalized;
}

module.exports = Normalizador;