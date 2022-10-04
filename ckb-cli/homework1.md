# CKB-CLI

## Deploy a contract binary with type id type script

## Find a molecule encoded OutPointVec then decode it

## Sign a message/string then verify the signature

```shell
util sign-data --utf8-string jeremyhe --from-account ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwvgmfqtwtctv3dskd4jglkelm5k908wjcdp4vss
```

> message: 0x573a7f320d8e8e40403682d9d37d6b31ebc10b4e950fb8f3bb5823b3cb1da57c
path: m
recoverable: false
signature: 0xd865d936a060b83731832f59340792a9cfa677c0e7dc2badee6fc4566864a89c4043e79b6335d5c59d5edec1d908396f1950baeb46f44cddd1321becb07d4aa8

```shell
util verify-signature --signature 0xd865d936a060b83731832f59340792a9cfa677c0e7dc2badee6fc4566864a89c4043e79b6335d5c59d5edec1d908396f1950baeb46f44cddd1321becb07d4aa8 --from-account ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwvgmfqtwtctv3dskd4jglkelm5k908wjcdp4vss --message 0x573a7f320d8e8e40403682d9d37d6b31ebc10b4e950fb8f3bb5823b3cb1da57c
```

> pubkey: 0x02c6c69db14f9558f3a5a9391b22b3a65cdc1c717fd8440644288968200a4da19f
recoverable: false
verify-ok: true
