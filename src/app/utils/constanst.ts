const HOST = 'http://localhost:5102/';
const Front = 'http://localhost:5129';
// const HOST = '';
const CPANEL = HOST+'cpanel/api/';
const CUSTOMER = HOST+'customer/api/';
const SELLER = HOST+'seller/api/';

export const CONSTANST = {
    Front : Front,
    permissions: {},
    routes: {
        users: {
            moderator: CPANEL + 'users',
            seller: SELLER + 'users',
        },
        regions: CPANEL + 'regions',
        productcategories: CPANEL + 'product-categories',
        products: CPANEL + 'products',

        articles: CPANEL + 'articles',
        tags: CPANEL + 'tags',
        gamegenres: CPANEL + 'game-genre',
        comments: CPANEL + 'comments',
        articlecategories: CPANEL + 'article-categories',
        

        media: CPANEL + 'media',

        auth : HOST + "api/auth",
        secret : HOST + "api/secret",

        tickets: {
            moderator : CPANEL + "tickets",
            customer : CUSTOMER+ "tickets",
        },
        bankaccounts: {
            seller : SELLER + "bank-accounts",
            moderator : CPANEL +"bank-accounts"
        },

        licenses: {
            seller : SELLER + "licenses",
            moderator : CPANEL +"licenses"
        },
        
        licensegroup: {
            seller : SELLER + "license-group",
            moderator : CPANEL +"license-group"
        },
        contactMessage : CPANEL + 'contact-messages',
        additionalPages : CPANEL + 'additional-pages',
        systemSetting: CPANEL + 'system-setting',
        tempFile : CPANEL + 'temp-files',

        me : HOST + 'api/users/me'
    },
    lang: {},
    session: {},
    parameters: {}
};
