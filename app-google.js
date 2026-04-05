// ============================================
// CONFIGURATION
// ============================================

// TODO: Replace with your Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyznXkmqE7kfCHwTccmndKtWZ9lTcBm8g09ZIlPbSeYG4kqWUo39vWphieOsMrp5-nU/exec";

// Example: https://script.google.com/macros/s/AKfycbx.../exec

// ============================================
// GLOBAL VARIABLES
// ============================================

let currentUserEmail = '';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadSavedEmail();
});

function setupEventListeners() {
    // Form submission
    document.getElementById('issueForm').addEventListener('submit', handleFormSubmit);
    
    // Email input change
    document.getElementById('userEmailInput').addEventListener('change', handleEmailChange);
}

function loadSavedEmail() {
    // Load email from localStorage if available
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        document.getElementById('userEmailInput').value = savedEmail;
        updateUserDisplay(savedEmail);
    }
}

function handleEmailChange(event) {
    const email = event.target.value;
    if (email && isValidEmail(email)) {
        localStorage.setItem('userEmail', email);
        updateUserDisplay(email);
    }
}

function updateUserDisplay(email) {
    currentUserEmail = email;
    const name = email.split('@')[0]; // Extract name from email
    document.getElementById('userName').textContent = name;
    document.getElementById('userEmail').textContent = email;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// FORM SUBMISSION
// ============================================

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
    
    try {
        // Validate email
        const userEmail = document.getElementById('userEmailInput').value;
        if (!isValidEmail(userEmail)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Collect form data
        const issueData = {
            timestamp: new Date().toISOString(),
            theme: document.getElementById('theme').value,
            raisedBy: userEmail,
            issueDetails: document.getElementById('issueDetails').value,
            assignedTo: document.getElementById('assignedTo').value,
            status: 'Open',
            attachments: 'None'
        };
        
        // Submit to Google Sheets
        await submitToGoogleSheets(issueData);
        
        // Show success message
        showAlert('Issue submitted successfully! The team has been notified.', 'success');
        
        // Clear form (except email)
        clearForm();
        
    } catch (error) {
        console.error('Submission error:', error);
        showAlert('Failed to submit issue. Please try again. Error: ' + error.message, 'danger');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="bi bi-send me-2"></i>Submit Issue';
    }
}

// ============================================
// GOOGLE SHEETS INTEGRATION
// ============================================

async function submitToGoogleSheets(issueData) {
    // Check if SCRIPT_URL is configured
    if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
        throw new Error('Google Apps Script URL not configured. Please see GOOGLE_SETUP_GUIDE.md');
    }
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(issueData)
        });
        
        // Note: With no-cors mode, we can't read the response
        // We assume success if no error is thrown
        console.log('Issue submitted to Google Sheets');
        
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        throw new Error('Failed to submit to Google Sheets. Please check your internet connection and try again.');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alertDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function clearForm() {
    // Clear all fields except email
    document.getElementById('theme').value = '';
    document.getElementById('issueDetails').value = '';
    document.getElementById('assignedTo').value = 'sanaaks';
    
    // Clear alerts
    document.getElementById('alertContainer').innerHTML = '';
}

// ============================================
// DEMO MODE (for testing without Google setup)
// ============================================

// Uncomment this function to test the UI without Google Apps Script setup
/*
function enableDemoMode() {
    console.log('Demo mode enabled - no actual submission to Google Sheets');
    
    // Override form submission for demo
    const originalSubmit = submitToGoogleSheets;
    window.submitToGoogleSheets = async function(issueData) {
        console.log('Demo mode: Would submit this data:', issueData);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    };
}

// Call this to enable demo mode
// enableDemoMode();
*/
