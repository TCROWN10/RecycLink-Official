import { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useNavigate } from "react-router-dom";
import {
  EVENT_MARKETPLACE_ADDRESS,
  EVENTMARKETPLACEABI,
} from "../../constants";
import { pinFileToIPFS } from "../../utils";
import { toast } from "sonner";
import { parseEther } from "viem";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  DatePicker,
  Image,
  Input,
  Textarea,
} from "@nextui-org/react";
import {
  now,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { useWasteWiseContext } from "../../context";
import {
  CameraIcon,
  LucideCheckCheck,
  LucideUpload,
  LucideX,
} from "lucide-react";
import { useDateFormatter } from "@react-aria/i18n";

type Props = {};

const CreateEvent = (props: Props) => {
  const { address } = useAccount();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imagePath, setImagePath] = useState(null);
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  // const [deadline, setDeadline] = useState<number>(0);
  const [deadline, setDeadline] = useState(now(getLocalTimeZone()));
  const [loading, setLoading] = useState<boolean>(false);

  const [imageHash, setImageHash] = useState<string>("");
  const [imageUploadPending, setImageUploadPending] = useState<boolean>(false);
  const [imageUploadSuccessful, setImageUploadSuccessful] =
    useState<boolean>(false);

  // For dp upload state management
  const [dp, setDp] = useState<string>("");
  const [dpPreview, setDpPreview] = useState<string>("");
  const [isDpUploading, setisDpUploading] = useState<boolean>(false);
  const profileImageRef = useRef(null);
  const imageHashRef = useRef("");

  let formatter = useDateFormatter({ dateStyle: "full" });
  console.log(deadline.toString());
  console.log(formatter.format(deadline.toDate()));

  const toTimeStamp = (strDate: string) => {
    const dt = Date.parse(strDate);
    const dts = dt / 1000;
    console.log(dts);
    // setDeadline(dts);
    return dts;
  };
  // console.log(Math.round(toTimeStamp(deadline.toAbsoluteString())));
  console.log(toTimeStamp(deadline.toDate().toUTCString()));

  const {
    writeContract,
    data: createEventData,
    isError,
    error,
  } = useWriteContract();

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   if (
  //     name == "" ||
  //     description == "" ||
  //     imagePath == null ||
  //     price == 0 ||
  //     deadline == 0
  //   ) {
  //     console.log(name, description, imagePath, price, deadline);
  //     toast.error("No field should be empty");
  //   } else {
  //     setLoading(true);
  //     const imgUrl = await pinFileToIPFS(imagePath);
  //     if (imgUrl) setImage(imgUrl);
  //   }
  // };

  const sendFileToIPFS = async () => {
    const imgUrl = await pinFileToIPFS(imagePath);
    if (imgUrl) {
      setImage(imgUrl);
      setImageUploadPending(false);
      setImageUploadSuccessful(true);
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error("!Failed to create an event.");
      console.log(error);
      setLoading(false);
    }
  }, [isError]);

  const { isSuccess } = useWaitForTransactionReceipt({
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
      toast.success("Event successfully created");
      setLoading(false);
      navigate("/dashboard/marketplace");
    }
  }, [isSuccess]);

  // useEffect(() => {
  //   if (image != "") {
  //     writeContract({
  //       address: EVENT_MARKETPLACE_ADDRESS,
  //       abi: EVENTMARKETPLACEABI,
  //       functionName: "createListing",
  //       args: [name, description, image, parseEther(`${price}`), deadline],
  //       account: address,
  //       // onError() {
  //       //   toast.error("!Failed to create an event.");
  //       //   setLoading(false);
  //       // },
  //     });
  //   }
  // }, [image, name, description, deadline, price]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setLoading(true);
    writeContract({
      address: EVENT_MARKETPLACE_ADDRESS,
      abi: EVENTMARKETPLACEABI,
      functionName: "createListing",
      args: [
        name,
        description,
        image,
        parseEther(`${price}`),
        toTimeStamp(deadline.toDate().toUTCString()),
      ],
      account: address,
    });
  };

  const navigate = useNavigate();

  const handleTriggerDpChange = (event: any) => {
    const selectedImage = event.target.files[0];
    setDp(selectedImage);
    setDpPreview(URL.createObjectURL(selectedImage));
    setImageUploadPending(true);
    setImagePath(event.target.files);
  };

  const removeProfileUpload = () => {
    setDp("");
    setDpPreview("");
    setImageHash("");
    setImageUploadPending(false);
  };

  return (
    <div className="mb-8 w-full">
      <Card fullWidth isBlurred shadow="none">
        <CardHeader></CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col lg:flex-row">
              <div className="card justify-start items-center lg:items-center gap-y-4 shrink-0 mx-auto my-4 w-full lg:w-5/12">
                {imageUploadPending && (
                  <Chip
                    color="warning"
                    variant="flat"
                    radius="sm"
                    className="w-full text-sm"
                  >
                    You haven't uploaded the profile image
                  </Chip>
                )}
                <div className={"relative w-full lg:w-[360px]"}>
                  <Card fullWidth className="block h-[160px] lg:h-[480px]">
                    <Image
                      width={"100%"}
                      // height={"100%"}
                      alt=""
                      src={dpPreview}
                      className="flex object-cover w-full lg:h-[480px]"
                      isZoomed
                    />
                  </Card>
                  <div className="">
                    {dpPreview && (
                      <Avatar
                        size="lg"
                        src={dpPreview}
                        isBordered
                        color="success"
                        className="z-10 absolute -bottom-2 -left-2"
                      />
                    )}
                    {/* <div
                      className="w-32 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2"
                      ref={profileImageRef}
                    >
                      <Image
                        width={100}
                        height={100}
                        alt=""
                        src={
                          userData.profilePicture == ""
                            ? defaultImage
                            : userData.profilePicture
                        }
                        className="bg-base-300"
                      />
                    </div> */}
                  </div>
                  {dpPreview && !imageUploadSuccessful && (
                    <Button
                      isIconOnly
                      color="danger"
                      className={"absolute -top-2 -right-2 z-10 btn-error"}
                      radius="full"
                      onClick={removeProfileUpload}
                    >
                      <LucideX size={16} strokeWidth={4} />
                    </Button>
                  )}
                </div>
                {!dpPreview ? (
                  <Button
                    as={"label"}
                    htmlFor={"id-avatar-dp"}
                    title="Select dp"
                    className="mt-4"
                    startContent={<CameraIcon />}
                  >
                    {/* <LucideCamera /> */}
                    Select Product Image
                    <Input
                      type="file"
                      name=""
                      id="id-avatar-dp"
                      className="hidden"
                      onChange={handleTriggerDpChange}
                      ref={profileImageRef}
                    />
                  </Button>
                ) : (
                  <>
                    {!imageUploadSuccessful ? (
                      <Button
                        color="success"
                        onClick={sendFileToIPFS}
                        isLoading={isDpUploading}
                        className="mt-8 font-bold"
                        startContent={
                          !isDpUploading && (
                            <LucideUpload size={16} strokeWidth={4} />
                          )
                        }
                      >
                        {!isDpUploading ? "Upload Image" : ""}
                      </Button>
                    ) : (
                      <Button
                        color="success"
                        isLoading={isDpUploading}
                        className="mt-8 font-bold"
                        startContent={
                          <LucideCheckCheck size={16} strokeWidth={4} />
                        }
                        isDisabled
                      >
                        Image Uploaded
                      </Button>
                    )}
                  </>
                )}
              </div>

              <div className="w-full">
                <Card
                  isDisabled={imageUploadPending}
                  shadow="none"
                  className="w-full lg:w-9/12 mx-auto p-4"
                >
                  <CardBody className="gap-y-8">
                    <Input
                      type="text"
                      isClearable
                      isRequired
                      isDisabled={image === ""}
                      label="Event name"
                      labelPlacement="outside"
                      placeholder="Name of your event"
                      value={name}
                      onValueChange={setName}
                      classNames={{
                        label: "px-1 py-2 leading-normal",
                        inputWrapper: "px-6 py-8",
                      }}
                    />
                    <Textarea
                      isRequired
                      isDisabled={image === ""}
                      label="Event description"
                      labelPlacement="outside"
                      placeholder={`Describe what your event is about`}
                      className=""
                      value={description}
                      onValueChange={setDescription}
                      classNames={{
                        input: "placeholder:text-default-300",
                      }}
                    />
                    <Input
                      type="number"
                      isDisabled={image === ""}
                      label="Event Price"
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
                      classNames={{
                        label: "px-1 py-2 leading-normal",
                        inputWrapper: "px-6 py-8",
                      }}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                    <DatePicker
                      isRequired
                      isDisabled={image === ""}
                      label="Event Deadline"
                      labelPlacement="outside"
                      hideTimeZone={true}
                      showMonthAndYearPickers
                      defaultValue={now(getLocalTimeZone())}
                      minValue={today(getLocalTimeZone())}
                      // defaultValue={today(getLocalTimeZone()).subtract({ days: 1 })}
                      classNames={{
                        label: "px-1 py-2 leading-normal",
                        base: "",
                      }}
                      // onChange={(e) => toTimeStamp(e.target.value)}
                      // onChange={(e) => toTimeStamp(e.toString())}
                      // @ts-ignore
                      onChange={setDeadline}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      color="success"
                      isLoading={loading}
                      isDisabled={
                        !(name && description) ||
                        (imageUploadPending && !imageUploadSuccessful)
                      }
                      className="w-10/12 lg:w-8/12 mx-auto mt-8 font-semibold"
                    >
                      Submit
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </div>

            <div className="hidden">
              <div className="md:grid md:grid-cols-2 gap-x-5 sm:justify-center">
                <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                  <label className="label">
                    <span className="label-text">Event Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="input input-bordered w-full"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                  <label className="label">
                    <span className="label-text">Event Description</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    placeholder="Enter description"
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                  <label className="label">
                    <span className="label-text">Event Banner</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => setImagePath(e.target.files as any)}
                    title="file"
                  />
                </div>
                <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                  <label className="label">
                    <span className="label-text">Event Price (USDT)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    className="input input-bordered w-full"
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                  <label className="label">
                    <span className="label-text">Event Deadline</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    onChange={(e) => toTimeStamp(e.target.value)}
                    title="time"
                  />
                </div>
              </div>
              <div className="hidden card-actions">
                <button className="btn w-full max-w-xs sm:max-w-md mx-auto md:max-w-2xl text-white bg-[#026937] hover:bg-[#026937]">
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "submit"
                  )}
                </button>
              </div>
            </div>
          </form>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>

      {/* Old Form using DaisyUI */}
      <div className="hidden card w-[95%] mx-auto bg-base-100 shadow-xl lg:shadow-2xl pt-4">
        <h3 className="uppercase text-xl text-center font-bold">
          Post your event
        </h3>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="md:grid md:grid-cols-2 gap-x-5 sm:justify-center">
              <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                <label className="label">
                  <span className="label-text">Event Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="input input-bordered w-full"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                <label className="label">
                  <span className="label-text">Event Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Enter description"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                <label className="label">
                  <span className="label-text">Event Banner</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setImagePath(e.target.files as any)}
                  title="file"
                />
              </div>
              <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                <label className="label">
                  <span className="label-text">Event Price (USDT)</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  className="input input-bordered w-full"
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                <label className="label">
                  <span className="label-text">Event Deadline</span>
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full"
                  onChange={(e) => toTimeStamp(e.target.value)}
                  title="time"
                />
              </div>
            </div>
            <div className="card-actions">
              <button className="btn w-full max-w-xs sm:max-w-md mx-auto md:max-w-2xl text-white bg-[#026937] hover:bg-[#026937]">
                {loading ? (
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

export default CreateEvent;
