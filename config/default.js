module.exports = {
    "dbConfig": {
        "connectionString": "mongodb://ecommerce:ecommerce@localhost:27017/ecommerce"
    },
    "server": {
        "port": process.env.PORT || 8090,
        "api_base_url": "https://ecommerce-staging-api.herokuapp.com/",
        "web_base_url": "https://ecommerce-staging-web.herokuapp.com/"
    },
    "SALT_WORK_FACTOR": 10,
    "stripe": {
        "secret_key": "sk_test_LOmTKVFsWqy8MnXFUKy7TiaQ",
        "public_key": "pk_test_Ar8xk0bdaCSIdFfQp9xS9DEQ"
    },
    "currency": "USD",
    "recaptcha": {
        "site_key": "6LdREjAUAAAAAAd64P-Rk4GQ59RIJtLOauo7uUNc",
        "secret_key":"6LdREjAUAAAAAEZ-RljoibjYCsCNAXDl-YR0lCma"
    }
};