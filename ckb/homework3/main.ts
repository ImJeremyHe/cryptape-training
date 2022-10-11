import {normalizers, Reader} from 'ckb-js-toolkit'
import {SerializeWitnessArgs} from '@ckb-lumos/base/lib/core'
import {SECP_SIGNATURE_PLACEHOLDER} from '@ckb-lumos/common-scripts/lib/helper'
import {
  sealTransaction,
  TransactionSkeleton,
} from "@ckb-lumos/helpers"
import {predefined as lumosPrefined} from "@ckb-lumos/config-manager"
import {config, hd, Indexer, RPC} from "@ckb-lumos/lumos"
import {prepareSigningEntries} from "@ckb-lumos/common-scripts/lib/helper"

async function main() {
    config.initializeConfig(config.predefined.AGGRON4);

    const testnet = 'https://testnet.ckbapp.dev'
    const indexer = 'https://testnet.ckbapp.dev/indexer'
    const privateKey = '0x3dad09c803586741ae3c045838a43964ed7b924909bd5a369ab08676029c166b'

    let txSkeleton = TransactionSkeleton({cellProvider: new Indexer(indexer, testnet)})
    txSkeleton = txSkeleton.update('inputs', (inputs) => {
        // use ckb-cli to get the information
        // rpc get_live_cell --tx_hash <tx_hash> --index 1
        return inputs.push({
            cell_output: {
                capacity: '0x1b0e0f25ae',
                lock: {
                    args: '0x730ebab86d20560e103535ebb789d8c3a7f7c337',
                    code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
                    hash_type: 'type',
                },
            },
            out_point: {
                tx_hash: '0x4a17b2b340a2e65b73feb075e3d96ab979e6cfff1ba630006261d3370f74268d',
                index: '0x1',
            },
            data: '0x'
        })
    })

    txSkeleton = txSkeleton.update('outputs', (outputs) => {
        // https://pudge.explorer.nervos.org/transaction/0x4a17b2b340a2e65b73feb075e3d96ab979e6cfff1ba630006261d3370f74268d
        // 1000 tx fee
        return outputs.push(
            {
                cell_output: {
                    // capacity: '0x19a27884c6',
                    capacity: '0x1b0e0f21c6',
                    lock: {
                        code_hash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
                        hash_type: 'type',
                        args: '0x6f12b8c9d2841760ff77fb22cc09250c938a665690ca6032bbd7a0edbc65f752',
                    },
                    type: {
                        code_hash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
                        hash_type: 'type',
                        args: '0x6f12b8c9d2841760ff77fb22cc09250c938a665690ca6032bbd7a0edbc65f752',
                    }
                },
                data: '0x'
            }
        )
    })

    const secp256k1 = lumosPrefined.AGGRON4.SCRIPTS.SECP256K1_BLAKE160
    txSkeleton = txSkeleton.update('cellDeps', (deps) => {
        return deps.push(
            {
                out_point: {
                    tx_hash: secp256k1.TX_HASH,
                    index: secp256k1.INDEX,
                },
                dep_type: secp256k1.DEP_TYPE,
            },
            {
                out_point: {
                    tx_hash: '0x4a17b2b340a2e65b73feb075e3d96ab979e6cfff1ba630006261d3370f74268d',
                    index: '0x0',
                },
                dep_type: 'code',
            },
        )
    })

    txSkeleton = txSkeleton.update('witnesses', (witnesses) => {
        return witnesses.push(
            new Reader(
                SerializeWitnessArgs(
                    normalizers.NormalizeWitnessArgs(
                        {lock: SECP_SIGNATURE_PLACEHOLDER}
                    )
                )
            ).serializeJson()
        )
    })

    const tx = prepareSigningEntries(
        txSkeleton,
        config.predefined.AGGRON4,
        'SECP256K1_BLAKE160',
    )

    const signature = hd.key.signRecoverable(
        tx.get('signingEntries').get(0)?.message!,
        privateKey,
    )
    const transaction = sealTransaction(tx, [signature])

    const txHash = await new RPC(testnet).send_transaction(transaction)

    console.log(txHash)
}

main()
