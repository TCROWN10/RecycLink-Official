import { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
// import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import RECYCLINK_ABI from "../../constants/Recyclink.json";
import { toast } from "sonner";
import { RECYCLINK_ADDRESS } from "../../constants";
import { LucideArrowRight } from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { zeroAddress } from "viem";

type Props = {};

const CreateAdmin = (props: Props) => {
  const [name, setName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string>();
  const navigate = useNavigate();

  const {
    data: hash,
    writeContract,
    isError,
    isPending: isLoading,
    isSuccess,
    error,
  } = useWriteContract();
  const {
    data: hash2,
    writeContract: writeContract2,
    isError: isError2,
    isPending: isLoading2,
    isSuccess: isSuccess2,
    error: error2,
  } = useWriteContract();

  const { isLoading: isAddingVerifier, isSuccess: isVerifierSuccess } =
    useWaitForTransactionReceipt({
      hash: hash2,
      // onSettled(data, error) {
      //   if (data?.blockHash) {
      //     console.log("he don enter");
      //     navigate("/dashboard");
      //   }
      // },
    });

  const { isLoading: isAddingAdmin, isSuccess: isAdminSuccess } =
    useWaitForTransactionReceipt({
      hash,
      // onSettled(data, error) {
      //   if (data?.blockHash) {
      //     navigate("/dashboard");
      //   }
      // },
    });

  useEffect(() => {
    if (isAdminSuccess) {
      navigate("/dashboard");
    }
    if (isVerifierSuccess) {
      navigate("/dashboard");
    }
  }, [isSuccess, isSuccess2]);

  const handleAddAdmin = async () => {
    writeContract({
      address: RECYCLINK_ADDRESS,
      abi: RECYCLINK_ABI,
      functionName: "createAdmin",
      args: [name, address],
      // onError(data: any) {
      //   console.log(data);
      // },
    });
    setLoading(true);
    console.log(true);
  };
  const handleAddVerifier = async () => {
    console.log("clicking");
    writeContract2({
      address: RECYCLINK_ADDRESS,
      abi: RECYCLINK_ABI,
      functionName: "createVerifier",
      args: [name, address],
    });
    setLoading(true);
    console.log(true);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (role == "addAdmin") {
      handleAddAdmin();
    }
    if (role == "addVerifier") {
      handleAddVerifier();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully Created Verifier", {
        // description: "My description",
        duration: 5000,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess2) {
      toast.success("Successfully Created Admin", {
        // description: "My description",
        duration: 5000,
      });
    }
  }, [isSuccess2]);

  useEffect(() => { }, [role]);

  useEffect(() => {
    if (error2) {
      console.log(error2);
    }
  }, [error2]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  return (
    <div className="mb-8  w-full lg:w-5/12">
      <form onSubmit={handleSubmit}>
        <Card isBlurred shadow="none" className="p-4 lg:p-8">
          <CardBody className="gap-y-8">
            <Select
              isRequired
              label="Select User"
              // placeholder="Select a user"
              className=""
              size="lg"
              classNames={{
                label: "px-4",
                innerWrapper: "px-4",
              }}
              selectedKeys={[role!]}
              onChange={(e) => setRole(e.target.value)}
            >
              {[
                { key: "addAdmin", label: "Add Admin" },
                { key: "addVerifier", label: "Add Verifier" },
              ].map((_) => (
                <SelectItem key={_.key}>{_.label}</SelectItem>
              ))}
            </Select>
            <Divider />
            <Input
              isClearable
              isRequired
              size="lg"
              label="Admin / Verifier name"
              labelPlacement="outside"
              placeholder="e.g., Tcrown"
              value={name}
              onValueChange={setName}
              classNames={{
                label: "px-1 py-2 leading-normal",
                inputWrapper: "px-6 py-8",
              }}
            />
            <Input
              isClearable
              isRequired
              size="lg"
              label="Admin / Verifier address"
              labelPlacement="outside"
              placeholder={`e.g., ${zeroAddress}`}
              value={address}
              onValueChange={setAddress}
              classNames={{
                label: "px-1 py-2 leading-normal",
                inputWrapper: "px-6 py-8",
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
              isDisabled={!(name && address)}
            >
              Create
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="hidden card w-[95%] mx-auto bg-base-100 shadow-xl lg:shadow-2xl pt-4">
        <h3 className="uppercase text-xl text-center font-bold">
          Add Admin/Verifier
        </h3>
        <div className="card-body bg mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type name here"
              className="input input-bordered w-full "
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Type address here"
              className="input input-bordered w-full mt-3"
              onChange={(e) => setAddress(e.target.value)}
            />
            <select
              title="Select Role"
              className="select select-bordered w-full my-8"
              // onChange={(e) => console.log(e.target)}
              onChange={(e) => setRole(e.target.value)}
            >
              <option disabled value="">
                Submit to Add Admin / Verifier
              </option>

              <option className="py-4" value="addAdmin">
                {/* {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Add Admin"
                )} */}
                Add Admin
              </option>

              <option className="py-4" value="addVerifier">
                {/* {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Add Verifier"
                )} */}
                Add Verifier
              </option>
            </select>
            {/* <Button name="submit" size="block" customStyle="w-full">
              {(loadingA || loadingV || isAddingVerifier || isAddingAdmin) && (
                <span className="loading"></span>
              )}
              {(isAddingVerifier || isAddingAdmin) && (
                <span className="loading"></span>
              )}
            </Button> */}
            {/* <button
              className="btn btn-primary block m-auto w-full"
              type="submit"
            >
              submit
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
