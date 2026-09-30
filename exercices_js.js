const products = [
  { name: 'Keyboard', price: 45 },
  { name: 'Monitor', price: 320 },
  { name: 'Mouse', price: 25 }
];

// 1. Destructuring
const { name, price } = products[0];
console.log(`${name}${price}`);

// 2. find
const mouse = products.find(p => p.name === 'Mouse');
console.log(mouse.price);

// 3. filter
const cheapProducts = products.filter(p => p.price < 100);
console.log(cheapProducts);

// 4. Arrow function withDiscount
const withDiscount = (price) => price * 0.9;
console.log(withDiscount(320));