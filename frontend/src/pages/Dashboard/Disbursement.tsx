import { Toaster, toast } from "sonner";
// import Button from "../../components/Button";
import { useRef, useState, useEffect } from "react";
import localforage from "localforage";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { RECYCLINKABI, RECYCLINK_ADDRESS } from "../../constants";
import { useWasteWiseContext } from "../../context";
import useNotificationCount from "../../hooks/useNotificationCount";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/button";
import {
  LucideCandlestickChart,
  LucideCoins,
  LucideCurrency,
} from "lucide-react";

const Disbursement = () => {
  const { address } = useAccount();
  const [numPlastic, setNumPlastic] = useState<number>();
  const [userId, setUserId] = useState<number>();
  const notificationCount = useNotificationCount();
  const { currentUser, wastewiseStore, setNotifCount } = useWasteWiseContext();
  const navigate = useNavigate();

  const {
    data: hash,
    isError,
    error,
    writeContract,
    isPending,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
    // onSettled(data: { blockHash: any }, error: any) {
    //   if (data?.blockHash) {
    //     setNumPlastic(0);
    //     setUserId(0);
    //   }
    // },
  });

  useEffect(() => {
    if (isLoading) {
      toast.loading("Disbursing", {
        // description: "My description",
        duration: 10000,
      });
    }
  }, [isLoading]);

  const handleDepositPlastic = async (e: any) => {
    e.preventDefault();
    // console.log(true);
    writeContract({
      address: RECYCLINK_ADDRESS,
      abi: RECYCLINKABI,
      functionName: "disbursement",
    });
  };

  useEffect(() => {
    if (isPending) {
      toast.loading("Approving Disbursement", {
        // description: "My description",
        duration: 5000,
      });
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully Disbursed payments", {
        // description: "My description",
        duration: 5000,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [isError]);

  const sdgModal = useRef<HTMLDialogElement>(null);
  return (
    <section className="relative">
      <div className="flex flex-col w-full mx-auto my-4 space-y-8 lg:my-6 lg:w-7/12">
        <form action="" onSubmit={handleDepositPlastic}>
          {/* <Button name="Disburse" size="block" customStyle="w-full">
                        {(isPending || isLoading) && (
                            <span className="loading"></span>
                        )}
                    </Button> */}
          <Button
            type="submit"
            size="lg"
            color="success"
            variant="shadow"
            isLoading={isPending || isLoading}
            startContent={<LucideCoins />}
          >
            Disburse to Recyclers
          </Button>
        </form>
      </div>

      {/* <div>
        <button
          onClick={() =>
            toast.error("My first toast", {
              position: "top-right",
              className: "my-classname",
              description: "My description",
              duration: 5000,
              //   icon: <MyIcon />,
              onAutoClose: (t) => {
                //   Add the toast to the notification storage
                console.log(
                  `Toast with id ${t.id} has been closed automatically`
                );
                console.log(t);
                // localforage
                //   .setItem(t.id, t)
                //   .then(function () {
                //     return localforage.getItem("key");
                //   })
                //   .then(function (value) {
                //     // we got our value
                //   })
                //   .catch(function (err) {
                //     // we got an error
                //   });
                localforage.setItem(t.id.toString(), {
                  id: t.id,
                  title: t.title,
                  datetime: new Date(),
                  type: t.type,
                });
              },
            })
          }
        >
          Give me a toast
        </button>
      </div> */}
    </section>
  );
};

export default Disbursement;
