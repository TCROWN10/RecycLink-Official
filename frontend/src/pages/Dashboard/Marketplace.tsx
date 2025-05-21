import React, { useEffect, useState } from "react";
import { useWatchContractEvent, useContractRead, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { Link } from "react-router-dom";
// import Button from "../../components/Button";
import { formatDate } from "../../utils";
import {
  EVENT_MARKETPLACE_ADDRESS,
  EVENTMARKETPLACEABI,
} from "../../constants";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Skeleton,
} from "@nextui-org/react";

type Props = {};

const Marketplace = (props: Props) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { isError, isLoading, isSuccess, data, error } = useReadContract({
    address: EVENT_MARKETPLACE_ADDRESS,
    abi: EVENTMARKETPLACEABI,
    functionName: "getAllActiveItemInfo",
    // onError(data: any) {
    //   console.log(data);
    // },
    // onSuccess(data: any) {
    //   setListings(data);
    // },
  });

  console.log("Event Address:", data);

  useEffect(() => {
    setListings(data as any[]);
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
    // toast.error("Error occurred when Reading Marketplace data");
  }, [isError]);

  useWatchContractEvent({
    address: EVENT_MARKETPLACE_ADDRESS,
    abi: EVENTMARKETPLACEABI,
    eventName: "ListingCreated",
    onLogs(log: any) {
      console.log(log);
    },
  });
  return (
    <div className="w-full">
      <div className="font-bold text-3xl px-8 pb-8">Available Events</div>
      {!isLoading && listings?.length == 0 && (
        <p className="text-lg font-semibold text-center">
          No Items Available To Purchase
        </p>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-8">
        {
          // isLoading ? (
          //   <span className="loading loading-spinner loading-lg"></span>
          // ) : (
          listings?.length > 0
            ? listings?.map((item, index) => {
                return (
                  <Link to={`event/${item?.itemId}`} key={index}>
                    <Card
                      isFooterBlurred
                      radius="lg"
                      className="relative h-[440px] border-none"
                    >
                      <Image
                        isBlurred
                        isZoomed
                        alt="Woman listing to music"
                        className="object-cover w-full h-80"
                        src={item?.image}
                        width={"100%"}
                        // height={200}
                      />
                      <CardFooter className="flex flex-row justify-between items-start gap-y-2 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large top-[278px] w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                        <div className="font-firaSans font-bold text-lg w-full">
                          {formatUnits(item?.price, 18)} USDT
                        </div>
                        <Chip color="danger">NEW</Chip>
                      </CardFooter>
                      <CardHeader className="font-firaSans font-bold text-xl">
                        {item?.name}
                      </CardHeader>
                      <CardBody>{item?.description}</CardBody>
                    </Card>

                    <div className="hidden card w-80 sm:w-[28rem] md:w-80 bg-base-100 shadow-xl">
                      <figure>
                        <img src={item?.image} alt="Shoes" />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">
                          {item?.name}
                          <div className="badge badge-secondary">NEW</div>
                        </h2>
                        <p>{item?.description}</p>
                        <p>Ends: {formatDate(Number(item?.deadline))}</p>
                        <div className="card-actions justify-between items-center mt-3">
                          <p className="text-lg text-[#026937]">Available</p>
                          <h3 className="font-bold text-lg">
                            {formatUnits(item?.price, 18)} <span>USDT</span>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            : Array.from({ length: 4 }).map((_) => (
                <Card className="space-y-5" radius="lg">
                  <Skeleton className="rounded-lg">
                    <div className="h-80 rounded-lg bg-default-300"></div>
                  </Skeleton>
                  <div className="space-y-3 p-4">
                    <Skeleton className="w-3/5 rounded-lg">
                      <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-4/5 rounded-lg">
                      <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg">
                      <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                  </div>
                </Card>
              ))
          // )
        }
      </div>
    </div>
  );
};

export default Marketplace;
