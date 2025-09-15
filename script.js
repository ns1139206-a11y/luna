// Jewelry tab and modal: handle wishlist and cart actions
document.addEventListener('DOMContentLoaded', function() {
  // Language toggle (Arabic/English)
  const langBtn = document.getElementById('langToggle');
  const langText = document.getElementById('langText');
  if (langBtn && langText) {
    langBtn.addEventListener('click', function() {
      const isArabic = document.documentElement.lang === 'ar';
      if (!isArabic) {
        document.documentElement.lang = 'ar';
        document.body.dir = 'rtl';
        langText.textContent = 'EN';
        // Example: translate some key elements
        const brand = document.querySelector('.navbar-brand');
        if (brand) brand.textContent = 'لونا';
        const banner = document.querySelector('.luna-banner');
        if (banner) banner.textContent = '✨ توصيل مجاني للطلبات فوق ٥٠ دولار • إرجاع سهل • خصم ٣٠٪ على بعض المنتجات';
        const heroTitle = document.querySelector('.animated-hero-title');
        if (heroTitle) heroTitle.textContent = 'اكسسوارات لونا';
        const heroDesc = document.querySelector('.animated-hero-desc');
        if (heroDesc) heroDesc.textContent = 'تألقي في التفاصيل. اكتشفي الأقراط والأساور والقلائد لكل أسلوب.';
        const newInTitle = document.querySelector('.new-in-title h2');
        if (newInTitle) newInTitle.textContent = 'الجديد';
        const categoryTitle = document.querySelector('.category-content h4');
        if (categoryTitle) categoryTitle.textContent = 'مجوهرات';
        // Add more translations as needed
      } else {
        document.documentElement.lang = 'en';
        document.body.dir = 'ltr';
        langText.textContent = 'AR';
        const brand = document.querySelector('.navbar-brand');
        if (brand) brand.textContent = 'Luna';
        const banner = document.querySelector('.luna-banner');
        if (banner) banner.textContent = '✨ FREE DELIVERY on orders over $50 • Easy Returns • 30% off selected styles';
        const heroTitle = document.querySelector('.animated-hero-title');
        if (heroTitle) heroTitle.textContent = 'Luna Accessories';
        const heroDesc = document.querySelector('.animated-hero-desc');
        if (heroDesc) heroDesc.textContent = 'Shine in the details.\nDiscover earrings, bracelets, and necklaces for every style.';
        const newInTitle = document.querySelector('.new-in-title h2');
        if (newInTitle) newInTitle.textContent = 'New In';
        const categoryTitle = document.querySelector('.category-content h4');
        if (categoryTitle) categoryTitle.textContent = 'Jewellery';
        // Add more translations as needed
      }
    });
  }

  // Theme toggle (Light/Dark)
  const themeBtn = document.getElementById('themeToggle');
  const themeText = document.getElementById('themeText');
  const themeIcon = document.getElementById('themeIcon');
  function setTheme(mode) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(mode + '-mode');
    localStorage.setItem('luna_theme', mode);
    if (themeText && themeIcon) {
      if (mode === 'dark') {
        themeText.textContent = 'Light Mode';
        themeIcon.textContent = '🌙';
      } else {
        themeText.textContent = 'Dark Mode';
        themeIcon.textContent = '☀️';
      }
    }
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      const isDark = document.body.classList.contains('dark-mode');
      setTheme(isDark ? 'light' : 'dark');
    });
    // On page load, set theme from localStorage or default to light
    const savedTheme = localStorage.getItem('luna_theme') || 'light';
    setTheme(savedTheme);
  }
  // Universal wishlist logic for all heart icons
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.onclick = function() {
      let id = btn.dataset.id;
      let img = btn.dataset.img;
      let inWishlist = id ? getWishlist().includes(Number(id)) : getWishlist().includes(img);
      if (!inWishlist) {
        if (id) addToWishlist(Number(id));
        if (img) addToWishlist(img);
        btn.textContent = '♥';
        btn.style.color = '#dc3545';
        console.log('Added to wishlist:', id || img, getWishlist());
      } else {
        if (id) removeFromWishlist(Number(id));
        if (img) removeFromWishlist(img);
        btn.textContent = '♡';
        btn.style.color = '';
        console.log('Removed from wishlist:', id || img, getWishlist());
      }
      // Always refresh wishlist page if on it
      if (window.location.pathname.endsWith('wishlist.html')) {
        setTimeout(()=>{ if (typeof renderWishlistPage === 'function') renderWishlistPage(); }, 50);
      }
    };
  });
  // ...existing code for add-to-bag-btn...
});

// --- Luna Wishlist & Cart Functionality ---
const WISHLIST_KEY = 'luna_wishlist';
const CART_KEY = 'luna_cart';

// Jewelry items (images, titles, prices)
const JEWELRY_ITEMS = [
  { img: 'assets/1ff9a505-d48b-4ffe-bac1-9e818aecb506.jpg', title: 'Pastel Charm', price: 12 },
  { img: 'assets/5pcs_Set High-End Luxury Elegant Cubic Zirconia….jpg', title: 'Luxury Zirconia Set', price: 16 },
  { img: 'assets/6cf2b8df-67ce-44b8-a092-8e9a1a74468d.jpg', title: 'Elegant Necklace', price: 18 },
  { img: 'assets/jewelry9.jpg', title: 'Classic Bracelet', price: 22 },
  { img: 'assets/Victoria-Transvaal Diamond Necklace_ Museum of….jpg', title: 'Diamond Necklace', price: 44 },
  { img: 'assets/jewelry3.jpg', title: 'Stylish Ring', price: 28 },
  { img: 'assets/jewelry 2.jpg', title: 'Silver Earrings', price: 16 }
];

// Accessory items (images, titles, prices, descriptions)
const ACCESSORY_ITEMS = [
  {img:'assets/access4.jpg', title:'Tote Bag', price:45, desc:'Spacious tote with soft lining and clean silhouettes.'},
  {img:'assets/access7.jpg', title:'Crossbody Bag', price:38, desc:'Compact crossbody with adjustable strap and magnetic closure.'},
  {img:'assets/access8.jpg', title:'Handwoven Clutch', price:32, desc:'Handwoven clutch with a modern finish for evening looks.'},
  {img:'assets/access9.jpg', title:'Saddle Bag', price:59, desc:'Smooth leather saddle bag with timeless hardware.'},
  {img:'assets/access11.jpg', title:'Chain Handle Bag', price:69, desc:'Structured bag with elegant chain handle and roomy interior.'},
  {img:'assets/access12.jpg', title:'Mini Satchel', price:54, desc:'Sleek mini satchel with top zip and internal organizer.'},
  {img:'assets/access10.jpg', title:'Everyday Crossbody', price:48, desc:'Everyday crossbody with adjustable strap and clean lines.'}
];

function getWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
}
function setWishlist(arr) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(arr));
  try { console.debug('setWishlist ->', arr); } catch(e){}
}
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function setCart(arr) {
  localStorage.setItem(CART_KEY, JSON.stringify(arr));
  try { console.debug('setCart ->', arr); } catch(e){}
}

function addToWishlist(idOrImg) {
  let list = getWishlist();
  if (!list.includes(idOrImg)) list.push(idOrImg);
  setWishlist(list);
  try { console.debug('addToWishlist called with', idOrImg, 'result', getWishlist()); } catch(e){}
  showToast('Added to wishlist');
}
function removeFromWishlist(idOrImg) {
  let list = getWishlist().filter(x=>x!==idOrImg);
  setWishlist(list);
  try { console.debug('removeFromWishlist called with', idOrImg, 'result', getWishlist()); } catch(e){}
  showToast('Removed from wishlist');
}
function addToCart(idOrImg) {
  let cart = getCart();
  if (!cart.includes(idOrImg)) cart.push(idOrImg);
  setCart(cart);
  try { console.debug('addToCart called with', idOrImg, 'result', getCart()); } catch(e){}
  showToast('Added to cart');
}
function removeFromCart(idOrImg) {
  let cart = getCart().filter(x=>x!==idOrImg);
  setCart(cart);
  try { console.debug('removeFromCart called with', idOrImg, 'result', getCart()); } catch(e){}
  showToast('Removed from cart');
}

// Lightweight toast helper (injects container if needed)
function ensureToastContainer() {
  if (!document.getElementById('luna-toast-container')) {
    const cont = document.createElement('div');
    cont.id = 'luna-toast-container';
    cont.style.position = 'fixed';
    cont.style.right = '20px';
    cont.style.bottom = '20px';
    cont.style.zIndex = 2000;
    document.body.appendChild(cont);
  }
}
function showToast(msg, timeout=1600) {
  if (typeof document === 'undefined') return;
  ensureToastContainer();
  const cont = document.getElementById('luna-toast-container');
  const t = document.createElement('div');
  t.className = 'luna-toast';
  t.textContent = msg;
  t.style.background = '#0E1A2B';
  t.style.color = '#fff';
  t.style.padding = '10px 14px';
  t.style.borderRadius = '10px';
  t.style.boxShadow = '0 6px 18px rgba(14,26,43,0.12)';
  t.style.marginTop = '8px';
  t.style.opacity = '0';
  t.style.transition = 'opacity 220ms, transform 220ms';
  cont.appendChild(t);
  requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateY(-6px)'; });
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(0)'; setTimeout(()=>t.remove(),240); }, timeout);
}

function renderWishlistPage() {
  const el = document.getElementById('wishlist-items');
  if (!el) return;
  const ids = getWishlist();
  try { console.debug('renderWishlistPage ->', ids); } catch(e){}
  if (!ids.length) {
    el.innerHTML = '<div class="wishlist-empty">No favorites yet. Add products to your wishlist!</div>';
    return;
  }
  el.innerHTML = '';
  ids.forEach(item => {
    let p = PRODUCTS.find(x=>x.id===item);
    let j = JEWELRY_ITEMS.find(x=>x.img===item);
    let a = ACCESSORY_ITEMS.find(x=>x.img===item);
    let cardImg = '';
    if (p) cardImg = IMG_FOR(p.id);
    else if (j) cardImg = j.img;
    else if (a) cardImg = a.img;
    else cardImg = 'assets/default.jpg';
    let cardTitle = p ? p.title.en : (j ? j.title : (a ? a.title : ''));
    let cardDesc = p ? p.desc.en : (j ? '' : (a ? a.desc : ''));
    let cardPrice = p ? p.price : (j ? j.price : (a ? a.price : ''));
    el.innerHTML += `<div class="wishlist-card" style="background:linear-gradient(90deg,#FAF7F2 60%,#F2E8D8 100%);border-radius:18px;box-shadow:0 4px 24px rgba(14,26,43,0.08);margin-bottom:2rem;padding:1.5rem;">
      <div style="display:flex;align-items:center;gap:1.5rem;">
        <img src="${cardImg}" alt="${cardTitle}" style="width:120px;height:120px;object-fit:cover;border-radius:14px;box-shadow:0 2px 8px rgba(14,26,43,0.08);">
        <div style="flex:1;">
          <h5 style="font-size:1.3rem;font-weight:600;color:#0E1A2B;">${cardTitle}</h5>
          <p class="small text-muted" style="margin-bottom:0.5rem;">${cardDesc||''}</p>
          <div class="mb-2 text-primary fw-bold" style="font-size:1.1rem;">$${cardPrice}</div>
          <div class="d-flex gap-3 mt-2">
            <button class="btn btn-primary add-to-bag-btn" data-id="${p?p.id:''}" data-img="${j?j.img:(a?a.img:'')}">Add to Cart</button>
            <button class="remove-btn btn btn-link text-danger" data-id="${p?p.id:''}" data-img="${j?j.img:(a?a.img:'')}">&times;</button>
          </div>
        </div>
      </div>
    </div>`;
  });
  el.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.id) removeFromWishlist(Number(btn.dataset.id));
      if (btn.dataset.img) removeFromWishlist(btn.dataset.img);
      setTimeout(renderWishlistPage, 50);
    };
  });
  el.querySelectorAll('.add-to-bag-btn').forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.id) addToCart(Number(btn.dataset.id));
      if (btn.dataset.img) addToCart(btn.dataset.img);
      btn.textContent = 'Added!';
      setTimeout(()=>{btn.textContent='Add to Cart';},1200);
      // Optionally refresh wishlist page if needed
      if (window.location.pathname.endsWith('wishlist.html')) {
        setTimeout(renderWishlistPage, 50);
      }
    };
  });
  el.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.id) {
        const id = Number(btn.dataset.id);
        if (!getWishlist().includes(id)) {
          addToWishlist(id);
          btn.textContent = '♥';
          btn.style.color = '#dc3545';
        } else {
          removeFromWishlist(id);
          btn.textContent = '♡';
          btn.style.color = '';
        }
      }
      if (btn.dataset.img) {
        const img = btn.dataset.img;
        if (!getWishlist().includes(img)) {
          addToWishlist(img);
          btn.textContent = '♥';
          btn.style.color = '#dc3545';
        } else {
          removeFromWishlist(img);
          btn.textContent = '♡';
          btn.style.color = '';
        }
      }
      setTimeout(renderWishlistPage, 50);
    };
  });
}

function renderCartPage() {
  const el = document.getElementById('cart-items');
  if (!el) return;
  const ids = getCart();
  try { console.debug('renderCartPage ->', ids); } catch(e){}
  if (!ids.length) {
    el.innerHTML = '<div class="cart-empty">Your cart is empty. Add products to buy!</div>';
    return;
  }
  el.innerHTML = '';
  let total = 0;
  ids.forEach(item => {
    let p = PRODUCTS.find(x=>x.id===item);
    let j = JEWELRY_ITEMS.find(x=>x.img===item);
    let a = ACCESSORY_ITEMS.find(x=>x.img===item);
    let cardImg = '';
    if (p) cardImg = IMG_FOR(p.id);
    else if (j) cardImg = j.img;
    else if (a) cardImg = a.img;
    else cardImg = 'assets/default.jpg';
    let cardTitle = p ? p.title.en : (j ? j.title : (a ? a.title : ''));
    let cardDesc = p ? p.desc.en : (j ? '' : (a ? a.desc : ''));
    let cardPrice = p ? p.price : (j ? j.price : (a ? a.price : 0));
    total += Number(cardPrice) || 0;
    el.innerHTML += `<div class="cart-card" style="background:linear-gradient(90deg,#FAF7F2 60%,#F2E8D8 100%);border-radius:18px;box-shadow:0 4px 24px rgba(14,26,43,0.08);margin-bottom:2rem;padding:1.5rem;">
      <div style="display:flex;align-items:center;gap:1.5rem;">
        <img src="${cardImg}" alt="${cardTitle}" style="width:120px;height:120px;object-fit:cover;border-radius:14px;box-shadow:0 2px 8px rgba(14,26,43,0.08);">
        <div style="flex:1;">
          <h5 style="font-size:1.3rem;font-weight:600;color:#0E1A2B;">${cardTitle}</h5>
          <p class="small text-muted" style="margin-bottom:0.5rem;">${cardDesc||''}</p>
          <div class="mb-2 text-primary fw-bold" style="font-size:1.1rem;">$${cardPrice}</div>
          <button class="remove-btn btn btn-link text-danger" data-id="${p?p.id:''}" data-img="${j?j.img:(a?a.img:'')}">&times;</button>
        </div>
      </div>
    </div>`;
  });
  el.innerHTML += `<div class="cart-total" style="background:#fffbe6;border-radius:14px;padding:1.5rem 2rem;margin-top:2rem;box-shadow:0 2px 8px rgba(14,26,43,0.08);text-align:right;font-size:1.2rem;font-weight:600;color:#0E1A2B;">
    Total: $${total.toFixed(2)}
    <button class="btn btn-success ms-3" style="font-size:1rem;padding:0.5rem 1.5rem;">Checkout</button>
  </div>`;
  el.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.id) removeFromCart(Number(btn.dataset.id));
      if (btn.dataset.img) removeFromCart(btn.dataset.img);
      renderCartPage();
    };
  });
}

// On wishlist.html and cart.html, render items
if (location.pathname.endsWith('wishlist.html')) {
  document.addEventListener('DOMContentLoaded', renderWishlistPage);
}
if (location.pathname.endsWith('cart.html')) {
  document.addEventListener('DOMContentLoaded', renderCartPage);
}

const PRODUCTS = [
  { id:2,  title:{en:'Chain Necklace'},  tag:'necklaces', price:45, was:60, desc:{en:'Delicate 18-inch chain necklace with adjustable length. Made from premium stainless steel.'} },
  { id:3,  title:{en:'Stack Ring'},      tag:'rings',     price:22, was:28, desc:{en:'Minimalist stack ring set of 3. Mix and match for your perfect layered look.'} },
  { id:4,  title:{en:'Charm Bracelet'},  tag:'bracelets', price:29, was:36, desc:{en:'Handmade charm bracelet with genuine leather strap and sterling silver charms.'} },
  { id:5,  title:{en:'Stud Earrings'},   tag:'earrings',  price:18, was:22, desc:{en:'Classic diamond-cut stud earrings. Hypoallergenic and perfect for everyday wear.'} },
  { id:6,  title:{en:'Herringbone'},     tag:'necklaces', price:52, was:68, desc:{en:'Sleek herringbone chain necklace with polished finish. A timeless piece for any wardrobe.'} },
  { id:7,  title:{en:'Signet Ring'},     tag:'rings',     price:34, was:44, desc:{en:'Classic signet ring with personalized engraving option. Available in multiple sizes.'} },
  { id:8,  title:{en:'Beaded Charm'},    tag:'charms',    price:12, was:16, desc:{en:'Handcrafted pastel charm with intricate beadwork. Perfect for adding personality to any bracelet.'} },
];


// Real product images from Unsplash
const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1515562141207-7a88e7f8aaab?w=400&h=400&fit=crop&crop=center', // Pearl hoops
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center', // Chain necklace
  'https://images.unsplash.com/photo-1603561596112-db1b4b5b3b3b?w=400&h=400&fit=crop&crop=center', // Stack rings
  'https://images.unsplash.com/photo-1617038220319-276d4f4b2b2b?w=400&h=400&fit=crop&crop=center', // Charm bracelet
  'https://images.unsplash.com/photo-1617038220319-276d4f4b2b2b?w=400&h=400&fit=crop&crop=center', // Stud earrings
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center', // Herringbone necklace
  'https://images.unsplash.com/photo-1603561596112-db1b4b5b3b3b?w=400&h=400&fit=crop&crop=center', // Signet ring
  'https://images.unsplash.com/photo-1617038220319-276d4f4b2b2b?w=400&h=400&fit=crop&crop=center', // Beaded charm
  'https://images.unsplash.com/photo-1515562141207-7a88e7f8aaab?w=400&h=400&fit=crop&crop=center', // Gold hoops
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center', // Pendant necklace
  'https://images.unsplash.com/photo-1603561596112-db1b4b5b3b3b?w=400&h=400&fit=crop&crop=center', // Cocktail ring
  'https://images.unsplash.com/photo-1617038220319-276d4f4b2b2b?w=400&h=400&fit=crop&crop=center', // Bangle set
  'https://images.unsplash.com/photo-1515562141207-7a88e7f8aaab?w=400&h=400&fit=crop&crop=center', // Drop earrings
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center', // Choker set
  'https://images.unsplash.com/photo-1603561596112-db1b4b5b3b3b?w=400&h=400&fit=crop&crop=center', // Wedding band
  'https://images.unsplash.com/photo-1617038220319-276d4f4b2b2b?w=400&h=400&fit=crop&crop=center', // Anklet
];

const IMG_FOR = id => PRODUCT_IMAGES[((id-1) % PRODUCT_IMAGES.length)];

// Index shelves with enhanced animations
function renderShelfRow(elId, items){
  const el = document.getElementById(elId);
  if (!el) return;
  
  // Add loading state
  el.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  
  // Simulate loading delay for better UX
  setTimeout(() => {
    el.innerHTML = '';
    items.forEach((p, index) => {
      const discount = Math.max(0, Math.round(100 - (p.price/p.was)*100));
      const col = document.createElement('div');
      col.className = 'col';
      col.style.animationDelay = `${index * 0.1}s`;
      col.style.animation = 'fadeUp 0.6s ease both';
      
      col.innerHTML = `
        <div class="card h-100 position-relative">
          <span class="badge bg-danger badge-discount">-${discount}%</span>
          <div class="position-relative overflow-hidden">
            <img src="${IMG_FOR(p.id)}" class="card-img-top" alt="${p.title.en}" loading="lazy">
            <div class="card-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background: rgba(0,0,0,0.7); opacity: 0; transition: opacity 0.3s ease;">
              <button class="btn btn-light btn-sm">Quick View</button>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title.en}</h5>
            <p class="card-text small text-muted">${p.desc.en||''}</p>
            <div class="mt-auto d-flex gap-2 align-items-center">
              <span class="price">$${p.price}</span>
              <span class="text-muted text-decoration-line-through small">$${p.was}</span>
            </div>
            <div class="mt-2 d-flex gap-2">
              <button class="btn btn-outline-secondary btn-sm wishlist-btn" data-id="${p.id}" style="color:#dc3545">♡</button>
              <button class="btn btn-primary btn-sm add-to-bag-btn" data-id="${p.id}" style="background:#0E1A2B">Add to Cart</button>
            </div>
          </div>
        </div>`;
      el.appendChild(col);
    });
  }, 500);
}

// Products page with enhanced animations
function renderProductsGrid(filter='all', q=''){
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  // Add loading state
  grid.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  
  const ql = (q||'').toLowerCase();
  const items = PRODUCTS.filter(p=>{
    if (filter!=='all' && p.tag !== filter) return false;
    if (!ql) return true;
    return (p.title.en||'').toLowerCase().includes(ql) || (p.desc.en||'').toLowerCase().includes(ql);
  });
  
  // Simulate loading delay
  setTimeout(() => {
    grid.innerHTML = '';
    items.forEach((p, index) => {
      const discount = Math.max(0, Math.round(100 - (p.price/p.was)*100));
      const col = document.createElement('div');
      col.className = 'col';
      col.style.animationDelay = `${index * 0.05}s`;
      col.style.animation = 'fadeUp 0.6s ease both';
      
      col.innerHTML = `
        <div class="card h-100 position-relative">
          <span class="badge bg-danger badge-discount">-${discount}%</span>
          <div class="position-relative overflow-hidden">
            <img src="${IMG_FOR(p.id)}" class="card-img-top" alt="${p.title.en}" loading="lazy">
            <div class="card-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background: rgba(0,0,0,0.7); opacity: 0; transition: opacity 0.3s ease;">
              <button class="btn btn-light btn-sm">Quick View</button>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title.en}</h5>
            <p class="card-text small text-muted">${p.desc.en||''}</p>
            <div class="mt-auto d-flex gap-2 align-items-center">
              <span class="price">$${p.price}</span>
              <span class="text-muted text-decoration-line-through small">$${p.was}</span>
            </div>
            <div class="mt-2 d-flex gap-2">
              <button class="btn btn-outline-secondary btn-sm wishlist-btn" data-id="${p.id}" style="color:#dc3545">♡</button>
              <button class="btn btn-primary btn-sm add-to-bag-btn" data-id="${p.id}" style="background:#0E1A2B">Add to Cart</button>
            </div>
          </div>
        </div>`;
      grid.appendChild(col);
    });
  }, 300);
}

// Offers grid + countdown
(function(){
  const grid = document.getElementById('offersGrid');
  if (grid){
    const picks = PRODUCTS.slice(0, 12);
    picks.forEach((p, idx)=>{
      const price = Math.max(8, Math.round(p.price * (.7 - (idx%3)*0.05)));
      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `
        <div class="card h-100 position-relative">
          <span class="badge bg-danger badge-discount">-${Math.round(100 - price/p.price*100)}%</span>
          <img src="${IMG_FOR(p.id)}" class="card-img-top" alt="${p.title.en}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title.en}</h5>
            <div class="mt-auto d-flex gap-2 align-items-center">
              <span class="price">$${price}</span>
              <span class="text-muted text-decoration-line-through small">$${p.price}</span>
            </div>
            <div class="mt-2"><button class="btn btn-primary btn-sm">Add</button></div>
          </div>
        </div>`;
      grid.appendChild(col);
    });
    const el = document.getElementById('offerTimer');
    if (el){
      const end = Date.now() + 48*3600*1000;
      function tick(){
        const diff = Math.max(0, end - Date.now());
        const h = String(Math.floor(diff/3600000)).padStart(2,'0');
        const m = String(Math.floor(diff%3600000/60000)).padStart(2,'0');
        const s = String(Math.floor(diff%60000/1000)).padStart(2,'0');
        el.textContent = `${h}:${m}:${s}`;
      }
      setInterval(tick, 1000);
      tick();
    }
  }
// ...existing code...
})();

// Shelf navigation functionality
function initShelfNavigation() {
  document.querySelectorAll('.shelf-prev, .shelf-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const shelf = e.target.dataset.shelf;
      const container = document.getElementById(`shelf-${shelf}`);
      if (!container) return;
      
      // Make container scrollable horizontally
      container.style.overflowX = 'auto';
      container.style.scrollBehavior = 'smooth';
      container.style.display = 'flex';
      container.style.gap = '1rem';
      
      const scrollAmount = 300;
      const direction = e.target.classList.contains('shelf-prev') ? -scrollAmount : scrollAmount;
      
      container.scrollBy({
        left: direction,
        behavior: 'smooth'
      });
    });
  });
}

// Button functionality
function initButtonFunctionality() {
  // Search functionality
  const searchBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Search'));
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const searchInput = document.getElementById('productSearch');
      if (searchInput) {
        // ...existing code for search...
      }
    });
  }

  // Newsletter subscription
  const nlForm = document.getElementById('nlForm');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = nlForm.querySelector('input[type="email"]').value;
      if (email) {
        alert('Thank you for subscribing!');
        nlForm.reset();
      }
    });
  }

  // Scroll to top functionality
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Page init hooks
document.addEventListener('DOMContentLoaded', ()=>{
  const NEW_IN = PRODUCTS.slice(0, 8);
  const BEST   = PRODUCTS.slice().reverse().slice(0, 8);
  renderShelfRow('shelf-newIn', NEW_IN);
  renderShelfRow('shelf-best', BEST);

  // Initialize shelf navigation
  initShelfNavigation();
  
  // Initialize button functionality
  initButtonFunctionality();

  // Products page filters
  const grid = document.getElementById('productsGrid');
  if (grid){
    let current = 'all';
    const search = document.getElementById('productSearch');
    function apply(){ renderProductsGrid(current, search?search.value:''); }
    document.querySelectorAll('.tab').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.tab').forEach(b=> b.classList.remove('active'));
        btn.classList.add('active');
        current = btn.dataset.filter;
        apply();
      });
    });
    if (search){ search.addEventListener('input', apply); }
    apply();
  }
});


// === Theme + Language (EN/AR) Manager ===
(function(){
  const state = {
    theme: localStorage.getItem('luna_theme') || 'light',
    lang:  localStorage.getItem('luna_lang')  || 'en',
  };

  // Apply theme by setting data-theme and overriding Bootstrap vars
  function applyTheme(){
    document.documentElement.setAttribute('data-theme', state.theme);
    // optional: set color-scheme for form controls
    document.documentElement.style.colorScheme = state.theme === 'dark' ? 'dark' : 'light';
  }

  // Language: swap dir, lang and (optionally) Bootstrap RTL CSS
  const BS_LINK_ID = 'bootstrap-css-link';
  function ensureBootstrapLink(){
    // Replace the first bootstrap link with an identifiable id
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const bs = links.find(l=> l.href.includes('bootstrap'));
    if (bs && !bs.id) bs.id = BS_LINK_ID;
    return document.getElementById(BS_LINK_ID) || bs;
  }

  function applyLang(){
    document.documentElement.lang = state.lang;
    document.documentElement.dir  = state.lang === 'ar' ? 'rtl' : 'ltr';
    const bs = ensureBootstrapLink();
    if (bs){
      const base = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/';
      bs.href = state.lang === 'ar' ? base + 'bootstrap.rtl.min.css' : base + 'bootstrap.min.css';
    }
    translatePage();
  }

  const dict = {
    en: {
      navNewIn:'New In', navJewellery:'Jewellery', navBags:'Bags', navHair:'Hair', navOffers:'Offers', navSale:'Sale',
      ctaShopNew:'Shop New In', ctaShopJewellery:'Shop Jewellery', ctaViewOffers:'View Offers',
      nlTitle:'Join the Luna List', nlDesc:'Exclusive drops, offers and style tips.', subscribe:'Subscribe',
      theme:'Theme', lang:'AR'
    },
    ar: {
      navNewIn:'وصل حديثًا', navJewellery:'إكسسوارات', navBags:'حقائب', navHair:'شعر', navOffers:'العروض', navSale:'تخفيضات',
      ctaShopNew:'تسوق الجديد', ctaShopJewellery:'تسوق الإكسسوارات', ctaViewOffers:'شاهد العروض',
      nlTitle:'اشترك في قائمة لونا', nlDesc:'عروض حصرية ونصائح للستايل.', subscribe:'اشترك',
      theme:'المظهر', lang:'EN'
    }
  };

  function translatePage(){
    const t = dict[state.lang] || dict.en;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });
    // Update placeholder text for newsletter
    document.querySelectorAll('input[placeholder="Your email"]').forEach(inp=>{
      inp.placeholder = state.lang === 'ar' ? 'بريدك الإلكتروني' : 'Your email';
    });
  }

  // Wire controls
  function wireControls(){
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn){
      themeBtn.addEventListener('click', ()=>{
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('luna_theme', state.theme);
        applyTheme();
      });
    }
    const langBtn = document.getElementById('langToggle');
    if (langBtn){
      langBtn.addEventListener('click', ()=>{
        state.lang = state.lang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('luna_lang', state.lang);
        applyLang();
      });
    }
  }

  // Init
  applyTheme();
  applyLang();
  wireControls();
})();

