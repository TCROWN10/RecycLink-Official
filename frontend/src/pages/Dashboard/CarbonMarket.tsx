import React, { useEffect, useState } from "react";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { formatUnits } from "viem";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { formatDate } from "../../utils";
import { RC_MARKETPLACE_ADDRESS , RCMARKETPLACEABI } from "../../constants";
import { Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react";
import { GiToken } from "react-icons/gi";

type Props = {};

const RecyclinkMarketplace = (props: Props) => {
  const [listings, setListings] = useState<any[]>([]);

  const { isLoading, isError, isSuccess, data, error } = useReadContract({
    address: RC_MARKETPLACE_ADDRESS ,
    abi: RCMARKETPLACEABI,
    functionName: "getAllActiveItemInfo",
  });
  useWatchContractEvent({
    address: RC_MARKETPLACE_ADDRESS ,
    abi: RCMARKETPLACEABI,
    eventName: "ListingCreated",
    onLogs(log) {
      console.log(log);
    },
  });

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
    if (isSuccess) {
      setListings(data as any);
    }
  }, [isError, isSuccess]);
  return (
    <div className="my-8 w-full">
      {!isLoading && listings.length == 0 && (
        <p className="text-lg font-semibold text-center">
          No Items Available To Purchase
        </p>
      )}
      <div className="flex flex-col gap-y-8 px-12">
        {
          // isLoading ? (
          //   <span className="loading loading-spinner loading-lg"></span>
          // ) : (
          listings.map((item, index) => {
            return (
              <>
                <Skeleton isLoaded={!isLoading} className="rounded-lg">
                  <Card
                    as={Link}
                    to={`credit/${item?.itemId}`}
                    isPressable
                    isHoverable
                    fullWidth
                    className="relative px-8 py-12 bg-base-300/80 hover:bg-base-300"
                  >
                    <CardHeader>
                      <div className="font-firaSans font-bold text-2xl text-left text-success px-4 leading-normal">
                        Available for Sale
                      </div>
                    </CardHeader>
                    <div className="absolute -top-0 right-8 text-base-200">
                      <GiToken className="text-[12rem]" />
                    </div>
                    <div className="absolute top-8 right-12 text-base-100">
                      <GiToken className="text-[12rem]" />
                    </div>
                    <CardBody className="flex flex-row justify-between">
                      <div className="flex flex-row gap-y-8">
                        <div className="relative self-end font-firaSans font-medium text-7xl leading-normal">
                          <span>Carbon</span>
                          <br />
                          <span className="text-8xl">Credits</span>
                        </div>
                      </div>
                      <div className="relative font-firaSans font-black text-[9rem] leading-snug">
                        {Number(item?.price)}
                      </div>
                    </CardBody>
                  </Card>
                </Skeleton>
                <Link
                  to={`credit/${item?.itemId}`}
                  key={index}
                  className="hidden w-full block"
                >
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">
                        {item?.description}
                        <div className="badge badge-secondary">NEW</div>
                      </h2>
                      <div className="card-actions justify-between items-center mt-3">
                        <p className="text-lg text-[#026937]">Available</p>
                        <h3 className="font-bold text-lg">
                          {Number(item?.price)} <span>USDT</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            );
          })
        }
      </div>
    </div>
  );
};

export default RecyclinkMarketplace;
