// Projects Page JavaScript

let projectsData = [];
let filteredProjects = [];
let currentSortField = 'title';
let currentSortDirection = 'asc';

// Sample projects data
const sampleProjects = [
    {
        id: 1,
        title: 'Clean Water Initiative',
        category: 'water',
        description: 'Providing clean and safe drinking water to rural communities through well construction and water purification systems.',
        goal: 50000,
        raised: 42500,
        status: 'active',
        progress: 85,
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        beneficiaries: 450,
        milestones: [
            { id: 1, title: 'Site Survey Completed', completed: true, date: '2024-01-30' },
            { id: 2, title: 'Well Construction Started', completed: true, date: '2024-02-15' },
            { id: 3, title: 'Water Purification System Installed', completed: true, date: '2024-06-01' },
            { id: 4, title: 'Community Training Programs', completed: false, date: '2024-10-01' },
            { id: 5, title: 'Project Completion & Handover', completed: false, date: '2024-12-15' }
        ]
    },
    {
        id: 2,
        title: 'Education for All',
        category: 'education',
        description: 'Building schools and providing educational resources to underprivileged children in remote areas.',
        goal: 75000,
        raised: 46500,
        status: 'active',
        progress: 62,
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        beneficiaries: 320,
        milestones: [
            { id: 1, title: 'School Site Preparation', completed: true, date: '2024-02-15' },
            { id: 2, title: 'Foundation Construction', completed: true, date: '2024-04-01' },
            { id: 3, title: 'Classroom Construction', completed: false, date: '2024-08-01' },
            { id: 4, title: 'Teacher Training Program', completed: false, date: '2024-10-01' },
            { id: 5, title: 'School Opening Ceremony', completed: false, date: '2024-11-30' }
        ]
    },
    {
        id: 3,
        title: 'Healthcare Outreach Program',
        category: 'healthcare',
        description: 'Mobile healthcare units providing medical services and health education to remote communities.',
        goal: 60000,
        raised: 56400,
        status: 'active',
        progress: 94,
        startDate: '2023-08-01',
        endDate: '2024-08-01',
        beneficiaries: 1250,
        milestones: [
            { id: 1, title: 'Medical Equipment Procurement', completed: true, date: '2023-09-01' },
            { id: 2, title: 'Staff Recruitment & Training', completed: true, date: '2023-10-15' },
            { id: 3, title: 'Mobile Unit Deployment', completed: true, date: '2023-11-01' },
            { id: 4, title: 'Community Health Programs', completed: true, date: '2024-03-01' },
            { id: 5, title: 'Impact Assessment', completed: false, date: '2024-08-01' }
        ]
    },
    {
        id: 4,
        title: 'Food Security Initiative',
        category: 'food',
        description: 'Sustainable agriculture training and food distribution programs for food-insecure families.',
        goal: 40000,
        raised: 40000,
        status: 'completed',
        progress: 100,
        startDate: '2023-03-01',
        endDate: '2024-02-29',
        beneficiaries: 180,
        milestones: [
            { id: 1, title: 'Community Assessment', completed: true, date: '2023-03-15' },
            { id: 2, title: 'Agricultural Training Sessions', completed: true, date: '2023-06-01' },
            { id: 3, title: 'Seed & Tool Distribution', completed: true, date: '2023-07-15' },
            { id: 4, title: 'Harvest & Distribution', completed: true, date: '2023-12-01' },
            { id: 5, title: 'Program Evaluation', completed: true, date: '2024-02-29' }
        ]
    },
    {
        id: 5,
        title: 'Emergency Relief Fund',
        category: 'healthcare',
        description: 'Rapid response fund for natural disasters and emergency situations affecting vulnerable communities.',
        goal: 100000,
        raised: 25000,
        status: 'on-hold',
        progress: 25,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        beneficiaries: 0,
        milestones: [
            { id: 1, title: 'Emergency Response Team Formation', completed: true, date: '2024-01-15' },
            { id: 2, title: 'Supply Chain Partnerships', completed: false, date: '2024-06-01' },
            { id: 3, title: 'Rapid Response Protocols', completed: false, date: '2024-08-01' },
            { id: 4, title: 'Community Preparedness Training', completed: false, date: '2024-10-01' },
            { id: 5, title: 'Full Deployment Readiness', completed: false, date: '2024-12-31' }
        ]
    },
    {
        id: 6,
        title: 'Women Empowerment Program',
        category: 'education',
        description: 'Skills training and microfinance support for women entrepreneurs in developing communities.',
        goal: 35000,
        raised: 28000,
        status: 'behind',
        progress: 45,
        startDate: '2023-09-01',
        endDate: '2024-09-01',
        beneficiaries: 85,
        milestones: [
            { id: 1, title: 'Participant Selection', completed: true, date: '2023-09-15' },
            { id: 2, title: 'Skills Training Workshops', completed: true, date: '2023-12-01' },
            { id: 3, title: 'Microfinance Program Launch', completed: false, date: '2024-03-01' },
            { id: 4, title: 'Business Mentorship Program', completed: false, date: '2024-06-01' },
            { id: 5, title: 'Graduation Ceremony', completed: false, date: '2024-09-01' }
        ]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    //if (!localStorage.getItem('userLoggedIn')) {
    //    window.location.href = 'index.html';
    //    return;
    //}

    // Initialize projects data
    initializeProjectsData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial render
    renderProjects();
    updateProjectStats();
});

function initializeProjectsData() {
    // Check if data exists in localStorage, if not use sample data
    const savedData = localStorage.getItem('projectsData');
    if (savedData) {
        projectsData = JSON.parse(savedData);
    } else {
        projectsData = [...sampleProjects];
        saveProjectsData();
    }
    
    filteredProjects = [...projectsData];
}

function saveProjectsData() {
    localStorage.setItem('projectsData', JSON.stringify(projectsData));
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchProjects');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
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

    // Filter by category
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('searchProjects')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';

    filteredProjects = projectsData.filter(project => {
        const matchesSearch = searchTerm === '' || 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });

    renderProjects();
}

function renderProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    if (filteredProjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-project-diagram"></i>
                <h3>No projects found</h3>
                <p>Try adjusting your search criteria or create a new project.</p>
                <button class="btn btn-primary" onclick="showCreateProjectModal()">
                    <i class="fas fa-plus"></i>
                    Create Project
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProjects.map(project => `
        <div class="project-card ${project.category}" onclick="showProjectDetails(${project.id})">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-status ${project.status}">${getStatusText(project.status)}</span>
            </div>
            <div class="project-content">
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(project.startDate)} - ${formatDate(project.endDate)}</span>
                    <span><i class="fas fa-users"></i> ${project.beneficiaries} beneficiaries</span>
                    <span><i class="fas fa-tag"></i> ${getCategoryName(project.category)}</span>
                </div>
                <div class="project-progress">
                    <div class="progress-header">
                        <span class="progress-label">Progress</span>
                        <span class="progress-percentage">${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>
                <div class="funding-info">
                    <div class="funding-raised">
                        <span class="funding-amount">$${project.raised.toLocaleString()}</span> raised of $${project.goal.toLocaleString()}
                    </div>
                    <div class="beneficiaries-count">
                        <i class="fas fa-users"></i>
                        <span>${project.beneficiaries} people</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusTexts = {
        'active': 'Active',
        'completed': 'Completed',
        'on-hold': 'On Hold',
        'behind': 'Behind Schedule'
    };
    return statusTexts[status] || status;
}

function getCategoryName(category) {
    const categoryNames = {
        'education': 'Education',
        'healthcare': 'Healthcare',
        'water': 'Water & Sanitation',
        'food': 'Food Security'
    };
    return categoryNames[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function updateProjectStats() {
    const activeProjects = projectsData.filter(p => p.status === 'active').length;
    const completedProjects = projectsData.filter(p => p.status === 'completed').length;
    const onHoldProjects = projectsData.filter(p => p.status === 'on-hold').length;
    const behindProjects = projectsData.filter(p => p.status === 'behind').length;

    // Update stat cards if they exist
    updateStatCard('.stat-card.primary .stat-number', activeProjects);
    updateStatCard('.stat-card.success .stat-number', completedProjects);
    updateStatCard('.stat-card.warning .stat-number', onHoldProjects);
    updateStatCard('.stat-card.danger .stat-number', behindProjects);
}

function updateStatCard(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    }
}

function showProjectDetails(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalContent = document.getElementById('modalProjectContent');

    modalTitle.textContent = project.title;
    
    modalContent.innerHTML = `
        <div class="project-modal-content">
            <div class="project-modal-header">
                <div class="project-modal-title">
                    <div class="project-category ${project.category}">
                        <i class="fas ${getCategoryIcon(project.category)}"></i>
                        ${getCategoryName(project.category)}
                    </div>
                    <div class="project-dates">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(project.startDate)} - ${formatDate(project.endDate)}
                    </div>
                </div>
                <span class="project-status ${project.status}">${getStatusText(project.status)}</span>
            </div>

            <div class="project-modal-stats">
                <div class="modal-stat-item">
                    <div class="modal-stat-number">$${project.raised.toLocaleString()}</div>
                    <div class="modal-stat-label">Raised</div>
                </div>
                <div class="modal-stat-item">
                    <div class="modal-stat-number">$${project.goal.toLocaleString()}</div>
                    <div class="modal-stat-label">Goal</div>
                </div>
                <div class="modal-stat-item">
                    <div class="modal-stat-number">${project.beneficiaries}</div>
                    <div class="modal-stat-label">Beneficiaries</div>
                </div>
                <div class="modal-stat-item">
                    <div class="modal-stat-number">${project.progress}%</div>
                    <div class="modal-stat-label">Progress</div>
                </div>
            </div>

            <div class="project-details-section">
                <h4>Project Description</h4>
                <p>${project.description}</p>
            </div>

            <div class="project-details-section">
                <h4>Project Progress</h4>
                <div class="progress-bar" style="margin-bottom: 1rem;">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <div class="milestones-list">
                    ${project.milestones.map(milestone => `
                        <div class="milestone-item ${milestone.completed ? 'completed' : project.milestones.indexOf(milestone) === project.milestones.findIndex(m => !m.completed) ? 'current' : ''}">
                            <div class="milestone-icon">
                                <i class="fas ${milestone.completed ? 'fa-check' : 'fa-clock'}"></i>
                            </div>
                            <div class="milestone-info">
                                <div class="milestone-title">${milestone.title}</div>
                                <div class="milestone-date">${milestone.completed ? 'Completed' : 'Expected'}: ${formatDate(milestone.date)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="project-details-section">
                <h4>Funding Progress</h4>
                <div class="funding-breakdown">
                    <div class="funding-item">
                        <span>Amount Raised:</span>
                        <span>$${project.raised.toLocaleString()}</span>
                    </div>
                    <div class="funding-item">
                        <span>Funding Goal:</span>
                        <span>$${project.goal.toLocaleString()}</span>
                    </div>
                    <div class="funding-item">
                        <span>Remaining:</span>
                        <span>$${(project.goal - project.raised).toLocaleString()}</span>
                    </div>
                    <div class="funding-item">
                        <span>Completion:</span>
                        <span>${Math.round((project.raised / project.goal) * 100)}%</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function getCategoryIcon(category) {
    const icons = {
        'education': 'fa-graduation-cap',
        'healthcare': 'fa-heart',
        'water': 'fa-tint',
        'food': 'fa-seedling'
    };
    return icons[category] || 'fa-project-diagram';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Reset form
    const form = document.getElementById('createProjectForm');
    if (form) {
        form.reset();
    }
}

function closeCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function createProject(event) {
    event.preventDefault();
    
    const title = document.getElementById('projectTitle').value;
    const category = document.getElementById('projectCategory').value;
    const goal = parseFloat(document.getElementById('projectGoal').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const description = document.getElementById('projectDescription').value;
    
    const newProject = {
        id: Date.now(),
        title,
        category,
        description,
        goal,
        raised: 0,
        status: 'active',
        progress: 0,
        startDate,
        endDate,
        beneficiaries: 0,
        milestones: [
            { id: 1, title: 'Project Planning', completed: true, date: startDate },
            { id: 2, title: 'Resource Allocation', completed: false, date: addDays(startDate, 30) },
            { id: 3, title: 'Implementation Phase', completed: false, date: addDays(startDate, 90) },
            { id: 4, title: 'Monitoring & Evaluation', completed: false, date: addDays(startDate, 180) },
            { id: 5, title: 'Project Completion', completed: false, date: endDate }
        ]
    };
    
    projectsData.unshift(newProject);
    saveProjectsData();
    
    filteredProjects = [...projectsData];
    renderProjects();
    updateProjectStats();
    closeCreateProjectModal();
    
    showNotification('Project created successfully!', 'success');
}

function addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
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

// Close modals on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeProjectModal();
        closeCreateProjectModal();
    }
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const projectModal = document.getElementById('projectModal');
    const createModal = document.getElementById('createProjectModal');
    
    if (event.target === projectModal) {
        closeProjectModal();
    }
    if (event.target === createModal) {
        closeCreateProjectModal();
    }
});

// Add styles for project modal enhancements
const projectModalStyles = document.createElement('style');
projectModalStyles.textContent = `
    .funding-breakdown {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        background: var(--gray-50);
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
    }
    
    .funding-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.875rem;
    }
    
    .funding-item:last-child {
        font-weight: 600;
        color: var(--primary-600);
        padding-top: var(--spacing-sm);
        border-top: 1px solid var(--gray-300);
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
`;

document.head.appendChild(projectModalStyles);