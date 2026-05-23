// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Wishlist icons (needed early for loadWishlist)
const wishlistIcons = document.querySelectorAll('.wishlist-icon');

// Update cart count on load
updateCartCount();
loadWishlist();

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchIcon = document.querySelector('.search-icon');

searchInput.addEventListener('input', filterProducts);
searchIcon.addEventListener('click', filterProducts);

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const boxes = document.querySelectorAll('.box');
    
    boxes.forEach(box => {
        const productName = box.dataset.name.toLowerCase();
        if (productName.includes(searchTerm)) {
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    });
}

// Category filter
const categoryFilters = document.querySelectorAll('.category-filter');
const mobileCategoryFilters = document.querySelectorAll('.mobile-category');

categoryFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        const category = filter.dataset.category;
        filterByCategory(category);
        
        // Update active state
        categoryFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
    });
});

mobileCategoryFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        const category = filter.dataset.category;
        filterByCategory(category);
        closeMobileMenu();
    });
});

function filterByCategory(category) {
    const boxes = document.querySelectorAll('.box');
    
    boxes.forEach(box => {
        if (category === 'all' || box.dataset.category === category) {
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    });
    
    // Clear search
    searchInput.value = '';
}

// Shopping Cart
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

addToCartBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        const box = e.target.closest('.box');
        const product = {
            id: index,
            name: box.dataset.name,
            price: parseFloat(box.dataset.price),
            image: box.querySelector('.box-image').style.backgroundImage
        };
        addToCart(product);
    });
});

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    
    // Show feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.backgroundColor = '#6aad19';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = '$0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image" style="${item.image}"></div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity || 1}</p>
                    <p class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</p>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    renderCart();
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

// Wishlist functionality
wishlistIcons.forEach((icon, index) => {
    icon.addEventListener('click', (e) => {
        const box = e.target.closest('.box');
        const product = {
            id: index,
            name: box.dataset.name,
            price: parseFloat(box.dataset.price)
        };
        toggleWishlist(product, icon);
    });
});

function toggleWishlist(product, icon) {
    const existingIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        icon.classList.remove('fa-solid', 'active');
        icon.classList.add('fa-regular');
    } else {
        wishlist.push(product);
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'active');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function loadWishlist() {
    wishlist.forEach(item => {
        const icon = wishlistIcons[item.id];
        if (icon) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid', 'active');
        }
    });
}

// Mobile menu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMobileMenu = document.getElementById('closeMobileMenu');

hamburgerBtn.addEventListener('click', openMobileMenu);
closeMobileMenu.addEventListener('click', closeMobileMenuFunc);
mobileMenuOverlay.addEventListener('click', closeMobileMenuFunc);

function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
}

function closeMobileMenuFunc() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
}

// Back to top (footer)
document.querySelector('.foot-panel1').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Image Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-play carousel
let autoPlayInterval = setInterval(nextSlide, 5000);

// Pause on hover
document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
});

// User Authentication
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const authOverlay = document.getElementById('authOverlay');
const closeAuthModal = document.getElementById('closeAuthModal');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const showSignUp = document.getElementById('showSignUp');
const showSignIn = document.getElementById('showSignIn');
const authGreeting = document.getElementById('authGreeting');
const authModalTitle = document.getElementById('authModalTitle');

// Update greeting on load
updateAuthGreeting();

authBtn.addEventListener('click', () => {
    if (currentUser) {
        // Show logout option
        if (confirm(`Logged in as ${currentUser.name}. Do you want to sign out?`)) {
            logout();
        }
    } else {
        openAuthModal();
    }
});

closeAuthModal.addEventListener('click', closeAuthModalFunc);
authOverlay.addEventListener('click', closeAuthModalFunc);

showSignUp.addEventListener('click', () => {
    signInForm.classList.add('hidden');
    signUpForm.classList.remove('hidden');
    authModalTitle.textContent = 'Create Account';
});

showSignIn.addEventListener('click', () => {
    signUpForm.classList.add('hidden');
    signInForm.classList.remove('hidden');
    authModalTitle.textContent = 'Sign In';
});

signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { name: user.name, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthGreeting();
        closeAuthModalFunc();
        alert('Sign in successful!');
        signInForm.reset();
    } else {
        alert('Invalid email or password');
    }
});

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = { name, email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthGreeting();
    closeAuthModalFunc();
    alert('Account created successfully!');
    signUpForm.reset();
});

function openAuthModal() {
    authModal.classList.add('active');
    authOverlay.classList.add('active');
}

function closeAuthModalFunc() {
    authModal.classList.remove('active');
    authOverlay.classList.remove('active');
    signInForm.classList.remove('hidden');
    signUpForm.classList.add('hidden');
    authModalTitle.textContent = 'Sign In';
}

function updateAuthGreeting() {
    if (currentUser) {
        authGreeting.textContent = `Hello, ${currentUser.name}`;
    } else {
        authGreeting.textContent = 'Hello, sign in';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthGreeting();
    alert('Signed out successfully!');
}
