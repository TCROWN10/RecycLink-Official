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
import { Card, CardBody, CardFooter, Input, Spacer } from "@nextui-org/react";

const Recycle = () => {
  const { address } = useAccount();
  const [numPlastic, setNumPlastic] = useState<number>();
  const [userId, setUserId] = useState<number>();
  const notificationCount = useNotificationCount();
  const { currentUser, wastewiseStore, setNotifCount } = useWasteWiseContext();
  const navigate = useNavigate();

  const {
    data: depositPlasticData,
    isError: isDepositPlasticError,
    error,
    writeContract: depositPlasticWrite,
    isPending,
  } = useWriteContract();

  const { isLoading: isDepositingPlastic, isSuccess: isPlasticDeposited } =
    useWaitForTransactionReceipt({
      hash: depositPlasticData,
      // onSettled(data: { blockHash: any }, error: any) {
      //   if (data?.blockHash) {
      //     setNumPlastic(0);
      //     setUserId(0);
      //   }
      // },
    });

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error("Unable to complete transaction");
    }
  }, [error]);

  useEffect(() => {}, [isPlasticDeposited]);

  useEffect(() => {
    if (isDepositingPlastic) {
      toast.loading("Depositing the Plastic. Kindly wait", {
        // description: "My description",
        duration: 10000,
      });
    }
  }, [isDepositingPlastic]);

  const handleDepositPlastic = async (e: any) => {
    e.preventDefault();
    // console.log(true);
    depositPlasticWrite({
      address: RECYCLINK_ADDRESS,
      abi: RECYCLINKABI,
      functionName: "depositPlastic",
      args: [numPlastic, userId],
    });
  };

  useEffect(() => {
    if (isPending) {
      toast.loading("Approving Recycled item(s)", {
        // description: "My description",
        duration: 5000,
      });
    }
  }, [isPending]);

  useEffect(() => {
    if (isPlasticDeposited) {
      toast.success("Successfully Approved Recycled item(s)", {
        // description: "My description",
        duration: 5000,
      });
    }
  }, [isPlasticDeposited]);

  const sdgModal = useRef<HTMLDialogElement>(null);
  return (
    <section className="relative w-11/12">
      <div className="hidden flex flex-col mx-auto bg-amber-200/40 rounded-lg px-2 py-5 w-12/12 lg:flex-row lg:px-8 lg:py-10 dark:bg-base-200">
        <div className="bg-base-300 h-24 w-24 rounded-lg mx-3 lg:mx-6 lg:w-48 lg:h-48"></div>
        <div className="text-sm px-4 lg:text-xl lg:px-8">
          Thank you for doing your part in the{" "}
          <b>Sustainable Development Goals.</b>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-6 h-6 lg:w-8 lg:h-8 stroke-current inline-flex lg:px-1"
            onClick={() => sdgModal.current?.showModal()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <dialog id="my_modal_4" className="modal" ref={sdgModal}>
            <div className="modal-box w-11/12 max-w-5xl">
              <form method="dialog" className="modal-backdrop">
                <div className="modal-action">
                  {/* if there is a button, it will close the modal */}
                  <button className="btn btn-md btn-rounded btn-ghost absolute right-8 top-8 text-base-content font-black">
                    ✕
                  </button>
                </div>
              </form>
              <h3 className="font-bold text-2xl px-1 pb-2 lg:px-4">
                What is SDG?
              </h3>
              <div className="px-1 py-1 lg:px-4 lg:py-4 leading-8">
                SDG is an acronym for Sustainable Development Goals**, which
                are a set of 17 global goals adopted by the United Nations in
                2015 as a call to action to end poverty, protect the planet, and
                ensure peace and prosperity for all by 2030 . The SDGs cover
                various aspects of sustainable development, such as:
                <ul className="px-8 lg:px-10">
                  <li>No poverty</li>
                  <li>Zero hunger</li>
                  <li>Good health and well-being</li>
                  <li>Quality education</li>
                  <li>Gender equality</li>
                  <li>Clean water and sanitation</li>
                  <li>Affordable and clean energy</li>
                  <li>Decent work and economic growth</li>
                  <li>Industry, innovation and infrastructure</li>
                  <li>Reduced inequalities</li>
                  <li>Sustainable cities and communities</li>
                  <li>Responsible consumption and production</li>
                  <li>Climate action</li>
                  <li>Life below water</li>
                  <li>Life on land</li>
                  <li>Peace, justice and strong institutions</li>
                  <li>Partnerships for the goals</li>
                </ul>
                Each SDG has a number of specific targets and indicators to
                measure progress and track achievements. The SDGs are intended
                to be universal, integrated and transformative, and to balance
                the social, economic and environmental dimensions of sustainable
                development.
                <div className="text-xs">
                  Source: Conversation with Bing, 11/7/2023 (1) THE 17 GOALS |
                  Sustainable Development. https://sdgs.un.org/goals. (2)
                  Sustainable Development Goals - United Nations Development
                  Programme. https://www.undp.org/sustainable-development-goals.
                  (3) THE 17 GOALS - Sustainable Development Knowledge Platform.
                  https://sustainabledevelopment.un.org/?menu=1300.
                </div>
              </div>
            </div>
            {/* <form method="dialog" className="modal-backdrop">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
                ✕
              </button>
            </form> */}
          </dialog>
          <ol className="mx-5 leading-8 lg:leading-10">
            <li>
              You will receive an equivalent token for every plastic you
              recycle.
            </li>
            <li>
              Your token will be accumulated and will be displayed on your
              Environmental Impact Assessment (EIA) card, which you can display
              as your achievement to the SDG Goals.
            </li>
          </ol>
        </div>
      </div>
      {/* <div className="bg-base-200 text-sm px-4 py-2 my-2 lg:p-6 rounded-md lg:text-lg">
        Kindly input the <b>VERIFIED</b> amount of plastics to recycle
      </div> */}

      <Spacer></Spacer>
      <Card shadow="none">
        <CardBody>
          <span className="px-4 py-2 lg:p-4 text-center">
            Kindly input the <b>VERIFIED</b> amount of plastics to recycle
          </span>
        </CardBody>
      </Card>

      <div className="flex flex-col w-full mx-auto my-8 space-y-8 lg:my-12 lg:w-7/12">
        <form action="" onSubmit={handleDepositPlastic} className="space-y-6">
          <Card className="p-8">
            <CardBody className="gap-y-8">
              <Input
                type="number"
                label="Number of verified plastics"
                labelPlacement="outside"
                placeholder="e.g., 40"
                description={
                  numPlastic?.toString().length &&
                  `You will get ${numPlastic} CAR tokens`
                }
                size="lg"
                value={numPlastic?.toString()}
                onChange={(e: any) => setNumPlastic(e.target.value)}
                classNames={{
                  label: "font-bold text-md",
                  inputWrapper: "p-8",
                }}
              />

              <Input
                id="number"
                type="number"
                label="User ID"
                labelPlacement="outside"
                value={userId?.toString()}
                onChange={(e: any) => setUserId(e.target.value)}
                placeholder="Id to credit the token"
                description=""
                size="lg"
                classNames={{
                  label: "font-bold text-md",
                  inputWrapper: "p-8",
                }}
              />
            </CardBody>
            <CardFooter>
              <Button
                type="submit"
                color="success"
                variant="shadow"
                isLoading={isPending || isDepositingPlastic}
                fullWidth
                size="lg"
              >
                Recycle
              </Button>
            </CardFooter>
          </Card>

          <div className="hidden form-control w-full gap-y-8">
            <label className="label flex flex-col items-start gap-y-2">
              <span className="label-text font-bold text-lg">
                Number of verified Plastics
              </span>

              <input
                defaultValue={numPlastic}
                onChange={(e: any) => setNumPlastic(e.target.value)}
                type="number"
                id="number"
                placeholder="e.g., 40"
                className="input input-lg input-bordered w-full placeholder:text-base placeholder:text-base-content/40"
              />
              <label className="label">
                <span className="label-text-alt">
                  You will get {numPlastic} tokens
                </span>
              </label>
            </label>
            <label className="label flex flex-col items-start gap-y-2">
              <span className="label-text font-bold text-lg">User Id</span>
              <input
                defaultValue={userId}
                onChange={(e: any) => setUserId(e.target.value)}
                type="number"
                id="number"
                placeholder="user Id"
                className="input input-lg input-bordered w-full placeholder:text-base"
              />
              <label className="label">
                <span className="label-text-alt font-bold text-amber-400">
                  User Id can be gotten from the EIA wallet
                </span>
              </label>
            </label>
          </div>

          {/* <Button name="Recycle" size="block" customStyle="w-full">
            {(isPending || isDepositingPlastic) && (
              <span className="loading"></span>
            )}
          </Button> */}
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

export default Recycle;
