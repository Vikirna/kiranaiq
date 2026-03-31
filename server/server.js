const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()

const app = express()

app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://kiranaiq-kappa.vercel.app'
    ],
    credentials: true
  }))
app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/sales', require('./routes/salesRoutes'))
app.use('/api/predictions', require('./routes/predictionRoutes'))
app.use('/api/external', require('./routes/externalRoutes'))

app.get('/', (req, res) => res.json({ message: 'KiranaIQ API running' }))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))