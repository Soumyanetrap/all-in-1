const config_url = {
    development: {
        REACT_APP_API_URL: process.env.REACT_APP_API_URL,
        REACT_APP_WEBSOCKET_URL: process.env.REACT_APP_WEBSOCKET_URL,
    },
    production: {
        REACT_APP_API_URL: process.env.REACT_APP_PROD_API_URL,
        REACT_APP_WEBSOCKET_URL: process.env.REACT_APP_PROD_WEBSOCKET_URL,
    },
};


const environment = (process.env.REACT_APP_NODE_ENV === 'production') ? 'production' : 'development';
// const environment = 'production'
// const environment = 'development'


const { REACT_APP_API_URL, REACT_APP_WEBSOCKET_URL } = config_url[environment];
const REACT_APP_MASTER_KEY = process.env.REACT_APP_MASTER_KEY;
const REACT_APP_SESSION_DURATION_MINS = process.env.REACT_APP_SESSION_DURATION_MINS



console.log(REACT_APP_API_URL,REACT_APP_WEBSOCKET_URL)
export {
    REACT_APP_API_URL,
    REACT_APP_WEBSOCKET_URL,
    REACT_APP_MASTER_KEY,
    REACT_APP_SESSION_DURATION_MINS
} ;