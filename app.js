require('dotenv').config();
const connectDb = require('./db/connect')
const express = require('express')
const cors  = require('cors')
const path =require('path')
// const CustomAPIError = require('./error/custom-error')
const errorHandlerMiddleware =require('./error/custom-error')
const notFoundMiddleware= require('./middleware/not-found')
const app = express();
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const productsRouter = require('./router/products')
const categoryRouter = require('./router/categories')
const sellersRouter = require('./router/sellers')
const authRouter = require('./router/auth')
const subCategoriesRouter = require('./router/sub-categories')
const PORT = process.env.PORT || 8000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "e-commerce full project",
      version: '1.0.0'
    },
    servers: [
      { url: 'http://localhost:8000/' } // Corrected from {api: 'http://localhost:8000/'}
    ]
  },
  apis: ['./app.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(cors())
app.use(express.json())
const mongo_uri = process.env.MONGO_URI;
connectDb(mongo_uri).then(() => {
  console.log('connected to db !');
  app.listen(PORT, () => {
    console.log(`App is listening to port ${PORT}`);
  })
}).catch((error) => {
  console.log('error to connect: ', error);
})
  //this is swagger setup for every request  . . . .
  //assets 
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
//routes 
app.get('/',(req , res)=>{
  res.send('hi from test')
})
app.use(process.env.API_DOMAIN+'/products',productsRouter)
app.use(process.env.API_DOMAIN+'/categories',categoryRouter)
app.use(process.env.API_DOMAIN+'/sellers',sellersRouter)
app.use(process.env.API_DOMAIN+'/auth',authRouter)
app.use(process.env.API_DOMAIN+'/sub_categories',subCategoriesRouter)
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get a greeting message
 *     description: Returns a greeting message from the e-commerce app.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             example: 'hi from e-commerce ppp'
 */

app.use(notFoundMiddleware);
// app.use(CustomAPIError);