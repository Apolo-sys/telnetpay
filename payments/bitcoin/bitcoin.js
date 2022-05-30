import coinjs from 'coinjs-lib';
import { generate, generateMultiple } from 'generate-passphrase'
import axios from 'axios';
import request from 'request';
import bitcore from 'bitcore-lib';
console.log('test')

export default {
    init: async function () {
        global.payments.btc = {}

        global.payments.btc.new_wallet = async function () {
            const passphrase = generate({ length: 12, separator: ' ', titlecase: false, numbers: false });
            const seed = coinjs.bip39.mnemonicToSeed(passphrase);
                      
            const btc = coinjs.HDNode.fromSeedBuffer(seed).derivePath(`m/44'/0'/0'/0/0`);
    
            const publicKey = btc.getAddress();
            const privateKey = btc.getPrivateKey();

            return {publicKey,  privateKey, passphrase}
        }

        global.payments.btc.check_balance = async function (address) {
            return new Promise(r => {
                axios.get(`https://blockchain.info/q/addressbalance/${address}`).then(function ({ data: balance }) {
                    return r(balance / 100000000)
                }).catch(function (error) {
                    console.log(`Error: ${error}`)
                })
            })
        }

        global.payments.btc.send_to_address = async function (address, amount, privateKey, fees) {
            const privateKeyAdd = new bitcore.PrivateKey(privateKey);
            const transaction = new bitcore.Transaction();
            transaction.from(privateKeyAdd);
            transaction.to(address, amount);
            transaction.fee(fees);
            transaction.change(privateKeyAdd);
            transaction.sign(privateKeyAdd);
            const raw = transaction.serialize();
            const txid = transaction.id;

            console.log(raw)

            return {raw, txid}
        }

        global.payments.btc.generate_invoice = async function (ammount) {
            const {publicKey, privateKey} = await global.payments.btc.new_wallet()

            console.log(publicKey, privateKey)
    
            //setInterval(async function () {
                let balance = await global.payments.btc.check_balance(publicKey)

                console.log(balance )

                if (balance >= ammount) 
                {
                    console.log('Payment received')
                } 
            //}, 60 * 1000);
            
        }
    }
}
//
