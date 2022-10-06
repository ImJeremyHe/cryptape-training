import {readFileSync} from 'fs'
import {join} from 'path'
import {privateKeyToBlake160} from '@ckb-lumos/hd/lib/key'
import {generateSecp256k1Blake160Address, sealTransaction} from '@ckb-lumos/helpers'
import {config, hd, Indexer, RPC} from '@ckb-lumos/lumos'
import {generateDeployWithTypeIdTx} from '@ckb-lumos/common-scripts/lib/deploy'
import {prepareSigningEntries} from '@ckb-lumos/common-scripts/lib/helper'
import {predefined} from '@ckb-lumos/config-manager'

async function main() {
    const testnet = 'https://testnet.ckbapp.dev'
    const indexer = 'https://testnet.ckbapp.dev/indexer'
    const privateKey = '0x3dad09c803586741ae3c045838a43964ed7b924909bd5a369ab08676029c166b'
    const contractPath = join(__dirname, './always-success/build/release/always-success')

    config.initializeConfig(config.predefined.AGGRON4)

    const args = privateKeyToBlake160(privateKey)
    const fromAddr = generateSecp256k1Blake160Address(args, {config: predefined.AGGRON4})
    const contract = readFileSync(contractPath)

    const result = await generateDeployWithTypeIdTx({
        cellProvider: new Indexer(indexer, testnet),
        fromInfo: fromAddr,
        scriptBinary: contract,
        config: config.predefined.AGGRON4,
    })

    const tx = prepareSigningEntries(
        result.txSkeleton,
        config.predefined.AGGRON4,
        "SECP256K1_BLAKE160",
    )
    const sign = hd.key.signRecoverable(tx.get('signingEntries').get(0)?.message!, privateKey)

    const transaction = sealTransaction(tx, [sign])
    const hash = await new RPC(testnet).send_transaction(transaction)

    console.log(hash)
    // 0x4a17b2b340a2e65b73feb075e3d96ab979e6cfff1ba630006261d3370f74268d
    // https://pudge.explorer.nervos.org/transaction/0x4a17b2b340a2e65b73feb075e3d96ab979e6cfff1ba630006261d3370f74268d
}

main()
