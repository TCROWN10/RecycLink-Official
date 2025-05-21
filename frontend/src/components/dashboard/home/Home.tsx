import { useAccount } from "wagmi";
import CardFour from "../../CardFour";
import CardOne from "../../CardOne";
import CardThree from "../../CardThree";
import CardTwo from "../../CardTwo";
import ChartOne from "../../ChartOne";
import ChartThree from "../../ChartThree";
import ChartTwo from "../../ChartTwo";
import ChatCard from "../../ChatCard";
import MapOne from "../../MapOne";
import TableOne from "../../TableOne";
import TableUpdated from "../../TableOneUpdated";

import CardFour3 from "../../CardFour3";
import CardFour2 from "../../CardFour2";
import TableTwo from "../../TableTwo";
import TableThree from "../../TableThree";
import TableTwoUpdated from "../../TableTwoUpdated";
import TableOneUpdated from "../../TableOneUpdated";
import TableThreeUpdated from "../../TableThreeUpdated";
import ChartOneUpdated from "../../ChartOneUpdated";
import ChartTwoUpdated from "../../ChartTwoUpdated";
import Disbursement from "../../../pages/Dashboard/Disbursement";

type Props = {};

const Home = (props: Props) => {
  const { address } = useAccount();
  // const { data } = useContractRead({
  //   address: WASTEWISE_ADDRESS,
  //   abi: WasteWiseABI,
  //   functionName: "getUserTransactions",
  //   account: address,
  // });

  return (
    <section className="w-full px-4">
      <div className="flex flex-row items-center w-full gap-x-4 px-2 py-4">
        <div className="">
          <Disbursement />
        </div>
        <div className="flex-auto"></div>
      </div>

      <section className="w-full space-y-24">
        <div className="grid grid-cols-1 mx-auto w-full gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 lg:w-[95%]">
          <CardFour />
          <CardFour2 />
          <CardFour3 />
          <CardOne />
          <CardTwo />
          <CardThree />
        </div>

        <section className="w-full space-y-8">
          <div className="font-firaSans font-bold text-left text-4xl w-full px-12 mt-4 md:mt-6 2xl:mt-16">
            Charts
          </div>
          <div className="flex flex-col lg:flex-row items-baseline gap-4 md:gap-6 2xl:gap-7.5 h-full w-full lg:px-12">
            <div className="w-full lg:w-7/12">
              <ChartOneUpdated />
            </div>
            <div className="w-full lg:w-5/12">
              <ChartTwoUpdated />
            </div>
          </div>
        </section>

        <div className="hidden mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5 w-full lg:px-12 lg:py-8">
          <ChartOne />
          <ChartTwo />
          {/* <ChartThree /> */}
          {/* <MapOne /> */}
          <div className="col-span-12 w-full xl:col-span-12">
            {/* <TableOne /> */}
            {/* <TableTwo /> */}
            {/* <TableThree /> */}
          </div>
          {/* <ChatCard /> */}
        </div>

        <div className="flex flex-col gap-y-16 w-full lg:px-12">
          <TableOneUpdated />
          <TableTwoUpdated />
          <TableThreeUpdated />
        </div>
      </section>
    </section>
  );
};

export default Home;
