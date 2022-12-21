process.on('message', function (message) {
    console.log(`Message from app.js: ${message}`);
});

let repeat = parseInt(process.argv[2]);

function random (repeat) {
    let object = {};
    for (let i = 0; i < repeat; i++) {
        let number = Math.floor(Math.random() * 1000) + 1;
        if (object[number]) {
            object[number]++;
        }else {
            object[number] = 1;
        }
    }
    return object;
  };

  process.send(random(repeat));