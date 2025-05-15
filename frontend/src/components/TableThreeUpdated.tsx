import { useWasteWiseContext } from "../context";
import TableUpdated from "./TableUpdated";

export default function TableThreeUpdated() {
  const { verifiersData, isVerifiersDataSuccessful } = useWasteWiseContext();

  return (
    <TableUpdated
      rows={5}
      tableData={verifiersData}
      tableDataSuccess={isVerifiersDataSuccessful}
      tableTitle="Verifiers"
    />
  );
}
