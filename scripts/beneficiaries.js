// Beneficiaries Page JavaScript

let beneficiariesData = [];
let filteredBeneficiaries = [];
let currentPage = 1;
const itemsPerPage = 12;
let isListView = false;

// Sample beneficiaries data
const sampleBeneficiaries = [
    {
        id: 1,
        firstName: 'Maria',
        lastName: 'Santos',
        age: 12,
        gender: 'female',
        project: 'education',
        status: 'active',
        description: 'Maria is a bright student who dreams of becoming a teacher. She comes from a low-income family and needs support to continue her education.',
        image: 'https://images.pexels.com/photos/1068881/pexels-photo-1068881.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
        id: 2,
        firstName: 'Ahmed',
        lastName: 'Hassan',
        age: 8,
        gender: 'male',
        project: 'healthcare',
        status: 'active',
        description: 'Ahmed requires regular medical check-ups and treatment. His family struggles to afford healthcare costs.',
        image: 'https://images.pexels.com/photos/1537473/pexels-photo-1537473.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
        id: 3,
        firstName: 'Sarah',
        lastName: 'Johnson',
        age: 15,
        gender: 'female',
        project: 'education',
        status: 'graduated',
        description: 'Sarah successfully completed our education program and is now pursuing higher education with a scholarship.',
        image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
        id: 4,
        firstName: 'David',
        lastName: 'Chen',
        age: 10,
        gender: 'male',
        project: 'water',
        status: 'active',
        description: 'David lives in a community that recently gained access to clean water through our initiative.',
        image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
        id: 5,
        firstName: 'Fatima',
        lastName: 'Al-Zahra',
        age: 14,
        gender: 'female',
        project: 'education',
        status: 'pending',
        description: 'Fatima is waiting to be enrolled in our education program. She shows great potential in mathematics.',
        image: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
        id: 6,
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        age: 9,
        gender: 'male',
        project: 'healthcare',
        status: 'active',
        description: 'Carlos is receiving treatment for malnutrition and is showing significant improvement.',
        image: 'https://images.pexels.com/photos/1068881/pexels-photo-1068881.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    //if (!localStorage.getItem('userLoggedIn')) {
    //    window.location.href = 'index.html';
    //    return;
    //}

    // Initialize beneficiaries data
    initializeBeneficiariesData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial render
    renderBeneficiaries();
    updateStats();
});

function initializeBeneficiariesData() {
    // Check if data exists in localStorage, if not use sample data
    const savedData = localStorage.getItem('beneficiariesData');
    if (savedData) {
        beneficiariesData = JSON.parse(savedData);
    } else {
        beneficiariesData = [...sampleBeneficiaries];
        saveBeneficiariesData();
    }
    
    filteredBeneficiaries = [...beneficiariesData];
}

function saveBeneficiariesData() {
    localStorage.setItem('beneficiariesData', JSON.stringify(beneficiariesData));
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchBeneficiaries');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filteredBeneficiaries = beneficiariesData.filter(beneficiary => 
                beneficiary.firstName.toLowerCase().includes(searchTerm) ||
                beneficiary.lastName.toLowerCase().includes(searchTerm) ||
                beneficiary.description.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            renderBeneficiaries();
            updatePagination();
        });
    }

    // Filter by project
    const projectFilter = document.getElementById('projectFilter');
    if (projectFilter) {
        projectFilter.addEventListener('change', function() {
            applyFilters();
        });
    }

    // Filter by status
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
}

function applyFilters() {
    const projectFilter = document.getElementById('projectFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchBeneficiaries').value.toLowerCase();

    filteredBeneficiaries = beneficiariesData.filter(beneficiary => {
        const matchesProject = projectFilter === 'all' || beneficiary.project === projectFilter;
        const matchesStatus = statusFilter === 'all' || beneficiary.status === statusFilter;
        const matchesSearch = searchTerm === '' || 
            beneficiary.firstName.toLowerCase().includes(searchTerm) ||
            beneficiary.lastName.toLowerCase().includes(searchTerm) ||
            beneficiary.description.toLowerCase().includes(searchTerm);
        
        return matchesProject && matchesStatus && matchesSearch;
    });

    currentPage = 1;
    renderBeneficiaries();
    updatePagination();
}

function renderBeneficiaries() {
    const container = document.getElementById('beneficiariesContainer');
    if (!container) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBeneficiaries = filteredBeneficiaries.slice(startIndex, endIndex);

    if (currentBeneficiaries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No beneficiaries found</h3>
                <p>Try adjusting your search criteria or add new beneficiaries.</p>
                <button class="btn btn-primary" onclick="showAddBeneficiaryModal()">
                    <i class="fas fa-plus"></i>
                    Add Beneficiary
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = currentBeneficiaries.map(beneficiary => `
        <div class="beneficiary-card ${isListView ? 'list-item' : ''}" onclick="viewBeneficiaryDetails(${beneficiary.id})">
            <div class="card-image">
                <img src="${beneficiary.image}" alt="${beneficiary.firstName} ${beneficiary.lastName}">
                <div class="status-badge ${beneficiary.status}">${beneficiary.status}</div>
            </div>
            <div class="card-content">
                ${isListView ? '<div class="beneficiary-info">' : ''}
                <h3 class="beneficiary-name">${beneficiary.firstName} ${beneficiary.lastName}</h3>
                <div class="beneficiary-details">
                    <span><i class="fas fa-user"></i> ${beneficiary.age} years old</span>
                    <span><i class="fas fa-venus-mars"></i> ${beneficiary.gender}</span>
                </div>
                <p class="beneficiary-description">${beneficiary.description}</p>
                ${isListView ? '</div>' : ''}
                <div class="card-footer">
                    <span class="project-tag ${beneficiary.project}">
                        ${getProjectName(beneficiary.project)}
                    </span>
                    <div class="card-actions">
                        <button class="action-btn edit" onclick="event.stopPropagation(); editBeneficiary(${beneficiary.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="event.stopPropagation(); deleteBeneficiary(${beneficiary.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getProjectName(project) {
    const projectNames = {
        'education': 'Education Program',
        'healthcare': 'Healthcare Initiative', 
        'water': 'Clean Water Project'
    };
    return projectNames[project] || project;
}

function updateStats() {
    const totalElement = document.getElementById('totalBeneficiaries');
    const activeElement = document.getElementById('activeBeneficiaries');
    const graduatedElement = document.getElementById('graduatedBeneficiaries');

    if (totalElement) totalElement.textContent = beneficiariesData.length.toLocaleString();
    if (activeElement) {
        const activeCount = beneficiariesData.filter(b => b.status === 'active').length;
        activeElement.textContent = activeCount.toLocaleString();
    }
    if (graduatedElement) {
        const graduatedCount = beneficiariesData.filter(b => b.status === 'graduated').length;
        graduatedElement.textContent = graduatedCount.toLocaleString();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (currentPageElement) currentPageElement.textContent = currentPage;
    if (totalPagesElement) totalPagesElement.textContent = totalPages;
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderBeneficiaries();
        updatePagination();
        
        // Scroll to top
        document.querySelector('.beneficiaries-content').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function toggleView() {
    isListView = !isListView;
    const container = document.getElementById('beneficiariesContainer');
    const icon = document.getElementById('viewToggleIcon');
    
    if (isListView) {
        container.classList.add('list-view');
        icon.className = 'fas fa-th-large';
    } else {
        container.classList.remove('list-view');
        icon.className = 'fas fa-th';
    }
    
    renderBeneficiaries();
}

function showAddBeneficiaryModal() {
    const modal = document.getElementById('addBeneficiaryModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Reset form
    const form = document.getElementById('addBeneficiaryForm');
    form.reset();
}

function closeAddBeneficiaryModal() {
    const modal = document.getElementById('addBeneficiaryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function addBeneficiary(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newBeneficiary = {
        id: Date.now(),
        firstName: formData.get('firstName') || document.getElementById('firstName').value,
        lastName: formData.get('lastName') || document.getElementById('lastName').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        project: document.getElementById('project').value,
        status: 'pending',
        description: document.getElementById('description').value,
        image: getRandomImage()
    };
    
    beneficiariesData.unshift(newBeneficiary);
    saveBeneficiariesData();
    
    filteredBeneficiaries = [...beneficiariesData];
    currentPage = 1;
    
    renderBeneficiaries();
    updateStats();
    updatePagination();
    closeAddBeneficiaryModal();
    
    showNotification('Beneficiary added successfully!', 'success');
}

function getRandomImage() {
    const images = [
        'https://images.pexels.com/photos/1068881/pexels-photo-1068881.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1537473/pexels-photo-1537473.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=300'
    ];
    return images[Math.floor(Math.random() * images.length)];
}

function viewBeneficiaryDetails(id) {
    const beneficiary = beneficiariesData.find(b => b.id === id);
    if (!beneficiary) return;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Beneficiary Details</h3>
                <span class="modal-close" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">&times;</span>
            </div>
            <div class="modal-body">
                <div class="beneficiary-detail-content">
                    <div class="detail-image">
                        <img src="${beneficiary.image}" alt="${beneficiary.firstName} ${beneficiary.lastName}">
                        <div class="status-badge ${beneficiary.status}">${beneficiary.status}</div>
                    </div>
                    <div class="detail-info">
                        <h2>${beneficiary.firstName} ${beneficiary.lastName}</h2>
                        <div class="detail-meta">
                            <span><i class="fas fa-user"></i> ${beneficiary.age} years old</span>
                            <span><i class="fas fa-venus-mars"></i> ${beneficiary.gender}</span>
                            <span><i class="fas fa-project-diagram"></i> ${getProjectName(beneficiary.project)}</span>
                        </div>
                        <p class="detail-description">${beneficiary.description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

function editBeneficiary(id) {
    showNotification('Edit functionality coming soon!', 'info');
}

function deleteBeneficiary(id) {
    if (confirm('Are you sure you want to delete this beneficiary?')) {
        beneficiariesData = beneficiariesData.filter(b => b.id !== id);
        saveBeneficiariesData();
        
        applyFilters();
        updateStats();
        
        showNotification('Beneficiary deleted successfully!', 'success');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-600)' : type === 'error' ? 'var(--danger-600)' : 'var(--primary-600)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('addBeneficiaryModal');
        if (modal && modal.style.display === 'flex') {
            closeAddBeneficiaryModal();
        }
    }
});

// Add styles for beneficiary details modal
const beneficiaryStyles = document.createElement('style');
beneficiaryStyles.textContent = `
    .beneficiary-detail-content {
        display: flex;
        gap: var(--spacing-xl);
        align-items: flex-start;
    }
    
    .detail-image {
        position: relative;
        flex-shrink: 0;
    }
    
    .detail-image img {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: var(--radius-xl);
    }
    
    .detail-image .status-badge {
        position: absolute;
        top: var(--spacing-md);
        right: var(--spacing-md);
    }
    
    .detail-info {
        flex: 1;
    }
    
    .detail-info h2 {
        margin-bottom: var(--spacing-md);
        color: var(--gray-900);
    }
    
    .detail-meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
        font-size: 0.875rem;
        color: var(--gray-600);
    }
    
    .detail-meta span {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }
    
    .detail-description {
        color: var(--gray-700);
        line-height: 1.6;
    }
    
    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--spacing-3xl);
        color: var(--gray-500);
    }
    
    .empty-state i {
        font-size: 4rem;
        margin-bottom: var(--spacing-lg);
        opacity: 0.5;
    }
    
    .empty-state h3 {
        color: var(--gray-700);
        margin-bottom: var(--spacing-md);
    }
    
    .empty-state p {
        margin-bottom: var(--spacing-xl);
    }
    
    @media (max-width: 768px) {
        .beneficiary-detail-content {
            flex-direction: column;
            text-align: center;
        }
        
        .detail-image img {
            width: 150px;
            height: 150px;
        }
        
        .detail-meta {
            justify-content: center;
        }
    }
`;

document.head.appendChild(beneficiaryStyles);