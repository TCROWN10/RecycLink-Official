import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { LucidePower } from "lucide-react";
import { shortenAddress, capitalize, roleMap } from "../utils";
import { useAccount, useDisconnect } from "wagmi";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown({
  isRegistered,
  currentUser,
}: {
  isRegistered: boolean;
  currentUser: any;
}) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnect();
    if (location.pathname !== "/") {
      setTimeout(() => {
        navigate("/");
      }, 400);
    }
  };

  return (
    <Dropdown placement="bottom-end" className="w-60">
      <DropdownTrigger>
        {isRegistered ? (
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: "https://api.dicebear.com/7.x/adventurer/svg?seed=Daisy",
              color: isRegistered ? "success" : "default",
            }}
            className="transition-transform"
            name={currentUser?.name}
            description={shortenAddress(currentUser?.userAddr)}
          />
        ) : (
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            src=""
          />
        )}
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownSection aria-label="Profile" showDivider>
          <DropdownItem key="address" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{shortenAddress(address as string)}</p>
          </DropdownItem>
          {/* Let's get started */}
          <DropdownItem
            key="profile"
            endContent={
              <Chip color="success" variant="flat">
                {currentUser?.role !== undefined &&
                  capitalize(
                    roleMap[currentUser?.role as keyof typeof roleMap]
                  )}
              </Chip>
            }
            href="/dashboard/profile"
          >
            Profile
          </DropdownItem>
        </DropdownSection>
        <DropdownSection
          aria-label="Profile"
          showDivider
          className="block lg:hidden"
        >
          <DropdownItem key="dashboard" href="/dashboard">
            <Button fullWidth className="font-semibold">
              Dashboard
            </Button>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection aria-label="Menu" key="menu" showDivider>
          <DropdownItem key="marketplace" href="/dashboard/marketplace">
            Marketplace
          </DropdownItem>
          <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics" href="/dashboard">
            Analytics
          </DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        </DropdownSection>
        <DropdownSection key="Logout">
          <DropdownItem
            key="logout"
            color="danger"
            endContent={<LucidePower size={16} strokeWidth={4} />}
            onPress={handleDisconnect}
          >
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
