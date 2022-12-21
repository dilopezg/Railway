
(function () {
    
    const formProduct = document.getElementById('form-Product');
    const formMessage = document.getElementById('form-message');
    const inputEmail= document.getElementById('input-email');
    const inputName= document.getElementById('input-name');
    const inputLastname= document.getElementById('input-lastname');
    const inputAge= document.getElementById('input-age');
    const inputUser= document.getElementById('input-user');
    const inputAvatar= document.getElementById('input-avatar');
    const inputMessage = document.getElementById('input-message');
    const listMessages = document.getElementById('list-messages');
    const tituloCompresion = document.getElementById('titulo-compresion');
    
    let messages = [];
    let productos = [];
      
    const socket = io();

  
    function showMessage(data) {
      const li = document.createElement('li');
      console.log(data)
      li.innerHTML = `
      <div>
      <em class="text-primary font-weight-bolder">${data.author.email}</em>
      [<em class="text-danger">${data.date}</em>]: <em class="text-success fst-italic">${data.message} </em> <img src="${data.author.avatar}"/>
      </div>`;
      listMessages.appendChild(li);
    }

    function data2TableHBS(productos){
        return fetch('plantilla/lista.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla =>{
            const template = Handlebars.compile(plantilla);
            const html = template ({productos})
            return html
            
        })
    }
        
    formProduct.addEventListener('submit', event => {
        event.preventDefault();
        const data = { 
            title: formProduct[0].value, 
            price: formProduct[1].value, 
            thumbnail: formProduct[2].value };
        socket.emit('new-producto', data);
        console.log(data);
    });

    formMessage.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = {
        author: {
          email: inputEmail.value,
          name: inputName.value,
          lastname: inputLastname.value,
          age: inputAge.value,
          alias: inputUser.value,
          avatar: inputAvatar.value,
        },
        message: inputMessage.value,
      };
      socket.emit('new-message', data);
      inputMessage.value = '';
      inputMessage.focus();
    });
  
    socket.on('connect', () => {
      console.log('Conectados al servidor');
    });
  
    socket.on('history-messages', (data) => {
      const autorScheme = new normalizr.schema.Entity(
            'author',
            {},
            { idAttribute: 'email' }
        );
    
      const postScheme = new normalizr.schema.Entity('post', {
            author: autorScheme,
        });
      const mensajeTotla = new normalizr.schema.Entity('mensaje', {
            post: [postScheme],
        }); 

      const dataReversed = normalizr.denormalize(
            data.result,
            mensajeTotla,
            data.entities
      );

      console.log(dataReversed);

      const originalSize = JSON.stringify(dataReversed).length;
      const normalizedSize = JSON.stringify(data).length;
      const resultSata = (normalizedSize * 100) / originalSize;
      let totalTotal = resultSata.toFixed(2);
      console.log(data, normalizedSize);

      console.log(
            '--------------------------------------------------------------------'
      );
      console.log(dataReversed, originalSize);
      tituloCompresion.innerText = '';
      console.log(`Porcentaje de compresión: ${totalTotal}%`);
      tituloCompresion.innerText = `Porcentaje de compresión: ${totalTotal}%`;
      const messages = dataReversed.post;
      listMessages.innerHTML = '';
      messages.forEach((messages) => {
            showMessage(messages);
      });
    });  
       
    socket.on('productos', productos => {
        data2TableHBS(productos).then(html => {
            document.getElementById('datos').
                innerHTML = html            
        })       
    });
    
        
    
})();