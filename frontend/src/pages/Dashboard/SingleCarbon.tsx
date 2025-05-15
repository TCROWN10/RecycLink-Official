import { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { formatEther, formatUnits, parseEther } from "viem";
import { formatDate } from "../../utils";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  RC_MARKETPLACE_ADDRESS ,
  RCMARKETPLACEABI,
  EVENT_MARKETPLACE_ADDRESS,
  EVENTMARKETPLACEABI,
  USD_TOKEN_ADDRESS,
  USDTokenABI,
} from "../../constants";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";

interface datap {
  price: number;
  description: string;
}

const SingleCarbon = () => {
  let { id } = useParams();
  const [listing, setListing] = useState<any>();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingA, setLoadingA] = useState<boolean>(false);
  const [disablePay, setDisablePay] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1);
  const [total, settotal] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);
  const [allowanceAmount, setAllowanceAmount] = useState<number>(0);
  const allowanceAmountRef = useRef(0);
  const [allowanceListener, setallowanceListener] = useState(null);

  const navigate = useNavigate();

  const {
    data: hash,
    writeContract,
    isError: isError1,
    isPending: isLoading1,
    isSuccess: isSuccess1,
  } = useWriteContract();
  const {
    data: hash2,
    writeContract: writeContract2,
    isError: isError2,
    isPending: isLoading2,
    isSuccess: isSuccess2,
  } = useWriteContract();

  const { isLoading, data, isSuccess } = useReadContract({
    address: RC_MARKETPLACE_ADDRESS ,
    abi: RCMARKETPLACEABI,
    functionName: "getItemInfo",
    args: [id],
    // onError(data: any) {
    //     console.log(data);
    // },
  });

  const {
    data: allowanceData,
    isLoading: loading1,
    isSuccess: isSuccess3,
  } = useReadContract({
    address: USD_TOKEN_ADDRESS,
    abi: USDTokenABI,
    functionName: "allowance",
    args: [address, RC_MARKETPLACE_ADDRESS ],
    // onError(data: any) {
    //     console.log(data);
    // },
    // onSuccess(data: any) {
    //     setAllowance(data);
    // },
  });

  useEffect(() => {
    if (isSuccess) {
      setListing(data);
      setLoading(false);
      settotal(amount * Number((data as datap).price));
    }
    if (isSuccess3) {
      setAllowance(allowanceData as any);
    }
  }, [isSuccess, isSuccess3]);

  useWatchContractEvent({
    address: USD_TOKEN_ADDRESS,
    abi: USDTokenABI,
    eventName: "Approval",
    onLogs(log: any) {
      setallowanceListener(log);
    },
  });

  const handleDisable = () => {
    if (listing?.available === false) {
      return true;
    } else {
      return false;
    }
  };

  const { isLoading: settling1, isSuccess: success } =
    useWaitForTransactionReceipt({
      hash: hash2,
      // onSettled(data, error) {
      //     if (data?.blockHash) {
      //         toast.success("Approval successful");
      //         console.log("he don approve");
      //         setLoadingA(false);
      //         // navigate()
      //         // write?.();
      //     }
      // },
    });
  const { isLoading: settling2, isSuccess: success2 } =
    useWaitForTransactionReceipt({
      hash,
      // onSettled(data, error) {
      //     if (data?.blockHash) {
      //         console.log("he don pay");
      //         toast.success("Item successfully purchased");
      //         setLoading(false);
      //         navigate("/dashboard/myEvents");
      //     }
      // },
    });

  useEffect(() => {
    if (settling1) {
      toast.loading("Approving Contract", {
        // description: "My description",
        duration: 10000,
      });
    }
    if (success) {
      toast.success("Approval successful");
      console.log("he don approve");
      setLoadingA(false);
      setAllowance(allowanceData as any);
      location.reload();
    }
  }, [settling1, success]);

  useEffect(() => {
    if (settling2) {
      toast.loading("Purchasing", {
        // description: "My description",
        duration: 10000,
      });
    }
    if (success2) {
      console.log("he don pay");
      toast.success("Item successfully purchased");
      setLoading(false);
      navigate("/dashboard/carbonpurchases");
    }
  }, [settling2, success2]);

  const handleApprove = (e: any) => {
    e.preventDefault();
    // const value = allowanceAmountRef.current?.value;
    // setAllowanceAmount(value);
    setLoadingA(true);
    writeContract2({
      address: USD_TOKEN_ADDRESS,
      abi: USDTokenABI,
      functionName: "approve",
      args: [RC_MARKETPLACE_ADDRESS , parseEther(`${total}`)],
      // onError(data: any) {
      //     console.log(data);
      //     toast.error("Approval failed");
      //     setLoadingA(false);
      // },
    });
  };
  const handlePay = async () => {
    setLoading(true);
    console.log(true);
    // write2?.();
    writeContract({
      address: RC_MARKETPLACE_ADDRESS ,
      abi: RCMARKETPLACEABI,
      functionName: "buyListing",
      args: [listing?.itemId],
      // onError(data: any) {
      //     console.log(data);
      //     // toast.error("!Failed to purchase item");
      //     setLoading(false);
      // },
    });
  };

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
  }, []);

  // useEffect(() => {
  //     if (isErrorA) {
  //         setLoadingA(false);
  //     }
  // }, [isErrorA]);
  // useEffect(() => {
  //     if (isErrorP) {
  //         setLoading(false);
  //     }
  // }, [isErrorP]);
  useEffect(() => {
    window.localStorage.setItem("itemAmount", `${amount}`);
  }, [amount]);
  useEffect(() => { }, [allowance, loadingA]);
  useEffect(() => { }, [allowanceListener]);
  console.log(allowance);

  return (
    <div className="mb-8 w-full p-12">
      <div className="flex justify-between items-start gap-x-8">
        <Card fullWidth className="bg-transparent p-8">
          <CardHeader className="font-firaSans font-bold text-2xl bg-base-200 rounded-box p-4">
            Purchase Credit
          </CardHeader>
          <CardBody className="py-8">
            <div className="text-xl">
              You are about to purchase <b>{Number(listing?.price)}</b> Credits
            </div>
            <div className="card-actions justify-between items-center mt-5">
              <h3 className="text-lg dark:text-warning">
                You will be charged{" "}
                <b>{listing ? Number(listing?.price) : ""}</b> <span>USDT</span>
              </h3>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              color="success"
              variant="shadow"
              onClick={
                allowance < parseEther(`${total}`)
                  ? () =>
                    (
                      document.getElementById(
                        "my_modal_2"
                      ) as HTMLDialogElement
                    )?.showModal()
                  : handlePay
              }
              disabled={handleDisable()}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : handleDisable() ? (
                "Sold"
              ) : (
                "Pay Now"
              )}
            </Button>
          </CardFooter>
        </Card>
        <div className="hidden card mb-5 w-[95%] max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto pt-4">
          <div className="card-body">
            <h2 className="card-title">
              {listing?.name}
              {/* <div className="badge badge-secondary">NEW</div> */}
            </h2>
            {/* <p>{listing?.description}</p> */}
            <div className="font-firaSans text-3xl">
              You are about to purchase {Number(listing?.price)} Credits
            </div>
            <div className="card-actions justify-between items-center mt-5">
              <h3 className="font-bold text-lg">
                You will be charged {listing ? Number(listing?.price) : ""}{" "}
                <span>USDT</span>
              </h3>
            </div>
            <button
              className="btn bg-[#026937] hover:bg-[#026937]"
              onClick={
                allowance < parseEther(`${total}`)
                  ? () =>
                    (
                      document.getElementById(
                        "my_modal_2"
                      ) as HTMLDialogElement
                    )?.showModal()
                  : handlePay
              }
              disabled={handleDisable()}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : handleDisable() ? (
                "Expired"
              ) : (
                "Pay Now"
              )}
            </button>
          </div>
        </div>
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Set Approval</h3>
          <p className="py-4">
            {/* Your approval should be more than{" "} */}
            Clicking "Approve" will set an allowance of{" "}
            <span className="font-bold">{total} USDT</span>.
          </p>
          <form onSubmit={handleApprove}>
            {/* <input
              type="number"
              placeholder="Enter Allowance"
              className="input input-bordered w-full mb-4"
              ref={allowanceAmountRef}
            /> */}
            <button
              className="btn bg-[#026937] hover:bg-[#026937] w-full"
              type="submit"
            >
              {loadingA ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Approve"
              )}
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default SingleCarbon;
