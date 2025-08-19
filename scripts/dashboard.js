// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    // if (!localStorage.getItem("authToken")) {
    //    window.location.href = 'index.html';
    //    return;
    //}

    // Initialize dashboard
    initializeDashboard();
    setupEventListeners();
    loadCharts();
    updateRealTimeData();
    
    // Update data every 30 seconds
    setInterval(updateRealTimeData, 30000);
});

function initializeDashboard() {
    // Update user info
    const userEmail = localStorage.getItem('userEmail');
    const userFirstName = localStorage.getItem('userFirstName') || 'NGO';
    const userLastName = localStorage.getItem('userLastName') || 'Administrator';
    const userOrganization = localStorage.getItem('userOrganization') || 'Organization';
    
    const userNameElement = document.querySelector('.user-name');
    const userRoleElement = document.querySelector('.user-role');
    
    if (userNameElement) {
        userNameElement.textContent = `${userFirstName} ${userLastName}`;
    }
    if (userRoleElement) {
        userRoleElement.textContent = userOrganization;
    }

    // Animate stats on load
    animateStatsCards();
}

function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Mobile sidebar
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    // Notification click
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        notificationBadge.addEventListener('click', function() {
            showNotifications();
        });
    }

    // User profile click
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            showUserMenu();
        });
    }

    // Logout functionality
    const logoutLink = document.querySelector('a[href="index.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function loadCharts() {
    // Donation Trends Chart
    const donationCtx = document.getElementById('donationChart');
    if (donationCtx) {
        new Chart(donationCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Donations ($)',
                    data: [12000, 15000, 18000, 14000, 22000, 25000, 28000, 24000, 30000, 32000, 28000, 35000],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000) + 'K';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: 'rgb(59, 130, 246)'
                    }
                }
            }
        });
    }

    // Fund Utilization Chart
    const utilizationCtx = document.getElementById('utilizationChart');
    if (utilizationCtx) {
        new Chart(utilizationCtx, {
            type: 'doughnut',
            data: {
                labels: ['Program Costs', 'Administrative', 'Fundraising', 'Emergency Fund'],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
}

function animateStatsCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            
            // Animate the numbers
            const numberElement = card.querySelector('h3');
            if (numberElement) {
                animateNumber(numberElement);
            }
        }, index * 100);
    });
}

function animateNumber(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isDollar = target.includes('$');
    const isComma = target.includes(',');
    
    let numericTarget;
    if (isDollar) {
        numericTarget = parseInt(target.replace(/[$,]/g, ''));
    } else if (isPercentage) {
        numericTarget = parseInt(target.replace('%', ''));
    } else if (isComma) {
        numericTarget = parseInt(target.replace(',', ''));
    } else {
        numericTarget = parseInt(target);
    }
    
    let current = 0;
    const increment = numericTarget / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericTarget) {
            current = numericTarget;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (isDollar) {
            element.textContent = '$' + displayValue.toLocaleString();
        } else if (isPercentage) {
            element.textContent = displayValue + '%';
        } else if (isComma) {
            element.textContent = displayValue.toLocaleString();
        } else {
            element.textContent = displayValue;
        }
    }, 20);
}

function updateRealTimeData() {
    // Simulate real-time updates
    const updates = [
        { element: '#projectsCount', value: Math.floor(Math.random() * 5) + 20 },
        { element: '#beneficiariesCount', value: Math.floor(Math.random() * 100) + 1200 },
        { element: '#totalRaised', value: Math.floor(Math.random() * 10000) + 240000 },
        { element: '#goalProgress', value: Math.floor(Math.random() * 10) + 75 }
    ];
    
    updates.forEach(update => {
        const element = document.querySelector(update.element);
        if (element) {
            if (update.element === '#totalRaised') {
                element.textContent = '$' + update.value.toLocaleString();
            } else if (update.element === '#goalProgress') {
                element.textContent = update.value + '%';
            } else {
                element.textContent = update.value.toLocaleString();
            }
        }
    });
}

function showNotifications() {
    const notifications = [
        {
            icon: 'fa-check',
            type: 'success',
            title: 'Donation Received',
            message: 'New $5,000 donation for Clean Water Project',
            time: '2 minutes ago'
        },
        {
            icon: 'fa-user-plus',
            type: 'info',
            title: 'New Beneficiary',
            message: 'Maria Santos added to Education Program',
            time: '1 hour ago'
        },
        {
            icon: 'fa-exclamation-triangle',
            type: 'warning',
            title: 'Project Update',
            message: 'Healthcare Initiative needs attention',
            time: '3 hours ago'
        }
    ];
    
    let notificationHTML = `
        <div class="notification-dropdown">
            <div class="notification-header">
                <h3>Notifications</h3>
                <span class="notification-count">${notifications.length}</span>
            </div>
            <div class="notification-list">
    `;
    
    notifications.forEach(notification => {
        notificationHTML += `
            <div class="notification-item ${notification.type}">
                <div class="notification-icon">
                    <i class="fas ${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            </div>
        `;
    });
    
    notificationHTML += `
            </div>
            <div class="notification-footer">
                <a href="#" onclick="markAllAsRead()">Mark all as read</a>
            </div>
        </div>
    `;
    
    showDropdown(notificationHTML);
}

function showUserMenu() {
    const userMenu = `
        <div class="user-dropdown">
            <div class="user-info-full">
                <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Profile">
                <div>
                    <div class="user-name">${localStorage.getItem('userFirstName')} ${localStorage.getItem('userLastName')}</div>
                    <div class="user-email">${localStorage.getItem('userEmail')}</div>
                </div>
            </div>
            <div class="user-menu-items">
                <a href="#" onclick="logout()" class="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        </div>
    `;
    
    showDropdown(userMenu);
}

function showDropdown(content) {
    // Remove existing dropdown
    const existingDropdown = document.querySelector('.dropdown-overlay');
    if (existingDropdown) {
        existingDropdown.remove();
    }
    
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-overlay';
    dropdown.innerHTML = content;
    
    // Style the dropdown
    dropdown.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(dropdown);
    
    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

function logout() {
    // Clear user data
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userOrganization');
    
    // Show logout message
    showNotification('Logged out successfully!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function markAllAsRead() {
    const badge = document.querySelector('.badge');
    if (badge) {
        badge.style.display = 'none';
    }
    
    const dropdown = document.querySelector('.dropdown-overlay');
    if (dropdown) {
        dropdown.remove();
    }
    
    showNotification('All notifications marked as read', 'success');
}

function showProfile() {
    showNotification('Profile page coming soon!', 'info');
}

function showSettings() {
    showNotification('Settings page coming soon!', 'info');
}

function showHelp() {
    showNotification('Help center coming soon!', 'info');
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

// Add CSS for dropdowns
const dropdownStyles = document.createElement('style');
dropdownStyles.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-dropdown, .user-dropdown {
        background: white;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        border: 1px solid var(--gray-200);
        min-width: 300px;
        max-width: 400px;
    }
    
    .notification-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--gray-200);
    }
    
    .notification-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
    }
    
    .notification-count {
        background: var(--primary-600);
        color: white;
        font-size: 0.75rem;
        padding: 2px 8px;
        border-radius: var(--radius-xl);
        min-width: 18px;
        text-align: center;
    }
    
    .notification-list {
        max-height: 300px;
        overflow-y: auto;
    }
    
    .notification-item {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 1px solid var(--gray-100);
        transition: background 0.2s ease;
    }
    
    .notification-item:hover {
        background: var(--gray-50);
    }
    
    .notification-item:last-child {
        border-bottom: none;
    }
    
    .notification-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        color: white;
        flex-shrink: 0;
    }
    
    .notification-item.success .notification-icon {
        background: var(--success-600);
    }
    
    .notification-item.info .notification-icon {
        background: var(--primary-600);
    }
    
    .notification-item.warning .notification-icon {
        background: var(--warning-600);
    }
    
    .notification-title {
        font-weight: 500;
        color: var(--gray-900);
        margin-bottom: 2px;
    }
    
    .notification-message {
        font-size: 0.875rem;
        color: var(--gray-600);
        margin-bottom: 4px;
    }
    
    .notification-time {
        font-size: 0.75rem;
        color: var(--gray-500);
    }
    
    .notification-footer {
        padding: var(--spacing-md) var(--spacing-lg);
        border-top: 1px solid var(--gray-200);
        text-align: center;
    }
    
    .notification-footer a {
        color: var(--primary-600);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .notification-footer a:hover {
        text-decoration: underline;
    }
    
    .user-info-full {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--gray-200);
    }
    
    .user-info-full img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .user-email {
        font-size: 0.875rem;
        color: var(--gray-500);
        margin-top: 2px;
    }
    
    .user-menu-items {
        padding: var(--spacing-sm) 0;
    }
    
    .user-menu-items a {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-sm) var(--spacing-lg);
        color: var(--gray-700);
        text-decoration: none;
        font-size: 0.875rem;
        transition: background 0.2s ease;
    }
    
    .user-menu-items a:hover {
        background: var(--gray-50);
    }
    
    .user-menu-items .logout-link {
        color: var(--danger-600);
    }
    
    .user-menu-items .logout-link:hover {
        background: var(--danger-50);
    }
    
    .user-menu-items hr {
        margin: var(--spacing-sm) var(--spacing-lg);
        border: none;
        border-top: 1px solid var(--gray-200);
    }
`;

document.head.appendChild(dropdownStyles);