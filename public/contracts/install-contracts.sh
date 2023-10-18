#!/bin/bash

names=("angel" "tommy" "buzz" "hardy")
covers=("https://imgs.search.brave.com/9BLdnUdurY37QhMZ7fApQg1ARvkKEEoycsCbgjRGKGU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk56azVaV00z/TkRFdE0ySTNPUzAw/TTJRMUxUaGxaREF0/TXpRME5tSTBPVEkz/TnpFelhrRXlYa0Zx/Y0dkZVFWUm9hWEpr/VUdGeWRIbEpibWRs/YzNScGIyNVhiM0py/Wm14dmR3QEAuX1Yx/X1FMNzVfVVkyODFf/Q1I4NCwwLDUwMCwy/ODFfLmpwZw" "https://imgs.search.brave.com/Yw0fPjo7FgTUYx8yvBRpJtfRpKxq4Uc0Qd0PcRatFp4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk1USmlZMll5/TkRJdE5USmpOeTAw/TmpRMExUZzBaVEV0/TWpJeVlUSXpORGd3/TlRBMlhrRXlYa0Zx/Y0dkZVFWUm9hWEpr/VUdGeWRIbEpibWRs/YzNScGIyNVhiM0py/Wm14dmR3QEAuX1Yx/X1FMNzVfVVkyODFf/Q1I5MiwwLDUwMCwy/ODFfLmpwZw" "https://imgs.search.brave.com/b-nkRSw0bSrFFrcfVAs2rRwbXI5hFzRa5pkSribUGjk/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/c211cmYuY29tL2No/YXJhY3RlcnMtc211/cmZzL3BhcGEucG5n" "https://imgs.search.brave.com/SO6LNqL5orSSWttmQtNURK8EFJrWEDWO1GSL3CO10nw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzdkLzMy/LzI0LzdkMzIyNGU4/MjZjOGRlY2VlZWFk/Yzk1ZGExMjI0ZDE3/LmpwZw")
types=("avatar" "avatar" "avatar" "avatar")
icons=("g" "h" "i")

for ((i=0; i<${#names[@]}; i++)); do
    name=${names[i]}
    cover=${covers[i]}
    type=${types[i]}
    icon=${icons[i]}
     
      response=$(curl -X POST http://127.0.0.1:30000/json_rpc -H 'content-type: application/json' -d "{
    \"jsonrpc\": \"2.0\",
    \"id\": \"1\",
    \"method\": \"transfer\",
    \"params\": {
        \"sc_rpc\": [
            {
                \"name\": \"entrypoint\",
                \"datatype\": \"S\",
                \"value\": \"Initialize\"
            },
            {
                \"name\": \"name\",
                \"datatype\": \"S\",
                \"value\": \"$name\"
            },
            {
                \"name\": \"coverURL\",
                \"datatype\": \"S\",
                \"value\": \"$cover\"
            },
            {
                \"name\": \"typeHdr\",
                \"datatype\": \"S\",
                \"value\": \"$type\"
            },
            {
                \"name\": \"iconURLHdr\",
                \"datatype\": \"S\",
                \"value\": \"$icon\"
            }
        ],
        \"sc\": \"RnVuY3Rpb24gSW5pdGlhbGl6ZShuYW1lIFN0cmluZywgY292ZXJVUkwgU3RyaW5nLCB0eXBlSGRyIFN0cmluZywgaWNvblVSTEhkciBTdHJpbmcpIFVpbnQ2NAoxMCBTVE9SRSgibmFtZUhkciIsbmFtZSkKMjAgU1RPUkUoImNvdmVyVVJMIixjb3ZlclVSTCkKMzAgU1RPUkUoInR5cGVIZHIiLHR5cGVIZHIpCjQwIFNUT1JFKCJpY29uVVJMSGRyIixpY29uVVJMSGRyKQo1MCBTRU5EX0FTU0VUX1RPX0FERFJFU1MoU0lHTkVSKCksMSxTQ0lEKCkpCjk5IFJFVFVSTiAwCkVuZCBGdW5jdGlvbg==\",
        \"ringsize\": 2
    }
}" )
        txid=$(echo $response | jq -r '.result.txid')
        
        if [ -n "$txid" ]; then
            
           echo "Received txid: $txid"
           sleep 10
        else
            echo "Error extracting txid from response."
        fi
  
done
