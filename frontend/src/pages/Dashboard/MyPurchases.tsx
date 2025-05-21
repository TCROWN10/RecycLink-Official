import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useTheme } from "../../context";
import { useReadContract } from "wagmi";
import { RECYCLINK_ADDRESS, RECYCLINKABI } from "../../constants";
import { formatEther } from "viem";
import { LucidePackage, LucideFilter, LucideEye, LucideCalendar, LucideDollarSign, LucideTag } from "lucide-react";

interface Purchase {
  id: number;
  itemName: string;
  amount: string;
  price: string;
  date: string;
  status: "completed" | "pending" | "cancelled";
  seller: string;
  transactionHash: string;
}

const statusOptions = ["All", "Completed", "Pending", "Cancelled"];
const sortOptions = ["Date", "Amount", "Price"];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
};

// Add mock data before the MyPurchases component
const mockPurchases = [
  {
    id: 1,
    itemName: "Plastic Bottles",
    amount: "50",
    price: "0.05",
    date: "2024-03-15",
    status: "completed",
    seller: "0x1234567890abcdef1234567890abcdef12345678",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  },
  {
    id: 2,
    itemName: "Glass Containers",
    amount: "25",
    price: "0.03",
    date: "2024-03-14",
    status: "pending",
    seller: "0x2345678901abcdef2345678901abcdef23456789",
    transactionHash: "0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  },
  {
    id: 3,
    itemName: "Paper Waste",
    amount: "100",
    price: "0.02",
    date: "2024-03-13",
    status: "completed",
    seller: "0x3456789012abcdef3456789012abcdef34567890",
    transactionHash: "0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  },
  {
    id: 4,
    itemName: "Metal Scraps",
    amount: "30",
    price: "0.08",
    date: "2024-03-12",
    status: "cancelled",
    seller: "0x4567890123abcdef4567890123abcdef45678901",
    transactionHash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  },
  {
    id: 5,
    itemName: "Organic Waste",
    amount: "75",
    price: "0.04",
    date: "2024-03-11",
    status: "completed",
    seller: "0x5678901234abcdef5678901234abcdef56789012",
    transactionHash: "0xef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  }
];

export default function MyPurchases() {
  const { darkMode } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Date");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  // Use mock data instead of contract data for testing
  const purchases = useMemo(() => {
    return mockPurchases.map(purchase => ({
      ...purchase,
      amount: formatEther(BigInt(Math.floor(Number(purchase.amount) * 1e18)).toString()),
      price: formatEther(BigInt(Math.floor(Number(purchase.price) * 1e18)).toString())
    }));
  }, []);

  // Filter and sort purchases
  const filteredPurchases = useMemo(() => {
    let filtered = [...purchases];
    
    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter(p => p.status === selectedStatus.toLowerCase());
    }
    
    // Sort purchases
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case "Date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "Amount":
          return Number(b.amount) - Number(a.amount);
        case "Price":
          return Number(b.price) - Number(a.price);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [purchases, selectedStatus, selectedSort]);

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    onOpen();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <LucidePackage className="w-8 h-8 text-[#983279]" />
          <h1 className="text-2xl font-bold text-[#983279]">My Purchases</h1>
        </div>
        <div className="flex gap-4">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="border-[#983279] text-[#983279] hover:bg-[#983279]/10"
                startContent={<LucideFilter className="text-[#983279]" />}
              >
                {selectedStatus}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Status filter"
              onAction={(key) => setSelectedStatus(key as string)}
              className="bg-background"
            >
              {statusOptions.map((option) => (
                <DropdownItem key={option} className="text-[#983279]">{option}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="border-[#983279] text-[#983279] hover:bg-[#983279]/10"
                startContent={<LucideFilter className="text-[#983279]" />}
              >
                Sort by: {selectedSort}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort options"
              onAction={(key) => setSelectedSort(key as string)}
              className="bg-background"
            >
              {sortOptions.map((option) => (
                <DropdownItem key={option} className="text-[#983279]">{option}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-background border border-[#983279]/20 hover:border-[#983279]/40 transition-colors">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md text-[#983279]">Total Purchases</p>
              <p className="text-small text-[#983279]/60">All Time</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold text-[#983279]">
              {purchases.length}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-background border border-[#983279]/20 hover:border-[#983279]/40 transition-colors">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md text-[#983279]">Total Spent</p>
              <p className="text-small text-[#983279]/60">All Time</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold text-[#983279]">
              {formatEther(purchases.reduce((sum, p) => sum + Number(p.price), 0))} ETH
            </p>
          </CardBody>
        </Card>

        <Card className="bg-background border border-[#983279]/20 hover:border-[#983279]/40 transition-colors">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md text-[#983279]">Active Orders</p>
              <p className="text-small text-[#983279]/60">Pending</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold text-[#983279]">
              {purchases.filter(p => p.status === "pending").length}
            </p>
          </CardBody>
        </Card>
      </div>

      <Table
        aria-label="Purchase history"
        classNames={{
          wrapper: "min-h-[400px]",
          th: "bg-[#983279]/10 text-[#983279] font-bold",
          td: "text-foreground",
        }}
      >
        <TableHeader>
          <TableColumn>ITEM</TableColumn>
          <TableColumn>AMOUNT</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          items={filteredPurchases}
          emptyContent={
            <div className="flex flex-col items-center justify-center py-8">
              <LucidePackage className="w-12 h-12 text-[#983279]/40 mb-4" />
              <p className="text-[#983279]/60">No purchases found</p>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.id} className="hover:bg-[#983279]/5">
              <TableCell className="font-medium">{item.itemName}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.price} ETH</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                <Chip
                  color={getStatusColor(item.status)}
                  variant="flat"
                  className="capitalize"
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => handleViewDetails(item)}
                  className="text-[#983279]"
                >
                  <LucideEye className="w-5 h-5" />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2 items-center text-[#983279]">
                <LucidePackage className="w-6 h-6" />
                Purchase Details
              </ModalHeader>
              <ModalBody>
                {selectedPurchase && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LucideTag className="w-5 h-5 text-[#983279]" />
                      <span className="font-medium">Item:</span>
                      <span>{selectedPurchase.itemName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LucideDollarSign className="w-5 h-5 text-[#983279]" />
                      <span className="font-medium">Amount:</span>
                      <span>{selectedPurchase.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LucideDollarSign className="w-5 h-5 text-[#983279]" />
                      <span className="font-medium">Price:</span>
                      <span>{selectedPurchase.price} ETH</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LucideCalendar className="w-5 h-5 text-[#983279]" />
                      <span className="font-medium">Date:</span>
                      <span>{selectedPurchase.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <Chip
                        color={getStatusColor(selectedPurchase.status)}
                        variant="flat"
                        className="capitalize"
                      >
                        {selectedPurchase.status}
                      </Chip>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Seller:</span>
                      <span className="font-mono">{selectedPurchase.seller}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Transaction:</span>
                      <span className="font-mono">{selectedPurchase.transactionHash}</span>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="text-[#983279]"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 