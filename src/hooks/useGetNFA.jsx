import { useGetSC } from "./useGetSC";
import hex2a from "../hex2a";

export function useGetNFA() {
  const [getSC] = useGetSC();

  async function getNFA(scid) {
    console.log("get nfa", scid);
    const nfaData = await getSC(scid, false, true);
    console.log("Nfa dta", nfaData);
    const nfaVars = nfaData.stringkeys;
    const NFA = {
      name: hex2a(nfaVars.nameHdr),
      type: hex2a(nfaVars.typeHdr),
      coverURL: hex2a(nfaVars.coverURL),
      iconURL: hex2a(nfaVars.iconURLHdr),
      scid: scid,

      //something like this
    };
    console.log(NFA);
    return NFA;
  }
  return [getNFA];
}
