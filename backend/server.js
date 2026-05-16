const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes will be imported here
// const productRoutes = require('./routes/productRoutes');
// app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Amruteswari Satvik Foods API is running...');
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/amruteswari')
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
