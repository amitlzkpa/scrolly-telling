async function performStateDiffCheck(inStateDiffChk) {
  let hasAChange = JSON.stringify(inStateDiffChk.stateA) !== JSON.stringify(inStateDiffChk.stateB);
  return hasAChange;
}



export default {
  performStateDiffCheck
};