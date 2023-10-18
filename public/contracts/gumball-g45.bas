Function key(id Uint64, key String) String
10 RETURN "gb_" + id + "_" + key
End Function

Function storeTX(id Uint64)
10 STORE("tx_" + HEX(TXID()), id)
20 RETURN
End Function

Function storeAssets(id Uint64, storeIndex Uint64, assetList String) Uint64
10 DIM end, index, assetAmount, balanceCheck, balanceIndex as Uint64
20 DIM asset, row as String
40 LET index = 0
42 LET balanceCheck = 0
43 LET balanceIndex = 0
45 LET end = STRLEN(assetList) / 84
50 LET row = SUBSTR(assetList, index * 84, 84)
52 LET asset = SUBSTR(row, 0, 64)
55 LET assetAmount = ATOI(SUBSTR(row, 64, 20))
60 IF MAPEXISTS(asset) == 1 THEN GOTO 66
62 MAPSTORE(asset, 0)
63 LET balanceIndex = balanceIndex + 1
64 MAPSTORE(asset + "_value", ASSETVALUE(HEXDECODE(asset)))
66 MAPSTORE(asset, MAPGET(asset) + assetAmount)
68 IF MAPGET(asset) != MAPGET(asset + "_value") THEN GOTO 80
70 LET balanceCheck = balanceCheck + 1
80 STORE(key(id, "dp_" + storeIndex + "_asset"), asset)
90 STORE(key(id, "dp_" + storeIndex + "_amount"), assetAmount)
100 LET index = index + 1
105 LET storeIndex = storeIndex + 1
110 IF index < end THEN GOTO 50
115 IF balanceCheck != balanceIndex THEN GOTO 140
120 STORE(key(id, "storeIndex"), storeIndex)
130 RETURN 0
140 RETURN 1
End Function

Function Initialize() Uint64
10 IF EXISTS("CEO") == 1 THEN GOTO 60
11 STORE("QUORUM",0)
12 STORE("APPROVE",0)
20 STORE("CEO", HEX(SCID()))
21 STORE("treasury0000000000000000000000000000000000000000000000000000000000000000",0)
25 SEND_ASSET_TO_ADDRESS(SIGNER(),1,SCID())
30 STORE("fee_0000000000000000000000000000000000000000000000000000000000000000", 50) // 5%
40 STORE("gb_ctr", 0)
50 RETURN 0
60 RETURN 1
End Function

Function CreateMachine(name String, image String, desc String, assetList String, price Uint64, priceAssetId String, startTimestamp Uint64, expireTimestamp Uint64, dispenseCooldown Uint64, minDispense Uint64, maxDispense Uint64, lock Uint64) Uint64
10 DIM id as Uint64
20 LET id = LOAD("gb_ctr")
30 STORE(key(id, "creator"), ADDRESS_STRING(SIGNER()))
40 STORE(key(id, "price"), price)
41 STORE(key(id, "name"),name)
42 STORE(key(id,"image"),image)
43 STORE(key(id,"desc"),desc)
50 STORE(key(id, "priceAssetId"), priceAssetId)
60 STORE(key(id, "startTimestamp"), startTimestamp)
65 STORE(key(id, "minDispense"), minDispense)
70 STORE(key(id, "maxDispense"), maxDispense)
80 STORE(key(id, "storeIndex"), 0)
90 STORE(key(id, "expireTimestamp"), expireTimestamp)
100 STORE(key(id, "lock"), lock)
110 STORE(key(id, "lastDispense"), 0)
120 STORE(key(id, "dispenseCooldown"), dispenseCooldown)
130 STORE("gb_ctr", id + 1)
140 storeTX(id)
150 RETURN storeAssets(id, 0, assetList)
End Function

Function SetLock(id Uint64, lock Uint64) Uint64
10 IF LOAD(key(id, "creator")) != ADDRESS_STRING(SIGNER()) THEN GOTO 50
20 STORE(key(id, "lock"), lock)
30 storeTX(id)
40 RETURN 0
50 RETURN 1
End Function

Function EditMachine(id Uint64, price Uint64, startTimestamp Uint64, expireTimestamp Uint64, dispenseCooldown Uint64, minDispense Uint64, maxDispense Uint64, lock Uint64) Uint64
10 IF LOAD(key(id, "creator")) != ADDRESS_STRING(SIGNER()) THEN GOTO 120
20 STORE(key(id, "price"), price)
30 STORE(key(id, "dispenseCooldown"), dispenseCooldown)
40 STORE(key(id, "minDispense"), minDispense)
50 STORE(key(id, "maxDispense"), maxDispense)
60 STORE(key(id, "lock"), lock)
// 70 IF LOAD(key(id, "lastDispense")) > 0 THEN GOTO 110
80 STORE(key(id, "startTimestamp"), startTimestamp)
90 STORE(key(id, "expireTimestamp"), expireTimestamp)
100 storeTX(id)
110 RETURN 0
120 RETURN 1
End Function

Function Purchase(id Uint64, price Uint64, quantity Uint64) Uint64
10 DIM storeIndex, index, amount, assetAmount, ctr, platformCut, expireTimestamp, timestamp as Uint64
20 DIM signer, asset, priceAssetId, signerString, result as String
25 IF LOAD(key(id, "lock")) != 0 THEN GOTO 390
30 LET timestamp = BLOCK_TIMESTAMP()
40 IF timestamp < LOAD(key(id, "startTimestamp")) THEN GOTO 390
50 LET expireTimestamp = LOAD(key(id, "expireTimestamp"))
60 IF expireTimestamp == 0 THEN GOTO 80
70 IF timestamp > expireTimestamp THEN GOTO 390
80 IF timestamp < LOAD(key(id, "lastDispense")) + LOAD(key(id, "dispenseCooldown")) THEN GOTO 390
100 LET priceAssetId = LOAD(key(id, "priceAssetId"))
110 LET amount = ASSETVALUE(HEXDECODE(priceAssetId))
120 IF price != LOAD(key(id, "price")) THEN GOTO 390
130 IF quantity * price != amount THEN GOTO 390
140 LET signer = SIGNER()
150 IF quantity < LOAD(key(id, "minDispense")) THEN GOTO 390
160 IF quantity > LOAD(key(id, "maxDispense")) THEN GOTO 390
170 LET storeIndex = LOAD(key(id, "storeIndex"))
180 IF quantity > storeIndex THEN GOTO 390
200 LET ctr = 0
210 LET index = RANDOM() % storeIndex
220 LET assetAmount = LOAD(key(id, "dp_" + index + "_amount"))
230 LET asset = LOAD(key(id, "dp_" + index + "_asset"))
240 SEND_ASSET_TO_ADDRESS(signer, assetAmount, HEXDECODE(asset))
245 LET result = result + asset + ":" + assetAmount + ":" + index + ","
//245 LET result = result + index + ","
248 LET storeIndex = storeIndex - 1
249 IF storeIndex == index THEN GOTO 270
250 STORE(key(id, "dp_" + index + "_asset"), LOAD(key(id, "dp_" + storeIndex + "_asset")))
260 STORE(key(id, "dp_" + index + "_amount"), LOAD(key(id, "dp_" + storeIndex + "_amount")))
270 DELETE(key(id, "dp_" + storeIndex + "_asset"))
280 DELETE(key(id, "dp_" + storeIndex + "_amount"))
290 LET ctr = ctr + 1
300 IF ctr < quantity THEN GOTO 210
310 STORE(key(id, "storeIndex"), storeIndex)
330 LET platformCut = amount * LOAD("fee_" + priceAssetId) / 1000
340 STORE("treasury"+priceAssetId,LOAD("treasury"+priceAssetId)+platformCut)
350 SEND_ASSET_TO_ADDRESS(ADDRESS_RAW(LOAD(key(id, "creator"))), amount - platformCut, HEXDECODE(priceAssetId))
360 STORE(key(id, "lastDispense"), timestamp)
365 STORE("tx_" + HEX(TXID()) + "_result", result)
370 storeTX(id)
380 RETURN 0
390 RETURN 1
End Function

Function AddAssets(id Uint64, storeIndex Uint64, assetList String) Uint64
10 IF LOAD(key(id, "creator")) != ADDRESS_STRING(SIGNER()) THEN GOTO 50
20 storeTX(id)
25 IF LOAD(key(id, "lock")) == 0 THEN GOTO 50
30 IF storeIndex != LOAD(key(id, "storeIndex")) THEN GOTO 50
40 RETURN storeAssets(id, storeIndex, assetList)
50 RETURN 1
End Function

Function RetrieveAssets(id Uint64, storeIndex Uint64, orderedIndexList String) Uint64
10 DIM signer, asset as String
20 DIM assetAmount, end, index, assetIndex as Uint64
25 IF LOAD(key(id, "lock")) == 0 THEN GOTO 130
30 LET signer = SIGNER()
35 IF storeIndex != LOAD(key(id, "storeIndex")) THEN GOTO 130
40 IF LOAD(key(id, "creator")) != ADDRESS_STRING(signer) THEN GOTO 130
42 LET end = STRLEN(orderedIndexList) / 5
43 LET index = 0
44 MAPSTORE("lastIndex", 0)
45 LET assetIndex = ATOI(SUBSTR(orderedIndexList, index * 5, 5))
50 IF MAPGET("lastIndex") > assetIndex THEN GOTO 130 // force orderedList
55 MAPSTORE("lastIndex", assetIndex)
60 IF assetIndex < storeIndex THEN GOTO 70
65 LET assetIndex = MAPGET(assetIndex)
70 LET assetAmount = LOAD(key(id, "dp_" + assetIndex + "_amount"))
75 LET asset = LOAD(key(id, "dp_" + assetIndex + "_asset"))
80 SEND_ASSET_TO_ADDRESS(signer, assetAmount, HEXDECODE(asset))
90 LET storeIndex = storeIndex - 1
91 IF assetIndex >= storeIndex THEN GOTO 97
92 MAPSTORE(storeIndex, assetIndex)
93 STORE(key(id, "dp_" + assetIndex + "_asset"), LOAD(key(id, "dp_" + storeIndex + "_asset")))
95 STORE(key(id, "dp_" + assetIndex + "_amount"), LOAD(key(id, "dp_" + storeIndex + "_amount")))
97 DELETE(key(id, "dp_" + storeIndex + "_asset"))
98 DELETE(key(id, "dp_" + storeIndex + "_amount"))
100 LET index = index + 1
110 IF index < end THEN GOTO 45
113 STORE(key(id, "storeIndex"), storeIndex)
115 storeTX(id)
120 RETURN 0
130 RETURN 1
End Function

Function SetAssetFee(assetId String, fee Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 50
20 IF fee > 1000 THEN GOTO 50
30 STORE("fee_" + assetId, fee)
40 RETURN 0
50 RETURN 1
End Function

Function DelAssetFee(assetId String) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 40
20 DELETE("fee_" + assetId)
30 RETURN 0
40 RETURN 1
End Function

Function Propose(hash String, k String, u Uint64, s String, t Uint64, seat Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 13
11 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
12 GOTO 15
13 IF ASSETVALUE(HEXDECODE(LOAD("seat"+seat))) !=1 THEN GOTO 100
14 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("seat"+seat)))
15 STORE("APPROVE", 0)
20 IF hash =="" THEN GOTO 40
25 STORE("HASH",hash)
30 STORE("k","")
35 RETURN 0
40 STORE("k",k)
45 STORE("HASH","")
49 STORE("t",t)
50 IF t == 1 THEN GOTO 80
60 STORE("s", s)
70 RETURN 0
80 STORE("u",u)
90 RETURN 0
100 RETURN 1
End Function

Function Approve(seat Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("seat"+seat)))!=1 THEN GOTO 100
20 STORE("APPROVE",LOAD("APPROVE")+1)
30 STORE("seat"+seat+"Owner",SIGNER())
99 RETURN 0
100 RETURN 1
End Function

Function ClaimSeat(seat Uint64) Uint64
10 IF SIGNER()!= LOAD("seat"+seat+"Owner") THEN GOTO 100
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("seat"+seat)))
30 IF LOAD("APPROVE") == 0 THEN GOTO 99
40 STORE("APPROVE",LOAD("APPROVE")-1)
99 RETURN 0
100 RETURN 1
End Function

Function Update(code String) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO")))!=1 THEN GOTO 100
15 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
20 IF SHA256(code) != HEXDECODE(LOAD("HASH")) THEN GOTO 100
30 IF LOAD("APPROVE") < LOAD("QUORUM") THEN GOTO 100
40 UPDATE_SC_CODE(code)
99 RETURN 0
100 RETURN 1
End Function

Function Store() Uint64
10 IF LOAD("APPROVE") < LOAD("QUORUM") THEN GOTO 100
20 STORE("APPROVE",0)
30 IF LOAD("t") == 1 THEN GOTO 60
40 STORE(LOAD("k"), LOAD("s"))
45 STORE("k","")
50 RETURN 0
60 STORE(LOAD("k"),LOAD("u"))
65 STORE("k","")
99 RETURN 0
100 RETURN 1
End Function

Function Withdraw(amount Uint64, token String) Uint64
5 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 100
21 IF amount > LOAD("allowance"+token) THEN GOTO 100
22 SEND_ASSET_TO_ADDRESS(SIGNER(),amount,HEXDECODE(LOAD(token)))
23 STORE("allowance"+token,LOAD("allowance"+token) - amount)
24 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
25 STORE("treasury"+token,LOAD("treasury"+token)-amount)
29 RETURN 0
100 RETURN 1
End Function

Function Deposit(token String) Uint64
30 STORE("treasury"+token,LOAD("treasury"+token)+ASSETVALUE(HEXDECODE(LOAD(token))))
99 RETURN 0
End Function
