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
      <Button onPress={onOpen}>Signup</Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent className="gap-y-2">
          {(onClose) => (
            <>
              <ModalHeader className="font-firaSans font-bold text-2xl flex flex-col gap-1 py-12 text-center">
                <span className="text-default-600">Welcome to</span>
                <span className="text-4xl leading-normal">RecycLink</span>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-y-12">
                <div className="flex flex-row items-center gap-x-8">
                  <Card
                    as={Link}
                    to={"/register"}
                    isPressable
                    isHoverable
                    className="group py-18 hove:bg-green-600/60 transition cursor-pointer w-full place-items-center"
                  >
                    <div className="">
                      <CardBody className="items-center overflow-visible py-2">
                        <LucideUserPlus2
                          size={96}
                          className="group-hover:text-default-900 group-hover:scale-90 transition"
                        />
                      </CardBody>
                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                          <small className="text-default-500">12 Tracks</small> */}
                        <h4 className="font-bold text-large text-center">
                          Signup as User
                        </h4>
                      </CardHeader>
                    </div>
                  </Card>

                  <Card
                    as={Link}
                    to={"/company-register"}
                    isHoverable
                    isPressable
                    className="group py-18 hove:bg-green-600/60 transition cursor-pointer w-full place-items-center"
                  >
                    <div className="">
                      <CardBody className="items-center overflow-visible py-2">
                        <LucideBuilding2
                          size={96}
                          className="group-hover:text-default-900 group-hover:scale-90 transition"
                        />
                      </CardBody>
                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                          <small className="text-default-500">12 Tracks</small> */}
                        <h4 className="font-bold text-large text-center">
                          Signup as Company
                        </h4>
                      </CardHeader>
                    </div>
                  </Card>
                </div>
                <p className="italic text-center text-sm text-default-500 py-4">
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
