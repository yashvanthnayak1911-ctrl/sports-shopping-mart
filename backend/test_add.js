const axios = require('axios');

async function testAddProduct() {
    try {
        const productData = {
            name: 'Test Product',
            description: 'This is a test product',
            price: 99.99,
            category: 'Test Category',
            image: 'https://via.placeholder.com/150',
            stock: 50
        };

        console.log('Sending request to http://localhost:5000/api/admin/products/add');
        const response = await axios.post('http://localhost:5000/api/admin/products/add', productData);

        console.log('Success!', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testAddProduct();
