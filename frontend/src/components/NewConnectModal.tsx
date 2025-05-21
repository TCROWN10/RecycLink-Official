import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@nextui-org/react";
import { LucideUserPlus2, LucideBuilding2 } from "lucide-react";
import { Link } from "react-router-dom";

function NewUserConnectModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button 
        onPress={onOpen}
        color="primary"
        className="bg-[#983279] hover:bg-[#983279]/90 text-white"
      >
        Signup
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          backdrop: "bg-gradient-to-t from-background to-background/10 backdrop-opacity-20",
          base: "bg-background text-foreground",
        }}
      >
        <ModalContent className="gap-y-2">
          {(onClose) => (
            <>
              <ModalHeader className="font-firaSans font-bold text-2xl flex flex-col gap-1 py-12 text-center">
                <span className="text-foreground/60">Welcome to</span>
                <span className="text-4xl leading-normal text-foreground">RecycLink</span>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-y-12">
                <div className="flex flex-row items-center gap-x-8">
                  <Card
                    as={Link}
                    to={"/register"}
                    isPressable
                    isHoverable
                    className="group py-18 hover:bg-[#983279]/10 transition cursor-pointer w-full place-items-center bg-background"
                  >
                    <div className="">
                      <CardBody className="items-center overflow-visible py-2">
                        <LucideUserPlus2
                          size={96}
                          className="group-hover:text-[#983279] group-hover:scale-90 transition text-foreground"
                        />
                      </CardBody>
                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                          <small className="text-default-500">12 Tracks</small> */}
                        <h4 className="font-bold text-large text-center text-foreground">
                          Signup as User
                        </h4>
                      </CardHeader>
                    </div>
                  </Card>

                  <Card
                    as={Link}
                    to="/dashboard/companyRegister"
                    isHoverable
                    isPressable
                    className="group py-18 hover:bg-[#983279]/10 transition cursor-pointer w-full place-items-center bg-background"
                  >
                    <div className="">
                      <CardBody className="items-center overflow-visible py-2">
                        <LucideBuilding2
                          size={96}
                          className="group-hover:text-[#983279] group-hover:scale-90 transition text-foreground"
                        />
                      </CardBody>
                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                          <small className="text-default-500">12 Tracks</small> */}
                        <h4 className="font-bold text-large text-center text-foreground">
                          Signup as Company
                        </h4>
                      </CardHeader>
                    </div>
                  </Card>
                </div>
                <p className="italic text-center text-sm text-foreground/60 py-4">
                  Select either of the above to create your profile
                </p>
              </ModalBody>
              {/* <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Action
                      </Button>
                    </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default NewUserConnectModal;
