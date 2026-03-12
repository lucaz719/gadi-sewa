// Common selectors used across tests
export const Selectors = {
    // Navigation
    nav: {
        dashboard: 'a[href="/"]',
        jobs: 'a[href="/jobs"]',
        inventory: 'a[href="/inventory"]',
        pos: 'a[href="/pos"]',
        createJob: 'a[href="/jobs/new"]'
    },

    // Inventory Page
    inventory: {
        addButton: 'button:has-text("Add Item")',
        searchInput: 'input[placeholder*="Search"]',
        table: 'table',
        editButton: (row: number) => `table tbody tr:nth-child(${row}) button:has-text("Edit")`,
        deleteButton: (row: number) => `table tbody tr:nth-child(${row}) button:has-text("Delete")`,

        // Modal
        modal: {
            nameInput: 'input[name="name"]',
            skuInput: 'input[name="sku"]',
            categorySelect: 'select[name="category"]',
            stockInput: 'input[name="stock"]',
            priceInput: 'input[name="price"]',
            saveButton: 'button:has-text("Save")',
            cancelButton: 'button:has-text("Cancel")'
        }
    },

    // Job Creation
    jobs: {
        createButton: 'button:has-text("Create Job")',
        customerSelect: 'select',
        complaintTextarea: 'textarea',
        nextButton: 'button:has-text("Next")',
        createJobButton: 'button:has-text("Create Job Card")',
        backButton: 'button:has-text("Back")'
    },

    // POS
    pos: {
        productCard: (index: number) => `.grid > div:nth-child(${index})`,
        cart: '.cart',
        cartItem: (index: number) => `.cart-item:nth-child(${index})`,
        incrementButton: 'button:has-text("+")',
        decrementButton: 'button:has-text("-")',
        removeButton: 'button:has-text("Remove")',
        checkoutButton: 'button:has-text("Complete Sale")',

        // Checkout Modal
        checkout: {
            cashMethod: 'button:has-text("Cash")',
            cardMethod: 'button:has-text("Card")',
            cashInput: 'input[type="number"]',
            finalizeButton: 'button:has-text("Finalize")'
        }
    },

    // Common
    common: {
        modal: '.modal',
        closeButton: 'button:has-text("Close")',
        confirmButton: 'button:has-text("Confirm")',
        toast: '.toast'
    }
};
