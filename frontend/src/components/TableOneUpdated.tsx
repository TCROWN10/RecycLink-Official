import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  User,
  Chip,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useAccount, useReadContract } from "wagmi";
import { useWasteWiseContext } from "../context";
import { RECYCLINK_ADDRESS, RECYCLINKABI } from "../constants";
import {
  capitalize,
  formatDate,
  formatDateShort,
  shortenAddress,
} from "../utils";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "../assets/icons";

const roleMap = {
  0: "recyclers",
  1: "admins",
  2: "verifiers",
};

const columns = [
  { name: "ID", uid: "userId", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "XP EARNED", uid: "xpEarned" },
  { name: "PLASTIC RECYCLED", uid: "plasticRecycled" },
  { name: "DATE/TIME", uid: "datetime" },
  // {name: "STATUS", uid: "status", sortable: true},
  // {name: "ACTIONS", uid: "actions"},
];

type User = {
  [x: string]: any;
  id: any;
  avatar: any;
  userAddr: string;
  name: string;
  xpoints: any;
  role: number;
  timeJoined: any;
};

export default function TableOneUpdated() {
  const { address } = useAccount();
  const { currentUser } = useWasteWiseContext();
  const [leaderboard, setLeaderboard] = useState<boolean>(false);
  const [filterValue, setFilterValue] = React.useState("");

  const { data, isSuccess } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getAllUsers",
    account: address,
  });

  console.log(data);

  useEffect(() => {
    setLeaderboard(true);
  }, [isSuccess]);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil((data as any[])?.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return (data as any[])?.slice(start, end);
  }, [page, data]);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const renderCell = React.useCallback(
    (user: User, columnKey: string | number) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "userId":
          return (
            <div className="text-bold text-md text-center">
              {Number(user.id)}
            </div>
          );
        //   case "name":
        //     return user.name;
        case "name":
          return (
            <User
              avatarProps={{ radius: "full", src: user.avatar }}
              description={shortenAddress(user.userAddr)}
              name={user.name}
              className="font-bold"
            >
              {user.name}
            </User>
          );
        case "address":
          return (
            <div className="flex flex-col">
              <p className="font-medium text-small capitalize">
                {user.userAddr}
              </p>
              {/* <p className="text-bold text-tiny capitalize text-default-400">
              {user.userAddr}
            </p> */}
            </div>
          );
        case "xpEarned":
          return <div>{Number(user.xpoints) || 0} XP</div>;
        case "role":
          return (
            <Chip
              className="capitalize"
              color="success"
              size="sm"
              variant="flat"
            >
              {roleMap[user.role as keyof typeof roleMap]}
            </Chip>
          );
        case "plasticRecycled":
          return <Button size="sm">Details</Button>;
        case "datetime":
          return (
            <div>
              {Number(user.timeJoined) !== 0
                ? formatDateShort(Number(user.timeJoined))
                : "-"}
            </div>
          );
        //   case "actions":
        //     return (
        //       <div className="relative flex justify-end items-center gap-2">
        //         <Dropdown>
        //           <DropdownTrigger>
        //             <Button isIconOnly size="sm" variant="light">
        //               <VerticalDotsIcon className="text-default-300" />
        //             </Button>
        //           </DropdownTrigger>
        //           <DropdownMenu>
        //             <DropdownItem>View</DropdownItem>
        //             <DropdownItem>Edit</DropdownItem>
        //             <DropdownItem>Delete</DropdownItem>
        //           </DropdownMenu>
        //         </Dropdown>
        //       </div>
        //     );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <div>
      <div className="flex flex-row items-center my-4 py-4 gap-x-4">
        <div className="flex-auto text-xl font-semibold text-default-foreground">
          {location.pathname === "/dashboard/leaderboard" &&
          currentUser?.role === 1
            ? "All Recyclers"
            : "Leaderboard"}
        </div>
        <Input
          isClearable
          className="w-80 sm:max-w-[44%]"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 items-end">
            {/* <Input
              isClearable
              classNames={{
                base: "w-full sm:max-w-[44%]",
                inputWrapper: "border-1",
              }}
              placeholder="Search by name..."
              size="sm"
              startContent={<SearchIcon className="text-default-300" />}
              value={filterValue}
              variant="bordered"
              onClear={() => setFilterValue("")}
              onValueChange={onSearchChange}
            /> */}
            <div className="flex gap-3">
              {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    size="sm"
                    variant="flat"
                  >
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  // selectedKeys={visibleColumns}
                  selectionMode="multiple"
                // onSelectionChange={setVisibleColumns}
                >
                  {columns.map((column) => (
                    <DropdownItem key={column.uid} className="capitalize">
                      {capitalize(column.name.toLocaleLowerCase())}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Button
                className="bg-foreground text-background"
                endContent={<PlusIcon />}
                size="sm"
              >
                Add New
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isSuccess ? (
        <Table
          isHeaderSticky
          // isStriped
          isVirtualized
          fullWidth
          showSelectionCheckboxes={false}
          selectionMode="multiple"
          aria-label="Example table with client side pagination"
          bottomContent={
            pages > 1 && (
              <div className="flex w-full justify-between items-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="default"
                  //   classNames={{
                  //     cursor: "bg-foreground text-background",
                  //   }}
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
                <span className="text-small text-default-400">
                  {pages === page
                    ? "All items selected"
                    : `${page} of ${items.length} selected`}
                </span>
              </div>
            )
          }
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "userId" ? "center" : "start"}
                  allowsSorting={column.sortable}
                  className="py-6 my-8"
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {/* <TableColumn key="userId" align="center">
              USER ID
            </TableColumn>
            <TableColumn key="address">ADDRESS</TableColumn>
            <TableColumn key="name">NAME</TableColumn>
            <TableColumn key="xpEarned">XP EARNED</TableColumn>
            <TableColumn key="plasticRecycled" allowsSorting>
              PLASTIC RECYCLED
            </TableColumn> */}
          </TableHeader>
          <TableBody items={items} emptyContent={"No recyclers yet."}>
            {(item) => (
              <TableRow key={item.address} className="">
                {(columnKey) => (
                  <TableCell className="py-8">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <Table aria-label="Example empty table">
          <TableHeader>
            <TableColumn key="userId">USER ID</TableColumn>
            <TableColumn key="address">ADDRESS</TableColumn>
            <TableColumn key="name">NAME</TableColumn>
            {/* <TableColumn key="role">ROLE</TableColumn> */}
            <TableColumn key="xpEarned">XP EARNED</TableColumn>
            <TableColumn key="plasticRecycled">PLASTIC RECYCLED</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
        </Table>
      )}
    </div>
  );
}
