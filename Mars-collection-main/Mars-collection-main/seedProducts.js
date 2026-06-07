const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Load environment variables
dotenv.config();

const products = [
  {
    name: 'MARS Signature Box Hoodie',
    description: 'An oversized hoodie crafted from ultra-heavyweight 480gsm organic cotton loopback. Featuring dropped shoulders, a double-layered hood without drawstrings for a clean look, and a subtle tone-on-tone embroidered MARS insignia on the center chest.',
    price: 180.00,
    category: 'Hoodies',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#EAEAE0', '#0A0A0A'], // Beige, Black
    stock: 25,
    rating: 4.8,
    numReviews: 12,
    isFeatured: true,
    isTrending: true,
    discount: 0,
    reviews: [
      { name: 'Marcus Vance', rating: 5, comment: 'Absolutely incredible quality. The weight is perfect and feels like high-end luxury fashion.', user: new mongoose.Types.ObjectId() },
      { name: 'Chloe Chen', rating: 4, comment: 'Very warm and thick. The beige color is exactly what I was looking for.', user: new mongoose.Types.ObjectId() }
    ]
  },
  {
    name: 'Oversized Minimalist Hoodie',
    description: 'Constructed from premium heavy French terry cotton. This hoodie features an architectural oversized drape, cropped body length, rib-knit cuffs, and clean raw-edge hems. Designed in our signature charcoal colorway.',
    price: 195.00,
    category: 'Hoodies',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800',
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a55?q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#2F3136', '#EAEAE0'], // Charcoal, Muted Beige
    stock: 30,
    rating: 4.7,
    numReviews: 8,
    isFeatured: false,
    isTrending: true,
    discount: 10, // 10% off
    reviews: [
      { name: 'Sarah K.', rating: 5, comment: 'Super comfy! It fits loose but still looks structured and high-fashion.', user: new mongoose.Types.ObjectId() }
    ]
  },
  {
    name: 'Heavyweight Luxury Tee',
    description: 'A boxy, heavy-duty t-shirt knit from 280gsm pre-shrunk combed cotton. Features a tight, thick collar rib, clean double-needle stitching, and a clean structured drape that holds its shape over time.',
    price: 75.00,
    category: 'T-Shirts',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#FFFFFF', '#0A0A0A', '#C5A880'], // Off-white, Black, Muted Gold
    stock: 50,
    rating: 4.9,
    numReviews: 24,
    isFeatured: true,
    isTrending: false,
    discount: 0,
    reviews: [
      { name: 'Derek H.', rating: 5, comment: 'The best blank tee I own. Heavyweight fabric but extremely soft.', user: new mongoose.Types.ObjectId() }
    ]
  },
  {
    name: 'Classic Pima Cotton Tee',
    description: 'An everyday essential crafted from long-staple Peruvian Pima cotton for unmatched softness, durability, and a light sheen. Designed in a tailored fit with a slim neckband.',
    price: 65.00,
    category: 'T-Shirts',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#C5A880', '#FFFFFF', '#0A0A0A'], // Beige Sand, White, Black
    stock: 40,
    rating: 4.5,
    numReviews: 15,
    isFeatured: false,
    isTrending: true,
    discount: 15, // 15% off
    reviews: []
  },
  {
    name: 'Modern Sherpa Trucker Jacket',
    description: 'An iconic streetwear silhouette updated with a premium wool-blend outer shell and lined with plush, insulating faux-sherpa fleece. Features gold-toned custom MARS hardware, side welt pockets, and adjustable waist tabs.',
    price: 280.00,
    category: 'Jackets',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#C5A880', '#0A0A0A'], // Tan Beige, Black
    stock: 3, // Low stock for alert demonstration!
    rating: 4.6,
    numReviews: 5,
    isFeatured: true,
    isTrending: true,
    discount: 0,
    reviews: []
  },
  {
    name: 'Sleek Tailored Trench Coat',
    description: 'A double-breasted trench coat constructed from waterproof, heavy-duty gabardine cotton. Features an adjustable self-tie belt, notched lapels, storm flaps, and a premium silk-satin inner lining.',
    price: 395.00,
    category: 'Jackets',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800',
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#0A0A0A', '#C5A880'], // Black, Beige
    stock: 12,
    rating: 4.9,
    numReviews: 10,
    isFeatured: true,
    isTrending: false,
    discount: 5,
    reviews: []
  },
  {
    name: 'MARS Street Low Sneakers',
    description: 'Meticulously handcrafted in Italy using full-grain calfskin leather. Features a clean, retro-inspired cupsole design, Margom rubber soles, memory-foam insoles, and our signature gold-foil logo stamped on the outer heel.',
    price: 240.00,
    category: 'Footwear',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800'
    ],
    sizes: ['8', '9', '10', '11'],
    colors: ['#FFFFFF', '#0A0A0A'], // White, Black
    stock: 18,
    rating: 4.8,
    numReviews: 18,
    isFeatured: true,
    isTrending: true,
    discount: 0,
    reviews: [
      { name: 'Leon G.', rating: 5, comment: 'Insanely clean and comfortable. Comparable to sneakers twice the price.', user: new mongoose.Types.ObjectId() }
    ]
  },
  {
    name: 'Classic Suede Chelsea Boots',
    description: 'Premium calf suede upper with flexible elastic side panels. Featuring pull tabs for ease of entry, leather lining, and a stacked crepe rubber sole for ultimate cushioned comfort.',
    price: 260.00,
    category: 'Footwear',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800',
      'https://images.unsplash.com/photo-1638247025967-b4e38f6893b6?q=80&w=800'
    ],
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['#C5A880', '#0A0A0A'], // Taupe Beige, Black
    stock: 15,
    rating: 4.7,
    numReviews: 6,
    isFeatured: false,
    isTrending: false,
    discount: 10,
    reviews: []
  },
  {
    name: 'Premium Leather Crossbody Bag',
    description: 'Crafted from pebbled Italian leather with polished gold-toned custom zippers. Features a structured silhouette, lined interior divider pockets, and an adjustable shoulder strap.',
    price: 160.00,
    category: 'Accessories',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800'
    ],
    sizes: ['One Size'],
    colors: ['#0A0A0A', '#C5A880'], // Black, Beige
    stock: 22,
    rating: 4.9,
    numReviews: 11,
    isFeatured: true,
    isTrending: true,
    discount: 0,
    reviews: []
  },
  {
    name: 'MARS Gold Emblem Ring',
    description: 'An elegant signet ring cast in solid sterling silver, plated in 18k yellow gold. Features a flat brushed top face debossed with the MARS logo emblem.',
    price: 90.00,
    category: 'Accessories',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800'
    ],
    sizes: ['7', '8', '9'],
    colors: ['#D4AF37'], // Gold
    stock: 2, // Low stock alert!
    rating: 4.4,
    numReviews: 4,
    isFeatured: false,
    isTrending: false,
    discount: 0,
    reviews: []
  },
  {
    name: 'Luxury Acetate Sunglasses',
    description: 'Hand-polished biological acetate frames paired with scratch-resistant nylon lenses offering 100% UVA/UVB protection. Reinforced with seven-bar barrel hinges for durability.',
    price: 110.00,
    category: 'Accessories',
    brand: 'MARS',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800'
    ],
    sizes: ['One Size'],
    colors: ['#0A0A0A', '#C5A880'], // Glossy Black, Tortoise Beige
    stock: 35,
    rating: 4.8,
    numReviews: 9,
    isFeatured: false,
    isTrending: true,
    discount: 20, // 20% off
    reviews: []
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mars-collection';
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Database connected.');

    // Clear existing collections
    console.log('Clearing old collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // Create Admin User
    console.log('Seeding Admin account...');
    const adminUser = await User.create({
      name: 'MARS Admin',
      email: 'admin@marscollection.com',
      password: 'admin12345',
      role: 'admin',
      address: {
        street: '100 Luxury Way',
        city: 'Beverly Hills',
        state: 'CA',
        zip: '90210',
        country: 'United States',
      },
    });

    // Create Customer User
    console.log('Seeding Customer account...');
    const customerUser = await User.create({
      name: 'Jane Doe',
      email: 'customer@marscollection.com',
      password: 'password123',
      role: 'customer',
      address: {
        street: '456 Minimalist Ave',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
      },
    });

    // Create Products
    console.log('Seeding Product inventory...');
    const dbProducts = await Product.insertMany(products);
    console.log(`${dbProducts.length} products loaded.`);

    // Create Sample Orders for analytics graphs!
    console.log('Seeding Mock Orders for charts...');
    
    // Order 1: Delivered order in January
    const order1 = new Order({
      user: customerUser._id,
      orderItems: [
        {
          name: dbProducts[0].name,
          qty: 1,
          image: dbProducts[0].images[0],
          price: dbProducts[0].price,
          size: 'M',
          color: 'Beige',
          product: dbProducts[0]._id,
        },
        {
          name: dbProducts[2].name,
          qty: 2,
          image: dbProducts[2].images[0],
          price: dbProducts[2].price,
          size: 'L',
          color: 'White',
          product: dbProducts[2]._id,
        }
      ],
      shippingAddress: customerUser.address,
      paymentMethod: 'Card',
      itemsPrice: dbProducts[0].price + (dbProducts[2].price * 2),
      taxPrice: 26.40,
      shippingPrice: 15.00,
      totalPrice: dbProducts[0].price + (dbProducts[2].price * 2) + 26.40 + 15.00,
      isPaid: true,
      paidAt: new Date('2026-01-15T10:00:00Z'),
      status: 'Delivered',
      deliveredAt: new Date('2026-01-18T14:30:00Z'),
      createdAt: new Date('2026-01-15T09:45:00Z'),
    });
    await order1.save();

    // Order 2: Delivered order in March
    const order2 = new Order({
      user: customerUser._id,
      orderItems: [
        {
          name: dbProducts[6].name,
          qty: 1,
          image: dbProducts[6].images[0],
          price: dbProducts[6].price,
          size: '9',
          color: 'White',
          product: dbProducts[6]._id,
        }
      ],
      shippingAddress: customerUser.address,
      paymentMethod: 'PayPal',
      itemsPrice: dbProducts[6].price,
      taxPrice: 19.20,
      shippingPrice: 0.00,
      totalPrice: dbProducts[6].price + 19.20 + 0.00,
      isPaid: true,
      paidAt: new Date('2026-03-10T15:20:00Z'),
      status: 'Delivered',
      deliveredAt: new Date('2026-03-12T11:00:00Z'),
      createdAt: new Date('2026-03-10T15:00:00Z'),
    });
    await order2.save();

    // Order 3: Processing order in May
    const order3 = new Order({
      user: customerUser._id,
      orderItems: [
        {
          name: dbProducts[4].name,
          qty: 1,
          image: dbProducts[4].images[0],
          price: dbProducts[4].price,
          size: 'L',
          color: 'Beige',
          product: dbProducts[4]._id,
        },
        {
          name: dbProducts[10].name,
          qty: 1,
          image: dbProducts[10].images[0],
          price: dbProducts[10].price,
          size: 'One Size',
          color: 'Black',
          product: dbProducts[10]._id,
        }
      ],
      shippingAddress: customerUser.address,
      paymentMethod: 'Card',
      itemsPrice: dbProducts[4].price + dbProducts[10].price,
      taxPrice: 31.20,
      shippingPrice: 15.00,
      totalPrice: dbProducts[4].price + dbProducts[10].price + 31.20 + 15.00,
      isPaid: true,
      paidAt: new Date('2026-05-20T11:00:00Z'),
      status: 'Processing',
      createdAt: new Date('2026-05-20T10:45:00Z'),
    });
    await order3.save();

    // Order 4: Ordered (new) today (June)
    const order4 = new Order({
      user: customerUser._id,
      orderItems: [
        {
          name: dbProducts[8].name,
          qty: 1,
          image: dbProducts[8].images[0],
          price: dbProducts[8].price,
          size: 'One Size',
          color: 'Black',
          product: dbProducts[8]._id,
        }
      ],
      shippingAddress: customerUser.address,
      paymentMethod: 'COD',
      itemsPrice: dbProducts[8].price,
      taxPrice: 12.80,
      shippingPrice: 15.00,
      totalPrice: dbProducts[8].price + 12.80 + 15.00,
      isPaid: false, // COD is paid on delivery
      status: 'Ordered',
      createdAt: new Date(), // Now
    });
    await order4.save();

    // Also deduct stock for seeded orders
    await Product.findByIdAndUpdate(dbProducts[0]._id, { $inc: { stock: -1 } });
    await Product.findByIdAndUpdate(dbProducts[2]._id, { $inc: { stock: -2 } });
    await Product.findByIdAndUpdate(dbProducts[6]._id, { $inc: { stock: -1 } });
    await Product.findByIdAndUpdate(dbProducts[4]._id, { $inc: { stock: -1 } });
    await Product.findByIdAndUpdate(dbProducts[10]._id, { $inc: { stock: -1 } });
    await Product.findByIdAndUpdate(dbProducts[8]._id, { $inc: { stock: -1 } });

    console.log('Seeding process complete! Database is ready.');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
