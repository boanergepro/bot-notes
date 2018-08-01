const config = {
    port: process.env.PORT || 3000,
    telegram_token: process.env.TELEGRAM_TOKEN || '611320368:AAGtHIBXiQDKsOO5Ug-kNDwX804h4FpPFhk',
    pathDB: process.env.PATH || '../telegram_note.db',
    collectionNote: process.env.COLLECTION || 'notes'
};

module.exports = config;