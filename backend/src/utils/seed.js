import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Table from '../models/Table.js';
import Review from '../models/Review.js';
import GalleryImage from '../models/GalleryImage.js';

dotenv.config();

const sampleMenuItems = [
  // --- STARTERS ---
  {
    name: 'Paneer Tikka',
    description: 'Soft cubes of marinated cottage cheese skewered with bell peppers and onions, chargrilled to perfection in the tandoor and served with mint chutney.',
    price: 280,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Smoky, mildly spicy, and creamy with an authentic clay oven char.',
    winePairing: 'Mint Chaas / Salted Lassi',
  },
  {
    name: 'Hara Bhara Kebab',
    description: 'Pan-seared spiced vegetarian patties prepared with tender spinach, garden green peas, and potatoes, scented with roasted cumin.',
    price: 240,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Crisp exterior with a melt-in-the-mouth herbed vegetable core.',
    winePairing: 'Fresh Lime Soda',
  },
  {
    name: 'Aloo Tikki',
    description: 'Crisp golden spiced potato croquettes stuffed with seasoned lentils, served with tamarind chutney and spiced yogurt.',
    price: 210,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Crunchy on the outside, delicately spiced and savory inside.',
    winePairing: 'Masala Chai',
  },
  {
    name: 'Veg Seekh Kebab',
    description: 'Minced garden vegetables, paneer, and aromatic herbs threaded onto skewers and roasted slowly over burning charcoal.',
    price: 260,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Herbaceous, mildly piquant, with warm ginger and coriander notes.',
    winePairing: 'Sweet Lassi',
  },
  {
    name: 'Dahi Ke Kebab',
    description: 'Velvety shallow-fried patties crafted from hung curd, grated paneer, and crushed green chillies with a crisp golden shell.',
    price: 270,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Delicately crisp on the outside with an opulent, tangy-creamy center.',
    winePairing: 'Fresh Lime Soda',
  },

  // --- MAIN COURSE ---
  {
    name: 'Dal Makhani',
    description: 'Slow-cooked whole black lentils and kidney beans simmered overnight on low charcoal embers, finished with farm butter and fresh cream.',
    price: 290,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Velvety smooth, deeply comforting, with aromatic fenugreek and smoky butter.',
    winePairing: 'Garlic Naan & Sweet Lassi',
  },
  {
    name: 'Paneer Butter Masala',
    description: 'Soft cubes of fresh cottage cheese simmered gently in a silky, rich tomato and cashew nut gravy infused with butter and ground spices.',
    price: 340,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Creamy, buttery, mildly sweet with a rich tomato tang and warm spices.',
    winePairing: 'Butter Naan & Mango Lassi',
  },
  {
    name: 'Shahi Paneer',
    description: 'Fresh paneer cubes poached in a decadent white cashew, almond, and saffron cream sauce perfumed with green cardamom.',
    price: 350,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Luxuriously creamy and aromatic with royal Mughlai essence.',
    winePairing: 'Laccha Paratha',
  },
  {
    name: 'Kadhai Paneer',
    description: 'Paneer batons tossed with crunchy bell peppers, onions, and freshly roasted coriander seeds in a robust spiced tomato sauce.',
    price: 330,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Zesty, spicy, and fragrant with crushed kadhai coriander and peppers.',
    winePairing: 'Tandoori Roti',
  },
  {
    name: 'Dal Tadka',
    description: 'Yellow lentils cooked till tender and tempered with clarified desi ghee, cumin, garlic, dry red chillies, and fresh coriander.',
    price: 250,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Comforting, aromatic, with roasted garlic and sizzling ghee notes.',
    winePairing: 'Jeera Rice',
  },
  {
    name: 'Chole Masala',
    description: 'Plump chickpeas simmered in a dark, robust North Indian gravy steeped with dried pomegranate seeds, ginger, and garam masala.',
    price: 270,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Earthy, tangy, and piquant with authentic Amritsari spice.',
    winePairing: 'Butter Kulcha & Salted Lassi',
  },
  {
    name: 'Malai Kofta',
    description: 'Delicate dumplings of paneer and potatoes stuffed with dry fruits, served swimming in an exquisite golden cashew-cream gravy.',
    price: 360,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Silky smooth, mildly sweet, and deeply luxurious.',
    winePairing: 'Garlic Naan',
  },
  {
    name: 'Mix Veg',
    description: 'Assortment of seasonal vegetables including french beans, carrots, cauliflower, and paneer cooked in a rich onion-tomato masala.',
    price: 270,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Hearty, fresh, wholesome, and seasoned with ground spices.',
    winePairing: 'Butter Roti',
  },

  // --- RICE & BIRYANI ---
  {
    name: 'Veg Biryani',
    description: 'Fragrant long-grain basmati rice layered with garden vegetables, caramelized onions, fresh mint, and saffron-infused milk, dum-cooked in a sealed clay pot.',
    price: 310,
    category: 'Rice & Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Aromatic, complex, layered with royal saffron and whole spices.',
    winePairing: 'Burani Raita & Mango Lassi',
  },
  {
    name: 'Paneer Biryani',
    description: 'Chargrilled paneer cubes tossed in spiced yogurt marinade and layered with fragrant basmati rice, fried cashews, and fresh herbs.',
    price: 330,
    category: 'Rice & Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Spicy, rich, and fragrant with juicy tandoori paneer bites.',
    winePairing: 'Cucumber Raita & Fresh Lime Soda',
  },
  {
    name: 'Jeera Rice',
    description: 'Aged basmati rice tempered in pure desi ghee with fragrant cumin seeds and fresh coriander garnish.',
    price: 190,
    category: 'Rice & Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Subtly nutty, buttery, and fragrant with roasted cumin.',
    winePairing: 'Dal Tadka',
  },

  // --- BREADS ---
  {
    name: 'Butter Naan',
    description: 'Classic leavened flatbread baked against the walls of an intensely hot clay tandoor, brushed liberally with churned butter.',
    price: 65,
    category: 'Breads',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Soft and pillowy with toasted golden blister marks.',
    winePairing: 'Paneer Butter Masala',
  },
  {
    name: 'Garlic Naan',
    description: 'Hand-stretched tandoori flatbread studded with freshly minced garlic and cilantro, brushed with clarified butter.',
    price: 75,
    category: 'Breads',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Bold roasted garlic aroma with a buttery, chewy crumb.',
    winePairing: 'Dal Makhani',
  },
  {
    name: 'Tandoori Roti',
    description: 'Whole wheat flatbread slapped on the fiery walls of the clay oven, served crisp and wholesome.',
    price: 45,
    category: 'Breads',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Rustic, wholesome, with authentic tandoor smoke.',
    winePairing: 'Chole Masala',
  },
  {
    name: 'Laccha Paratha',
    description: 'Multi-layered flaky whole wheat bread enriched with desi ghee and cooked to a golden crisp in the tandoor.',
    price: 70,
    category: 'Breads',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Crisp, spiral-layered, and wonderfully flaky.',
    winePairing: 'Shahi Paneer',
  },

  // --- SOUTH INDIAN ---
  {
    name: 'Masala Dosa',
    description: 'Thin, crispy golden fermented rice and lentil crepe stuffed with savory spiced potato mash, served alongside coconut chutney and piping-hot sambar.',
    price: 220,
    category: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Lacy crisp edges, comforting spiced potato center, and tangy sambar.',
    winePairing: 'Filter Coffee / Sweet Lassi',
  },
  {
    name: 'Idli Sambar',
    description: 'Steamed fluffy rice-and-lentil cakes served swimming in a bowl of aromatic drumstick and vegetable sambar with fresh coconut chutney.',
    price: 180,
    category: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Light, cloud-soft, soothing, and bursting with south Indian spices.',
    winePairing: 'Filter Coffee',
  },

  // --- SNACKS / STREET FOOD ---
  {
    name: 'Samosa',
    description: 'Flaky, deep-fried pastry triangles packed with a seasoned filling of spiced potatoes, green peas, and toasted coriander seeds, served with tangy chutneys.',
    price: 120,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Crisp and crunchy on the outside, hot and savory inside.',
    winePairing: 'Masala Chai',
  },
  {
    name: 'Pav Bhaji',
    description: 'A spiced medley of mashed seasonal vegetables slow-cooked on a wide tawa with butter, served hot with butter-toasted pav bread and lemon wedges.',
    price: 230,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Richly buttery, tangy, and piquant with diced red onions and lemon.',
    winePairing: 'Fresh Lime Soda',
  },
  {
    name: 'Paneer Roll',
    description: 'Flaky paratha wrap rolled around spiced cottage cheese cubes, sauteed bell peppers, onions, and tangy mint chutney.',
    price: 190,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Hearty handheld wrap packed with spicy paneer and crisp onions.',
    winePairing: 'Masala Chai',
  },

  // --- DESSERTS ---
  {
    name: 'Gulab Jamun',
    description: 'Warm, soft dumplings crafted from condensed milk solids, fried golden and soaked in fragrant sugar syrup infused with cardamom and rose water.',
    price: 160,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Delightfully syrupy, tender, with warm floral cardamom notes.',
    winePairing: 'Masala Chai',
  },
  {
    name: 'Rasmalai',
    description: 'Pillowy cottage cheese discs soaked in chilled thickened whole milk infused with royal saffron, green cardamom, and slivered pistachios.',
    price: 180,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Cool, spongy, delicate sweetness perfumed with saffron.',
    winePairing: 'Cardamom Infusion',
  },

  // --- BEVERAGES ---
  {
    name: 'Mango Lassi',
    description: 'Thick, creamy yogurt beverage blended with sweet Alphonso mango puree and garnished with crushed pistachios.',
    price: 150,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Thick, fruity, velvety sweetness with a cooling probiotic finish.',
    winePairing: 'Paneer Tikka',
  },
  {
    name: 'Masala Chai',
    description: 'Slow-brewed Assam tea leaves simmered with fresh milk, crushed ginger root, green cardamom, cinnamon quills, and cloves.',
    price: 90,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Vibrant, invigorating, warm, and comforting.',
    winePairing: 'Samosa',
  },
  {
    name: 'Fresh Lime Soda',
    description: 'Freshly squeezed Indian lime juice with chilled sparkling club soda, black rock salt, and fresh mint leaves.',
    price: 110,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: true,
    tastingNotes: 'Effervescent, tangy, salty-sweet, and exceptionally refreshing.',
    winePairing: 'Pav Bhaji',
  },

  // --- NON-VEGETARIAN STARTERS ---
  {
    name: 'Murgh Tikka (Chicken Tikka)',
    description: 'Succulent boneless chicken chunks marinated in spiced Kashmiri red chili yogurt, ginger-garlic paste, and mustard oil, charred to smoky perfection in our clay tandoor.',
    price: 320,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Smoky, mildly piquant, tender with charred tandoori edges.',
    winePairing: 'Fresh Mint Lime Cooler',
  },
  {
    name: 'Mutton Seekh Kebab',
    description: 'Finely minced lamb blended with crushed brown onions, fresh mint, coriander, and royal garam masala, skewered and flame-grilled over charcoal.',
    price: 390,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Juicy, aromatic, rich in roasted cumin, clove, and mace.',
    winePairing: 'Spiced Buttermilk',
  },
  {
    name: 'Amritsari Fish Fry',
    description: 'Crisp golden-crusted seasonal river fish fillets marinated with carom seeds (ajwain), crushed coriander, lime, and gram flour batter, fried until crunchy.',
    price: 360,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Crisp flaky fish with pronounced ajwain zest and tangy chaat masala.',
    winePairing: 'Shikanji Soda',
  },
  {
    name: 'Tandoori Prawns',
    description: 'Jumbo tiger prawns bathed in a vibrant marination of hung curd, carom seeds, yellow chili, and saffron, roasted over flaming embers.',
    price: 440,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Sweet succulent prawns with a fiery tandoori crust and citrus finish.',
    winePairing: 'Kokum Cooler',
  },
  {
    name: 'Chicken Malai Tikka',
    description: 'Tender morsels of chicken breast steeped overnight in rich clotted cream, cream cheese, green cardamom, and crushed white peppercorns.',
    price: 340,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Melt-in-the-mouth texture with delicate cardamom and subtle cheese undertones.',
    winePairing: 'Sweet Badam Milk',
  },

  // --- NON-VEGETARIAN MAIN COURSES ---
  {
    name: 'Butter Chicken (Murgh Makhani)',
    description: 'Slow-charred tandoori chicken simmered in an opulent velvet gravy of sun-ripened tomatoes, sweet butter, cashew cream, and fragrant dried fenugreek leaves.',
    price: 380,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Creamy, gently sweet-tangy with an unmistakable smoky tandoor depth.',
    winePairing: 'Butter Naan / Mango Lassi',
  },
  {
    name: 'Rogan Josh (Kashmiri Mutton)',
    description: 'Heritage Kashmiri delicacy of tender prime mutton slow-braised in a deep crimson gravy infused with aromatic ratanjot, Kashmiri chillies, fennel, and dried ginger.',
    price: 430,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Warming, rich, complex royal gravy with tender fall-off-the-bone meat.',
    winePairing: 'Tandoori Roti / Salted Lassi',
  },
  {
    name: 'Kadai Chicken',
    description: 'Tender chicken braised with freshly ground whole spices, dry red chillies, coriander seeds, crunchy bell peppers, and caramelized onions in an iron wok.',
    price: 370,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Robust, spicy, with rustic crushed peppercorn and bell pepper bite.',
    winePairing: 'Garlic Naan',
  },
  {
    name: 'Goan Fish Curry',
    description: 'Fresh catch of the day gently poached in a traditional coastal sauce of ground coconut, fiery red chillies, coriander seeds, and tart kokum.',
    price: 390,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Creamy coconut body with a sharp, refreshing tropical tang and gentle heat.',
    winePairing: 'Steamed Basmati Rice',
  },
  {
    name: 'Mughlai Bhuna Gosht',
    description: 'Tender cuts of goat meat roasted and bhuna-fried patiently with caramelized onions, garlic, yogurt, and crushed whole spices until the gravy turns dark and glossy.',
    price: 440,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Deep savory roast notes, thick clinging masala with peppery warmth.',
    winePairing: 'Laccha Paratha',
  },
  {
    name: 'Tariwali Egg Curry',
    description: 'Farm-fresh boiled eggs lightly blistered in golden turmeric oil and simmered in a robust, homestyle northern gravy of onions, tomatoes, and garam masala.',
    price: 290,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Comforting, balanced, aromatic spiced gravy with firm savory eggs.',
    winePairing: 'Jeera Rice or Tandoori Roti',
  },
  {
    name: 'Coastal Prawn Masala',
    description: 'Sweet bay prawns sautéed with mustard seeds, curry leaves, crushed garlic, and grated coconut in a fragrant coastal tomato-onion reduction.',
    price: 450,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Rich seafood essence paired with tempered curry leaves and mild coconut warmth.',
    winePairing: 'Steamed Basmati Rice',
  },

  // --- NON-VEGETARIAN RICE & BIRYANI ---
  {
    name: 'Dum Pukht Chicken Biryani',
    description: 'Aged long-grain basmati rice layered with spiced marinated chicken, saffron milk, fried onions (birista), and mint, sealed in a handi and cooked on slow dum.',
    price: 380,
    category: 'Rice & Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Incredible royal aroma, fluffy separated grains, and fall-apart chicken.',
    winePairing: 'Burani Raita',
  },
  {
    name: 'Awadhi Mutton Biryani',
    description: 'Lucknowi-style kacchi dum biryani featuring tender cuts of mutton marinated in curd, rose water, and shahi garam masala, layered with saffron-infused basmati.',
    price: 440,
    category: 'Rice & Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Delicate floral and saffron notes with succulent, melt-in-the-mouth mutton.',
    winePairing: 'Mirchi Ka Salan',
  },
  {
    name: 'Egg Dum Biryani',
    description: 'Fragrant basmati rice cooked with whole spices, caramelized onions, and golden pan-fried spiced eggs layered with fresh mint and ghee.',
    price: 310,
    category: 'Rice & Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Savory, comforting, richly spiced basmati with crispy-shelled spiced eggs.',
    winePairing: 'Cucumber Mint Raita',
  },

  // --- CHEF SPECIALTIES (NON-VEG) ---
  {
    name: 'Nalli Nihari',
    description: 'Royal slow-cooked mutton shank stew simmered overnight with bone marrow and potli spices, garnished with fresh ginger juliennes, green chilies, and lime.',
    price: 490,
    category: 'Chef Specialties',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Silky, deeply savory, gelatinous marrow richness with warming spices.',
    winePairing: 'Khamiri Roti',
  },
  {
    name: 'Fish Tikka Tandoori',
    description: 'Firm boneless fish cubes marinated in yellow mustard, crushed ajwain, turmeric, and sour curd, charred over flaming charcoal.',
    price: 390,
    category: 'Chef Specialties',
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isVeg: false,
    tastingNotes: 'Smoky exterior, delicate tender fish inside with mustard-lemon punch.',
    winePairing: 'Mint Chutney / Fresh Lime Soda',
  },
];

const sampleTables = [
  { tableNumber: 1, capacity: 2, location: 'Main Dining Hall', isActive: true },
  { tableNumber: 2, capacity: 4, location: 'Main Dining Hall', isActive: true },
  { tableNumber: 3, capacity: 6, location: 'Main Dining Hall', isActive: true },
  { tableNumber: 4, capacity: 2, location: 'Private Alcove', isActive: true },
  { tableNumber: 5, capacity: 4, location: 'Private Alcove', isActive: true },
  { tableNumber: 6, capacity: 8, location: 'Chef Table', isActive: true },
  { tableNumber: 7, capacity: 4, location: 'Main Dining Hall', isActive: true },
];

const sampleReviews = [
  {
    guestName: 'Rahul Sharma',
    rating: 5,
    text: 'Exceptional dining experience! The Dal Makhani and Garlic Naan were unmatched in richness and flavor. ShubhRestro has truly set the gold standard for authentic Indian fine dining.',
    status: 'approved',
  },
  {
    guestName: 'Priya Verma',
    rating: 5,
    text: 'A heavenly vegetarian feast. The Paneer Tikka was melt-in-the-mouth soft and beautifully charred, and the Gulab Jamun was the perfect sweet finish.',
    status: 'approved',
  },
  {
    guestName: 'Amit Singh',
    rating: 5,
    text: 'The Veg Biryani and Paneer Butter Masala were cooked to perfection with pure desi spices. The ambiance and royal service made our family celebration unforgettable.',
    status: 'approved',
  },
  {
    guestName: 'Neha Gupta',
    rating: 5,
    text: 'Magnificent South Indian breakfast delicacies and delightful Masala Chai. Truly wonderful to have a 100% vegetarian fine-dining haven.',
    status: 'approved',
  },
  {
    guestName: 'Rohit Kumar',
    rating: 4,
    text: 'Outstanding culinary craftsmanship. The Dahi Ke Kebab and Malai Kofta were sublime. Highly recommended for authentic Indian gourmet food.',
    status: 'approved',
  },
  {
    guestName: 'Anjali Mishra',
    rating: 5,
    text: 'Warm hospitality, gorgeous decor, and exquisite flavors. Every dish we ordered at ShubhRestro was a masterpiece of Indian gastronomy.',
    status: 'approved',
  },
];

const sampleGallery = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Elegant Indian dining space with warm traditional ambient lighting.',
    category: 'Ambiance',
    order: 1,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Rich and creamy Paneer Butter Masala served fresh with tandoori naan.',
    category: 'Dishes',
    order: 2,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80',
    caption: 'Freshly grilled tandoori Paneer Tikka with mint chutney and charred capsicum.',
    category: 'Dishes',
    order: 3,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cozy private dining alcove designed for family celebrations and gatherings.',
    category: 'Private Dining',
    order: 4,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=1200&q=80',
    caption: 'Chilled Alphonso Mango Lassi garnished with crushed pistachios.',
    category: 'Beverages',
    order: 5,
  },
];

export const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/shubh_restro';

    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB database: shubh_restro.');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      MenuItem.deleteMany({}),
      Table.deleteMany({}),
      Review.deleteMany({}),
      GalleryImage.deleteMany({}),
    ]);

    console.log('[Seed] Cleared existing collections.');

    // Seed Primary Indian Admin User
    const admin = await User.create({
      name: 'Shubham Pandey',
      email: 'admin@shubhrestro.com',
      passwordHash: 'Admin123',
      phone: '+91 9876543210',
      role: 'admin',
    });

    // Seed Secondary Admin User for test compatibility
    await User.create({
      name: 'Shubham Pandey',
      email: 'admin@gmail.com',
      passwordHash: 'Admin123',
      phone: '+91 9876543210',
      role: 'admin',
    });

    // Seed Primary Indian Customer
    const customer = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      passwordHash: 'Customer123!',
      phone: '+91 9876543211',
      role: 'customer',
    });

    // Seed Customer for test compatibility
    await User.create({
      name: 'Priya Verma',
      email: 'customer@gmail.com',
      passwordHash: 'Customer123!',
      phone: '+91 9876543212',
      role: 'customer',
    });

    console.log(
      `[Seed] Created admin (${admin.email}) and customer (${customer.email}).`
    );

    // Seed Menu Items
    const menuItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`[Seed] Inserted ${menuItems.length} authentic Indian menu items (vegetarian & non-vegetarian).`);

    // Seed Tables
    const tables = await Table.insertMany(sampleTables);
    console.log(`[Seed] Inserted ${tables.length} tables.`);

    // Seed Reviews
    const reviews = await Review.insertMany(sampleReviews);
    console.log(`[Seed] Inserted ${reviews.length} customer reviews.`);

    // Seed Gallery
    const gallery = await GalleryImage.insertMany(sampleGallery);
    console.log(`[Seed] Inserted ${gallery.length} gallery items.`);

    console.log(
      '--- [Seed] ShubhRestro database successfully initialized with authentic Indian cuisine (Veg & Non-Veg)! ---'
    );

    if (process.env.NODE_ENV !== 'test') {
      await mongoose.disconnect();
      console.log('[Seed] Disconnected from MongoDB.');
    }
  } catch (error) {
    console.error('[Seed Error]:', error);

    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }

    throw error;
  }
};

// Run seed script if invoked directly
const isDirectRun =
  process.argv[1] &&
  (
    import.meta.url.endsWith(
      process.argv[1].replace(/\\/g, '/')
    ) ||
    process.argv[1]
      .replace(/\\/g, '/')
      .endsWith('seed.js')
  );

if (process.env.NODE_ENV !== 'test' && isDirectRun) {
  seedDatabase();
}

export default seedDatabase;