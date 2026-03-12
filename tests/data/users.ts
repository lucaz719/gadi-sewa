// Test user credentials for all roles
export const TEST_USERS = {
    garage: {
        email: 'garage@gadisewa.com',
        password: 'Test@123',
        role: 'garage',
        name: 'Main Garage Owner',
        displayName: 'AG'
    },
    vendor: {
        email: 'vendor@gadisewa.com',
        password: 'Test@123',
        role: 'vendor',
        name: 'Parts Vendor',
        displayName: 'VP'
    },
    customer: {
        email: 'customer@gadisewa.com',
        password: 'Test@123',
        role: 'customer',
        name: 'John Doe',
        displayName: 'JD'
    },
    admin: {
        email: 'admin@gadisewa.com',
        password: 'Admin@123',
        role: 'admin',
        name: 'System Administrator',
        displayName: 'AD'
    }
};

// Test customer data
export const TEST_CUSTOMERS = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        phone: '+977-9841234567',
        email: 'rajesh@example.com',
        vehicle: 'Toyota Camry 2020',
        plateNumber: 'NPL 1234'
    },
    {
        id: 2,
        name: 'Sita Sharma',
        phone: '+977-9851234568',
        email: 'sita@example.com',
        vehicle: 'Honda Civic 2019',
        plateNumber: 'NPL 5678'
    },
    {
        id: 3,
        name: 'Amit Thapa',
        phone: '+977-9861234569',
        email: 'amit@example.com',
        vehicle: 'Hyundai i20 2021',
        plateNumber: 'NPL 9012'
    },
    {
        id: 4,
        name: 'Priya Rai',
        phone: '+977-9871234570',
        email: 'priya@example.com',
        vehicle: 'Suzuki Swift 2018',
        plateNumber: 'NPL 3456'
    },
    {
        id: 5,
        name: 'Bikash Gurung',
        phone: '+977-9881234571',
        email: 'bikash@example.com',
        vehicle: 'Yamaha FZ 2022',
        plateNumber: 'NPL 7890'
    }
];

// Test job complaints
export const TEST_COMPLAINTS = [
    {
        vehicle: 'Toyota Camry 2020',
        complaint: 'Engine making unusual noise and vibrating during acceleration',
        expectedDiagnosis: 'engine mount, spark plugs, or belt issues'
    },
    {
        vehicle: 'Honda Civic 2019',
        complaint: 'Brake pedal feels soft and making squeaking sound',
        expectedDiagnosis: 'brake pads, brake fluid, or air in brake lines'
    },
    {
        vehicle: 'Hyundai i20 2021',
        complaint: 'AC not cooling properly, blowing warm air',
        expectedDiagnosis: 'refrigerant leak, compressor, or condenser issues'
    }
];

// Test inventory items for POS
export const TEST_INVENTORY_ITEMS = [
    {
        name: 'Engine Oil 5W-30',
        sku: 'EO-5W30-TEST',
        category: 'Oils',
        price: 2500,
        stock: 50
    },
    {
        name: 'Brake Pads Front',
        sku: 'BP-F-TEST',
        category: 'Brakes',
        price: 3500,
        stock: 40
    },
    {
        name: 'Air Filter',
        sku: 'AF-TEST',
        category: 'Filters',
        price: 650,
        stock: 75
    }
];

// Test vendor products
export const TEST_VENDOR_PRODUCTS = [
    {
        name: 'Premium Engine Oil 5W-40',
        sku: 'VEN-EO-001',
        category: 'Oils',
        price: 3200,
        stock: 200,
        description: 'High-performance synthetic engine oil'
    },
    {
        name: 'Ceramic Brake Pads',
        sku: 'VEN-BP-001',
        category: 'Brakes',
        price: 4500,
        stock: 150,
        description: 'Premium ceramic brake pads for better performance'
    }
];

// Workflow step descriptions
export const WORKFLOW_STEPS = {
    garage: [
        'Login as Garage Owner',
        'View Dashboard Statistics',
        'Create New Job Card',
        'Use AI Complaint Analysis',
        'Add Inventory Item',
        'Process POS Sale',
        'View Financial Reports',
        'Manage Staff',
        'Logout'
    ],
    vendor: [
        'Login as Vendor',
        'View Vendor Dashboard',
        'Add Product to Catalog',
        'View Orders',
        'Check Garage Network',
        'View Financials',
        'Update Product Stock',
        'Logout'
    ],
    customer: [
        'Login as Customer',
        'View Vehicle Dashboard',
        'Add New Vehicle',
        'Book Service Appointment',
        'View Service History',
        'Check Fuel Log',
        'View Offers & Rewards',
        'Logout'
    ]
};
