const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Разрешаем браузеру общаться с сервером и принимаем JSON
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Раздаем файлы (наш index.html)

// Имитация базы данных (в памяти)
let products = []; 
let idCounter = 1;

// 1. Получить список товаров
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 2. Добавить товар
app.post('/api/products', (req, res) => {
    const { title, price, description, image } = req.body;
    
    const newProduct = {
        id: idCounter++,
        title,
        price,
        description,
        image: image || 'https://via.placeholder.com/150', // Заглушка, если нет фото
        isOnAvito: false,
        createdAt: new Date()
    };

    products.push(newProduct);
    console.log(`Товар добавлен: ${title}`);
    res.json({ success: true, product: newProduct });
});

// 3. Отправить на Авито (Имитация)
app.post('/api/publish-avito', (req, res) => {
    const { id } = req.body;
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ success: false, message: 'Товар не найден' });
    }

    // ЗДЕСЬ БУДЕТ РЕАЛЬНЫЙ ЗАПРОС К API AVITO
    // Сейчас мы просто имитируем задержку и успех
    console.log(`--- ОТПРАВКА НА АВИТО ---`);
    console.log(`Заголовок: ${product.title}`);
    console.log(`Цена: ${product.price}`);
    console.log(`Описание: ${product.description}`);
    
    setTimeout(() => {
        product.isOnAvito = true;
        console.log(`Товар "${product.title}" успешно опубликован на Авито!`);
        res.json({ success: true, message: 'Опубликовано на Авито' });
    }, 1000);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});