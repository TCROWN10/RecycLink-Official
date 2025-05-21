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
import { FaUsers, FaChartLine, FaCrown, FaUser, FaUserShield, FaRecycle } from "react-icons/fa";
import { Link } from "react-router-dom";

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

  const getRoleIcon = (role: string | undefined) => {
    if (!role || typeof role !== 'string') return null;
    
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case 'admin':
        return <FaUserShield className="w-4 h-4" />;
      case 'user':
        return <FaUser className="w-4 h-4" />;
      case 'recycler':
        return <FaRecycle className="w-4 h-4" />;
      default:
        return <FaUser className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string | undefined) => {
    if (!role || typeof role !== 'string') return 'text-blue-500';
    
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case 'admin':
        return 'text-yellow-500';
      case 'verifier':
        return 'text-[#983279]';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <Dropdown placement="bottom-end" className="w-60">
      <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: "https://api.dicebear.com/7.x/adventurer/svg?seed=Daisy",
            className: "bg-[#983279]"
            }}
            className="transition-transform"
          description={
            <div className="flex items-center gap-1">
              {getRoleIcon(currentUser?.role)}
              <span className={getRoleColor(currentUser?.role)}>
                {currentUser?.role || 'User'}
              </span>
            </div>
          }
          name={currentUser?.name || 'Anonymous'}
          />
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Profile Actions" 
        variant="flat"
        className="bg-background text-foreground"
      >
        <DropdownSection aria-label="Profile" showDivider>
          <DropdownItem key="address" className="h-14 gap-2 text-foreground">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{shortenAddress(address as string)}</p>
          </DropdownItem>
          <DropdownItem key="profile" className="h-14 gap-2 text-foreground">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{currentUser?.name || 'Anonymous'}</p>
            <div className="flex items-center gap-1">
              {getRoleIcon(currentUser?.role)}
              <span className={getRoleColor(currentUser?.role)}>
                {currentUser?.role || 'User'}
              </span>
            </div>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection
          aria-label="Profile"
          showDivider
          className="block lg:hidden"
        >
          <DropdownItem key="dashboard" href="/dashboard" className="text-foreground">
            <Button fullWidth className="font-semibold">
              Dashboard
            </Button>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection aria-label="Menu" key="menu" showDivider>
          <DropdownItem key="marketplace" href="/dashboard/marketplace" className="text-foreground">
            Marketplace
          </DropdownItem>
          <DropdownItem
            key="team_settings"
            startContent={<FaUsers className="text-[#983279]" />}
            href="/dashboard/team-settings"
            className="text-foreground"
          >
            Team Settings
          </DropdownItem>
          <DropdownItem
            key="analytics"
            startContent={<FaChartLine className="text-[#983279]" />}
            href="/dashboard/analytics"
            className="text-foreground"
          >
            Analytics
          </DropdownItem>
          <DropdownItem key="system" className="text-foreground">System</DropdownItem>
          <DropdownItem key="configurations" className="text-foreground">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback" className="text-foreground">Help & Feedback</DropdownItem>
        </DropdownSection>
        <DropdownSection key="Logout">
          <DropdownItem
            key="logout"
            color="danger"
            endContent={<LucidePower size={16} strokeWidth={4} />}
            onPress={handleDisconnect}
            className="text-danger"
          >
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
