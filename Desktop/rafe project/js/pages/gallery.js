/**
 * Project Gallery Page
 * Showcase of completed construction projects
 */

function renderGalleryPage() {
    const main = document.getElementById('main-content');

    // Sample gallery projects
    const projects = [
        {
            id: 1,
            title: 'Modern Luxury Villa',
            category: 'residential',
            description: 'Contemporary 5-bedroom villa with infinity pool',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
            location: 'Miami, FL',
            cost: '$1.2M',
            duration: '14 months'
        },
        {
            id: 2,
            title: 'Corporate Office Tower',
            category: 'commercial',
            description: '20-story modern office building with LEED certification',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
            location: 'New York, NY',
            cost: '$45M',
            duration: '24 months'
        },
        {
            id: 3,
            title: 'Kitchen Renovation',
            category: 'renovation',
            description: 'Complete kitchen remodel with custom cabinets',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
            location: 'Los Angeles, CA',
            cost: '$85,000',
            duration: '8 weeks'
        },
        {
            id: 4,
            title: 'Beachfront Residence',
            category: 'residential',
            description: 'Stunning oceanfront home with panoramic views',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
            location: 'Malibu, CA',
            cost: '$3.5M',
            duration: '18 months'
        },
        {
            id: 5,
            title: 'Retail Shopping Center',
            category: 'commercial',
            description: 'Modern shopping complex with 50+ retail spaces',
            image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=600&h=400&fit=crop',
            location: 'Chicago, IL',
            cost: '$28M',
            duration: '20 months'
        },
        {
            id: 6,
            title: 'Bathroom Remodel',
            category: 'renovation',
            description: 'Spa-like master bathroom transformation',
            image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
            location: 'Seattle, WA',
            cost: '$45,000',
            duration: '4 weeks'
        },
        {
            id: 7,
            title: 'Smart Home Estate',
            category: 'residential',
            description: 'Fully automated smart home with solar power',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
            location: 'Austin, TX',
            cost: '$950,000',
            duration: '12 months'
        },
        {
            id: 8,
            title: 'Restaurant Interior',
            category: 'commercial',
            description: 'Award-winning restaurant design and build-out',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
            location: 'San Francisco, CA',
            cost: '$750,000',
            duration: '6 months'
        },
        {
            id: 9,
            title: 'Historic Home Restoration',
            category: 'renovation',
            description: 'Careful restoration of 1920s craftsman home',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
            location: 'Boston, MA',
            cost: '$350,000',
            duration: '10 months'
        }
    ];

    main.innerHTML = `
        <div class="gallery-page">
            <div class="container">
                <div class="section-header text-center">
                    <span class="section-badge">Our Work</span>
                    <h1>Project <span class="text-gradient">Gallery</span></h1>
                    <p>Explore our showcase of completed construction projects</p>
                </div>

                <div class="gallery-filters">
                    <button class="filter-btn active" onclick="filterGallery('all')">All Projects</button>
                    <button class="filter-btn" onclick="filterGallery('residential')">🏠 Residential</button>
                    <button class="filter-btn" onclick="filterGallery('commercial')">🏢 Commercial</button>
                    <button class="filter-btn" onclick="filterGallery('renovation')">🔨 Renovation</button>
                </div>

                <div class="gallery-grid" id="gallery-grid">
                    ${projects.map((project, index) => `
                        <div class="gallery-item" data-category="${project.category}" onclick="openLightbox(${index})">
                            <img src="${project.image}" alt="${project.title}" loading="lazy">
                            <div class="gallery-overlay">
                                <h4>${project.title}</h4>
                                <p>${project.description}</p>
                                <div class="tags">
                                    <span class="tag">📍 ${project.location}</span>
                                    <span class="tag">💰 ${project.cost}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Lightbox -->
        <div class="lightbox" id="gallery-lightbox">
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="closeLightbox()">×</button>
                <button class="lightbox-nav lightbox-prev" onclick="navigateLightbox(-1)">←</button>
                <button class="lightbox-nav lightbox-next" onclick="navigateLightbox(1)">→</button>
                <img src="" alt="" id="lightbox-image">
                <div class="lightbox-info">
                    <h4 id="lightbox-title"></h4>
                    <p id="lightbox-description"></p>
                </div>
            </div>
        </div>
    `;

    // Store projects for lightbox
    window.galleryProjects = projects;
    window.currentLightboxIndex = 0;
}

function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('gallery-lightbox');
    const project = window.galleryProjects[index];

    window.currentLightboxIndex = index;

    document.getElementById('lightbox-image').src = project.image;
    document.getElementById('lightbox-title').textContent = project.title;
    document.getElementById('lightbox-description').textContent = `${project.description} | ${project.location} | ${project.cost}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const total = window.galleryProjects.length;
    window.currentLightboxIndex += direction;

    if (window.currentLightboxIndex < 0) {
        window.currentLightboxIndex = total - 1;
    } else if (window.currentLightboxIndex >= total) {
        window.currentLightboxIndex = 0;
    }

    const project = window.galleryProjects[window.currentLightboxIndex];
    document.getElementById('lightbox-image').src = project.image;
    document.getElementById('lightbox-title').textContent = project.title;
    document.getElementById('lightbox-description').textContent = `${project.description} | ${project.location} | ${project.cost}`;
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
    } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
    }
});
