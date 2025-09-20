// Mock API service - No actual HTTP calls needed
// This simulates API responses with mock data

const simulateApiCall = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

