const API_URL = (window.location.hostname === 'localhost' && window.location.port === '5173')
  ? 'http://localhost:5000/api'
  : '/api';

export default API_URL;
