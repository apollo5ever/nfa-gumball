Function Initialize(name String, coverURL String, typeHdr String, iconURLHdr String) Uint64
10 STORE("nameHdr",name)
20 STORE("coverURL",coverURL)
30 STORE("typeHdr",typeHdr)
40 STORE("iconURLHdr",iconURLHdr)
50 SEND_ASSET_TO_ADDRESS(SIGNER(),1,SCID())
99 RETURN 0
End Function