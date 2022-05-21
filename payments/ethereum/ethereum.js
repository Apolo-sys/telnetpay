import Web3 from 'web3'
const crypto = {
    web3: new Web3(process.env.ethereum_node_url),
}

export default {
    init: async function () {
        global.payments.eth = {}

        
        global.payments.eth.new_wallet = async function () {
            return await crypto.web3.eth.accounts.create()
        }

        global.payments.eth.check_balance = async function (address) {
            return await crypto.web3.utils.fromWei((await crypto.web3.eth.getBalance(address)).toString(), 'ether')
        }

        global.payments.eth.send = async function (address, amount, toAddress, privateKey) {
            const account = crypto.web3.eth.accounts.privateKeyToAccount(privateKey)

            const gas = await crypto.web3.eth.estimateGas({
                to: toAddress,
                value: crypto.web3.utils.toWei(amount.toString(), 'ether')
            })

            const tx = {
                to: toAddress,
                value: crypto.web3.utils.toWei(amount.toString(), 'ether') - gas * 14,
                gas: gas,
            }

            const signedTx = await account.signTransaction(tx)
            const result = await crypto.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

            return tx.transactionHash
        }

        global.payments.eth.payment = async function (amount, cb) {
            const account = global.payments.new_wallet()

            let checkInterval = setInterval(async function () {
                const balance = await crypto.web3.eth.getBalance(account.address)

                if(balance >= amount) {
                    global.payments.eth.send(account.address, amount, process.env.ethereum_wallet, account.privateKey)

                    cb()
                    clearInterval(checkInterval)
                }

            }, 60 * 1000)

            return account.address
            // zi cuando me llegue el pc nuevo zi onde vas
        }

        /* 1 | 0.1
            address: '0xFF7a235c4f300008654e61A893989091a66CE793',
            privateKey: '0x3541c07e3a6883408ac5b380b7e2a51c1b3f6cd01592263fce89a9782d600f1a', e metido yo tmb de una pagina rara hacemos tusd de mientras? boi piola
        */

       /* 2 | 0.0
         address: '0xf3E3B308B0E7F97db59A48762a043f2cdda25fe7',
         privateKey: '0xd72f753692e5b3c42000d70e0e0f34ba15bbd54829d62eacd7872f1d935d6a32',
       */

        console.log(await global.payments.eth.check_balance('0xFF7a235c4f300008654e61A893989091a66CE793'))
        //console.log(await global.payments.eth.new_wallet())

        // global.payments.eth.send('0xf3E3B308B0E7F97db59A48762a043f2cdda25fe7', '0.001', '0xf3E3B308B0E7F97db59A48762a043f2cdda25fe7', '0x3541c07e3a6883408ac5b380b7e2a51c1b3f6cd01592263fce89a9782d600f1a')

        //para probar el mandar dinero
    }
}