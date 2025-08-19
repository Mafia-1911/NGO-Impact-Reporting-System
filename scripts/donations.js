document.addEventListener("DOMContentLoaded", function () {
    // --- Sample Donation Data ---
    let donations = [
        { donor: "John Doe", amount: 120, project: "Education Program", date: "2025-08-01", status: "Completed" },
        { donor: "Jane Smith", amount: 500, project: "Healthcare Initiative", date: "2025-07-15", status: "Pending" },
        { donor: "Alex Johnson", amount: 1500, project: "Clean Water Project", date: "2025-06-20", status: "Completed" },
        { donor: "Maria Garcia", amount: 80, project: "Education Program", date: "2025-08-05", status: "Completed" },
        { donor: "David Kim", amount: 250, project: "Healthcare Initiative", date: "2025-07-28", status: "Failed" },
        { donor: "Sophia Lee", amount: 1100, project: "Clean Water Project", date: "2025-08-02", status: "Completed" },
        { donor: "Chris Evans", amount: 70, project: "Education Program", date: "2025-06-30", status: "Pending" },
        { donor: "Emma Brown", amount: 900, project: "Healthcare Initiative", date: "2025-08-10", status: "Completed" },
        { donor: "Daniel Wilson", amount: 300, project: "Clean Water Project", date: "2025-07-05", status: "Completed" },
        { donor: "Olivia Taylor", amount: 50, project: "Education Program", date: "2025-08-12", status: "Pending" }
    ];

    const rowsPerPage = 5;
    let currentPage = 1;
    let currentSort = { key: null, order: "asc" };

    // DOM Elements
    const tableBody = document.getElementById("donationsTableBody");
    const searchInput = document.getElementById("searchDonations");
    const projectFilter = document.getElementById("projectFilter");
    const amountFilter = document.getElementById("amountFilter");
    const dateFilter = document.getElementById("dateFilter");
    const paginationPages = document.getElementById("paginationPages");
    const startItem = document.getElementById("startItem");
    const endItem = document.getElementById("endItem");
    const totalItems = document.getElementById("totalItems");

    // --- Render Table ---
    function renderTable(data) {
        tableBody.innerHTML = "";
        let start = (currentPage - 1) * rowsPerPage;
        let end = start + rowsPerPage;
        let paginatedData = data.slice(start, end);

        paginatedData.forEach((donation, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${donation.donor}</td>
                <td>$${donation.amount.toLocaleString()}</td>
                <td>${donation.project}</td>
                <td>${donation.date}</td>
                <td><span class="status ${donation.status.toLowerCase()}">${donation.status}</span></td>
                <td><button class="btn btn-sm btn-outline" onclick="viewDonation(${start + index})">View</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Update pagination info
        startItem.textContent = start + 1;
        endItem.textContent = Math.min(end, data.length);
        totalItems.textContent = data.length;

        renderPagination(data.length);
    }

    // --- Render Pagination ---
    function renderPagination(totalItems) {
        paginationPages.innerHTML = "";
        let totalPages = Math.ceil(totalItems / rowsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.classList.add("pagination-btn");
            if (i === currentPage) btn.classList.add("active");
            btn.textContent = i;
            btn.addEventListener("click", () => {
                currentPage = i;
                applyFiltersAndRender();
            });
            paginationPages.appendChild(btn);
        }

        document.getElementById("prevBtn").disabled = currentPage === 1;
        document.getElementById("nextBtn").disabled = currentPage === totalPages;
    }

    // --- Change Page ---
    window.changePage = function (direction) {
        currentPage += direction;
        applyFiltersAndRender();
    };

    // --- Search & Filters ---
    function applyFiltersAndRender() {
        let filteredData = donations.filter(donation => {
            const searchTerm = searchInput.value.toLowerCase();
            const projectValue = projectFilter.value;
            const amountValue = amountFilter.value;
            const dateValue = dateFilter.value;

            let matchesSearch =
                donation.donor.toLowerCase().includes(searchTerm) ||
                donation.project.toLowerCase().includes(searchTerm);

            let matchesProject = projectValue === "all" || donation.project.toLowerCase() === projectValue;

            let matchesAmount = true;
            if (amountValue !== "all") {
                const [min, max] = amountValue.split("-").map(v => v === "+" ? Infinity : parseFloat(v));
                matchesAmount = donation.amount >= min && donation.amount <= (max || Infinity);
            }

            let matchesDate = true;
            if (dateValue) {
                matchesDate = donation.date === dateValue;
            }

            return matchesSearch && matchesProject && matchesAmount && matchesDate;
        });

        if (currentSort.key) {
            filteredData.sort((a, b) => {
                let valA = a[currentSort.key];
                let valB = b[currentSort.key];

                if (currentSort.key === "amount") {
                    valA = parseFloat(valA);
                    valB = parseFloat(valB);
                } else if (currentSort.key === "date") {
                    valA = new Date(valA);
                    valB = new Date(valB);
                } else {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA < valB) return currentSort.order === "asc" ? -1 : 1;
                if (valA > valB) return currentSort.order === "asc" ? 1 : -1;
                return 0;
            });
        }

        renderTable(filteredData);
        return filteredData; // ✅ Important for CSV export
    }

    // --- Sorting ---
    window.sortTable = function (key) {
        if (currentSort.key === key) {
            currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
        } else {
            currentSort.key = key;
            currentSort.order = "asc";
        }
        applyFiltersAndRender();
    };

    // --- Modal View ---
    window.viewDonation = function (index) {
        const donation = donations[index];
        const modal = document.getElementById("donationModal");
        const modalContent = document.getElementById("donationModalContent");

        modalContent.innerHTML = `
            <p><strong>Donor:</strong> ${donation.donor}</p>
            <p><strong>Amount:</strong> $${donation.amount.toLocaleString()}</p>
            <p><strong>Project:</strong> ${donation.project}</p>
            <p><strong>Date:</strong> ${donation.date}</p>
            <p><strong>Status:</strong> ${donation.status}</p>
        `;
        modal.style.display = "block";
    };

    window.closeDonationModal = function () {
        document.getElementById("donationModal").style.display = "none";
    };

    // ✅ Export to CSV
    window.exportToCSV = function () {
        const filteredData = applyFiltersAndRender();
        if (filteredData.length === 0) {
            alert("No donations to export.");
            return;
        }
        const headers = ["Donor", "Amount", "Project", "Date", "Status"];
        const rows = filteredData.map(d => [d.donor, d.amount, d.project, d.date, d.status]);
        let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "donations.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ✅ Add Donation (Record Donation)
    window.showAddDonationModal = function () {
        document.getElementById("addDonationModal").style.display = "block";
    };

    window.closeAddDonationModal = function () {
        document.getElementById("addDonationModal").style.display = "none";
    };

    window.addDonation = function (event) {
        event.preventDefault();
        const donor = document.getElementById("donorName").value.trim();
        const amount = parseFloat(document.getElementById("donationAmount").value);
        const project = document.getElementById("donationProject").value.trim();
        const date = document.getElementById("donationDate").value;
        const status = document.getElementById("donationStatus").value;

        if (!donor || isNaN(amount) || !project || !date || !status) {
            alert("Please fill all fields.");
            return;
        }

        donations.unshift({ donor, amount, project, date, status }); // Add to top
        closeAddDonationModal();
        applyFiltersAndRender();
        alert("Donation added successfully!");
    };

    // Initial Render
    applyFiltersAndRender();
});
