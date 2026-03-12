export const testData = {
    inventory: {
        validItem: {
            name: 'Engine Oil 5W-30',
            sku: 'EO-5W30-001',
            category: 'Oils',
            vehicleType: 'Car',
            stock: 50,
            price: 2500,
            unit: 'liter'
        },
        updateItem: {
            name: 'Engine Oil 10W-40',
            stock: 75,
            price: 2800
        }
    },

    customers: {
        validCustomer: {
            name: 'John Doe',
            phone: '+977-9841234567',
            email: 'john.doe@example.com'
        }
    },

    jobs: {
        validComplaint: 'Engine making unusual noise and vibrating at high speeds',
        vehicleInfo: 'Toyota Camry 2020'
    },

    pos: {
        testProducts: [
            { name: 'Engine Oil 5L', expectedPrice: 2500 },
            { name: 'Air Filter', expectedPrice: 800 }
        ]
    }
};
