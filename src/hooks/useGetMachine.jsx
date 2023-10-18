import { useGetSC } from "./useGetSC";
import hex2a from "../hex2a";
import { SCIDS } from "../utils/helpers";

export function useGetMachine() {
  const [getSC] = useGetSC();

  async function getMachine(id) {
    const gumballContract = await getSC(SCIDS.GUMBALL_SIM, false, true);

    const contractVars = gumballContract.stringkeys;
    let assetList = [];
    for (var a = 0; a < contractVars[`gb_${id}_storeIndex`]; a++) {
      assetList.push(hex2a(contractVars[`gb_${id}_dp_${a}_asset`]));
    }
    const Machine = {
      id: id,
      price: contractVars[`gb_${id}_price`],
      collection: assetList,
      name: hex2a(contractVars[`gb_${id}_name`]),
      image: hex2a(contractVars[`gb_${id}_image`]),
      description: hex2a(contractVars[`gb_${id}_desc`]),
      max: contractVars[`gb_${id}_maxDispense`],
      min: contractVars[`gb_${id}_minDispense`],

      //something like this
    };

    return Machine;
  }
  return [getMachine];
}
