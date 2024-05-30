const express = require('express');
const axios = require('axios');

const app = express();

// Supported companies and categories
const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const categories = [
    "Phone", "Computer", "TV", "Earphone", "Tablet", "Charger", "Mouse", 
    "Keypad", "Bluetooth", "Pendrive", "Remote", "Speaker", "Headset", 
    "Laptop", "PC"
];

const fetchProducts = async (company, category) => {
    try {
        const response = await axios.get(`http://20.244.56.144/test/companies/${company}/categories/${category}/products`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MDc2MDQ3LCJpYXQiOjE3MTcwNzU3NDcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjExZTc2YWM0LThkZWYtNDMxYi1iNGZmLWM0ZTQ1NzJmZTE1NiIsInN1YiI6InB1cnVtYW5pYXNoaXNocmVkZHlAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkbWVkIiwiY2xpZW50SUQiOiIxMWU3NmFjNC04ZGVmLTQzMWItYjRmZi1jNGU0NTcyZmUxNTYiLCJjbGllbnRTZWNyZXQiOiJpVWV5dkJmaEZpcFZjb0pyIiwib3duZXJOYW1lIjoiUC5Bc2hpc2ggUmVkZHkiLCJvd25lckVtYWlsIjoicHVydW1hbmlhc2hpc2hyZWRkeUBnbWFpbC5jb20iLCJyb2xsTm8iOiIyNDUzMjE3MzMwNDkifQ.ETvRLl5xr1vYP7TVnxeiTRlK4Q5rgQsg9vE531y-7Aw"
            }
        });

        return response.data;
    } catch (error) {
        console.log('Error fetching products');
    }
};

const generateProductId = (company, product) => {
    return `${company}_${product.id}`;
};

app.get('/categories/:categoryname/products', async (req, res) => {
    const { categoryname } = req.params;

    try {

        const allProducts = [];

        for (const company of companies) {
            const products = await fetchProducts(company, categoryname);
            const formattedProducts = products.map(product => ({
                id: generateProductId(company, product),
                name: product.name,
                price: product.price,
                rating: product.rating,
                company,
                discount: product.discount
            }));
            allProducts.push(...formattedProducts);
        }

        res.json(allProducts);
    } catch (error) {
        console.log('Error getting products');
    }
});

app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    const { categoryname, productid } = req.params;

    try {
        const [company, productId] = productid.split('_');

        const products = await fetchProducts(company, categoryname);
        const product = products.find(p => generateProductId(company, p) === productid);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const formattedProduct = {
            id: generateProductId(company, product),
            name: product.name,
            price: product.price,
            rating: product.rating,
            company,
            discount: product.discount,
            description: product.description
        };

        res.json(formattedProduct);
    } catch (error) {
        console.log('Error getting product details');
    }
});

app.listen(3000, console.log("Server is running on 3000"));
