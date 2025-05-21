import React, { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import { CountryDropdown } from "react-country-region-selector";
import { useAccount,useWaitForTransactionReceipt,useWriteContract,} from "wagmi";
import { WasteWise } from "../components/WasteWise";
// import Button from "../components/Button";
// import { WASTEWISE_ABI, WASTEWISE_ADDRESS } from "../utils";
import { useWasteWiseContext } from "../context";
import { toast } from "sonner";
import SignUpButton from "../components/SignUpButton";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { RECYCLINK_ADDRESS, RECYCLINKABI } from "../constants";
import useNotificationCount from "../hooks/useNotificationCount";
import Navbar from "../components/Navbar";
import { Button } from "@nextui-org/button";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Link as NLink,
} from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [name, setName] = useState("");
  const notificationCount = useNotificationCount();
  const { wastewiseStore, setNotifCount } = useWasteWiseContext();
  const {
    data: hash,
    writeContract,
    isError,
    isPending: isLoading,
    isSuccess,
    error:error1
  } = useWriteContract();
  console.log(error1)

  const { isLoading: settling, error, isSuccess: isSuccess2 } = useWaitForTransactionReceipt({
    confirmations: 1,
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log(hash);
      // setCurrentUser(data);
      toast.success("Registration successful", {
        duration: 10000,
        onAutoClose: (t) => {
          wastewiseStore
            .setItem(t.id.toString(), {
              id: t.id,
              title: t.title,
              datetime: new Date(),
              type: t.type,
            })
            .then(function (_: any) {
              setNotifCount(notificationCount);
              navigate("/dashboard/wallet");
            });
        },
      });
      // const redirectTo = "";
      // if (currentUser.role === 1) {}
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(<div>{error?.message}</div>, {
        // onAutoClose: (t) => {
        //   wastewiseStore
        //     .setItem(t.id.toString(), {
        //       id: t.id,
        //       title: t.title,
        //       datetime: new Date(),
        //       type: t.type,
        //     })
        //     .then(function (_: any) {
        //       setNotifCount(notificationCount);
        //     });
        // },
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Registering your information. Kindly hold", {
        // description: "My description",
        duration: 15000,
      });
    }
  }, [isLoading]);

  function handleSubmit(e: any) {
    console.log("clicked")
    e.preventDefault();
    writeContract({
      address: RECYCLINK_ADDRESS,
      abi: RECYCLINKABI,
      args: [name],
      functionName: "createUserAcct",
      account: address,
    });
    
  }

  return (
    <>
      {/* <Navbar /> */}

      <div className="flex h-full px-4 lg:h-9/12">
        <div className="relative flex flex-col justify-center items-center w-full lg:w-1/2 lg:mx-28 mx-1 lg:pl-8">
          <div className="absolute top-8 left-2 lg:-left-12">
            <Button
              as={Link}
              to="/"
              variant="flat"
              startContent={<ChevronLeftIcon size={16} />}
            >
              Home
            </Button>
          </div>
          <h1 className="text-3xl font-black text-center leading-8 mb-8 font-firaSans">
            Register An Account!
          </h1>
          <form
            className="relative flex flex-col w-full lg:w-8/12"
            action=""
            id="signup-form"
            onSubmit={handleSubmit}
          >
            <div className="hidden form-control w-full my-4">
              <label className="label">
                <span className="label-text">Name</span>
                {/* <span className="label-text-alt">Top Right label</span> */}
              </label>
              <input
                type="text"
                name="Name"
                placeholder="What can we call you"
                className="input input-bordered w-full"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {/* Nickname can only be strings and numbers */}
                </span>
                {/* <span className="label-text-alt">Bottom Right label</span> */}
              </label>
            </div>

            <div className="flex flex-col items-center gap-y-10 my-16">
              <Input
                isClearable
                isRequired
                size="lg"
                label="Your name"
                labelPlacement="outside"
                placeholder="e.g., Tcrown"
                value={name}
                onValueChange={setName}
                classNames={{
                  label: "px-1 py-2 leading-normal",
                  inputWrapper: "px-6 py-8 w-10/12 lg:w-9/12 mx-auto",
                }}
              />
              <Button
                color="success"
                variant="shadow"
                size="lg"
                onClick={handleSubmit}
                isLoading={isLoading || settling}
                isDisabled={!name}
                className="w-6/12 text-White"
              >
                Register
              </Button>
            </div>

            {/* Submit button */}
            {/* <div className="form-control w-full px-4 py-8 mx-auto lg:w-auto">
              {isSuccess ? (
                <Button
                  name={isLoading ? "Loading..." : "Sign up"}
                  size="md btn-block lg:btn-wide"
                  disabled={isLoading}
                  onClick={() => navigate("/dashboard/wallet")}
                >
                  GoTo Dashboard
                </Button>
              ) : (
                <Button
                  name={isLoading ? "Loading..." : "Sign up"}
                  size="md btn-block lg:btn-wide"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {(isLoading || settling) && <span className="loading"></span>}
                </Button>
              )}
            </div> */}
          </form>

          {isSuccess && (
            <Card className="absolute bottom-4 lg:top-12 left-0 right-0 w-full h-max lg:w-96 mx-auto px-4 py-4">
              <CardHeader className="font-firaSans font-semibold text-lg bg-success-50 text-success rounded-lg">
                Transaction Successful
              </CardHeader>
              <CardBody>
                <NLink
                  href={`https://educhain.blockscout.com/${hash}`}
                  isExternal
                >
                  Confirm your transaction on-Chain
                </NLink>
              </CardBody>
            </Card>
          )}
          {/* {isError && <div>{error?.message} - Error occurred</div>} */}
          <div className="absolute bottom-4 left-0 right-0 w-full text-center font-firaSans text-sm">
            <span className="">
              copyright &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-t from-[#611286] to-[#FFFFFF] dark:bg-gradient-to-t dark:from-[rgba(143,41,191,0.4)] dark:to-[rgba(97,18,134,0.1)] w-1/2 px-16 hidden lg:flex lg:flex-col lg:justify-center dark:bg-transparent">
          {/* <h1
            className="light:text-[#02582E] text-2xl font-extrabold mb-3
"
          >
            Register an Account
          </h1> */}
          <div className="w-10/12 text-xl font-normal light:text-[#02582E] leading-[3]">
            <h1 className="font-firaSans font-bold text-3xl my-8">
              We welcome you to the Green-side... 🤝
            </h1>
            <li className="list-disc">
              You have decided to reduce your Carbon-footprint.
            </li>
            <li className="list-disc">
              We want to assure you that we are with you as you take this bold
              step.
            </li>
            <li className="list-disc">
              We would like to know your name or pseudonym to personalize your
              experience.
            </li>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
