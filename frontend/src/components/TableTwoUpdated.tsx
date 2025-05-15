import { useWasteWiseContext } from "../context";
import TableUpdated from "./TableUpdated";

export default function TableTwoUpdated() {
  const { adminsData, isAdminsDataSuccessful } = useWasteWiseContext();

  return (
    <TableUpdated
      rows={5}
      tableData={adminsData}
      tableDataSuccess={isAdminsDataSuccessful}
      tableTitle="Admins"
    />
  );
}
