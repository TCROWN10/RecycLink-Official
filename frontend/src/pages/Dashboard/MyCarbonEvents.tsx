import { formatDate } from "../../utils";
import { useEffect, useState } from "react";
import {
    useAccount,
    useWatchContractEvent,
    useReadContract,
} from "wagmi";
import {
    RC_MARKETPLACE_ADDRESS ,
    RCMARKETPLACEABI,
    EVENT_MARKETPLACE_ADDRESS,
    EVENTMARKETPLACEABI,
} from "../../constants";
import { formatEther } from "viem";
import { toast } from "sonner";

type Props = {};

const MyCarbonEvents = (props: Props) => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { address } = useAccount();

    const { isLoading, isError, isSuccess, data, error } = useReadContract({
        address: RC_MARKETPLACE_ADDRESS ,
        abi: RCMARKETPLACEABI,
        functionName: "getCompanyByUser",
        args: [address],
        // onError(data: any) {
        //   console.log(data);
        //   setLoading(false);
        // },
        // onSuccess(data: any) {
        //   setEvents(data);
        //   setLoading(false);
        // },
    });

    useWatchContractEvent({
        address: RC_MARKETPLACE_ADDRESS ,
        abi: RCMARKETPLACEABI,
        eventName: "ListingBought",
        onLogs(log) {
            console.log(log);
        },
    });

    useEffect(() => {
        if (isLoading) {
            setLoading(true);
        }
        else {
            setLoading(false);
        }
    }, [isLoading]);

    useEffect(() => {
        if (isError) {
            console.log(error);
            setLoading(false);
            // toast.error("Error occurred reading events");
        }
    }, [isError]);

    useEffect(() => {
        if (isSuccess) {
            setEvents(data as any[]);
            setLoading(false);
        }
    }, [isSuccess]);

    return (
        <div className="my-8 w-10/12">
            <div className="font-bold text-2xl">Transactions</div>
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="w-20 mx-auto">
                        <span className="loading loading-spinner w-full bg-[#026937]"></span>
                    </div>
                ) : (
                    <table className="table table-xs lg:table-md">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>ItemId</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Tokens Transferred</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((item, index) => (
                                <tr key={index}>
                                    <th>{formatDate(Number(item?.date))}</th>
                                    <td>{Number(item?.itemId)}</td>
                                    <td>{item?.itemName}</td>
                                    <td>{Number(item?.itemPrice)}</td>
                                    <td>{Number(item?.qty)}</td>
                                    <td>{Number(item?.amountOfTokensTransfered)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyCarbonEvents;
