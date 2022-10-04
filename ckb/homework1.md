# 使用 ckb-cli tx 子命令手动组装交易

为测试账号转账10000 ckb

> <https://faucet.nervos.org/>

交易地址：
> <https://pudge.explorer.nervos.org/transaction/0x6e4209b398dcf781c3be4fb6506cdd75d2468745a0a6f49f8a184a5892705703>

```shell
CKB> info
[  ckb-cli version ]: 1.1.1 (e41c4a3 2022-09-09)
[              url ]: https://testnet.ckbapp.dev/rpc (network: Testnet, #6899831)
[      ckb-indexer ]: https://testnet.ckbapp.dev/indexer (0x6d765e#6899831)
[              pwd ]: /Users/jeremyhe/work/cryptape/cryptape-training
[            color ]: true
[            debug ]: false
[          no-sync ]: false
[    output format ]: yaml
[ completion style ]: List
[       edit style ]: Emacs
```

新建交易

```shell
CKB> tx init --tx-file ./tx.json
status: success
CKB> tx info --tx-file ./tx.json
input_total: 0.0 (CKB)
output_total: 0.0 (CKB)
tx_fee: 0.0 (CKB)
```

```shell
CKB> tx add-multisig-config --sighash-address ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwvgmfqtwtctv3dskd4jglkelm5k908wjcdp4vss --tx-file ./tx.json
status: success

CKB> tx add-input --tx-hash 0x6e4209b398dcf781c3be4fb6506cdd75d2468745a0a6f49f8a184a5892705703 --index 0 --tx-file ./tx.json
status: success
```

```shell
tx add-output --capacity 500 --tx-file ./tx.json --to-sighash-address ckt1qyq8s90x8tkwv2hpx6tn8696fx8m7klr6m6stqrkje
status: success

tx add-output --capacity 9499 --tx-file ./tx.json --to-sighash-address ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwvgmfqtwtctv3dskd4jglkelm5k908wjcdp4vss
status: success

CKB> tx sign-inputs --tx-file ./tx.json --add-signatures --from-account ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwvgmfqtwtctv3dskd4jglkelm5k908wjcdp4vss
Password:
- lock-arg: 0xcc46d205b9785b22d859b5923f6cff74b15e774b
  signature: 0x2814d31c5c39e257347651768d91cb74562d1c0f1e4946d5295f871406f23f62446ef77f6b59ddc3c6707e73b70b864e1a6b859f2ea13ba1219586adb0acfab600
```

tx info:

```shell
CKB> tx info --tx-file ./tx.json
[input(signed)] ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwvgmfqtwtctv3dskd4jglkelm5k908wjcdp4vss => 10000.0, (data-length: 0, type-script: none, lock-kind: sighash(secp))
[output] ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqtczhnr4m8x9tsnd9enazaynralt03adagxexc2w => 500.0, (data-length: 0, type-script: none, lock-kind: sighash(secp))
[output] ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwvgmfqtwtctv3dskd4jglkelm5k908wjcdp4vss => 9499.0, (data-length: 0, type-script: none, lock-kind: sighash(secp))
input_total: 10000.0 (CKB)
output_total: 9999.0 (CKB)
tx_fee: 1.0 (CKB)
```
