import bitcoin from './bitcoin/bitcoin.js';
import ethereum from './ethereum/ethereum.js';

export default {

    init: async () => 
    {
        console.log('Initing Payments Module...')
        global.payments = {}

        bitcoin.init()
        ethereum.init()
    }
}