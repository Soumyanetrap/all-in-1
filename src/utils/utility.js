// Function to get a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to format a timestamp into a date string for the Indian locale
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-IN', options); // Format date for Indian locale
};

// Export the functions
export { getRandomInt, formatDate };
