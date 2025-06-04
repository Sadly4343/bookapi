 const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'Book Api',
        description: 'Book Api'

    },
    host: 'localhost:3000',
     schemes: ['https', 'http']
 };

const outputfile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

 swaggerAutogen(outputfile, endpointsFiles, doc);