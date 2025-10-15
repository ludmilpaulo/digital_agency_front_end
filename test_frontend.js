// Frontend Testing Script
// This script tests various frontend functionalities

const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(testName, passed, details = '') {
    testResults.tests.push({
        name: testName,
        passed: passed,
        details: details,
        timestamp: new Date().toISOString()
    });
    
    if (passed) {
        testResults.passed++;
        console.log(`✅ PASS: ${testName}`);
    } else {
        testResults.failed++;
        console.log(`❌ FAIL: ${testName} - ${details}`);
    }
}

// Test 1: Check if page loads
function testPageLoad() {
    try {
        const title = document.title;
        logTest('Page Load', title.length > 0, `Title: ${title}`);
    } catch (error) {
        logTest('Page Load', false, error.message);
    }
}

// Test 2: Check navigation elements
function testNavigation() {
    try {
        const navLinks = document.querySelectorAll('nav a, header a');
        logTest('Navigation Elements', navLinks.length > 0, `Found ${navLinks.length} navigation links`);
        
        // Check for specific navigation items
        const hasHome = Array.from(navLinks).some(link => 
            link.textContent.toLowerCase().includes('home') || 
            link.getAttribute('href') === '/'
        );
        logTest('Home Link', hasHome, 'Home link found');
        
        const hasServices = Array.from(navLinks).some(link => 
            link.textContent.toLowerCase().includes('service')
        );
        logTest('Services Link', hasServices, 'Services link found');
        
    } catch (error) {
        logTest('Navigation Elements', false, error.message);
    }
}

// Test 3: Check for logo/branding
function testBranding() {
    try {
        const logo = document.querySelector('img[alt*="logo"], img[alt*="E-B"], img[alt*="Global"]');
        logTest('Logo/Branding', logo !== null, 'Logo element found');
        
        const brandText = Array.from(document.querySelectorAll('*')).some(el => 
            el.textContent && el.textContent.includes('E-B Global')
        );
        logTest('Brand Text', brandText, 'Brand text "E-B Global" found');
        
    } catch (error) {
        logTest('Branding', false, error.message);
    }
}

// Test 4: Check for search functionality
function testSearchFunctionality() {
    try {
        const searchInput = document.querySelector('input[placeholder*="service"], input[type="search"], input[placeholder*="search"]');
        logTest('Search Input', searchInput !== null, 'Search input field found');
        
    } catch (error) {
        logTest('Search Functionality', false, error.message);
    }
}

// Test 5: Check for responsive design elements
function testResponsiveDesign() {
    try {
        const viewport = document.querySelector('meta[name="viewport"]');
        logTest('Viewport Meta Tag', viewport !== null, 'Responsive viewport meta tag found');
        
        // Check for Tailwind CSS classes (common responsive classes)
        const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"], [class*="sm:"]');
        logTest('Responsive Classes', responsiveElements.length > 0, `Found ${responsiveElements.length} responsive elements`);
        
    } catch (error) {
        logTest('Responsive Design', false, error.message);
    }
}

// Test 6: Check for JavaScript functionality
function testJavaScriptFunctionality() {
    try {
        // Check if React is loaded
        const reactElements = document.querySelectorAll('[data-reactroot], [id*="__next"]');
        logTest('React Framework', reactElements.length > 0, 'React/Next.js elements found');
        
        // Check for interactive elements
        const buttons = document.querySelectorAll('button, [role="button"]');
        logTest('Interactive Elements', buttons.length > 0, `Found ${buttons.length} interactive elements`);
        
    } catch (error) {
        logTest('JavaScript Functionality', false, error.message);
    }
}

// Test 7: Check for accessibility features
function testAccessibility() {
    try {
        const altImages = document.querySelectorAll('img[alt]');
        const totalImages = document.querySelectorAll('img');
        const altRatio = totalImages.length > 0 ? (altImages.length / totalImages.length) : 0;
        
        logTest('Image Alt Text', altRatio >= 0.8, `${Math.round(altRatio * 100)}% of images have alt text`);
        
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        logTest('Heading Structure', headings.length > 0, `Found ${headings.length} heading elements`);
        
    } catch (error) {
        logTest('Accessibility', false, error.message);
    }
}

// Test 8: Check for form elements
function testFormElements() {
    try {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input, textarea, select');
        
        logTest('Form Elements', forms.length > 0 || inputs.length > 0, 
            `Found ${forms.length} forms and ${inputs.length} input elements`);
        
    } catch (error) {
        logTest('Form Elements', false, error.message);
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting Frontend Tests...\n');
    
    testPageLoad();
    testNavigation();
    testBranding();
    testSearchFunctionality();
    testResponsiveDesign();
    testJavaScriptFunctionality();
    testAccessibility();
    testFormElements();
    
    // Generate summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
    
    // Return results for external use
    return testResults;
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
    // Browser environment
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }
} else {
    // Node.js environment
    console.log('Frontend tests need to be run in a browser environment');
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests, testResults };
}
