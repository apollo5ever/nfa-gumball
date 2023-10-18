Function Initialize() Uint64
10 STORE("CEO",HEX(SCID()))
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,SCID())
30 STORE("QUORUM",0)
40 STORE("APPROVE",0)
99 RETURN 0
100 RETURN 1

// gumball functions

//let's say each machine is one contract
//then 

//let's say we have a single master contract with me and cakemaster oao in control
//then it can almost be g45 version


//oao functions

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