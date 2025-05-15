import React, { useEffect, useState } from "react";
import {
    useAccount,
    useBalance,
    useReadContract,
} from "wagmi";
import {
    RECYCLINK_ADDRESS,
    USD_TOKEN_ADDRESS,
    RECYCLINKABI,
} from "../constants";
import BrandOne from "../assets/images/brand/brand-01.svg";
import BrandTwo from "../assets/images/brand/brand-02.svg";
import BrandThree from "../assets/images/brand/brand-03.svg";
import BrandFour from "../assets/images/brand/brand-04.svg";
import BrandFive from "../assets/images/brand/brand-05.svg";
import { useWasteWiseContext } from "../context";
import { shortenAddress } from "../utils";

const TableThree = () => {
    const { address } = useAccount();
    const { currentUser } = useWasteWiseContext();
    const [leaderboard, setLeaderboard] = useState<boolean>(false);

    const { data, isSuccess } = useReadContract({
        address: RECYCLINK_ADDRESS,
        abi: RECYCLINKABI,
        functionName: "getVerifiers",
        account: address,
    });

    useEffect(() => {
        setLeaderboard(true);
    }, [isSuccess]);

    return (
        <section className="w-full py-6">
            <div className="w-full p-8 rounded-xl border border-base-300 my-2 dark:bg-base-300">
                <h4 className="mb-8 text-xl font-semibold text-base-content">
                    Verifiers
                </h4>
                <div className=""></div>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead className="bg-base-200 h-16">
                            <tr className="text-md">
                                <th>userId</th>
                                {/* <th>avatar</th> */}
                                <th>Name</th>
                                <th>address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            {(data as any[])?.map((eachUser) => (
                                <tr className="h-16" key={eachUser?.id}>
                                    {/* <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th> */}
                                    <th>{Number(eachUser.id)}</th>
                                    <td>
                                        <div>
                                            <div className="font-bold">{eachUser.name}</div>
                                        </div>
                                    </td>
                                    <td>{shortenAddress(eachUser.userAddr)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default TableThree;
