# 自己在 Explorer 找一个块手算 Cellbase 奖励和手续费

计算[8220472](https://explorer.nervos.org/block/8220472)区块的Cellbase

获得奖励的区块为： 8220472 - 11 = 8220461

一个Epoch中

- 一类增发：1,917,808.21917808
- 二类增发: 613698.63013698

8200461区块是第6307个Epoch中的第79个。
其所获得的一类增发：

```py
>>> 1917808.21917808 / 1200
1598.1735159817333
```

所获得的二类增发：

```py
>>> 613698.63013698 / 1200
511.41552511415
```

确定矿工二类增发比例：

```shell
ckb
config --url https://mainnet.ckb.dev
config --ckb-indexer-url https://mainnet.ckb.dev/indexer
```

```shell
rpc get_header --hash 0x9b277ab372ea9df88fc174dfdeb8884511bb1c5c555f9af58c369082ebc02660

dao: 0xdc1e8b7c2486c9444a6609eada092700019c5d3a02f649040026f9fd7f902507
```

DAO解码

```shell
python3
```

```python
>>> import struct
>>> struct.unpack('<4Q', bytes.fromhex('dc1e8b7c2486c9444a6609eada092700019c5d3a02f649040026f9fd7f902507'))
(4956640356164378332, 10988359925720650, 309048538881170433, 514976611800000000)
```

计算矿工获得的二级增发：

```python
>>> 613698.63013698 / 1200 * (514976611800000000 / 4956640356164378332)
53.134182716658785
```

计算矿工的commit奖励:

8220461区块除Cellbase外包含三笔交易，其手续费为：

|  tx | fee |
| :- | :-: |
| 0xf8d5da80e2b4f7e0116ce1a2e203afa1bd57573cb9edd2f7ff5cf1ed8ef614f4| 0.00001 |
0x9824cf3f01f54d7eabfb46f36f85a00280549ee874a256489f42502d38087e42| 0.00001 |
| 0x51255709775a9fa6109a1f02a09460ec7153ef53acd8ba09bcdb4ae4f79fd9d1| 0.00001 |

```python
>>> (0.00001 + 0.00001 + 0.00001) * 0.6
1.8e-05
```

即 0.00018

计算该矿工的proposal奖励：

8220461区块的有以下proposal：

```shell
rpc get_block --hash 0x3a7409023f81b959716db429d4e2656557bfdf39e6816ea3d885f451f1d9c7e8


proposals:
  - 0x57113a3a6c966b3c39d3
  - 0xad240d8abb820403d3ea
  - 0x599c1cee46ba43fa35c0

```

遍历8220462至8220471的区块，找到以上3笔proposal对应的交易，并查看其手续费，该矿工可获取其40%

|tx|block_num|fee|
|--|--|--|
|0x57113a3a6c966b3c39d3|8220462|0
.00002392|
|0xad240d8abb820403d3ea|8220462|0.002|
|0x599c1cee46ba43fa35c0|8220462|0
.00000883|

```python
>>> (0.00002392 + 0.002 + 0.00000883) * 0.4
0.0008131000000000002
```
