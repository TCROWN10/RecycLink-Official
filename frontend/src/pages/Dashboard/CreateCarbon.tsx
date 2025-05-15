import { useEffect, useState } from "react";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useNavigate } from "react-router-dom";
import { RC_MARKETPLACE_ADDRESS , RCMARKETPLACEABI } from "../../constants";
import { pinFileToIPFS } from "../../utils";
import { toast } from "sonner";
import { parseEther } from "viem";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import { LucideArrowRight } from "lucide-react";

type Props = {};

const CreateCarbon = (props: Props) => {
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    writeContract,
    data: createEventData,
    isError,
    isPending,
    error,
  } = useWriteContract();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!(price && description)) {
      toast.error("Kindly fill all the fields");
      return;
    }
    writeContract({
      address: RC_MARKETPLACE_ADDRESS ,
      abi: RCMARKETPLACEABI,
      functionName: "createListing",
      args: [description, price],
      // onError() {
      //   toast.error("!Failed to create an event.");
      //   setLoading(false);
      // },
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error("!Failed to create an event.");
      setLoading(false);
      console.log(error);
    }
  }, [isError]);

  const { isSuccess, isLoading } = useWaitForTransactionReceipt({
    hash: createEventData,
    // onSettled(data, error) {
    //   if (data?.blockHash) {
    //     toast.success("Event successfully created");
    //     setLoading(false);
    //     navigate("/dashboard/marketplace");
    //   }
    // },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Carbon credit successfully created");
      setLoading(false);
    }
    if (isLoading) {
      toast.info("Creating Carbon credits");
    }
    if (isPending) {
      toast.loading("Creating Carbon credits", {
        // description: "My description",
        duration: 5000,
      });
    }
  }, [isLoading, isSuccess, isPending]);

  const navigate = useNavigate();

  return (
    <div className="mb-8 w-full lg:w-5/12">
      <form onSubmit={handleSubmit}>
        <Card isBlurred shadow="none" className="p-4 lg:p-8">
          <CardBody className="gap-y-8">
            <Input
              isRequired
              type="number"
              label="Credit amount"
              description="1 credit = 1 USDT"
              placeholder="0.00"
              labelPlacement="outside"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
              endContent={
                <div className="flex items-center">
                  <label className="sr-only" htmlFor="currency">
                    Currency
                  </label>
                  <select
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                    id="currency"
                    name="currency"
                  >
                    <option>USDT</option>
                    <option>USD</option>
                    <option>ARS</option>
                    <option>EUR</option>
                  </select>
                </div>
              }
              min={0}
              classNames={{
                label: "px-1 py-2 leading-normal",
                inputWrapper: "px-6 py-8",
                description: "text-warning",
              }}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <Textarea
              isRequired
              label="Credit description"
              labelPlacement="outside"
              placeholder={`Describe what your event is about`}
              className=""
              value={description}
              onValueChange={setDescription}
              classNames={{
                input: "placeholder:text-default-300 p-4",
              }}
            />
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              color="success"
              size="lg"
              endContent={<LucideArrowRight size={16} />}
              className="font-firaSans font-bold"
              isLoading={isLoading}
              isDisabled={!(price && description)}
            >
              Sell
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="hidden card w-[95%] mx-auto bg-base-100 shadow-xl lg:shadow-2xl pt-4">
        <h3 className="uppercase text-xl text-center font-bold">
          Sell Carbon Credit
        </h3>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="md:grid gap-x-5 sm:justify-center">
              <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                <label className="label">
                  <span className="label-text">
                    Credit Amount (1 per usdt){" "}
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="input input-bordered w-full"
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                <label className="label">
                  <span className="label-text">Credit Description</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="input input-bordered w-full"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="card-actions">
              <button className="btn w-full max-w-xs sm:max-w-md mx-auto md:max-w-2xl text-white bg-[#026937] hover:bg-[#026937]">
                {isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCarbon;
