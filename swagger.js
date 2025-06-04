 const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'Book Api',
        description: 'Book Api'

    },
    host: 'bookapi-vk60.onrender.com/',
     schemes: ['https']
 };

const outputfile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

 swaggerAutogen(outputfile, endpointsFiles, doc);